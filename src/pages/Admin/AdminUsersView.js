import { useState, useCallback, useMemo, useEffect } from "react"
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
} from "react-icons/fa"
import { colors, typography } from "../../styles/styles"
import { useAuth } from "../../context/AuthContext"
import { useNavigate } from 'react-router-dom';

const UsersAdminView = ({ sidebarCollapsed = false }) => {
  const navigate = useNavigate();
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]) // Cambiado de mockUsers a array vacío
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [sortField, setSortField] = useState("name")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [selectedUsers, setSelectedUsers] = useState(new Set())
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Estilos consistentes con el sidebar
  const styles = {
    container: {
      marginLeft: 0, // Quitamos el margen izquierdo ya que AdminLayout ya lo maneja
      padding: "1rem", // Reducimos el padding para mejor uso del espacio
      backgroundColor: "#f8fafc",
      minHeight: "calc(100vh - 64px)", // Ajustamos altura considerando el navbar
      width: "100%", // Aseguramos que tome todo el ancho disponible
      maxWidth: "100%", // Evitamos desbordamiento
      overflowX: "hidden", // Prevenimos scroll horizontal
      fontFamily: typography.fontSecondary,
    },
    header: {
      backgroundColor: colors.white,
      borderRadius: "12px",
      padding: "1.5rem", // Ajustamos el padding
      marginBottom: "1rem",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
    },
    title: {
      fontSize: "2.2rem", // Aumentado el tamaño de fuente
      fontWeight: "bold",
      color: "#1e293b",
      marginBottom: "1rem", // Aumentado el margen
      fontFamily: typography.fontPrimary,
    },
    subtitle: {
      fontSize: "1.1rem", // Aumentado el tamaño de fuente
      color: "#64748b",
      marginBottom: "1.5rem", // Aumentado el margen
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "16px",
    },
    searchContainer: {
      position: "relative",
      flex: "1",
      maxWidth: "400px",
    },
    searchInput: {
      width: "100%",
      padding: "1rem 3rem 1rem 1.5rem", // Aumentado el padding
      border: "2px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "1rem", // Aumentado el tamaño de fuente
      fontFamily: typography.fontSecondary,
      transition: "border-color 0.2s ease",
      backgroundColor: colors.white,
    },
    searchIcon: {
      position: "absolute",
      left: "16px",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#64748b",
    },
    buttonGroup: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
    },
    button: {
      padding: "0.875rem 1.5rem", // Aumentado el padding
      border: "none",
      borderRadius: "8px",
      fontSize: "1rem", // Aumentado el tamaño de fuente
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontFamily: typography.fontSecondary,
    },
    primaryButton: {
      backgroundColor: "#0D1B2A",
      color: colors.white,
    },
    secondaryButton: {
      backgroundColor: colors.white,
      color: "#374151",
      border: "2px solid #e2e8f0",
    },
    filterButton: {
      backgroundColor: showFilters ? "#0D1B2A" : colors.white,
      color: showFilters ? colors.white : "#374151",
      border: "2px solid #e2e8f0",
    },
    filtersContainer: {
      backgroundColor: colors.white,
      borderRadius: "12px",
      padding: "20px",
      marginBottom: "24px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
      display: showFilters ? "block" : "none",
    },
    filtersGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      alignItems: "end",
    },
    filterGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#374151",
      fontFamily: typography.fontSecondary,
    },
    select: {
      padding: "10px 12px",
      border: "2px solid #e2e8f0",
      borderRadius: "6px",
      fontSize: "14px",
      fontFamily: typography.fontSecondary,
      backgroundColor: colors.white,
      cursor: "pointer",
    },
    tableContainer: {
      backgroundColor: colors.white,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      border: "1px solid #e2e8f0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: "#f8fafc",
      borderBottom: "2px solid #e2e8f0",
    },
    tableHeaderCell: {
      padding: "1.25rem", // Aumentado el padding
      textAlign: "left",
      fontSize: "1rem", // Aumentado el tamaño de fuente
      fontWeight: "600",
      color: "#374151",
      cursor: "pointer",
      userSelect: "none",
      fontFamily: typography.fontSecondary,
    },
    tableRow: {
      borderBottom: "1px solid #f1f5f9",
      transition: "background-color 0.2s ease",
    },
    tableCell: {
      padding: "1.25rem", // Aumentado el padding
      fontSize: "1rem", // Aumentado el tamaño de fuente
      color: "#374151",
      fontFamily: typography.fontSecondary,
    },
    avatar: {
      width: "48px", // Aumentado el tamaño
      height: "48px", // Aumentado el tamaño
      borderRadius: "50%",
      backgroundColor: "#0D1B2A",
      color: colors.white,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.2rem", // Aumentado el tamaño de fuente
      fontWeight: "bold",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    userName: {
      fontWeight: "500",
      color: "#1e293b",
    },
    userEmail: {
      fontSize: "13px",
      color: "#64748b",
    },
    badge: {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "500",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    statusActive: {
      backgroundColor: "#dcfce7",
      color: "#166534",
    },
    statusInactive: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
    statusSuspended: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
    roleAdmin: {
      backgroundColor: "#ddd6fe",
      color: "#5b21b6",
    },
    roleModerator: {
      backgroundColor: "#bfdbfe",
      color: "#1d4ed8",
    },
    roleUser: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
    },
    actionButton: {
      padding: "8px",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: "0 2px",
    },
    viewButton: {
      backgroundColor: "#e0f2fe",
      color: "#0369a1",
    },
    editButton: {
      backgroundColor: "#fef3c7",
      color: "#92400e",
    },
    deleteButton: {
      backgroundColor: "#fee2e2",
      color: "#991b1b",
    },
    pagination: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px",
      backgroundColor: "#f8fafc",
      borderTop: "1px solid #e2e8f0",
    },
    paginationInfo: {
      fontSize: "14px",
      color: "#64748b",
      fontFamily: typography.fontSecondary,
    },
    paginationButtons: {
      display: "flex",
      gap: "8px",
      alignItems: "center",
    },
    paginationButton: {
      padding: "8px 12px",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      backgroundColor: colors.white,
      color: "#374151",
      cursor: "pointer",
      fontSize: "14px",
      fontFamily: typography.fontSecondary,
      transition: "all 0.2s ease",
    },
    paginationButtonActive: {
      backgroundColor: "#0D1B2A",
      color: colors.white,
      borderColor: "#0D1B2A",
    },
    checkbox: {
      width: "18px",
      height: "18px",
      cursor: "pointer",
    },
    bulkActions: {
      backgroundColor: "#0D1B2A",
      color: colors.white,
      padding: "12px 20px",
      borderRadius: "8px 8px 0 0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    bulkActionsText: {
      fontSize: "14px",
      fontWeight: "500",
    },
    bulkActionsButtons: {
      display: "flex",
      gap: "8px",
    },
    bulkActionButton: {
      padding: "6px 12px",
      border: "1px solid rgba(255,255,255,0.3)",
      borderRadius: "4px",
      backgroundColor: "transparent",
      color: colors.white,
      cursor: "pointer",
      fontSize: "12px",
      transition: "all 0.2s ease",
    },
  }

  // Obtener usuarios del backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        })

        if (!response.ok) {
          throw new Error("Error al cargar los usuarios")
        }

        const data = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user.token])

  // Filtrar y ordenar usuarios
  const processedUsers = useMemo(() => {
    const filtered = users.filter((user) => {
      const matchesSearch = user.email && 
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "all" || user.role === selectedRole;

      // Removemos matchesStatus ya que no tenemos ese campo
      return matchesSearch && matchesRole;
    })

    // Ordenar
    filtered.sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortDirection === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return filtered
  }, [users, searchTerm, selectedRole, sortField, sortDirection])

  // Paginación
  const totalPages = Math.ceil(processedUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = processedUsers.slice(startIndex, startIndex + usersPerPage)

  // Manejar ordenamiento
  const handleSort = useCallback(
    (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc")
      } else {
        setSortField(field)
        setSortDirection("asc")
      }
    },
    [sortField, sortDirection],
  )

  // Manejar eliminación de usuario
  const handleDeleteUser = async (userId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Error al eliminar el usuario")
        }

        setUsers(users.filter((user) => user.id !== userId))
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId))
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        throw new Error("Error al actualizar el rol del usuario")
      }

      const updatedUser = await response.json()
      const updatedUsers = users.map((user) => (user.id === userId ? { ...user, role: updatedUser.role } : user))
      setUsers(updatedUsers)
      setFilteredUsers(updatedUsers)
    } catch (error) {
      setError(error.message)
    }
  }

  // Manejar selección de usuarios
  const handleSelectUser = useCallback(
    (userId) => {
      const newSelected = new Set(selectedUsers)
      if (newSelected.has(userId)) {
        newSelected.delete(userId)
      } else {
        newSelected.add(userId)
      }
      setSelectedUsers(newSelected)
    },
    [selectedUsers],
  )

  const handleSelectAll = useCallback(() => {
    if (selectedUsers.size === paginatedUsers.length) {
      setSelectedUsers(new Set())
    } else {
      setSelectedUsers(new Set(paginatedUsers.map((user) => user.id)))
    }
  }, [selectedUsers.size, paginatedUsers])

  // Renderizar icono de ordenamiento
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort size={12} style={{ opacity: 0.5 }} />
    return sortDirection === "asc" ? <FaSortUp size={12} /> : <FaSortDown size={12} />
  }

  // Renderizar badge de rol
  const renderRoleBadge = (role) => {
    const roleStyles = {
      admin: styles.roleAdmin,
      user: styles.roleUser,
    }

    const roleLabels = {
      admin: "Administrador",
      user: "Usuario",
    }

    const roleIcons = {
      admin: <FaUserShield size={12} />,
      user: <FaUser size={12} />,
    }

    return (
      <span style={{ ...styles.badge, ...roleStyles[role], display: "flex", alignItems: "center", gap: "4px" }}>
        {roleIcons[role]}
        {roleLabels[role]}
      </span>
    )
  }

  // Agregar manejo de loading y error
  if (loading) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>Cargando usuarios...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...styles.container, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          backgroundColor: '#fee2e2', 
          borderRadius: '8px',
          color: '#991b1b' 
        }}>
          <h3>Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: '#991b1b',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h1 style={styles.title}>Gestión de Usuarios</h1>
          <button 
            onClick={() => navigate('/admin')}
            style={{
              ...styles.button,
              backgroundColor: "#0D1B2A",
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <i className="bi bi-speedometer2"></i>
            Volver al Dashboard
          </button>
        </div>
        <p style={styles.subtitle}>Administra y supervisa todos los usuarios del sistema</p>

        <div style={styles.toolbar}>
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} size={16} />
            <input
              type="text"
              placeholder="Buscar usuarios por nombre o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button style={{ ...styles.button, ...styles.filterButton }} onClick={() => setShowFilters(!showFilters)}>
              <FaFilter size={14} />
              Filtros
            </button>

            <button style={{ ...styles.button, ...styles.secondaryButton }}>
              <FaDownload size={14} />
              Exportar
            </button>

            <button style={{ ...styles.button, ...styles.primaryButton }}>
              <FaPlus size={14} />
              Nuevo Usuario
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div style={styles.filtersContainer}>
        <div style={styles.filtersGrid}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Rol</label>
            <select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} style={styles.select}>
              <option value="all">Todos los roles</option>
              <option value="admin">Administrador</option>
              <option value="user">Usuario</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <button
              style={{ ...styles.button, ...styles.secondaryButton }}
              onClick={() => {
                setSearchTerm("")
                setSelectedRole("all")
                setCurrentPage(1)
              }}
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div style={styles.tableContainer}>
        {selectedUsers.size > 0 && (
          <div style={styles.bulkActions}>
            <span style={styles.bulkActionsText}>{selectedUsers.size} usuario(s) seleccionado(s)</span>
            <div style={styles.bulkActionsButtons}>
              <button style={styles.bulkActionButton}>
                <FaUserCheck size={12} style={{ marginRight: "4px" }} />
                Activar
              </button>
              <button style={styles.bulkActionButton}>
                <FaUserTimes size={12} style={{ marginRight: "4px" }} />
                Suspender
              </button>
              <button style={styles.bulkActionButton}>
                <FaTrash size={12} style={{ marginRight: "4px" }} />
                Eliminar
              </button>
            </div>
          </div>
        )}

        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th style={styles.tableHeaderCell}>
                <input
                  type="checkbox"
                  style={styles.checkbox}
                  checked={selectedUsers.size === paginatedUsers.length && paginatedUsers.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th style={styles.tableHeaderCell} onClick={() => handleSort("email")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Usuario (Email)
                  {renderSortIcon("email")}
                </div>
              </th>
              <th style={styles.tableHeaderCell} onClick={() => handleSort("role")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  Rol
                  {renderSortIcon("role")}
                </div>
              </th>
              <th style={styles.tableHeaderCell}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((user) => (
              // Cambiamos user.id por user._id ya que MongoDB usa _id
              <tr key={user._id} style={styles.tableRow}>
                <td style={styles.tableCell}>
                  <input
                    type="checkbox"
                    style={styles.checkbox}
                    checked={selectedUsers.has(user._id)}
                    onChange={() => handleSelectUser(user._id)}
                  />
                </td>
                <td style={styles.tableCell}>
                  <div style={styles.userInfo}>
                    <div style={styles.avatar}>
                      {user.email[0].toUpperCase()}
                    </div>
                    <div style={styles.userEmail}>{user.email}</div>
                  </div>
                </td>
                <td style={styles.tableCell}>
                  {renderRoleBadge(user.role)}
                </td>
                <td style={styles.tableCell}>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <button
                      style={{ ...styles.actionButton, ...styles.editButton }}
                      onClick={() => handleUpdateUserRole(user._id, user.role === "user" ? "admin" : "user")}
                      title="Cambiar rol"
                    >
                      <FaEdit size={14} />
                    </button>
                    <button
                      style={{ ...styles.actionButton, ...styles.deleteButton }}
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

        {/* Paginación */}
        <div style={styles.pagination}>
          <div style={styles.paginationInfo}>
            Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, processedUsers.length)} de{" "}
            {processedUsers.length} usuarios
          </div>

          <div style={styles.paginationButtons}>
            <button
              style={{
                ...styles.paginationButton,
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
                  ...styles.paginationButton,
                  ...(page === currentPage ? styles.paginationButtonActive : {}),
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              style={{
                ...styles.paginationButton,
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
  )
}

export default UsersAdminView
