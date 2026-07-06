// layouts/PublicLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarPublic from "../layouts/public/NavbarPublic";
import Footer from "../layouts/shared/Footer";
import { useAuth } from "../context/AuthContext";
import stylesGlobal from "../styles/stylesGlobal";

const publicNavLinks = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
  { to: "/destacados", label: "Destacados" },
  { to: "/catalogofotos", label: "Galería" }
];

// Enlaces extra que ve un usuario normal autenticado, para que su menú
// (favoritos/solicitudes) no desaparezca al navegar a páginas públicas.
const userNavLinks = [
  { to: "/favoritos", label: "Mis Favoritos" },
  { to: "/solicitudes", label: "Mis Solicitudes" }
];

const PublicLayout = () => {
  const { user, isAuthenticated } = useAuth();
  const navLinks =
    isAuthenticated && user?.role === "user"
      ? [...publicNavLinks, ...userNavLinks]
      : publicNavLinks;

  const layoutStyles = {
    container: {
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      backgroundColor: stylesGlobal.colors.surface.primary,
    },
    main: {
      flex: 1, 
      backgroundColor: stylesGlobal.colors.surface.secondary,
      minHeight: 'calc(100vh - 140px)', // Ajustar según altura del navbar y footer
    }
  };

  return (
    <div style={layoutStyles.container}>
      <NavbarPublic navLinks={navLinks} />
      <main style={layoutStyles.main}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;