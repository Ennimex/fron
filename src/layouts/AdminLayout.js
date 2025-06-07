import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './admin/SidebarAdmin'; // Asegúrate de que la ruta sea correcta
import { Navbar, Container, Dropdown, Button } from 'react-bootstrap';
import { FaBell, FaUser } from 'react-icons/fa';
import { colors, typography } from '../styles/styles';


const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // Esta función se pasará al sidebar para mantener sincronizado el estado
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      marginLeft: sidebarCollapsed ? '70px' : '280px',
      transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
      width: sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 280px)',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    },
    topBar: {
      backgroundColor: colors.white,
      borderBottom: `1px solid #eee`,
      padding: '10px 0',
      zIndex: 10,
    },
    userMenu: {
      display: 'flex',
      alignItems: 'center',
    },
    userAvatar: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: colors.primaryLight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.white,
      marginRight: '10px',
    },
    notificationBadge: {
      position: 'absolute',
      top: '-5px',
      right: '-5px',
      backgroundColor: '#dc3545',
      color: 'white',
      borderRadius: '50%',
      width: '18px',
      height: '18px',
      fontSize: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    notificationButton: {
      position: 'relative',
      marginRight: '15px',
    },
    pageContent: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      overflow: 'auto',
      padding: '20px',
      transition: 'padding 0.3s ease-in-out'
    },
    breadcrumb: {
      padding: '10px 0',
      marginBottom: '20px',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
      color: colors.primaryMedium
    }
  };

  return (
    <div style={styles.mainContainer}>
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={handleSidebarToggle} 
      />
      
      <div style={styles.content}>
        {/* Top Bar */}
        <Navbar style={styles.topBar} sticky="top">
          <Container fluid>
            {/* Quitamos el botón de menú hamburguesa que estaba aquí */}
            
            <div className="ms-auto d-flex align-items-center">
              {/* Notificaciones */}
              <div style={styles.notificationButton}>
                <Button variant="light" style={{ border: 'none' }}>
                  <FaBell color={colors.primaryMedium} />
                  <span style={styles.notificationBadge}>3</span>
                </Button>
              </div>
              
              {/* Menú de usuario */}
              <Dropdown align="end">
                <Dropdown.Toggle as="div" style={{ cursor: 'pointer' }}>
                  <div style={styles.userMenu}>
                    <div style={styles.userAvatar}>
                      <FaUser />
                    </div>
                    <span style={{ color: colors.primaryDark, fontFamily: typography.fontSecondary }}>
                      Admin
                    </span>
                  </div>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  <Dropdown.Item>Mi Perfil</Dropdown.Item>
                  <Dropdown.Item>Configuración</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item>Cerrar Sesión</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </Container>
        </Navbar>
        
        {/* Contenido de la página */}
        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;