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

const SidebarAdmin = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // States
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [isMobile, setIsMobile] = useState(false)
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
  const resizeTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)

  // Handle resize with debounce
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    resizeTimeoutRef.current = setTimeout(() => {
      const newIsMobile = window.innerWidth < 768
      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)
        if (newIsMobile) {
          setIsCollapsed(true)
          onToggle?.(true)
        } else {
          const savedCollapsed = localStorage.getItem("sidebar-collapsed")
          const shouldCollapse = savedCollapsed ? JSON.parse(savedCollapsed) : collapsed
          setIsCollapsed(shouldCollapse)
          onToggle?.(shouldCollapse)
        }
      }
    }, 150)
  }, [isMobile, collapsed, onToggle])

  // Initial setup
  useEffect(() => {
    const checkInitialState = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)
      if (!newIsMobile) {
        const savedCollapsed = localStorage.getItem("sidebar-collapsed")
        const initialCollapsed = savedCollapsed ? JSON.parse(savedCollapsed) : collapsed
        setIsCollapsed(initialCollapsed)
      } else {
        setIsCollapsed(true)
      }
    }

    checkInitialState()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current)
      if (transitionTimeoutRef.current) clearTimeout(transitionTimeoutRef.current)
    }
  }, [handleResize, collapsed])

  // Sync with prop
  useEffect(() => {
    if (!isMobile && collapsed !== isCollapsed) {
      setIsCollapsed(collapsed)
    }
  }, [collapsed, isMobile, isCollapsed])

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
    const newCollapsedState = !isCollapsed
    setIsTransitioning(true)
    setIsCollapsed(newCollapsedState)
    onToggle?.(newCollapsedState)

    if (!isMobile) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsedState))
    }

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
  }, [isCollapsed, isMobile, onToggle])

  const handleLogout = useCallback(() => {
    logout()
    navigate("/", { replace: true })
  }, [logout, navigate])

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // Styles con stylesGlobal - variante dark elegante
  const styles = {
    sidebar: {
      ...stylesGlobal.components.sidebar.base,
      ...stylesGlobal.components.sidebar.variants.dark,
      ...(isCollapsed ? stylesGlobal.components.sidebar.collapsed : {}),
      width: isCollapsed ? "70px" : "280px",
      userSelect: isTransitioning ? "none" : "auto",
      WebkitOverflowScrolling: "touch",
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
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
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
      justifyContent: isCollapsed ? "center" : "flex-start",
      color: stylesGlobal.colors.text.inverse,
      fontFamily: stylesGlobal.typography.families.body,
      position: "relative",
      width: "100%",
      padding: isCollapsed ? "0" : "0 1.5rem",
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
      width: isCollapsed ? "70px" : "20px",
      minWidth: isCollapsed ? "70px" : "20px",
      height: "20px",
      fontSize: "1.1rem",
    },
    menuText: {
      ...stylesGlobal.components.sidebar.navText,
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
      whiteSpace: "nowrap",
      fontSize: "0.95rem",
      fontWeight: 500,
      width: isCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    submenuContainer: {
      width: "100%",
      maxHeight: (isCollapsed || !expandedMenus) ? "0" : "auto",
      transition: stylesGlobal.animations.transitions.elegant,
      opacity: isCollapsed ? 0 : 1,
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
      visibility: isCollapsed ? "hidden" : "visible",
      opacity: isCollapsed ? 0 : 1,
      transition: stylesGlobal.animations.transitions.base,
      color: stylesGlobal.colors.text.inverse,
      fontSize: "0.875rem",
    },
    footer: {
      ...stylesGlobal.components.sidebar.footer,
      padding: isCollapsed ? "1rem 0" : "1rem 1.5rem",
      borderTop: `1px solid ${stylesGlobal.colors.neutral[700]}`,
      textAlign: isCollapsed ? "center" : "left",
      position: "sticky",
      bottom: 0,
      width: "100%",
      backgroundColor: stylesGlobal.colors.neutral[900],
      zIndex: 10,
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      padding: isCollapsed ? "12px 0" : "12px 16px",
      color: stylesGlobal.colors.text.inverse,
      textDecoration: "none",
      width: "100%",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontFamily: stylesGlobal.typography.families.body,
      fontSize: "0.95rem",
      fontWeight: 500,
      justifyContent: isCollapsed ? "center" : "flex-start",
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
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: stylesGlobal.animations.transitions.base,
      whiteSpace: "nowrap",
      width: isCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    userInfo: {
      padding: isCollapsed ? "1rem" : "1rem 1.5rem",
      borderBottom: `1px solid ${stylesGlobal.colors.neutral[700]}`,
      display: "flex",
      alignItems: "center",
      justifyContent: isCollapsed ? "center" : "flex-start",
      color: stylesGlobal.colors.text.inverse,
      position: "sticky",
      top: "64px",
      backgroundColor: stylesGlobal.colors.neutral[900],
      zIndex: 9,
      gap: "12px",
    },
    userName: {
      fontSize: isCollapsed ? "0" : "0.9rem",
      opacity: isCollapsed ? 0 : 0.9,
      visibility: isCollapsed ? "hidden" : "visible",
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
    <div style={styles.sidebar}>
      {/* Header con logo elegante */}
      <div style={styles.logo}>
        {!isCollapsed ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "0 1.5rem",
            width: "100%",
          }}>
            <div style={styles.logoIcon}>
              LA
            </div>
            <span style={styles.logoText}>Panel Admin</span>
            <button
              style={{
                ...styles.toggleButton,
                marginLeft: "auto",
                width: "auto",
                height: "auto",
                padding: "8px",
                borderRadius: stylesGlobal.borders.radius.md,
              }}
              onClick={toggleSidebar}
              aria-label="Colapsar menú"
              aria-expanded={!isCollapsed}
            >
              <FaBars size={16} />
            </button>
          </div>
        ) : (
          <button
            style={styles.toggleButton}
            onClick={toggleSidebar}
            aria-label="Expandir menú"
            aria-expanded={!isCollapsed}
          >
            <div style={{
              ...styles.logoIcon,
              fontSize: "0.875rem",
              width: "28px",
              height: "28px",
            }}>
              LA
            </div>
          </button>
        )}
      </div>

      {/* Información del usuario */}
      <div style={styles.userInfo}>
        <div style={styles.userAvatar}>
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </div>
        {!isCollapsed && (
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
                {!isCollapsed && (
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
                    expandedMenus.productos && !isCollapsed ? "1000px" : "0",
                  opacity: expandedMenus.productos && !isCollapsed ? 1 : 0
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
                {!isCollapsed && (
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
                    expandedMenus.galeria && !isCollapsed ? "1000px" : "0",
                  opacity: expandedMenus.galeria && !isCollapsed ? 1 : 0
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
                {!isCollapsed && (
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
                    expandedMenus.informacion && !isCollapsed ? "1000px" : "0",
                  opacity: expandedMenus.informacion && !isCollapsed ? 1 : 0
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
