import React, { useState } from 'react';
import { FaUser, FaCog, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import stylesGlobal from '../../styles/stylesGlobal';
import adminTheme from '../../styles/adminTheme';

// Mapa de ruta → título de la página (el más específico primero; /admin al final)
const TITULOS = [
  ['/admin/solicitudes', 'Solicitudes de cotización'],
  ['/admin/usuarios', 'Usuarios'],
  ['/admin/productos', 'Productos'],
  ['/admin/localidades', 'Localidades'],
  ['/admin/galeria', 'Galería'],
  ['/admin/eventos', 'Eventos'],
  ['/admin/informacion', 'Información'],
  ['/admin/configuracion', 'Configuración'],
  ['/admin/perfil', 'Mi Perfil'],
  ['/admin', 'Resumen general'],
];

// Estilos CSS responsivos para NavbarAdmin
const responsiveStyles = `
  .navbar-admin-menu-toggle:hover { background-color: ${adminTheme.hover} !important; }
  .navbar-admin-profile:hover { background-color: ${adminTheme.hover} !important; }
  .navbar-admin-dropdown-item:hover {
    background-color: ${stylesGlobal.colors.primary[50]} !important;
    color: ${stylesGlobal.colors.primary[600]} !important;
  }
  .navbar-admin-logout-item:hover {
    background-color: ${stylesGlobal.colors.semantic.error.light} !important;
    color: ${stylesGlobal.colors.semantic.error.dark} !important;
  }
  @media (max-width: 576px) {
    .navbar-admin-title { font-size: 1.25rem !important; }
    .navbar-admin-dropdown { right: -0.5rem !important; min-width: 200px !important; }
  }
  @media (max-width: 768px) {
    .navbar-admin-profile-text { display: none !important; }
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-navbar-admin-styles]')) {
    styleElement.setAttribute('data-navbar-admin-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const NavbarAdmin = ({ onMenuToggle, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const titulo = (TITULOS.find(([ruta]) => location.pathname.startsWith(ruta)) || ['', 'Panel'])[1];

  const handleLogout = () => {
    logout();
    if (window.location.hostname.includes('github.io')) {
      window.location.href = window.location.origin + (window.location.pathname.split('/')[1] ? `/${window.location.pathname.split('/')[1]}` : '/');
    } else {
      navigate('/', { replace: true });
    }
  };

  const styles = {
    navbar: {
      height: '78px',
      backgroundColor: adminTheme.surface,
      borderBottom: `1px solid ${adminTheme.border}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    },
    left: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minWidth: 0,
    },
    title: {
      fontFamily: adminTheme.serif,
      fontSize: '1.55rem',
      fontWeight: 700,
      color: adminTheme.text,
      margin: 0,
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    menuToggleBtn: {
      background: 'none',
      border: 'none',
      color: adminTheme.text2,
      cursor: 'pointer',
      padding: '10px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.1rem',
    },
    profileContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      padding: '8px 10px 8px 16px',
      borderRadius: stylesGlobal.borders.radius.lg,
      transition: stylesGlobal.animations.transitions.base,
      borderLeft: `1px solid ${adminTheme.border}`,
    },
    profileText: {
      textAlign: 'right',
      lineHeight: 1.2,
    },
    profileName: {
      fontSize: '0.9rem',
      fontWeight: 700,
      color: adminTheme.text,
    },
    profileRole: {
      fontSize: '0.72rem',
      color: adminTheme.text3,
    },
    avatar: {
      width: '42px',
      height: '42px',
      borderRadius: '50%',
      background: stylesGlobal.colors.gradients.luxury,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: stylesGlobal.colors.text.inverse,
      fontSize: '1rem',
      fontWeight: 700,
      flexShrink: 0,
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: adminTheme.surface,
      borderRadius: stylesGlobal.borders.radius.xl,
      boxShadow: stylesGlobal.shadows.lg,
      padding: '0.5rem',
      minWidth: '240px',
      zIndex: stylesGlobal.utils.zIndex.dropdown,
      border: `1px solid ${adminTheme.border}`,
      display: showDropdown ? 'block' : 'none',
      marginTop: '6px',
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      color: adminTheme.text,
      textDecoration: 'none',
      borderRadius: stylesGlobal.borders.radius.md,
      transition: stylesGlobal.animations.transitions.base,
      cursor: 'pointer',
      gap: '12px',
      fontSize: '0.95rem',
      fontWeight: 500,
    },
    divider: {
      margin: '8px 0',
      borderTop: `1px solid ${adminTheme.border}`,
    },
    userInfo: {
      padding: '14px 16px',
      borderBottom: `1px solid ${adminTheme.border}`,
      marginBottom: '8px',
    },
    userName: {
      fontWeight: 600,
      color: adminTheme.text,
      fontSize: '1rem',
      marginBottom: '2px',
    },
    userRole: {
      color: adminTheme.text3,
      fontSize: '0.85rem',
      textTransform: 'capitalize',
    },
    logoutItem: {
      color: stylesGlobal.colors.semantic.error.main,
    },
  };

  return (
    <header style={styles.navbar}>
      <div style={styles.left}>
        {isMobile && (
          <button
            style={styles.menuToggleBtn}
            onClick={() => onMenuToggle && onMenuToggle()}
            aria-label="Abrir/cerrar menú"
            className="navbar-admin-menu-toggle"
          >
            <FaBars />
          </button>
        )}
        <h1 style={styles.title} className="navbar-admin-title">{titulo}</h1>
      </div>

      <div style={{ position: 'relative' }}>
        <div
          style={styles.profileContainer}
          onClick={() => setShowDropdown(!showDropdown)}
          onMouseEnter={() => setShowDropdown(true)}
          className="navbar-admin-profile"
        >
          <div style={styles.profileText} className="navbar-admin-profile-text">
            <div style={styles.profileName}>{user?.name || 'Admin'}</div>
            <div style={styles.profileRole}>
              {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </div>
          </div>
          <div style={styles.avatar}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>
        </div>

        <div
          style={styles.dropdown}
          className="navbar-admin-dropdown"
          onMouseLeave={() => setShowDropdown(false)}
        >
          <div style={styles.userInfo}>
            <div style={styles.userName}>{user?.name || 'Administrador'}</div>
            <div style={styles.userRole}>
              {user?.role === 'admin' ? 'Administrador' : 'Usuario'}
            </div>
          </div>

          <div
            style={styles.dropdownItem}
            className="navbar-admin-dropdown-item"
            onClick={() => navigate('/admin/perfil')}
          >
            <FaUser />
            Mi Perfil
          </div>

          <div
            style={styles.dropdownItem}
            className="navbar-admin-dropdown-item"
            onClick={() => navigate('/admin/configuracion')}
          >
            <FaCog />
            Configuración
          </div>

          <div style={styles.divider}></div>

          <div
            style={{ ...styles.dropdownItem, ...styles.logoutItem }}
            className="navbar-admin-logout-item"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            Cerrar Sesión
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavbarAdmin;
