import api from './api.js';

// Servicio específico para administración con manejo de notificaciones
class AdminService {
  constructor() {
    this.notifications = [];
    this.onNotificationCallbacks = [];
  }

  // Método para suscribirse a notificaciones
  onNotification(callback) {
    this.onNotificationCallbacks.push(callback);
    return () => {
      this.onNotificationCallbacks = this.onNotificationCallbacks.filter(cb => cb !== callback);
    };
  }

  // Método para emitir notificaciones
  emitNotification(notification) {
    this.notifications.push({
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      ...notification
    });
    
    this.onNotificationCallbacks.forEach(callback => {
      try {
        callback(notification);
      } catch (error) {
        console.error('Error en callback de notificación:', error);
      }
    });
  }

  // Método para limpiar notificaciones
  clearNotifications() {
    this.notifications = [];
  }

  // Método para obtener notificaciones
  getNotifications() {
    return this.notifications;
  }

  // Wrapper para manejar respuestas de API con notificaciones
  async handleApiResponse(apiCall, successMessage, errorMessage) {
    try {
      const response = await apiCall();
      
      if (successMessage) {
        this.emitNotification({
          type: 'success',
          title: 'Operación exitosa',
          message: successMessage,
          duration: 3000
        });
      }
      
      return response;
    } catch (error) {
      const message = error.error || errorMessage || 'Error en la operación';
      
      this.emitNotification({
        type: 'error',
        title: 'Error',
        message: message,
        duration: 5000
      });
      
      throw error;
    }
  }

  // ============== GESTIÓN DE CATEGORÍAS ==============
  async getCategorias() {
    return this.handleApiResponse(
      () => api.get('/categorias'),
      null, // No mostrar notificación para obtener datos
      'Error al cargar categorías'
    );
  }

