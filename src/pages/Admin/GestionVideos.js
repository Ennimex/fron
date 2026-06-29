import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaPlay, FaClock, FaLock, FaSpinner } from 'react-icons/fa';
import InfoBanner from '../../components/admin/ui/InfoBanner';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import adminService from '../../services/adminServices';
import { useAdminNotifications } from '../../services/adminHooks';
import NotificationContainer from '../../components/admin/NotificationContainer';
import stylesGlobal from '../../styles/stylesGlobal';
import adminTheme from '../../styles/adminTheme';

// Inyectar estilos CSS responsivos
if (!document.getElementById('gestion-videos-responsive-styles')) {
  const style = document.createElement('style');
  style.id = 'gestion-videos-responsive-styles';
  style.textContent = `
    /* Estilos responsivos para GestionVideos */
    @media (max-width: 768px) {
      .videos-container {
        padding: 1rem !important;
      }
      
      .videos-header {
        flex-direction: column !important;
        gap: 1rem !important;
        align-items: flex-start !important;
      }
      
      .videos-header-text h1 {
        font-size: 1.5rem !important;
        margin-bottom: 0.5rem !important;
      }
      
      .videos-add-btn {
        width: 100% !important;
        justify-content: center !important;
      }
      
      .videos-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
        gap: 1rem !important;
      }
      
      .videos-card {
        min-height: auto !important;
      }
      
      .videos-card-content {
        padding: 0.75rem !important;
      }
      
      .videos-card-title {
        font-size: 1rem !important;
        margin-bottom: 0.5rem !important;
      }
      
      .videos-card-description {
        font-size: 0.875rem !important;
        margin-bottom: 0.75rem !important;
      }
      
      .videos-card-actions {
        flex-direction: column !important;
        gap: 0.25rem !important;
      }
      
      .videos-action-btn {
        width: 100% !important;
        font-size: 0.75rem !important;
        padding: 0.375rem 0.75rem !important;
      }
      
      .videos-modal-content {
        margin: 1rem !important;
        max-width: calc(100% - 2rem) !important;
        max-height: calc(100vh - 2rem) !important;
      }
      
      .videos-modal-header h2 {
        font-size: 1.25rem !important;
        margin-bottom: 1rem !important;
      }
      
      .videos-modal-body {
        padding: 1rem !important;
        padding-top: 2.5rem !important;
      }
      
      .videos-form-group {
        margin-bottom: 1rem !important;
      }
      
      .videos-modal-actions {
        flex-direction: column-reverse !important;
        gap: 0.75rem !important;
      }
      
      .videos-modal-btn {
        width: 100% !important;
      }
      
      .videos-preview-container {
        margin-top: 1rem !important;
        padding: 0.75rem !important;
      }
      
      .videos-preview-media {
        max-height: 200px !important;
      }
    }

    @media (max-width: 480px) {
      .videos-container {
        padding: 0.5rem !important;
      }
      
      .videos-grid {
        grid-template-columns: 1fr !important;
        gap: 0.75rem !important;
      }
      
      .videos-card-content {
        padding: 0.5rem !important;
      }
      
      .videos-card-title {
        font-size: 0.875rem !important;
      }
      
      .videos-card-description {
        font-size: 0.75rem !important;
      }
      
      .videos-modal-body {
        padding: 0.75rem !important;
        padding-top: 2rem !important;
      }
      
      .videos-form-group {
        margin-bottom: 0.75rem !important;
      }
      
      .videos-preview-media {
        max-height: 150px !important;
      }
    }
    
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: scale(0.8);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes overlayFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-overlay {
      animation: overlayFadeIn 0.3s ease-out;
    }

    .modal-content {
      animation: modalFadeIn 0.3s ease-out;
    }

    .modal-content:hover .modal-close-btn {
      opacity: 1;
    }

    .modal-close-btn {
      transition: all 0.2s ease;
      opacity: 0.7;
    }

    .modal-close-btn:hover {
      opacity: 1 !important;
      background-color: #fef2f2 !important;
      color: #dc2626 !important;
    }
  `;
  document.head.appendChild(style);
}

