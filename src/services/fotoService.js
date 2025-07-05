import api from './api.js';

// Servicio específico para fotos
export const fotoService = {
  // Obtener todas las fotos
  getAll: async () => {
    try {
      return await api.get('/fotos');
    } catch (error) {
      throw error;
    }
  },

  // Obtener foto por ID
  getById: async (id) => {
    try {
      return await api.get(`/fotos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva foto
  create: async (formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      return await api.post('/fotos', formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar foto
  update: async (id, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      return await api.put(`/fotos/${id}`, formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar foto
  delete: async (id) => {
    try {
      return await api.delete(`/fotos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar archivo de imagen
  validateImage: (file) => {
    const errors = [];
    
    if (!file) {
      errors.push('Debe seleccionar una imagen');
      return { isValid: false, errors };
    }

    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
    }

    // Verificar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      errors.push('El archivo no puede ser mayor a 10MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validar datos de la foto
  validate: (foto, file = null) => {
    const errors = [];

    if (!foto.titulo || foto.titulo.trim().length === 0) {
      errors.push('El título de la foto es requerido');
    }

    if (foto.titulo && foto.titulo.length > 100) {
      errors.push('El título no puede tener más de 100 caracteres');
    }

    if (foto.descripcion && foto.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    // Validar archivo si se proporciona
    if (file) {
      const imageValidation = this.validateImage(file);
      if (!imageValidation.isValid) {
        errors.push(...imageValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Crear FormData para subir foto
  createFormData: (fotoData, file) => {
    const formData = new FormData();
    
    formData.append('titulo', fotoData.titulo);
    
    if (fotoData.descripcion) {
      formData.append('descripcion', fotoData.descripcion);
    }
    
    if (file) {
      formData.append('imagen', file);
    }

    return formData;
  },

  // Filtrar fotos
  filter: (fotos, searchTerm) => {
    if (!searchTerm) return fotos;

    const searchLower = searchTerm.toLowerCase();
    return fotos.filter(foto => 
      foto.titulo.toLowerCase().includes(searchLower) ||
      (foto.descripcion && foto.descripcion.toLowerCase().includes(searchLower))
    );
  },

  // Ordenar fotos
  sort: (fotos, sortBy = 'createdAt', order = 'desc') => {
    return [...fotos].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'createdAt':
          valueA = new Date(a.createdAt || a._id);
          valueB = new Date(b.createdAt || b._id);
          break;
        case 'titulo':
          valueA = a.titulo.toLowerCase();
          valueB = b.titulo.toLowerCase();
          break;
        default:
          valueA = a[sortBy];
          valueB = b[sortBy];
      }

      if (order === 'asc') {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
  }
};

export default fotoService;
