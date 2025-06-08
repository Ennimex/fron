import React, { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap'; // Removido NavDropdown
import { FaBell, FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { colors } from '../../styles/styles';

const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const styles = {
    navbar: {
      backgroundColor: colors.white,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      borderBottom: '1px solid #e5e7eb',
    },
    brand: {
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: '1.5rem',
    },
    icon: {
      fontSize: '1.2rem',
      marginRight: '0.5rem',
    },
    badge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#dc3545',
      borderRadius: '50%',
      padding: '0.25rem 0.5rem',
      fontSize: '0.75rem',
    },
    notificationIcon: {
      position: 'relative',
      marginRight: '1rem',
    },
    profileContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    avatar: {
      width: '35px',
      height: '35px',
      borderRadius: '50%',
      backgroundColor: colors.primary,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      right: '0',
      backgroundColor: colors.white,
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      padding: '0.5rem',
      minWidth: '200px',
      zIndex: 1000,
      border: '1px solid #e5e7eb',
      display: showDropdown ? 'block' : 'none',
    },
    dropdownItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1rem',
      color: '#374151',
      textDecoration: 'none',
      borderRadius: '6px',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      gap: '0.75rem',
      fontSize: '0.9rem',
    },
    dropdownItemHover: {
      backgroundColor: '#f3f4f6',
    },
    divider: {
      margin: '0.5rem 0',
      borderTop: '1px solid #e5e7eb',
    },
    userInfo: {
      padding: '1rem',
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '0.5rem',
    },
    userName: {
      fontWeight: '600',
      color: '#111827',
      fontSize: '0.95rem',
      marginBottom: '0.25rem',
    },
    userRole: {
      color: '#6b7280',
      fontSize: '0.85rem',
    }
  };

  return (
    <Navbar style={styles.navbar} expand="lg">
      <Container fluid>
        <Navbar.Brand style={styles.brand}>Panel Administrativo</Navbar.Brand>
        
        <Nav className="ms-auto d-flex align-items-center">
          {/* Notificaciones */}
          <Nav.Link style={styles.notificationIcon}>
            <FaBell />
            <span style={styles.badge}>3</span>
          </Nav.Link>

          <div style={{ position: 'relative' }}>
            <div 
              style={styles.profileContainer} 
              onClick={() => setShowDropdown(!showDropdown)}
              onMouseEnter={() => setShowDropdown(true)}
            >
              <div style={styles.avatar}>
                {user?.name ? user.name[0].toUpperCase() : 'A'}
              </div>
              <span>{user?.name || 'Admin'}</span>
            </div>

            {/* Menú desplegable personalizado */}
            <div 
              style={styles.dropdown}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <div style={styles.userInfo}>
                <div style={styles.userName}>{user?.name || 'Admin'}</div>
                <div style={styles.userRole}>{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</div>
              </div>

              <div 
                style={styles.dropdownItem}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => navigate('/admin/perfil')}
              >
                <FaUser />
                Mi Perfil
              </div>

              <div 
                style={styles.dropdownItem}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                onClick={() => navigate('/admin/configuracion')}
              >
                <FaCog />
                Configuración
              </div>

              <div style={styles.divider}></div>

              <div 
                style={{...styles.dropdownItem, color: '#dc2626'}}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fee2e2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
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
