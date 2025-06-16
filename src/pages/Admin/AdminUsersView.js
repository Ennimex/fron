import { useState, useCallback, useMemo, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaUserCheck,
  FaUserTimes,
  FaDownload,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
  FaSort,
  FaUserShield,
  FaUser,
} from "react-icons/fa";
import { usersAdminStyles } from "../../styles/styles";
import { useAuth } from "../../context/AuthContext";

const UsersAdminView = ({ sidebarCollapsed = false }) => {
  const { user } = useAuth();
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

  // Obtener usuarios del backend
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

  // Filtrar y ordenar usuarios
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
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (aValue == null) aValue = "";
      if (bValue == null) bValue = "";

      if (sortField === "createdAt") {
        aValue = aValue ? new Date(aValue) : new Date(0);
        bValue = bValue ? new Date(bValue) : new Date(0);
      } else if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    return filtered;
  }, [users, searchTerm, selectedRole, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  const startIndex = (currentPage - 1) * usersPerPage;
  const paginatedUsers = processedUsers.slice(startIndex, startIndex + usersPerPage);

  // Manejar ordenamiento
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

  // Manejar eliminación de usuario
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

  // Manejar actualización de rol
  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el rol del usuario");
      }

      const updatedUser = await response.json();
      const updatedUsers = users.map((user) =>
        user._id === userId ? { ...user, role: updatedUser.role } : user
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    } catch (error) {
      setError(error.message);
    }
  };

  // Manejar selección de usuarios
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

  // Renderizar icono de ordenamiento
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort size={12} style={{ opacity: 0.5 }} />;
    return sortDirection === "asc" ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  // Renderizar badge de rol
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
        style={{
          ...usersAdminStyles.badge,
          ...(role === "admin" ? usersAdminStyles.roleAdmin : usersAdminStyles.roleUser),
        }}
      >
        {roleIcons[role]}
        {roleLabels[role]}
      </span>
    );
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Manejar loading y error
  if (loading) {
    return (
      <div style={{ ...usersAdminStyles.container, ...usersAdminStyles.loadingContainer }}>
        <div style={{ textAlign: "center" }}>
          <h3>Cargando usuarios...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...usersAdminStyles.container, ...usersAdminStyles.loadingContainer }}>
        <div style={usersAdminStyles.errorContainer}>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#991b1b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={usersAdminStyles.container}>
      <div style={usersAdminStyles.header}>
        <h1 style={usersAdminStyles.title}>Gestión de Usuarios</h1>
        <p style={usersAdminStyles.subtitle}>Administra y supervisa todos los usuarios del sistema</p>

        <div style={usersAdminStyles.toolbar}>
          <div style={usersAdminStyles.searchContainer}>
            <FaSearch style={usersAdminStyles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={usersAdminStyles.searchInput}
            />
          </div>

          <div style={usersAdminStyles.buttonGroup}>
            <button
              style={{
                ...usersAdminStyles.button,
                ...usersAdminStyles.filterButton,
                ...(showFilters ? usersAdminStyles.primaryButton : {}),
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter size={14} />
              Filtros
            </button>

            <button style={{ ...usersAdminStyles.button, ...usersAdminStyles.secondaryButton }} disabled={true}>
              <FaDownload size={14} />
              Exportar
            </button>

            <button style={{ ...usersAdminStyles.button, ...usersAdminStyles.primaryButton }} disabled={true}>
              <FaPlus size={14} />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      <div style={{ ...usersAdminStyles.filtersContainer, display: showFilters ? "block" : "none" }}>
        <div style={usersAdminStyles.filtersGrid}>
          <div style={usersAdminStyles.filterGroup}>
            <label style={usersAdminStyles.label}>Rol</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              style={usersAdminStyles.select}
            >
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>

          <div style={usersAdminStyles.filterGroup}>
            <button
              style={{ ...usersAdminStyles.button, ...usersAdminStyles.secondaryButton }}
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

      <div style={usersAdminStyles.tableContainer}>
        {selectedUsers.size > 0 && (
          <div style={usersAdminStyles.bulkActions}>
            <span style={usersAdminStyles.bulkActionsText}>
              {selectedUsers.size} usuario(s) seleccionado(s)
            </span>
            <div style={usersAdminStyles.bulkActionsButtons}>
              <button style={usersAdminStyles.bulkActionButton} disabled={true}>
                <FaUserCheck size={12} style={{ marginRight: "4px" }} />
                Activar
              </button>
              <button style={usersAdminStyles.bulkActionButton} disabled={true}>
                <FaUserTimes size={12} style={{ marginRight: "4px" }} />
                Suspender
              </button>
              <button style={usersAdminStyles.bulkActionButton} disabled={true}>
                <FaTrash size={12} style={{ marginRight: "4px" }} />
                Eliminar
              </button>
            </div>
          </div>
        )}

        <table style={usersAdminStyles.table}>
          <thead style={usersAdminStyles.tableHeader}>
            <tr>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "40px" }}>
                <input
                  type="checkbox"
                  style={usersAdminStyles.checkbox}
                  checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "25%" }} onClick={() => handleSort("name")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Nombre
                  {renderSortIcon("name")}
                </div>
              </th>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "25%" }} onClick={() => handleSort("email")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Email
                  {renderSortIcon("email")}
                </div>
              </th>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "15%" }} onClick={() => handleSort("phone")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Teléfono
                  {renderSortIcon("phone")}
                </div>
              </th>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "15%" }} onClick={() => handleSort("role")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Rol
                  {renderSortIcon("role")}
                </div>
              </th>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "15%" }} onClick={() => handleSort("createdAt")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Fecha de Registro
                  {renderSortIcon("createdAt")}
                </div>
              </th>
              <th style={{ ...usersAdminStyles.tableHeaderCell, width: "10%" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              <tr key={user._id} style={usersAdminStyles.tableRow}>
                <td style={usersAdminStyles.tableCell}>
                  <input
                    type="checkbox"
                    style={usersAdminStyles.checkbox}
                    checked={selectedUsers.has(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                  />
                </td>
                <td style={usersAdminStyles.tableCell}>
                  <div style={usersAdminStyles.userInfo}>
                    <div style={usersAdminStyles.avatar}>
                      {user.name ? user.name[0].toUpperCase() : "-"}
                    </div>
                    <div>
                      <div style={usersAdminStyles.userName}>{user.name || "Sin nombre"}</div>
                      <div style={usersAdminStyles.userEmail}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={usersAdminStyles.tableCell}>{user.email}</td>
                <td style={usersAdminStyles.tableCell}>{user.phone || "-"}</td>
                <td style={usersAdminStyles.tableCell}>{renderRoleBadge(user.role)}</td>
                <td style={usersAdminStyles.tableCell}>{formatDate(user.createdAt)}</td>
                <td style={usersAdminStyles.tableCell}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      style={{ ...usersAdminStyles.actionButton, ...usersAdminStyles.editButton }}
                      onClick={() => handleUpdateUserRole(user._id, user.role === "user" ? "admin" : "user")}
                      title="Cambiar rol"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      style={{ ...usersAdminStyles.actionButton, ...usersAdminStyles.deleteButton }}
                      onClick={() => handleDeleteUser(user._id)}
                      title="Eliminar usuario"
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={usersAdminStyles.pagination}>
          <div style={usersAdminStyles.paginationInfo}>
            Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, processedUsers.length)} de{" "}
            {processedUsers.length} usuarios
          </div>

          <div style={usersAdminStyles.paginationButtons}>
            <button
              style={{
                ...usersAdminStyles.paginationButton,
                opacity: currentPage === 1 ? 0.5 : 1,
                cursor: currentPage === 1 ? "not-allowed" : "pointer",
              }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <FaChevronLeft size={12} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                style={{
                  ...usersAdminStyles.paginationButton,
                  ...(page === currentPage ? usersAdminStyles.paginationButtonActive : {}),
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              style={{
                ...usersAdminStyles.paginationButton,
                opacity: currentPage === totalPages ? 0.5 : 1,
                cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              }}
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <FaChevronRight size={12} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAdminView; 