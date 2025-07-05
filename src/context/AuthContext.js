import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { authAPI } from '../services/api';

export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Definir logout con useCallback - redirige al login automáticamente
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    // Redirigir al login y recargar automáticamente
    window.location.href = '/login';
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          console.log('Token ya expirado al iniciar');
          logout();
          return;
        }

        setUser({
          isAuthenticated: true,
          token,
          id: decoded.id,
          role: decoded.role,
        });
      } catch (error) {
        console.error('Error decodificando token:', error);
        logout();
      }
    }
    setLoading(false);
  }, [logout]);

  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        // Verificar si es error de token expirado desde el backend
        if (error.response?.status === 401) {
          const errorData = error.response.data;
          if (errorData?.isExpired || errorData?.error === 'Token expirado') {
            console.log('Token expirado detectado por el backend');
          } else {
            console.log('Token inválido o no autorizado');
          }
          logout(); // Esto automáticamente redirige al login
        }
        return Promise.reject(error);
      }
    );

    return () => axios.interceptors.response.eject(interceptor);
  }, [logout]);

  const login = async (credentials) => {
    try {
      if (!credentials || typeof credentials !== 'object') {
        throw new Error('Datos de inicio de sesión inválidos');
      }

      const email = credentials?.email?.trim();
      const password = credentials?.password;

      if (!email) throw new Error('El correo electrónico es requerido');
      if (!password) throw new Error('La contraseña es requerida');

      const data = await authAPI.login({ email, password });
      
      if (!data.token) throw new Error('No se recibió el token de autenticación');

      const decoded = jwtDecode(data.token);
      const userData = {
        isAuthenticated: true,
        token: data.token,
        id: decoded.id,
        role: decoded.role,
        name: data.user.name,
        email: data.user.email,
      };

      setUser(userData);
      localStorage.setItem('token', data.token);

      return { success: true, role: decoded.role };
    } catch (error) {
      console.error('Error de login:', error);
      return { success: false, message: error?.error || error?.message || 'Error al iniciar sesión' };
    }
  };

  const register = async (userData) => {
    try {
      const registerData = {
        name: userData.name?.trim(),
        email: userData.email?.trim(),
        password: userData.password,
        phone: userData.phone?.trim(),
      };

      if (!registerData.name) throw new Error('El nombre es requerido');
      if (!registerData.email) throw new Error('El correo electrónico es requerido');
      if (!registerData.password) throw new Error('La contraseña es requerida');
      if (!registerData.phone) throw new Error('El número de teléfono es requerido');

      const data = await authAPI.register(registerData);

      return {
        success: true,
        message: data.message || 'Registro exitoso. Por favor inicia sesión.',
      };
    } catch (error) {
      console.error('Error de registro:', error);
      return { success: false, message: error?.error || error?.message || 'Error al registrarse' };
    }
  };

  const checkTokenExpiration = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          logout();
          window.location.reload();
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error al decodificar token:', error);
        logout();
        window.location.reload();
        return false;
      }
    }
    return false;
  };

  if (loading) return <div>Cargando...</div>;

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user?.isAuthenticated,
        checkTokenExpiration,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};