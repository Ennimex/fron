// components/private/NavbarPrivate.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import NavbarBase from "../common/NavbarBase";

const NavbarPrivate = ({ navLinks }) => {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <NavbarBase
      isAuthenticated={true}
      user={user}
      onLogout={logout}
      brandName="La Aterciopelada"
      navLinks={navLinks}
    />
  );
};

export default NavbarPrivate;