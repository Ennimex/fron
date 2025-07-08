import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './admin/SidebarAdmin';
import NavbarAdmin from './admin/NavbarAdmin';
import { useAuth } from '../context/AuthContext';
import stylesGlobal from '../styles/stylesGlobal';

// Estilos CSS responsivos para AdminLayout
const responsiveStyles = `
  @media (max-width: 768px) {
    .admin-layout-sidebar {
      position: fixed !important;
      z-index: 1000 !important;
      transform: translateX(-100%) !important;
      transition: transform 0.3s ease !important;
    }
    
    .admin-layout-sidebar.mobile-open {
      transform: translateX(0) !important;
    }
    
    .admin-layout-content {
      margin-left: 0 !important;
    }
    
    .admin-layout-overlay {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      background-color: rgba(0, 0, 0, 0.5) !important;
      z-index: 999 !important;
      display: block !important;
    }
  }
  
  @media (min-width: 769px) {
    .admin-layout-sidebar {
      position: fixed !important;
      z-index: 100 !important;
      transform: translateX(0) !important;
    }
    
    .admin-layout-overlay {
      display: none !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-admin-layout-styles]')) {
    styleElement.setAttribute('data-admin-layout-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Inicializar desde localStorage o por defecto basado en el tamaño de pantalla
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved !== null) {
      return JSON.parse(saved);
    }
    return window.innerWidth < 768;
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated } = useAuth();
  
  // Manejar cambios de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      const newIsMobile = window.innerWidth < 768;
      setIsMobile(newIsMobile);
      
      if (newIsMobile) {
        setMobileMenuOpen(false);
      } else {
        setMobileMenuOpen(false);
        // Restaurar estado del sidebar desde localStorage en desktop
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
          setSidebarCollapsed(JSON.parse(saved));
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const handleSidebarToggle = (collapsed) => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(collapsed);
      localStorage.setItem('sidebar-collapsed', JSON.stringify(collapsed));
    }
  };

  const handleOverlayClick = () => {
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };
  
  // Verificar autenticación y rol de admin
  if (!isAuthenticated || !user || user.role !== 'admin') {
    // Para GitHub Pages, manejar la redirección apropiadamente
    if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
      const basePath = window.location.pathname.split('/')[1];
      const redirectPath = basePath ? `/${basePath}/` : '/';
      return <Navigate to={redirectPath} replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: stylesGlobal.colors.surface.secondary,
      position: 'relative',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100vh',
      zIndex: isMobile ? 1000 : 100,
      transform: isMobile 
        ? (mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)')
        : 'translateX(0)',
      transition: 'transform 0.3s ease',
    },
    content: {
      flex: 1,
      marginLeft: isMobile ? 0 : (sidebarCollapsed ? '70px' : '280px'),
      transition: stylesGlobal.animations.transitions.elegant,
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 1,
    },
    pageContent: {
      flex: 1,
      backgroundColor: stylesGlobal.colors.surface.secondary,
      overflow: 'auto',
      padding: '0',
      transition: stylesGlobal.animations.transitions.elegant,
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 999,
      display: isMobile && mobileMenuOpen ? 'block' : 'none',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.mainContainer}>
        {/* Overlay para móviles */}
        {isMobile && mobileMenuOpen && (
          <div 
            style={styles.overlay}
            className="admin-layout-overlay"
            onClick={handleOverlayClick}
          />
        )}
        
        <div 
          style={styles.sidebar}
          className={`admin-layout-sidebar ${isMobile && mobileMenuOpen ? 'mobile-open' : ''}`}
        >
          <Sidebar 
            collapsed={isMobile ? false : sidebarCollapsed} 
            onToggle={handleSidebarToggle}
            isMobile={isMobile}
            mobileMenuOpen={mobileMenuOpen}
          />
        </div>
        
        <div style={styles.content} className="admin-layout-content">
            <NavbarAdmin 
              onMenuToggle={() => handleSidebarToggle(!sidebarCollapsed)}
              isMobile={isMobile}
              sidebarCollapsed={sidebarCollapsed}
            />
            <div style={styles.pageContent}>
                <Outlet />
            </div>
        </div>
    </div>
  );
};

export default AdminLayout;