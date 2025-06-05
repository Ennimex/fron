import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalarlo: npm install jwt-decode

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

  // Verifica token al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Expiración del token (opcional pero recomendado)
        if (decoded.exp && Date.now() >= decoded.exp * 1000) {
          logout();
        } else {
          setUser({
            isAuthenticated: true,
            role: decoded.role,
            token,
            name: decoded.name || '',
            email: decoded.email || '',
            id: decoded.id || decoded._id // usa el campo que tengas
          });
        }
      } catch (error) {
        logout();
      }
    }
    // eslint-disable-next-line
  }, []);

  // Login: consulta a tu API y guarda el token
  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', { // Cambia la URL si usas proxy o dominio diferente
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }
      if (!data.token) throw new Error('No se recibió token');

      const decoded = jwtDecode(data.token);
      localStorage.setItem('token', data.token);

      setUser({
        isAuthenticated: true,
        role: decoded.role,
        token: data.token,
        name: decoded.name || '',
        email: decoded.email || '',
        id: decoded.id || decoded._id // usa el campo que tengas
      });

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (email, password) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'No se pudo registrar');
    }
    if (!data.token) throw new Error('No se recibió token');

    const decoded = jwtDecode(data.token);
    localStorage.setItem('token', data.token);

    setUser({
      isAuthenticated: true,
      role: decoded.role,
      token: data.token,
      name: decoded.name || '',
      email: decoded.email || '',
      id: decoded.id || decoded._id
    });

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

  // Logout: limpia todo
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
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};