import api from './api.js';

// Servicio específico para colaboradores
export const colaboradorService = {
  // Obtener todos los colaboradores
  getAll: async () => {
    try {
      return await api.get('/colaboradores');
    } catch (error) {
      throw error;
    }
  },

  // Obtener colaborador por ID
  getById: async (id) => {
    try {
      return await api.get(`/colaboradores/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo colaborador
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

      return await api.post('/colaboradores', formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar colaborador
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

      return await api.put(`/colaboradores/${id}`, formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar colaborador
  delete: async (id) => {
    try {
      return await api.delete(`/colaboradores/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar archivo de imagen
  validateImage: (file) => {
    const errors = [];
    
    if (!file) {
      errors.push('Debe seleccionar una foto del colaborador');
      return { isValid: false, errors };
    }

    // Verificar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de imagen (JPEG, PNG, GIF, WebP)');
    }

    // Verificar tamaño (5MB máximo para fotos de perfil)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      errors.push('El archivo no puede ser mayor a 5MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validar datos del colaborador
  validate: (colaborador, file = null, isEditing = false) => {
    const errors = [];

    if (!colaborador.nombre || colaborador.nombre.trim().length === 0) {
      errors.push('El nombre del colaborador es requerido');
    }

    if (colaborador.nombre && colaborador.nombre.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    if (!colaborador.cargo || colaborador.cargo.trim().length === 0) {
      errors.push('El cargo del colaborador es requerido');
    }

    if (colaborador.cargo && colaborador.cargo.length > 100) {
      errors.push('El cargo no puede tener más de 100 caracteres');
    }

    if (colaborador.descripcion && colaborador.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    if (colaborador.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(colaborador.email)) {
        errors.push('El email debe tener un formato válido');
      }
    }

    if (colaborador.telefono) {
      // Permitir diferentes formatos de teléfono
      const phoneRegex = /^[+]?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(colaborador.telefono)) {
        errors.push('El teléfono debe tener un formato válido');
      }
    }

    // Validar archivo si se proporciona o si es creación nueva
    if (file || !isEditing) {
      if (file) {
        const imageValidation = this.validateImage(file);
        if (!imageValidation.isValid) {
          errors.push(...imageValidation.errors);
        }
      } else if (!isEditing) {
        errors.push('Debe seleccionar una foto del colaborador');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Crear FormData para subir colaborador
  createFormData: (colaboradorData, file) => {
    const formData = new FormData();
    
    formData.append('nombre', colaboradorData.nombre);
    formData.append('cargo', colaboradorData.cargo);
    
    if (colaboradorData.descripcion) {
      formData.append('descripcion', colaboradorData.descripcion);
    }
    
    if (colaboradorData.email) {
      formData.append('email', colaboradorData.email);
    }
    
    if (colaboradorData.telefono) {
      formData.append('telefono', colaboradorData.telefono);
    }
    
    if (colaboradorData.estado !== undefined) {
      formData.append('estado', colaboradorData.estado);
    }
    
    if (file) {
      formData.append('imagen', file);
    }

    return formData;
  },

  // Filtrar colaboradores
  filter: (colaboradores, filters) => {
    return colaboradores.filter(colaborador => {
      let matches = true;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchFields = [
          colaborador.nombre,
          colaborador.cargo,
          colaborador.descripcion,
          colaborador.email
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchFields.includes(searchLower)) {
          matches = false;
        }
      }

      if (filters.estado !== undefined && filters.estado !== '') {
        if (colaborador.estado !== filters.estado) {
          matches = false;
        }
      }

      if (filters.cargo) {
        if (!colaborador.cargo.toLowerCase().includes(filters.cargo.toLowerCase())) {
          matches = false;
        }
      }

      return matches;
    });
  },

  // Ordenar colaboradores
  sort: (colaboradores, sortBy = 'nombre', order = 'asc') => {
    return [...colaboradores].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'nombre':
          valueA = a.nombre.toLowerCase();
          valueB = b.nombre.toLowerCase();
          break;
        case 'cargo':
          valueA = a.cargo.toLowerCase();
          valueB = b.cargo.toLowerCase();
          break;
        case 'estado':
          valueA = a.estado ? 1 : 0;
          valueB = b.estado ? 1 : 0;
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

export default colaboradorService;
