import api from './api.js';

// Servicio específico para localidades
export const localidadService = {
  // Obtener todas las localidades
  getAll: async () => {
    try {
      return await api.get('/localidades');
    } catch (error) {
      throw error;
    }
  },

  // Obtener localidad por ID
  getById: async (id) => {
    try {
      return await api.get(`/localidades/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva localidad
  create: async (localidadData) => {
    try {
      return await api.post('/localidades', localidadData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar localidad
  update: async (id, localidadData) => {
    try {
      return await api.put(`/localidades/${id}`, localidadData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar localidad
  delete: async (id) => {
    try {
      return await api.delete(`/localidades/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de la localidad
  validate: (localidad) => {
    const errors = [];

    if (!localidad.nombre || localidad.nombre.trim().length === 0) {
      errors.push('El nombre de la localidad es requerido');
    }

    if (localidad.nombre && localidad.nombre.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    if (!localidad.descripcion || localidad.descripcion.trim().length === 0) {
      errors.push('La descripción de la localidad es requerida');
    }

    if (localidad.descripcion && localidad.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Filtrar localidades
  filter: (localidades, searchTerm) => {
    if (!searchTerm) return localidades;

    const searchLower = searchTerm.toLowerCase();
    return localidades.filter(localidad => 
      localidad.nombre.toLowerCase().includes(searchLower) ||
      localidad.descripcion.toLowerCase().includes(searchLower)
    );
  }
};

export default localidadService;
