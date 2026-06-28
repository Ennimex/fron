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
  FaCog,
  FaBook,
  FaUserFriends,
  FaClipboardList,
} from "react-icons/fa"
import stylesGlobal from "../../styles/stylesGlobal"
import adminTheme from "../../styles/adminTheme"

// Estilos CSS responsivos adicionales (tema claro / crema)
const additionalStyles = `
  .sidebar-admin-nav {
    scrollbar-width: thin;
    scrollbar-color: ${stylesGlobal.colors.neutral[300]} transparent;
  }

  .sidebar-admin-nav::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar-admin-nav::-webkit-scrollbar-track {
    background: transparent;
  }

  .sidebar-admin-nav::-webkit-scrollbar-thumb {
    background-color: ${stylesGlobal.colors.neutral[300]};
    border-radius: 3px;
  }

  .sidebar-admin-nav::-webkit-scrollbar-thumb:hover {
    background-color: ${stylesGlobal.colors.neutral[400]};
  }

  @media (max-width: 768px) {
    .sidebar-admin {
      box-shadow: 2px 0 16px rgba(42, 36, 31, 0.12) !important;
    }
  }

  .menu-link-hover:hover {
    background-color: ${adminTheme.hover} !important;
  }

  .submenu-link-hover:hover {
    background-color: ${adminTheme.hover} !important;
    color: ${adminTheme.primary} !important;
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
    // Para GitHub Pages, usar window.location en lugar de navigate
    if (window.location.hostname.includes('github.io')) {
      window.location.href = window.location.origin + (window.location.pathname.split('/')[1] ? `/${window.location.pathname.split('/')[1]}` : '/');
    } else {
      navigate("/", { replace: true })
    }
  }, [logout, navigate])

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    // Si está colapsado en desktop, expandir el sidebar y abrir ese grupo
    // (de lo contrario los submenús quedarían inaccesibles al estar colapsado)
    if (isCollapsed && !isMobile) {
      setIsCollapsed(false)
      onToggle?.(false)
      localStorage.setItem("sidebar-collapsed", JSON.stringify(false))
      setExpandedMenus({
        usuarios: false,
        productos: false,
        informacion: false,
        politicas: false,
        preguntas: false,
        galeria: false,
        [menu]: true,
      })
      return
    }

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

  // Styles con stylesGlobal + adminTheme — variante clara (crema)
  const styles = {
    sidebar: {
      ...stylesGlobal.components.sidebar.base,
      width: effectiveCollapsed ? "76px" : "260px",
      backgroundColor: adminTheme.surface,
      borderRight: `1px solid ${adminTheme.border}`,
      boxShadow: "none",
      userSelect: isTransitioning ? "none" : "auto",
      WebkitOverflowScrolling: "touch",
      height: "100vh",
      position: "relative",
      zIndex: 1,
    },
    logo: {
      display: "flex",
      alignItems: "center",
      justifyContent: effectiveCollapsed ? "center" : "space-between",
      height: "78px",
      padding: effectiveCollapsed ? "0" : "0 18px",
      backgroundColor: adminTheme.surface,
      borderBottom: `1px solid ${adminTheme.border}`,
      flexShrink: 0,
    },
    brandLink: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      textDecoration: "none",
      overflow: "hidden",
      flex: 1,
      minWidth: 0,
      marginRight: "8px",
    },
    logoIcon: {
      width: "36px",
      height: "36px",
      borderRadius: "10px",
      background: stylesGlobal.colors.gradients.primary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: stylesGlobal.colors.text.inverse,
      fontFamily: adminTheme.serif,
      fontWeight: 800,
      fontSize: "18px",
      flexShrink: 0,
    },
    logoText: {
      fontFamily: adminTheme.serif,
      fontSize: "15px",
      fontWeight: 800,
      color: adminTheme.text,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    toggleButton: {
      background: "none",
      border: "none",
      color: adminTheme.text2,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "8px",
      borderRadius: "10px",
      transition: stylesGlobal.animations.transitions.base,
    },
    scrollArea: {
      flex: 1,
      minHeight: 0,
      overflowY: "auto",
      overflowX: "hidden",
    },
    menuItems: {
      listStyle: "none",
      margin: 0,
      padding: "12px 12px",
      display: "flex",
      flexDirection: "column",
      gap: "2px",
    },
    menuItem: {
      listStyle: "none",
      marginBottom: "2px",
    },
    menuLink: {
      display: "flex",
      alignItems: "center",
      justifyContent: effectiveCollapsed ? "center" : "flex-start",
      gap: "11px",
      color: adminTheme.text2,
      textDecoration: "none",
      fontFamily: adminTheme.body,
      position: "relative",
      width: "100%",
      padding: effectiveCollapsed ? "0" : "0 12px",
      height: "44px",
      cursor: "pointer",
      fontSize: "0.85rem",
      fontWeight: 500,
      borderRadius: "12px",
      transition: stylesGlobal.animations.transitions.base,
    },
    menuLinkActive: {
      color: adminTheme.primary,
      backgroundColor: adminTheme.primarySoft,
      fontWeight: 600,
    },
    menuLinkHover: {
      backgroundColor: adminTheme.hover,
    },
    menuIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "inherit",
      width: "20px",
      minWidth: "20px",
      height: "20px",
      fontSize: "1rem",
    },
    menuText: {
      opacity: effectiveCollapsed ? 0 : 1,
      visibility: effectiveCollapsed ? "hidden" : "visible",
      whiteSpace: "nowrap",
      fontSize: "0.85rem",
      fontWeight: 500,
      width: effectiveCollapsed ? 0 : "auto",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    submenuContainer: {
      width: "auto",
      maxHeight: "0",
      transition: stylesGlobal.animations.transitions.elegant,
      opacity: 0,
      backgroundColor: stylesGlobal.colors.neutral[50],
      overflow: "hidden",
      borderRadius: stylesGlobal.borders.radius.lg,
      margin: "2px 6px",
    },
    submenuItem: {
      margin: "2px 0",
      width: "100%",
      listStyle: "none",
    },
    submenuLink: {
      display: "flex",
      alignItems: "center",
      padding: "9px 12px 9px 40px",
      color: adminTheme.text3,
      textDecoration: "none",
      fontFamily: adminTheme.body,
      fontSize: "0.8rem",
      transition: stylesGlobal.animations.transitions.base,
      borderRadius: stylesGlobal.borders.radius.md,
      margin: "2px 8px",
      width: "calc(100% - 16px)",
      gap: "8px",
    },
    submenuLinkActive: {
      color: adminTheme.primary,
      backgroundColor: adminTheme.primarySoft,
      fontWeight: 600,
    },
    submenuLinkHover: {
      backgroundColor: adminTheme.hover,
      color: adminTheme.primary,
    },
    submenuText: {
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      flex: 1,
      minWidth: 0,
    },
    menuToggle: {
      position: "absolute",
      right: "14px",
      visibility: effectiveCollapsed ? "hidden" : "visible",
      opacity: effectiveCollapsed ? 0 : 1,
      transition: stylesGlobal.animations.transitions.base,
      color: adminTheme.text3,
      fontSize: "0.8rem",
    },
    footer: {
      padding: effectiveCollapsed ? "12px 8px" : "12px 14px",
      borderTop: `1px solid ${adminTheme.border}`,
      textAlign: effectiveCollapsed ? "center" : "left",
      width: "100%",
      backgroundColor: adminTheme.surface,
      flexShrink: 0,
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      padding: effectiveCollapsed ? "12px 0" : "12px 14px",
      color: stylesGlobal.colors.semantic.error.main,
      textDecoration: "none",
      width: "100%",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontFamily: adminTheme.body,
      fontSize: "0.85rem",
      fontWeight: 500,
      justifyContent: effectiveCollapsed ? "center" : "flex-start",
      height: "44px",
      borderRadius: "12px",
      transition: stylesGlobal.animations.transitions.base,
      gap: "11px",
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
      padding: effectiveCollapsed ? "16px 0" : "16px 18px",
      borderBottom: `1px solid ${adminTheme.border}`,
      display: "flex",
      alignItems: "center",
      justifyContent: effectiveCollapsed ? "center" : "flex-start",
      backgroundColor: adminTheme.surface,
      gap: "12px",
      flexShrink: 0,
    },
    userName: {
      fontSize: effectiveCollapsed ? "0" : "0.9rem",
      color: adminTheme.text,
      opacity: effectiveCollapsed ? 0 : 1,
      visibility: effectiveCollapsed ? "hidden" : "visible",
      transition: stylesGlobal.animations.transitions.base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
      fontWeight: 600,
    },
    userAvatar: {
      width: "38px",
      height: "38px",
      borderRadius: "50%",
      background: stylesGlobal.colors.gradients.luxury,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.9rem",
      fontWeight: 700,
      flexShrink: 0,
      color: stylesGlobal.colors.text.inverse,
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
      {/* Header con la marca y el botón de colapsar */}
      <div style={styles.logo}>
        {effectiveCollapsed ? (
          // Colapsado: solo el botón para expandir (desktop)
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
        ) : (
          <>
            <Link to="/admin" style={styles.brandLink}>
              <span style={styles.logoIcon}>A</span>
              <span style={styles.logoText}>La Aterciopelada</span>
            </Link>
            {!isMobile && (
              <button
                style={styles.toggleButton}
                onClick={toggleSidebar}
                aria-label="Colapsar menú"
                aria-expanded={!effectiveCollapsed}
              >
                <FaBars size={16} />
              </button>
            )}
          </>
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

      {/* Zona con scroll: solo el menú navega, el header y el footer quedan fijos */}
      <nav style={styles.scrollArea} className="sidebar-admin-nav">
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
              <MenuLink
                to="/admin/solicitudes"
                style={styles.menuLink}
                activeStyle={styles.menuLinkActive}
              >
                <span style={styles.menuIcon}>
                  <FaClipboardList size={20} />
                </span>
                <span style={styles.menuText}>Solicitudes</span>
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
                    <span style={styles.submenuText}>Tallas</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/localidades"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaMapMarkerAlt size={14} />
                    <span style={styles.submenuText}>Localidades</span>
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
                    <span style={styles.submenuText}>Fotos</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/galeria/videos"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaVideo size={14} />
                    <span style={styles.submenuText}>Videos</span>
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
                    to="/admin/informacion/nosotros"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaBook size={14} />
                    <span style={styles.submenuText}>Historia y Valores</span>
                  </MenuLink>
                </div>
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/informacion/colaboradores"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaUserFriends size={14} />
                    <span style={styles.submenuText}>Colaboradores</span>
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
                <div style={styles.submenuItem}>
                  <MenuLink
                    to="/admin/configuracion"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                  >
                    <FaCog size={14} />
                    <span style={styles.submenuText}>Configuración</span>
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

      </ul>
      </nav>

      {/* Footer fijo: cerrar sesión */}
      <div style={styles.footer}>
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
      </div>
    </div>
  );
}

export default SidebarAdmin
