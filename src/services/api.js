import axios from 'axios';

// Configuración global de Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Cambia esto por tu URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente en cada petición
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;