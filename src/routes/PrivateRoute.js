import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si se especifican roles permitidos, verificar si el usuario tiene el rol necesario
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirigir a inicio si no tiene el rol adecuado
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;