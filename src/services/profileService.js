// services/profileService.js
import api from './api.js';

export const profileService = {
  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/perfil');
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar información del perfil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/perfil', {
        name: profileData.nombre || profileData.name,
        email: profileData.correo || profileData.email,
        phone: profileData.telefono || profileData.phone
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Actualizar contraseña
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/perfil/password', {
        currentPassword: passwordData.current || passwordData.currentPassword,
        newPassword: passwordData.new || passwordData.newPassword
      });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Validar datos del perfil
  validateProfile: (profileData) => {
    const errors = [];

    if (!profileData.name && !profileData.nombre) {
      errors.push('El nombre es requerido');
    }

    const name = profileData.name || profileData.nombre;
    if (name && name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    if (name && name.length > 100) {
      errors.push('El nombre no puede tener más de 100 caracteres');
    }

    const email = profileData.email || profileData.correo;
    if (!email) {
      errors.push('El email es requerido');
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        errors.push('El email debe tener un formato válido');
      }
    }

    const phone = profileData.phone || profileData.telefono;
    if (phone) {
      const phoneRegex = /^[+]?[0-9\s\-()]{7,15}$/;
      if (!phoneRegex.test(phone)) {
        errors.push('El teléfono debe tener un formato válido');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Validar cambio de contraseña
  validatePasswordChange: (passwordData) => {
    const errors = [];

    const currentPassword = passwordData.current || passwordData.currentPassword;
    const newPassword = passwordData.new || passwordData.newPassword;
    const confirmPassword = passwordData.confirm || passwordData.confirmPassword;

    if (!currentPassword) {
      errors.push('La contraseña actual es requerida');
    }

    if (!newPassword) {
      errors.push('La nueva contraseña es requerida');
    }

    if (newPassword && newPassword.length < 6) {
      errors.push('La nueva contraseña debe tener al menos 6 caracteres');
    }

    if (newPassword && newPassword.length > 50) {
      errors.push('La nueva contraseña no puede tener más de 50 caracteres');
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      errors.push('Las contraseñas no coinciden');
    }

    if (currentPassword && newPassword && currentPassword === newPassword) {
      errors.push('La nueva contraseña debe ser diferente a la actual');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Verificar si hay cambios en el perfil
  hasProfileChanges: (original, current) => {
    if (!original) return true;
    
    const originalName = original.name || original.nombre;
    const currentName = current.name || current.nombre;
    const originalEmail = original.email || original.correo;
    const currentEmail = current.email || current.correo;
    const originalPhone = original.phone || original.telefono;
    const currentPhone = current.phone || current.telefono;
    
    return (
      originalName !== currentName ||
      originalEmail !== currentEmail ||
      originalPhone !== currentPhone
    );
  },

  // Subir avatar (para futuro uso)
  uploadAvatar: async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.post('/perfil/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al subir el avatar');
    }
  },
};
