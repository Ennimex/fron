import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import adminStyles from '../../styles/stylesAdmin';

const GestionFotos = () => {
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
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    emptyStateSubtext: adminStyles.containers.emptyStateSubtext,
    
    // Estilos de cards
    cardBase: adminStyles.cards.base,
    cardImageContainer: adminStyles.cards.imageContainer,
    cardImage: adminStyles.cards.image,
    cardPlaceholder: adminStyles.cards.placeholder,
    cardContent: adminStyles.cards.content,
    cardTitle: adminStyles.cards.title,
    cardDescription: adminStyles.cards.description,
    cardActions: {
      ...adminStyles.cards.actions,
      gap: adminStyles.spacing.md,
      paddingTop: adminStyles.spacing.sm,
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
      padding: 0, // El padding ya se maneja en modalBody
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
    fileInputContainer: {
      position: 'relative',
      width: '100%',
    },
    fileInput: {
      ...adminStyles.forms.fileInput,
      width: '100%',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.lg}`,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      cursor: 'pointer',
      backgroundColor: adminStyles.colors.backgroundLight,
      transition: 'border-color 0.2s ease, background-color 0.2s ease',
      '&:hover': {
        backgroundColor: adminStyles.colors.backgroundGray,
      },    },
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
    previewContainer: {
      marginTop: adminStyles.spacing.xl,
      padding: adminStyles.spacing.lg,
      backgroundColor: adminStyles.colors.backgroundGray,
      borderRadius: adminStyles.borders.radius,
      border: `1px solid ${adminStyles.colors.border}`,
      textAlign: 'center',
    },
    previewLabel: {
      display: 'block',
      marginBottom: adminStyles.spacing.lg,
      fontSize: adminStyles.typography.textSm,
      fontWeight: adminStyles.typography.weightMedium,
      color: adminStyles.colors.textSecondary,
      textAlign: 'left',
    },
    previewMedia: {
      ...adminStyles.forms.previewMedia,
      maxWidth: '100%',
      maxHeight: '300px',
      height: 'auto',
      borderRadius: adminStyles.borders.radius,
      border: `1px solid ${adminStyles.colors.border}`,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    },
    
    // Estilos de botones
    actionButton: {
      ...adminStyles.buttons.actionButton,
      padding: `${adminStyles.spacing.sm} ${adminStyles.spacing.lg}`,
      minWidth: '90px',
      fontSize: adminStyles.typography.textSm,
      fontWeight: adminStyles.typography.weightMedium,
    },
    editAction: {
      ...adminStyles.buttons.editAction,
      marginRight: adminStyles.spacing.md,
    },
    deleteAction: adminStyles.buttons.deleteAction,
    outlineButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.outline,
      marginRight: adminStyles.spacing.lg,
    },
    primaryButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
    },
    
    // Estilos de loading
    loadingContainer: {
      ...adminStyles.containers.page,
      ...adminStyles.loadingStyles.container,
    },
    
    // Utilidades
    textCenter: adminStyles.utilities.textCenter,
    flexCenter: adminStyles.utilities.flexCenter,
  };

  // Estados para datos
  const [fotos, setFotos] = useState([]);

  // Estados para UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFoto, setCurrentFoto] = useState(null);

  // Estado para el formulario
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
    imagenPreview: null
  });

  // Fetch photos on component mounts
  useEffect(() => {
    fetchFotos();
  }, []);

  // Fetch list of photos
  const fetchFotos = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/fotos');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cargar las fotos');
      }
      
      const data = await response.json();
      setFotos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle image change
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        imagen: file,
        imagenPreview: imageUrl
      });
    }
  };

  // Open modal for creating a new photo
  const handleOpenCreateModal = () => {
    setCurrentFoto(null);
    setFormData({
      titulo: '',
      descripcion: '',
      imagen: null,
      imagenPreview: null
    });
    setModalOpen(true);
  };

  // Open modal for editing an existing photo
  const handleOpenEditModal = (foto) => {
    setCurrentFoto(foto);
    setFormData({
      titulo: foto.titulo || '',
      descripcion: foto.descripcion || '',
      imagen: null,
      imagenPreview: foto.url
    });
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setError(null); // Clear any error message when closing the modal
  };

  // Close modal when clicking outside the content
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      handleCloseModal();
    }
  };

  // Handle photo deletion
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta foto?')) {
      try {
        setError(null);
        const response = await fetch(`http://localhost:5000/api/fotos/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Error al eliminar la foto');
        }

        // Update the photo list by excluding the deleted one
        setFotos(fotos.filter(foto => foto._id !== id));
        setSuccess('Foto eliminada correctamente');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      } catch (err) {
        setError(err.message);
        console.error('Error al eliminar foto:', err);
      }
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setError(null);
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      
      // Attach image only if a new one is provided
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      let response;
      
      if (currentFoto) {
        // Update existing photo
        response = await fetch(`http://localhost:5000/api/fotos/${currentFoto._id}`, {
          method: 'PUT',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      } else {
        // Create new photo
        response = await fetch('http://localhost:5000/api/fotos', {
          method: 'POST',
          body: formDataToSend,
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || (currentFoto ? 'Error al actualizar la foto' : 'Error al crear la foto'));
      }

      // Show success message
      setSuccess(currentFoto ? 'Foto actualizada correctamente' : 'Foto creada correctamente');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);

      // Close modal and refresh photo list
      handleCloseModal();
      fetchFotos();
    } catch (err) {
      setError(err.message);
      console.error('Error al guardar foto:', err);
    }
  };

  // Check if the user is authenticated and has admin role
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
    return (
      <div style={adminStyles.combineStyles(
        adminStyles.containers.page,
        adminStyles.utilities.flexCenter,
        { height: '80vh', textAlign: 'center' }
      )}>
        <FaLock size={50} style={adminStyles.icons.error} />
        <h2 style={adminStyles.headerStyles.titleDark}>Acceso Denegado</h2>
        <p style={adminStyles.headerStyles.subtitleDark}>
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
          <h3>Cargando fotos...</h3>
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
              <FaImage style={{ marginRight: adminStyles.spacing.md }} />
              Gestión de Fotos
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las fotos del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            onClick={handleOpenCreateModal}
            aria-label="Agregar nueva foto"
          >
            <FaPlus size={14} style={{ marginRight: adminStyles.spacing.xs }} />
            Agregar Foto
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        {/* Contenido principal */}
        {fotos.length === 0 ? (
          <div style={styles.emptyState}>
            <FaImage size={40} style={{ opacity: 0.3, marginBottom: adminStyles.spacing.lg }} />
            <h3 style={styles.emptyStateText}>No hay fotos disponibles</h3>
            <p style={styles.emptyStateSubtext}>
              ¡Agrega una nueva foto para comenzar!
            </p>
          </div>
        ) : (
          <div style={adminStyles.combineStyles(
            styles.content,
            {
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: adminStyles.spacing.lg
            }
          )}>
            {fotos.map((foto) => (
              <div key={foto._id} style={styles.cardBase}>
                <div style={styles.cardImageContainer}>
                  {foto.url ? (
                    <img 
                      src={foto.url} 
                      alt={foto.titulo} 
                      style={styles.cardImage} 
                    />
                  ) : (
                    <div style={styles.cardPlaceholder}>
                      <FaImage size={40} />
                      <p>Sin imagen</p>
                    </div>
                  )}
                </div>
                <div style={styles.cardContent}>
                  <h3 style={styles.cardTitle}>
                    {foto.titulo || 'Sin título'}
                  </h3>
                  <p style={styles.cardDescription}>
                    {foto.descripcion || 'Sin descripción'}
                  </p>
                  <div style={styles.cardActions}>
                    <button
                      style={adminStyles.combineStyles(
                        styles.actionButton,
                        styles.editAction
                      )}
                      onClick={() => handleOpenEditModal(foto)}
                      title="Editar foto"
                      aria-label={`Editar foto ${foto.titulo || 'Sin título'}`}
                    >
                      <FaEdit size={14} style={{ marginRight: adminStyles.spacing.xs }} />
                      Editar
                    </button>
                    <button
                      style={adminStyles.combineStyles(
                        styles.actionButton,
                        styles.deleteAction
                      )}
                      onClick={() => handleDelete(foto._id)}
                      title="Eliminar foto"
                      aria-label={`Eliminar foto ${foto.titulo || 'Sin título'}`}
                    >
                      <FaTrash size={14} style={{ marginRight: adminStyles.spacing.xs }} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}        {/* Modal para crear/editar foto */}
        {modalOpen && (
          <div 
            style={styles.modalOverlay}
            className="modal-overlay"
            onClick={handleOutsideClick}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  onClick={handleCloseModal}
                  aria-label="Cerrar modal"
                >
                  ✕
                </button>
                <h2 style={styles.modalTitle}>
                  {currentFoto ? 'Editar Foto' : 'Agregar Nueva Foto'}
                </h2>
                  <form onSubmit={handleSubmit} style={styles.formContainer}>
                  {/* Campo título */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="titulo">
                      Título de la Foto
                      <span style={styles.requiredField}>*</span>
                    </label>
                    <input
                      style={styles.input}
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      placeholder="Ingresa un título descriptivo para la foto"
                      required
                    />
                  </div>
                  
                  {/* Campo descripción */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="descripcion">
                      Descripción
                    </label>
                    <textarea
                      style={styles.textarea}
                      id="descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Describe la foto, contexto o información adicional (opcional)"
                      rows={4}
                    />
                    <small style={styles.helpText}>
                      Proporciona una descripción que ayude a los usuarios a comprender mejor la imagen.
                    </small>
                  </div>
                  
                  {/* Campo archivo de imagen */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="imagen">
                      Archivo de Imagen
                      {!currentFoto && <span style={styles.requiredField}>*</span>}
                    </label>
                    <div style={styles.fileInputContainer}>
                      <input
                        style={styles.fileInput}
                        type="file"
                        id="imagen"
                        name="imagen"
                        accept="image/*"
                        onChange={handleImageChange}
                        {...(currentFoto ? {} : { required: true })}
                      />
                      <small style={styles.helpText}>
                        Selecciona una imagen en formato JPG, PNG o GIF. Tamaño máximo: 10MB. 
                        {currentFoto && " Deja vacío para mantener la imagen actual."}
                      </small>
                    </div>
                    
                    {formData.imagenPreview && (
                      <div style={styles.previewContainer}>
                        <span style={styles.previewLabel}>Vista previa de la imagen:</span>
                        <img 
                          src={formData.imagenPreview} 
                          alt="Vista previa de la foto" 
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
                      style={styles.outlineButton}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={styles.primaryButton}
                      disabled={loading}
                    >
                      {loading 
                        ? (currentFoto ? 'Actualizando...' : 'Creando...') 
                        : (currentFoto ? 'Actualizar Foto' : 'Crear Foto')
                      }
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

export default GestionFotos;