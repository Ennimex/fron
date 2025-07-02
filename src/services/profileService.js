// services/profileService.js
import api from './api';

export const profileService = {
  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/perfil');
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al obtener el perfil');
    }
  },

  // Actualizar información del perfil
  updateProfile: async (profileData) => {
    try {
      const response = await api.put('/perfil', {
        name: profileData.nombre,
        email: profileData.correo,
        phone: profileData.telefono
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar el perfil');
    }
  },

  // Actualizar contraseña
  updatePassword: async (passwordData) => {
    try {
      const response = await api.put('/perfil/password', {
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      return response;
    } catch (error) {
      throw new Error(error.message || 'Error al actualizar la contraseña');
    }
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
