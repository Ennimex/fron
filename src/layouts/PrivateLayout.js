// layouts/PrivateLayout.js
import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import NavbarPrivate from "../layouts/private/NabvarPrivate";
import Footer from "../layouts/shared/Footer";
import { useAuth } from "../context/AuthContext";

const privateNavLinks = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Mis Productos" },
  { to: "/servicios", label: "Servicios" },
  { to: "/perfil", label: "Mi Perfil" }
];

const PrivateLayout = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (user?.role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavbarPrivate navLinks={privateNavLinks} />
      <main style={{ flex: 1, backgroundColor: '#f8f9fa', overflow: 'auto', padding: '20px 0' }}>
        <Container fluid>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
};

export default PrivateLayout;