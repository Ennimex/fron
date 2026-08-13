import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import {
  FaSearch,
  FaFilter,
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaSortUp,
  FaSortDown,
  FaSort,
  FaUserShield,
  FaUser,
  FaUsers,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import adminService from "../../services/adminServices";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import stylesPublic from "../../styles/stylesGlobal"; // Import global styles
import adminTheme from "../../styles/adminTheme";

// Estilos CSS responsivos para AdminUsersView
const responsiveStyles = `
  @media (max-width: 768px) {
    .users-container {
      padding: 1rem !important;
    }
    
    .users-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 1rem !important;
    }
    
    .users-title {
      font-size: 1.5rem !important;
      text-align: center !important;
    }
    
    .users-controls {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .users-search-filter {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .users-table-container {
      overflow-x: auto !important;
      margin: 0 -1rem !important;
      padding: 0 1rem !important;
    }
    
    .users-table {
      min-width: 800px !important;
    }
    
    .users-table th,
    .users-table td {
      padding: 0.5rem !important;
      font-size: 0.875rem !important;
    }
    
    .users-actions {
      flex-direction: column !important;
      gap: 0.25rem !important;
      align-items: stretch !important;
    }
    
    .users-action-btn {
      justify-content: center !important;
      font-size: 0.75rem !important;
      padding: 0.375rem 0.75rem !important;
    }
    
    .users-pagination {
      flex-direction: column !important;
      gap: 1rem !important;
      align-items: center !important;
    }
    
    .users-pagination-controls {
      justify-content: center !important;
    }
  }

  @media (max-width: 480px) {
    .users-container {
      padding: 0.75rem !important;
    }
    
    .users-title {
      font-size: 1.25rem !important;
    }
    
    .users-table-container {
      margin: 0 -0.75rem !important;
      padding: 0 0.75rem !important;
    }
    
    .users-pagination-info {
      font-size: 0.875rem !important;
      text-align: center !important;
    }

    .users-form-modal {
      margin: 0.5rem !important;
      max-width: calc(100% - 1rem) !important;
    }
    
    .users-form-grid {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-users-styles]')) {
    styleElement.setAttribute('data-users-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const UsersAdminView = ({ sidebarCollapsed = false }) => {
  const { user } = useAuth();

  // Hook de notificaciones
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();
  
  // Crear una referencia estable para addNotification
  const addNotificationRef = useRef(addNotification);
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  // Nota: useAdminNotifications ya se suscribe a adminService.onNotification
  // por dentro; suscribirse otra vez aquí duplicaba cada notificación.

  // Updated styles object using stylesPublic
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: adminTheme.bg,
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
      fontFamily: stylesPublic.typography.families.display,
      fontSize: "1.9rem",
      fontWeight: 700,
      color: stylesPublic.colors.text.primary,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Un solo modal para alta y edición: editingUserId null = alta
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  // Confirmación de borrado con modal propio (antes window.confirm)
  const [confirmacion, setConfirmacion] = useState(null); // { id, nombre }
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });
  const [showPassword, setShowPassword] = useState(false);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (error) {
        // adminService ya maneja las notificaciones de error
        // Solo actualizamos el estado local de error para el UI
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

  // Al cambiar la búsqueda o el filtro de rol, volver a la primera página
  // (antes la página se quedaba fuera de rango y la tabla salía vacía)
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole]);

  // Pagination
  const totalPages = Math.ceil(processedUsers.length / usersPerPage);
  // Nunca quedarse en una página que ya no existe (p. ej. tras borrar el último de la última página)
  const pageActual = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (pageActual - 1) * usersPerPage;
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

  const FORM_VACIO = { name: "", email: "", phone: "", password: "", role: "user" };
  const VALIDACION_VACIA = {
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  };

  const cerrarFormulario = () => {
    setShowUserForm(false);
    setEditingUserId(null);
    setFormData(FORM_VACIO);
    setPasswordValidation(VALIDACION_VACIA);
    setShowPassword(false);
  };

  const abrirNuevoUsuario = () => {
    setEditingUserId(null);
    setFormData(FORM_VACIO);
    setPasswordValidation(VALIDACION_VACIA);
    setShowPassword(false);
    setShowUserForm(true);
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
    setPasswordValidation(VALIDACION_VACIA);
    setShowPassword(false);
    setShowUserForm(true);
  };

  // Eliminar usuario (la confirmación la pide el modal propio)
  const ejecutarEliminacion = async () => {
    if (!confirmacion) return;
    setConfirmLoading(true);
    try {
      await adminService.deleteUser(confirmacion.id);
      // adminService ya maneja las notificaciones de éxito automáticamente
      setUsers((prev) => prev.filter((u) => u._id !== confirmacion.id));
      setConfirmacion(null);
    } catch (error) {
      // adminService ya maneja las notificaciones de error
    } finally {
      setConfirmLoading(false);
    }
  };

  // Alta y edición comparten el mismo submit.
  // La contraseña debe cumplir los requisitos siempre al crear, y al editar
  // solo si se está cambiando (antes la edición no validaba nada).
  const handleUserFormSubmit = async (e) => {
    e.preventDefault();
    const esEdicion = Boolean(editingUserId);
    const reglasOk = Object.values(passwordValidation).every(Boolean);

    if ((!esEdicion || formData.password) && !reglasOk) {
      addNotificationRef.current(
        'La contraseña no cumple con todos los requisitos de seguridad',
        'error',
        5000
      );
      return;
    }

    setFormLoading(true);
    try {
      if (esEdicion) {
        const updateData = { ...formData };
        if (!updateData.password) delete updateData.password;
        const response = await adminService.updateUser(editingUserId, updateData);
        const updatedUser = response.data || response;
        setUsers((prev) => prev.map((u) => (u._id === editingUserId ? { ...u, ...updatedUser } : u)));
      } else {
        const response = await adminService.createUser(formData);
        const newUser = response.data || response;
        setUsers((prev) => [...prev, newUser]);
      }
      cerrarFormulario();
    } catch (error) {
      // adminService ya maneja las notificaciones de error
    } finally {
      setFormLoading(false);
    }
  };

  // Handle form input changes
  const handleFormChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar contraseña en tiempo real
    if (name === 'password') {
      setPasswordValidation({
        minLength: value.length >= 8,
        hasUppercase: /[A-Z]/.test(value),
        hasLowercase: /[a-z]/.test(value),
        hasNumber: /\d/.test(value),
        hasSpecialChar: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
      });
    }
  }, []);

  // ...eliminado handleSelectUser y handleSelectAll por no usarse...

  // Render sort icon
  // TODO: Could move to a utilities file
  const renderSortIcon = (field) => {
    if (sortField !== field) return <FaSort size={12} style={{ opacity: 0.5 }} />;
    return sortDirection === "asc" ? <FaSortUp size={12} /> : <FaSortDown size={12} />;
  };

  // Render password validation component
  const renderPasswordValidation = () => {
    const validationItems = [
      { key: 'minLength', label: 'Al menos 8 caracteres', valid: passwordValidation.minLength },
      { key: 'hasUppercase', label: 'Una mayúscula (A-Z)', valid: passwordValidation.hasUppercase },
      { key: 'hasLowercase', label: 'Una minúscula (a-z)', valid: passwordValidation.hasLowercase },
      { key: 'hasNumber', label: 'Un número (0-9)', valid: passwordValidation.hasNumber },
      { key: 'hasSpecialChar', label: 'Un carácter especial (!@#$%)', valid: passwordValidation.hasSpecialChar }
    ];

    return (
      <div style={{
        marginTop: stylesPublic.spacing.scale[2],
        padding: stylesPublic.spacing.scale[3],
        backgroundColor: stylesPublic.colors.surface.secondary,
        borderRadius: stylesPublic.borders.radius.sm,
        border: `1px solid ${stylesPublic.borders.colors.muted}`
      }}>
        <div style={{
          fontSize: stylesPublic.typography.scale.xs,
          fontWeight: stylesPublic.typography.weights.semibold,
          marginBottom: stylesPublic.spacing.scale[2],
          color: stylesPublic.colors.text.secondary
        }}>
          La contraseña debe contener:
        </div>
        {validationItems.map(item => (
          <div key={item.key} style={{
            display: 'flex',
            alignItems: 'center',
            gap: stylesPublic.spacing.scale[2],
            marginBottom: stylesPublic.spacing.scale[1],
            fontSize: stylesPublic.typography.scale.xs
          }}>
            <span style={{
              color: item.valid ? stylesPublic.colors.semantic.success.main : stylesPublic.colors.text.muted,
              fontWeight: stylesPublic.typography.weights.semibold
            }}>
              {item.valid ? '✓' : '○'}
            </span>
            <span style={{
              color: item.valid ? stylesPublic.colors.semantic.success.main : stylesPublic.colors.text.secondary
            }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    );
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
        color: stylesPublic.colors.secondary[650], // verde accesible como texto de badge — 4.65:1 (WCAG AA)
        border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.secondary[650]}`,
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
      <div style={styles.mainContainer} className="users-container">
        <div style={styles.header} className="users-header">
          <div>
            <h1 style={styles.title} className="users-title">
              <FaUsers style={{ marginRight: stylesPublic.spacing.scale[2] }} />
              Gestión de Usuarios
            </h1>
            <p style={styles.subtitle}>Administra y supervisa todos los usuarios del sistema</p>
          </div>
        </div>

        <div style={styles.content}>
          {/* Sistema de notificaciones centralizado */}
          <NotificationContainer
            notifications={notifications}
            onRemoveNotification={removeNotification}
            onClearAll={clearAllNotifications}
          />

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
            className="users-controls"
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
              className="users-search-filter"
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
                  ...(showFilters ? { border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.borders.colors.accent}` } : {}),
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
                onClick={abrirNuevoUsuario}
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

          <div style={styles.tableContainer} className="users-table-container">
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
                <table style={styles.table} className="users-table">
                  <thead style={styles.tableHeader}>
                    <tr>
                      {/* Columna de selección eliminada */}
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
                          {renderSortIcon("email")}
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
                        className="users-row"
                        style={{
                          ...styles.tableRow,
                          ...(index === paginatedUsers.length - 1 ? { borderBottom: "none" } : {}),
                        }}
                      >
                        {/* Celda de selección eliminada */}
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
                          <div style={styles.actionsContainer} className="users-actions">
                            <button
                              style={{
                                ...styles.actionButton,
                                ...styles.editAction,
                              }}
                              className="users-action-btn"
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
                              className="users-action-btn"
                              onClick={() => setConfirmacion({ id: user._id, nombre: user.name || user.email })}
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
                className="users-pagination"
              >
                <div
                  style={{
                    ...stylesPublic.typography.body.small,
                    color: stylesPublic.colors.text.secondary,
                  }}
                  className="users-pagination-info"
                >
                  Mostrando {startIndex + 1} a {Math.min(startIndex + usersPerPage, processedUsers.length)} de{" "}
                  {processedUsers.length} usuarios
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: stylesPublic.spacing.gaps.xs,
                  }}
                  className="users-pagination-controls"
                >
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.xs,
                      ...(pageActual === 1 ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                    }}
                    onClick={() => setCurrentPage(Math.max(1, pageActual - 1))}
                    disabled={pageActual === 1}
                    aria-label="Página anterior"
                  >
                    <FaChevronLeft size={12} />
                  </button>
                  {/* Ventana de páginas: primera, última y vecinas de la actual (antes
                      se pintaba un botón por cada página, sin límite) */}
                  {(() => {
                    const items = [];
                    for (let p = 1; p <= totalPages; p++) {
                      if (p === 1 || p === totalPages || Math.abs(p - pageActual) <= 1) items.push(p);
                      else if (items[items.length - 1] !== "…") items.push("…");
                    }
                    return items.map((page, i) =>
                      page === "…" ? (
                        <span
                          key={`salto-${i}`}
                          style={{ alignSelf: "center", padding: "0 4px", color: stylesPublic.colors.text.tertiary }}
                          aria-hidden="true"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={page}
                          style={{
                            ...stylesPublic.components.button.variants.ghost,
                            ...stylesPublic.components.button.sizes.xs,
                            ...(page === pageActual
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
                      )
                    );
                  })()}
                  <button
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.xs,
                      ...(pageActual === totalPages ? { opacity: 0.5, cursor: "not-allowed" } : {}),
                    }}
                    onClick={() => setCurrentPage(Math.min(totalPages, pageActual + 1))}
                    disabled={pageActual === totalPages}
                    aria-label="Página siguiente"
                  >
                    <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de usuario: un solo formulario para alta y edición */}
        {showUserForm && (
          <div style={stylesPublic.utils.overlay.base}>
            <div
              style={{
                ...stylesPublic.components.card.base,
                borderRadius: "18px",
                border: "none",
                boxShadow: "0 24px 70px rgba(45, 40, 35, 0.3)",
                maxWidth: "480px",
                width: "90%",
                margin: stylesPublic.spacing.margins.auto,
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              className="users-form-modal"
            >
              <button
                onClick={cerrarFormulario}
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
                }}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
              <div style={{ padding: stylesPublic.spacing.scale[4], paddingBottom: stylesPublic.spacing.scale[2] }}>
                <h2 style={{ ...stylesPublic.typography.headings.h2, margin: 0, fontSize: "1.4rem" }}>
                  {editingUserId ? "Editar Usuario" : "Agregar Nuevo Usuario"}
                </h2>
              </div>
              <form
                onSubmit={handleUserFormSubmit}
                style={{
                  padding: stylesPublic.spacing.scale[4],
                  paddingTop: stylesPublic.spacing.scale[2],
                }}
                className="users-form"
              >
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: stylesPublic.spacing.scale[3], marginBottom: stylesPublic.spacing.scale[4] }} className="users-form-grid">
                  <div>
                    <label
                      style={{
                        ...stylesPublic.typography.body.small,
                        fontWeight: stylesPublic.typography.weights.semibold,
                        display: "block",
                        marginBottom: stylesPublic.spacing.scale[1],
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
                      placeholder="Ej: María González"
                      style={{ ...stylesPublic.components.input.base, fontSize: "0.9rem", padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]}` }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        ...stylesPublic.typography.body.small,
                        fontWeight: stylesPublic.typography.weights.semibold,
                        display: "block",
                        marginBottom: stylesPublic.spacing.scale[1],
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
                      style={{ ...stylesPublic.components.input.base, fontSize: "0.9rem", padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]}` }}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: stylesPublic.spacing.scale[4] }}>
                  <label
                    style={{
                      ...stylesPublic.typography.body.small,
                      fontWeight: stylesPublic.typography.weights.semibold,
                      display: "block",
                      marginBottom: stylesPublic.spacing.scale[1],
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
                    placeholder="ejemplo@gmail.com"
                    style={{ ...stylesPublic.components.input.base, fontSize: "0.9rem", padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]}` }}
                  />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: stylesPublic.spacing.scale[3], marginBottom: stylesPublic.spacing.scale[5] }}>
                  <div>
                    <label
                      style={{
                        ...stylesPublic.typography.body.small,
                        fontWeight: stylesPublic.typography.weights.semibold,
                        display: "block",
                        marginBottom: stylesPublic.spacing.scale[1],
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
                      placeholder="Ej: 55 1234 5678"
                      style={{ ...stylesPublic.components.input.base, fontSize: "0.9rem", padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]}` }}
                    />
                  </div>
                  <div>
                    <label
                      style={{
                        ...stylesPublic.typography.body.small,
                        fontWeight: stylesPublic.typography.weights.semibold,
                        display: "block",
                        marginBottom: stylesPublic.spacing.scale[1],
                      }}
                      htmlFor="password"
                    >
                      Contraseña{" "}
                      {editingUserId ? (
                        <span style={{ color: stylesPublic.colors.text.tertiary, fontWeight: 500 }}>(opcional)</span>
                      ) : (
                        <span style={{ color: stylesPublic.colors.semantic.error.main }}>*</span>
                      )}
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleFormChange}
                        required={!editingUserId}
                        placeholder={editingUserId ? "Nueva contraseña (opcional)" : "Ingrese una contraseña segura"}
                        style={{
                          ...stylesPublic.components.input.base,
                          fontSize: "0.9rem",
                          padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]}`,
                          paddingRight: 36
                        }}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowPassword((v) => !v)}
                        style={{
                          position: "absolute",
                          top: "50%",
                          right: 8,
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          padding: 0,
                          margin: 0,
                          cursor: "pointer",
                          color: stylesPublic.colors.text.secondary,
                          fontSize: 18,
                          display: "flex",
                          alignItems: "center"
                        }}
                        tabIndex={-1}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                    {formData.password && renderPasswordValidation()}
                  </div>
                </div>
                
                <div
                  style={{
                    display: "flex",
                    gap: stylesPublic.spacing.scale[3],
                    justifyContent: "flex-end",
                    paddingTop: stylesPublic.spacing.scale[3],
                    borderTop: `1px solid ${stylesPublic.borders.colors.default}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={cerrarFormulario}
                    style={{
                      ...stylesPublic.components.button.variants.ghost,
                      ...stylesPublic.components.button.sizes.sm,
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading || (formData.password && !Object.values(passwordValidation).every(valid => valid))}
                    style={{
                      ...stylesPublic.components.button.variants.primary,
                      ...stylesPublic.components.button.sizes.sm,
                      ...(formLoading || (formData.password && !Object.values(passwordValidation).every(valid => valid))
                        ? {
                            backgroundColor: stylesPublic.colors.neutral[300],
                            color: stylesPublic.colors.text.muted,
                            cursor: "not-allowed",
                            boxShadow: "none",
                          }
                        : {}),
                    }}
                  >
                    {formLoading ? "Guardando..." : editingUserId ? "Guardar Cambios" : "Guardar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal de confirmación de borrado (antes window.confirm) */}
        {confirmacion && (
          <div style={stylesPublic.utils.overlay.base}>
            <div
              style={{
                ...stylesPublic.components.card.base,
                borderRadius: "18px",
                border: "none",
                boxShadow: "0 24px 70px rgba(45, 40, 35, 0.3)",
                maxWidth: "420px",
                width: "90%",
                margin: stylesPublic.spacing.margins.auto,
                padding: stylesPublic.spacing.scale[6],
                textAlign: "center",
              }}
            >
              <FaTrash
                size={40}
                style={{ color: stylesPublic.colors.semantic.error.main, marginBottom: stylesPublic.spacing.scale[4] }}
              />
              <h2 style={{ ...stylesPublic.typography.headings.h2, fontSize: "1.4rem", margin: 0 }}>
                ¿Eliminar usuario?
              </h2>
              <p
                style={{
                  ...stylesPublic.typography.body.base,
                  color: stylesPublic.colors.text.secondary,
                  marginTop: stylesPublic.spacing.scale[3],
                }}
              >
                <strong>{confirmacion.nombre}</strong>
              </p>
              <p
                style={{
                  ...stylesPublic.typography.body.caption,
                  color: stylesPublic.colors.text.muted,
                  fontStyle: "italic",
                  marginTop: stylesPublic.spacing.scale[2],
                  marginBottom: stylesPublic.spacing.scale[5],
                }}
              >
                Esta acción no se puede deshacer.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: stylesPublic.spacing.scale[3] }}>
                <button
                  type="button"
                  onClick={() => setConfirmacion(null)}
                  disabled={confirmLoading}
                  style={{
                    ...stylesPublic.components.button.variants.ghost,
                    ...stylesPublic.components.button.sizes.sm,
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={ejecutarEliminacion}
                  disabled={confirmLoading}
                  style={{
                    ...stylesPublic.components.button.variants.primary,
                    ...stylesPublic.components.button.sizes.sm,
                    backgroundColor: stylesPublic.colors.semantic.error.main,
                    borderColor: stylesPublic.colors.semantic.error.main,
                  }}
                >
                  {confirmLoading ? "Eliminando..." : "Eliminar"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover de filas/acciones y estados de foco (las clases sí existen en el DOM) */}
      <style>
        {`
          .users-action-btn:hover {
            transform: scale(1.05);
            opacity: 0.9;
          }
          .users-row:hover {
            background-color: ${stylesPublic.colors.neutral[50]};
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