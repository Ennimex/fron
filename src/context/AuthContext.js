import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verifica token al iniciar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          isAuthenticated: true,
          token,
          role: decoded.role, // Asegurarnos de que el rol se guarde
          ...decoded
        });
      } catch (error) {
        logout();
      }
    }
    setLoading(false);
  }, []);

  // Login: consulta a tu API y guarda el token
  const login = async (credentials) => {
    try {
      // Validación más detallada de credenciales
      if (!credentials || typeof credentials !== 'object') {
        throw new Error('Datos de inicio de sesión inválidos');
      }

      const email = credentials?.email?.trim();
      const password = credentials?.password;

      if (!email) {
        throw new Error('El correo electrónico es requerido');
      }
      if (!password) {
        throw new Error('La contraseña es requerida');
      }

      const loginData = { email, password };
      console.log('Intentando login con:', { email }); // Para debug

      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(loginData)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Error en la autenticación');
      }

      if (!data.token) {
        throw new Error('No se recibió el token de autenticación');
      }

      const decoded = jwtDecode(data.token);
      const userData = {
        isAuthenticated: true,
        token: data.token,
        role: decoded.role, // Asegurarnos de que el rol se guarde
        ...decoded
      };

      setUser(userData);
      localStorage.setItem('token', data.token);

      return { 
        success: true,
        role: decoded.role // Devolver el rol para poder redirigir según el tipo de usuario
      };
    } catch (error) {
      console.error('Error de login:', error);
      return { 
        success: false, 
        message: error.message || 'Error al iniciar sesión'
      };
    }
  };

  const register = async (userData) => {
    try {
      // Asegurarse que userData sea un objeto plano
      const registerData = {
        name: userData.name?.toString(),
        email: userData.email?.toString(),
        password: userData.password?.toString()
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'No se pudo registrar');
      }

      return { 
        success: true,
        message: data.message || 'Registro exitoso. Por favor inicia sesión.'
      };
    } catch (error) {
      return { 
        success: false, 
        message: error.message 
      };
    }
  };

  // Logout: limpia todo
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};