import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './admin/SidebarAdmin';
import NavbarAdmin from './admin/NavbarAdmin';
import { useAuth } from '../context/AuthContext';
import stylesGlobal from '../styles/stylesGlobal';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };
  
  // Verificar autenticación y rol de admin
  if (!isAuthenticated || !user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  
  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: stylesGlobal.colors.surface.secondary,
    },
    content: {
      flex: 1,
      marginLeft: sidebarCollapsed ? '70px' : '280px',
      transition: stylesGlobal.animations.transitions.elegant,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden'
    },
    pageContent: {
      flex: 1,
      backgroundColor: stylesGlobal.colors.surface.secondary,
      overflow: 'auto',
      padding: '0',
      transition: stylesGlobal.animations.transitions.elegant,
    },
  };

  return (
    <div style={styles.mainContainer}>
        <Sidebar 
            collapsed={sidebarCollapsed} 
            onToggle={handleSidebarToggle} 
        />
        
        <div style={styles.content}>
            <NavbarAdmin />
            <div style={styles.pageContent}>
                <Outlet />
            </div>
        </div>
    </div>
  );
};

export default AdminLayout;