import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaChartBar, FaUsers, FaNetworkWired, FaInfoCircle, 
  FaFileAlt, FaQuestionCircle, FaHome, FaSignOutAlt,
  FaChevronDown, FaChevronRight, FaBars
} from 'react-icons/fa';
import { colors, typography } from '../styles/styles';

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(collapsed);
  
  // Sincronizar con el prop
  useEffect(() => {
    setIsCollapsed(collapsed);
  }, [collapsed]);
  
  // Estado para controlar submenús expandidos
  const [expandedMenus, setExpandedMenus] = useState({
    usuarios: false,
    iot: false,
    informacion: false,
    politicas: false,
    preguntas: false
  });
  
  // Función para alternar la expansión de un menú
  const toggleMenu = (menu) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      // Notificar al componente padre
      onToggle(false);
      
      setTimeout(() => {
        setExpandedMenus({
          ...expandedMenus,
          [menu]: !expandedMenus[menu]
        });
      }, 300);
    } else {
      setExpandedMenus({
        ...expandedMenus,
        [menu]: !expandedMenus[menu]
      });
    }
  };
  
  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    // Notificar al componente padre
    onToggle(newCollapsedState);
    
    if (newCollapsedState) {
      // Colapsar todos los submenús cuando se colapsa la barra lateral
      setExpandedMenus({
        usuarios: false,
        iot: false,
        informacion: false,
        politicas: false,
        preguntas: false
      });
    }
  };
  
  const styles = {
    sidebar: {
      width: isCollapsed ? '70px' : '280px',
      height: '100vh',
      backgroundColor: '#0D1B2A', // Color oscuro como en la imagen
      color: colors.white,
      transition: 'width 0.3s ease-in-out',
      position: 'fixed',
      left: 0,
      zIndex: 1000,
      overflowX: 'hidden',
      overflowY: 'auto',
      boxShadow: '2px 0 10px rgba(0,0,0,0.2)'
    },
    logo: {
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0D1B2A',
      borderBottom: `1px solid rgba(255,255,255,0.1)`,
    },
    toggleButton: {
      background: 'none',
      border: 'none',
      color: colors.white,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      width: '100%',
      height: '56px',
    },
    menuItems: {
      padding: 0,
      listStyle: 'none',
      margin: 0,
      marginTop: '20px',
    },
    menuItem: {
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    menuLink: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      color: colors.white,
      textDecoration: 'none',
      fontFamily: typography.fontSecondary,
      position: 'relative',
      width: '100%',
      padding: isCollapsed ? '0' : '0 20px',
      transition: 'all 0.3s',
      height: '56px',
    },
    menuLinkActive: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      fontWeight: 'bold',
    },
    menuIcon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.3s',
      color: 'white',
      width: '70px', // Mantener el mismo ancho cuando está colapsado o expandido
      minWidth: '70px',
      height: '56px',
    },
    menuText: {
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? 'hidden' : 'visible',
      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
      whiteSpace: 'nowrap',
      fontSize: '14px',
      fontWeight: 500,
      width: isCollapsed ? 0 : 'auto',
      overflow: 'hidden'
    },
    submenuItem: {
      paddingLeft: '30px',
      marginTop: '2px',
      marginBottom: '2px',
      width: '100%',
    },
    submenuLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '10px 10px 10px 50px',
      color: colors.white,
      textDecoration: 'none',
      fontFamily: typography.fontSecondary,
      fontSize: '13px',
      transition: 'background-color 0.2s',
      width: '100%',
    },
    submenuText: {
      marginLeft: '10px',
      whiteSpace: 'nowrap',
    },
    submenuContainer: {
      overflow: 'hidden',
      maxHeight: '0',
      transition: 'max-height 0.3s ease-in-out',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      width: '100%',
    },
    submenuExpanded: {
      maxHeight: '500px', // Ajustar según el número de elementos
    },
    menuToggle: {
      position: 'absolute',
      right: '20px',
      visibility: isCollapsed ? 'hidden' : 'visible',
      opacity: isCollapsed ? 0 : 1,
      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
      color: colors.white,
    },
    footer: {
      padding: isCollapsed ? '10px 0' : '15px',
      borderTop: `1px solid rgba(255,255,255,0.1)`,
      textAlign: isCollapsed ? 'center' : 'left',
      position: 'absolute',
      bottom: 0,
      width: '100%',
    },
    logoutBtn: {
      display: 'flex',
      alignItems: 'center',
      padding: isCollapsed ? '10px 0' : '10px',
      color: colors.white,
      textDecoration: 'none',
      width: '100%',
      border: 'none',
      backgroundColor: 'transparent',
      cursor: 'pointer',
      fontFamily: typography.fontSecondary,
      fontSize: '14px',
      justifyContent: isCollapsed ? 'center' : 'flex-start',
      height: '40px',
    },
    logoutText: {
      marginLeft: '10px',
      opacity: isCollapsed ? 0 : 1,
      visibility: isCollapsed ? 'hidden' : 'visible',
      transition: 'opacity 0.2s ease-in-out, visibility 0.2s ease-in-out',
      whiteSpace: 'nowrap',
      width: isCollapsed ? 0 : 'auto',
      overflow: 'hidden'
    }
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isMenuActive = (prefix) => {
    return location.pathname.startsWith(prefix);
  };

  return (
    <div style={styles.sidebar}>
      <div style={styles.logo}>
        <button 
          style={styles.toggleButton} 
          onClick={toggleSidebar}
          aria-label={isCollapsed ? "Expandir menú" : "Colapsar menú"}
        >
          <FaBars size={22} color="white" />
        </button>
      </div>
      
      <ul style={styles.menuItems}>
        {/* Dashboard */}
        <li style={styles.menuItem}>
          <Link 
            to="/admin" 
            style={{
              ...styles.menuLink,
              ...(isActive('/admin') ? styles.menuLinkActive : {}),
            }}
          >
            <span style={styles.menuIcon}>
              <FaChartBar size={22} />
            </span>
            <span style={styles.menuText}>Dashboard</span>
          </Link>
        </li>
        
        {/* Usuarios */}
        <li style={styles.menuItem}>
          <div 
            style={{
              ...styles.menuLink,
              cursor: 'pointer',
              ...(isMenuActive('/admin/usuarios') ? styles.menuLinkActive : {}),
            }}
            onClick={() => toggleMenu('usuarios')}
          >
            <span style={styles.menuIcon}>
              <FaUsers size={22} />
            </span>
            <span style={styles.menuText}>Usuarios</span>
            <span style={styles.menuToggle}>
              {expandedMenus.usuarios ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </span>
          </div>
          <div style={{
            ...styles.submenuContainer,
            ...(expandedMenus.usuarios ? styles.submenuExpanded : {})
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={styles.submenuItem}>
                <Link to="/admin/usuarios" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/usuarios') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Vista General</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/usuarios/altas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/usuarios/altas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Altas</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/usuarios/bajas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/usuarios/bajas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Bajas</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/usuarios/cambios" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/usuarios/cambios') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Cambios</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        
        {/* IoT */}
        <li style={styles.menuItem}>
          <div 
            style={{
              ...styles.menuLink,
              cursor: 'pointer',
              ...(isMenuActive('/admin/iot') ? styles.menuLinkActive : {}),
            }}
            onClick={() => toggleMenu('iot')}
          >
            <span style={styles.menuIcon}>
              <FaNetworkWired size={22} />
            </span>
            <span style={styles.menuText}>IoT</span>
            <span style={styles.menuToggle}>
              {expandedMenus.iot ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </span>
          </div>
          <div style={{
            ...styles.submenuContainer,
            ...(expandedMenus.iot ? styles.submenuExpanded : {})
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={styles.submenuItem}>
                <Link to="/admin/iot" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/iot') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>IoT</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/iot/vinculacion" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/iot/vinculacion') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Vinculación</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/iot/altas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/iot/altas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Altas</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/iot/bajas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/iot/bajas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Bajas</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/iot/usuarios" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/iot/usuarios') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Usuarios</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        
        {/* Información */}
        <li style={styles.menuItem}>
          <div 
            style={{
              ...styles.menuLink,
              cursor: 'pointer',
              ...(isMenuActive('/admin/informacion') ? styles.menuLinkActive : {}),
            }}
            onClick={() => toggleMenu('informacion')}
          >
            <span style={styles.menuIcon}>
              <FaInfoCircle size={22} />
            </span>
            <span style={styles.menuText}>Información</span>
            <span style={styles.menuToggle}>
              {expandedMenus.informacion ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </span>
          </div>
          <div style={{
            ...styles.submenuContainer,
            ...(expandedMenus.informacion ? styles.submenuExpanded : {})
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={styles.submenuItem}>
                <Link to="/admin/informacion/modificacion" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/informacion/modificacion') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Modificación</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/informacion/vista" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/informacion/vista') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Vista General</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        
        {/* Políticas */}
        <li style={styles.menuItem}>
          <div 
            style={{
              ...styles.menuLink,
              cursor: 'pointer',
              ...(isMenuActive('/admin/politicas') ? styles.menuLinkActive : {}),
            }}
            onClick={() => toggleMenu('politicas')}
          >
            <span style={styles.menuIcon}>
              <FaFileAlt size={22} />
            </span>
            <span style={styles.menuText}>Políticas</span>
            <span style={styles.menuToggle}>
              {expandedMenus.politicas ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </span>
          </div>
          <div style={{
            ...styles.submenuContainer,
            ...(expandedMenus.politicas ? styles.submenuExpanded : {})
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={styles.submenuItem}>
                <Link to="/admin/politicas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/politicas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Vista General</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/politicas/empresa" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/politicas/empresa') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Políticas de la empresa</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/politicas/privacidad" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/politicas/privacidad') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Políticas de privacidad</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/politicas/cliente" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/politicas/cliente') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Políticas de cliente</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        
        {/* Preguntas Frecuentes */}
        <li style={styles.menuItem}>
          <div 
            style={{
              ...styles.menuLink,
              cursor: 'pointer',
              ...(isMenuActive('/admin/preguntas') ? styles.menuLinkActive : {}),
            }}
            onClick={() => toggleMenu('preguntas')}
          >
            <span style={styles.menuIcon}>
              <FaQuestionCircle size={22} />
            </span>
            <span style={styles.menuText}>Preguntas Frecuentes</span>
            <span style={styles.menuToggle}>
              {expandedMenus.preguntas ? <FaChevronDown size={12} /> : <FaChevronRight size={12} />}
            </span>
          </div>
          <div style={{
            ...styles.submenuContainer,
            ...(expandedMenus.preguntas ? styles.submenuExpanded : {})
          }}>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={styles.submenuItem}>
                <Link to="/admin/preguntas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/preguntas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Vista General</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/preguntas/altas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/preguntas/altas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Altas</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/preguntas/bajas" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/preguntas/bajas') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Bajas</span>
                </Link>
              </li>
              <li style={styles.submenuItem}>
                <Link to="/admin/preguntas/cambios" style={{
                  ...styles.submenuLink,
                  ...(isActive('/admin/preguntas/cambios') ? styles.menuLinkActive : {})
                }}>
                  <span style={styles.submenuText}>Cambios</span>
                </Link>
              </li>
            </ul>
          </div>
        </li>
        
        {/* Ir al Sitio */}
        <li style={styles.menuItem}>
          <Link to="/" style={{
            ...styles.menuLink,
          }}>
            <span style={styles.menuIcon}>
              <FaHome size={22} />
            </span>
            <span style={styles.menuText}>Ir al Sitio</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;