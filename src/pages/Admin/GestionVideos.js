import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaPlay, FaClock } from 'react-icons/fa';
import { adminAPI } from '../../services/api';
import adminStyles from '../../styles/stylesAdmin';

const GestionVideos = () => {

  // Mapeo de estilos globales
  const styles = {
    pageContainer: adminStyles.containers.page,
    mainContainer: adminStyles.containers.main,
    header: adminStyles.headerStyles.headerSimple,
    title: adminStyles.headerStyles.titleDark,
    subtitle: adminStyles.headerStyles.subtitleDark,
    addButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
    },
    content: adminStyles.containers.content,
    error: adminStyles.messageStyles.error,
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    emptyStateSubtext: adminStyles.containers.emptyStateSubtext,
    
    // Estilos de cards
    cardBase: adminStyles.cards.base,
    cardImageContainer: adminStyles.cards.imageContainer,
    cardImage: adminStyles.cards.image,
    cardPlayButton: adminStyles.cards.playButton,    cardPlaceholder: adminStyles.cards.placeholder,
    cardContent: adminStyles.cards.content,
    cardTitle: adminStyles.cards.title,
    cardDescription: adminStyles.cards.description,
      // Estilos de modal
    modalOverlay: adminStyles.modalStyles.overlay,
    modalContent: {
      ...adminStyles.modalStyles.content,
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    modalCloseButton: adminStyles.modalStyles.closeButton,
    modalTitle: {
      ...adminStyles.modalStyles.title,
      marginBottom: adminStyles.spacing.xl,
    },
    modalActions: {
      ...adminStyles.modalStyles.actions,
      marginTop: adminStyles.spacing.xl,
      paddingTop: adminStyles.spacing.lg,
      borderTop: `1px solid ${adminStyles.colors.border}`,
    },
    modalBody: {
      padding: adminStyles.spacing.xl,
    },
    
    // Estilos de formulario mejorados
    formContainer: {
      padding: adminStyles.spacing.xl,
    },
    formGroup: {
      marginBottom: adminStyles.spacing.xl,
    },
    label: {
      ...adminStyles.forms.label,
      display: 'block',
      marginBottom: adminStyles.spacing.md,
      fontWeight: adminStyles.typography.weightMedium,
      color: adminStyles.colors.textPrimary,
    },
    requiredField: {
      ...adminStyles.forms.requiredField,
      marginLeft: adminStyles.spacing.xs,
    },
    input: {
      ...adminStyles.forms.input,
      width: '100%',
      padding: adminStyles.spacing.md,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    inputFocus: {
      borderColor: adminStyles.colors.primary,
      boxShadow: `0 0 0 3px rgba(13, 27, 42, 0.1)`,
      outline: 'none',
    },
    textarea: {
      ...adminStyles.forms.textarea,
      width: '100%',
      padding: adminStyles.spacing.md,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      minHeight: '100px',
      resize: 'vertical',
      fontFamily: 'inherit',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    fileInputContainer: {
      position: 'relative',
    },
    fileInput: {
      ...adminStyles.forms.fileInput,
      width: '100%',
      padding: adminStyles.spacing.md,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      cursor: 'pointer',
    },
    helpText: {
      ...adminStyles.forms.helpText,
      display: 'block',
      marginTop: adminStyles.spacing.sm,
      marginBottom: adminStyles.spacing.md,
      fontSize: adminStyles.typography.textSm,
      color: adminStyles.colors.textMuted,
      lineHeight: '1.4',
    },
    previewContainer: {
      marginTop: adminStyles.spacing.lg,
      padding: adminStyles.spacing.md,
      backgroundColor: adminStyles.colors.backgroundGray,
      borderRadius: adminStyles.borders.radius,
      border: `1px solid ${adminStyles.colors.border}`,
    },
    previewLabel: {
      display: 'block',
      marginBottom: adminStyles.spacing.md,
      fontSize: adminStyles.typography.textSm,
      fontWeight: adminStyles.typography.weightMedium,
      color: adminStyles.colors.textSecondary,
    },
    previewMedia: {
      ...adminStyles.forms.previewMedia,
      maxWidth: '100%',
      height: 'auto',
      borderRadius: adminStyles.borders.radius,
      border: `1px solid ${adminStyles.colors.border}`,
    },
      // Estilos de botones
    actionButton: {
      ...adminStyles.buttons.actionButton,
      padding: `${adminStyles.spacing.sm} ${adminStyles.spacing.lg}`,
      minWidth: '90px',
      fontSize: adminStyles.typography.textSm,
      fontWeight: adminStyles.typography.weightMedium,
    },
    editAction: {
      ...adminStyles.buttons.editAction,
      marginRight: adminStyles.spacing.md,
    },
    deleteAction: adminStyles.buttons.deleteAction,
    cardActions: {
      ...adminStyles.cards.actions,
      gap: adminStyles.spacing.md,
      paddingTop: adminStyles.spacing.sm,
    },    outlineButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.outline,
      marginRight: adminStyles.spacing.lg,
    },
    primaryButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
    },
    disabledButton: adminStyles.buttons.disabled,
    
    // Estilos de loading
    loadingContainer: {
      ...adminStyles.containers.page,
      ...adminStyles.loadingStyles.container,
    },
    loadingOverlay: adminStyles.loadingStyles.overlay,
    loadingSpinner: adminStyles.loadingStyles.spinner,
    loadingText: adminStyles.loadingStyles.text,
    loadingSubtext: adminStyles.loadingStyles.subtext,
    
    // Utilidades
    textCenter: adminStyles.utilities.textCenter,
  };

  // Estados para datos
  const [videos, setVideos] = useState([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    video: null,
    imagen: null,
    imagenPreview: null,
    videoPreview: null
  });

  // Cargar videos al montar el componente
  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para cargar videos
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const data = await adminAPI.getVideos();
      setVideos(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error al cargar videos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manejadores de eventos para formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        imagen: file,
        imagenPreview: imageUrl
      });
    }
  };

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        video: file,
        videoPreview: videoUrl
      });
    }
  };

  // Manejadores de modal
  const handleOpenCreateModal = () => {
    setCurrentVideo(null);
    setFormData({
      titulo: '',
      descripcion: '',
      video: null,
      imagen: null,
      imagenPreview: null,
      videoPreview: null
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (video) => {
    setCurrentVideo(video);
    setFormData({
      titulo: video.titulo || '',
      descripcion: video.descripcion || '',
      video: null,
      imagen: null,
      imagenPreview: video.miniatura || null,
      videoPreview: null
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      handleCloseModal();
    }
  };
  // Función para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      
      if (formData.video) {
        formDataToSend.append('video', formData.video);
      }
      
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }
      
      setUploading(true);
      
      if (currentVideo) {
        await adminAPI.updateVideo(currentVideo._id, formDataToSend);
      } else {
        await adminAPI.createVideo(formDataToSend);
      }
      
      setUploading(false);
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || err.message);
      console.error('Error al guardar video:', err);
    }
  };

  // Función para eliminar video
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este video?')) {
      return;
    }
    
    try {
      await adminAPI.deleteVideo(id);
      
      fetchVideos();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error al eliminar video:', err);
    }
  };

  // Función para reproducir video
  const handlePlayVideo = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Renderizado condicional para loading
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.textCenter}>
          <h3>Cargando videos...</h3>
        </div>
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
              <FaVideo style={{ marginRight: adminStyles.spacing.md }} />
              Gestión de Videos
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todos los videos del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            onClick={handleOpenCreateModal}
            aria-label="Agregar nuevo video"
          >
            <FaPlus size={14} style={{ marginRight: adminStyles.spacing.xs }} />
            Agregar Video
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Contenido principal */}
        {videos.length === 0 ? (
          <div style={styles.emptyState}>
            <FaVideo size={40} style={{ opacity: 0.3, marginBottom: adminStyles.spacing.lg }} />
            <h3 style={styles.emptyStateText}>No hay videos disponibles</h3>
            <p style={styles.emptyStateSubtext}>
              ¡Agrega un nuevo video para comenzar!
            </p>
          </div>
        ) : (
          <div style={adminStyles.combineStyles(
            styles.content,
            {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: adminStyles.spacing.lg
            }
          )}>
            {videos.map((video) => (
              <div key={video._id} style={styles.cardBase}>
                <div 
                  style={adminStyles.combineStyles(
                    styles.cardImageContainer,
                    { cursor: 'pointer' }
                  )}
                  onClick={() => handlePlayVideo(video.url)}
                >
                  {video.miniatura ? (
                    <>
                      <img 
                        src={video.miniatura} 
                        alt={video.titulo} 
                        style={styles.cardImage} 
                      />
                      <div style={styles.cardPlayButton}>
                        <FaPlay size={20} />
                      </div>
                    </>
                  ) : (
                    <div style={styles.cardPlaceholder}>
                      <FaVideo size={40} />
                      <p>Sin miniatura</p>
                    </div>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {video.titulo || 'Sin título'}
                  </h3>
                  <p style={styles.cardDescription}>
                    {video.descripcion || 'Sin descripción'}
                  </p>                  <div style={styles.cardActions}>
                    <button
                      style={adminStyles.combineStyles(
                        styles.actionButton,
                        styles.editAction
                      )}
                      onClick={() => handleOpenEditModal(video)}
                      title="Editar video"
                      aria-label={`Editar video ${video.titulo || 'Sin título'}`}
                    >
                      <FaEdit size={14} style={{ marginRight: adminStyles.spacing.xs }} />
                      Editar
                    </button>
                    <button
                      style={adminStyles.combineStyles(
                        styles.actionButton,
                        styles.deleteAction
                      )}
                      onClick={() => handleDelete(video._id)}
                      title="Eliminar video"
                      aria-label={`Eliminar video ${video.titulo || 'Sin título'}`}
                    >
                      <FaTrash size={14} style={{ marginRight: adminStyles.spacing.xs }} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}        {/* Modal para crear/editar video */}
        {modalOpen && (
          <div 
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={handleOutsideClick}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
                <h2 style={styles.modalTitle}>
                  {currentVideo ? 'Editar Video' : 'Agregar Nuevo Video'}
                </h2>
                
                <div style={styles.formContainer}>
                  <form onSubmit={handleSubmit}>
                    {/* Campo título */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="titulo">
                        Título
                        <span style={styles.requiredField}>*</span>
                      </label>
                      <input
                        style={styles.input}
                        type="text"
                        id="titulo"
                        name="titulo"
                        value={formData.titulo}
                        onChange={handleChange}
                        placeholder="Ingresa el título del video"
                        required
                      />
                    </div>
                    
                    {/* Campo descripción */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="descripcion">
                        Descripción
                      </label>
                      <textarea
                        style={styles.textarea}
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        placeholder="Describe el contenido del video (opcional)"
                        rows={4}
                      />
                    </div>
                    
                    {/* Campo archivo de video */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="video">
                        Archivo de Video
                        <span style={styles.requiredField}>*</span>
                      </label>
                      <div style={styles.fileInputContainer}>
                        <input
                          style={styles.fileInput}
                          type="file"
                          id="video"
                          name="video"
                          accept="video/*"
                          onChange={handleVideoChange}
                          {...(currentVideo ? {} : { required: true })}
                        />
                        <small style={styles.helpText}>
                          Formatos recomendados: MP4, WebM, AVI (Máximo 100MB)
                        </small>
                      </div>
                      
                      {formData.videoPreview && (
                        <div style={styles.previewContainer}>
                          <span style={styles.previewLabel}>Vista previa del video:</span>
                          <video 
                            controls 
                            src={formData.videoPreview} 
                            style={styles.previewMedia}
                            preload="metadata"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Campo miniatura personalizada */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="imagen">
                        Miniatura personalizada (opcional)
                      </label>
                      <div style={styles.fileInputContainer}>
                        <input
                          style={styles.fileInput}
                          type="file"
                          id="imagen"
                          name="imagen"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        <small style={styles.helpText}>
                          Formatos recomendados: JPG, PNG, GIF (Máximo 5MB)
                        </small>
                        <small style={styles.helpText}>
                          Si no seleccionas una miniatura, el sistema generará una automáticamente desde el video.
                        </small>
                      </div>
                      
                      {formData.imagenPreview && (
                        <div style={styles.previewContainer}>
                          <span style={styles.previewLabel}>Vista previa de la miniatura:</span>
                          <img 
                            src={formData.imagenPreview} 
                            alt="Vista previa de miniatura" 
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
                        style={styles.outlineButton}
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={uploading}
                        style={adminStyles.combineStyles(
                          styles.primaryButton,
                          uploading ? styles.disabledButton : {}
                        )}
                      >
                        {uploading 
                          ? 'Procesando...' 
                          : currentVideo 
                            ? 'Actualizar Video' 
                            : 'Crear Video'
                        }
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlay de carga durante subida */}
        {uploading && (
          <div style={styles.loadingOverlay}>
            <FaClock style={styles.loadingSpinner} />
            <div style={styles.loadingText}>Espera...</div>
            <p style={styles.loadingSubtext}>Estamos procesando tu video</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionVideos;