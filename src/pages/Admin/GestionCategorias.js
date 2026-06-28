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
  FaLock,
} from "react-icons/fa";
import stylesGlobal from "../../styles/stylesGlobal";
import adminTheme from "../../styles/adminTheme";

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

      .cards-thead { display: none !important; }
      .cards-row { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
      .cards-actions { justify-content: flex-start !important; }
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
      backgroundColor: adminTheme.bg,
      minHeight: "100vh",
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
    title: {
      fontFamily: stylesGlobal.typography.families.display,
      fontSize: "1.9rem",
      fontWeight: 700,
      color: stylesGlobal.colors.text.primary,
    },
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
    // --- Tarjetas de resumen (stat cards) ---
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: stylesGlobal.spacing.scale[5],
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    statCard: {
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.xl,
      padding: `${stylesGlobal.spacing.scale[5]} ${stylesGlobal.spacing.scale[6]}`,
      boxShadow: stylesGlobal.shadows.sm,
    },
    statLabel: {
      color: stylesGlobal.colors.text.tertiary,
      fontSize: stylesGlobal.typography.scale.sm,
      fontWeight: stylesGlobal.typography.weights.medium,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    statValue: {
      fontFamily: adminTheme.serif,
      fontSize: "2rem",
      fontWeight: 700,
      lineHeight: 1,
      color: stylesGlobal.colors.text.primary,
    },
    // --- Galería de categorías (tarjetas) ---
    mediaGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
      gap: stylesGlobal.spacing.scale[5],
    },
    mediaCard: {
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.xl,
      overflow: "hidden",
      boxShadow: stylesGlobal.shadows.sm,
      display: "flex",
      flexDirection: "column",
    },
    mediaThumbWrap: {
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 9",
      backgroundColor: stylesGlobal.colors.neutral[100],
      overflow: "hidden",
    },
    mediaThumbImg: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block",
    },
    mediaThumbFallback: {
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: stylesGlobal.colors.gradients.primary,
      color: stylesGlobal.colors.text.inverse,
      fontFamily: adminTheme.serif,
      fontWeight: 700,
      fontSize: "40px",
    },
    mediaBody: {
      padding: stylesGlobal.spacing.scale[5],
      display: "flex",
      flexDirection: "column",
      gap: stylesGlobal.spacing.scale[2],
      flex: 1,
    },
    mediaTitle: {
      fontFamily: adminTheme.serif,
      fontSize: stylesGlobal.typography.scale.lg,
      fontWeight: 700,
      color: stylesGlobal.colors.text.primary,
      margin: 0,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    mediaDesc: {
      color: stylesGlobal.colors.text.secondary,
      fontSize: stylesGlobal.typography.scale.sm,
      lineHeight: 1.5,
      margin: 0,
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      overflow: "hidden",
      minHeight: "2.6em",
    },
    mediaFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: stylesGlobal.spacing.scale[2],
      marginTop: "auto",
      paddingTop: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.colors.neutral[200]}`,
    },
    // --- Lista de categorías como tarjetas por fila ---
    cardThead: {
      display: "grid",
      gridTemplateColumns: "2.4fr 3fr 1fr",
      gap: stylesGlobal.spacing.scale[4],
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[5]}`,
      color: stylesGlobal.colors.text.tertiary,
      fontSize: stylesGlobal.typography.scale.xs,
      fontWeight: stylesGlobal.typography.weights.semibold,
      textTransform: "uppercase",
      letterSpacing: stylesGlobal.typography.tracking.wide,
    },
    cardRow: {
      display: "grid",
      gridTemplateColumns: "2.4fr 3fr 1fr",
      gap: stylesGlobal.spacing.scale[4],
      alignItems: "center",
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[5]}`,
      marginBottom: stylesGlobal.spacing.scale[3],
      boxShadow: stylesGlobal.shadows.sm,
    },
    cardCell: {
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[4],
      minWidth: 0,
    },
    cardThumb: {
      width: "52px",
      height: "52px",
      borderRadius: stylesGlobal.borders.radius.md,
      background: stylesGlobal.colors.gradients.primary,
      color: stylesGlobal.colors.text.inverse,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: adminTheme.serif,
      fontWeight: 700,
      fontSize: "18px",
      flexShrink: 0,
    },
    cardThumbImg: {
      width: "52px",
      height: "52px",
      borderRadius: stylesGlobal.borders.radius.md,
      objectFit: "cover",
      flexShrink: 0,
    },
    cardName: {
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.primary,
      fontSize: stylesGlobal.typography.scale.base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    cardText: {
      color: stylesGlobal.colors.text.secondary,
      fontSize: stylesGlobal.typography.scale.sm,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    cardActions: {
      display: "flex",
      gap: stylesGlobal.spacing.scale[2],
      justifyContent: "flex-end",
    },
    cardAct: {
      width: "36px",
      height: "36px",
      borderRadius: stylesGlobal.borders.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
      transition: stylesGlobal.animations.transitions.base,
    },
    cardActEdit: {
      backgroundColor: stylesGlobal.colors.accent[50],
      color: stylesGlobal.colors.accent[600],
    },
    cardActDel: {
      backgroundColor: stylesGlobal.colors.primary[50],
      color: stylesGlobal.colors.primary[500],
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

  // Métricas reales para las tarjetas de resumen (la tienda no liga productos a
  // categorías ni maneja estados, así que solo mostramos datos que sí existen)
  const totalCategorias = categorias.length;
  const conImagen = categorias.filter((c) => c.imagenURL).length;
  const conDescripcion = categorias.filter((c) => c.descripcion && c.descripcion.trim()).length;

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
              Organiza tus colecciones artesanales
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

        {/* Tarjetas de resumen (datos reales) */}
        <div style={styles.statGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total de categorías</div>
            <div style={styles.statValue}>{totalCategorias}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Con imagen</div>
            <div style={styles.statValue}>{conImagen}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Con descripción</div>
            <div style={styles.statValue}>{conDescripcion}</div>
          </div>
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
          <div style={styles.mediaGrid}>
            {filteredCategorias.map((categoria) => (
              <div key={categoria._id} style={styles.mediaCard}>
                <div style={styles.mediaThumbWrap}>
                  {categoria.imagenURL ? (
                    <img
                      src={categoria.imagenURL}
                      alt={categoria.nombre}
                      style={styles.mediaThumbImg}
                    />
                  ) : (
                    <div style={styles.mediaThumbFallback}>
                      {(categoria.nombre || "C")[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div style={styles.mediaBody}>
                  <h3 style={styles.mediaTitle}>{categoria.nombre}</h3>
                  <p style={styles.mediaDesc}>
                    {categoria.descripcion || "Sin descripción"}
                  </p>
                  <div style={styles.mediaFooter}>
                    <button
                      style={{ ...styles.cardAct, ...styles.cardActEdit }}
                      onClick={() => openModal(categoria)}
                      title="Editar categoría"
                      disabled={loading}
                      aria-label={`Editar categoría ${categoria.nombre}`}
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      style={{ ...styles.cardAct, ...styles.cardActDel }}
                      onClick={() => handleDelete(categoria._id)}
                      title="Eliminar categoría"
                      disabled={loading}
                      aria-label={`Eliminar categoría ${categoria.nombre}`}
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
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