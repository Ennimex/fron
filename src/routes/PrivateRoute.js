import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = ['user', 'admin'] }) => {
  const { user } = useAuth();
  return user.isAuthenticated && allowedRoles.includes(user.role) 
    ? children 
    : <Navigate to="/login" />;
};

export default PrivateRoute;