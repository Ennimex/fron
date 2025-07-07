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
    
    // Manejar diferentes tipos de errores del backend
    if (error.response?.data) {
      const errorData = error.response.data;
      
      // Si es un array de errores de validación, unirlos en un string
      if (Array.isArray(errorData.error)) {
        const errorMessage = errorData.error.join(', ');
        return Promise.reject({ error: errorMessage, originalError: errorData });
      }
      
      // Si es un error con mensaje simple
      if (errorData.error) {
        return Promise.reject({ error: errorData.error, originalError: errorData });
      }
      
      // Si es un error con mensaje en 'message'
      if (errorData.message) {
        return Promise.reject({ error: errorData.message, originalError: errorData });
      }
    }
    
    // Error de conexión o sin respuesta del servidor
    if (error.request) {
      return Promise.reject({ 
        error: 'Error de conexión. Verifica tu conexión a internet.', 
        originalError: error 
      });
    }
    
    // Otros errores
    return Promise.reject({ 
      error: error.message || 'Error desconocido', 
      originalError: error 
    });
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

  // Servicios
  getServicios: async () => {
    try {
      const response = await api.get('/servicios');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

// Funciones para área administrativa
export const adminAPI = {
  // Dashboard
  getDashboard: async () => {
    try {
      const response = await api.get('/admin/dashboard');
      return response;
    } catch (error) {
      throw error;
    }
  },

  getActivity: async () => {
    try {
      const response = await api.get('/admin/activity');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de usuarios
  getUsers: async () => {
    try {
      const response = await api.get('/admin/users');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de productos
  getProductos: async () => {
    try {
      const response = await api.get('/productos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createProducto: async (formData) => {
    try {
      const response = await api.post('/productos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateProducto: async (productoId, formData) => {
    try {
      const response = await api.put(`/productos/${productoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteProducto: async (productoId) => {
    try {
      const response = await api.delete(`/productos/${productoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de categorías
  getCategorias: async () => {
    try {
      const response = await api.get('/categorias');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createCategoria: async (formData) => {
    try {
      const response = await api.post('/categorias', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateCategoria: async (categoriaId, formData) => {
    try {
      const response = await api.put(`/categorias/${categoriaId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteCategoria: async (categoriaId) => {
    try {
      const response = await api.delete(`/categorias/${categoriaId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de tallas
  getTallas: async () => {
    try {
      const response = await api.get('/tallas');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createTalla: async (tallaData) => {
    try {
      const response = await api.post('/tallas', tallaData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateTalla: async (tallaId, tallaData) => {
    try {
      const response = await api.put(`/tallas/${tallaId}`, tallaData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteTalla: async (tallaId) => {
    try {
      const response = await api.delete(`/tallas/${tallaId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de localidades
  getLocalidades: async () => {
    try {
      const response = await api.get('/localidades');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createLocalidad: async (localidadData) => {
    try {
      const response = await api.post('/localidades', localidadData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateLocalidad: async (localidadId, localidadData) => {
    try {
      const response = await api.put(`/localidades/${localidadId}`, localidadData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteLocalidad: async (localidadId) => {
    try {
      const response = await api.delete(`/localidades/${localidadId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de eventos
  getEventos: async () => {
    try {
      const response = await api.get('/eventos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createEvento: async (eventoData) => {
    try {
      const response = await api.post('/eventos', eventoData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateEvento: async (eventoId, eventoData) => {
    try {
      const response = await api.put(`/eventos/${eventoId}`, eventoData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteEvento: async (eventoId) => {
    try {
      const response = await api.delete(`/eventos/${eventoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de fotos
  getFotos: async () => {
    try {
      const response = await api.get('/fotos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createFoto: async (formData) => {
    try {
      const response = await api.post('/fotos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateFoto: async (fotoId, formData) => {
    try {
      const response = await api.put(`/fotos/${fotoId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteFoto: async (fotoId) => {
    try {
      const response = await api.delete(`/fotos/${fotoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de videos
  getVideos: async () => {
    try {
      const response = await api.get('/videos');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createVideo: async (videoData) => {
    try {
      const response = await api.post('/videos', videoData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateVideo: async (videoId, videoData) => {
    try {
      const response = await api.put(`/videos/${videoId}`, videoData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteVideo: async (videoId) => {
    try {
      const response = await api.delete(`/videos/${videoId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de servicios
  getServicios: async () => {
    try {
      const response = await api.get('/servicios');
      return response;
    } catch (error) {
      throw error;
    }
  },

  createServicio: async (formData) => {
    try {
      const response = await api.post('/servicios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateServicio: async (servicioId, formData) => {
    try {
      const response = await api.put(`/servicios/${servicioId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  deleteServicio: async (servicioId) => {
    try {
      const response = await api.delete(`/servicios/${servicioId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Gestión de información de la empresa (nosotros - misión/visión)
  getNosotros: async () => {
    try {
      const response = await api.get('/nosotros');
      return response;
    } catch (error) {
      throw error;
    }
  },

  updateNosotros: async (nosotrosData) => {
    try {
      const response = await api.post('/nosotros', nosotrosData);
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default api;