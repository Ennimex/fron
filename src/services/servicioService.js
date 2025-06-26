import api from './api';

// Servicio para manejar servicios
export const servicioService = {
  // Obtener todos los servicios
  getAll: async () => {
    try {
      const response = await api.get('/servicios');
      return response;
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      throw error;
    }
  },

  // Obtener un servicio por ID
  getById: async (id) => {
    try {
      const response = await api.get(`/servicios/${id}`);
      return response;
    } catch (error) {
      console.error('Error al obtener el servicio:', error);
      throw error;
    }
  },

  // Crear nuevo servicio
  create: async (formData) => {
    try {
      const response = await api.post('/servicios', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  },

  // Actualizar servicio
  update: async (id, formData) => {
    try {
      const response = await api.put(`/servicios/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  },

  // Eliminar servicio
  delete: async (id) => {
    try {
      const response = await api.delete(`/servicios/${id}`);
      return response;
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      throw error;
    }
  }
};

export default servicioService;
