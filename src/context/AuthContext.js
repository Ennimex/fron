import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null,
    token: null,
    name: null,
    email: null,
    id: null
  });

  // Verificar si hay token al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Verificar expiración del token (opcional pero recomendado)
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          logout();
        } else {
          setUser({
            isAuthenticated: true,
            role: decoded.role,
            token: token,
            name: decoded.name || 'Usuario',
            email: decoded.email,
            id: decoded.id
          });
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
    // eslint-disable-next-line
  }, []);

  // Método de login que consulta tu API
  const login = async (email, password) => {
    try {
      // Cambia la URL por la de tu backend real si es necesario
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        let errorMsg = 'Credenciales inválidas';
        try {
          const errorData = await response.json();
          if (errorData.message) errorMsg = errorData.message;
        } catch (_) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      if (!data.token) throw new Error('No se recibió un token del servidor');

      const decoded = jwtDecode(data.token);

      localStorage.setItem('token', data.token);

      setUser({
        isAuthenticated: true,
        role: decoded.role,
        token: data.token,
        name: decoded.name || 'Usuario',
        email: decoded.email,
        id: decoded.id
      });

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: error.message || 'Error de autenticación' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser({
      isAuthenticated: false,
      role: null,
      token: null,
      name: null,
      email: null,
      id: null
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};