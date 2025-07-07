import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import adminService from '../../services/adminServices';
import { useAdminNotifications } from '../../services/adminHooks';
import NotificationContainer from '../../components/admin/NotificationContainer';
import stylesGlobal from '../../styles/stylesGlobal';

const GestionFotos = () => {
  const { user, isAuthenticated } = useAuth();

  // Hook de notificaciones
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();
  
  // Crear una referencia estable para addNotification
  const addNotificationRef = useRef(addNotification);
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  // Suscribirse a las notificaciones de adminService
  useEffect(() => {
    const unsubscribe = adminService.onNotification((notification) => {
      addNotification(notification.message, notification.type, notification.duration);
    });

    return unsubscribe;
  }, [addNotification]);

  // Mapeo de estilos globales
  const styles = {
    pageContainer: {
      ...stylesGlobal.utils.container,
      padding: stylesGlobal.spacing.sections.md,
      backgroundColor: stylesGlobal.colors.surface.primary,
    },
    mainContainer: {
      maxWidth: stylesGlobal.utils.container.maxWidth.lg,
      margin: stylesGlobal.spacing.margins.auto,
      padding: stylesGlobal.spacing.scale[4],
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[8],
      flexWrap: 'wrap',
      gap: stylesGlobal.spacing.gaps.md,
    },
    title: stylesGlobal.typography.headings.h1,
    subtitle: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
    },
    addButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
    },
    content: {
      padding: stylesGlobal.spacing.scale[4],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: stylesGlobal.spacing.gaps.lg,
    },
    error: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.semantic.error.main,
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      padding: stylesGlobal.spacing.scale[3],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    success: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.semantic.success.main,
      backgroundColor: stylesGlobal.colors.semantic.success.light,
      padding: stylesGlobal.spacing.scale[3],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    emptyStateText: stylesGlobal.typography.headings.h3,
    emptyStateSubtext: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.muted,
    },
    cardBase: {
      ...stylesGlobal.components.card.base,
      backgroundColor: stylesGlobal.colors.surface.secondary,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRadius: stylesGlobal.borders.radius.md,
      boxShadow: stylesGlobal.shadows.sm,
      overflow: 'hidden',
    },
    cardImageContainer: {
      width: '100%',
      height: '150px',
      overflow: 'hidden',
      position: 'relative',
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    cardPlaceholder: {
      ...stylesGlobal.utils.flexCenter,
      width: '100%',
      height: '100%',
      backgroundColor: stylesGlobal.colors.surface.tertiary,
      flexDirection: 'column',
      gap: stylesGlobal.spacing.gaps.sm,
      color: stylesGlobal.colors.text.muted,
    },
    cardContent: {
      padding: stylesGlobal.spacing.scale[4],
    },
    cardTitle: {
      ...stylesGlobal.typography.headings.h3,
      margin: 0,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    cardDescription: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
      margin: 0,
      marginBottom: stylesGlobal.spacing.scale[3],
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: stylesGlobal.spacing.gaps.md,
      paddingTop: stylesGlobal.spacing.scale[2],
    },
    modalOverlay: {
      ...stylesGlobal.utils.overlay.base,
      ...stylesGlobal.utils.overlay.elegant,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    modalContent: {
      ...stylesGlobal.components.card.luxury,
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      margin: '20px',
    },
    modalCloseButton: {
      ...stylesGlobal.components.button.variants.ghost,
      ...stylesGlobal.components.button.sizes.xs,
      position: 'absolute',
      top: stylesGlobal.spacing.scale[2],
      right: stylesGlobal.spacing.scale[2],
    },
    modalTitle: stylesGlobal.typography.headings.h2,
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: stylesGlobal.spacing.gaps.md,
      marginTop: stylesGlobal.spacing.scale[6],
      paddingTop: stylesGlobal.spacing.scale[4],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    modalBody: {
      padding: stylesGlobal.spacing.scale[6],
      position: 'relative',
    },
    formContainer: {
      width: '100%',
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[6],
      width: '100%',
    },
    label: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[2],
      display: 'block',
    },
    requiredField: {
      color: stylesGlobal.colors.semantic.error.main,
      marginLeft: stylesGlobal.spacing.scale[1],
    },
    input: stylesGlobal.components.input.base,
    textarea: {
      ...stylesGlobal.components.input.base,
      minHeight: '120px',
      resize: 'vertical',
      lineHeight: stylesGlobal.typography.leading.normal,
    },
    fileInputContainer: {
      position: 'relative',
      width: '100%',
    },
    fileInput: {
      ...stylesGlobal.components.input.base,
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[4]}`,
      cursor: 'pointer',
      backgroundColor: stylesGlobal.colors.surface.tertiary,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.surface.secondary,
      },
    },
    helpText: {
      ...stylesGlobal.typography.body.caption,
      marginTop: stylesGlobal.spacing.scale[2],
      fontStyle: 'italic',
      color: stylesGlobal.colors.text.muted,
    },
    previewContainer: {
      marginTop: stylesGlobal.spacing.scale[6],
      padding: stylesGlobal.spacing.scale[4],
      backgroundColor: stylesGlobal.colors.surface.tertiary,
      borderRadius: stylesGlobal.borders.radius.sm,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      textAlign: 'center',
    },
    previewLabel: {
      display: 'block',
      marginBottom: stylesGlobal.spacing.scale[4],
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.secondary,
      textAlign: 'left',
    },
    previewMedia: {
      maxWidth: '100%',
      maxHeight: '300px',
      height: 'auto',
      borderRadius: stylesGlobal.borders.radius.sm,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      boxShadow: stylesGlobal.shadows.sm,
    },
    actionButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.sm,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
    },
    editAction: {
      color: stylesGlobal.colors.semantic.info.main,
      borderColor: stylesGlobal.colors.semantic.info.main,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.info.light,
        color: stylesGlobal.colors.semantic.info.dark,
      },
    },
    deleteAction: {
      color: stylesGlobal.colors.semantic.error.main,
      borderColor: stylesGlobal.colors.semantic.error.main,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.error.light,
        color: stylesGlobal.colors.semantic.error.dark,
      },
    },
    outlineButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.base,
    },
    primaryButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    loadingContainer: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteModalContent: {
      ...stylesGlobal.components.card.base,
      maxWidth: '400px',
      width: '90%',
      position: 'relative',
      margin: '20px',
      textAlign: 'center',
    },
    deleteModalBody: {
      padding: stylesGlobal.spacing.scale[6],
    },
    deleteModalTitle: {
      ...stylesGlobal.typography.headings.h3,
      color: stylesGlobal.colors.semantic.error.main,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    deleteModalText: {
      ...stylesGlobal.typography.body.base,
      marginBottom: stylesGlobal.spacing.scale[6],
      color: stylesGlobal.colors.text.secondary,
    },
    deleteModalActions: {
      display: 'flex',
      justifyContent: 'center',
      gap: stylesGlobal.spacing.gaps.md,
    },
    dangerButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      backgroundColor: stylesGlobal.colors.semantic.error.main,
      borderColor: stylesGlobal.colors.semantic.error.main,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.error.dark,
      },
    },
  };

  // Estados para datos
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentFoto, setCurrentFoto] = useState(null);
  const [fotoToDelete, setFotoToDelete] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
    imagenPreview: null,
  });

  // Fetch photos
  const fetchFotos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getFotos();
      setFotos(data);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al cargar fotos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch photos on component mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchFotos();
    }
  }, [isAuthenticated, user, fetchFotos]);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.imagenPreview && formData.imagenPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imagenPreview);
      }
    };
  }, [formData.imagenPreview]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        addNotificationRef.current('La imagen no debe exceder los 10MB', 'error');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        addNotificationRef.current('Solo se permiten imágenes JPG, PNG o GIF', 'error');
        return;
      }
      // Revoke previous preview URL
      if (formData.imagenPreview) {
        URL.revokeObjectURL(formData.imagenPreview);
      }
      const imageUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        imagen: file,
        imagenPreview: imageUrl,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.titulo.trim()) {
      addNotificationRef.current('El título de la foto es obligatorio', 'error');
      return false;
    }
    if (formData.titulo.length > 100) {
      addNotificationRef.current('El título no puede exceder los 100 caracteres', 'error');
      return false;
    }
    if (formData.descripcion && formData.descripcion.length > 500) {
      addNotificationRef.current('La descripción no puede exceder los 500 caracteres', 'error');
      return false;
    }
    if (!currentFoto && !formData.imagen) {
      addNotificationRef.current('Debes seleccionar una imagen', 'error');
      return false;
    }
    return true;
  };

  // Open modal for creating a new photo
  const handleOpenCreateModal = () => {
    setCurrentFoto(null);
    setFormData({
      titulo: '',
      descripcion: '',
      imagen: null,
      imagenPreview: null,
    });
    setModalOpen(true);
  };

  // Open modal for editing an existing photo
  const handleOpenEditModal = (foto) => {
    setCurrentFoto(foto);
    setFormData({
      titulo: foto.titulo || '',
      descripcion: foto.descripcion || '',
      imagen: null,
      imagenPreview: foto.url,
    });
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    if (formData.imagenPreview) {
      URL.revokeObjectURL(formData.imagenPreview);
    }
    setModalOpen(false);
    setFormData({
      titulo: '',
      descripcion: '',
      imagen: null,
      imagenPreview: null,
    });
    setCurrentFoto(null);
  };

  // Handle photo deletion
  const handleDelete = (foto) => {
    setFotoToDelete(foto);
    setDeleteModalOpen(true);
  };

  // Confirm photo deletion
  const confirmDelete = async () => {
    if (!fotoToDelete) return;

    try {
      setFormLoading(true);
      await adminService.deleteFoto(fotoToDelete._id);
      // adminService ya maneja las notificaciones de éxito automáticamente
      await fetchFotos();
      setDeleteModalOpen(false);
      setFotoToDelete(null);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al eliminar foto:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Cancel photo deletion
  const cancelDelete = () => {
    setDeleteModalOpen(false);
    setFotoToDelete(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('descripcion', formData.descripcion.trim());
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      if (currentFoto) {
        await adminService.updateFoto(currentFoto._id, formDataToSend);
      } else {
        await adminService.createFoto(formDataToSend);
      }

      // adminService ya maneja las notificaciones de éxito automáticamente
      handleCloseModal();
      await fetchFotos();
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al procesar foto:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Check if the user is authenticated and has admin role
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{
        ...styles.pageContainer,
        ...styles.flexCenter,
        height: '80vh',
        textAlign: 'center',
      }}>
        <FaLock size={50} style={{ color: stylesGlobal.colors.semantic.error.main }} />
        <h2 style={styles.title}>Acceso Denegado</h2>
        <p style={styles.subtitle}>
          No tienes permisos para acceder a esta sección. Esta área está reservada para administradores.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <FaImage style={{ marginRight: stylesGlobal.spacing.scale[3] }} />
              Gestión de Fotos
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las fotos del sistema
            </p>
          </div>
          <button
            style={{
              ...styles.addButton,
              ...(formLoading || loading ? styles.disabledButton : {}),
            }}
            onClick={handleOpenCreateModal}
            aria-label="Agregar nueva foto"
            disabled={formLoading || loading}
          >
            <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
            Agregar Foto
          </button>
        </div>

        {/* Sistema de notificaciones centralizado */}
        <NotificationContainer
          notifications={notifications}
          onRemoveNotification={removeNotification}
          onClearAll={clearAllNotifications}
        />

        {/* Contenido principal */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.textCenter}>
              <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
              <h3 style={stylesGlobal.typography.headings.h3}>Cargando fotos...</h3>
            </div>
          </div>
        ) : fotos.length === 0 ? (
          <div style={styles.emptyState}>
            <FaImage size={40} style={{ opacity: 0.3, marginBottom: stylesGlobal.spacing.scale[4] }} />
            <h3 style={styles.emptyStateText}>No hay fotos disponibles</h3>
            <p style={styles.emptyStateSubtext}>
              ¡Agrega una nueva foto para comenzar!
            </p>
          </div>
        ) : (
          <div style={styles.content}>
            {fotos.map((foto) => (
              <div key={foto._id} style={styles.cardBase}>
                <div style={styles.cardImageContainer}>
                  {foto.url ? (
                    <img
                      src={foto.url}
                      alt={foto.titulo || 'Foto sin título'}
                      style={styles.cardImage}
                    />
                  ) : (
                    <div style={styles.cardPlaceholder}>
                      <FaImage size={40} />
                      <p style={stylesGlobal.typography.body.base}>Sin imagen</p>
                    </div>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {foto.titulo || 'Sin título'}
                  </h3>
                  <p style={styles.cardDescription}>
                    {foto.descripcion?.length > 100
                      ? `${foto.descripcion.substring(0, 100)}...`
                      : foto.descripcion || 'Sin descripción'}
                  </p>
                  <div style={styles.cardActions}>
                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.editAction,
                      }}
                      onClick={() => handleOpenEditModal(foto)}
                      title="Editar foto"
                      aria-label={`Editar foto ${foto.titulo || 'Sin título'}`}
                      disabled={formLoading || loading}
                    >
                      <FaEdit size={12} />
                      Editar
                    </button>
                    <button
                      style={{
                        ...styles.actionButton,
                        ...styles.deleteAction,
                      }}
                      onClick={() => handleDelete(foto)}
                      title="Eliminar foto"
                      aria-label={`Eliminar foto ${foto.titulo || 'Sin título'}`}
                      disabled={formLoading || loading}
                    >
                      <FaTrash size={12} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear/editar foto */}
        {modalOpen && (
          <div
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={(e) => e.target.className === 'modal-overlay' && handleCloseModal()}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                  disabled={formLoading}
                >
                  ✕
                </button>
                <h2 style={styles.modalTitle}>
                  {currentFoto ? 'Editar Foto' : 'Agregar Nueva Foto'}
                </h2>
                <form onSubmit={handleSubmit} style={styles.formContainer}>
                  {/* Campo título */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="titulo">
                      Título de la Foto
                      <span style={styles.requiredField}>*</span>
                      <span style={{ ...stylesGlobal.typography.body.caption, marginLeft: stylesGlobal.spacing.scale[2] }}>
                        ({formData.titulo.length}/100)
                      </span>
                    </label>
                    <input
                      style={styles.input}
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      placeholder="Ingresa un título descriptivo para la foto"
                      required
                      maxLength={100}
                      disabled={formLoading}
                    />
                    <small style={styles.helpText}>
                      Máximo 100 caracteres
                    </small>
                  </div>

                  {/* Campo descripción */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="descripcion">
                      Descripción
                      <span style={{ ...stylesGlobal.typography.body.caption, marginLeft: stylesGlobal.spacing.scale[2] }}>
                        ({formData.descripcion.length}/500)
                      </span>
                    </label>
                    <textarea
                      style={styles.textarea}
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Describe la foto, contexto o información adicional (opcional)"
                      rows={4}
                      maxLength={500}
                      disabled={formLoading}
                    />
                    <small style={styles.helpText}>
                      Máximo 500 caracteres. Proporciona una descripción que ayude a los usuarios a comprender mejor la imagen.
                    </small>
                  </div>

                  {/* Campo archivo de imagen */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="imagen">
                      Archivo de Imagen
                      {!currentFoto && <span style={styles.requiredField}>*</span>}
                    </label>
                    <div style={styles.fileInputContainer}>
                      <input
                        style={styles.fileInput}
                        type="file"
                        id="imagen"
                        name="imagen"
                        accept="image/jpeg,image/png,image/gif"
                        onChange={handleImageChange}
                        disabled={formLoading}
                        {...(currentFoto ? {} : { required: true })}
                      />
                      <small style={styles.helpText}>
                        Selecciona una imagen en formato JPG, PNG o GIF. Tamaño máximo: 10MB.
                        {currentFoto && ' Deja vacío para mantener la imagen actual.'}
                      </small>
                    </div>

                    {formData.imagenPreview && (
                      <div style={styles.previewContainer}>
                        <span style={styles.previewLabel}>Vista previa de la imagen:</span>
                        <img
                          src={formData.imagenPreview}
                          alt="Vista previa de la foto"
                          style={styles.previewMedia}
                        />
                      </div>
                    )}
                  </div>

                  {/* Acciones del modal */}
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      style={{
                        ...styles.outlineButton,
                        ...(formLoading ? styles.disabledButton : {}),
                      }}
                      disabled={formLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        ...styles.primaryButton,
                        ...(formLoading ? styles.disabledButton : {}),
                      }}
                      disabled={formLoading}
                      aria-label={currentFoto ? 'Actualizar foto' : 'Crear foto'}
                    >
                      {formLoading ? (
                        <>
                          <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[1] }} />
                          {currentFoto ? 'Actualizando...' : 'Creando...'}
                        </>
                      ) : (
                        <>
                          <FaPlus size={12} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                          {currentFoto ? 'Actualizar Foto' : 'Crear Foto'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar foto */}
        {deleteModalOpen && fotoToDelete && (
          <div
            style={styles.modalOverlay}
            onClick={cancelDelete}
          >
            <div
              style={styles.deleteModalContent}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={styles.deleteModalBody}>
                <div style={styles.deleteModalTitle}>
                  <FaTrash style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
                  Confirmar Eliminación
                </div>
                <div style={styles.deleteModalText}>
                  ¿Estás seguro que deseas eliminar la foto "{fotoToDelete.titulo || 'Sin título'}"?
                  <br />
                  <strong>Esta acción no se puede deshacer.</strong>
                </div>
                <div style={styles.deleteModalActions}>
                  <button
                    type="button"
                    onClick={cancelDelete}
                    style={{
                      ...styles.outlineButton,
                      ...(formLoading ? styles.disabledButton : {}),
                    }}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={confirmDelete}
                    style={{
                      ...styles.dangerButton,
                      ...(formLoading ? styles.disabledButton : {}),
                    }}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                        Eliminando...
                      </>
                    ) : (
                      <>
                        <FaTrash size={12} />
                        Eliminar Foto
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionFotos;