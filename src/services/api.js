import axios from 'axios';

// Configuración global de Axios
const api = axios.create({
  baseURL: 'https://back-three-gamma.vercel.app/api', // URL de tu API en Vercel
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
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

// Funciones de autenticación
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Funciones para páginas públicas
export const publicAPI = {
  // Categorías
  getCategorias: async () => {
    try {
      const response = await api.get('/public/categorias');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Localidades
  getLocalidades: async () => {
    try {
      const response = await api.get('/public/localidades');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Tallas
  getTallas: async () => {
    try {
      const response = await api.get('/public/tallas');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Productos
  getProductos: async () => {
    try {
      const response = await api.get('/public/productos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getProductoById: async (id) => {
    try {
      const response = await api.get(`/public/productos/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Nosotros
  getNosotros: async () => {
    try {
      const response = await api.get('/nosotros');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Fotos
  getFotos: async () => {
    try {
      const response = await api.get('/fotos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Videos (si existen)
  getVideos: async () => {
    try {
      const response = await api.get('/videos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Eventos (si existen)
  getEventos: async () => {
    try {
      const response = await api.get('/eventos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Colaboradores
  getColaboradores: async () => {
    try {
      const response = await api.get('/public/colaboradores');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default api;