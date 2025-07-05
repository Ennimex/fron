import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaLock, FaSpinner, FaSave } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import localidadService from '../../services/localidadService';
import { useAdminNotifications } from '../../services/adminHooks';
import NotificationContainer from '../../components/admin/NotificationContainer';
import { Navigate } from 'react-router-dom';
import stylesGlobal from '../../styles/stylesGlobal';

const GestorLocalidades = () => {
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
    tableCellBold: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
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
      maxWidth: '600px',
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
    helpText: {
      ...stylesGlobal.typography.body.caption,
      marginTop: stylesGlobal.spacing.scale[2],
      fontStyle: 'italic',
      color: stylesGlobal.colors.text.muted,
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
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLocalidad, setCurrentLocalidad] = useState({ nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  // Usar el hook de notificaciones
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();
  
  // Crear una referencia estable para addNotification
  const addNotificationRef = useRef(addNotification);
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  // Fetch all localities
  const fetchLocalidades = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const localidades = await localidadService.getAll();
      setLocalidades(localidades);
    } catch (err) {
      const errorMsg = err.message || "Error al cargar localidades";
      setError(errorMsg);
      addNotificationRef.current(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias para evitar bucle infinito

  // Load localities on mount
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchLocalidades();
    }
  }, [isAuthenticated, user, fetchLocalidades]);

  // Manejo de tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleEscape);
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  // Open modal for creating new locality
  const handleOpenCreateModal = () => {
    setCurrentLocalidad({ nombre: '', descripcion: '' });
    setIsEditing(false);
    setFormError('');
    setModalOpen(true);
    
    // Enfocar el primer campo del formulario después de que se abra el modal
    setTimeout(() => {
      const firstInput = document.querySelector('input[name="nombre"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  };

  // Open modal for editing locality
  const handleOpenEditModal = (localidad) => {
    setCurrentLocalidad({
      _id: localidad._id,
      nombre: localidad.nombre,
      descripcion: localidad.descripcion || '',
    });
    setIsEditing(true);
    setFormError('');
    setModalOpen(true);
    
    // Enfocar el primer campo del formulario después de que se abra el modal
    setTimeout(() => {
      const firstInput = document.querySelector('input[name="nombre"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLocalidad(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!currentLocalidad.nombre.trim()) {
      setFormError('El nombre de la localidad es obligatorio');
      return false;
    }
    if (currentLocalidad.nombre.length > 100) {
      setFormError('El nombre no puede exceder los 100 caracteres');
      return false;
    }
    if (currentLocalidad.descripcion && currentLocalidad.descripcion.length > 500) {
      setFormError('La descripción no puede exceder los 500 caracteres');
      return false;
    }
    setFormError('');
    return true;
  };

  // Save locality (create or update)
  const handleSaveLocalidad = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormLoading(true);
    setFormError('');
    try {
      const localidadData = {
        nombre: currentLocalidad.nombre.trim(),
        descripcion: currentLocalidad.descripcion.trim() || '',
      };

      if (isEditing) {
        await localidadService.update(currentLocalidad._id, localidadData);
        addNotification(`Localidad "${localidadData.nombre}" actualizada exitosamente`, 'success');
      } else {
        await localidadService.create(localidadData);
        addNotification(`Nueva localidad "${localidadData.nombre}" creada exitosamente`, 'success');
      }

      // Refresh localities list
      await fetchLocalidades();
      setModalOpen(false);
    } catch (err) {
      const errorMsg = err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la localidad`;
      setFormError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete locality
  const handleDeleteLocalidad = async (id) => {
    // Encontrar la localidad que se va a eliminar para mostrar información en la notificación
    const localidadAEliminar = localidades.find(l => l._id === id);
    const confirmMessage = localidadAEliminar 
      ? `¿Está seguro de eliminar la localidad "${localidadAEliminar.nombre}"?`
      : "¿Está seguro de eliminar esta localidad?";
    
    if (!window.confirm(confirmMessage)) return;

    try {
      setLoading(true);
      setError(null);
      await localidadService.delete(id);
      
      // Agregar notificación de éxito
      if (localidadAEliminar) {
        addNotification(`Localidad "${localidadAEliminar.nombre}" eliminada exitosamente`, 'success');
      }
      
      // Refresh list after deletion
      await fetchLocalidades();
    } catch (err) {
      const errorMsg = err.message || 'Error al eliminar la localidad';
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading(false);
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
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              Gestión de Localidades
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las localidades del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            onClick={handleOpenCreateModal}
            aria-label="Agregar nueva localidad"
            disabled={loading}
            type="button"
          >
            <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
            Agregar Localidad
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.textCenter}>
              <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
              <h3 style={stylesGlobal.typography.headings.h3}>Cargando localidades...</h3>
              <p style={stylesGlobal.typography.body.small}>
                Por favor espere mientras se cargan los datos...
              </p>
            </div>
          </div>
        ) : localidades.length === 0 ? (
          /* Empty state */
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>No hay localidades registradas</h3>
            <p style={stylesGlobal.typography.body.base}>
              ¡Agrega una nueva localidad para comenzar!
            </p>
            <button
              style={{
                ...styles.addButton,
                marginTop: stylesGlobal.spacing.scale[4],
              }}
              onClick={handleOpenCreateModal}
              type="button"
            >
              <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
              Crear Primera Localidad
            </button>
          </div>
        ) : (
          /* Table */
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Nombre</th>
                  <th style={styles.tableHeader}>Descripción</th>
                  <th style={styles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {localidades.map((localidad) => (
                  <tr key={localidad._id}>
                    <td style={styles.tableCellFirst}>
                      <strong>{localidad.nombre}</strong>
                    </td>
                    <td style={styles.tableCell}>
                      {localidad.descripcion?.length > 50
                        ? `${localidad.descripcion.substring(0, 50)}...`
                        : localidad.descripcion || '—'}
                    </td>
                    <td style={styles.tableCellLast}>
                      <div style={styles.actionsContainer}>
                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.editAction,
                          }}
                          onClick={() => handleOpenEditModal(localidad)}
                          title="Editar localidad"
                          aria-label={`Editar localidad ${localidad.nombre}`}
                          disabled={loading}
                        >
                          <FaEdit size={12} />
                          Editar
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.deleteAction,
                          }}
                          onClick={() => handleDeleteLocalidad(localidad._id)}
                          title="Eliminar localidad"
                          aria-label={`Eliminar localidad ${localidad.nombre}`}
                          disabled={loading}
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

        {/* Modal for create/edit locality */}
        {modalOpen && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1400,
            }}
            className="modal-overlay"
            onClick={(e) => {
              // Cerrar modal al hacer click en el overlay, pero no en el contenido
              if (e.target === e.currentTarget) {
                setModalOpen(false);
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div style={{
              backgroundColor: 'white',
              borderRadius: '8px',
              padding: '20px',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
              <div style={styles.modalBody}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: stylesGlobal.spacing.scale[6],
                }}>
                  <h2 id="modal-title" style={styles.modalTitle}>
                    {isEditing ? 'Editar Localidad' : 'Agregar Nueva Localidad'}
                  </h2>
                  <button
                    onClick={() => setModalOpen(false)}
                    style={{
                      ...stylesGlobal.components.button.variants.ghost,
                      ...stylesGlobal.components.button.sizes.xs,
                    }}
                    aria-label="Cerrar modal"
                    disabled={formLoading}
                    type="button"
                  >
                    ✗
                  </button>
                </div>
                
                {formError && (
                  <div style={styles.error}>
                    {formError}
                  </div>
                )}
                
                <form style={styles.formContainer} onSubmit={handleSaveLocalidad}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="nombre">
                      Nombre de la Localidad
                      <span style={styles.requiredField}>*</span>
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={currentLocalidad.nombre}
                      onChange={handleInputChange}
                      style={styles.input}
                      placeholder="Ingresa el nombre de la localidad"
                      required
                      maxLength={100}
                      disabled={formLoading}
                    />
                    <small style={styles.helpText}>
                      Máximo 100 caracteres
                    </small>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="descripcion">
                      Descripción
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={currentLocalidad.descripcion || ''}
                      onChange={handleInputChange}
                      style={styles.textarea}
                      placeholder="Describe la localidad, ubicación, características, etc. (opcional)"
                      rows={4}
                      maxLength={500}
                      disabled={formLoading}
                    />
                    <small style={styles.helpText}>
                      Máximo 500 caracteres. Proporciona información adicional sobre la localidad que ayude a identificarla.
                    </small>
                  </div>
                  
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
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
                      aria-label={isEditing ? 'Actualizar localidad' : 'Crear localidad'}
                    >
                      {formLoading ? (
                        <>
                          <FaSpinner style={{ 
                            animation: 'spin 1s linear infinite', 
                            marginRight: stylesGlobal.spacing.scale[1] 
                          }} />
                          {isEditing ? 'Actualizando...' : 'Guardando...'}
                        </>
                      ) : (
                        <>
                          <FaSave style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                          {isEditing ? 'Actualizar Localidad' : 'Guardar Localidad'}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Contenedor de notificaciones */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default GestorLocalidades;