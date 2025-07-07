// layouts/PrivateLayout.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavbarPrivate from "./private/NabvarPrivate";
import Footer from "./shared/Footer";
import { useAuth } from "../context/AuthContext";
import stylesGlobal from "../styles/stylesGlobal";

const privateNavLinks = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
  { to: "/destacados", label: "Destacados" },
  { to: "/catalogofotos", label: "Galería" }
];

const PrivateLayout = () => {
  const { user, isAuthenticated } = useAuth();

  // Si no está autenticado, ir a página principal
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Si es admin, ir al panel de administración
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }

  // Solo usuarios normales pueden acceder
  if (user?.role !== 'user') {
    return <Navigate to="/" replace />;
  }

  const layoutStyles = {
    container: {
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh',
      backgroundColor: stylesGlobal.colors.surface.primary,
    },
    main: {
      flex: 1, 
      backgroundColor: stylesGlobal.colors.surface.secondary, 
      overflow: 'auto', 
      padding: '2rem 0',
      minHeight: 'calc(100vh - 140px)', // Ajustar según altura del navbar y footer
    }
  };

  return (
    <div style={layoutStyles.container}>
      <NavbarPrivate navLinks={privateNavLinks} />
      <main style={layoutStyles.main}>
        <Container fluid>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;