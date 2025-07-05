import React, { useEffect, useState, useCallback } from "react";
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaLock } from "react-icons/fa";
import eventoService from "../../services/eventoService";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import stylesGlobal from "../../styles/stylesGlobal";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

// Reusable Modal component
const Modal = ({ open, onClose, children, styles }) => {
  if (!open) return null;
  return (
    <div 
      style={styles?.modalOverlay || stylesGlobal.utils.overlay.base} 
      className="modal-overlay"
      onClick={(e) => e.target.className === 'modal-overlay' && onClose()}
    >
      <div style={styles?.modalContent || stylesGlobal.components.card.base}>
        <button 
          onClick={onClose} 
          style={styles?.modalCloseButton || stylesGlobal.components.button.variants.secondary}
          aria-label="Cerrar modal"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const GestionEventos = () => {
  const { user, isAuthenticated } = useAuth();

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
    },
    table: {
      width: '100%',
      borderSpacing: `0 ${stylesGlobal.spacing.scale[2]}`,
      borderCollapse: 'separate',
    },
    tableHeader: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.secondary,
      padding: stylesGlobal.spacing.scale[3],
      textAlign: 'left',
      backgroundColor: stylesGlobal.colors.surface.tertiary,
    },
    tableCell: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    tableCellFirst: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderLeft: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderTopLeftRadius: stylesGlobal.borders.radius.sm,
      borderBottomLeftRadius: stylesGlobal.borders.radius.sm,
    },
    tableCellLast: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRight: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderTopRightRadius: stylesGlobal.borders.radius.sm,
      borderBottomRightRadius: stylesGlobal.borders.radius.sm,
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
    actionsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.sm,
      justifyContent: 'flex-end',
    },
    modalOverlay: stylesGlobal.utils.overlay.elegant,
    modalContent: {
      ...stylesGlobal.components.card.luxury,
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto',
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
    formContainer: {
      width: '100%',
      padding: stylesGlobal.spacing.scale[6],
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[6],
      width: '100%',
    },
    formRow: {
      display: 'flex',
      gap: stylesGlobal.spacing.gaps.lg,
      flexWrap: 'wrap',
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    formRowThree: {
      display: 'flex',
      gap: stylesGlobal.spacing.gaps.lg,
      flexWrap: 'wrap',
      marginBottom: stylesGlobal.spacing.scale[6],
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
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ 
    titulo: '', 
    descripcion: '', 
    fecha: '', 
    ubicacion: '', 
    horaInicio: '', 
    horaFin: '' 
  });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [eventoToDelete, setEventoToDelete] = useState(null);

  // Usar el hook de notificaciones
  const { notifications, removeNotification, clearAllNotifications } = useAdminNotifications();

  // Fetch eventos
  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const eventos = await eventoService.getAll();
      setEventos(eventos);
    } catch (err) {
      setError(err.message || "Error al cargar eventos");
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication and admin permissions
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setError('No tienes permisos para acceder a esta página');
      setLoading(false);
      return;
    }
  }, [isAuthenticated, user]);

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
    setFormError('');
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
    setFormError('');
  };

  const handleDeleteClick = (evento) => {
    setEventoToDelete(evento);
    setModalType('delete');
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setFormLoading(true);
    setFormError('');
    try {
      if (editId) {
        const updated = await eventoService.update(editId, formData);
        setEventos(eventos.map((e) => (e._id === editId ? updated : e)));
      } else {
        const created = await eventoService.create(formData);
        setEventos([created, ...eventos]);
      }
      setModalType(null);
    } catch (err) {
      setFormError(err.message || 'Error al guardar el evento');
      console.error('Error saving evento:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventoToDelete) return;

    try {
      await eventoService.delete(eventoToDelete._id);
      setEventos(eventos.filter((e) => e._id !== eventoToDelete._id));
      setModalType(null);
      setEventoToDelete(null);
    } catch (err) {
      setFormError(err.message || 'Error al eliminar el evento');
      console.error('Error deleting evento:', err);
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
      <div style={styles.mainContainer}>
        <div style={styles.header}>
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
            onClick={handleAddClick}
            aria-label="Nuevo evento"
          >
            <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
            Nuevo Evento
          </button>
        </div>
        {/* Modal for add/edit */}
        <Modal open={modalType === 'add' || modalType === 'edit'} onClose={() => setModalType(null)} styles={styles}>
          <div style={styles.formContainer}>
            <h2 style={styles.modalTitle}>
              {modalType === 'edit' ? 'Editar Evento' : 'Nuevo Evento'}
            </h2>
            
            <form onSubmit={handleFormSubmit}>
              {/* Fila 1: Título y Ubicación */}
              <div style={styles.formRow}>
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
                  />
                </div>
              </div>
              
              {/* Fila 2: Fecha y Horarios */}
              <div style={styles.formRowThree}>
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
                />
                <small style={styles.helpText}>
                  Proporciona información detallada sobre el evento para ayudar a los asistentes.
                </small>
              </div>
              
              {formError && (
                <div style={styles.error}>
                  {formError}
                </div>
              )}
              
              <div style={styles.modalActions}>
                <button 
                  type="button" 
                  style={styles.outlineButton}
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
                  {formLoading 
                    ? (editId ? 'Actualizando...' : 'Creando...') 
                    : (editId ? 'Actualizar Evento' : 'Crear Evento')
                  }
                </button>
              </div>
            </form>
          </div>
        </Modal>
        {/* Modal for delete */}
        <Modal open={modalType === 'delete'} onClose={() => setModalType(null)} styles={styles}>
          <div style={styles.formContainer}>
            <h2 style={styles.modalTitle}>Eliminar Evento</h2>
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
            
            {formError && (
              <div style={styles.error}>
                {formError}
              </div>
            )}
            
            <div style={styles.modalActions}>
              <button 
                style={styles.outlineButton}
                onClick={() => setModalType(null)}
              >
                Cancelar
              </button>
              <button 
                style={styles.deleteButton}
                onClick={confirmDelete}
                aria-label={`Eliminar evento ${eventoToDelete?.titulo}`}
              >
                Eliminar Evento
              </button>
            </div>
          </div>
        </Modal>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.textCenter}>
              <h3 style={stylesGlobal.typography.headings.h3}>Cargando eventos...</h3>
            </div>
          </div>
        ) : error ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>{error}</h3>
          </div>
        ) : eventos.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>No hay eventos registrados</h3>
            <p style={stylesGlobal.typography.body.base}>
              ¡Crea un nuevo evento para comenzar!
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
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
                      <div style={styles.actionsContainer}>
                        <button 
                          style={{
                            ...styles.actionButton,
                            ...styles.editAction,
                          }} 
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

      {/* Modal for add/edit */}
      <Modal open={modalType === 'add' || modalType === 'edit'} onClose={() => setModalType(null)} styles={styles}>
        <div style={styles.modalContent}>
          <h2 style={styles.modalTitle}>
            {modalType === 'edit' ? 'Editar Evento' : 'Agregar Nuevo Evento'}
          </h2>
          
          {formError && (
            <div style={styles.error}>
              {formError}
            </div>
          )}
          
          <form onSubmit={handleFormSubmit}>
            <div style={styles.formContainer}>
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="titulo">
                  Título <span style={styles.requiredField}>*</span>
                </label>
                <input
                  id="titulo"
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleInputChange}
                  style={styles.input}
                  placeholder="Ingrese el título del evento"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="descripcion">
                  Descripción <span style={styles.requiredField}>*</span>
                </label>
                <textarea
                  id="descripcion"
                  name="descripcion"
                  value={formData.descripcion}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Descripción del evento"
                  rows={4}
                  required
                />
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label} htmlFor="fecha">
                    Fecha <span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleInputChange}
                    style={styles.input}
                    required
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label} htmlFor="ubicacion">
                    Ubicación <span style={styles.requiredField}>*</span>
                  </label>
                  <input
                    id="ubicacion"
                    type="text"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="Ubicación del evento"
                    required
                  />
                </div>
              </div>

              <div style={styles.formRow}>
                <div style={{ flex: 1 }}>
                  <label style={styles.label} htmlFor="horaInicio">
                    Hora de Inicio
                  </label>
                  <input
                    id="horaInicio"
                    type="time"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleInputChange}
                    style={styles.inputSmall}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={styles.label} htmlFor="horaFin">
                    Hora de Fin
                  </label>
                  <input
                    id="horaFin"
                    type="time"
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleInputChange}
                    style={styles.inputSmall}
                  />
                </div>
              </div>

              <div style={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setModalType(null)}
                  style={styles.outlineButton}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    ...styles.primaryButton,
                    ...(formLoading ? styles.disabledButton : {})
                  }}
                  disabled={formLoading}
                >
                  {formLoading ? 'Guardando...' : (modalType === 'edit' ? 'Actualizar' : 'Crear')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal open={modalType === 'delete'} onClose={() => setModalType(null)} styles={styles}>
        <div style={styles.modalContent}>
          <h2 style={styles.modalTitle}>Confirmar Eliminación</h2>
          
          {formError && (
            <div style={styles.error}>
              {formError}
            </div>
          )}
          
          <p>
            ¿Estás seguro de que quieres eliminar el evento "<strong>{eventoToDelete?.titulo}</strong>"?
            Esta acción no se puede deshacer.
          </p>
          
          <div style={styles.modalActions}>
            <button
              type="button"
              onClick={() => setModalType(null)}
              style={styles.outlineButton}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={confirmDelete}
              style={styles.deleteButton}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>

      {/* Contenedor de notificaciones */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default GestionEventos;