  async createCategoria(formData) {
    return this.handleApiResponse(
      () => api.post('/categorias', formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Categoría creada exitosamente',
      'Error al crear categoría'
    );
  }

  async updateCategoria(categoriaId, formData) {
    return this.handleApiResponse(
      () => api.put(`/categorias/${categoriaId}`, formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Categoría actualizada exitosamente',
      'Error al actualizar categoría'
    );
  }

  async deleteCategoria(categoriaId) {
    return this.handleApiResponse(
      () => api.delete(`/categorias/${categoriaId}`),
      'Categoría eliminada exitosamente',
      'Error al eliminar categoría'
    );
  }

  // ============== GESTIÓN DE PRODUCTOS ==============
  async getProductos() {
    return this.handleApiResponse(
      () => api.get('/productos'),
      null,
      'Error al cargar productos'
    );
  }

  async createProducto(formData) {
    return this.handleApiResponse(
      () => api.post('/productos', formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Producto creado exitosamente',
      'Error al crear producto'
    );
  }

  async updateProducto(productoId, formData) {
    return this.handleApiResponse(
      () => api.put(`/productos/${productoId}`, formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Producto actualizado exitosamente',
      'Error al actualizar producto'
    );
  }

  async deleteProducto(productoId) {
    return this.handleApiResponse(
      () => api.delete(`/productos/${productoId}`),
      'Producto eliminado exitosamente',
      'Error al eliminar producto'
    );
  }

  // ============== GESTIÓN DE TALLAS ==============
  async getTallas() {
    return this.handleApiResponse(
      () => api.get('/tallas'),
      null,
      'Error al cargar tallas'
    );
  }

  async createTalla(tallaData) {
    return this.handleApiResponse(
      () => api.post('/tallas', tallaData),
      'Talla creada exitosamente',
      'Error al crear talla'
    );
  }

  async updateTalla(tallaId, tallaData) {
    return this.handleApiResponse(
      () => api.put(`/tallas/${tallaId}`, tallaData),
      'Talla actualizada exitosamente',
      'Error al actualizar talla'
    );
  }

  async deleteTalla(tallaId) {
    return this.handleApiResponse(
      () => api.delete(`/tallas/${tallaId}`),
      'Talla eliminada exitosamente',
      'Error al eliminar talla'
    );
  }

  // ============== GESTIÓN DE LOCALIDADES ==============
  async getLocalidades() {
    return this.handleApiResponse(
      () => api.get('/localidades'),
      null,
      'Error al cargar localidades'
    );
  }

  async getLocalidadById(localidadId) {
    return this.handleApiResponse(
      () => api.get(`/localidades/${localidadId}`),
      null,
      'Error al cargar localidad'
    );
  }

  async createLocalidad(localidadData) {
    return this.handleApiResponse(
      () => api.post('/localidades', localidadData),
      'Localidad creada exitosamente',
      'Error al crear localidad'
    );
  }

  async updateLocalidad(localidadId, localidadData) {
    return this.handleApiResponse(
      () => api.put(`/localidades/${localidadId}`, localidadData),
      'Localidad actualizada exitosamente',
      'Error al actualizar localidad'
    );
  }

  async deleteLocalidad(localidadId) {
    return this.handleApiResponse(
      () => api.delete(`/localidades/${localidadId}`),
      'Localidad eliminada exitosamente',
      'Error al eliminar localidad'
    );
  }

  // ============== GESTIÓN DE EVENTOS ==============
  async getEventos() {
    return this.handleApiResponse(
      () => api.get('/eventos'),
      null,
      'Error al cargar eventos'
    );
  }

  async getEventoById(eventoId) {
    return this.handleApiResponse(
      () => api.get(`/eventos/${eventoId}`),
      null,
      'Error al cargar evento'
    );
  }

  async createEvento(eventoData) {
    return this.handleApiResponse(
      () => api.post('/eventos', eventoData),
      'Evento creado exitosamente',
      'Error al crear evento'
    );
  }

  async updateEvento(eventoId, eventoData) {
    return this.handleApiResponse(
      () => api.put(`/eventos/${eventoId}`, eventoData),
      'Evento actualizado exitosamente',
      'Error al actualizar evento'
    );
  }

  async deleteEvento(eventoId) {
    return this.handleApiResponse(
      () => api.delete(`/eventos/${eventoId}`),
      'Evento eliminado exitosamente',
      'Error al eliminar evento'
    );
  }

  // ============== GESTIÓN DE FOTOS ==============
  async getFotos() {
    return this.handleApiResponse(
      () => api.get('/fotos'),
      null,
      'Error al cargar fotos'
    );
  }

  async getFotoById(fotoId) {
    return this.handleApiResponse(
      () => api.get(`/fotos/${fotoId}`),
      null,
      'Error al cargar foto'
    );
  }

  async createFoto(formData) {
    return this.handleApiResponse(
      () => api.post('/fotos', formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Foto subida exitosamente',
      'Error al subir foto'
    );
  }

  async updateFoto(fotoId, formData) {
    return this.handleApiResponse(
      () => api.put(`/fotos/${fotoId}`, formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Foto actualizada exitosamente',
      'Error al actualizar foto'
    );
  }

  async deleteFoto(fotoId) {
    return this.handleApiResponse(
      () => api.delete(`/fotos/${fotoId}`),
      'Foto eliminada exitosamente',
      'Error al eliminar foto'
    );
  }

  // ============== GESTIÓN DE VIDEOS ==============
  async getVideos() {
    return this.handleApiResponse(
      () => api.get('/videos'),
      null,
      'Error al cargar videos'
    );
  }

  async getVideoById(videoId) {
    return this.handleApiResponse(
      () => api.get(`/videos/${videoId}`),
      null,
      'Error al cargar video'
    );
  }

  async createVideo(formData) {
    return this.handleApiResponse(
      () => api.post('/videos', formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Video subido exitosamente',
      'Error al subir video'
    );
  }

  async updateVideo(videoId, formData) {
    return this.handleApiResponse(
      () => api.put(`/videos/${videoId}`, formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Video actualizado exitosamente',
      'Error al actualizar video'
    );
  }

  async deleteVideo(videoId) {
    return this.handleApiResponse(
      () => api.delete(`/videos/${videoId}`),
      'Video eliminado exitosamente',
      'Error al eliminar video'
    );
  }

  // ============== GESTIÓN DE SERVICIOS ==============
  async getServicios() {
    return this.handleApiResponse(
      () => api.get('/servicios'),
      null,
      'Error al cargar servicios'
    );
  }

  async getServicioById(servicioId) {
    return this.handleApiResponse(
      () => api.get(`/servicios/${servicioId}`),
      null,
      'Error al cargar servicio'
    );
  }

  async createServicio(formData) {
    return this.handleApiResponse(
      () => api.post('/servicios', formData, {
        headers: { 
          'Content-Type': undefined // Permitir que el navegador establezca el Content-Type automáticamente para FormData
        }
      }),
      'Servicio creado exitosamente',
      'Error al crear servicio'
    );
  }

  async updateServicio(servicioId, formData) {
    return this.handleApiResponse(
      () => api.put(`/servicios/${servicioId}`, formData, {
        headers: { 
          'Content-Type': undefined // Permitir que el navegador establezca el Content-Type automáticamente para FormData
        }
      }),
      'Servicio actualizado exitosamente',
      'Error al actualizar servicio'
    );
  }

  async deleteServicio(servicioId) {
    return this.handleApiResponse(
      () => api.delete(`/servicios/${servicioId}`),
      'Servicio eliminado exitosamente',
      'Error al eliminar servicio'
    );
  }

  // ============== GESTIÓN DE NOSOTROS (MISIÓN/VISIÓN) ==============
  async getNosotros() {
    return this.handleApiResponse(
      () => api.get('/nosotros'),
      null,
      'Error al cargar información de nosotros'
    );
  }

  async getNosotrosById(nosotrosId) {
    return this.handleApiResponse(
      () => api.get(`/nosotros/${nosotrosId}`),
      null,
      'Error al cargar información'
    );
  }

  async createOrUpdateNosotros(nosotrosData) {
    return this.handleApiResponse(
      () => api.post('/nosotros', nosotrosData),
      'Información actualizada exitosamente',
      'Error al actualizar información'
    );
  }

  async updateNosotros(nosotrosId, nosotrosData) {
    return this.handleApiResponse(
      () => api.put(`/nosotros/${nosotrosId}`, nosotrosData),
      'Información actualizada exitosamente',
      'Error al actualizar información'
    );
  }

  async deleteNosotros(nosotrosId) {
    return this.handleApiResponse(
      () => api.delete(`/nosotros/${nosotrosId}`),
      'Información eliminada exitosamente',
      'Error al eliminar información'
    );
  }

  // ============== GESTIÓN DE COLABORADORES ==============
  async getColaboradores() {
    return this.handleApiResponse(
      () => api.get('/colaboradores'),
      null,
      'Error al cargar colaboradores'
    );
  }

  async getColaboradorById(colaboradorId) {
    return this.handleApiResponse(
      () => api.get(`/colaboradores/${colaboradorId}`),
      null,
      'Error al cargar colaborador'
    );
  }

  async createColaborador(formData) {
    return this.handleApiResponse(
      () => api.post('/colaboradores', formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Colaborador creado exitosamente',
      'Error al crear colaborador'
    );
  }

  async updateColaborador(colaboradorId, formData) {
    return this.handleApiResponse(
      () => api.put(`/colaboradores/${colaboradorId}`, formData, {
        headers: { 'Content-Type': undefined }
      }),
      'Colaborador actualizado exitosamente',
      'Error al actualizar colaborador'
    );
  }

  async deleteColaborador(colaboradorId) {
    return this.handleApiResponse(
      () => api.delete(`/colaboradores/${colaboradorId}`),
      'Colaborador eliminado exitosamente',
      'Error al eliminar colaborador'
    );
  }

  // ============== GESTIÓN DE PERFIL ==============
  async getProfile() {
    return this.handleApiResponse(
      () => api.get('/perfil'),
      null,
      'Error al cargar perfil'
    );
  }

  async updateProfile(profileData) {
    return this.handleApiResponse(
      () => api.put('/perfil', profileData),
      'Perfil actualizado exitosamente',
      'Error al actualizar perfil'
    );
  }

  async changePassword(passwordData) {
    return this.handleApiResponse(
      () => api.put('/perfil/password', passwordData),
      'Contraseña cambiada exitosamente',
      'Error al cambiar contraseña'
    );
  }

  // ============== ESTADÍSTICAS Y DASHBOARD ==============
  async getDashboardStats() {
    return this.handleApiResponse(
      () => api.get('/admin/dashboard'),
      null,
      'Error al cargar estadísticas del dashboard'
    );
  }

  async getActivity() {
    try {
      return await api.get('/admin/activity');
    } catch (error) {
      // Si el endpoint no existe, devolver un array vacío en lugar de lanzar error
      if (error.error?.includes('Endpoint no encontrado') || 
          error.originalError?.response?.status === 404) {
        console.warn('⚠️ Endpoint de actividades no disponible en el backend');
        return [];
      }
      // Para otros errores, usar el manejo normal
      throw error;
    }
  }

  // ============== GESTIÓN DE USUARIOS ==============
  async getUsers() {
    return this.handleApiResponse(
      () => api.get('/admin/users'),
      null,
      'Error al cargar usuarios'
    );
  }

  async createUser(userData) {
    return this.handleApiResponse(
      () => api.post('/admin/users', userData),
      'Usuario creado exitosamente',
      'Error al crear usuario'
    );
  }

  async updateUser(userId, userData) {
    return this.handleApiResponse(
      () => api.put(`/admin/users/${userId}`, userData),
      'Usuario actualizado exitosamente',
      'Error al actualizar usuario'
    );
  }

  async deleteUser(userId) {
    return this.handleApiResponse(
      () => api.delete(`/admin/users/${userId}`),
      'Usuario eliminado exitosamente',
      'Error al eliminar usuario'
    );
  }
}

// Crear instancia singleton
const adminService = new AdminService();

export default adminService;
