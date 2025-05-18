import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import { Outlet, useLocation } from "react-router-dom";
import NavbarPrivada from "./privada/NavbarPrivada";
import PrivateSidebar from "./privada/SidebarPrivate";
import { colors } from "../styles/styles";

const PrivateLayout = () => {
  const location = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Gestionar el responsive para decidir cuándo colapsar el sidebar
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 768) {
        setSidebarCollapsed(true);
      }
    };
    
    window.addEventListener("resize", handleResize);
    // Establecer el estado inicial basado en el tamaño de la ventana
    if (window.innerWidth < 768) {
      setSidebarCollapsed(true);
    }
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Función para manejar el toggle del sidebar
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
      marginLeft: '10px',
      transition: 'margin-left 0.3s ease-in-out, width 0.3s ease-in-out',
      width: sidebarCollapsed ? 'calc(100% - 70px)' : 'calc(100% - 280px)',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    },
    pageContent: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      overflow: 'auto',
      padding: '5px',
      transition: 'padding 0.3s ease-in-out'
    }
  };

  return (
    <div style={styles.mainContainer}>
      {/* Sidebar fijo que abarca toda la altura */}
      <PrivateSidebar 
        isOpen={!sidebarCollapsed} 
        onToggle={handleSidebarToggle}
      />
      
      <div style={styles.content}>
        {/* Navbar administrativo */}
        <NavbarPrivada 
          toggleSidebar={() => handleSidebarToggle(!sidebarCollapsed)} 
          collapsed={sidebarCollapsed}
        />
        
        {/* Contenido principal */}
        <div style={styles.pageContent}>
          <Container fluid className="px-0">
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;