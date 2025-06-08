import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './admin/SidebarAdmin';
import NavbarAdmin from './admin/NavbarAdmin';
import { useAuth } from '../context/AuthContext'; // Corregimos la ruta del AuthContext
import { colors } from '../styles/styles'; // Añadir esta importación

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user } = useAuth();
  
  // Esta función se pasará al sidebar para mantener sincronizado el estado
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // Movemos la verificación después de los hooks
  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      marginLeft: sidebarCollapsed ? '70px' : '280px',
      transition: 'margin-left 0.3s ease-in-out',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
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
      padding: '0', // Quitamos el padding aquí para que lo maneje cada componente
      transition: 'all 0.3s ease-in-out'
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
        <NavbarAdmin />
        
        {/* Contenido de la página */}
        <div style={styles.pageContent}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;