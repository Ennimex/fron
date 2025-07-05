import api from './api.js';

// Servicio específico para videos
export const videoService = {
  // Obtener todos los videos
  getAll: async () => {
    try {
      return await api.get('/videos');
    } catch (error) {
      throw error;
    }
  },

  // Obtener video por ID
  getById: async (id) => {
    try {
      return await api.get(`/videos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo video
  create: async (formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000 // 10 minutos para videos grandes
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      return await api.post('/videos', formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar video
  update: async (id, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 600000 // 10 minutos para videos grandes
      };

      if (onUploadProgress) {
        config.onUploadProgress = (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onUploadProgress(percentCompleted);
        };
      }

      return await api.put(`/videos/${id}`, formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar video
  delete: async (id) => {
    try {
      return await api.delete(`/videos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar archivo de video
  validateVideo: (file) => {
    const errors = [];
    
    if (!file) {
      errors.push('Debe seleccionar un video');
      return { isValid: false, errors };
    }

    // Verificar tipo de archivo
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/webm'];
    if (!allowedTypes.includes(file.type)) {
      errors.push('Solo se permiten archivos de video (MP4, AVI, MOV, WMV, WebM)');
    }

    // Verificar tamaño (100MB máximo)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      errors.push('El archivo no puede ser mayor a 100MB');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validar datos del video
  validate: (video, file = null) => {
    const errors = [];

    if (!video.titulo || video.titulo.trim().length === 0) {
      errors.push('El título del video es requerido');
    }

    if (video.titulo && video.titulo.length > 100) {
      errors.push('El título no puede tener más de 100 caracteres');
    }

    if (video.descripcion && video.descripcion.length > 500) {
      errors.push('La descripción no puede tener más de 500 caracteres');
    }

    // Validar archivo si se proporciona
    if (file) {
      const videoValidation = this.validateVideo(file);
      if (!videoValidation.isValid) {
        errors.push(...videoValidation.errors);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Crear FormData para subir video
  createFormData: (videoData, file) => {
    const formData = new FormData();
    
    formData.append('titulo', videoData.titulo);
    
    if (videoData.descripcion) {
      formData.append('descripcion', videoData.descripcion);
    }
    
    if (file) {
      formData.append('video', file);
    }

    return formData;
  },

  // Formatear tamaño de archivo
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  },

  // Formatear duración del video
  formatDuration: (seconds) => {
    if (!seconds) return '00:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
  },

  // Filtrar videos
  filter: (videos, searchTerm) => {
    if (!searchTerm) return videos;

    const searchLower = searchTerm.toLowerCase();
    return videos.filter(video => 
      video.titulo.toLowerCase().includes(searchLower) ||
      (video.descripcion && video.descripcion.toLowerCase().includes(searchLower))
    );
  },

  // Ordenar videos
  sort: (videos, sortBy = 'createdAt', order = 'desc') => {
    return [...videos].sort((a, b) => {
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
        case 'duracion':
          valueA = a.duracion || 0;
          valueB = b.duracion || 0;
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

export default videoService;
