import React, { useEffect, useState, useCallback, useRef } from "react";
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaLock, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import adminService from "../../services/adminServices";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import stylesGlobal from "../../styles/stylesGlobal";

// Agregar estilos CSS para animaciones y responsividad
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
    background-color: #fee2e2 !important;
    color: #dc2626 !important;
  }

  /* Estilos responsivos para la tabla de eventos */
  @media (max-width: 768px) {
    .eventos-table-container {
      overflow-x: auto;
      margin: 0 -16px;
      padding: 0 16px;
    }
    
    .eventos-table {
      min-width: 800px;
    }
    
    .eventos-table th,
    .eventos-table td {
      padding: 8px !important;
      font-size: 14px !important;
    }
    
    .eventos-actions {
      flex-direction: column !important;
      gap: 4px !important;
      align-items: stretch !important;
    }
    
    .eventos-action-btn {
      justify-content: center !important;
      font-size: 12px !important;
      padding: 6px 12px !important;
      min-width: auto !important;
    }
    
    .eventos-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 16px !important;
    }
    
    .eventos-add-btn {
      align-self: flex-start !important;
      width: fit-content !important;
    }
  }

  @media (max-width: 480px) {
    .eventos-modal-content {
      margin: 8px !important;
      width: calc(100% - 16px) !important;
      max-height: calc(100vh - 16px) !important;
    }
    
    .eventos-form-row {
      flex-direction: column !important;
      gap: 16px !important;
    }
    
    .eventos-form-three {
      flex-direction: column !important;
      gap: 16px !important;
    }
    
    .eventos-modal-actions {
      flex-direction: column !important;
      gap: 12px !important;
    }
    
    .eventos-modal-body {
      padding: 16px !important;
      padding-top: 48px !important;
    }
    
    .eventos-main-container {
      padding: 16px !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = modalStyles;
  if (!document.head.querySelector('style[data-modal-eventos-styles]')) {
    styleElement.setAttribute('data-modal-eventos-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const GestionEventos = () => {
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

  // Mapeo de estilos globales con mejoras responsivas
  const styles = {
    pageContainer: {
      ...stylesGlobal.utils.container,
      padding: stylesGlobal.spacing.sections.md,
      backgroundColor: stylesGlobal.colors.surface.primary,
      minHeight: '100vh',
    },
    mainContainer: {
      maxWidth: stylesGlobal.utils.container.maxWidth.lg,
      margin: stylesGlobal.spacing.margins.auto,
      padding: stylesGlobal.spacing.scale[4],
      // Responsive padding
      '@media (max-width: 768px)': {
        padding: stylesGlobal.spacing.scale[3],
      },
      '@media (max-width: 480px)': {
        padding: stylesGlobal.spacing.scale[2],
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[8],
      flexWrap: 'wrap',
      gap: stylesGlobal.spacing.gaps.md,
      // Responsive layout
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: stylesGlobal.spacing.gaps.lg,
      },
    },
    title: {
      ...stylesGlobal.typography.headings.h1,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.scale[2],
      // Responsive font size
      '@media (max-width: 768px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.25rem',
        flexDirection: 'column',
        textAlign: 'center',
        gap: stylesGlobal.spacing.scale[1],
      },
    },
    subtitle: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
      // Responsive text
      '@media (max-width: 480px)': {
        fontSize: '0.875rem',
        textAlign: 'center',
      },
    },
    addButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
      // Responsive button
      '@media (max-width: 768px)': {
        alignSelf: 'flex-start',
        width: 'fit-content',
      },
      '@media (max-width: 480px)': {
        fontSize: '0.875rem',
        padding: `${stylesGlobal.spacing.scale[2]} ${stylesGlobal.spacing.scale[4]}`,
      },
    },
    content: {
      padding: stylesGlobal.spacing.scale[4],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
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
    tableContainer: {
      overflowX: 'auto',
      padding: stylesGlobal.spacing.scale[2],
      // Responsive table container
      '@media (max-width: 768px)': {
        margin: `0 -${stylesGlobal.spacing.scale[3]}`,
        padding: stylesGlobal.spacing.scale[3],
      },
      '@media (max-width: 480px)': {
        margin: `0 -${stylesGlobal.spacing.scale[2]}`,
        padding: stylesGlobal.spacing.scale[2],
      },
    },
    table: {
      width: '100%',
      borderSpacing: `0 ${stylesGlobal.spacing.scale[2]}`,
      borderCollapse: 'separate',
      // Responsive table
      '@media (max-width: 768px)': {
        minWidth: '800px',
      },
    },
    tableHeader: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.secondary,
      padding: stylesGlobal.spacing.scale[3],
      textAlign: 'left',
      backgroundColor: stylesGlobal.colors.surface.tertiary,
      // Responsive header
      '@media (max-width: 768px)': {
        padding: stylesGlobal.spacing.scale[2],
        fontSize: '0.75rem',
      },
    },
    tableCell: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      // Responsive cell
      '@media (max-width: 768px)': {
        padding: stylesGlobal.spacing.scale[2],
        fontSize: '0.875rem',
      },
    },
    tableCellFirst: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderLeft: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderTopLeftRadius: stylesGlobal.borders.radius.sm,
      borderBottomLeftRadius: stylesGlobal.borders.radius.sm,
      // Responsive cell
      '@media (max-width: 768px)': {
        padding: stylesGlobal.spacing.scale[2],
        fontSize: '0.875rem',
      },
    },
    tableCellLast: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRight: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderTopRightRadius: stylesGlobal.borders.radius.sm,
      borderBottomRightRadius: stylesGlobal.borders.radius.sm,
      // Responsive cell
      '@media (max-width: 768px)': {
        padding: stylesGlobal.spacing.scale[2],
        fontSize: '0.875rem',
      },
    },
    actionButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.sm,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
      // Responsive button
      '@media (max-width: 768px)': {
        fontSize: '0.75rem',
        padding: `${stylesGlobal.spacing.scale[1]} ${stylesGlobal.spacing.scale[3]}`,
        justifyContent: 'center',
        minWidth: 'auto',
      },
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
    actionsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.sm,
      justifyContent: 'flex-end',
      // Responsive actions
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        gap: stylesGlobal.spacing.scale[1],
        alignItems: 'stretch',
      },
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
      maxWidth: '700px',
      width: '90%',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      margin: '20px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
      transform: 'scale(1)',
      transition: 'all 0.3s ease-in-out',
      // Responsive modal
      '@media (max-width: 480px)': {
        margin: '8px',
        width: 'calc(100% - 16px)',
        maxHeight: 'calc(100vh - 16px)',
      },
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
      // Responsive delete modal
      '@media (max-width: 480px)': {
        margin: '8px',
        width: 'calc(100% - 16px)',
        maxHeight: 'calc(100vh - 16px)',
      },
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
    modalBody: {
      padding: stylesGlobal.spacing.scale[6],
      position: 'relative',
      paddingTop: stylesGlobal.spacing.scale[8], // Extra space for close button
      // Responsive modal body
      '@media (max-width: 480px)': {
        padding: stylesGlobal.spacing.scale[4],
        paddingTop: stylesGlobal.spacing.scale[6],
      },
    },
    modalTitle: {
      ...stylesGlobal.typography.headings.h2,
      // Responsive title
      '@media (max-width: 480px)': {
        fontSize: '1.25rem',
      },
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: stylesGlobal.spacing.gaps.md,
      marginTop: stylesGlobal.spacing.scale[6],
      paddingTop: stylesGlobal.spacing.scale[4],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      // Responsive actions
      '@media (max-width: 480px)': {
        flexDirection: 'column',
        gap: stylesGlobal.spacing.scale[3],
      },
    },
    formContainer: {
      width: '100%',
      padding: stylesGlobal.spacing.scale[6],
      // Responsive form container
      '@media (max-width: 480px)': {
        padding: stylesGlobal.spacing.scale[4],
      },
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[6],
      width: '100%',
      // Responsive form group
      '@media (max-width: 480px)': {
        marginBottom: stylesGlobal.spacing.scale[4],
      },
    },
    formRow: {
      display: 'flex',
      gap: stylesGlobal.spacing.gaps.lg,
      flexWrap: 'wrap',
      marginBottom: stylesGlobal.spacing.scale[6],
      // Responsive form row
      '@media (max-width: 480px)': {
        flexDirection: 'column',
        gap: stylesGlobal.spacing.scale[4],
        marginBottom: stylesGlobal.spacing.scale[4],
      },
    },
    formRowThree: {
      display: 'flex',
      gap: stylesGlobal.spacing.gaps.lg,
      flexWrap: 'wrap',
      marginBottom: stylesGlobal.spacing.scale[6],
      // Responsive form row three
      '@media (max-width: 480px)': {
        flexDirection: 'column',
        gap: stylesGlobal.spacing.scale[4],
        marginBottom: stylesGlobal.spacing.scale[4],
      },
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
    input: {
      ...stylesGlobal.components.input.base,
      flex: 1,
      minWidth: '200px',
    },
    inputSmall: {
      ...stylesGlobal.components.input.base,
      flex: 1,
      minWidth: '150px',
    },
    textarea: {
      ...stylesGlobal.components.input.base,
      minHeight: '120px',
      resize: 'vertical',
      lineHeight: stylesGlobal.typography.leading.normal,
    },
    helpText: {
      ...stylesGlobal.typography.body.caption,
      marginTop: stylesGlobal.spacing.scale[2],
      fontStyle: 'italic',
    },
    outlineButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.base,
    },
    primaryButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
    },
    deleteButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.base,
      color: stylesGlobal.colors.semantic.error.main,
      borderColor: stylesGlobal.colors.semantic.error.main,
      '&:hover': {
        backgroundColor: stylesGlobal.colors.semantic.error.light,
        color: stylesGlobal.colors.semantic.error.dark,
      },
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    emptyStateText: stylesGlobal.typography.headings.h3,
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
  };

  // Estados del componente
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ 
    titulo: '', 
    descripcion: '', 
    fecha: '', 
    ubicacion: '', 
    horaInicio: '', 
    horaFin: '' 
  });
  const [editId, setEditId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [eventoToDelete, setEventoToDelete] = useState(null);

  // Fetch eventos
  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getEventos();
      setEventos(data);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al cargar eventos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch eventos on component mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchEventos();
    }
  }, [isAuthenticated, user, fetchEventos]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setFormData({ 
      titulo: '', 
      descripcion: '', 
      fecha: '', 
      ubicacion: '', 
      horaInicio: '', 
      horaFin: '' 
    });
    setEditId(null);
    setModalType('add');
  };

  const handleEditClick = (evento) => {
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha ? evento.fecha.substring(0, 10) : '',
      ubicacion: evento.ubicacion,
      horaInicio: evento.horaInicio || '',
      horaFin: evento.horaFin || '',
    });
    setEditId(evento._id);
    setModalType('edit');
  };

  const handleDeleteClick = (evento) => {
    setEventoToDelete(evento);
    setModalType('delete');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setFormLoading(true);
    try {
      if (editId) {
        const updated = await adminService.updateEvento(editId, formData);
        setEventos(eventos.map((e) => (e._id === editId ? updated : e)));
      } else {
        const created = await adminService.createEvento(formData);
        setEventos([created, ...eventos]);
      }
      setModalType(null);
      await fetchEventos(); // Refrescar lista
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error saving evento:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventoToDelete) return;

    setFormLoading(true);
    try {
      await adminService.deleteEvento(eventoToDelete._id);
      setEventos(eventos.filter((e) => e._id !== eventoToDelete._id));
      setModalType(null);
      setEventoToDelete(null);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error deleting evento:', err);
    } finally {
      setFormLoading(false);
    }
  };

  // Check authentication and admin role
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
      <div style={styles.mainContainer} className="eventos-main-container">
        <div style={styles.header} className="eventos-header">
          <div>
            <h1 style={styles.title}>
              <FaCalendarAlt style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
              Gestión de Eventos
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todos los eventos del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            className="eventos-add-btn"
            onClick={handleAddClick}
            aria-label="Nuevo evento"
          >
            <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
            Nuevo Evento
          </button>
        </div>
        {/* Modal para agregar/editar evento */}
        {(modalType === 'add' || modalType === 'edit') && (
          <div
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={(e) => e.target.classList.contains('modal-overlay') && setModalType(null)}
          >
            <div style={styles.modalContent} className="modal-content eventos-modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalBody} className="eventos-modal-body">
                <button
                  style={styles.modalCloseButton}
                  className="modal-close-btn"
                  onClick={() => setModalType(null)}
                  aria-label="Cerrar modal"
                  disabled={formLoading}
                  title="Cerrar"
                >
                  ×
                </button>
                <h2 style={styles.modalTitle}>
                  {modalType === 'edit' ? 'Editar Evento' : 'Nuevo Evento'}
                </h2>
                
                <form onSubmit={handleFormSubmit}>
                  <div style={styles.formContainer}>
                    {/* Fila 1: Título y Ubicación */}
                    <div style={styles.formRow} className="eventos-form-row">
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Título del Evento
                          <span style={styles.requiredField}>*</span>
                        </label>
                        <input 
                          name="titulo" 
                          value={formData.titulo} 
                          onChange={handleInputChange} 
                          placeholder="Ingresa el título del evento" 
                          required 
                          style={styles.input}
                          disabled={formLoading}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Ubicación
                          <span style={styles.requiredField}>*</span>
                        </label>
                        <input 
                          name="ubicacion" 
                          value={formData.ubicacion} 
                          onChange={handleInputChange} 
                          placeholder="Lugar donde se realizará el evento" 
                          required 
                          style={styles.input}
                          disabled={formLoading}
                        />
                      </div>
                    </div>
                    
                    {/* Fila 2: Fecha y Horarios */}
                    <div style={styles.formRowThree} className="eventos-form-three">
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Fecha
                          <span style={styles.requiredField}>*</span>
                        </label>
                        <input 
                          name="fecha" 
                          type="date" 
                          value={formData.fecha} 
                          onChange={handleInputChange} 
                          required 
                          style={styles.inputSmall}
                          disabled={formLoading}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Hora de Inicio
                          <span style={styles.requiredField}>*</span>
                        </label>
                        <input 
                          name="horaInicio" 
                          type="time" 
                          value={formData.horaInicio} 
                          onChange={handleInputChange} 
                          required 
                          style={styles.inputSmall}
                          disabled={formLoading}
                        />
                      </div>
                      <div style={styles.formGroup}>
                        <label style={styles.label}>
                          Hora de Fin
                          <span style={styles.requiredField}>*</span>
                        </label>
                        <input 
                          name="horaFin" 
                          type="time" 
                          value={formData.horaFin} 
                          onChange={handleInputChange} 
                          required 
                          style={styles.inputSmall}
                          disabled={formLoading}
                        />
                      </div>
                    </div>
                    
                    {/* Fila 3: Descripción */}
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Descripción
                        <span style={styles.requiredField}>*</span>
                      </label>
                      <textarea 
                        name="descripcion" 
                        value={formData.descripcion} 
                        onChange={handleInputChange} 
                        placeholder="Describe el evento, actividades, público objetivo, etc." 
                        required 
                        rows={4} 
                        style={styles.textarea}
                        disabled={formLoading}
                      />
                      <small style={styles.helpText}>
                        Proporciona información detallada sobre el evento para ayudar a los asistentes.
                      </small>
                    </div>
                    
                    <div style={styles.modalActions} className="eventos-modal-actions">
                      <button 
                        type="button" 
                        style={{
                          ...styles.outlineButton,
                          ...(formLoading ? styles.disabledButton : {}),
                        }}
                        onClick={() => setModalType(null)} 
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
                        aria-label={editId ? "Actualizar evento" : "Crear evento"}
                      >
                        {formLoading ? (
                          <>
                            <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[1] }} />
                            {editId ? 'Actualizando...' : 'Creando...'}
                          </>
                        ) : (
                          <>
                            <FaPlus size={12} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                            {editId ? 'Actualizar Evento' : 'Crear Evento'}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Modal para confirmar eliminación */}
        {modalType === 'delete' && eventoToDelete && (
          <div
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={(e) => e.target.classList.contains('modal-overlay') && setModalType(null)}
          >
            <div style={styles.deleteModalContent} className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  className="modal-close-btn"
                  onClick={() => setModalType(null)}
                  aria-label="Cerrar modal"
                  disabled={formLoading}
                  title="Cerrar"
                >
                  ×
                </button>
                <div style={{ textAlign: 'center' }}>
                  <FaTrash size={48} style={{ color: stylesGlobal.colors.semantic.error.main, marginBottom: stylesGlobal.spacing.scale[4] }} />
                  <h2 style={styles.modalTitle}>¿Eliminar Evento?</h2>
                  <p style={{ 
                    marginBottom: stylesGlobal.spacing.scale[6], 
                    ...stylesGlobal.typography.body.base,
                    color: stylesGlobal.colors.text.secondary,
                  }}>
                    ¿Estás seguro de que deseas eliminar el evento <strong>{eventoToDelete?.titulo}</strong>?
                  </p>
                  <p style={{ 
                    marginBottom: stylesGlobal.spacing.scale[6], 
                    ...stylesGlobal.typography.body.caption,
                    color: stylesGlobal.colors.text.muted,
                    fontStyle: 'italic',
                  }}>
                    Esta acción no se puede deshacer.
                  </p>
                  
                  <div style={styles.modalActions}>
                    <button 
                      style={{
                        ...styles.outlineButton,
                        ...(formLoading ? styles.disabledButton : {}),
                      }}
                      onClick={() => setModalType(null)}
                      disabled={formLoading}
                    >
                      Cancelar
                    </button>
                    <button 
                      style={{
                        ...styles.primaryButton,
                        backgroundColor: stylesGlobal.colors.semantic.error.main,
                        borderColor: stylesGlobal.colors.semantic.error.main,
                        ...(formLoading ? styles.disabledButton : {}),
                      }}
                      onClick={confirmDelete}
                      disabled={formLoading}
                      aria-label={`Eliminar evento ${eventoToDelete?.titulo}`}
                    >
                      {formLoading ? (
                        <>
                          <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[1] }} />
                          Eliminando...
                        </>
                      ) : (
                        <>
                          <FaTrash size={12} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                          Eliminar Evento
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.textCenter}>
              <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
              <h3 style={stylesGlobal.typography.headings.h3}>Cargando eventos...</h3>
            </div>
          </div>
        ) : eventos.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>No hay eventos registrados</h3>
            <p style={stylesGlobal.typography.body.base}>
              ¡Crea un nuevo evento para comenzar!
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer} className="eventos-table-container">
            <table style={styles.table} className="eventos-table">
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Título</th>
                  <th style={styles.tableHeader}>Descripción</th>
                  <th style={styles.tableHeader}>Fecha</th>
                  <th style={styles.tableHeader}>Horario</th>
                  <th style={styles.tableHeader}>Ubicación</th>
                  <th style={styles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map((evento) => (
                  <tr key={evento._id}>
                    <td style={styles.tableCellFirst}>{evento.titulo}</td>
                    <td style={styles.tableCell}>
                      {evento.descripcion.length > 50 
                        ? `${evento.descripcion.substring(0, 50)}...` 
                        : evento.descripcion
                      }
                    </td>
                    <td style={styles.tableCell}>
                      {evento.fecha ? new Date(evento.fecha).toLocaleDateString('es-ES') : "No especificada"}
                    </td>
                    <td style={styles.tableCell}>
                      {evento.horaInicio && evento.horaFin 
                        ? `${evento.horaInicio} - ${evento.horaFin}` 
                        : evento.horaInicio || evento.horaFin || "No especificado"
                      }
                    </td>
                    <td style={styles.tableCell}>{evento.ubicacion}</td>
                    <td style={styles.tableCellLast}>
                      <div style={styles.actionsContainer} className="eventos-actions">
                        <button 
                          style={{
                            ...styles.actionButton,
                            ...styles.editAction,
                          }} 
                          className="eventos-action-btn"
                          title="Editar evento"
                          onClick={() => handleEditClick(evento)}
                          aria-label={`Editar evento ${evento.titulo}`}
                        >
                          <FaEdit size={12} />
                          Editar
                        </button>
                        <button 
                          style={{
                            ...styles.actionButton,
                            ...styles.deleteAction,
                          }} 
                          className="eventos-action-btn"
                          title="Eliminar evento"
                          onClick={() => handleDeleteClick(evento)}
                          aria-label={`Eliminar evento ${evento.titulo}`}
                        >
                          <FaTrash size={12} />
                          Eliminar
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

      {/* Sistema de notificaciones centralizado */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default GestionEventos;