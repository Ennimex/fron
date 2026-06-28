// components/public/NavbarPublic.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useConfig } from "../../context/ConfigContext";
import NavbarBase from "../common/NavbarBase";

const NavbarPublic = ({ navLinks }) => {
  const { user, logout } = useAuth();
  const { config } = useConfig();
  return (
    <NavbarBase
      isAuthenticated={user?.isAuthenticated}
      user={user}
      onLogout={logout}
      brandName={config?.nombre || "La Aterciopelada"}
      logoUrl={config?.logoUrl || ""}
      navLinks={navLinks}
    />
  );
};

export default NavbarPublic;
