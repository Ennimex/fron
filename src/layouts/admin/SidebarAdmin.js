"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import {
  FaChartBar,
  FaUsers,
  FaNetworkWired,
  FaHome,
  FaChevronDown,
  FaChevronRight,
  FaBars,
  FaSignOutAlt,
} from "react-icons/fa"
import { colors, typography } from "../../styles/styles"

const SidebarAdmin = ({ collapsed, onToggle }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  // Estados mejorados para evitar colapsos inesperados
  const [isCollapsed, setIsCollapsed] = useState(collapsed)
  const [isMobile, setIsMobile] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Referencias para cleanup
  const resizeTimeoutRef = useRef(null)
  const transitionTimeoutRef = useRef(null)

  // Estado para controlar submenús expandidos con persistencia
  const [expandedMenus, setExpandedMenus] = useState(() => {
    const saved = localStorage.getItem("sidebar-expanded-menus")
    return saved
      ? JSON.parse(saved)
      : {
          usuarios: false,
          productos: false, // Cambiamos 'iot' por 'productos'
          informacion: false,
          politicas: false,
          preguntas: false,
        }
  })

  // Detectar tamaño de pantalla con debounce mejorado
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }

    resizeTimeoutRef.current = setTimeout(() => {
      const newIsMobile = window.innerWidth < 768

      if (newIsMobile !== isMobile) {
        setIsMobile(newIsMobile)

        if (newIsMobile) {
          // En móvil, colapsar automáticamente
          setIsCollapsed(true)
          onToggle?.(true)
        } else {
          // En desktop, restaurar estado previo
          const savedCollapsed = localStorage.getItem("sidebar-collapsed")
          const shouldCollapse = savedCollapsed ? JSON.parse(savedCollapsed) : collapsed
          setIsCollapsed(shouldCollapse)
          onToggle?.(shouldCollapse)
        }
      }
    }, 150)
  }, [isMobile, collapsed, onToggle])

  // Inicialización mejorada
  useEffect(() => {
    const checkInitialState = () => {
      const newIsMobile = window.innerWidth < 768
      setIsMobile(newIsMobile)

      if (!newIsMobile) {
        // Solo en desktop, usar estado guardado o prop
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

  // Sincronizar con prop solo si no es móvil
  useEffect(() => {
    if (!isMobile && collapsed !== isCollapsed) {
      setIsCollapsed(collapsed)
    }
  }, [collapsed, isMobile, isCollapsed])

  // Verificar autenticación
  useEffect(() => {
    if (!user?.isAuthenticated || user?.role !== "admin") {
      navigate("/login")
    }
  }, [user, navigate])

  // Guardar estado de menús expandidos
  useEffect(() => {
    localStorage.setItem("sidebar-expanded-menus", JSON.stringify(expandedMenus))
  }, [expandedMenus])

  // Función mejorada para alternar expansión de menús
  const toggleMenu = useCallback(
    (menu) => {
      if (isCollapsed && !isMobile) {
        // Si está colapsado en desktop, expandir sidebar primero
        setIsTransitioning(true)
        setIsCollapsed(false)
        onToggle?.(false)
        localStorage.setItem("sidebar-collapsed", "false")

        // Después de la transición, expandir el menú
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current)
        }

        transitionTimeoutRef.current = setTimeout(() => {
          setExpandedMenus((prev) => ({
            ...prev,
            [menu]: !prev[menu],
          }))
          setIsTransitioning(false)
        }, 300)
      } else {
        // Comportamiento normal
        setExpandedMenus((prev) => ({
          ...prev,
          [menu]: !prev[menu],
        }))
      }
    },
    [isCollapsed, isMobile, onToggle],
  )

  // Función mejorada para toggle de sidebar
  const toggleSidebar = useCallback(() => {
    const newCollapsedState = !isCollapsed

    setIsTransitioning(true)
    setIsCollapsed(newCollapsedState)
    onToggle?.(newCollapsedState)

    // Guardar estado solo en desktop
    if (!isMobile) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(newCollapsedState))
    }

    if (newCollapsedState) {
      // Colapsar todos los submenús cuando se colapsa la barra lateral
      setExpandedMenus({
        usuarios: false,
        productos: false,
        informacion: false,
        politicas: false,
        preguntas: false,
      })
    }

    // Reset transitioning state
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current)
    }

    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false)
    }, 300)
  }, [isCollapsed, isMobile, onToggle])

  const handleLogout = useCallback(() => {
    logout()
    navigate("/login")
  }, [logout, navigate])

  // Estilos mejorados con mejor responsividad
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
      // Mejorar scroll en móvil
      WebkitOverflowScrolling: "touch",
      // Evitar selección de texto durante transiciones
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
      ":hover": {
        backgroundColor: "rgba(255,255,255,0.1)",
      },
    },
    menuItems: {
      padding: 0,
      listStyle: "none",
      margin: 0,
      marginTop: "20px",
    },
    menuItem: {
      overflow: "hidden",
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
      height: "56px",
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
      height: "56px",
    },
    menuText: {
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      whiteSpace: "nowrap",
      fontSize: "14px",
      fontWeight: 500,
      width: isCollapsed ? 0 : "auto",
      overflow: "hidden",
      transform: isCollapsed ? "translateX(-10px)" : "translateX(0)",
    },
    submenuContainer: {
      overflow: "hidden",
      maxHeight: isCollapsed
        ? "0"
        : expandedMenus.usuarios ||
            expandedMenus.productos ||
            expandedMenus.informacion ||
            expandedMenus.politicas ||
            expandedMenus.preguntas
          ? "500px"
          : "0",
      transition: "max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      backgroundColor: "rgba(255, 255, 255, 0.05)",
      width: "100%",
    },
    submenuItem: {
      paddingLeft: "30px",
      marginTop: "2px",
      marginBottom: "2px",
      width: "100%",
    },
    submenuLink: {
      display: "flex",
      alignItems: "center",
      padding: "12px 10px 12px 50px",
      color: colors.white,
      textDecoration: "none",
      fontFamily: typography.fontSecondary,
      fontSize: "13px",
      transition: "background-color 0.2s ease",
      borderRadius: "4px",
      margin: "2px 10px",
      width: "calc(100% - 20px)",
    },
    submenuLinkHover: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    submenuText: {
      marginLeft: "10px",
      whiteSpace: "nowrap",
    },
    menuToggle: {
      position: "absolute",
      right: "20px",
      visibility: isCollapsed ? "hidden" : "visible",
      opacity: isCollapsed ? 0 : 1,
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      color: colors.white,
    },
    footer: {
      padding: isCollapsed ? "10px 0" : "15px",
      borderTop: `1px solid rgba(255,255,255,0.1)`,
      textAlign: isCollapsed ? "center" : "left",
      position: "sticky",
      bottom: 0,
      width: "100%",
      backgroundColor: "#0D1B2A",
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
      fontSize: "14px",
      justifyContent: isCollapsed ? "center" : "flex-start",
      height: "40px",
      transition: "background-color 0.2s ease",
    },
    logoutText: {
      marginLeft: "10px",
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: "opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      whiteSpace: "nowrap",
      width: isCollapsed ? 0 : "auto",
      overflow: "hidden",
    },
    userInfo: {
      padding: "1rem",
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
      fontSize: "0.9rem",
      opacity: isCollapsed ? 0 : 0.9,
      visibility: isCollapsed ? "hidden" : "visible",
      transition: "opacity 0.2s ease, visibility 0.2s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "150px",
    },
    userAvatar: {
      width: "35px",
      height: "35px",
      borderRadius: "50%",
      backgroundColor: "#3498db",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "0.9rem",
      fontWeight: "bold",
      flexShrink: 0,
    },
  }

  const isActive = useCallback(
    (path) => {
      return location.pathname === path
    },
    [location.pathname],
  )

  const isMenuActive = useCallback(
    (prefix) => {
      return location.pathname.startsWith(prefix)
    },
    [location.pathname],
  )

  // Componente de enlace de menú mejorado
  const MenuLink = ({ to, children, style, activeStyle, onClick }) => {
    const [isHovered, setIsHovered] = useState(false)
    const active = isActive(to)

    return (
      <Link
        to={to}
        style={{
          ...style,
          ...(active ? activeStyle : {}),
          ...(isHovered && !active ? styles.menuLinkHover : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }

  // Componente de enlace de submenú mejorado
  const SubmenuLink = ({ to, children, style, onClick }) => {
    const [isHovered, setIsHovered] = useState(false)
    const active = isActive(to)

    return (
      <Link
        to={to}
        style={{
          ...style,
          ...(active ? styles.menuLinkActive : {}),
          ...(isHovered && !active ? styles.submenuLinkHover : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {children}
      </Link>
    )
  }

  // Modificar las rutas en el menú de Productos
  const productosSubmenu = [
    { path: '/admin/productos', text: 'Lista de Productos' },
    { path: '/admin/productos/crear', text: 'Crear Producto' },
    { path: '/admin/productos/categorias', text: 'Categorías' }
  ];

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <button
          style={styles.toggleButton}
          onClick={toggleSidebar}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <FaBars size={22} color="white" />
        </button>
      </div>

      <div style={styles.userInfo}>
        {!isCollapsed && <span style={styles.userName}>{user?.name || "Admin"}</span>}
        <div style={styles.userAvatar}>{user?.name ? user.name[0].toUpperCase() : "A"}</div>
      </div>

      <ul style={styles.menuItems}>
        {user?.role === "ADMIN" && (
          <>
            <li style={styles.menuItem}>
              <MenuLink to="/admin" style={styles.menuLink} activeStyle={styles.menuLinkActive}>
                <span style={styles.menuIcon}>
                  <FaChartBar size={22} />
                </span>
                <span style={styles.menuText}>Dashboard</span>
              </MenuLink>
            </li>

            {/* Usuarios */}
            <li style={styles.menuItem}>
              <div
                style={{
                  ...styles.menuLink,
                  cursor: "pointer",
                  ...(isMenuActive("/admin/usuarios") ? styles.menuLinkActive : {}),
                }}
                onClick={() => toggleMenu("usuarios")}
                onMouseEnter={(e) => {
                  if (!isMenuActive("/admin/usuarios")) {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.08)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMenuActive("/admin/usuarios")) {
                    e.target.style.backgroundColor = "transparent"
                  }
                }}
              >
                <span style={styles.menuIcon}>
                  <FaUsers size={22} />
                </span>
                <span style={styles.menuText}>Usuarios</span>
                <span style={styles.menuToggle}>
                  {expandedMenus.usuarios ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                </span>
              </div>
              <div
                style={{
                  ...styles.submenuContainer,
                  maxHeight: expandedMenus.usuarios && !isCollapsed ? "200px" : "0",
                }}
              >
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  <li style={styles.submenuItem}>
                    <SubmenuLink to="/admin/usuarios" style={styles.submenuLink}>
                      <span style={styles.submenuText}>Vista General</span>
                    </SubmenuLink>
                  </li>
                  <li style={styles.submenuItem}>
                    <SubmenuLink to="/admin/usuarios/cambios" style={styles.submenuLink}>
                      <span style={styles.submenuText}>Cambios</span>
                    </SubmenuLink>
                  </li>
                  <li style={styles.submenuItem}>
                    <SubmenuLink to="/admin/usuarios/bajas" style={styles.submenuLink}>
                      <span style={styles.submenuText}>Bajas</span>
                    </SubmenuLink>
                  </li>
                </ul>
              </div>
            </li>

            {/* Productos Section */}
            <li style={styles.menuItem}>
              <div
                style={{
                  ...styles.menuLink,
                  cursor: "pointer",
                  ...(isMenuActive("/admin/productos") ? styles.menuLinkActive : {}),
                }}
                onClick={() => toggleMenu("productos")}
                onMouseEnter={(e) => {
                  if (!isMenuActive("/admin/productos")) {
                    e.target.style.backgroundColor = "rgba(255,255,255,0.08)"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isMenuActive("/admin/productos")) {
                    e.target.style.backgroundColor = "transparent"
                  }
                }}
              >
                <span style={styles.menuIcon}>
                  <FaNetworkWired size={22} />
                </span>
                <span style={styles.menuText}>Productos</span>
                <span style={styles.menuToggle}>
                  {expandedMenus.productos ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
                </span>
              </div>
              <div
                style={{
                  ...styles.submenuContainer,
                  maxHeight: expandedMenus.productos && !isCollapsed ? "200px" : "0",
                }}
              >
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {productosSubmenu.map((item, index) => (
                    <li key={index} style={styles.submenuItem}>
                      <SubmenuLink to={item.path} style={styles.submenuLink}>
                        <span style={styles.submenuText}>{item.text}</span>
                      </SubmenuLink>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </>
        )}

        {/* Elementos comunes */}
        <li style={styles.menuItem}>
          <MenuLink to="/" style={styles.menuLink} activeStyle={styles.menuLinkActive}>
            <span style={styles.menuIcon}>
              <FaHome size={22} />
            </span>
            <span style={styles.menuText}>Ir al Sitio</span>
          </MenuLink>
        </li>

        {/* Botón de logout */}
        <li style={styles.menuItem}>
          <button
            onClick={handleLogout}
            style={styles.menuLink}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "rgba(255,255,255,0.08)")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            <span style={styles.menuIcon}>
              <FaSignOutAlt size={22} />
            </span>
            <span style={styles.menuText}>Cerrar Sesión</span>
          </button>
        </li>
      </ul>
    </div>
  )
}

export default SidebarAdmin
