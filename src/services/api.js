import axios from 'axios';

// Configuración global de Axios
const api = axios.create({
  baseURL: 'http://tu-backend.com/api', // Cambia esto por tu URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;