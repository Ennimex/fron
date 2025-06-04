import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    role: null,
    token: null,
    name: null,
    email: null,
    id: null
  });

  useEffect(() => {
    // Verificar si hay token en localStorage al cargar la app
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          isAuthenticated: true,
          role: decoded.role,
          token: token,
          name: decoded.name || 'Usuario',
          email: decoded.email,
          id: decoded.id
        });
      } catch (error) {
        console.error("Error decoding token:", error);
        logout();
      }
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }
      
      const data = await response.json();
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
      return { success: false, message: error.message };
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

export const useAuth = () => React.useContext(AuthContext);