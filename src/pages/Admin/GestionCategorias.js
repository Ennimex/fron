import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import categoriaService from "../../services/categoriaService";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaImage,
  FaLock,
} from "react-icons/fa";
import stylesGlobal from "../../styles/stylesGlobal";

// Inyectar estilos CSS responsivos
if (!document.getElementById('gestion-categorias-responsive-styles')) {
  const style = document.createElement('style');
  style.id = 'gestion-categorias-responsive-styles';
  style.textContent = `
    /* Estilos responsivos para GestionCategorias */
    @media (max-width: 768px) {
      .categorias-container {
        padding: 1rem !important;
      }
      
      .categorias-header {
        flex-direction: column !important;
        gap: 1rem !important;
        align-items: flex-start !important;
      }
      
      .categorias-header-text h1 {
        font-size: 1.5rem !important;
        margin-bottom: 0.5rem !important;
      }
      
      .categorias-add-btn {
        width: 100% !important;
        justify-content: center !important;
      }
      
      .categorias-search {
        margin-bottom: 1rem !important;
      }
      
      .categorias-table-container {
        overflow-x: auto !important;
        -webkit-overflow-scrolling: touch !important;
      }
      
      .categorias-table {
        min-width: 600px !important;
      }
      
      .categorias-table th,
      .categorias-table td {
        padding: 0.5rem !important;
        font-size: 0.875rem !important;
      }
      
      .categorias-actions {
        flex-direction: column !important;
        gap: 0.25rem !important;
      }
      
      .categorias-action-btn {
        width: 100% !important;
        font-size: 0.75rem !important;
        padding: 0.375rem 0.75rem !important;
      }
      
      .categorias-modal-content {
        margin: 1rem !important;
        max-width: calc(100% - 2rem) !important;
        max-height: calc(100vh - 2rem) !important;
      }
      
      .categorias-modal-header h2 {
        font-size: 1.25rem !important;
        margin-bottom: 1rem !important;
      }
      
      .categorias-form-group {
        margin-bottom: 1rem !important;
      }
      
      .categorias-modal-actions {
        flex-direction: column-reverse !important;
        gap: 0.75rem !important;
      }
      
      .categorias-modal-btn {
        width: 100% !important;
      }
    }
    
    @media (max-width: 480px) {
      .categorias-container {
        padding: 0.5rem !important;
      }
      
      .categorias-table th:not(:first-child):not(:last-child),
      .categorias-table td:not(:first-child):not(:last-child) {
        display: none !important;
      }
      
      .categorias-image-preview {
        width: 30px !important;
        height: 30px !important;
      }
      
      .categorias-image-placeholder {
        width: 30px !important;
        height: 30px !important;
      }
    }
  `;
  document.head.appendChild(style);
}

