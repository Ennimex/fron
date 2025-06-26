import { useState, useCallback, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaUserTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
  FaSort,
  FaUserShield,
  FaUser,
  FaUsers,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import adminStyles from "../../styles/stylesAdmin";

const UsersAdminView = ({ sidebarCollapsed = false }) => {
  const { user } = useAuth();

  // Mapeo de estilos globales (similar a GestionProductos)
  const styles = {
    pageContainer: adminStyles.containers.page,
    mainContainer: adminStyles.containers.main,
    header: adminStyles.headerStyles.headerSimple,
    title: adminStyles.headerStyles.titleDark,
    subtitle: adminStyles.headerStyles.subtitleDark,
    content: adminStyles.containers.content,
    tableContainer: adminStyles.tables.container,
    table: adminStyles.tables.table,
    tableHeader: adminStyles.tables.header,
    tableHeaderCell: adminStyles.tables.headerCell,
    tableRow: adminStyles.tables.row,
    tableCell: adminStyles.tables.cell,
    actionsContainer: adminStyles.tables.actionsContainer,
    actionButton: adminStyles.buttons.actionButton,
    editAction: adminStyles.buttons.editAction,
    deleteAction: adminStyles.buttons.deleteAction,
    badge: adminStyles.badgeStyles.base,
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    emptyStateSubtext: adminStyles.containers.emptyStateSubtext,
  };

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [selectedUsers, setSelectedUsers] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Error al cargar los usuarios");
        }

        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user?.token]);

  // Filter and sort users
  const processedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const matchesSearch =
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.phone && user.phone.includes(searchTerm));
      const matchesRole = selectedRole === "all" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });

    filtered.sort((a, b) => {
      let aValue = a[sortField] ?? "";
      let bValue = b[sortField] ?? "";

      if (sortField === "createdAt") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      return sortDirection === "asc"
        ? aValue < bValue
          ? -1
          : aValue > bValue
          ? 1
          : 0
        : aValue > bValue
        ? -1
        : aValue < bValue
        ? 1
        : 0;
    });

    return filtered;
  }, [users, searchTerm, selectedRole, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = processedUsers.slice(startIndex, startIndex + usersPerPage);

  // Handle sorting
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al eliminar el usuario");
        }

        setUsers(users.filter((user) => user._id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
        setSelectedUsers(new Set([...selectedUsers].filter((id) => id !== userId)));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Handle user edit
  const handleEditUser = (userId) => {
    const userToEdit = users.find((u) => u._id === userId);
    if (!userToEdit) return;

    setEditingUserId(userId);
    setFormData({
      name: userToEdit.name || "",
      email: userToEdit.email || "",
      phone: userToEdit.phone || "",
      password: "",
      role: userToEdit.role || "user",
    });
    setShowEditForm(true);
  };

  // Handle edit form submission
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    const updateData = { ...formData };
    if (!updateData.password) delete updateData.password;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${editingUserId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al actualizar el usuario");
      }

      const updatedUsers = users.map((user) =>
        user._id === editingUserId ? { ...user, ...data.data } : user
      );
      setUsers(updatedUsers);

      setFormSuccess("Usuario actualizado con éxito");
      setTimeout(() => {
        setShowEditForm(false);
        setEditingUserId(null);
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle new user form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al crear el usuario");
      }

      setUsers([...users, data.data]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });

      setFormSuccess("Usuario creado con éxito");
      setTimeout(() => {
        setShowUserForm(false);
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError(error.message);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Handle user selection
  const handleSelectUser = useCallback(
    (userId) => {
      const newSelected = new Set(selectedUsers);
      if (newSelected.has(userId)) {
        newSelected.delete(userId);
      } else {
        newSelected.add(userId);
      }
      setSelectedUsers(newSelected);
    },
    [selectedUsers]
  );

  const handleSelectAll = useCallback(() => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set());
    } else {
      setSelectedUsers(new Set(paginatedUsers.map((user) => user._id)));
    }
  }, [selectedUsers.size, paginatedUsers]);

  // Render sort icon
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort size={12} style={{ opacity: 0.5 }} />;
    return sortDirection === "asc" ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  // Render role badge
  const renderRoleBadge = (role) => {
    const roleLabels = {
      admin: "Administrador",
      user: "Usuario",
    };

    const roleIcons = {
      admin: <FaUserShield size={12} />,
      user: <FaUser size={12} />,
    };

    return (
      <span
        style={adminStyles.combineStyles(
          styles.badge,
          role === "admin" ? adminStyles.badgeStyles.roleAdmin : adminStyles.badgeStyles.roleUser
        )}
      >
        {roleIcons[role]}
        {roleLabels[role]}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Handle loading state
  if (loading) {
    return (
      <div style={adminStyles.combineStyles(styles.pageContainer, adminStyles.loadingStyles.container)}>
        <div style={adminStyles.utilities.textCenter}>
          <h3>Cargando usuarios...</h3>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div style={adminStyles.containers.errorContainer}>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={adminStyles.combineStyles(adminStyles.buttons.base, adminStyles.buttons.danger)}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const noUsers = processedUsers.length === 0;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContainer}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <FaUsers style={{ marginRight: adminStyles.spacing.md }} />
              Gestión de Usuarios
            </h1>
            <p style={styles.subtitle}>Administra y supervisa todos los usuarios del sistema</p>
          </div>
        </div>

        <div style={styles.content}>
          <div style={adminStyles.searchStyles.toolbar}>
            <div style={adminStyles.searchStyles.searchWrapper}>
              <FaSearch style={adminStyles.searchStyles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={adminStyles.searchStyles.searchInput}
              />
            </div>
            <div style={adminStyles.searchStyles.buttonGroup}>
              <button
                style={adminStyles.combineStyles(
                  adminStyles.buttons.base,
                  adminStyles.buttons.ghost,
                  showFilters ? adminStyles.buttons.outline : {}
                )}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter size={14} />
                Filtros
              </button>
              <button
                style={adminStyles.combineStyles(adminStyles.buttons.base, adminStyles.buttons.primary)}
                onClick={() => setShowUserForm(true)}
              >
                <FaPlus size={14} />
                Nuevo Usuario
              </button>
            </div>
          </div>

          {showFilters && (
            <div style={adminStyles.searchStyles.filtersContainer}>
              <div style={adminStyles.searchStyles.filtersGrid}>
                <div style={adminStyles.searchStyles.filterGroup}>
                  <label style={adminStyles.forms.label}>Rol</label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={adminStyles.forms.select}
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>
                <div style={adminStyles.combineStyles(adminStyles.searchStyles.filterGroup, adminStyles.utilities.flexEnd)}>
                  <button
                    style={adminStyles.combineStyles(adminStyles.buttons.base, adminStyles.buttons.ghost)}
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedRole("all");
                      setCurrentPage(1);
                    }}
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={styles.tableContainer}>
            {selectedUsers.size > 0 && (
              <div style={adminStyles.bulkActionStyles.container}>
                <span style={adminStyles.bulkActionStyles.text}>{selectedUsers.size} usuario(s) seleccionado(s)</span>
                <div style={adminStyles.bulkActionStyles.buttons}>
                  <button style={adminStyles.bulkActionStyles.button} disabled={true}>
                    <FaUserCheck size={12} style={{ marginRight: adminStyles.spacing.xs }} />
                    Activar
                  </button>
                  <button style={adminStyles.bulkActionStyles.button} disabled={true}>
                    <FaUserTimes size={12} style={{ marginRight: adminStyles.spacing.xs }} />
                    Suspender
                  </button>
                  <button style={adminStyles.bulkActionStyles.button} disabled={true}>
                    <FaTrash size={12} style={{ marginRight: adminStyles.spacing.xs }} />
                    Eliminar
                  </button>
                </div>
              </div>
            )}

            <div style={adminStyles.tables.responsiveContainer}>
              {noUsers ? (
                <div style={styles.emptyState}>
                  <FaUsers size={40} style={{ opacity: 0.3, marginBottom: adminStyles.spacing.lg }} />
                  <h3 style={styles.emptyStateText}>No se encontraron usuarios</h3>
                  <p style={styles.emptyStateSubtext}>
                    Intenta ajustar los filtros de búsqueda o añade nuevos usuarios.
                  </p>
                </div>
              ) : (
                <table style={styles.table}>
                  <thead style={styles.tableHeader}>
                    <tr>
                      <th style={styles.tableHeaderCell}>
                        <input
                          type="checkbox"
                          style={adminStyles.forms.checkbox}
                          checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={handleSelectAll}
                          aria-label="Seleccionar todos los usuarios"
                        />
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("name")}>
                        <div style={adminStyles.utilities.flexCenter}>
                          Nombre
                          {renderSortIcon("name")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("email")}>
                        <div style={adminStyles.utilities.flexCenter}>Email</div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("phone")}>
                        <div style={adminStyles.utilities.flexCenter}>
                          Teléfono
                          {renderSortIcon("phone")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("role")}>
                        <div style={adminStyles.utilities.flexCenter}>
                          Rol
                          {renderSortIcon("role")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("createdAt")}>
                        <div style={adminStyles.utilities.flexCenter}>
                          Fecha de Registro
                          {renderSortIcon("createdAt")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        style={adminStyles.combineStyles(
                          styles.tableRow,
                          hoveredRow === index ? adminStyles.tables.rowHover : {},
                          index === paginatedUsers.length - 1 ? adminStyles.tables.rowNoBorder : {}
                        )}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={styles.tableCell}>
                          <input
                            type="checkbox"
                            style={adminStyles.forms.checkbox}
                            checked={selectedUsers.has(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            aria-label={`Seleccionar usuario ${user.name || "Sin nombre"}`}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <div style={adminStyles.tables.userInfo}>
                            <div style={adminStyles.tables.avatar}>{user.name ? user.name[0].toUpperCase() : "-"}</div>
                            <div>
                              <div style={adminStyles.tables.userName}>{user.name || "Sin nombre"}</div>
                              <div style={adminStyles.tables.userEmail}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={styles.tableCell}>{user.email}</td>
                        <td style={styles.tableCell}>{user.phone || "-"}</td>
                        <td style={styles.tableCell}>{renderRoleBadge(user.role)}</td>
                        <td style={styles.tableCell}>{formatDate(user.createdAt)}</td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionsContainer}>
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.editAction,
                              }}
                              onClick={() => handleEditUser(user._id)}
                              title="Editar usuario"
                              aria-label={`Editar usuario ${user.name || "Sin nombre"}`}
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.deleteAction,
                              }}
                              onClick={() => handleDeleteUser(user._id)}
                              title="Eliminar usuario"
                              aria-label={`Eliminar usuario ${user.name || "Sin nombre"}`}
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {!noUsers && (
              <div style={adminStyles.paginationStyles.container}>
                <div style={adminStyles.paginationStyles.info}>
                  Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, processedUsers.length)} de{" "}
                  {processedUsers.length} usuarios
                </div>
                <div style={adminStyles.paginationStyles.buttons}>
                  <button
                    style={adminStyles.combineStyles(
                      adminStyles.paginationStyles.button,
                      currentPage === 1 ? adminStyles.paginationStyles.buttonDisabled : {}
                    )}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      style={adminStyles.combineStyles(
                        adminStyles.paginationStyles.button,
                        page === currentPage ? adminStyles.paginationStyles.buttonActive : {}
                      )}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Página ${page}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    style={adminStyles.combineStyles(
                      adminStyles.paginationStyles.button,
                      currentPage === totalPages ? adminStyles.paginationStyles.buttonDisabled : {}
                    )}
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Página siguiente"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New User Form Modal */}
        {showUserForm && (
          <div style={adminStyles.modalStyles.overlay}>
            <div style={adminStyles.modalStyles.content}>
              <button
                onClick={() => setShowUserForm(false)}
                style={adminStyles.modalStyles.closeButton}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
              <h2 style={adminStyles.modalStyles.title}>Agregar Nuevo Usuario</h2>
              {formError && (
                <div style={adminStyles.messageStyles.error}>{formError}</div>
              )}
              {formSuccess && (
                <div style={adminStyles.messageStyles.success}>{formSuccess}</div>
              )}
              <form onSubmit={handleFormSubmit} style={adminStyles.forms.formGroup}>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="name">
                    Nombre <span style={adminStyles.forms.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="email">
                    Correo Electrónico <span style={adminStyles.forms.requiredField}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="phone">Teléfono</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="password">
                    Contraseña <span style={adminStyles.forms.requiredField}>*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="role">Rol</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    style={adminStyles.forms.select}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div style={adminStyles.modalStyles.actions}>
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    style={adminStyles.combineStyles(adminStyles.buttons.base, adminStyles.buttons.outline)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={adminStyles.combineStyles(
                      adminStyles.buttons.base,
                      adminStyles.buttons.primary,
                      formLoading ? adminStyles.buttons.disabled : {}
                    )}
                  >
                    {formLoading ? "Guardando..." : "Guardar Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Form Modal */}
        {showEditForm && (
          <div style={adminStyles.modalStyles.overlay}>
            <div style={adminStyles.modalStyles.content}>
              <button
                onClick={() => setShowEditForm(false)}
                style={adminStyles.modalStyles.closeButton}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
              <h2 style={adminStyles.modalStyles.title}>Editar Usuario</h2>
              {formError && (
                <div style={adminStyles.messageStyles.error}>{formError}</div>
              )}
              {formSuccess && (
                <div style={adminStyles.messageStyles.success}>{formSuccess}</div>
              )}
              <form onSubmit={handleEditFormSubmit} style={adminStyles.forms.formGroup}>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="name">
                    Nombre <span style={adminStyles.forms.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="email">
                    Correo Electrónico <span style={adminStyles.forms.requiredField}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="phone">Teléfono</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    style={adminStyles.forms.input}
                  />
                </div>
                <div style={adminStyles.forms.formGroup}>
                  <label style={adminStyles.forms.label} htmlFor="role">Rol</label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    style={adminStyles.forms.select}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div style={adminStyles.modalStyles.actions}>
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    style={adminStyles.combineStyles(adminStyles.buttons.base, adminStyles.buttons.outline)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={adminStyles.combineStyles(
                      adminStyles.buttons.base,
                      adminStyles.buttons.primary,
                      formLoading ? adminStyles.buttons.disabled : {}
                    )}
                  >
                    {formLoading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersAdminView;