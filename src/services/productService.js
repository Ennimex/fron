import api from './api.js';

// Servicio específico para productos
export const productService = {
  // Obtener todos los productos
  getAll: async () => {
    try {
      return await api.get('/productos');
    } catch (error) {
      throw error;
    }
  },

  // Obtener producto por ID
  getById: async (id) => {
    try {
      return await api.get(`/productos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Crear nuevo producto
  create: async (formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }

      return await api.post('/productos', formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Actualizar producto
  update: async (id, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }

      return await api.put(`/productos/${id}`, formData, config);
    } catch (error) {
      throw error;
    }
  },

  // Eliminar producto
  delete: async (id) => {
    try {
      return await api.delete(`/productos/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Validar datos del producto
  validate: (producto) => {
    const errors = [];

    if (!producto.nombre || producto.nombre.trim().length === 0) {
      errors.push('El nombre del producto es requerido');
    }

    if (!producto.descripcion || producto.descripcion.trim().length === 0) {
      errors.push('La descripción del producto es requerida');
    }

    if (!producto.localidadId) {
      errors.push('La localidad es requerida');
    }

    if (!producto.tipoTela || producto.tipoTela.trim().length === 0) {
      errors.push('El tipo de tela es requerido');
    }

    if (!producto.tallasDisponibles || producto.tallasDisponibles.length === 0) {
      errors.push('Debe seleccionar al menos una talla');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
};

// Mantener compatibilidad con versiones anteriores
export const createProduct = async (productData) => {
  return productService.create(productData);
};

export const getProducts = async () => {
  return productService.getAll();
};

export const deleteProduct = async (productId) => {
  return productService.delete(productId);
};

export default productService;

