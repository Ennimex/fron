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
  FaBoxes,
  FaChevronDown,
  FaPlus,
  FaTags,
  FaRuler,
  FaMapMarkerAlt,
  FaImages,
  FaImage,
  FaVideo,
} from "react-icons/fa"
import { colors, typography } from "../../styles/styles"

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
    navigate("/login")
  }, [logout, navigate])

  // Toggle submenu
  const toggleSubmenu = (menu) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  // Styles with improvements
  const styles = {
    sidebar: {
      width: isCollapsed ? "70px" : "280px",
      height: "100vh",
      backgroundColor: "#0D1B2A",
      color: colors.white,
      transition: "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      position: "fixed",
      left: 0,
      zIndex: 1000,
      overflowX: "hidden",
      overflowY: "auto",
      boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
      WebkitOverflowScrolling: "touch",
      userSelect: isTransitioning ? "none" : "auto",
    },
    logo: {
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#0D1B2A",
      borderBottom: `1px solid rgba(255,255,255,0.1)`,
      position: "sticky",
      top: 0,
      zIndex: 10,
    },
    toggleButton: {
      background: "none",
      border: "none",
      color: colors.white,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      width: "100%",
      height: "56px",
      transition: "background-color 0.2s ease",
    },
    menuItems: {
      padding: 0,
      listStyle: "none",
      margin: 0,
      marginTop: "10px",
      flexGrow: 1,
    },
    menuItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "4px",
    },
    menuLink: {
      display: "flex",
      alignItems: "center",
      justifyContent: isCollapsed ? "center" : "flex-start",
      color: colors.white,
      textDecoration: "none",
      fontFamily: typography.fontSecondary,
      position: "relative",
      width: "100%",
      padding: isCollapsed ? "0" : "0 20px",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      height: "48px",
      cursor: "pointer",
    },
    menuLinkActive: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      fontWeight: "bold",
      borderRight: "3px solid #ffffff",
    },
    menuLinkHover: {
      backgroundColor: "rgba(255, 255, 255, 0.08)",
    },
    menuIcon: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.2s ease",
      color: "white",
      width: "70px",
      minWidth: "70px",
      height: "48px",
    },
    menuText: {
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      whiteSpace: "nowrap",
      fontSize: "13px",
      fontWeight: 500,
      width: isCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    submenuContainer: {
      width: "100%",
      maxHeight: isCollapsed ? "0" : "auto",
      transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease",
      opacity: isCollapsed ? 0 : 1,
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      overflow: "hidden",
    },
    submenuItem: {
      paddingLeft: "30px",
      margin: "2px 0",
      width: "100%",
    },
    submenuLink: {
      display: "flex",
      alignItems: "center",
      padding: "10px 10px 10px 50px",
      color: colors.white,
      textDecoration: "none",
      fontFamily: typography.fontSecondary,
      fontSize: "12px",
      transition: "background-color 0.2s ease",
      borderRadius: "4px",
      margin: "2px 10px",
      width: "calc(100% - 20px)",
    },
    submenuLinkActive: {
      backgroundColor: "rgba(255, 255, 255, 0.15)",
      fontWeight: "bold",
    },
    submenuLinkHover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    submenuText: {
      marginLeft: "8px",
      whiteSpace: "nowrap",
    },
    menuToggle: {
      position: "absolute",
      right: "20px",
      visibility: isCollapsed ? "hidden" : "visible",
      opacity: isCollapsed ? 0 : 1,
      transition: "opacity 0.2s ease, visibility 0.2s ease",
      color: colors.white,
    },
    footer: {
      padding: isCollapsed ? "10px 0" : "15px 20px",
      borderTop: `1px solid rgba(255,255,255,0.1)`,
      textAlign: isCollapsed ? "center" : "left",
      position: "sticky",
      bottom: 0,
      width: "100%",
      backgroundColor: "#0D1B2A",
      zIndex: 10,
    },
    logoutBtn: {
      display: "flex",
      alignItems: "center",
      padding: isCollapsed ? "10px 0" : "10px",
      color: colors.white,
      textDecoration: "none",
      width: "100%",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      fontFamily: typography.fontSecondary,
      fontSize: "13px",
      justifyContent: isCollapsed ? "center" : "flex-start",
      height: "40px",
      transition: "background-color 0.2s ease",
    },
    logoutText: {
      marginLeft: "8px",
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: "opacity 0.2s ease, visibility 0.2s ease",
      whiteSpace: "nowrap",
      width: isCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    userInfo: {
      padding: isCollapsed ? "10px" : "10px 20px",
      borderBottom: "1px solid rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: isCollapsed ? "center" : "space-between",
      color: "white",
      position: "sticky",
      top: "56px",
      backgroundColor: "#0D1B2A",
      zIndex: 9,
    },
    userName: {
      fontSize: isCollapsed ? "0" : "0.85rem",
      opacity: isCollapsed ? 0 : 0.9,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: "opacity 0.2s ease, visibility 0.2s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "140px",
    },
    userAvatar: {
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#3498db",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.85rem",
      fontWeight: "bold",
      flexShrink: 0,
    },
    submenuIcon: {
      transition: "transform 0.3s ease",
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
      <div style={styles.logo}>
        <button
          style={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
          aria-expanded={!isCollapsed}
        >
          <FaBars size={20} color="white" />
        </button>
      </div>

      <div style={styles.userInfo}>
        {!isCollapsed && (
          <span style={styles.userName}>{user?.name || "Admin"}</span>
        )}
        <div style={styles.userAvatar}>
          {user?.name ? user.name[0].toUpperCase() : "A"}
        </div>
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
                    to="/admin/productos"
                    style={styles.submenuLink}
                    activeStyle={styles.submenuLinkActive}
                    exact
                  >
                    <FaBoxes size={14} />
                    <span style={styles.submenuText}>Todos los Productos</span>
                  </MenuLink>
                </div>
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
