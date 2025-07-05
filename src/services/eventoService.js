import api from './api.js';

// Servicio específico para eventos
export const eventoService = {
  // Obtener todos los eventos
  getAll: async () => {
    try {
      return await api.get('/eventos');
    } catch (error) {
      throw error;
    }
  },

  // Obtener evento por ID
  getById: async (id) => {
    try {
      return await api.get(`/eventos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo evento
  create: async (eventoData) => {
    try {
      return await api.post('/eventos', eventoData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar evento
  update: async (id, eventoData) => {
    try {
      return await api.put(`/eventos/${id}`, eventoData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar evento
  delete: async (id) => {
    try {
      return await api.delete(`/eventos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos del evento
  validate: (evento) => {
    const errors = [];

    if (!evento.titulo || evento.titulo.trim().length === 0) {
      errors.push('El título del evento es requerido');
    }

    if (evento.titulo && evento.titulo.length > 100) {
      errors.push('El título no puede tener más de 100 caracteres');
    }

    if (!evento.descripcion || evento.descripcion.trim().length === 0) {
      errors.push('La descripción del evento es requerida');
    }

    if (evento.descripcion && evento.descripcion.length > 1000) {
      errors.push('La descripción no puede tener más de 1000 caracteres');
    }

    if (!evento.fecha) {
      errors.push('La fecha del evento es requerida');
    }

    if (evento.fecha) {
      const fechaEvento = new Date(evento.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      if (fechaEvento < hoy) {
        errors.push('La fecha del evento no puede ser en el pasado');
      }
    }

    if (!evento.ubicacion || evento.ubicacion.trim().length === 0) {
      errors.push('La ubicación del evento es requerida');
    }

    if (evento.ubicacion && evento.ubicacion.length > 200) {
      errors.push('La ubicación no puede tener más de 200 caracteres');
    }

    if (evento.horaInicio && evento.horaFin) {
      if (evento.horaInicio >= evento.horaFin) {
        errors.push('La hora de inicio debe ser anterior a la hora de fin');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Formatear fecha para mostrar
  formatFecha: (fecha) => {
    if (!fecha) return '';
    
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formatear hora para mostrar
  formatHora: (hora) => {
    if (!hora) return '';
    
    return hora.substring(0, 5); // HH:MM
  },

  // Filtrar eventos
  filter: (eventos, filters) => {
    return eventos.filter(evento => {
      let matches = true;

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchFields = [
          evento.titulo,
          evento.descripcion,
          evento.ubicacion
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchFields.includes(searchLower)) {
          matches = false;
        }
      }

      if (filters.fechaDesde) {
        const fechaEvento = new Date(evento.fecha);
        const fechaDesde = new Date(filters.fechaDesde);
        if (fechaEvento < fechaDesde) {
          matches = false;
        }
      }

      if (filters.fechaHasta) {
        const fechaEvento = new Date(evento.fecha);
        const fechaHasta = new Date(filters.fechaHasta);
        if (fechaEvento > fechaHasta) {
          matches = false;
        }
      }

      return matches;
    });
  },

  // Ordenar eventos
  sort: (eventos, sortBy = 'fecha', order = 'desc') => {
    return [...eventos].sort((a, b) => {
      let valueA, valueB;

      switch (sortBy) {
        case 'fecha':
          valueA = new Date(a.fecha);
          valueB = new Date(b.fecha);
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

export default eventoService;
