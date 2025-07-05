import api from './api.js';

// Servicio específico para tallas
export const tallaService = {
  // Obtener todas las tallas
  getAll: async () => {
    try {
      return await api.get('/tallas');
    } catch (error) {
      throw error;
    }
  },

  // Obtener talla por ID
  getById: async (id) => {
    try {
      return await api.get(`/tallas/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nueva talla
  create: async (tallaData) => {
    try {
      return await api.post('/tallas', tallaData);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar talla
  update: async (id, tallaData) => {
    try {
      return await api.put(`/tallas/${id}`, tallaData);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar talla
  delete: async (id) => {
    try {
      return await api.delete(`/tallas/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Obtener tallas por categoría
  getByCategoria: async (categoriaId) => {
    try {
      const response = await api.get('/tallas');
      return response.filter(talla => talla.categoriaId === categoriaId);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos de la talla
  validate: (talla) => {
    const errors = [];

    if (!talla.categoriaId) {
      errors.push('La categoría es requerida');
    }

    if (!talla.talla || talla.talla.trim().length === 0) {
      errors.push('La talla es requerida');
    }

    if (talla.talla && talla.talla.length > 20) {
      errors.push('La talla no puede tener más de 20 caracteres');
    }

    if (!talla.genero) {
      errors.push('El género es requerido');
    }

    const generosValidos = ['Unisex', 'Niño', 'Niña', 'Dama', 'Caballero'];
    if (talla.genero && !generosValidos.includes(talla.genero)) {
      errors.push('El género debe ser uno de los valores válidos');
    }

    if (talla.rangoEdad && talla.rangoEdad.length > 30) {
      errors.push('El rango de edad no puede tener más de 30 caracteres');
    }

    if (talla.medida && talla.medida.length > 30) {
      errors.push('La medida no puede tener más de 30 caracteres');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Filtrar tallas
  filter: (tallas, filters) => {
    return tallas.filter(talla => {
      let matches = true;

      if (filters.genero && talla.genero !== filters.genero) {
        matches = false;
      }

      if (filters.categoria && talla.categoriaId !== filters.categoria) {
        matches = false;
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const searchFields = [
          talla.talla,
          talla.genero,
          talla.rangoEdad,
          talla.medida
        ].filter(Boolean).join(' ').toLowerCase();

        if (!searchFields.includes(searchLower)) {
          matches = false;
        }
      }

      return matches;
    });
  }
};

export default tallaService;
