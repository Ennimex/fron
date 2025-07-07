import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { FaBell, FaUser, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stylesGlobal from '../../styles/stylesGlobal';

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
    },
    brand: {
      ...stylesGlobal.components.navbar.brand,
      color: stylesGlobal.colors.text.inverse,
      fontSize: "1.25rem",
    },
    menuToggleBtn: {
      background: 'none',
      border: 'none',
      color: stylesGlobal.colors.text.inverse,
      cursor: 'pointer',
      padding: '0.5rem',
      marginRight: '1rem',
      borderRadius: stylesGlobal.borders.radius.sm,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem',
      transition: stylesGlobal.animations.transitions.base,
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
      },
    },
    icon: {
      fontSize: '1.2rem',
      marginRight: '0.5rem',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: stylesGlobal.colors.semantic.error.main,
      borderRadius: '50%',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
      color: stylesGlobal.colors.text.inverse,
      minWidth: '18px',
      height: '18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationIcon: {
      position: 'relative',
      marginRight: '1.5rem',
      padding: '8px',
      borderRadius: stylesGlobal.borders.radius.md,
      color: stylesGlobal.colors.text.inverse,
      cursor: 'pointer',
      transition: stylesGlobal.animations.transitions.base,
      "&:hover": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
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
      zIndex: stylesGlobal.utils.zIndex.dropdown,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      display: showDropdown ? 'block' : 'none',
      backdropFilter: "blur(12px)",
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
      <Container fluid style={{ padding: "0 2rem" }}>
        <div className="d-flex align-items-center">
          {/* Botón de menú - Solo en móviles para controlar el overlay del sidebar */}
          {isMobile && (
            <button
              style={styles.menuToggleBtn}
              onClick={handleMenuToggle}
              aria-label="Abrir/cerrar menú"
              className="me-3"
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              <FaBars />
            </button>
          )}
          
          <Navbar.Brand style={styles.brand}>
            Panel Administrativo
          </Navbar.Brand>
        </div>
        
        <Nav className="ms-auto d-flex align-items-center">
          {/* Notificaciones */}
          <div 
            style={styles.notificationIcon}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.1)"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <FaBell />
            <span style={styles.badge}>3</span>
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              style={styles.profileContainer} 
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
            >
              <div style={styles.avatar}>
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <div className="d-none d-md-block">
                <span style={{ fontSize: "0.95rem", fontWeight: 500 }}>
                  {user?.name || 'Admin'}
                </span>
              </div>
            </div>

            {/* Menú desplegable elegante */}
            <div 
              style={styles.dropdown}
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
