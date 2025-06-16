// components/public/NavbarPublic.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import NavbarBase from "../common/NavbarBase";

const NavbarPublic = ({ navLinks }) => {
  const { user, logout } = useAuth();
  return (
    <NavbarBase
      isAuthenticated={user?.isAuthenticated}
      user={user}
      onLogout={logout}
      brandName="La Aterciopelada"
      navLinks={navLinks}
    />
  );
};

export default NavbarPublic;