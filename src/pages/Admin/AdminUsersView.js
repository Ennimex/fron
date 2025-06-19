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
  FaUsers, // Añadimos el import de FaUsers
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

// Estilos mejorados para el componente
const enhancedStyles = {
  container: {
    backgroundColor: "#f9fafb",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    maxWidth: "1500px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
  },
  header: {
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 0.5rem 0",
  },
  subtitle: {
    fontSize: "1rem",
    color: "#4b5563",
    margin: "0 0 1.5rem 0",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "1rem",
    marginBottom: "1.5rem",
  },
  searchContainer: {
    position: "relative",
    flex: "1",
    minWidth: "280px",
    maxWidth: "500px",
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
  },
  searchInput: {
    width: "100%",
    padding: "0.75rem 1rem 0.75rem 2.5rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "0.95rem",
    backgroundColor: "white",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    outline: "none",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    "&:focus": {
      borderColor: "#60a5fa",
      boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.2)",
    },
  },
  buttonGroup: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },
  button: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.65rem 1rem",
    borderRadius: "8px",
    border: "none",
    fontSize: "0.9rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  primaryButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
    "&:disabled": {
      backgroundColor: "#93c5fd",
      cursor: "not-allowed",
    },
  },
  secondaryButton: {
    backgroundColor: "white",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
    "&:hover": {
      backgroundColor: "#f9fafb",
      borderColor: "#d1d5db",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  filterButton: {
    backgroundColor: "white",
    color: "#4b5563",
    border: "1px solid #e5e7eb",
  },
  filtersContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    padding: "1.25rem",
    marginBottom: "1.5rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    animation: "fadeIn 0.3s ease",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: "1.25rem",
    alignItems: "end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },
  label: {
    fontSize: "0.875rem",
    color: "#4b5563",
    fontWeight: "500",
  },
  select: {
    padding: "0.65rem 1rem",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
    fontSize: "0.95rem",
    backgroundColor: "white",
    outline: "none",
    transition: "border-color 0.2s ease, box-shadow 0.2s ease",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
    "&:focus": {
      borderColor: "#60a5fa",
      boxShadow: "0 0 0 3px rgba(96, 165, 250, 0.2)",
    },
  },
  tableContainer: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    border: "1px solid #e5e7eb",
    overflow: "hidden",
  },
  bulkActions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    backgroundColor: "#f3f4f6",
    borderBottom: "1px solid #e5e7eb",
  },
  bulkActionsText: {
    fontSize: "0.9rem",
    color: "#4b5563",
    fontWeight: "500",
  },
  bulkActionsButtons: {
    display: "flex",
    gap: "0.5rem",
  },
  bulkActionButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.4rem 0.75rem",
    borderRadius: "6px",
    border: "1px solid #e5e7eb",
    backgroundColor: "white",
    fontSize: "0.8rem",
    color: "#4b5563",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9fafb",
      borderColor: "#d1d5db",
    },
    "&:disabled": {
      opacity: 0.6,
      cursor: "not-allowed",
    },
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
    borderBottom: "1px solid #e5e7eb",
  },
  tableHeaderCell: {
    padding: "1rem",
    textAlign: "left",
    color: "#4b5563",
    fontWeight: "600",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f3f4f6",
    },
  },
  tableRow: {
    borderBottom: "1px solid #e5e7eb",
    transition: "background-color 0.2s ease",
    "&:hover": {
      backgroundColor: "#f9fafb",
    },
    "&:last-child": {
      borderBottom: "none",
    },
  },
  tableCell: {
    padding: "1rem",
    fontSize: "0.9rem",
    color: "#111827",
    verticalAlign: "middle",
  },
  checkbox: {
    width: "16px",
    height: "16px",
    cursor: "pointer",
    accentColor: "#3b82f6",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },
  avatar: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    backgroundColor: "#3b82f6",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    fontWeight: "600",
  },
  userName: {
    fontWeight: "500",
    color: "#111827",
    marginBottom: "0.25rem",
  },
  userEmail: {
    fontSize: "0.8rem",
    color: "#6b7280",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.25rem",
    padding: "0.3rem 0.6rem",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "500",
  },
  roleAdmin: {
    backgroundColor: "#dbeafe",
    color: "#1e40af",
  },
  roleUser: {
    backgroundColor: "#e0f2fe",
    color: "#0369a1",
  },
  actionButton: {
    width: "32px",
    height: "32px",
    borderRadius: "6px",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background-color 0.2s ease, transform 0.1s ease",
    "&:hover": {
      transform: "translateY(-2px)",
    },
  },
  editButton: {
    backgroundColor: "#dbeafe",
    color: "#2563eb",
    "&:hover": {
      backgroundColor: "#bfdbfe",
    },
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    "&:hover": {
      backgroundColor: "#fecaca",
    },
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem",
    borderTop: "1px solid #e5e7eb",
    flexWrap: "wrap",
    gap: "1rem",
  },
  paginationInfo: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  paginationButtons: {
    display: "flex",
    gap: "0.25rem",
  },
  paginationButton: {
    width: "32px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #e5e7eb",
    borderRadius: "6px",
    backgroundColor: "white",
    color: "#4b5563",
    fontSize: "0.875rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    "&:hover:not(:disabled)": {
      backgroundColor: "#f3f4f6",
      borderColor: "#d1d5db",
    },
  },
  paginationButtonActive: {
    backgroundColor: "#3b82f6",
    borderColor: "#3b82f6",
    color: "white",
    "&:hover": {
      backgroundColor: "#2563eb",
    },
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "400px",
  },
  errorContainer: {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "2rem",
    textAlign: "center",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    border: "1px solid #fecaca",
    color: "#b91c1c",
  },
  emptyState: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "3rem 1rem",
    textAlign: "center",
    color: "#6b7280",
  },
  responsiveTableContainer: {
    overflowX: "auto",
  },
};

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
          ...enhancedStyles.badge,
          ...(role === "admin" ? enhancedStyles.roleAdmin : enhancedStyles.roleUser),
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
      <div style={{ ...enhancedStyles.container, ...enhancedStyles.loadingContainer }}>
        <div style={{ textAlign: "center" }}>
          <h3>Cargando usuarios...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...enhancedStyles.container }}>
        <div style={enhancedStyles.errorContainer}>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "8px 16px",
              backgroundColor: "#991b1b",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              marginTop: "1rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Comprobar si no hay usuarios
  const noUsers = processedUsers.length === 0;

  return (
    <div style={enhancedStyles.container}>
      <div style={enhancedStyles.header}>
        <h1 style={enhancedStyles.title}>Gestión de Usuarios</h1>
        <p style={enhancedStyles.subtitle}>Administra y supervisa todos los usuarios del sistema</p>

        <div style={enhancedStyles.toolbar}>
          <div style={enhancedStyles.searchContainer}>
            <FaSearch style={enhancedStyles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={enhancedStyles.searchInput}
            />
          </div>

          <div style={enhancedStyles.buttonGroup}>
            <button
              style={{
                ...enhancedStyles.button,
                ...enhancedStyles.filterButton,
                ...(showFilters ? { backgroundColor: "#dbeafe", color: "#2563eb", borderColor: "#bfdbfe" } : {}),
              }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter size={14} />
              Filtros
            </button>

            <button style={{ ...enhancedStyles.button, ...enhancedStyles.secondaryButton }} disabled={true}>
              <FaDownload size={14} />
              Exportar
            </button>

            <button style={{ ...enhancedStyles.button, ...enhancedStyles.primaryButton }} disabled={true}>
              <FaPlus size={14} />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div style={enhancedStyles.filtersContainer}>
          <div style={enhancedStyles.filtersGrid}>
            <div style={enhancedStyles.filterGroup}>
              <label style={enhancedStyles.label}>Rol</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                style={enhancedStyles.select}
              >
                <option value="all">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
              </select>
            </div>

            <div style={{...enhancedStyles.filterGroup, justifyContent: "flex-end"}}>
              <button
                style={{ ...enhancedStyles.button, ...enhancedStyles.secondaryButton }}
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

      <div style={enhancedStyles.tableContainer}>
        {selectedUsers.size > 0 && (
          <div style={enhancedStyles.bulkActions}>
            <span style={enhancedStyles.bulkActionsText}>
              {selectedUsers.size} usuario(s) seleccionado(s)
            </span>
            <div style={enhancedStyles.bulkActionsButtons}>
              <button style={enhancedStyles.bulkActionButton} disabled={true}>
                <FaUserCheck size={12} style={{ marginRight: "4px" }} />
                Activar
              </button>
              <button style={enhancedStyles.bulkActionButton} disabled={true}>
                <FaUserTimes size={12} style={{ marginRight: "4px" }} />
                Suspender
              </button>
              <button style={enhancedStyles.bulkActionButton} disabled={true}>
                <FaTrash size={12} style={{ marginRight: "4px" }} />
                Eliminar
              </button>
            </div>
          </div>
        )}

        <div style={enhancedStyles.responsiveTableContainer}>
          {noUsers ? (
            <div style={enhancedStyles.emptyState}>
              <FaUsers size={40} style={{ opacity: 0.3, marginBottom: "1rem" }} />
              <h3>No se encontraron usuarios</h3>
              <p>Intenta ajustar los filtros de búsqueda o añade nuevos usuarios.</p>
            </div>
          ) : (
            <table style={enhancedStyles.table}>
              <thead style={enhancedStyles.tableHeader}>
                <tr>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "40px", padding: "0.75rem" }}>
                    <input
                      type="checkbox"
                      style={enhancedStyles.checkbox}
                      checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "25%" }} onClick={() => handleSort("name")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Nombre
                      {renderSortIcon("name")}
                    </div>
                  </th>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "25%" }} onClick={() => handleSort("email")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Email
                      {renderSortIcon("email")}
                    </div>
                  </th>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "15%" }} onClick={() => handleSort("phone")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Teléfono
                      {renderSortIcon("phone")}
                    </div>
                  </th>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "15%" }} onClick={() => handleSort("role")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Rol
                      {renderSortIcon("role")}
                    </div>
                  </th>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "15%" }} onClick={() => handleSort("createdAt")}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      Fecha de Registro
                      {renderSortIcon("createdAt")}
                    </div>
                  </th>
                  <th style={{ ...enhancedStyles.tableHeaderCell, width: "10%" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedUsers.map((user) => (
                  <tr key={user._id} style={enhancedStyles.tableRow}>
                    <td style={{ ...enhancedStyles.tableCell, padding: "0.75rem" }}>
                      <input
                        type="checkbox"
                        style={enhancedStyles.checkbox}
                        checked={selectedUsers.has(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td style={enhancedStyles.tableCell}>
                      <div style={enhancedStyles.userInfo}>
                        <div style={enhancedStyles.avatar}>
                          {user.name ? user.name[0].toUpperCase() : "-"}
                        </div>
                        <div>
                          <div style={enhancedStyles.userName}>{user.name || "Sin nombre"}</div>
                          <div style={enhancedStyles.userEmail}>{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={enhancedStyles.tableCell}>{user.email}</td>
                    <td style={enhancedStyles.tableCell}>{user.phone || "-"}</td>
                    <td style={enhancedStyles.tableCell}>{renderRoleBadge(user.role)}</td>
                    <td style={enhancedStyles.tableCell}>{formatDate(user.createdAt)}</td>
                    <td style={{...enhancedStyles.tableCell, padding: "0.5rem 1rem"}}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          style={{ ...enhancedStyles.actionButton, ...enhancedStyles.editButton }}
                          onClick={() => handleUpdateUserRole(user._id, user.role === "user" ? "admin" : "user")}
                          title="Cambiar rol"
                        >
                          <FaEdit size={14} />
                        </button>
                        <button
                          style={{ ...enhancedStyles.actionButton, ...enhancedStyles.deleteButton }}
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
          )}
        </div>

        {!noUsers && (
          <div style={enhancedStyles.pagination}>
            <div style={enhancedStyles.paginationInfo}>
              Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, processedUsers.length)} de{" "}
              {processedUsers.length} usuarios
            </div>

            <div style={enhancedStyles.paginationButtons}>
              <button
                style={{
                  ...enhancedStyles.paginationButton,
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
                    ...enhancedStyles.paginationButton,
                    ...(page === currentPage ? enhancedStyles.paginationButtonActive : {}),
                  }}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                style={{
                  ...enhancedStyles.paginationButton,
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
        )}
      </div>
    </div>
  );
};

export default UsersAdminView;