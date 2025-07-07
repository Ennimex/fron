import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaUser, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stylesGlobal from '../../styles/stylesGlobal';

// Estilos CSS responsivos para NavbarAdmin
const responsiveStyles = `
  @media (max-width: 576px) {
    .navbar-admin-container {
      padding: 0 0.75rem !important;
    }
    
    .navbar-admin-brand {
      font-size: 1rem !important;
    }
    
    .navbar-admin-dropdown {
      right: -0.5rem !important;
      min-width: 200px !important;
      max-width: 220px !important;
    }
  }
  
  @media (max-width: 768px) {
    .navbar-admin-profile-text {
      display: none !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-navbar-admin-styles]')) {
    styleElement.setAttribute('data-navbar-admin-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const NavbarAdmin = ({ onMenuToggle, isMobile, sidebarCollapsed }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleMenuToggle = () => {
    if (onMenuToggle) {
      onMenuToggle();
    }
  };

  // Estilos basados en stylesGlobal con variante dark
  const styles = {
    navbar: {
      ...stylesGlobal.components.navbar.base,
      ...stylesGlobal.components.navbar.variants.dark,
      position: "sticky",
      top: 0,
      borderBottom: `1px solid ${stylesGlobal.colors.neutral[700]}`,
      zIndex: 10,
      minHeight: "64px",
    },
    brand: {
      ...stylesGlobal.components.navbar.brand,
      color: stylesGlobal.colors.text.inverse,
      fontSize: "1.25rem",
      fontWeight: 600,
      margin: 0,
      // Responsivo para el título
      "@media (max-width: 576px)": {
        fontSize: "1rem",
      }
    },
    menuToggleBtn: {
      background: 'none',
      border: 'none',
      color: stylesGlobal.colors.text.inverse,
      cursor: 'pointer',
      padding: '0.75rem',
      marginRight: '0.5rem',
      borderRadius: stylesGlobal.borders.radius.md,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem',
      transition: stylesGlobal.animations.transitions.base,
      minWidth: '44px',
      minHeight: '44px',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
      '&:focus': {
        outline: `2px solid ${stylesGlobal.colors.primary[400]}`,
        outlineOffset: '2px',
      }
    },
    profileContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      cursor: 'pointer',
      padding: '8px 12px',
      borderRadius: stylesGlobal.borders.radius.lg,
      transition: stylesGlobal.animations.transitions.base,
      color: stylesGlobal.colors.text.inverse,
      minHeight: '48px',
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: stylesGlobal.colors.primary[500],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: stylesGlobal.colors.text.inverse,
      fontSize: '1.1rem',
      fontWeight: 700,
      boxShadow: stylesGlobal.shadows.sm,
      flexShrink: 0,
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: stylesGlobal.colors.surface.primary,
      borderRadius: stylesGlobal.borders.radius.xl,
      boxShadow: stylesGlobal.shadows.xl,
      padding: '0.5rem',
      minWidth: '240px',
      maxWidth: '280px',
      width: 'max-content',
      zIndex: stylesGlobal.utils.zIndex.dropdown,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      display: showDropdown ? 'block' : 'none',
      backdropFilter: "blur(12px)",
      // Responsivo para móviles
      '@media (max-width: 576px)': {
        right: '-1rem',
        minWidth: '200px',
        maxWidth: '220px',
      }
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      color: stylesGlobal.colors.text.primary,
      textDecoration: 'none',
      borderRadius: stylesGlobal.borders.radius.md,
      transition: stylesGlobal.animations.transitions.elegant,
      cursor: 'pointer',
      gap: '12px',
      fontSize: '0.95rem',
      fontWeight: 500,
      "&:hover": {
        backgroundColor: stylesGlobal.colors.primary[50],
        color: stylesGlobal.colors.primary[600],
        transform: "translateX(4px)",
      }
    },
    divider: {
      margin: '8px 0',
      borderTop: `1px solid ${stylesGlobal.colors.neutral[200]}`,
    },
    userInfo: {
      padding: '16px',
      borderBottom: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      marginBottom: '8px',
    },
    userName: {
      fontWeight: 600,
      color: stylesGlobal.colors.text.primary,
      fontSize: '1rem',
      marginBottom: '4px',
    },
    userRole: {
      color: stylesGlobal.colors.text.tertiary,
      fontSize: '0.875rem',
      textTransform: 'capitalize',
    },
    logoutItem: {
      color: stylesGlobal.colors.semantic.error.main,
      "&:hover": {
        backgroundColor: stylesGlobal.colors.semantic.error.light,
        color: stylesGlobal.colors.semantic.error.dark,
      }
    }
  };

  return (
    <Navbar style={styles.navbar} expand="lg">
      <Container fluid style={{ padding: "0 1rem" }} className="navbar-admin-container">
        <div className="d-flex align-items-center">
          {/* Botón de menú - Solo en móviles para controlar el overlay del sidebar */}
          {isMobile && (
            <button
              style={styles.menuToggleBtn}
              onClick={handleMenuToggle}
              aria-label="Abrir/cerrar menú"
              className="me-2"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <FaBars />
            </button>
          )}
          
          <Navbar.Brand style={styles.brand} className="navbar-admin-brand">
            <span className="d-none d-sm-inline">Panel Administrativo</span>
            <span className="d-inline d-sm-none">Admin</span>
          </Navbar.Brand>
        </div>
        
        <Nav className="ms-auto d-flex align-items-center">
          <div style={{ position: 'relative' }}>
            <div 
              style={styles.profileContainer} 
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
            >
              <div style={styles.avatar}>
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="navbar-admin-profile-text">
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  {user?.name || 'Admin'}
                </span>
              </div>
            </div>

            {/* Menú desplegable elegante */}
            <div 
              style={styles.dropdown}
              className="navbar-admin-dropdown"
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div style={styles.userInfo}>
                <div style={styles.userName}>
                  {user?.name || 'Administrador'}
                </div>
                <div style={styles.userRole}>
                  {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
                </div>
              </div>

              <div 
                style={styles.dropdownItem}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = stylesGlobal.colors.primary[50];
                  e.currentTarget.style.color = stylesGlobal.colors.primary[600];
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = stylesGlobal.colors.text.primary;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
                onClick={() => navigate('/admin/perfil')}
              >
                <FaUser />
                Mi Perfil
              </div>

              <div 
                style={styles.dropdownItem}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = stylesGlobal.colors.primary[50];
                  e.currentTarget.style.color = stylesGlobal.colors.primary[600];
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = stylesGlobal.colors.text.primary;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
                onClick={() => navigate('/admin/configuracion')}
              >
                <FaCog />
                Configuración
              </div>

              <div style={styles.divider}></div>

              <div 
                style={{...styles.dropdownItem, ...styles.logoutItem}}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = stylesGlobal.colors.semantic.error.light;
                  e.currentTarget.style.color = stylesGlobal.colors.semantic.error.dark;
                  e.currentTarget.style.transform = "translateX(4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = stylesGlobal.colors.semantic.error.main;
                  e.currentTarget.style.transform = "translateX(0)";
                }}
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Cerrar Sesión
              </div>
            </div>
          </div>
        </Nav>
      </Container>
    </Navbar>
  );
};

export default NavbarAdmin;
