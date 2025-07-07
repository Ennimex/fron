import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaImage, FaSpinner, FaConciergeBell, FaTimes, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminServices';
import { useAdminNotifications } from '../../services/adminHooks';
import NotificationContainer from '../../components/admin/NotificationContainer';
import stylesGlobal from '../../styles/stylesGlobal';

// Agregar estilos CSS para animaciones de modales
const modalStyles = `
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

  .modal-overlay-servicios {
    animation: overlayFadeIn 0.3s ease-out;
  }

  .modal-content-servicios {
    animation: modalFadeIn 0.3s ease-out;
  }

  .modal-content-servicios:hover .modal-close-btn {
    opacity: 1;
  }

  .modal-close-btn {
    transition: all 0.2s ease;
    opacity: 0.7;
  }

  .modal-close-btn:hover {
    opacity: 1 !important;
    background-color: #fee2e2 !important;
    color: #dc2626 !important;
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = modalStyles;
  if (!document.head.querySelector('style[data-modal-servicios-styles]')) {
    styleElement.setAttribute('data-modal-servicios-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const GestionServicio = () => {
  const { user, isAuthenticated } = useAuth();

  // Hook de notificaciones centralizado
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

  // Mapeo de estilos usando el sistema de diseño global
  const styles = {
    pageContainer: {
      backgroundColor: stylesGlobal.colors.surface.secondary,
      minHeight: '100vh',
      padding: stylesGlobal.spacing.sections.md,
    },
    container: {
      maxWidth: stylesGlobal.utils.container.maxWidth.xl,
      margin: stylesGlobal.utils.container.margin,
      backgroundColor: stylesGlobal.colors.surface.primary,
      borderRadius: stylesGlobal.borders.radius.xl,
      boxShadow: stylesGlobal.shadows.md,
      overflow: 'hidden',
    },
    header: {
      backgroundColor: stylesGlobal.colors.primary[500],
      color: stylesGlobal.colors.primary.contrast,
      padding: `${stylesGlobal.spacing.scale[6]} ${stylesGlobal.spacing.scale[8]}`,
    },
    headerContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: stylesGlobal.utils.container.maxWidth.xl,
      margin: '0 auto',
    },
    title: {
      ...stylesGlobal.typography.headings.h2,
      color: stylesGlobal.colors.primary.contrast,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    subtitle: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.primary[100],
      opacity: 0.9,
    },
    button: {
      ...stylesGlobal.components.button.sizes.base,
      ...stylesGlobal.components.button.variants.primary,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.scale[2],
    },
    controlsContainer: {
      padding: stylesGlobal.spacing.scale[6],
      paddingBottom: 0,
    },
    searchContainer: {
      width: '100%',
      maxWidth: '400px',
    },
    searchInput: {
      ...stylesGlobal.components.input.base,
      width: '100%',
    },
    content: {
      padding: stylesGlobal.spacing.scale[6],
    },
    tableContainer: {
      overflowX: 'auto',
      borderRadius: stylesGlobal.borders.radius.lg,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '800px',
    },
    tableHeader: {
      backgroundColor: stylesGlobal.colors.surface.tertiary,
    },
    tableHeaderCell: {
      padding: stylesGlobal.spacing.scale[4],
      textAlign: 'left',
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.secondary,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    tableRow: {
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      transition: stylesGlobal.animations.transitions.base,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.surface.secondary,
      },
    },
    tableCell: {
      padding: stylesGlobal.spacing.scale[4],
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.primary,
    },
    actionsContainer: {
      display: 'flex',
      gap: stylesGlobal.spacing.scale[2],
    },
    actionButton: {
      ...stylesGlobal.components.button.sizes.sm,
      minWidth: 'auto',
      padding: stylesGlobal.spacing.scale[2],
    },
    editAction: {
      backgroundColor: stylesGlobal.colors.semantic.info.main,
      color: stylesGlobal.colors.semantic.info.contrast,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.info.dark,
      },
    },
    deleteAction: {
      backgroundColor: stylesGlobal.colors.semantic.error.main,
      color: stylesGlobal.colors.semantic.error.contrast,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.error.dark,
      },
    },
    emptyState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: stylesGlobal.spacing.scale[20],
      textAlign: 'center',
    },
    emptyStateText: {
      ...stylesGlobal.typography.headings.h4,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    emptyStateSubtext: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.tertiary,
      maxWidth: '400px',
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
      padding: stylesGlobal.spacing.scale[6],
    },
    modalContent: {
      ...stylesGlobal.components.card.luxury,
      width: '100%',
      maxWidth: '800px',
      maxHeight: '90vh',
      overflow: 'auto',
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
    modalHeader: {
      padding: stylesGlobal.spacing.scale[6],
      paddingTop: stylesGlobal.spacing.scale[8], // Extra space for close button
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      position: 'relative',
    },
    modalTitle: {
      ...stylesGlobal.typography.headings.h3,
      color: stylesGlobal.colors.text.primary,
    },
    modalBody: {
      padding: stylesGlobal.spacing.scale[6],
      position: 'relative',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: stylesGlobal.spacing.scale[6],
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    label: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.secondary,
      display: 'block',
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    requiredField: {
      color: stylesGlobal.colors.semantic.error.main,
    },
    input: {
      ...stylesGlobal.components.input.base,
      width: '100%',
    },
    textarea: {
      ...stylesGlobal.components.input.base,
      width: '100%',
      minHeight: '120px',
      resize: 'vertical',
    },
    imageUploadArea: {
      border: `2px dashed ${stylesGlobal.borders.colors.default}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      cursor: 'pointer',
      transition: stylesGlobal.animations.transitions.base,
      '&:hover': {
        borderColor: stylesGlobal.colors.primary[400],
      },
    },
    uploadText: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[1],
    },
    uploadSubtext: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.text.tertiary,
    },
    fileInput: {
      display: 'none',
    },
    previewContainer: {
      marginTop: stylesGlobal.spacing.scale[4],
    },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: stylesGlobal.borders.radius.base,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    submitButton: {
      ...stylesGlobal.components.button.sizes.base,
      ...stylesGlobal.components.button.variants.primary,
      width: '100%',
      justifyContent: 'center',
      marginTop: stylesGlobal.spacing.scale[6],
    },
    submitButtonDisabled: {
      opacity: 0.7,
      cursor: 'not-allowed',
      '&:hover': {
        transform: 'none',
      },
    },
  };

  // Estados
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);

  const [servicio, setServicio] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
    imagen: null,
  });

  // Verificar autenticación y rol al cargar
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setLoading(false);
      return;
    }
  }, [isAuthenticated, user]);

  // Cargar servicios usando adminService
  const fetchServicios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getServicios();
      setServicios(data || []);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al cargar servicios:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Cerrar modal con cleanup - Definido antes para evitar advertencias de ESLint
  const closeModal = useCallback(() => {
    // Cleanup de blobs
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setShowModal(false);
    setServicio({
      nombre: '',
      titulo: '',
      descripcion: '',
      imagen: null,
    });
    setImagePreview(null);
    setSelectedServicio(null);
    setIsEditMode(false);
  }, [imagePreview]);

  // Cargar datos iniciales
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchServicios();
    }
  }, [isAuthenticated, user, fetchServicios]);

  // Manejar tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showModal, closeModal]);

  // Cleanup de blobs al desmontar el componente
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imagen' && files && files[0]) {
      const file = files[0];
      
      // Validaciones mejoradas
      const maxSize = 10 * 1024 * 1024; // 10MB
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      
      if (file.size > maxSize) {
        addNotification('La imagen no puede superar los 10MB', 'error');
        return;
      }

      if (!allowedTypes.includes(file.type)) {
        addNotification('Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)', 'error');
        return;
      }

      // Cleanup del blob anterior si existe
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }

      setServicio(prev => ({ ...prev, imagen: file }));
      
      // Crear nueva URL de blob para preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        addNotification('Error al procesar la imagen', 'error');
      };
      reader.readAsDataURL(file);
      
    } else {
      setServicio(prev => ({ ...prev, [name]: value }));
    }
  };

  // Abrir modal para nuevo servicio
  const openModal = (editServicio = null) => {
    // Cleanup del blob anterior si existe
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    if (editServicio) {
      setIsEditMode(true);
      setSelectedServicio(editServicio);
      setServicio({
        nombre: editServicio.nombre || '',
        titulo: editServicio.titulo || '',
        descripcion: editServicio.descripcion || '',
        imagen: null,
      });
      setImagePreview(editServicio.imagen || null);
    } else {
      setIsEditMode(false);
      setSelectedServicio(null);
      setServicio({
        nombre: '',
        titulo: '',
        descripcion: '',
        imagen: null,
      });
      setImagePreview(null);
    }
    setShowModal(true);
  };

  // Cerrar modal al hacer clic fuera
  const handleModalOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  // Subir imagen (ya no necesario, el backend maneja todo)
  // const uploadImage = async (imageFile) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('image', imageFile);
      
  //     const response = await api.post('/upload', formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //     });
      
  //     return response.imageUrl;
  //   } catch (error) {
  //     console.error('Error al subir imagen:', error);
  //     throw new Error('Error al subir la imagen');
  //   }
  // };

  // Guardar servicio usando adminService
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!servicio.nombre || !servicio.titulo || !servicio.descripcion) {
      addNotification('Todos los campos son obligatorios', 'error');
      return;
    }

    try {
      setFormLoading(true);
      
      const formData = new FormData();
      formData.append('nombre', servicio.nombre.trim());
      formData.append('titulo', servicio.titulo.trim());
      formData.append('descripcion', servicio.descripcion.trim());
      
      if (servicio.imagen) {
        formData.append('imagen', servicio.imagen);
      }

      if (isEditMode) {
        const updated = await adminService.updateServicio(selectedServicio._id, formData);
        setServicios(servicios.map(s => s._id === selectedServicio._id ? updated : s));
      } else {
        const created = await adminService.createServicio(formData);
        setServicios([created, ...servicios]);
      }

      closeModal();
      await fetchServicios(); // Refrescar lista
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al guardar servicio:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar servicio usando adminService
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }

    try {
      setFormLoading(true);
      await adminService.deleteServicio(id);
      setServicios(servicios.filter(s => s._id !== id));
      await fetchServicios(); // Refrescar lista
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al eliminar servicio:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Filtrar servicios
  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Guards de autenticación tempranos
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{
        ...styles.pageContainer,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '80vh',
        textAlign: 'center',
      }}>
        <FaLock size={50} style={{ color: stylesGlobal.colors.semantic.error.main, marginBottom: stylesGlobal.spacing.scale[4] }} />
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
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '200px'
          }}>
            <FaSpinner style={{ 
              animation: 'spin 1s linear infinite', 
              fontSize: '3rem', 
              color: stylesGlobal.colors.primary[500],
              marginBottom: stylesGlobal.spacing.scale[4]
            }} />
            <h3 style={stylesGlobal.typography.headings.h3}>Cargando servicios...</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Gestión de Servicios</h1>
              <p style={styles.subtitle}>
                Administra los servicios de tu negocio
              </p>
            </div>
            <button
              style={{
                ...styles.button,
                ...(formLoading || loading ? styles.submitButtonDisabled : {}),
              }}
              onClick={() => openModal()}
              disabled={formLoading || loading}
              aria-label="Crear nuevo servicio"
            >
              <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
              Nuevo Servicio
            </button>
          </div>
        </div>

        {/* Controles */}
        <div style={styles.controlsContainer}>
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Tabla de servicios */}
        <div style={styles.content}>
          {filteredServicios.length === 0 ? (
            <div style={styles.emptyState}>
              <FaConciergeBell style={{ 
                fontSize: '4rem', 
                color: stylesGlobal.colors.neutral[400], 
                marginBottom: stylesGlobal.spacing.scale[6] 
              }} />
              <h3 style={styles.emptyStateText}>No hay servicios</h3>
              <p style={styles.emptyStateSubtext}>
                {searchTerm ? 'No se encontraron servicios con ese criterio de búsqueda' : 'Comienza creando tu primer servicio'}
              </p>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Imagen</th>
                    <th style={styles.tableHeaderCell}>Nombre</th>
                    <th style={styles.tableHeaderCell}>Título</th>
                    <th style={styles.tableHeaderCell}>Descripción</th>
                    <th style={styles.tableHeaderCell}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServicios.map((servicio) => (
                    <tr key={servicio._id} style={styles.tableRow}>
                      <td style={styles.tableCell}>
                        {servicio.imagen ? (
                          <img
                            src={servicio.imagen}
                            alt={servicio.nombre}
                            style={{
                              width: '60px',
                              height: '60px',
                              objectFit: 'cover',
                              borderRadius: stylesGlobal.borders.radius.base,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '60px',
                              height: '60px',
                              backgroundColor: stylesGlobal.colors.neutral[100],
                              borderRadius: stylesGlobal.borders.radius.base,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <FaImage style={{ color: stylesGlobal.colors.neutral[400] }} />
                          </div>
                        )}
                      </td>
                      <td style={styles.tableCell}>{servicio.nombre}</td>
                      <td style={styles.tableCell}>{servicio.titulo}</td>
                      <td style={styles.tableCell}>
                        {servicio.descripcion?.length > 100
                          ? `${servicio.descripcion.substring(0, 100)}...`
                          : servicio.descripcion}
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionsContainer}>
                          <button
                            style={{
                              ...styles.actionButton, 
                              ...styles.editAction,
                              ...(formLoading ? styles.submitButtonDisabled : {}),
                            }}
                            onClick={() => openModal(servicio)}
                            disabled={formLoading}
                            title="Editar servicio"
                            aria-label={`Editar servicio ${servicio.nombre}`}
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            style={{
                              ...styles.actionButton, 
                              ...styles.deleteAction,
                              ...(formLoading ? styles.submitButtonDisabled : {}),
                            }}
                            onClick={() => handleDelete(servicio._id)}
                            disabled={formLoading}
                            title="Eliminar servicio"
                            aria-label={`Eliminar servicio ${servicio.nombre}`}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          style={styles.modalOverlay}
          className="modal-overlay-servicios"
          onClick={handleModalOverlayClick}
        >
          <div style={styles.modalContent} className="modal-content-servicios" onClick={(e) => e.stopPropagation()}>
            <button
              style={styles.modalCloseButton}
              className="modal-close-btn"
              onClick={closeModal}
              aria-label="Cerrar modal"
              disabled={formLoading}
              title="Cerrar"
            >
              <FaTimes />
            </button>
            
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} style={styles.modalBody}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Nombre <span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={servicio.nombre}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Nombre del servicio"
                    required
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    Título <span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={servicio.titulo}
                    onChange={handleChange}
                    style={styles.input}
                    placeholder="Título del servicio"
                    required
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Descripción <span style={styles.requiredField}>*</span>
                </label>
                <textarea
                  name="descripcion"
                  value={servicio.descripcion}
                  onChange={handleChange}
                  style={styles.textarea}
                  rows="4"
                  placeholder="Describe el servicio..."
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Imagen del Servicio</label>
                <div style={styles.imageUploadArea}>
                  <input
                    type="file"
                    name="imagen"
                    accept="image/*"
                    onChange={handleChange}
                    style={styles.fileInput}
                    id="imagen-upload"
                  />
                  <label htmlFor="imagen-upload" style={{...styles.uploadText, cursor: 'pointer'}}>
                    <FaPlus size={16} style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
                    Subir imagen
                  </label>
                  <p style={styles.uploadSubtext}>
                    PNG, JPG, GIF hasta 10MB
                  </p>
                </div>
                
                {imagePreview && (
                  <div style={styles.previewContainer}>
                    <img
                      src={imagePreview}
                      alt="Vista previa"
                      style={styles.previewImage}
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                style={{
                  ...styles.submitButton,
                  ...(formLoading ? styles.submitButtonDisabled : {})
                }}
                disabled={formLoading}
                aria-label={isEditMode ? 'Actualizar servicio' : 'Crear servicio'}
              >
                {formLoading ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
                    {isEditMode ? 'Actualizar Servicio' : 'Crear Servicio'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Sistema de notificaciones centralizado */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default GestionServicio;
