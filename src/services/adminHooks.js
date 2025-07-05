import { useState, useEffect } from 'react';
import adminService from '../services/adminServices.js';

// Hook personalizado para manejar notificaciones del admin
export const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  useEffect(() => {
    // Suscribirse a las notificaciones del adminService
    const unsubscribe = adminService.onNotification((notification) => {
      const notificationWithId = {
        id: Date.now() + Math.random(),
        timestamp: new Date(),
        ...notification
      };
      
      setNotifications(prev => [...prev, notificationWithId]);

      // Auto-remover notificaciones después de su duración
      if (notification.duration) {
        setTimeout(() => {
          removeNotification(notificationWithId.id);
        }, notification.duration);
      }
    });

    return unsubscribe;
  }, []);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const notification = {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      type,
      message,
      duration
    };
    
    setNotifications(prev => [...prev, notification]);
    
    // Auto-remover notificación después de su duración
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    adminService.clearNotifications();
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications
  };
};

// Hook para usar adminService con loading states
export const useAdminService = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeWithLoading = async (serviceCall, showNotifications = true) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (showNotifications) {
        result = await serviceCall();
      } else {
        // Ejecutar directamente la función de API sin notificaciones
        result = await serviceCall();
      }
      
      return result;
    } catch (err) {
      setError(err.error || err.message || 'Error desconocido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeWithLoading,
    clearError: () => setError(null)
  };
};

// Hook específico para operaciones CRUD
export const useCrudOperations = (serviceName) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getServiceMethod = (method) => {
    switch (serviceName) {
      case 'productos':
        return adminService[`${method}Producto`] || adminService[method];
      case 'categorias':
        return adminService[`${method}Categoria`] || adminService[method];
      case 'tallas':
        return adminService[`${method}Talla`] || adminService[method];
      case 'localidades':
        return adminService[`${method}Localidad`] || adminService[method];
      case 'eventos':
        return adminService[`${method}Evento`] || adminService[method];
      case 'fotos':
        return adminService[`${method}Foto`] || adminService[method];
      case 'videos':
        return adminService[`${method}Video`] || adminService[method];
      case 'servicios':
        return adminService[`${method}Servicio`] || adminService[method];
      case 'colaboradores':
        return adminService[`${method}Colaborador`] || adminService[method];
      default:
        throw new Error(`Servicio ${serviceName} no encontrado`);
    }
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const getMethod = getServiceMethod('get');
      const result = await getMethod();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.error || err.message || 'Error al cargar datos');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const createItem = async (itemData) => {
    try {
      const createMethod = getServiceMethod('create');
      const newItem = await createMethod(itemData);
      setData(prev => [...prev, newItem]);
      return newItem;
    } catch (err) {
      throw err;
    }
  };

  const updateItem = async (id, itemData) => {
    try {
      const updateMethod = getServiceMethod('update');
      const updatedItem = await updateMethod(id, itemData);
      setData(prev => prev.map(item => item._id === id ? updatedItem : item));
      return updatedItem;
    } catch (err) {
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      const deleteMethod = getServiceMethod('delete');
      await deleteMethod(id);
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    loadData,
    createItem,
    updateItem,
    deleteItem,
    setData,
    clearError: () => setError(null)
  };
};

// Objeto que contiene todos los hooks para exportación por defecto
const adminHooks = {
  useAdminNotifications,
  useAdminService,
  useCrudOperations
};

export default adminHooks;
