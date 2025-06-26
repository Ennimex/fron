import React, { useState, useEffect, useCallback } from 'react';
import { FaPlus, FaEdit, FaTrash, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import adminStyles from '../../styles/stylesAdmin';

const GestorLocalidades = () => {
  const { user, isAuthenticated } = useAuth();

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
    tableCellBold: {
      ...adminStyles.tables.td,
      fontWeight: '500',
      borderTop: `1px solid ${adminStyles.colors.border}`,
      borderBottom: `1px solid ${adminStyles.colors.border}`,
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
      width: '100%',
    },
    formGroup: {
      marginBottom: adminStyles.spacing.xl,
      width: '100%',
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
      '&:focus': {
        borderColor: adminStyles.colors.primary,
        boxShadow: `0 0 0 3px ${adminStyles.colors.primary}20`,
        outline: 'none',
      },
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
      '&:focus': {
        borderColor: adminStyles.colors.primary,
        boxShadow: `0 0 0 3px ${adminStyles.colors.primary}20`,
        outline: 'none',
      },
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
    
    // Estilos de estados
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    loadingContainer: adminStyles.loadingStyles.container,
    
    // Utilidades
    textCenter: adminStyles.utilities.textCenter,
    flexCenter: adminStyles.utilities.flexCenter,
  };
  // Estados del componente
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLocalidad, setCurrentLocalidad] = useState({ nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  // Fetch all localities
  const fetchLocalidades = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/localidades', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar localidades');
      }
      
      const data = await response.json();
      setLocalidades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  // Load localities on mount
  useEffect(() => {
    fetchLocalidades();
  }, [fetchLocalidades]);

  // Open modal for creating new locality
  const handleOpenCreateModal = () => {
    setCurrentLocalidad({ nombre: '', descripcion: '' });
    setIsEditing(false);
    setFormError('');
    setModalOpen(true);
  };

  // Open modal for editing locality
  const handleOpenEditModal = (localidad) => {
    setCurrentLocalidad(localidad);
    setIsEditing(true);
    setFormError('');
    setModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLocalidad(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Save locality (create or update)
  const handleSaveLocalidad = async (e) => {
    e.preventDefault();
    
    if (!currentLocalidad.nombre.trim()) {
      setFormError('El nombre de la localidad es obligatorio');
      return;
    }

    try {
      const url = isEditing 
        ? `http://localhost:5000/api/localidades/${currentLocalidad._id}`
        : 'http://localhost:5000/api/localidades';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          nombre: currentLocalidad.nombre,
          descripcion: currentLocalidad.descripcion
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la localidad');
      }

      // Refresh localities list
      fetchLocalidades();
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Delete locality
  const handleDeleteLocalidad = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta localidad?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/localidades/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user?.token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al eliminar la localidad');
        }

        // Refresh list after deletion
        fetchLocalidades();
      } catch (err) {
        setError(err.message);
      }
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

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.textCenter}>
          <h3>Cargando localidades...</h3>
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
            <h1 style={styles.title}>Gestión de Localidades</h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las localidades del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            onClick={handleOpenCreateModal}
            aria-label="Agregar nueva localidad"
          >
            <FaPlus size={14} style={{ marginRight: adminStyles.spacing.xs }} />
            Agregar Localidad
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}        {/* Empty state */}
        {!error && localidades.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>No hay localidades registradas</h3>
            <p style={adminStyles.containers.emptyStateSubtext}>
              ¡Agrega una nueva localidad para comenzar!
            </p>
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
                      {localidad.descripcion || '—'}
                    </td>
                    <td style={styles.tableCellLast}>
                      <div style={styles.actionsContainer}>
                        <button
                          style={adminStyles.combineStyles(
                            styles.actionButton,
                            styles.editAction
                          )}
                          onClick={() => handleOpenEditModal(localidad)}
                          title="Editar localidad"
                          aria-label={`Editar localidad ${localidad.nombre}`}
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
                          onClick={() => handleDeleteLocalidad(localidad._id)}
                          title="Eliminar localidad"
                          aria-label={`Eliminar localidad ${localidad.nombre}`}
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
        )}        {/* Modal for create/edit locality */}
        {modalOpen && (
          <div 
            style={styles.modalOverlay}
            className="modal"
            onClick={(e) => e.target.className === 'modal' && setModalOpen(false)}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  onClick={() => setModalOpen(false)}
                  aria-label="Cerrar modal"
                >
                  ✗
                </button>
                <h2 style={styles.modalTitle}>
                  {isEditing ? 'Editar Localidad' : 'Agregar Nueva Localidad'}
                </h2>
                
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
                    />
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
                    />
                    <small style={styles.helpText}>
                      Proporciona información adicional sobre la localidad que ayude a identificarla.
                    </small>
                  </div>
                  
                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      style={styles.outlineButton}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={styles.primaryButton}
                      aria-label={isEditing ? 'Actualizar localidad' : 'Crear localidad'}
                    >
                      {isEditing ? 'Actualizar Localidad' : 'Guardar Localidad'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GestorLocalidades;