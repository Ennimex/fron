// layouts/PublicLayout.js
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarPublic from "../layouts/public/NavbarPublic";
import Footer from "../layouts/shared/Footer";

const publicNavLinks = [
  { to: "/", label: "Inicio" },
  { to: "/productos", label: "Productos" },
  { to: "/servicios", label: "Servicios" },
  { to: "/nosotros", label: "Nosotros" },
  { to: "/contacto", label: "Contacto" },
  { to: "/galeria", label: "Galería" }
];

const PublicLayout = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavbarPublic navLinks={publicNavLinks} />
      <main style={{ flex: 1, backgroundColor: "#f8f9fa" }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout;