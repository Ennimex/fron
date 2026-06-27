import api from './api';

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('imagen', file); // 'imagen' debe coincidir con el nombre en tu backend

  const response = await api.post('/upload/imagen', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const uploadVideo = async (file) => {
  const formData = new FormData();
  formData.append('video', file); // 'video' debe coincidir con tu backend

  const response = await api.post('/upload/video', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response;
};

export const deleteResource = async (public_id, resource_type = 'image') => {
  // El backend espera el public_id en la ruta y resource_type como query (?resource_type=image|video)
  return api.delete(`/upload/eliminar/${encodeURIComponent(public_id)}`, {
    params: { resource_type },
  });
};

// Exportación por defecto
const uploadService = {
  uploadImage,
  uploadVideo,
  deleteResource
};

export default uploadService;