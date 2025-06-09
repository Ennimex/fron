import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./public/PublicNavbar";
import Footer from "./shared/Footer"; // Actualizar importación

const PublicLayout = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Navbar />

      <main
        style={{
          flex: 1,
          backgroundColor: "#f8f9fa"
        }}
      >
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;