const GestionCategorias = () => {
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
      gap: stylesGlobal.spacing.gaps.sm,
    },
    content: {
      backgroundColor: stylesGlobal.colors.surface.primary,
      borderRadius: stylesGlobal.borders.radius.md,
      padding: stylesGlobal.spacing.scale[6],
    },
    error: {
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      color: stylesGlobal.colors.semantic.error.main,
      padding: stylesGlobal.spacing.scale[4],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
      border: `1px solid ${stylesGlobal.colors.semantic.error.main}`,
    },
    success: {
      backgroundColor: stylesGlobal.colors.semantic.success.light,
      color: stylesGlobal.colors.semantic.success.main,
      padding: stylesGlobal.spacing.scale[4],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
      border: `1px solid ${stylesGlobal.colors.semantic.success.main}`,
    },
    tableContainer: {
      overflowX: 'auto',
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: `0 ${stylesGlobal.spacing.scale[2]}`,
    },
    tableHeader: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.text.secondary,
      padding: stylesGlobal.spacing.scale[3],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderBottom: `${stylesGlobal.borders.width[2]} solid ${stylesGlobal.borders.colors.muted}`,
      textAlign: 'left',
    },
    tableCell: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
    },
    tableCellFirst: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      border: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
      borderTopLeftRadius: stylesGlobal.borders.radius.sm,
      borderBottomLeftRadius: stylesGlobal.borders.radius.sm,
    },
    tableCellBold: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.semibold,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
    },
    tableCellLast: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      border: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
      borderTopRightRadius: stylesGlobal.borders.radius.sm,
      borderBottomRightRadius: stylesGlobal.borders.radius.sm,
    },
    actionButton: {
      ...stylesGlobal.components.button.variants.ghost,
      ...stylesGlobal.components.button.sizes.sm,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
    },
    editAction: {
      ...stylesGlobal.components.button.variants.secondary,
    },
    deleteAction: {
      ...stylesGlobal.components.button.variants.ghost,
      color: stylesGlobal.colors.semantic.error.main,
      borderColor: stylesGlobal.colors.semantic.error.main,
      "&:hover": {
        backgroundColor: stylesGlobal.colors.semantic.error.light,
        color: stylesGlobal.colors.semantic.error.main,
      },
    },
    actionsContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.sm,
      justifyContent: 'flex-end',
    },
    modalOverlay: {
      ...stylesGlobal.utils.overlay.elegant,
      zIndex: stylesGlobal.utils.zIndex.modal,
    },
    modalContent: {
      backgroundColor: stylesGlobal.colors.surface.primary,
      borderRadius: stylesGlobal.borders.radius.lg,
      boxShadow: stylesGlobal.shadows.lg,
      maxWidth: '600px',
      maxHeight: '90vh',
      overflow: 'auto',
      margin: 'auto',
      position: 'relative',
    },
    modalCloseButton: {
      position: 'absolute',
      top: stylesGlobal.spacing.scale[3],
      right: stylesGlobal.spacing.scale[3],
      background: 'none',
      border: 'none',
      fontSize: stylesGlobal.typography.scale.base,
      cursor: 'pointer',
      color: stylesGlobal.colors.text.secondary,
      transition: stylesGlobal.animations.transitions.fast,
      "&:hover": {
        color: stylesGlobal.colors.text.primary,
      },
    },
    modalTitle: {
      ...stylesGlobal.typography.headings.h3,
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: stylesGlobal.spacing.gaps.md,
      paddingTop: stylesGlobal.spacing.scale[4],
      borderTop: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
      marginTop: stylesGlobal.spacing.scale[6],
    },
    modalBody: {
      padding: stylesGlobal.spacing.scale[6],
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
      display: 'block',
      marginBottom: stylesGlobal.spacing.scale[2],
      color: stylesGlobal.colors.text.primary,
      fontWeight: stylesGlobal.typography.weights.medium,
    },
    requiredField: {
      color: stylesGlobal.colors.semantic.error.main,
      marginLeft: stylesGlobal.spacing.scale[1],
    },
    charCount: {
      ...stylesGlobal.typography.body.caption,
      marginLeft: stylesGlobal.spacing.scale[2],
      color: stylesGlobal.colors.text.muted,
    },
    input: {
      ...stylesGlobal.components.input.base,
    },
    textarea: {
      ...stylesGlobal.components.input.base,
      minHeight: '120px',
      resize: 'vertical',
    },
    helpText: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.text.muted,
      marginTop: stylesGlobal.spacing.scale[2],
      fontStyle: 'italic',
    },
    imagePreview: {
      height: '40px',
      width: '40px',
      borderRadius: stylesGlobal.borders.radius.full,
      objectFit: 'cover',
      border: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
    },
    imagePlaceholder: {
      height: '40px',
      width: '40px',
      backgroundColor: stylesGlobal.colors.neutral[200],
      borderRadius: stylesGlobal.borders.radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: stylesGlobal.colors.text.muted,
      border: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
    },
    modalImagePreview: {
      maxWidth: '100%',
      maxHeight: '150px',
      marginTop: stylesGlobal.spacing.scale[4],
      borderRadius: stylesGlobal.borders.radius.sm,
      border: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
    },
    searchContainer: {
      position: 'relative',
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    searchIcon: {
      position: 'absolute',
      left: stylesGlobal.spacing.scale[3],
      top: '50%',
      transform: 'translateY(-50%)',
      color: stylesGlobal.colors.text.muted,
      zIndex: stylesGlobal.utils.zIndex.base,
    },
    searchInput: {
      ...stylesGlobal.components.input.base,
      paddingLeft: '2.5rem',
    },
    outlineButton: {
      ...stylesGlobal.components.button.variants.ghost,
      ...stylesGlobal.components.button.sizes.base,
    },
    primaryButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
    },
    disabledButton: {
      opacity: 0.6,
      cursor: 'not-allowed',
      "&:hover": {
        transform: 'none',
        boxShadow: stylesGlobal.shadows.none,
      },
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    emptyStateText: {
      ...stylesGlobal.typography.headings.h4,
      color: stylesGlobal.colors.text.secondary,
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: stylesGlobal.spacing.scale[8],
    },
    spinner: {
      animation: 'spin 1s linear infinite',
      marginRight: stylesGlobal.spacing.scale[2],
    },
    textCenter: {
      textAlign: 'center',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
  };

  // Estados del componente
  const [categorias, setCategorias] = useState([]);
  const [categoriaActual, setCategoriaActual] = useState({
    _id: "",
    nombre: "",
    descripcion: "",
    imagenURL: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Usar el hook de notificaciones
  const { notifications, removeNotification, clearAllNotifications } = useAdminNotifications();

  // Fetch categories
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const categorias = await categoriaService.getAll();
      setCategorias(categorias);
    } catch (err) {
      setError(err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchCategorias();
    }
  }, [fetchCategorias, isAuthenticated, user]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file change
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Validate form
  const validateForm = () => {
    if (!categoriaActual.nombre.trim()) {
      setError("El nombre de la categoría es obligatorio");
      return false;
    }
    
    if (categoriaActual.nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    
    if (categoriaActual.nombre.trim().length > 50) {
      setError("El nombre no puede exceder los 50 caracteres");
      return false;
    }
    
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-]+$/;
    if (!nombreRegex.test(categoriaActual.nombre.trim())) {
      setError("El nombre solo debe contener letras, números, espacios y guiones");
      return false;
    }
    
    if (categoriaActual.descripcion && categoriaActual.descripcion.length > 200) {
      setError("La descripción no puede exceder los 200 caracteres");
      return false;
    }
    
    if (selectedFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("El archivo debe ser una imagen (JPEG, PNG, GIF o WEBP)");
        return false;
      }
      
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (selectedFile.size > maxSize) {
        setError("La imagen no puede superar los 5MB");
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  // Save or update category
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      setError(null);
      
      const formData = new FormData();
      formData.append("nombre", categoriaActual.nombre);
      formData.append("descripcion", categoriaActual.descripcion);
      if (selectedFile) {
        formData.append("imagen", selectedFile);
      }

      if (modoEdicion) {
        await categoriaService.update(categoriaActual._id, formData);
      } else {
        await categoriaService.create(formData);
      }

      await fetchCategorias();
      closeModal();
    } catch (err) {
      setError(err.message || `Error al ${modoEdicion ? "actualizar" : "crear"} la categoría`);
    } finally {
      setLoading(false);
    }
  };

  // Modal controls
  const openModal = (categoria = null) => {
    console.log('openModal called with:', categoria); // Debug log
    if (categoria) {
      setCategoriaActual(categoria);
      setModoEdicion(true);
    } else {
      resetForm();
      setModoEdicion(false);
    }
    setModalVisible(true);
    console.log('Modal should be visible now'); // Debug log
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta categoría?")) return;

    try {
      setLoading(true);
      setError(null);
      await categoriaService.delete(id);
      await fetchCategorias();
    } catch (err) {
      setError(err.message || "Error al eliminar la categoría");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setCategoriaActual({
      _id: "",
      nombre: "",
      descripcion: "",
      imagenURL: "",
    });
    setSelectedFile(null);
    setModoEdicion(false);
    setError(null);
  };

  // Filter categories using service
  const filteredCategorias = categoriaService.filter(categorias, { search: searchTerm });

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
    <div style={styles.pageContainer} className="categorias-container">
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.header} className="categorias-header">
          <div className="categorias-header-text">
            <h1 style={styles.title}>Gestión de Categorías</h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las categorías del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            className="categorias-add-btn"
            onClick={() => openModal()}
            aria-label="Nueva categoría"
          >
            <FaPlus size={14} />
            Nueva Categoría
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Search */}
        <div style={styles.searchContainer} className="categorias-search">
          <label style={styles.label}>Buscar categorías</label>
          <div style={{ position: 'relative' }}>
            <FaSearch style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.textCenter}>
              <FaSpinner style={styles.spinner} />
              <h3>Cargando categorías...</h3>
            </div>
          </div>
        ) : filteredCategorias.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>
              {searchTerm ? "No se encontraron categorías" : "No hay categorías registradas"}
            </h3>
            <p style={stylesGlobal.typography.body.base}>
              {searchTerm ? "Intenta con otros términos de búsqueda" : "¡Agrega una nueva categoría para comenzar!"}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer} className="categorias-table-container">
            <table style={styles.table} className="categorias-table">
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Imagen</th>
                  <th style={styles.tableHeader}>Nombre</th>
                  <th style={styles.tableHeader}>Descripción</th>
                  <th style={styles.tableHeader}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategorias.map((categoria) => (
                  <tr key={categoria._id}>
                    <td style={styles.tableCellFirst}>
                      {categoria.imagenURL ? (
                        <img
                          src={categoria.imagenURL}
                          alt={categoria.nombre}
                          style={styles.imagePreview}
                          className="categorias-image-preview"
                        />
                      ) : (
                        <div style={styles.imagePlaceholder} className="categorias-image-placeholder">
                          <FaImage size={18} />
                        </div>
                      )}
                    </td>
                    <td style={styles.tableCellBold}>
                      <strong>{categoria.nombre}</strong>
                    </td>
                    <td style={styles.tableCell}>
                      {categoria.descripcion || '—'}
                    </td>
                    <td style={styles.tableCellLast}>
                      <div style={styles.actionsContainer} className="categorias-actions">
                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.editAction,
                          }}
                          className="categorias-action-btn"
                          onClick={() => openModal(categoria)}
                          title="Editar categoría"
                          disabled={loading}
                          aria-label={`Editar categoría ${categoria.nombre}`}
                        >
                          <FaEdit size={12} />
                          Editar
                        </button>
                        <button
                          style={{
                            ...styles.actionButton,
                            ...styles.deleteAction,
                          }}
                          className="categorias-action-btn"
                          onClick={() => handleDelete(categoria._id)}
                          title="Eliminar categoría"
                          disabled={loading}
                          aria-label={`Eliminar categoría ${categoria.nombre}`}
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

        {/* Modal */}
        {modalVisible && (
          <div 
            style={{
              ...styles.modalOverlay,
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000
            }}
            className="modal"
            onClick={(e) => e.target.classList.contains('modal') && closeModal()}
          >
            <div style={styles.modalContent} className="categorias-modal-content">
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  onClick={closeModal}
                  aria-label="Cerrar modal"
                >
                  ✗
                </button>
                <div className="categorias-modal-header">
                  <h2 style={styles.modalTitle}>
                    {modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
                  </h2>
                </div>

                {error && (
                  <div style={styles.error}>
                    {error}
                  </div>
                )}

                <form style={styles.formContainer} onSubmit={handleSubmit}>
                  <div style={styles.formGroup} className="categorias-form-group">
                    <label style={styles.label} htmlFor="nombre">
                      Nombre de la Categoría
                      <span style={styles.requiredField}>*</span>
                      <span style={styles.charCount}>
                        ({categoriaActual.nombre.length}/50)
                      </span>
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={categoriaActual.nombre}
                      onChange={handleChange}
                      required
                      style={styles.input}
                      placeholder="Ej: Ropa de Hombre"
                    />
                  </div>

                  <div style={styles.formGroup} className="categorias-form-group">
                    <label style={styles.label} htmlFor="descripcion">
                      Descripción
                      <span style={styles.charCount}>
                        ({categoriaActual.descripcion?.length || 0}/200)
                      </span>
                    </label>
                    <textarea
                      id="descripcion"
                      name="descripcion"
                      value={categoriaActual.descripcion}
                      onChange={handleChange}
                      style={styles.textarea}
                      rows="3"
                      placeholder="Descripción breve de la categoría (opcional)"
                    />
                    <small style={styles.helpText}>
                      Proporciona una descripción que ayude a identificar esta categoría.
                    </small>
                  </div>

                  <div style={styles.formGroup} className="categorias-form-group">
                    <label style={styles.label} htmlFor="imagen">
                      Imagen de la Categoría
                    </label>
                    <input
                      id="imagen"
                      type="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      style={styles.input}
                    />
                    <small style={styles.helpText}>
                      Formatos admitidos: JPEG, PNG, GIF, WEBP. Tamaño máximo: 5MB.
                    </small>
                    {categoriaActual.imagenURL && (
                      <img
                        src={categoriaActual.imagenURL}
                        alt="Vista previa"
                        style={styles.modalImagePreview}
                      />
                    )}
                  </div>

                  <div style={styles.modalActions} className="categorias-modal-actions">
                    <button
                      type="button"
                      onClick={closeModal}
                      style={styles.outlineButton}
                      className="categorias-modal-btn"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{
                        ...styles.primaryButton,
                        ...(loading ? styles.disabledButton : {}),
                      }}
                      className="categorias-modal-btn"
                      disabled={loading}
                      aria-label={modoEdicion ? "Actualizar categoría" : "Crear categoría"}
                    >
                      {loading ? (
                        <>
                          <FaSpinner style={styles.spinner} />
                          {modoEdicion ? "Actualizando..." : "Guardando..."}
                        </>
                      ) : (
                        <>
                          <FaSave style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
                          {modoEdicion ? "Actualizar Categoría" : "Guardar Categoría"}
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

export default GestionCategorias;