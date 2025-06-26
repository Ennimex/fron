import React, { useEffect, useState, useCallback } from "react";
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaLock } from "react-icons/fa";
import api from "../../services/api";
import adminStyles from "../../styles/stylesAdmin";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

// Reusable Modal component
const Modal = ({ open, onClose, children, styles }) => {
  if (!open) return null;
  return (
    <div 
      style={styles?.modalOverlay || adminStyles.modalStyles.overlay} 
      className="modal-overlay"
      onClick={(e) => e.target.className === 'modal-overlay' && onClose()}
    >
      <div style={styles?.modalContent || adminStyles.modalStyles.content}>
        <button 
          onClick={onClose} 
          style={styles?.modalCloseButton || adminStyles.modalStyles.closeButton}
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
  const { user, isAuthenticated, checkTokenExpiration } = useAuth();

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
    success: adminStyles.messageStyles.success,
    
    // Estilos de tabla mejorados
    tableContainer: {
      ...adminStyles.containers.content,
      overflowX: 'auto',
    },
    table: {
      ...adminStyles.tables.table,
      borderSpacing: '0 8px', // Espaciado vertical entre filas
      borderCollapse: 'separate', // Necesario para que funcione borderSpacing
    },
    tableHeader: adminStyles.tables.th,
    tableCell: {
      ...adminStyles.tables.td,
      borderTop: `1px solid ${adminStyles.colors.border}`,
      borderBottom: `1px solid ${adminStyles.colors.border}`,
    },
    tableCellFirst: {
      ...adminStyles.tables.td,
      borderTop: `1px solid ${adminStyles.colors.border}`,
      borderBottom: `1px solid ${adminStyles.colors.border}`,
      borderLeft: `1px solid ${adminStyles.colors.border}`,
      borderTopLeftRadius: adminStyles.borders.radius,
      borderBottomLeftRadius: adminStyles.borders.radius,
    },
    tableCellLast: {
      ...adminStyles.tables.td,
      borderTop: `1px solid ${adminStyles.colors.border}`,
      borderBottom: `1px solid ${adminStyles.colors.border}`,
      borderRight: `1px solid ${adminStyles.colors.border}`,
      borderTopRightRadius: adminStyles.borders.radius,
      borderBottomRightRadius: adminStyles.borders.radius,
    },
    
    // Estilos de botones de acción
    actionButton: {
      ...adminStyles.buttons.actionButton,
      padding: `${adminStyles.spacing.sm} ${adminStyles.spacing.md}`,
      minWidth: '80px',
      fontSize: adminStyles.typography.textSm,
      fontWeight: adminStyles.typography.weightMedium,
      marginRight: adminStyles.spacing.sm,
    },
    editAction: adminStyles.buttons.editAction,
    deleteAction: adminStyles.buttons.deleteAction,
    actionsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: adminStyles.spacing.sm,
      justifyContent: 'flex-end',
    },
    
    // Estilos de modal
    modalOverlay: adminStyles.modalStyles.overlay,
    modalContent: {
      ...adminStyles.modalStyles.content,
      maxWidth: '700px',
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
    
    // Estilos de formulario mejorados
    formContainer: {
      width: '100%',
      padding: adminStyles.spacing.xl,
    },
    formGroup: {
      marginBottom: adminStyles.spacing.xl,
      width: '100%',
    },
    formRow: {
      display: 'flex',
      gap: adminStyles.spacing.lg,
      flexWrap: 'wrap',
      marginBottom: adminStyles.spacing.xl,
    },
    formRowThree: {
      display: 'flex',
      gap: adminStyles.spacing.lg,
      flexWrap: 'wrap',
      marginBottom: adminStyles.spacing.xl,
    },
    label: {
      ...adminStyles.forms.label,
      display: 'block',
      marginBottom: adminStyles.spacing.md,
      fontWeight: adminStyles.typography.weightMedium,
      color: adminStyles.colors.textPrimary,
      fontSize: adminStyles.typography.textSm,
      lineHeight: '1.5',
    },
    requiredField: {
      ...adminStyles.forms.requiredField,
      marginLeft: adminStyles.spacing.xs,
      color: adminStyles.colors.danger,
    },
    input: {
      ...adminStyles.forms.input,
      width: '100%',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.lg}`,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      flex: 1,
      minWidth: '200px',
    },
    inputSmall: {
      ...adminStyles.forms.input,
      width: '100%',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.lg}`,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      flex: 1,
      minWidth: '150px',
    },
    textarea: {
      ...adminStyles.forms.textarea,
      width: '100%',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.lg}`,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      minHeight: '120px',
      resize: 'vertical',
      fontFamily: 'inherit',
      lineHeight: '1.5',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    },
    helpText: {
      ...adminStyles.forms.helpText,
      display: 'block',
      marginTop: adminStyles.spacing.md,
      marginBottom: 0,
      fontSize: adminStyles.typography.textSm,
      color: adminStyles.colors.textMuted,
      lineHeight: '1.4',
      fontStyle: 'italic',
    },
    
    // Estilos de botones
    outlineButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.outline,
      marginRight: adminStyles.spacing.lg,
    },
    primaryButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
    },
    deleteButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.deleteAction,
    },
    disabledButton: adminStyles.buttons.disabled,
    
    // Estilos de estados
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    loadingContainer: adminStyles.loadingStyles.container,
    
    // Utilidades
    textCenter: adminStyles.utilities.textCenter,
    flexCenter: adminStyles.utilities.flexCenter,
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

  // Check authentication and admin permissions
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setError('No tienes permisos para acceder a esta página');
      setLoading(false);
      return;
    }
    
    if (!checkTokenExpiration()) {
      return; // checkTokenExpiration handles redirection
    }
  }, [isAuthenticated, user, checkTokenExpiration]);
  
  const fetchEventos = useCallback(async () => {
    if (!isAuthenticated || !checkTokenExpiration()) {
      return;
    }

    setLoading(true);
    try {
      const data = await api.get("/eventos");
      setEventos(data);
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        setError("Error al cargar los eventos");
      }
      console.error('Error fetching eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, checkTokenExpiration]);

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
    
    if (!isAuthenticated || !checkTokenExpiration()) {
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      if (editId) {
        const updated = await api.put(`/eventos/${editId}`, formData);
        setEventos(eventos.map((e) => (e._id === editId ? updated : e)));
      } else {
        const created = await api.post('/eventos', formData);
        setEventos([created, ...eventos]);
      }
      setModalType(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setFormError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setFormError(err?.error || err?.message || 'Error al guardar el evento');
      }
      console.error('Error saving evento:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventoToDelete) return;
    
    if (!isAuthenticated || !checkTokenExpiration()) {
      return;
    }

    try {
      await api.delete(`/eventos/${eventoToDelete._id}`);
      setEventos(eventos.filter((e) => e._id !== eventoToDelete._id));
      setModalType(null);
      setEventoToDelete(null);
    } catch (err) {
      if (err.response?.status === 401) {
        setFormError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setFormError('Error al eliminar el evento');
      }
      console.error('Error deleting evento:', err);
    }
  };

  // Check authentication and admin role
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== 'admin') {
    return (
      <div style={adminStyles.combineStyles(
        styles.pageContainer,
        styles.flexCenter,
        { height: '80vh', textAlign: 'center' }
      )}>
        <FaLock size={50} style={adminStyles.icons.error} />
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
              <FaCalendarAlt style={{ marginRight: adminStyles.spacing.md }} />
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
            <FaPlus size={14} style={{ marginRight: adminStyles.spacing.xs }} />
            Nuevo Evento
          </button>
        </div>        {/* Modal for add/edit */}
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
                  style={adminStyles.combineStyles(
                    styles.primaryButton,
                    formLoading ? styles.disabledButton : {}
                  )} 
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
        </Modal>        {/* Modal for delete */}
        <Modal open={modalType === 'delete'} onClose={() => setModalType(null)} styles={styles}>
          <div style={styles.formContainer}>
            <h2 style={styles.modalTitle}>Eliminar Evento</h2>
            <p style={{ 
              marginBottom: adminStyles.spacing.xl, 
              fontSize: adminStyles.typography.textBase,
              lineHeight: '1.5',
              color: adminStyles.colors.textSecondary 
            }}>
              ¿Estás seguro de que deseas eliminar el evento <strong>{eventoToDelete?.titulo}</strong>?
            </p>
            <p style={{ 
              marginBottom: adminStyles.spacing.xl, 
              fontSize: adminStyles.typography.textSm,
              color: adminStyles.colors.textMuted,
              fontStyle: 'italic' 
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
        </Modal>        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.textCenter}>
              <h3>Cargando eventos...</h3>
            </div>
          </div>
        ) : error ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>{error}</h3>
          </div>
        ) : eventos.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>No hay eventos registrados</h3>
            <p style={adminStyles.containers.emptyStateSubtext}>
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
                          style={adminStyles.combineStyles(
                            styles.actionButton,
                            styles.editAction
                          )} 
                          title="Editar evento"
                          onClick={() => handleEditClick(evento)}
                          aria-label={`Editar evento ${evento.titulo}`}
                        >
                          <FaEdit size={12} />
                          Editar
                        </button>
                        <button 
                          style={adminStyles.combineStyles(
                            styles.actionButton,
                            styles.deleteAction,
                            { marginRight: 0 } // Eliminar margen del último botón
                          )} 
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
    </div>
  );
};

export default GestionEventos;