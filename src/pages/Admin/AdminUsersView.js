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
import { adminAPI } from "../../services/api";
import stylesPublic from "../../styles/stylesGlobal"; // Import global styles

const UsersAdminView = ({ sidebarCollapsed = false }) => {
  const { user } = useAuth();

  // Updated styles object using stylesPublic
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: stylesPublic.colors.surface.primary,
      padding: stylesPublic.spacing.scale[8],
    },
    mainContainer: {
      ...stylesPublic.components.card.base,
      maxWidth: stylesPublic.utils.container.maxWidth.xl,
      margin: stylesPublic.spacing.margins.auto,
      padding: stylesPublic.spacing.scale[8],
    },
    header: {
      marginBottom: stylesPublic.spacing.scale[8],
      borderBottom: `${stylesPublic.borders.width[1]} solid ${stylesPublic.borders.colors.default}`,
      paddingBottom: stylesPublic.spacing.scale[4],
    },
    title: {
      ...stylesPublic.typography.headings.h1,
      display: "flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[2],
    },
    subtitle: {
      ...stylesPublic.typography.body.small,
      marginTop: stylesPublic.spacing.scale[2],
    },
    content: {
      padding: stylesPublic.spacing.scale[8],
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.base,
      backgroundColor: stylesPublic.colors.surface.primary,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: stylesPublic.colors.surface.secondary,
    },
    tableHeaderCell: {
      padding: stylesPublic.spacing.scale[3],
      textAlign: "left",
      fontSize: stylesPublic.typography.scale.sm,
      fontWeight: stylesPublic.typography.weights.semibold,
      color: stylesPublic.colors.text.secondary,
      borderBottom: `${stylesPublic.borders.width[1]} solid ${stylesPublic.borders.colors.default}`,
      cursor: "pointer",
    },
    tableRow: {
      transition: "all 0.2s ease",
    },
    tableCell: {
      padding: stylesPublic.spacing.scale[3],
      fontSize: stylesPublic.typography.scale.sm,
      color: stylesPublic.colors.text.primary,
      borderBottom: `${stylesPublic.borders.width[1]} solid ${stylesPublic.borders.colors.muted}`,
    },
    actionsContainer: {
      display: "flex",
      gap: stylesPublic.spacing.gaps.xs,
      justifyContent: "flex-end",
    },
    actionButton: {
      ...stylesPublic.components.button.variants.ghost,
      ...stylesPublic.components.button.sizes.xs,
      padding: stylesPublic.spacing.scale[2],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    editAction: {
      color: stylesPublic.colors.secondary[500],
    },
    deleteAction: {
      color: stylesPublic.colors.primary[500],
    },
    badge: {
      display: "inline-flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[1],
      padding: `${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[2]}`,
      fontSize: stylesPublic.typography.scale.xs,
      fontWeight: stylesPublic.typography.weights.semibold,
      borderRadius: stylesPublic.borders.radius.sm,
      backgroundColor: stylesPublic.colors.neutral[100],
      color: stylesPublic.colors.text.primary,
    },
    emptyState: {
      textAlign: "center",
      padding: stylesPublic.spacing.scale[12],
      backgroundColor: stylesPublic.colors.surface.secondary,
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.base,
    },
    emptyStateText: {
      ...stylesPublic.typography.headings.h3,
      marginBottom: stylesPublic.spacing.scale[2],
    },
    emptyStateSubtext: {
      ...stylesPublic.typography.body.small,
    },
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
  // TODO: Could extract API fetching logic to a custom hook (e.g., useUsers)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminAPI.getUsers();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        setError(error?.error || error?.message || "Error al cargar los usuarios");
      } finally {
        setLoading(false);
      }
    };

    if (user?.token) {
      fetchUsers();
    }
  }, [user?.token]);

  // Filter and sort users
  // TODO: Could move filtering and sorting logic to a custom hook (e.g., useUserFilters)
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
  // TODO: Could extract pagination logic to a separate Pagination component
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
        const response = await adminAPI.deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
        setSelectedUsers(new Set([...selectedUsers].filter((id) => id !== userId)));
        
        // Opcional: mostrar mensaje de éxito
        console.log(response.message || "Usuario eliminado exitosamente");
      } catch (error) {
        setError(error?.error || error?.message || "Error al eliminar el usuario");
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
  // TODO: Could extract form submission logic to a reusable UserForm component
  const handleEditFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    const updateData = { ...formData };
    if (!updateData.password) delete updateData.password;

    try {
      const response = await adminAPI.updateUser(editingUserId, updateData);

      // El backend devuelve { success: true, data: user, message: '...' }
      const updatedUser = response.data || response;
      const updatedUsers = users.map((user) =>
        user._id === editingUserId ? { ...user, ...updatedUser } : user
      );
      setUsers(updatedUsers);

      setFormSuccess(response.message || "Usuario actualizado con éxito");
      setTimeout(() => {
        setShowEditForm(false);
        setEditingUserId(null);
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError(error?.error || error?.message || "Error al actualizar el usuario");
    } finally {
      setFormLoading(false);
    }
  };

  // Handle new user form submission
  // TODO: Could reuse the same UserForm component for both create and edit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");
    setFormLoading(true);

    try {
      const response = await adminAPI.createUser(formData);

      // El backend devuelve { success: true, data: user, message: '...' }
      const newUser = response.data || response;
      setUsers([...users, newUser]);
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
      });

      setFormSuccess(response.message || "Usuario creado con éxito");
      setTimeout(() => {
        setShowUserForm(false);
        setFormSuccess("");
      }, 2000);
    } catch (error) {
      setFormError(error?.error || error?.message || "Error al crear el usuario");
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
  // TODO: Could extract selection logic to a BulkActions component
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
  // TODO: Could move to a utilities file
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort size={12} style={{ opacity: 0.5 }} />;
    return sortDirection === "asc" ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  // Render role badge
  // TODO: Could move to a utilities file or a RoleBadge component
  const renderRoleBadge = (role) => {
    const roleLabels = {
      admin: "Administrador",
      user: "Usuario",
    };

    const roleIcons = {
      admin: <FaUserShield size={12} />,
      user: <FaUser size={12} />,
    };

    const badgeStyles = {
      admin: {
        backgroundColor: stylesPublic.colors.primary[50],
        color: stylesPublic.colors.primary[500],
        border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.primary[500]}`,
      },
      user: {
        backgroundColor: stylesPublic.colors.secondary[50],
        color: stylesPublic.colors.secondary[500],
        border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.secondary[500]}`,
      },
    };

    return (
      <span style={{ ...styles.badge, ...badgeStyles[role] }}>
        {roleIcons[role]}
        {roleLabels[role]}
      </span>
    );
  };

  // Format date
  // TODO: Could move to a utilities file
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
      <div style={styles.pageContainer}>
        <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[8] }}>
          <h3 style={stylesPublic.typography.headings.h3}>Cargando usuarios...</h3>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div
          style={{
            textAlign: "center",
            padding: stylesPublic.spacing.scale[8],
            backgroundColor: stylesPublic.colors.semantic.error.light,
            borderRadius: stylesPublic.borders.radius.md,
          }}
        >
          <h3 style={stylesPublic.typography.headings.h3}>Error</h3>
          <p style={stylesPublic.typography.body.base}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.base,
            }}
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
              <FaUsers style={{ marginRight: stylesPublic.spacing.scale[2] }} />
              Gestión de Usuarios
            </h1>
            <p style={styles.subtitle}>Administra y supervisa todos los usuarios del sistema</p>
          </div>
        </div>

        <div style={styles.content}>
          {/* TODO: Could extract to a UserSearchFilter component */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: stylesPublic.spacing.scale[6],
              flexWrap: "wrap",
              gap: stylesPublic.spacing.gaps.md,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                position: "relative",
                flex: 1,
                minWidth: "200px",
                maxWidth: "600px",
              }}
            >
              <FaSearch
                style={{
                  position: "absolute",
                  left: stylesPublic.spacing.scale[3],
                  color: stylesPublic.colors.text.secondary,
                }}
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  ...stylesPublic.components.input.base,
                  paddingLeft: stylesPublic.spacing.scale[10],
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                gap: stylesPublic.spacing.gaps.sm,
              }}
            >
              <button
                style={{
                  ...stylesPublic.components.button.variants.ghost,
                  ...stylesPublic.components.button.sizes.sm,
                  ...(showFilters ? { border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.borders.accent}` } : {}),
                }}
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter size={14} />
                Filtros
              </button>
              <button
                style={{
                  ...stylesPublic.components.button.variants.primary,
                  ...stylesPublic.components.button.sizes.sm,
                  display: "flex",
                  alignItems: "center",
                  gap: stylesPublic.spacing.scale[2],
                }}
                onClick={() => setShowUserForm(true)}
              >
                <FaPlus size={14} />
                Nuevo Usuario
              </button>
            </div>
          </div>

          {showFilters && (
            <div
              style={{
                marginBottom: stylesPublic.spacing.scale[6],
                padding: stylesPublic.spacing.scale[4],
                backgroundColor: stylesPublic.colors.surface.secondary,
                borderRadius: stylesPublic.borders.radius.md,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: stylesPublic.spacing.gaps.lg,
                }}
              >
                <div>
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                      marginBottom: stylesPublic.spacing.scale[2],
                    }}
                  >
                    Rol
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    style={stylesPublic.components.input.base}
                  >
                    <option value="all">Todos los roles</option>
                    <option value="admin">Administrador</option>
                    <option value="user">Usuario</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                  }}
                >
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.sm,
                    }}
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
            {/* TODO: Could extract to a BulkActions component */}
            {selectedUsers.size > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: stylesPublic.spacing.scale[4],
                  backgroundColor: stylesPublic.colors.neutral[50],
                  borderBottom: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.borders.default}`,
                }}
              >
                <span
                  style={{
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.text.secondary,
                  }}
                >
                  {selectedUsers.size} usuario(s) seleccionado(s)
                </span>
                <div
                  style={{
                    display: "flex",
                    gap: stylesPublic.spacing.gaps.sm,
                  }}
                >
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.sm,
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }}
                    disabled={true}
                  >
                    <FaUserCheck size={12} style={{ marginRight: stylesPublic.spacing.scale[1] }} />
                    Activar
                  </button>
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.sm,
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }}
                    disabled={true}
                  >
                    <FaUserTimes size={12} style={{ marginRight: stylesPublic.spacing.scale[1] }} />
                    Suspender
                  </button>
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.sm,
                      opacity: 0.5,
                      cursor: "not-allowed",
                    }}
                    disabled={true}
                  >
                    <FaTrash size={12} style={{ marginRight: stylesPublic.spacing.scale[1] }} />
                    Eliminar
                  </button>
                </div>
              </div>
            )}

            {/* TODO: Could extract to a UsersTable component */}
            <div style={{ overflowX: "auto" }}>
              {noUsers ? (
                <div style={styles.emptyState}>
                  <FaUsers size={40} style={{ opacity: 0.3, marginBottom: stylesPublic.spacing.scale[4] }} />
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
                          style={{
                            width: stylesPublic.spacing.scale[4],
                            height: stylesPublic.spacing.scale[4],
                            accentColor: stylesPublic.colors.primary[500],
                          }}
                          checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                          onChange={handleSelectAll}
                          aria-label="Seleccionar todos los usuarios"
                        />
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("name")}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: stylesPublic.spacing.scale[2],
                          }}
                        >
                          Nombre
                          {renderSortIcon("name")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("email")}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: stylesPublic.spacing.scale[2],
                          }}
                        >
                          Email
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("phone")}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: stylesPublic.spacing.scale[2],
                          }}
                        >
                          Teléfono
                          {renderSortIcon("phone")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("role")}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: stylesPublic.spacing.scale[2],
                          }}
                        >
                          Rol
                          {renderSortIcon("role")}
                        </div>
                      </th>
                      <th style={styles.tableHeaderCell} onClick={() => handleSort("createdAt")}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: stylesPublic.spacing.scale[2],
                          }}
                        >
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
                        style={{
                          ...styles.tableRow,
                          ...(hoveredRow === index ? { backgroundColor: stylesPublic.colors.neutral[50] } : {}),
                          ...(index === paginatedUsers.length - 1 ? { borderBottom: "none" } : {}),
                        }}
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                      >
                        <td style={styles.tableCell}>
                          <input
                            type="checkbox"
                            style={{
                              width: stylesPublic.spacing.scale[4],
                              height: stylesPublic.spacing.scale[4],
                              accentColor: stylesPublic.colors.primary[500],
                            }}
                            checked={selectedUsers.has(user._id)}
                            onChange={() => handleSelectUser(user._id)}
                            aria-label={`Seleccionar usuario ${user.name || "Sin nombre"}`}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: stylesPublic.spacing.scale[2],
                            }}
                          >
                            <div
                              style={{
                                width: stylesPublic.spacing.scale[8],
                                height: stylesPublic.spacing.scale[8],
                                borderRadius: stylesPublic.borders.radius.full,
                                backgroundColor: stylesPublic.colors.primary[50],
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: stylesPublic.typography.scale.sm,
                                fontWeight: stylesPublic.typography.weights.semibold,
                                color: stylesPublic.colors.primary[500],
                              }}
                            >
                              {user.name ? user.name[0].toUpperCase() : "-"}
                            </div>
                            <div>
                              <div
                                style={{
                                  fontWeight: stylesPublic.typography.weights.semibold,
                                  color: stylesPublic.colors.text.primary,
                                }}
                              >
                                {user.name || "Sin nombre"}
                              </div>
                              <div
                                style={{
                                  ...stylesPublic.typography.body.small,
                                  color: stylesPublic.colors.text.secondary,
                                }}
                              >
                                {user.email}
                              </div>
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
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: stylesPublic.spacing.scale[4],
                  flexWrap: "wrap",
                  gap: stylesPublic.spacing.gaps.md,
                }}
              >
                <div
                  style={{
                    ...stylesPublic.typography.body.small,
                    color: stylesPublic.colors.text.secondary,
                  }}
                >
                  Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, processedUsers.length)} de{" "}
                  {processedUsers.length} usuarios
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: stylesPublic.spacing.gaps.xs,
                  }}
                >
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.xs,
                      ...(currentPage === 1 ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                    }}
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      style={{
                        ...stylesPublic.components.button.variants.ghost,
                        ...stylesPublic.components.button.sizes.xs,
                        ...(page === currentPage
                          ? {
                              backgroundColor: stylesPublic.colors.primary[500],
                              color: stylesPublic.colors.primary.contrast,
                              boxShadow: stylesPublic.shadows.base,
                            }
                          : {}),
                      }}
                      onClick={() => setCurrentPage(page)}
                      aria-label={`Página ${page}`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.xs,
                      ...(currentPage === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                    }}
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
        {/* TODO: Could extract to a reusable UserForm component */}
        {showUserForm && (
          <div style={stylesPublic.utils.overlay.base}>
            <div
              style={{
                ...stylesPublic.components.card.base,
                maxWidth: "600px",
                width: "90%",
                margin: stylesPublic.spacing.margins.auto,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => setShowUserForm(false)}
                style={{
                  position: "absolute",
                  top: stylesPublic.spacing.scale[2],
                  right: stylesPublic.spacing.scale[2],
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: stylesPublic.typography.scale.lg,
                  color: stylesPublic.colors.text.secondary,
                  cursor: "pointer",
                  padding: stylesPublic.spacing.scale[2],
                  borderRadius: stylesPublic.borders.radius.sm,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: stylesPublic.colors.neutral[50],
                  },
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
              <h2 style={{ ...stylesPublic.typography.headings.h2, padding: stylesPublic.spacing.scale[4] }}>
                Agregar Nuevo Usuario
              </h2>
              {formError && (
                <div
                  style={{
                    backgroundColor: stylesPublic.colors.semantic.error.light,
                    color: stylesPublic.colors.semantic.error.main,
                    padding: stylesPublic.spacing.scale[4],
                    borderRadius: stylesPublic.borders.radius.md,
                    margin: stylesPublic.spacing.scale[4],
                    textAlign: "center",
                  }}
                >
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div
                  style={{
                    backgroundColor: stylesPublic.colors.semantic.success.light,
                    color: stylesPublic.colors.semantic.success.main,
                    padding: stylesPublic.spacing.scale[4],
                    borderRadius: stylesPublic.borders.radius.md,
                    margin: stylesPublic.spacing.scale[4],
                    display: "flex",
                    alignItems: "center",
                    gap: stylesPublic.spacing.scale[2],
                    justifyContent: "center",
                  }}
                >
                  {formSuccess}
                </div>
              )}
              <form
                onSubmit={handleFormSubmit}
                style={{
                  display: "grid",
                  gap: stylesPublic.spacing.gaps.lg,
                  padding: stylesPublic.spacing.scale[6],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="name"
                  >
                    Nombre <span style={{ color: stylesPublic.colors.semantic.error.main }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="email"
                  >
                    Correo Electrónico <span style={{ color: stylesPublic.colors.semantic.error.main }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="phone"
                  >
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="password"
                  >
                    Contraseña <span style={{ color: stylesPublic.colors.semantic.error.main }}>*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="role"
                  >
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    style={stylesPublic.components.input.base}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: stylesPublic.spacing.gaps.md,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowUserForm(false)}
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.base,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={{
                      ...stylesPublic.components.button.variants.primary,
                      ...stylesPublic.components.button.sizes.base,
                      ...(formLoading
                        ? {
                            backgroundColor: stylesPublic.colors.neutral[300],
                            color: stylesPublic.colors.text.muted,
                            cursor: "not-allowed",
                            boxShadow: "none",
                          }
                        : {}),
                    }}
                  >
                    {formLoading ? "Guardando..." : "Guardar Usuario"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit User Form Modal */}
        {/* TODO: Could reuse the UserForm component for edit mode */}
        {showEditForm && (
          <div style={stylesPublic.utils.overlay.base}>
            <div
              style={{
                ...stylesPublic.components.card.base,
                maxWidth: "600px",
                width: "90%",
                margin: stylesPublic.spacing.margins.auto,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
            >
              <button
                onClick={() => setShowEditForm(false)}
                style={{
                  position: "absolute",
                  top: stylesPublic.spacing.scale[2],
                  right: stylesPublic.spacing.scale[2],
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: stylesPublic.typography.scale.lg,
                  color: stylesPublic.colors.text.secondary,
                  cursor: "pointer",
                  padding: stylesPublic.spacing.scale[2],
                  borderRadius: stylesPublic.borders.radius.sm,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    backgroundColor: stylesPublic.colors.neutral[50],
                  },
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
              <h2 style={{ ...stylesPublic.typography.headings.h2, padding: stylesPublic.spacing.scale[4] }}>
                Editar Usuario
              </h2>
              {formError && (
                <div
                  style={{
                    backgroundColor: stylesPublic.colors.semantic.error.light,
                    color: stylesPublic.colors.semantic.error.main,
                    padding: stylesPublic.spacing.scale[4],
                    borderRadius: stylesPublic.borders.radius.md,
                    margin: stylesPublic.spacing.scale[4],
                    textAlign: "center",
                  }}
                >
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div
                  style={{
                    backgroundColor: stylesPublic.colors.semantic.success.light,
                    color: stylesPublic.colors.semantic.success.main,
                    padding: stylesPublic.spacing.scale[4],
                    borderRadius: stylesPublic.borders.radius.md,
                    margin: stylesPublic.spacing.scale[4],
                    display: "flex",
                    alignItems: "center",
                    gap: stylesPublic.spacing.scale[2],
                    justifyContent: "center",
                  }}
                >
                  {formSuccess}
                </div>
              )}
              <form
                onSubmit={handleEditFormSubmit}
                style={{
                  display: "grid",
                  gap: stylesPublic.spacing.gaps.lg,
                  padding: stylesPublic.spacing.scale[6],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="name"
                  >
                    Nombre <span style={{ color: stylesPublic.colors.semantic.error.main }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="email"
                  >
                    Correo Electrónico <span style={{ color: stylesPublic.colors.semantic.error.main }}>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="phone"
                  >
                    Teléfono
                  </label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    style={stylesPublic.components.input.base}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: stylesPublic.spacing.scale[2],
                  }}
                >
                  <label
                    style={{
                      ...stylesPublic.typography.body.base,
                      fontWeight: stylesPublic.typography.weights.semibold,
                    }}
                    htmlFor="role"
                  >
                    Rol
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    style={stylesPublic.components.input.base}
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: stylesPublic.spacing.gaps.md,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowEditForm(false)}
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.base,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    style={{
                      ...stylesPublic.components.button.variants.primary,
                      ...stylesPublic.components.button.sizes.base,
                      ...(formLoading
                        ? {
                            backgroundColor: stylesPublic.colors.neutral[300],
                            color: stylesPublic.colors.text.muted,
                            cursor: "not-allowed",
                            boxShadow: "none",
                          }
                        : {}),
                    }}
                  >
                    {formLoading ? "Guardando..." : "Guardar Cambios"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Inline styles for dynamic effects */}
      <style>
        {`
          .action-button:hover {
            transform: scale(1.05);
            opacity: 0.9;
          }
          .table-row:hover {
            background-color: ${stylesPublic.colors.neutral[50]};
          }
          input[type="checkbox"] {
            cursor: pointer;
          }
          select:focus, input:focus {
            outline: none;
            border-color: ${stylesPublic.colors.secondary[500]};
            box-shadow: 0 0 0 3px rgba(107, 155, 107, 0.1);
          }
          button:disabled {
            background-color: ${stylesPublic.colors.neutral[300]};
            color: ${stylesPublic.colors.text.muted};
            cursor: not-allowed;
            box-shadow: none;
          }
        `}
      </style>
    </div>
  );
};

export default UsersAdminView;