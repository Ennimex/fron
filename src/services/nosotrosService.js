import api from './api.js';

// Servicio específico para nosotros (misión/visión)
export const nosotrosService = {
  // Obtener información de nosotros
  get: async () => {
    try {
      return await api.get('/nosotros');
    } catch (error) {
      throw error;
    }
  },

  // Obtener información por ID
  getById: async (id) => {
    try {
      return await api.get(`/nosotros/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear o actualizar información de nosotros
  createOrUpdate: async (nosotrosData) => {
    try {
      return await api.post('/nosotros', nosotrosData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar información de nosotros por ID
  update: async (id, nosotrosData) => {
    try {
      return await api.put(`/nosotros/${id}`, nosotrosData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar información de nosotros
  delete: async (id) => {
    try {
      return await api.delete(`/nosotros/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de nosotros
  validate: (nosotros) => {
    const errors = [];

    if (!nosotros.mision || nosotros.mision.trim().length === 0) {
      errors.push('La misión es requerida');
    }

    if (nosotros.mision && nosotros.mision.length > 2000) {
      errors.push('La misión no puede tener más de 2000 caracteres');
    }

    if (!nosotros.vision || nosotros.vision.trim().length === 0) {
      errors.push('La visión es requerida');
    }

    if (nosotros.vision && nosotros.vision.length > 2000) {
      errors.push('La visión no puede tener más de 2000 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Contar caracteres para UI
  getCharacterCount: (text) => {
    return text ? text.length : 0;
  },

  // Verificar si hay cambios
  hasChanges: (original, current) => {
    if (!original) return true;
    
    return (
      original.mision !== current.mision ||
      original.vision !== current.vision
    );
  }
};

export default nosotrosService;
