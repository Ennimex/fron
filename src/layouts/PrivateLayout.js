import React from "react";
import { Container } from "react-bootstrap";
import { Outlet, Navigate } from "react-router-dom";
import NavbarPrivada from "./private/NabvarPrivate";
import Footer from "./shared/Footer"; // Actualizar importación
import { useAuth } from "../context/AuthContext";

const PrivateLayout = () => {
  const { user, isAuthenticated } = useAuth();

  // Verificar autenticación y rol
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si es admin, redirigir al panel de admin
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Si no es un usuario normal, redirigir al login
  if (user?.role !== 'user') {
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
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    },
    pageContent: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      overflow: 'auto',
      padding: '5px',
    }
  };

  return (
    <div style={styles.mainContainer}>
        <div style={styles.content}>
            <NavbarPrivada />
            <div style={styles.pageContent}>
                <Container fluid className="px-0">
                    <Outlet />
                </Container>
            </div>
            <Footer /> {/* Añadir el Footer */}
        </div>
    </div>
  );
};

export default PrivateLayout;