const GestionVideos = () => {
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
      backgroundColor: adminTheme.bg,
      minHeight: "100vh",
    },
    mainContainer: {
      maxWidth: stylesGlobal.utils.container.maxWidth.xl,
      margin: stylesGlobal.spacing.margins.auto,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[8],
    },
    title: {
      fontFamily: stylesGlobal.typography.families.display,
      fontSize: "1.9rem",
      fontWeight: 700,
      color: stylesGlobal.colors.text.primary,
      display: 'flex',
      alignItems: 'center',
    },
    subtitle: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.text.secondary,
    },
    addButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: 'flex',
      alignItems: 'center',
    },
    content: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: stylesGlobal.spacing.gaps.lg,
    },
    error: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.semantic.error.main,
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      padding: stylesGlobal.spacing.scale[4],
      borderRadius: stylesGlobal.borders.radius.md,
      marginBottom: stylesGlobal.spacing.scale[4],
      textAlign: 'center',
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: stylesGlobal.spacing.scale[12],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.lg,
      border: `1px solid ${stylesGlobal.borders.colors.muted}`,
    },
    emptyStateText: {
      ...stylesGlobal.typography.headings.h3,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    emptyStateSubtext: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.tertiary,
    },
    cardBase: {
      ...stylesGlobal.components.card.base,
      ...stylesGlobal.components.card.interactive,
    },
    cardImageContainer: {
      position: 'relative',
      width: '100%',
      aspectRatio: '16 / 9',
      overflow: 'hidden',
      borderTopLeftRadius: stylesGlobal.borders.radius.lg,
      borderTopRightRadius: stylesGlobal.borders.radius.lg,
    },
    cardImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    cardPlayButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: stylesGlobal.colors.surface.glass,
      borderRadius: stylesGlobal.borders.radius.full,
      padding: stylesGlobal.spacing.scale[4],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: stylesGlobal.animations.transitions.elegant,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.primary[500],
        color: stylesGlobal.colors.primary.contrast,
      },
    },
    cardPlaceholder: {
      ...stylesGlobal.components.card.base,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      backgroundColor: stylesGlobal.colors.neutral[100],
      color: stylesGlobal.colors.neutral[500],
    },
    cardContent: {
      padding: stylesGlobal.spacing.scale[4],
    },
    cardTitle: {
      ...stylesGlobal.typography.headings.h4,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    cardDescription: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    cardActions: {
      display: 'flex',
      gap: stylesGlobal.spacing.gaps.md,
    },
    // --- Lista de videos como grid de tarjetas tipo galería ---
    mediaGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: stylesGlobal.spacing.scale[5] },
    mediaCard: { backgroundColor: stylesGlobal.colors.surface.primary, border: `1px solid ${stylesGlobal.colors.neutral[200]}`, borderRadius: stylesGlobal.borders.radius.xl, overflow: "hidden", boxShadow: stylesGlobal.shadows.sm, display: "flex", flexDirection: "column" },
    mediaThumbWrap: { position: "relative", width: "100%", aspectRatio: "16 / 9", backgroundColor: stylesGlobal.colors.neutral[100], overflow: "hidden" },
    mediaThumbImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
    mediaThumbFallback: { width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: stylesGlobal.colors.gradients.primary, color: stylesGlobal.colors.text.inverse, fontFamily: adminTheme.serif, fontWeight: 700, fontSize: "34px" },
    mediaPlay: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "54px", height: "54px", borderRadius: "50%", background: "rgba(0,0,0,0.45)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" },
    mediaBody: { padding: stylesGlobal.spacing.scale[5], display: "flex", flexDirection: "column", gap: stylesGlobal.spacing.scale[2], flex: 1 },
    mediaTitle: { fontFamily: adminTheme.serif, fontSize: stylesGlobal.typography.scale.lg, fontWeight: 700, color: stylesGlobal.colors.text.primary, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
    mediaDesc: { color: stylesGlobal.colors.text.secondary, fontSize: stylesGlobal.typography.scale.sm, lineHeight: 1.5, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", minHeight: "2.6em" },
    mediaFooter: { display: "flex", justifyContent: "flex-end", gap: stylesGlobal.spacing.scale[2], marginTop: "auto", paddingTop: stylesGlobal.spacing.scale[3], borderTop: `1px solid ${stylesGlobal.colors.neutral[200]}` },
    cardAct: {
      width: "36px",
      height: "36px",
      borderRadius: stylesGlobal.borders.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
      transition: stylesGlobal.animations.transitions.base,
    },
    cardActEdit: {
      backgroundColor: stylesGlobal.colors.accent[50],
      color: stylesGlobal.colors.accent[600],
    },
    cardActDel: {
      backgroundColor: stylesGlobal.colors.primary[50],
      color: stylesGlobal.colors.primary[500],
    },
    modalOverlay: {
      ...stylesGlobal.utils.overlay.elegant,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1300,
    },
    modalContent: {
      ...stylesGlobal.components.card.luxury,
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      margin: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      transform: 'scale(1)',
      transition: 'all 0.3s ease-in-out',
    },
    deleteModalContent: {
      ...stylesGlobal.components.card.luxury,
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
      position: 'relative',
      margin: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      transform: 'scale(1)',
      transition: 'all 0.3s ease-in-out',
    },
    modalCloseButton: {
      ...stylesGlobal.components.button.variants.ghost,
      ...stylesGlobal.components.button.sizes.sm,
      position: 'absolute',
      top: stylesGlobal.spacing.scale[3],
      right: stylesGlobal.spacing.scale[3],
      width: '32px',
      height: '32px',
      borderRadius: stylesGlobal.borders.radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      zIndex: 10,
      backgroundColor: stylesGlobal.colors.surface.secondary,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      cursor: 'pointer',
    },
    modalTitle: {
      ...stylesGlobal.typography.headings.h2,
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: stylesGlobal.spacing.gaps.md,
      marginTop: stylesGlobal.spacing.scale[6],
      paddingTop: stylesGlobal.spacing.scale[4],
      borderTop: `1px solid ${stylesGlobal.borders.colors.muted}`,
    },
    modalBody: {
      padding: stylesGlobal.spacing.scale[6],
      position: 'relative',
      paddingTop: stylesGlobal.spacing.scale[8], // Extra space for close button
    },
    formContainer: {
      width: '100%',
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    label: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[2],
      display: 'block',
    },
    requiredField: {
      color: stylesGlobal.colors.semantic.error.main,
      marginLeft: stylesGlobal.spacing.scale[1],
    },
    input: {
      ...stylesGlobal.components.input.base,
    },
    inputFocus: {
      ...stylesGlobal.components.input.base['&:focus'],
    },
    textarea: {
      ...stylesGlobal.components.input.base,
      minHeight: '100px',
      resize: 'vertical',
    },
    fileInputContainer: {
      position: 'relative',
    },
    fileInput: {
      ...stylesGlobal.components.input.base,
      cursor: 'pointer',
    },
    helpText: {
      ...stylesGlobal.typography.body.caption,
      color: stylesGlobal.colors.text.muted,
      marginTop: stylesGlobal.spacing.scale[2],
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    previewContainer: {
      marginTop: stylesGlobal.spacing.scale[4],
      padding: stylesGlobal.spacing.scale[4],
      backgroundColor: stylesGlobal.colors.neutral[50],
      borderRadius: stylesGlobal.borders.radius.md,
      border: `1px solid ${stylesGlobal.borders.colors.muted}`,
    },
    previewLabel: {
      ...stylesGlobal.typography.body.caption,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.secondary,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    previewMedia: {
      maxWidth: '100%',
      height: 'auto',
      borderRadius: stylesGlobal.borders.radius.md,
      border: `1px solid ${stylesGlobal.borders.colors.muted}`,
    },
    actionButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.sm,
    },
    editAction: {
      ...stylesGlobal.components.button.variants.secondary,
    },
    deleteAction: {
      ...stylesGlobal.components.button.variants.secondary,
      borderColor: stylesGlobal.colors.semantic.error.main,
      color: stylesGlobal.colors.semantic.error.main,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.error.main,
        color: stylesGlobal.colors.semantic.error.contrast,
      },
    },
    outlineButton: {
      ...stylesGlobal.components.button.variants.ghost,
      ...stylesGlobal.components.button.sizes.base,
    },
    primaryButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    loadingContainer: {
      ...stylesGlobal.utils.container,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    },
    loadingOverlay: {
      ...stylesGlobal.utils.overlay.base,
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1400,
    },
    loadingSpinner: {
      fontSize: '2rem',
      animation: 'spin 1s linear infinite',
      color: stylesGlobal.colors.primary[500],
    },
    loadingText: {
      ...stylesGlobal.typography.headings.h3,
      marginTop: stylesGlobal.spacing.scale[4],
    },
    loadingSubtext: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
    },
    textCenter: {
      textAlign: 'center',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  // Estados para datos
  const [videos, setVideos] = useState([]);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    eventoId: '',
    video: null,
    imagen: null,
    imagenPreview: null,
    videoPreview: null,
  });

  // Fetch videos
  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getVideos();
      setVideos(data);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al cargar videos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch videos on component mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchVideos();
    }
  }, [isAuthenticated, user, fetchVideos]);

  // Cargar eventos para el selector (opcional)
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      adminService.getEventos().then(setEventos).catch(() => {});
    }
  }, [isAuthenticated, user]);

  // Cleanup preview URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (formData.imagenPreview && formData.imagenPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imagenPreview);
      }
      if (formData.videoPreview && formData.videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.videoPreview);
      }
    };
  }, [formData.imagenPreview, formData.videoPreview]);

  // Manejadores de eventos para formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        addNotificationRef.current('La imagen no debe exceder los 5MB', 'error');
        return;
      }
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        addNotificationRef.current('Solo se permiten imágenes JPG, PNG o GIF', 'error');
        return;
      }
      // Revoke previous preview URL
      if (formData.imagenPreview && formData.imagenPreview.startsWith('blob:')) {
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

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (100MB max)
      if (file.size > 100 * 1024 * 1024) {
        addNotificationRef.current('El video no debe exceder los 100MB', 'error');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('video/')) {
        addNotificationRef.current('Solo se permiten archivos de video', 'error');
        return;
      }
      // Revoke previous preview URL
      if (formData.videoPreview && formData.videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(formData.videoPreview);
      }
      const videoUrl = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        video: file,
        videoPreview: videoUrl,
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.titulo.trim()) {
      addNotificationRef.current('El título del video es obligatorio', 'error');
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
    if (!currentVideo && !formData.video) {
      addNotificationRef.current('Debes seleccionar un video', 'error');
      return false;
    }
    return true;
  };

  // Manejadores de modal
  const handleOpenCreateModal = () => {
    setCurrentVideo(null);
    setFormData({
      titulo: '',
      descripcion: '',
      eventoId: '',
      video: null,
      imagen: null,
      imagenPreview: null,
      videoPreview: null,
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (video) => {
    setCurrentVideo(video);
    setFormData({
      titulo: video.titulo || '',
      descripcion: video.descripcion || '',
      eventoId: video.eventoId?._id || video.eventoId || '',
      video: null,
      imagen: null,
      imagenPreview: video.miniatura || null,
      videoPreview: null,
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    // Revoke preview URLs
    if (formData.imagenPreview && formData.imagenPreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imagenPreview);
    }
    if (formData.videoPreview && formData.videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(formData.videoPreview);
    }
    setModalOpen(false);
    setFormData({
      titulo: '',
      descripcion: '',
      eventoId: '',
      video: null,
      imagen: null,
      imagenPreview: null,
      videoPreview: null,
    });
    setCurrentVideo(null);
  };

  // Handle delete modal
  const handleOpenDeleteModal = (video) => {
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setVideoToDelete(null);
  };

  // Función para enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setFormLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo.trim());
      formDataToSend.append('descripcion', formData.descripcion.trim());
      formDataToSend.append('eventoId', formData.eventoId || '');
      if (formData.video) {
        formDataToSend.append('video', formData.video);
      }
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      if (currentVideo) {
        await adminService.updateVideo(currentVideo._id, formDataToSend);
      } else {
        await adminService.createVideo(formDataToSend);
      }

      // adminService ya maneja las notificaciones de éxito automáticamente
      handleCloseModal();
      await fetchVideos();
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al procesar video:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Handle video deletion
  const handleDelete = async () => {
    if (!videoToDelete) return;

    try {
      setFormLoading(true);
      await adminService.deleteVideo(videoToDelete._id);
      // adminService ya maneja las notificaciones de éxito automáticamente
      handleCloseDeleteModal();
      await fetchVideos();
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al eliminar video:', err);
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

  // Renderizado condicional para loading
  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.textCenter}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
          <h3 style={stylesGlobal.typography.headings.h3}>Cargando videos...</h3>
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
              <FaVideo style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
              Gestión de Videos
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todos los videos del sistema
            </p>
          </div>
          <button
            style={{
              ...styles.addButton,
              ...(formLoading || loading ? styles.disabledButton : {}),
            }}
            onClick={handleOpenCreateModal}
            aria-label="Agregar nuevo video"
            disabled={formLoading || loading}
          >
            <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
            Agregar Video
          </button>
        </div>

        {/* Banner de ayuda */}
        <InfoBanner>
          Los videos <strong>sin evento</strong> se muestran en la <strong>Galería</strong> pública. Si un video es de un
          evento, lo más fácil es subirlo desde <strong>Eventos → Gestionar galería</strong> (también puedes asignarle el
          evento aquí abajo en el formulario).
        </InfoBanner>

        {/* Sistema de notificaciones centralizado */}
        <NotificationContainer
          notifications={notifications}
          onRemoveNotification={removeNotification}
          onClearAll={clearAllNotifications}
        />

        {/* Contenido principal */}
        {videos.length === 0 ? (
          <div style={styles.emptyState}>
            <FaVideo size={40} style={{ opacity: 0.3, marginBottom: stylesGlobal.spacing.scale[4] }} />
            <h3 style={styles.emptyStateText}>No hay videos disponibles</h3>
            <p style={styles.emptyStateSubtext}>
              ¡Agrega un nuevo video para comenzar!
            </p>
          </div>
        ) : (
          <div style={styles.mediaGrid}>
            {videos.map((video) => (
              <div key={video._id} style={styles.mediaCard}>
                <div style={styles.mediaThumbWrap}>
                  {video.miniatura ? (
                    <>
                      <img
                        src={video.miniatura}
                        alt={video.titulo || 'Video'}
                        style={styles.mediaThumbImg}
                      />
                      <div style={styles.mediaPlay}>
                        <FaPlay size={18} />
                      </div>
                    </>
                  ) : (
                    <div style={styles.mediaThumbFallback}>
                      <FaVideo size={30} />
                    </div>
                  )}
                </div>
                <div style={styles.mediaBody}>
                  <h3 style={styles.mediaTitle}>{video.titulo || 'Sin título'}</h3>
                  <p style={styles.mediaDesc}>{video.descripcion || 'Sin descripción'}</p>
                  <div style={styles.mediaFooter}>
                    <button
                      style={{ ...styles.cardAct, ...styles.cardActEdit }}
                      onClick={() => handleOpenEditModal(video)}
                      title="Editar video"
                      aria-label={`Editar video ${video.titulo || 'Sin título'}`}
                      disabled={formLoading || loading}
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      style={{ ...styles.cardAct, ...styles.cardActDel }}
                      onClick={() => handleOpenDeleteModal(video)}
                      title="Eliminar video"
                      aria-label={`Eliminar video ${video.titulo || 'Sin título'}`}
                      disabled={formLoading || loading}
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal para crear/editar video */}
        {modalOpen && (
          <div
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={(e) => e.target.classList.contains('modal-overlay') && handleCloseModal()}
          >
            <div style={styles.modalContent} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  className="modal-close-btn"
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                  disabled={formLoading}
                  title="Cerrar"
                >
                  ×
                </button>
                <h2 style={styles.modalTitle}>
                  {currentVideo ? 'Editar Video' : 'Agregar Nuevo Video'}
                </h2>
                <form onSubmit={handleSubmit} style={styles.formContainer}>
                    {/* Campo título */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="titulo">
                        Título del Video
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
                        placeholder="Ingresa un título descriptivo para el video"
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
                        placeholder="Describe el contenido del video (opcional)"
                        rows={4}
                        maxLength={500}
                        disabled={formLoading}
                      />
                      <small style={styles.helpText}>
                        Máximo 500 caracteres. Proporciona una descripción que ayude a los usuarios a comprender mejor el contenido.
                      </small>
                    </div>
                    {/* Campo evento (opcional) */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="eventoId">
                        Evento (opcional)
                      </label>
                      <select
                        style={styles.input}
                        id="eventoId"
                        name="eventoId"
                        value={formData.eventoId}
                        onChange={handleChange}
                        disabled={formLoading}
                      >
                        <option value="">Sin evento</option>
                        {eventos.map((ev) => (
                          <option key={ev._id} value={ev._id}>
                            {ev.titulo || 'Evento sin título'}
                          </option>
                        ))}
                      </select>
                      <small style={styles.helpText}>
                        Si el video pertenece a un evento, selecciónalo para que aparezca en su galería.
                      </small>
                    </div>
                    {/* Campo archivo de video */}
                    <div style={styles.formGroup}>
                      <label style={styles.label} htmlFor="video">
                        Archivo de Video
                        {!currentVideo && <span style={styles.requiredField}>*</span>}
                      </label>
                      <div style={styles.fileInputContainer}>
                        <input
                          style={styles.fileInput}
                          type="file"
                          id="video"
                          name="video"
                          accept="video/*"
                          onChange={handleVideoChange}
                          disabled={formLoading}
                          {...(currentVideo ? {} : { required: true })}
                        />
                        <small style={styles.helpText}>
                          Formatos recomendados: MP4, WebM, AVI. Tamaño máximo: 100MB.
                          {currentVideo && ' Deja vacío para mantener el video actual.'}
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
                          disabled={formLoading}
                        />
                        <small style={styles.helpText}>
                          Formatos recomendados: JPG, PNG, GIF. Tamaño máximo: 5MB.
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
                        aria-label={currentVideo ? 'Actualizar video' : 'Crear video'}
                      >
                        {formLoading ? (
                          <>
                            <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[1] }} />
                            {currentVideo ? 'Actualizando...' : 'Creando...'}
                          </>
                        ) : (
                          <>
                            <FaPlus size={12} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                            {currentVideo ? 'Actualizar Video' : 'Crear Video'}
                          </>
                        )}
                      </button>
                    </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación para eliminar video */}
        {deleteModalOpen && videoToDelete && (
          <div
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={(e) => e.target.classList.contains('modal-overlay') && handleCloseDeleteModal()}
          >
            <div style={styles.deleteModalContent} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  className="modal-close-btn"
                  onClick={handleCloseDeleteModal}
                  aria-label="Cerrar modal"
                  disabled={formLoading}
                  title="Cerrar"
                >
                  ×
                </button>
                <div style={{ textAlign: 'center' }}>
                  <FaTrash size={48} style={{ color: stylesGlobal.colors.semantic.error.main, marginBottom: stylesGlobal.spacing.scale[4] }} />
                  <h2 style={styles.modalTitle}>
                    ¿Eliminar Video?
                  </h2>
                  <p style={{ ...stylesGlobal.typography.body.base, marginBottom: stylesGlobal.spacing.scale[6] }}>
                    ¿Estás seguro de que deseas eliminar el video <strong>"{videoToDelete.titulo || 'Sin título'}"</strong>?
                  </p>
                  <p style={{ ...stylesGlobal.typography.body.caption, color: stylesGlobal.colors.text.muted, marginBottom: stylesGlobal.spacing.scale[6] }}>
                    Esta acción no se puede deshacer. El video y toda su información asociada se eliminarán permanentemente.
                  </p>
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      onClick={handleCloseDeleteModal}
                      style={{
                        ...styles.outlineButton,
                        ...(formLoading ? styles.disabledButton : {}),
                      }}
                      disabled={formLoading}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      style={{
                        ...styles.primaryButton,
                        backgroundColor: stylesGlobal.colors.semantic.error.main,
                        borderColor: stylesGlobal.colors.semantic.error.main,
                        ...(formLoading ? styles.disabledButton : {}),
                      }}
                      disabled={formLoading}
                      aria-label={`Confirmar eliminación del video ${videoToDelete.titulo || 'Sin título'}`}
                    >
                      {formLoading ? (
                        <>
                          <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[1] }} />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <FaTrash size={12} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                          Eliminar Video
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Overlay de carga durante subida */}
        {formLoading && (
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