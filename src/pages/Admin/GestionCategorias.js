import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
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
import adminStyles from "../../styles/stylesAdmin";

const GestionCategorias = () => {
  const navigate = useNavigate();
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
    charCount: {
      ...adminStyles.forms.charCount,
      marginLeft: adminStyles.spacing.sm,
      color: adminStyles.colors.textMuted,
      fontSize: adminStyles.typography.textXs,
      fontWeight: 'normal',
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
    
    // Estilos específicos de imagen
    imagePreview: {
      height: '40px',
      width: '40px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: `1px solid ${adminStyles.colors.border}`,
    },
    imagePlaceholder: {
      height: '40px',
      width: '40px',
      backgroundColor: adminStyles.colors.grayLight,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: adminStyles.colors.white,
      border: `1px solid ${adminStyles.colors.border}`,
    },
    modalImagePreview: {
      maxWidth: '100%',
      maxHeight: '150px',
      marginTop: adminStyles.spacing.md,
      borderRadius: adminStyles.borders.radius,
      border: `1px solid ${adminStyles.colors.border}`,
    },
    
    // Estilos de búsqueda
    searchContainer: {
      position: 'relative',
      marginBottom: adminStyles.spacing.xl,
    },
    searchIcon: {
      position: 'absolute',
      left: adminStyles.spacing.lg,
      top: '50%',
      transform: 'translateY(-50%)',
      color: adminStyles.colors.textMuted,
      zIndex: 1,
    },
    searchInput: {
      ...adminStyles.forms.input,
      paddingLeft: '2.5rem',
      width: '100%',
      boxSizing: 'border-box',
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
    disabledButton: adminStyles.buttons.disabled,
    
    // Estilos de estados
    emptyState: adminStyles.containers.emptyState,
    emptyStateText: adminStyles.containers.emptyStateText,
    loadingContainer: adminStyles.loadingStyles.container,
    spinner: adminStyles.loadingStyles.spinner,
    
    // Utilidades
    textCenter: adminStyles.utilities.textCenter,
    flexCenter: adminStyles.utilities.flexCenter,
    flexBetween: adminStyles.utilities.flexBetween,
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

  // Axios configuration
  const api = useMemo(() => {
    return axios.create({
      baseURL: "http://localhost:5000/api",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }, []);

  // Verify token before operations
  const verifyTokenAndProceed = useCallback(async () => {
    if (!checkTokenExpiration()) {
      navigate('/login');
      return false;
    }
    return true;
  }, [checkTokenExpiration, navigate]);

  // Fetch categories
  const fetchCategorias = useCallback(async () => {
    if (!await verifyTokenAndProceed()) return;
    
    try {
      setLoading(true);
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.error || "Error al cargar categorías");
      }
    } finally {
      setLoading(false);
    }
  }, [api, navigate, verifyTokenAndProceed]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

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
    if (!await verifyTokenAndProceed()) return;
    if (!validateForm()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("nombre", categoriaActual.nombre);
      formData.append("descripcion", categoriaActual.descripcion);
      if (selectedFile) {
        formData.append("imagen", selectedFile);
      }

      if (modoEdicion) {
        await api.put(`/categorias/${categoriaActual._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categorias", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await fetchCategorias();
      closeModal();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(
          err.response?.data?.error ||
            `Error al ${modoEdicion ? "actualizar" : "crear"} la categoría`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Modal controls
  const openModal = (categoria = null) => {
    if (categoria) {
      setCategoriaActual(categoria);
      setModoEdicion(true);
    } else {
      resetForm();
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Delete category
  const handleDelete = async (id) => {
    if (!await verifyTokenAndProceed()) return;
    if (!window.confirm("¿Está seguro de eliminar esta categoría?")) return;

    try {
      setLoading(true);
      await api.delete(`/categorias/${id}`);
      await fetchCategorias();
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.error || "Error al eliminar la categoría");
      }
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

  // Filter categories
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Gestión de Categorías</h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las categorías del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            onClick={() => openModal()}
            aria-label="Nueva categoría"
          >
            <FaPlus size={14} style={{ marginRight: adminStyles.spacing.xs }} />
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
        <div style={styles.searchContainer}>
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
        </div>        {/* Table */}
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
            <p style={adminStyles.containers.emptyStateSubtext}>
              {searchTerm ? "Intenta con otros términos de búsqueda" : "¡Agrega una nueva categoría para comenzar!"}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
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
                        />
                      ) : (
                        <div style={styles.imagePlaceholder}>
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
                      <div style={styles.actionsContainer}>
                        <button
                          style={adminStyles.combineStyles(
                            styles.actionButton,
                            styles.editAction
                          )}
                          onClick={() => openModal(categoria)}
                          title="Editar categoría"
                          disabled={loading}
                          aria-label={`Editar categoría ${categoria.nombre}`}
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
        )}        {/* Modal */}
        {modalVisible && (
          <div 
            style={styles.modalOverlay}
            className="modal"
            onClick={(e) => e.target.classList.contains('modal') && closeModal()}
          >
            <div style={styles.modalContent}>
              <div style={styles.modalBody}>
                <button
                  style={styles.modalCloseButton}
                  onClick={closeModal}
                  aria-label="Cerrar modal"
                >
                  ✗
                </button>
                <h2 style={styles.modalTitle}>
                  {modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
                </h2>

                {error && (
                  <div style={styles.error}>
                    {error}
                  </div>
                )}

                <form style={styles.formContainer} onSubmit={handleSubmit}>
                  <div style={styles.formGroup}>
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

                  <div style={styles.formGroup}>
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

                  <div style={styles.formGroup}>
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

                  <div style={styles.modalActions}>
                    <button
                      type="button"
                      onClick={closeModal}
                      style={styles.outlineButton}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={adminStyles.combineStyles(
                        styles.primaryButton,
                        loading ? styles.disabledButton : {}
                      )}
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
                          <FaSave style={{ marginRight: adminStyles.spacing.xs }} />
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
    </div>
  );
};

export default GestionCategorias;