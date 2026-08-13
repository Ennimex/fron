import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaPlus, FaEdit, FaTrash, FaLock, FaSpinner, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import localidadService from '../../services/localidadService';
import { useAdminNotifications } from '../../services/adminHooks';
import NotificationContainer from '../../components/admin/NotificationContainer';
import { Navigate } from 'react-router-dom';
import stylesGlobal from '../../styles/stylesGlobal';
import adminTheme from '../../styles/adminTheme';

// Kit de UI compartido del panel: garantiza que esta vista se vea igual
// que las demás (encabezado, filas-tarjeta, modal, confirmación, campos).
import AdminHeader from '../../components/admin/ui/AdminHeader';
import AdminModal from '../../components/admin/ui/AdminModal';
import ConfirmDialog from '../../components/admin/ui/ConfirmDialog';
import Campo from '../../components/admin/ui/Campo';
import { BotonPrimario, BotonSecundario, BotonIcono } from '../../components/admin/ui/Botones';
import { Thead, Fila, Miniatura, TextoCelda } from '../../components/admin/ui/ListaFilas';

const COLUMNAS = '2.4fr 3fr auto';

const GestorLocalidades = () => {
  const { user, isAuthenticated } = useAuth();

  // Mapeo de estilos globales
  const styles = {
    pageContainer: {
      padding: stylesGlobal.spacing.sections.md,
      backgroundColor: adminTheme.bg,
      minHeight: '100vh',
    },
    mainContainer: {
      maxWidth: stylesGlobal.utils.container.maxWidth.lg,
      margin: stylesGlobal.spacing.margins.auto,
      padding: stylesGlobal.spacing.scale[4],
    },
    error: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.semantic.error.main,
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      padding: stylesGlobal.spacing.scale[3],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    input: { ...stylesGlobal.components.input.base, width: '100%' },
    textarea: {
      ...stylesGlobal.components.input.base,
      width: '100%',
      minHeight: '120px',
      resize: 'vertical',
      lineHeight: stylesGlobal.typography.leading.normal,
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    loadingContainer: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
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
  // Confirmación de borrado: { id, nombre }
  const [confirmacion, setConfirmacion] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      const errorMsg = err.error || err.message || "Error al cargar localidades";
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
      const errorMsg = err.error || err.message || `Error al ${isEditing ? 'actualizar' : 'crear'} la localidad`;
      setFormError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  // Eliminar (la confirmación la pide el ConfirmDialog)
  const ejecutarEliminacion = async () => {
    if (!confirmacion) return;
    setConfirmLoading(true);
    try {
      setError(null);
      await localidadService.delete(confirmacion.id);
      addNotification(`Localidad "${confirmacion.nombre}" eliminada exitosamente`, 'success');
      setConfirmacion(null);
      // Refresh list after deletion
      await fetchLocalidades();
    } catch (err) {
      const errorMsg = err.error || err.message || 'Error al eliminar la localidad';
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

  // Check authentication and admin role
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== 'admin') {
    return (
      <div
        style={{
          ...styles.pageContainer,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '80vh',
          textAlign: 'center',
        }}
      >
        <FaLock size={50} style={{ color: stylesGlobal.colors.semantic.error.main }} />
        <h2 style={stylesGlobal.typography.headings.h2}>Acceso Denegado</h2>
        <p style={{ ...stylesGlobal.typography.body.base, color: stylesGlobal.colors.text.secondary }}>
          No tienes permisos para acceder a esta sección. Esta área está reservada para administradores.
        </p>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContainer}>
        <AdminHeader
          icon={FaMapMarkerAlt}
          titulo="Gestión de Localidades"
          subtitulo="Administra y supervisa todas las localidades del sistema"
          accion={
            <BotonPrimario
              icono={FaPlus}
              onClick={handleOpenCreateModal}
              aria-label="Nueva localidad"
              disabled={loading}
            >
              Nueva Localidad
            </BotonPrimario>
          }
        />

        {/* Error message */}
        {error && !modalOpen && <div style={styles.error}>{error}</div>}

        {/* Loading state */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
            <h3 style={stylesGlobal.typography.headings.h3}>Cargando localidades...</h3>
            <p style={stylesGlobal.typography.body.small}>
              Por favor espere mientras se cargan los datos...
            </p>
          </div>
        ) : localidades.length === 0 ? (
          /* Empty state */
          <div style={styles.emptyState}>
            <h3 style={stylesGlobal.typography.headings.h3}>No hay localidades registradas</h3>
            <p style={stylesGlobal.typography.body.base}>
              ¡Agrega una nueva localidad para comenzar!
            </p>
            <BotonPrimario
              icono={FaPlus}
              onClick={handleOpenCreateModal}
              style={{ marginTop: stylesGlobal.spacing.scale[4] }}
            >
              Crear Primera Localidad
            </BotonPrimario>
          </div>
        ) : (
          /* Lista de localidades (filas-tarjeta del kit) */
          <div>
            <Thead columnas={COLUMNAS}>
              <div>Localidad</div>
              <div>Descripción</div>
              <div style={{ textAlign: 'right' }}>Acciones</div>
            </Thead>

            {localidades.map((localidad) => (
              <Fila key={localidad._id} columnas={COLUMNAS}>
                <div style={{ display: 'flex', alignItems: 'center', gap: stylesGlobal.spacing.scale[4], minWidth: 0 }}>
                  <Miniatura>{(localidad.nombre || 'L')[0].toUpperCase()}</Miniatura>
                  <div
                    style={{
                      fontWeight: stylesGlobal.typography.weights.semibold,
                      color: stylesGlobal.colors.text.primary,
                      minWidth: 0,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {localidad.nombre}
                  </div>
                </div>
                <TextoCelda
                  style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                >
                  {localidad.descripcion || '—'}
                </TextoCelda>
                <div
                  className="admin-acciones"
                  style={{ display: 'flex', gap: stylesGlobal.spacing.scale[2], justifyContent: 'flex-end' }}
                >
                  <BotonIcono
                    variante="editar"
                    onClick={() => handleOpenEditModal(localidad)}
                    title="Editar localidad"
                    aria-label={`Editar localidad ${localidad.nombre}`}
                    disabled={loading}
                  >
                    <FaEdit size={15} />
                  </BotonIcono>
                  <BotonIcono
                    variante="eliminar"
                    onClick={() => setConfirmacion({ id: localidad._id, nombre: localidad.nombre })}
                    title="Eliminar localidad"
                    aria-label={`Eliminar localidad ${localidad.nombre}`}
                    disabled={loading}
                  >
                    <FaTrash size={15} />
                  </BotonIcono>
                </div>
              </Fila>
            ))}
          </div>
        )}

        {/* Modal de alta/edición */}
        <AdminModal
          abierto={modalOpen}
          onCerrar={() => setModalOpen(false)}
          titulo={isEditing ? 'Editar Localidad' : 'Nueva Localidad'}
          maxWidth="600px"
          bloqueado={formLoading}
          pie={
            <>
              <BotonSecundario onClick={() => setModalOpen(false)} disabled={formLoading}>
                Cancelar
              </BotonSecundario>
              <BotonPrimario
                type="submit"
                form="form-localidad"
                disabled={formLoading}
                aria-label={isEditing ? 'Actualizar localidad' : 'Crear localidad'}
              >
                {formLoading ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    {isEditing ? 'Actualizando...' : 'Guardando...'}
                  </>
                ) : isEditing ? (
                  'Actualizar'
                ) : (
                  'Guardar'
                )}
              </BotonPrimario>
            </>
          }
        >
          <form id="form-localidad" onSubmit={handleSaveLocalidad}>
            {formError && <div style={styles.error}>{formError}</div>}

            <Campo
              etiqueta="Nombre de la Localidad"
              htmlFor="nombre"
              requerido
              pista="Máximo 100 caracteres"
            >
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
            </Campo>

            <Campo
              etiqueta="Descripción"
              htmlFor="descripcion"
              opcional
              pista="Máximo 500 caracteres. Proporciona información adicional sobre la localidad que ayude a identificarla."
            >
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
            </Campo>
          </form>
        </AdminModal>

        {/* Confirmación de borrado */}
        <ConfirmDialog
          abierto={Boolean(confirmacion)}
          titulo="¿Eliminar localidad?"
          nombre={confirmacion ? confirmacion.nombre : ''}
          cargando={confirmLoading}
          onCancelar={() => setConfirmacion(null)}
          onConfirmar={ejecutarEliminacion}
        />
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
