import api from './api.js';

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
  create: async (formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.post('/servicios', formData, config);
      return response;
    } catch (error) {
      console.error('Error al crear servicio:', error);
      throw error;
    }
  },

  // Actualizar servicio
  update: async (id, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      const response = await api.put(`/servicios/${id}`, formData, config);
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

  // Validar datos del servicio
  validate: (servicio, file = null) => {
    const errors = [];

    if (!servicio.nombre || servicio.nombre.trim().length === 0) {
      errors.push('El nombre del servicio es requerido');
    }

    if (servicio.nombre && servicio.nombre.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    if (!servicio.descripcion || servicio.descripcion.trim().length === 0) {
      errors.push('La descripción del servicio es requerida');
    }

    if (servicio.descripcion && servicio.descripcion.length > 1000) {
      errors.push('La descripción no puede tener más de 1000 caracteres');
    }

    if (servicio.precio && (isNaN(servicio.precio) || parseFloat(servicio.precio) < 0)) {
      errors.push('El precio debe ser un número válido mayor o igual a 0');
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

  // Crear FormData para subir servicio
  createFormData: (servicioData, file) => {
    const formData = new FormData();
    
    formData.append('nombre', servicioData.nombre);
    formData.append('descripcion', servicioData.descripcion);
    
    if (servicioData.precio) {
      formData.append('precio', servicioData.precio);
    }
    
    if (file) {
      formData.append('imagen', file);
    }

    return formData;
  },

  // Filtrar servicios
  filter: (servicios, searchTerm) => {
    if (!searchTerm) return servicios;

    const searchLower = searchTerm.toLowerCase();
    return servicios.filter(servicio => 
      servicio.nombre.toLowerCase().includes(searchLower) ||
      (servicio.descripcion && servicio.descripcion.toLowerCase().includes(searchLower))
    );
  },

  // Ordenar servicios
  sort: (servicios, sortBy = 'nombre', order = 'asc') => {
    return [...servicios].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'nombre':
          valueA = a.nombre.toLowerCase();
          valueB = b.nombre.toLowerCase();
          break;
        case 'precio':
          valueA = parseFloat(a.precio) || 0;
          valueB = parseFloat(b.precio) || 0;
          break;
        case 'createdAt':
          valueA = new Date(a.createdAt || a._id);
          valueB = new Date(b.createdAt || b._id);
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

export default servicioService;
