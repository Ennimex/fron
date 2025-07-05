import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import adminStyles from '../../styles/stylesAdmin';

const GestionServicio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Mapeo de estilos globales
  const styles = {
    pageContainer: adminStyles.containers.page,
    container: adminStyles.containers.content,
    header: adminStyles.headerStyles.headerSimple,
    headerContent: adminStyles.headerStyles.headerContent,
    title: adminStyles.headerStyles.titleDark,
    subtitle: adminStyles.headerStyles.subtitleDark,
    addButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
    },
    content: { padding: adminStyles.spacing.xl },
    error: adminStyles.messageStyles.error,
    success: adminStyles.messageStyles.success,
    controlsContainer: adminStyles.searchStyles.container,
    searchContainer: adminStyles.searchStyles.searchContainer,
    searchInput: adminStyles.searchStyles.searchInput,
    tableContainer: adminStyles.tables.container,
    table: adminStyles.tables.table,
    tableHeader: adminStyles.tables.header,
    tableHeaderCell: adminStyles.tables.headerCell,
    tableRow: adminStyles.tables.row,
    tableCell: adminStyles.tables.cell,
    actionsContainer: adminStyles.tables.actionsContainer,
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    emptyStateSubtext: adminStyles.containers.emptyStateSubtext,
    modalOverlay: adminStyles.modalStyles.overlay,
    modalContent: adminStyles.modalStyles.content,
    modalHeader: adminStyles.modalStyles.header,
    modalTitle: adminStyles.modalStyles.title,
    modalCloseButton: adminStyles.modalStyles.closeButton,
    modalBody: adminStyles.modalStyles.body,
    formGrid: adminStyles.forms.formGrid,
    formGroup: adminStyles.forms.formGroup,
    label: adminStyles.forms.label,
    requiredField: adminStyles.forms.requiredField,
    input: adminStyles.forms.input,
    textarea: adminStyles.forms.textarea,
    imageUploadArea: adminStyles.forms.uploadArea,
    uploadText: adminStyles.forms.uploadText,
    uploadSubtext: adminStyles.forms.uploadSubtext,
    fileInput: adminStyles.forms.fileInput,
    previewContainer: { marginTop: adminStyles.spacing.md },
    previewImage: adminStyles.forms.imagePreview,
    submitButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
      width: '100%',
      justifyContent: 'center',
      marginTop: adminStyles.spacing.lg,
    },
    submitButtonDisabled: adminStyles.buttons.disabled,
    actionButton: adminStyles.buttons.actionButton,
    editAction: adminStyles.buttons.editAction,
    deleteAction: adminStyles.buttons.deleteAction,
  };

  // Estados
  const [servicios, setServicios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [selectedServicio, setSelectedServicio] = useState(null);

  const [servicio, setServicio] = useState({
    nombre: '',
    titulo: '',
    descripcion: '',
    imagen: null,
  });

  // Verificar autenticación y rol
  useEffect(() => {
    if (!user) {
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }
    
    if (user.role !== 'admin') {
      navigate('/unauthorized', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }
  }, [user, navigate, location.pathname]);

  // Cargar servicios
  const fetchServicios = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getServicios();
      setServicios(response || []);
      setError(null);
    } catch (error) {
      console.error('Error al cargar servicios:', error);
      setError('Error al cargar los servicios');
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.token && user?.role === 'admin') {
      fetchServicios();
    }
  }, [user?.token, user?.role]);

  // Manejar tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscapeKey = (e) => {
      if (e.key === 'Escape' && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscapeKey);
      // Prevenir scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  // Auto-ocultar mensajes después de 5 segundos
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'imagen' && files && files[0]) {
      const file = files[0];
      
      // Validar tamaño del archivo (10MB máximo)
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes
      if (file.size > maxSize) {
        setError('La imagen no puede superar los 10MB');
        return;
      }

      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecciona solo archivos de imagen');
        return;
      }

      setServicio(prev => ({ ...prev, imagen: file }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error si había uno
      setError(null);
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
    setError(null);
    setSuccess(null);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setServicio({
      nombre: '',
      titulo: '',
      descripcion: '',
      imagen: null,
    });
    setImagePreview(null);
    setError(null);
    setSuccess(null);
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

  // Guardar servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!servicio.nombre || !servicio.titulo || !servicio.descripcion) {
      setError('Todos los campos son obligatorios');
      return;
    }

    try {
      setLoading(true);
      
      // Crear FormData para enviar la imagen junto con los otros datos
      const formData = new FormData();
      formData.append('nombre', servicio.nombre);
      formData.append('titulo', servicio.titulo);
      formData.append('descripcion', servicio.descripcion);
      
      // Solo agregar imagen si hay una nueva
      if (servicio.imagen) {
        formData.append('imagen', servicio.imagen);
      }

      if (isEditMode) {
        await adminAPI.updateServicio(selectedServicio._id, formData);
        setSuccess('Servicio actualizado exitosamente');
      } else {
        await adminAPI.createServicio(formData);
        setSuccess('Servicio creado exitosamente');
      }

      await fetchServicios();
      closeModal();
    } catch (error) {
      console.error('Error al guardar servicio:', error);
      setError(error.response?.data?.error || 'Error al guardar el servicio');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar servicio
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      return;
    }

    try {
      setLoading(true);
      await adminAPI.deleteServicio(id);
      setSuccess('Servicio eliminado exitosamente');
      await fetchServicios();
    } catch (error) {
      console.error('Error al eliminar servicio:', error);
      setError(error.response?.data?.error || 'Error al eliminar el servicio');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar servicios
  const filteredServicios = servicios.filter(servicio =>
    servicio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    servicio.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading && servicios.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {adminStyles.animations}
      </style>
      
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
                style={styles.addButton}
                onClick={() => openModal()}
                className="hover-lift"
              >
                <i className="fas fa-plus me-2"></i>
                Nuevo Servicio
              </button>
            </div>
          </div>

          {/* Mensajes */}
          {error && (
            <div style={styles.error} className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </span>
                <button 
                  onClick={() => setError(null)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

          {success && (
            <div style={styles.success} className="fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </span>
                <button 
                  onClick={() => setSuccess(null)}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          )}

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
              <div style={styles.emptyState} className="fade-in">
                <i className="fas fa-concierge-bell" style={{ fontSize: '4rem', color: adminStyles.colors.grayMedium, marginBottom: adminStyles.spacing.lg }}></i>
                <h3 style={styles.emptyStateText}>No hay servicios</h3>
                <p style={styles.emptyStateSubtext}>
                  {searchTerm ? 'No se encontraron servicios con ese criterio de búsqueda' : 'Comienza creando tu primer servicio'}
                </p>
              </div>
            ) : (
              <div style={styles.tableContainer} className="fade-in">
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
                      <tr key={servicio._id} style={styles.tableRow} className="hover-lift">
                        <td style={styles.tableCell}>
                          {servicio.imagen ? (
                            <img
                              src={servicio.imagen}
                              alt={servicio.nombre}
                              style={{
                                width: '60px',
                                height: '60px',
                                objectFit: 'cover',
                                borderRadius: adminStyles.borders.radius,
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '60px',
                                height: '60px',
                                backgroundColor: adminStyles.colors.grayLight,
                                borderRadius: adminStyles.borders.radius,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <i className="fas fa-image" style={{ color: adminStyles.colors.grayMedium }}></i>
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
                              style={{...styles.actionButton, ...styles.editAction}}
                              onClick={() => openModal(servicio)}
                              className="hover-scale"
                              title="Editar servicio"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              style={{...styles.actionButton, ...styles.deleteAction}}
                              onClick={() => handleDelete(servicio._id)}
                              className="hover-scale"
                              title="Eliminar servicio"
                            >
                              <i className="fas fa-trash"></i>
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
      </div>

      {/* Modal */}
      {showModal && (
        <div 
          style={styles.modalOverlay} 
          className="fade-in"
          onClick={handleModalOverlayClick}
        >
          <div style={styles.modalContent} className="slide-up">
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                {isEditMode ? 'Editar Servicio' : 'Nuevo Servicio'}
              </h2>
              <button
                style={styles.modalCloseButton}
                onClick={closeModal}
                className="hover-scale"
              >
                <i className="fas fa-times"></i>
              </button>
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
                  <label htmlFor="imagen-upload" style={styles.uploadText}>
                    <i className="fas fa-cloud-upload-alt me-2"></i>
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
                  ...(loading ? styles.submitButtonDisabled : {})
                }}
                disabled={loading}
                className="hover-lift"
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    {isEditMode ? 'Actualizar Servicio' : 'Crear Servicio'}
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GestionServicio;
