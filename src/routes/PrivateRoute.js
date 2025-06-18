import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, checkTokenExpiration, loading: authLoading } = useAuth();
  const location = useLocation();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      if (isAuthenticated) {
        // Verificar la validez del token
        const isTokenValid = checkTokenExpiration();
        
        if (!isTokenValid) {
          // No es necesario hacer nada aquí porque checkTokenExpiration 
          // ya maneja el logout y redirección automáticamente
          return;
        }
      }
      setIsCheckingAuth(false);
    };

    verifyAuth();
  }, [isAuthenticated, checkTokenExpiration, location.pathname]);

  // Mostrar carga mientras se verifica la autenticación
  if (authLoading || isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirigir si el rol no está permitido
  if (allowedRoles.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }

  // Renderizar children si todo está correcto
  return children;
};

export default PrivateRoute;