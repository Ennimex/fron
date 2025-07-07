"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  FaTachometerAlt,
  FaUsers,
  FaHome,
  FaBars,
  FaSignOutAlt,
  FaTshirt,
  FaChevronDown,
  FaPlus,
  FaTags,
  FaRuler,
  FaMapMarkerAlt,
  FaImages,
  FaImage,
  FaVideo,
  FaCalendarAlt,
  FaInfoCircle,
  FaConciergeBell,
} from "react-icons/fa"
import stylesGlobal from "../../styles/stylesGlobal"

// Estilos CSS responsivos adicionales
const additionalStyles = `
  .sidebar-admin {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
  }
  
  .sidebar-admin::-webkit-scrollbar {
    width: 6px;
  }
  
  .sidebar-admin::-webkit-scrollbar-track {
    background: transparent;
  }
  
  .sidebar-admin::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 3px;
  }
  
  .sidebar-admin::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    .sidebar-admin {
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3) !important;
    }
  }
  
  .menu-link-hover:hover {
    background-color: rgba(255, 255, 255, 0.08) !important;
    transform: translateX(4px) !important;
  }
  
  .submenu-link-hover:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
    color: ${stylesGlobal.colors.text.inverse} !important;
    transform: translateX(4px) !important;
  }
`;

// Inyectar estilos CSS adicionales
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = additionalStyles;
  if (!document.head.querySelector('style[data-sidebar-admin-styles]')) {
    styleElement.setAttribute('data-sidebar-admin-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const SidebarAdmin = ({ collapsed, onToggle, isMobile = false, mobileMenuOpen = false }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // States - Simplificado para mejor control
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded-menus")
    return saved
      ? JSON.parse(saved)
      : {
          usuarios: false,
          productos: false,
          informacion: false,
          politicas: false,
          preguntas: false,
          galeria: false,
        }
  })

  // References
  const transitionTimeoutRef = useRef(null)

  // Sync with parent props
  useEffect(() => {
    setIsCollapsed(collapsed)
  }, [collapsed])

  // Authentication check
  useEffect(() => {
    if (!user?.isAuthenticated || user?.role !== "admin") {
      navigate("/login")
    }
  }, [user, navigate])

  // Save expanded menus
  useEffect(() => {
    localStorage.setItem("sidebar-expanded-menus", JSON.stringify(expandedMenus))
  }, [expandedMenus])

  // Toggle sidebar
  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      // En móvil, solo notificar al padre para manejar el overlay
      onToggle?.(!mobileMenuOpen)
      return
    }

    const newCollapsedState = !isCollapsed
    setIsTransitioning(true)
    setIsCollapsed(newCollapsedState)
    onToggle?.(newCollapsedState)

    localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsedState))

    if (newCollapsedState) {
      setExpandedMenus({
        usuarios: false,
        productos: false,
        informacion: false,
        politicas: false,
        preguntas: false,
        galeria: false,
      })
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }, [isCollapsed, isMobile, mobileMenuOpen, onToggle])

  const handleLogout = useCallback(() => {
    logout()
    navigate("/", { replace: true })
  }, [logout, navigate])

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    // No permitir expandir submenús si está colapsado y no es móvil
    if (isCollapsed && !isMobile) return
    
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [])

  // En móvil, cuando esté visible mostrar expandido; en desktop usar el estado normal
  const effectiveCollapsed = isMobile ? false : isCollapsed

  // Styles con stylesGlobal - variante dark elegante
  const styles = {
    sidebar: {
      ...stylesGlobal.components.sidebar.base,
      ...stylesGlobal.components.sidebar.variants.dark,
      ...(effectiveCollapsed ? stylesGlobal.components.sidebar.collapsed : {}),
      width: effectiveCollapsed ? "70px" : "280px",
      userSelect: isTransitioning ? "none" : "auto",
      WebkitOverflowScrolling: "touch",
      height: "100vh",
      position: "relative",
      zIndex: 1,
    },
    logo: {
      ...stylesGlobal.components.sidebar.header,
      height: "64px",
      backgroundColor: stylesGlobal.colors.neutral[900],
      borderBottom: `1px solid ${stylesGlobal.colors.neutral[700]}`,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    logoIcon: {
      ...stylesGlobal.components.sidebar.logoIcon,
      backgroundColor: stylesGlobal.colors.primary[500],
    },
    logoText: {
      ...stylesGlobal.components.sidebar.logoText,
      color: stylesGlobal.colors.text.inverse,
      opacity: effectiveCollapsed ? 0 : 1,
      visibility: effectiveCollapsed ? "hidden" : "visible",
    },
    toggleButton: {
      background: "none",
      border: "none",
      color: stylesGlobal.colors.text.inverse,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      width: "100%",
      height: "64px",
      transition: stylesGlobal.animations.transitions.base,
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }
    },
    content: {
      ...stylesGlobal.components.sidebar.content,
      padding: "1rem 0",
    },
    menuItems: {
      ...stylesGlobal.components.sidebar.nav,
      marginTop: "0",
      flexGrow: 1,
    },
    menuItem: {
      ...stylesGlobal.components.sidebar.navItem,
      marginBottom: "2px",
    },
    menuLink: {
      ...stylesGlobal.components.sidebar.navLink,
      justifyContent: effectiveCollapsed ? "center" : "flex-start",
      color: stylesGlobal.colors.text.inverse,
      fontFamily: stylesGlobal.typography.families.body,
      position: "relative",
      width: "100%",
      padding: effectiveCollapsed ? "0" : "0 1.5rem",
      height: "48px",
      cursor: "pointer",
      fontSize: "0.95rem",
      gap: "12px",
    },
    menuLinkActive: {
      color: stylesGlobal.colors.primary[400],
      backgroundColor: "rgba(214, 51, 132, 0.15)",
      fontWeight: 600,
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "3px",
        height: "24px",
        backgroundColor: stylesGlobal.colors.primary[400],
        borderRadius: "0 2px 2px 0",
      },
    },
    menuLinkHover: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
      transform: "translateX(4px)",
    },
    menuIcon: {
      ...stylesGlobal.components.sidebar.navIcon,
      color: "inherit",
      width: effectiveCollapsed ? "70px" : "20px",
      minWidth: effectiveCollapsed ? "70px" : "20px",
      height: "20px",
      fontSize: "1.1rem",
    },
    menuText: {
      ...stylesGlobal.components.sidebar.navText,
      opacity: effectiveCollapsed ? 0 : 1,
      visibility: effectiveCollapsed ? "hidden" : "visible",
      whiteSpace: "nowrap",
      fontSize: "0.95rem",
      fontWeight: 500,
      width: effectiveCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    submenuContainer: {
      width: "100%",
      maxHeight: (effectiveCollapsed || !expandedMenus) ? "0" : "auto",
      transition: stylesGlobal.animations.transitions.elegant,
      opacity: effectiveCollapsed ? 0 : 1,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      overflow: "hidden",
      borderRadius: stylesGlobal.borders.radius.md,
      margin: "4px 8px",
    },
    submenuItem: {
      margin: "2px 0",
      width: "100%",
    },
    submenuLink: {
      display: "flex",
      alignItems: "center",
      padding: "10px 16px 10px 3rem",
      color: stylesGlobal.colors.neutral[300],
      textDecoration: "none",
      fontFamily: stylesGlobal.typography.families.body,
      fontSize: "0.875rem",
      transition: stylesGlobal.animations.transitions.base,
      borderRadius: stylesGlobal.borders.radius.md,
      margin: "2px 8px",
      width: "calc(100% - 16px)",
      gap: "8px",
    },
    submenuLinkActive: {
      color: stylesGlobal.colors.primary[400],
      backgroundColor: "rgba(214, 51, 132, 0.1)",
      fontWeight: 600,
    },
    submenuLinkHover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      color: stylesGlobal.colors.text.inverse,
      transform: "translateX(4px)",
    },
    submenuText: {
      whiteSpace: "nowrap",
    },
    menuToggle: {
      position: "absolute",
      right: "1.5rem",
      visibility: effectiveCollapsed ? "hidden" : "visible",
      opacity: effectiveCollapsed ? 0 : 1,
      transition: stylesGlobal.animations.transitions.base,
      color: stylesGlobal.colors.text.inverse,
      fontSize: "0.875rem",
    },
    footer: {
      ...stylesGlobal.components.sidebar.footer,
      padding: effectiveCollapsed ? "1rem 0" : "1rem 1.5rem",
      borderTop: `1px solid ${stylesGlobal.colors.neutral[700]}`,
      textAlign: effectiveCollapsed ? "center" : "left",
      position: "sticky",
      bottom: 0,
      width: "100%",
      backgroundColor: stylesGlobal.colors.neutral[900],
      zIndex: 10,
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      padding: effectiveCollapsed ? "12px 0" : "12px 16px",
      color: stylesGlobal.colors.text.inverse,
      textDecoration: "none",
      width: "100%",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontFamily: stylesGlobal.typography.families.body,
      fontSize: "0.95rem",
      fontWeight: 500,
      justifyContent: effectiveCollapsed ? "center" : "flex-start",
      height: "48px",
      borderRadius: stylesGlobal.borders.radius.md,
      transition: stylesGlobal.animations.transitions.base,
      gap: "12px",
      "&:hover": {
        backgroundColor: "rgba(225, 29, 72, 0.1)",
        color: stylesGlobal.colors.semantic.error.main,
      }
    },
    logoutText: {
      opacity: effectiveCollapsed ? 0 : 1,
      visibility: effectiveCollapsed ? "hidden" : "visible",
      transition: stylesGlobal.animations.transitions.base,
      whiteSpace: "nowrap",
      width: effectiveCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    userInfo: {
      padding: effectiveCollapsed ? "1rem" : "1rem 1.5rem",
      borderBottom: `1px solid ${stylesGlobal.colors.neutral[700]}`,
      display: "flex",
      alignItems: "center",
      justifyContent: effectiveCollapsed ? "center" : "flex-start",
      color: stylesGlobal.colors.text.inverse,
      position: "sticky",
      top: "64px",
      backgroundColor: stylesGlobal.colors.neutral[900],
      zIndex: 9,
      gap: "12px",
    },
    userName: {
      fontSize: effectiveCollapsed ? "0" : "0.9rem",
      opacity: effectiveCollapsed ? 0 : 0.9,
      visibility: effectiveCollapsed ? "hidden" : "visible",
      transition: stylesGlobal.animations.transitions.base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "160px",
      fontWeight: 500,
    },
    userAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      backgroundColor: stylesGlobal.colors.primary[500],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.9rem",
      fontWeight: 700,
      flexShrink: 0,
      color: stylesGlobal.colors.text.inverse,
      boxShadow: stylesGlobal.shadows.sm,
    },
    submenuIcon: {
      transition: stylesGlobal.animations.transitions.base,
      fontSize: "0.75rem",
    },
  }

  const isActive = useCallback(
    (path, exact = false) => {
      if (exact) {
        return location.pathname === path
      }
      return location.pathname.startsWith(path)
    },
    [location.pathname],
  )

  const MenuLink = ({ to, children, style, activeStyle, onClick, exact = false }) => {
    const active = isActive(to, exact)
    return (
      <Link
        to={to}
        style={{
          ...style,
          ...(active ? activeStyle : {}),
        }}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }

  return (
    <div style={styles.sidebar} className="sidebar-admin">
      {/* Header con botón toggle para desktop */}
      <div style={styles.logo}>
        {!effectiveCollapsed ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "0 1.5rem",
            width: "100%",
          }}>
            {/* Botón toggle solo en desktop */}
            {!isMobile && (
              <button
                style={{
                  ...styles.toggleButton,
                  width: "auto",
                  height: "auto",
                  padding: "8px",
                  borderRadius: stylesGlobal.borders.radius.md,
                }}
                onClick={toggleSidebar}
                aria-label="Colapsar menú"
                aria-expanded={!effectiveCollapsed}
              >
                <FaBars size={16} />
              </button>
            )}
          </div>
        ) : (
          // Botón expandir solo en desktop cuando está colapsado
          !isMobile && (
            <button
              style={styles.toggleButton}
              onClick={toggleSidebar}
              aria-label="Expandir menú"
              aria-expanded={!effectiveCollapsed}
            >
              <FaBars size={16} />
            </button>
          )
        )}
      </div>

      {/* Información del usuario */}
      <div style={styles.userInfo}>
        <div style={styles.userAvatar}>
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </div>
        {!effectiveCollapsed && (
          <span style={styles.userName}>{user?.name || "Admin"}</span>
        )}
      </div>

      <ul style={styles.menuItems}>
        {user?.role === "admin" && (
          <>
            <li style={styles.menuItem}>
              <MenuLink
                to="/admin"
                style={styles.menuLink}
                activeStyle={styles.menuLinkActive}
                exact
              >
                <span style={styles.menuIcon}>
                  <FaTachometerAlt size={20} />
                </span>
                <span style={styles.menuText}>Dashboard</span>
              </MenuLink>
            </li>

            <li style={styles.menuItem}>
              <MenuLink
                to="/admin/usuarios"
                style={styles.menuLink}
                activeStyle={styles.menuLinkActive}
              >
                <span style={styles.menuIcon}>
                  <FaUsers size={20} />
                </span>
                <span style={styles.menuText}>Usuarios</span>
              </MenuLink>
            </li>

            <li style={styles.menuItem}>
              <div
                style={{
                  ...styles.menuLink,
                  ...(isActive("/admin/productos") ? styles.menuLinkActive : {})
                }}
                className="menu-link-hover"
                onClick={() => toggleSubmenu("productos")}
                role="button"
                aria-expanded={expandedMenus.productos}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && toggleSubmenu("productos")
                }
              >
                <span style={styles.menuIcon}>
                  <FaTshirt size={20} />
                </span>
                <span style={styles.menuText}>Productos</span>
                {!effectiveCollapsed && (
                  <span style={styles.menuToggle}>
                    <FaChevronDown
                      size={12}
                      style={{
                        ...styles.submenuIcon,
                        transform: expandedMenus.productos
                          ? "rotate(0deg)"
                          : "rotate(-90deg)"
                      }}
                    />
                  </span>
                )}
              </div>

              <div
                style={{
                  ...styles.submenuContainer,
                  maxHeight:
                    expandedMenus.productos && !effectiveCollapsed ? "1000px" : "0",
                  opacity: expandedMenus.productos && !effectiveCollapsed ? 1 : 0
                }}
              >
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/productos/nuevo"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaPlus size={14} />
                    <span style={styles.submenuText}>Agregar Nuevo</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/productos/categorias"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaTags size={14} />
                    <span style={styles.submenuText}>Categorías</span>
                  </MenuLink>
                </div>

                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/productos/tallas"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaRuler size={14} />
                    <span style={styles.submenuText}>Gestión de Tallas</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/localidades"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaMapMarkerAlt size={14} />
                    <span style={styles.submenuText}>
                      Gestion de Localidades
                    </span>
                  </MenuLink>
                </div>
              </div>
            </li>

            {/* Nuevo menú de Galería */}
            <li style={styles.menuItem}>
              <div
                style={{
                  ...styles.menuLink,
                  ...(isActive("/admin/galeria") ? styles.menuLinkActive : {})
                }}
                onClick={() => toggleSubmenu("galeria")}
                role="button"
                aria-expanded={expandedMenus.galeria}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && toggleSubmenu("galeria")
                }
              >
                <span style={styles.menuIcon}>
                  <FaImages size={20} />
                </span>
                <span style={styles.menuText}>Galería</span>
                {!effectiveCollapsed && (
                  <span style={styles.menuToggle}>
                    <FaChevronDown
                      size={12}
                      style={{
                        ...styles.submenuIcon,
                        transform: expandedMenus.galeria
                          ? "rotate(0deg)"
                          : "rotate(-90deg)"
                      }}
                    />
                  </span>
                )}
              </div>

              <div
                style={{
                  ...styles.submenuContainer,
                  maxHeight:
                    expandedMenus.galeria && !effectiveCollapsed ? "1000px" : "0",
                  opacity: expandedMenus.galeria && !effectiveCollapsed ? 1 : 0
                }}
              >
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/galeria/fotos"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaImage size={14} />
                    <span style={styles.submenuText}>Gestión de Fotos</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/galeria/videos"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaVideo size={14} />
                    <span style={styles.submenuText}>Gestión de Videos</span>
                  </MenuLink>
                </div>
              </div>
            </li>

            {/* Nuevo menú de Eventos */}
            <li style={styles.menuItem}>
              <MenuLink
                to="/admin/eventos"
                style={styles.menuLink}
                activeStyle={styles.menuLinkActive}
              >
                <span style={styles.menuIcon}>
                  <FaCalendarAlt size={20} />
                </span>
                <span style={styles.menuText}>Eventos</span>
              </MenuLink>
            </li>

            {/* Nuevo menú de Información */}
            <li style={styles.menuItem}>
              <div
                style={{
                  ...styles.menuLink,
                  ...(isActive("/admin/informacion") ? styles.menuLinkActive : {})
                }}
                onClick={() => toggleSubmenu("informacion")}
                role="button"
                aria-expanded={expandedMenus.informacion}
                tabIndex={0}
                onKeyDown={(e) =>
                  e.key === "Enter" && toggleSubmenu("informacion")
                }
              >
                <span style={styles.menuIcon}>
                  <FaInfoCircle size={20} />
                </span>
                <span style={styles.menuText}>Información</span>
                {!effectiveCollapsed && (
                  <span style={styles.menuToggle}>
                    <FaChevronDown
                      size={12}
                      style={{
                        ...styles.submenuIcon,
                        transform: expandedMenus.informacion
                          ? "rotate(0deg)"
                          : "rotate(-90deg)"
                      }}
                    />
                  </span>
                )}
              </div>

              <div
                style={{
                  ...styles.submenuContainer,
                  maxHeight:
                    expandedMenus.informacion && !effectiveCollapsed ? "1000px" : "0",
                  opacity: expandedMenus.informacion && !effectiveCollapsed ? 1 : 0
                }}
              >
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/informacion/mision"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaInfoCircle size={14} />
                    <span style={styles.submenuText}>Misión y Visión</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/informacion/servicios"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaConciergeBell size={14} />
                    <span style={styles.submenuText}>Servicios</span>
                  </MenuLink>
                </div>
              </div>
            </li>
          </>
        )}

        <li style={styles.menuItem}>
          <MenuLink
            to="/"
            style={styles.menuLink}
            activeStyle={styles.menuLinkActive}
          >
            <span style={styles.menuIcon}>
              <FaHome size={20} />
            </span>
            <span style={styles.menuText}>Ir al Sitio</span>
          </MenuLink>
        </li>

        <li style={styles.footer}>
          <button
            onClick={handleLogout}
            style={styles.logoutBtn}
            aria-label="Cerrar sesión"
          >
            <span style={styles.menuIcon}>
              <FaSignOutAlt size={20} />
            </span>
            <span style={styles.logoutText}>Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </div>
  );
}

export default SidebarAdmin
