// components/private/NavbarPrivate.js
import React from "react";
import { useAuth } from "../../context/AuthContext";
import NavbarBase from "../../layouts/common/NavbarBase";

const NavbarPrivate = ({ navLinks }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <NavbarBase
      isAuthenticated={true}
      user={user}
      onLogout={() => {}}
      brandName="Mi App"
      navLinks={navLinks}
    />
  );
};

export default NavbarPrivate;