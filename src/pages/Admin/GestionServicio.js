import React, { useState, useEffect, useCallback } from 'react';
import { Navigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaConciergeBell, FaSearch, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import adminService from '../../services/adminServices';
import { useAdminNotifications } from '../../services/adminHooks';
import NotificationContainer from '../../components/admin/NotificationContainer';
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

const COLUMNAS = '2.4fr 2fr auto';

const GestionServicio = () => {
  const { user, isAuthenticated } = useAuth();

  // Hook de notificaciones centralizado
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();

  // Nota: useAdminNotifications ya se suscribe a adminService.onNotification
  // por dentro; suscribirse otra vez aquí duplicaba cada notificación.

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
    searchContainer: { position: 'relative', maxWidth: '400px' },
    searchIcon: {
      position: 'absolute',
      left: stylesGlobal.spacing.scale[3],
      top: '50%',
      transform: 'translateY(-50%)',
      color: stylesGlobal.colors.text.muted,
    },
    input: { ...stylesGlobal.components.input.base, width: '100%' },
    textarea: {
      ...stylesGlobal.components.input.base,
      width: '100%',
      minHeight: '120px',
      resize: 'vertical',
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    loadingContainer: { padding: stylesGlobal.spacing.scale[8], textAlign: 'center' },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: `0 ${stylesGlobal.spacing.gaps.lg}`,
    },
    imageUploadArea: {
      border: `2px dashed ${stylesGlobal.borders.colors.default}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      transition: stylesGlobal.animations.transitions.base,
    },
    uploadText: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[1],
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',
    },
    fileInput: { display: 'none' },
    previewContainer: { marginTop: stylesGlobal.spacing.scale[4] },
    previewImage: {
      maxWidth: '100%',
      maxHeight: '200px',
      borderRadius: stylesGlobal.borders.radius.base,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
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
  // Confirmación de borrado: { id, nombre }
  const [confirmacion, setConfirmacion] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [servicio, setServicio] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
    imagen: null,
  });

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

  // Cerrar modal - Definido antes para evitar advertencias de ESLint
  const closeModal = useCallback(() => {
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
  }, []);

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

      setServicio(prev => ({ ...prev, imagen: file }));

      // Generar preview como data URL
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

  // Eliminar servicio (la confirmación la pide el ConfirmDialog)
  const ejecutarEliminacion = async () => {
    if (!confirmacion) return;
    setConfirmLoading(true);
    try {
      await adminService.deleteServicio(confirmacion.id);
      setServicios(prev => prev.filter(s => s._id !== confirmacion.id));
      setConfirmacion(null);
      await fetchServicios(); // Refrescar lista
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error('Error al eliminar servicio:', err);
    } finally {
      setConfirmLoading(false);
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
          icon={FaConciergeBell}
          titulo="Gestión de Servicios"
          subtitulo="Administra los servicios de tu negocio"
          accion={
            <BotonPrimario
              icono={FaPlus}
              onClick={() => openModal()}
              disabled={formLoading || loading}
              aria-label="Crear nuevo servicio"
            >
              Nuevo Servicio
            </BotonPrimario>
          }
        />

        {/* Buscador */}
        <Campo etiqueta="Buscar" htmlFor="servicios-buscar">
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              id="servicios-buscar"
              type="text"
              placeholder="Buscar servicios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.input, paddingLeft: stylesGlobal.spacing.scale[10] }}
            />
          </div>
        </Campo>

        {/* Lista */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
            <h3 style={stylesGlobal.typography.headings.h3}>Cargando servicios...</h3>
          </div>
        ) : filteredServicios.length === 0 ? (
          <div style={styles.emptyState}>
            <FaConciergeBell
              style={{
                fontSize: '3rem',
                color: stylesGlobal.colors.neutral[400],
                marginBottom: stylesGlobal.spacing.scale[4],
              }}
            />
            <h3 style={stylesGlobal.typography.headings.h3}>
              {searchTerm ? 'No se encontraron servicios' : 'No hay servicios'}
            </h3>
            <p style={stylesGlobal.typography.body.base}>
              {searchTerm
                ? 'No se encontraron servicios con ese criterio de búsqueda'
                : 'Comienza creando tu primer servicio'}
            </p>
          </div>
        ) : (
          <div>
            <Thead columnas={COLUMNAS}>
              <div>Servicio</div>
              <div>Descripción</div>
              <div style={{ textAlign: 'right' }}>Acciones</div>
            </Thead>

            {filteredServicios.map((servicio) => (
              <Fila key={servicio._id} columnas={COLUMNAS}>
                <div style={{ display: 'flex', alignItems: 'center', gap: stylesGlobal.spacing.scale[4], minWidth: 0 }}>
                  {servicio.imagen ? (
                    <img
                      src={servicio.imagen}
                      alt={servicio.nombre}
                      style={{
                        width: '48px',
                        height: '48px',
                        objectFit: 'cover',
                        borderRadius: stylesGlobal.borders.radius.md,
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <Miniatura>{(servicio.nombre || '?')[0].toUpperCase()}</Miniatura>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: stylesGlobal.typography.weights.semibold,
                        color: stylesGlobal.colors.text.primary,
                      }}
                    >
                      {servicio.nombre}
                    </div>
                    <TextoCelda>{servicio.titulo}</TextoCelda>
                  </div>
                </div>
                <TextoCelda>
                  {servicio.descripcion?.length > 100
                    ? `${servicio.descripcion.substring(0, 100)}...`
                    : servicio.descripcion}
                </TextoCelda>
                <div
                  className="admin-acciones"
                  style={{ display: 'flex', gap: stylesGlobal.spacing.scale[2], justifyContent: 'flex-end' }}
                >
                  <BotonIcono
                    variante="editar"
                    onClick={() => openModal(servicio)}
                    disabled={formLoading}
                    title="Editar servicio"
                    aria-label={`Editar servicio ${servicio.nombre}`}
                  >
                    <FaEdit size={15} />
                  </BotonIcono>
                  <BotonIcono
                    variante="eliminar"
                    onClick={() => setConfirmacion({ id: servicio._id, nombre: servicio.nombre })}
                    disabled={formLoading}
                    title="Eliminar servicio"
                    aria-label={`Eliminar servicio ${servicio.nombre}`}
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
          abierto={showModal}
          onCerrar={closeModal}
          titulo={isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}
          maxWidth="720px"
          bloqueado={formLoading}
          pie={
            <>
              <BotonSecundario onClick={closeModal} disabled={formLoading}>
                Cancelar
              </BotonSecundario>
              <BotonPrimario
                type="submit"
                form="form-servicio"
                disabled={formLoading}
                aria-label={isEditMode ? 'Actualizar servicio' : 'Crear servicio'}
              >
                {formLoading ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite' }} />
                    Guardando...
                  </>
                ) : isEditMode ? (
                  'Actualizar'
                ) : (
                  'Guardar'
                )}
              </BotonPrimario>
            </>
          }
        >
          <form id="form-servicio" onSubmit={handleSubmit} noValidate>
            <div style={styles.formGrid}>
              <Campo etiqueta="Nombre" htmlFor="servicio-nombre" requerido>
                <input
                  id="servicio-nombre"
                  type="text"
                  name="nombre"
                  value={servicio.nombre}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={formLoading}
                  placeholder="Nombre del servicio"
                />
              </Campo>

              <Campo etiqueta="Título" htmlFor="servicio-titulo" requerido>
                <input
                  id="servicio-titulo"
                  type="text"
                  name="titulo"
                  value={servicio.titulo}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={formLoading}
                  placeholder="Título del servicio"
                />
              </Campo>
            </div>

            <Campo etiqueta="Descripción" htmlFor="servicio-descripcion" requerido>
              <textarea
                id="servicio-descripcion"
                name="descripcion"
                value={servicio.descripcion}
                onChange={handleChange}
                style={styles.textarea}
                rows="4"
                disabled={formLoading}
                placeholder="Describe el servicio..."
              />
            </Campo>

            <Campo etiqueta="Imagen del Servicio" opcional pista="PNG, JPG, GIF hasta 10MB">
              <div style={styles.imageUploadArea}>
                <input
                  type="file"
                  name="imagen"
                  accept="image/*"
                  onChange={handleChange}
                  style={styles.fileInput}
                  id="imagen-upload"
                  disabled={formLoading}
                />
                <label htmlFor="imagen-upload" style={styles.uploadText}>
                  <FaPlus size={16} style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
                  Subir imagen
                </label>
              </div>

              {imagePreview && (
                <div style={styles.previewContainer}>
                  <img src={imagePreview} alt="Vista previa" style={styles.previewImage} />
                </div>
              )}
            </Campo>
          </form>
        </AdminModal>

        {/* Confirmación de borrado */}
        <ConfirmDialog
          abierto={Boolean(confirmacion)}
          titulo="¿Eliminar servicio?"
          nombre={confirmacion?.nombre || ''}
          cargando={confirmLoading}
          onCancelar={() => setConfirmacion(null)}
          onConfirmar={ejecutarEliminacion}
        />

        {/* Sistema de notificaciones centralizado */}
        <NotificationContainer
          notifications={notifications}
          onRemoveNotification={removeNotification}
          onClearAll={clearAllNotifications}
        />
      </div>
    </div>
  );
};

export default GestionServicio;
