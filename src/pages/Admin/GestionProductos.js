import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import adminService from "../../services/adminServices";
import { useAuth } from "../../context/AuthContext";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import stylesPublic from "../../styles/stylesGlobal"; // Importamos los estilos globales

// Estilos CSS responsivos para GestionProductos
const responsiveStyles = `
  @media (max-width: 768px) {
    .productos-container {
      border-radius: 0 !important;
      margin: 0 !important;
    }
    
    .productos-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 1rem !important;
      padding: 1rem !important;
    }
    
    .productos-header-content {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 0.75rem !important;
    }
    
    .productos-title {
      font-size: 1.25rem !important;
      text-align: center !important;
    }
    
    .productos-add-btn {
      align-self: center !important;
      width: fit-content !important;
    }
    
    .productos-content {
      padding: 1rem !important;
    }
    
    .productos-filters {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .productos-table-container {
      overflow-x: auto !important;
      margin: 0 -1rem !important;
      padding: 0 1rem !important;
    }
    
    .productos-table {
      min-width: 800px !important;
    }
    
    .productos-table th,
    .productos-table td {
      padding: 0.5rem !important;
      font-size: 0.875rem !important;
    }
    
    .productos-actions {
      flex-direction: column !important;
      gap: 0.25rem !important;
      align-items: stretch !important;
    }
    
    .productos-action-btn {
      justify-content: center !important;
      font-size: 0.75rem !important;
      padding: 0.375rem 0.75rem !important;
    }
    
    .productos-search-filter {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
  }

  @media (max-width: 480px) {
    .productos-header {
      padding: 0.75rem !important;
    }
    
    .productos-title {
      font-size: 1.125rem !important;
    }
    
    .productos-content {
      padding: 0.75rem !important;
    }
    
    .productos-modal-content {
      margin: 0.5rem !important;
      width: calc(100% - 1rem) !important;
      max-height: calc(100vh - 1rem) !important;
    }
    
    .productos-modal-body {
      padding: 1rem !important;
      padding-top: 3rem !important;
    }
    
    .productos-form-row {
      flex-direction: column !important;
      gap: 1rem !important;
    }
    
    .productos-modal-actions {
      flex-direction: column !important;
      gap: 0.75rem !important;
    }
    
    .productos-tallas-grid {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
    
    .productos-talla-group {
      margin-bottom: 1rem !important;
    }
    
    .productos-talla-checkboxes {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 0.5rem !important;
    }
    
    .productos-image-preview {
      max-width: 100% !important;
      height: auto !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-productos-styles]')) {
    styleElement.setAttribute('data-productos-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const GestionProductos = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Estados para datos
  const [localidades, setLocalidades] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estados para UI
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Hook de notificaciones del componente
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();
  
  // Crear una referencia estable para addNotification
  const addNotificationRef = useRef(addNotification);
  useEffect(() => {
    addNotificationRef.current = addNotification;
  }, [addNotification]);

  // Suscribirse a las notificaciones de adminService
  useEffect(() => {
    const unsubscribe = adminService.onNotification((notification) => {
      addNotification(notification.message, notification.type, notification.duration);
    });

    return unsubscribe;
  }, [addNotification]);

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    localidadId: "",
    tipoTela: "",
    tallasDisponibles: [],
  });

  // Verificar autenticación y rol
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
    if (user.role !== "admin") {
      navigate("/no-autorizado");
    }
  }, [user, navigate, location]);

  // Función para cargar productos
  const fetchProductos = async () => {
    try {
      const response = await adminService.getProductos();
      setProductos(response);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      // Solo actualizamos el estado local de error para el UI
      setError(err.message || "Error al cargar los productos");
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      if (!user?.token || user.role !== "admin") return;

      try {
        setLoading(true);
        setError(null);

        const [locResponse, tallasResponse, productosResponse] = await Promise.all([
          adminService.getLocalidades(),
          adminService.getTallas(),
          adminService.getProductos(),
        ]);

        setLocalidades(locResponse);
        setTallas(tallasResponse);
        setProductos(productosResponse);
      } catch (err) {
        // adminService ya maneja las notificaciones de error
        // Solo actualizamos el estado local de error para el UI
        setError(err.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.token, user?.role]);

  // Manejadores de eventos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTallaChange = (tallaId) => {
    setProducto((prev) => {
      const exists = prev.tallasDisponibles.some((t) => t._id === tallaId);
      if (exists) {
        return {
          ...prev,
          tallasDisponibles: prev.tallasDisponibles.filter((t) => t._id !== tallaId),
        };
      } else {
        const talla = tallas.find((t) => t._id === tallaId);
        return {
          ...prev,
          tallasDisponibles: [...prev.tallasDisponibles, talla],
        };
      }
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      const errorMessage = "Por favor, selecciona un archivo de imagen válido";
      setError(errorMessage);
      addNotificationRef.current(errorMessage, 'error', 5000);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      const errorMessage = "La imagen no debe exceder los 5MB";
      setError(errorMessage);
      addNotificationRef.current(errorMessage, 'error', 5000);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    if (!producto.nombre.trim()) {
      setError("El nombre del producto es obligatorio");
      return false;
    }
    
    if (producto.nombre.trim().length < 3) {
      setError("El nombre debe tener al menos 3 caracteres");
      return false;
    }
    
    if (producto.nombre.trim().length > 100) {
      setError("El nombre no puede exceder los 100 caracteres");
      return false;
    }
    
    if (!producto.descripcion.trim()) {
      setError("La descripción del producto es obligatoria");
      return false;
    }
    
    if (producto.descripcion.trim().length < 10) {
      setError("La descripción debe tener al menos 10 caracteres");
      return false;
    }
    
    if (producto.descripcion.trim().length > 500) {
      setError("La descripción no puede exceder los 500 caracteres");
      return false;
    }
    
    if (!producto.localidadId) {
      setError("Debe seleccionar una localidad");
      return false;
    }
    
    if (!producto.tipoTela.trim()) {
      setError("El tipo de tela es obligatorio");
      return false;
    }
    
    if (producto.tipoTela.trim().length > 50) {
      setError("El tipo de tela no puede exceder los 50 caracteres");
      return false;
    }
    
    if (producto.tallasDisponibles.length === 0) {
      setError("Selecciona al menos una talla disponible");
      return false;
    }
    
    const imageInput = document.querySelector('input[type="file"]');
    if (!isEditMode && !imagePreview && !imageInput.files[0]) {
      setError("La imagen del producto es obligatoria");
      return false;
    }
    
    if (imageInput.files[0]) {
      const file = imageInput.files[0];
      
      if (!file.type.match("image.*")) {
        setError("Por favor, selecciona un archivo de imagen válido");
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError("La imagen no debe exceder los 5MB");
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      if (isEditMode && producto._id) {
        formData.append("_id", producto._id);
      }
      
      formData.append("nombre", producto.nombre);
      formData.append("descripcion", producto.descripcion);
      formData.append("localidadId", producto.localidadId);
      formData.append("tipoTela", producto.tipoTela);
      
      producto.tallasDisponibles.forEach((t) => {
        formData.append("tallasDisponibles[]", t._id);
      });

      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput.files[0]) {
        formData.append("imagen", imageInput.files[0]);
      }

      let response;
      if (isEditMode) {
        response = await adminService.updateProducto(producto._id, formData);
      } else {
        response = await adminService.createProducto(formData);
      }

      if (response) {
        // adminService ya maneja las notificaciones de éxito automáticamente
        // Solo actualizamos el estado local
        const newProduct = response.producto || response;
        if (isEditMode) {
          setProductos((prev) =>
            prev.map((p) => (p._id === producto._id ? newProduct : p))
          );
        } else {
          await fetchProductos();
        }
        
        setProducto({
          nombre: "",
          descripcion: "",
          localidadId: "",
          tipoTela: "",
          tallasDisponibles: [],
        });
        setImagePreview(null);
        setShowModal(false);
        setIsEditMode(false);
        setError(null);
      }
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      // Solo actualizamos el estado local de error para el UI
      setError(err?.error || err?.message || `Error al ${isEditMode ? "actualizar" : "crear"} el producto`);
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEditProduct = (product) => {
    setProducto({
      _id: product._id,
      nombre: product.nombre || "",
      descripcion: product.descripcion || "",
      localidadId: product.localidadId?._id || product.localidadId || "",
      tipoTela: product.tipoTela || "",
      tallasDisponibles: product.tallasDisponibles || [],
    });
    setImagePreview(product.imagenURL || null);
    setIsEditMode(true);
    setError(null);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    setError(null);

    try {
      // adminService ya maneja las notificaciones de éxito automáticamente
      await adminService.deleteProducto(productId);
      
      // Solo actualizamos el estado local
      setProductos((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      // Solo actualizamos el estado local de error para el UI
      setError(err?.error || err?.message || "Error al eliminar el producto");
    }
  };

  // Filtrar productos
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch =
      (producto.nombre?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (producto.descripcion?.toLowerCase() || "").includes(searchTerm.toLowerCase());

    const matchesLocalidad =
      !filterLocalidad ||
      (typeof producto.localidadId === "object" && producto.localidadId?._id === filterLocalidad) ||
      producto.localidadId === filterLocalidad;

    return matchesSearch && matchesLocalidad;
  });

  const getLocalidadNombre = (localidadId) => {
    if (typeof localidadId === "object") return localidadId.nombre || "Sin localidad";
    const localidad = localidades.find((l) => l._id === localidadId);
    return localidad?.nombre || "Sin localidad";
  };

  const getProductSizes = (tallasDisponibles) => {
    if (!tallasDisponibles || tallasDisponibles.length === 0) return [];
    return tallasDisponibles.map((t) => ({
      _id: t._id,
      talla: t.talla,
      rangoEdad: t.rangoEdad,
      medida: t.medida,
      genero: t.genero,
    }));
  };

  const groupedTallas = tallas.reduce((acc, talla) => {
    const genero = talla.genero || "Otro";
    if (!acc[genero]) acc[genero] = [];
    acc[genero].push(talla);
    return acc;
  }, {});

  const genderOrder = ["Niño", "Niña", "Dama", "Caballero"];
  const orderedGroupedTallas = Object.entries(groupedTallas).sort(([generoA], [generoB]) => {
    const indexA = genderOrder.indexOf(generoA);
    const indexB = genderOrder.indexOf(generoB);
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  // Estilos basados en stylesPublic con mejoras responsivas
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: stylesPublic.colors.neutral[100],
      padding: stylesPublic.spacing.sections.sm,
      // Responsive padding
      '@media (max-width: 768px)': {
        padding: stylesPublic.spacing.scale[2],
      },
      '@media (max-width: 480px)': {
        padding: stylesPublic.spacing.scale[1],
      },
    },
    container: {
      maxWidth: stylesPublic.utils.container.maxWidth["2xl"],
      margin: "0 auto",
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows.base,
      // Responsive container
      '@media (max-width: 768px)': {
        borderRadius: 0,
        margin: 0,
      },
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: stylesPublic.spacing.scale[6],
      borderBottom: `1px solid ${stylesPublic.colors.neutral[200]}`,
      // Responsive header
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: stylesPublic.spacing.scale[4],
        padding: stylesPublic.spacing.scale[4],
      },
      '@media (max-width: 480px)': {
        padding: stylesPublic.spacing.scale[3],
      },
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      // Responsive header content
      '@media (max-width: 768px)': {
        flexDirection: 'column',
        alignItems: 'stretch',
        gap: stylesPublic.spacing.scale[3],
      },
    },
    title: {
      ...stylesPublic.typography.headings.h1,
      color: stylesPublic.colors.text.primary,
      margin: 0,
      // Responsive title
      '@media (max-width: 768px)': {
        fontSize: '1.5rem',
        textAlign: 'center',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.25rem',
      },
    },
    subtitle: {
      ...stylesPublic.typography.body.small,
      color: stylesPublic.colors.text.tertiary,
      margin: 0,
    },
    addButton: {
      ...stylesPublic.components.button.sizes.base,
      ...stylesPublic.components.button.variants.primary,
      display: "flex",
      alignItems: "center",
    },
    content: {
      padding: stylesPublic.spacing.scale[6],
    },
    error: {
      padding: stylesPublic.spacing.scale[4],
      backgroundColor: stylesPublic.colors.semantic.error.light,
      color: stylesPublic.colors.semantic.error.main,
      borderRadius: stylesPublic.borders.radius.base,
      marginBottom: stylesPublic.spacing.scale[4],
      border: `1px solid ${stylesPublic.colors.semantic.error.main}`,
    },
    success: {
      padding: stylesPublic.spacing.scale[4],
      backgroundColor: stylesPublic.colors.semantic.success.light,
      color: stylesPublic.colors.semantic.success.main,
      borderRadius: stylesPublic.borders.radius.base,
      marginBottom: stylesPublic.spacing.scale[4],
      border: `1px solid ${stylesPublic.colors.semantic.success.main}`,
      display: "flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[2],
    },
    controlsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: stylesPublic.spacing.scale[6],
    },
    searchContainer: {
      display: "flex",
      gap: stylesPublic.spacing.scale[4],
      alignItems: "center",
    },
    searchInput: {
      ...stylesPublic.components.input.base,
      minWidth: "300px",
    },
    filterSelect: {
      ...stylesPublic.components.input.base,
      minWidth: "200px",
    },
    tableContainer: {
      overflowX: "auto",
      borderRadius: stylesPublic.borders.radius.base,
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    tableHeader: {
      backgroundColor: stylesPublic.colors.neutral[100],
    },
    tableHeaderCell: {
      padding: stylesPublic.spacing.scale[4],
      textAlign: "left",
      fontWeight: stylesPublic.typography.weights.semibold,
      color: stylesPublic.colors.text.secondary,
      borderBottom: `1px solid ${stylesPublic.colors.neutral[200]}`,
    },
    tableRow: {
      "&:hover": {
        backgroundColor: stylesPublic.colors.neutral[50],
      },
    },
    tableCell: {
      padding: stylesPublic.spacing.scale[4],
      borderBottom: `1px solid ${stylesPublic.colors.neutral[200]}`,
    },
    actionsContainer: {
      display: "flex",
      gap: stylesPublic.spacing.scale[2],
    },
    emptyState: {
      padding: stylesPublic.spacing.scale[10],
      textAlign: "center",
      color: stylesPublic.colors.text.tertiary,
    },
    emptyStateText: {
      ...stylesPublic.typography.headings.h4,
      marginBottom: stylesPublic.spacing.scale[2],
    },
    emptyStateSubtext: {
      ...stylesPublic.typography.body.base,
    },
    modalOverlay: {
      ...stylesPublic.utils.overlay.base,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    modalContent: {
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.xl,
      width: "90%",
      maxWidth: "800px",
      maxHeight: "90vh",
      overflowY: "auto",
      boxShadow: stylesPublic.shadows.xl,
    },
    modalHeader: {
      padding: stylesPublic.spacing.scale[6],
      borderBottom: `1px solid ${stylesPublic.colors.neutral[200]}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      ...stylesPublic.typography.headings.h3,
      margin: 0,
    },
    modalCloseButton: {
      background: "none",
      border: "none",
      fontSize: stylesPublic.typography.scale["2xl"],
      cursor: "pointer",
      color: stylesPublic.colors.text.tertiary,
      "&:hover": {
        color: stylesPublic.colors.text.primary,
      },
    },
    modalBody: {
      padding: stylesPublic.spacing.scale[6],
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: stylesPublic.spacing.scale[4],
      marginBottom: stylesPublic.spacing.scale[4],
    },
    formGroup: {
      marginBottom: stylesPublic.spacing.scale[4],
    },
    label: {
      ...stylesPublic.typography.body.small,
      fontWeight: stylesPublic.typography.weights.semibold,
      display: "block",
      marginBottom: stylesPublic.spacing.scale[1],
    },
    requiredField: {
      color: stylesPublic.colors.semantic.error.main,
    },
    input: {
      ...stylesPublic.components.input.base,
    },
    select: {
      ...stylesPublic.components.input.base,
    },
    textarea: {
      ...stylesPublic.components.input.base,
      minHeight: "100px",
      resize: "vertical",
    },
    imageUploadArea: {
      border: `2px dashed ${stylesPublic.colors.neutral[300]}`,
      borderRadius: stylesPublic.borders.radius.base,
      padding: stylesPublic.spacing.scale[6],
      textAlign: "center",
      cursor: "pointer",
      transition: stylesPublic.animations.transitions.base,
      "&:hover": {
        borderColor: stylesPublic.colors.primary[500],
      },
    },
    uploadText: {
      ...stylesPublic.typography.body.base,
      fontWeight: stylesPublic.typography.weights.semibold,
    },
    uploadSubtext: {
      ...stylesPublic.typography.body.small,
      color: stylesPublic.colors.text.tertiary,
    },
    fileInput: {
      display: "none",
    },
    previewContainer: {
      marginTop: stylesPublic.spacing.scale[4],
    },
    previewImage: {
      maxWidth: "100%",
      maxHeight: "200px",
      borderRadius: stylesPublic.borders.radius.base,
    },
    tallasSection: {
      marginBottom: stylesPublic.spacing.scale[6],
    },
    tallasContainer: {
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
      borderRadius: stylesPublic.borders.radius.base,
      padding: stylesPublic.spacing.scale[4],
    },
    genderGroup: {
      marginBottom: stylesPublic.spacing.scale[4],
    },
    genderTitle: {
      ...stylesPublic.typography.body.small,
      fontWeight: stylesPublic.typography.weights.semibold,
      marginBottom: stylesPublic.spacing.scale[2],
    },
    sizesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: stylesPublic.spacing.scale[2],
    },
    tallaCheckbox: {
      display: "flex",
      alignItems: "center",
      padding: stylesPublic.spacing.scale[2],
      borderRadius: stylesPublic.borders.radius.sm,
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
      cursor: "pointer",
      transition: stylesPublic.animations.transitions.base,
    },
    tallaCheckboxSelected: {
      backgroundColor: stylesPublic.colors.primary[100],
      borderColor: stylesPublic.colors.primary[500],
      color: stylesPublic.colors.primary[500],
    },
    helpText: {
      ...stylesPublic.typography.body.small,
      color: stylesPublic.colors.text.tertiary,
    },
    progressContainer: {
      marginTop: stylesPublic.spacing.scale[4],
    },
    progressBar: {
      height: "8px",
      backgroundColor: stylesPublic.colors.neutral[200],
      borderRadius: stylesPublic.borders.radius.full,
      overflow: "hidden",
    },
    progressBarFill: {
      height: "100%",
      backgroundColor: stylesPublic.colors.primary[500],
      transition: "width 0.3s ease",
    },
    progressText: {
      ...stylesPublic.typography.body.small,
      textAlign: "center",
      marginTop: stylesPublic.spacing.scale[1],
    },
    submitButton: {
      ...stylesPublic.components.button.sizes.base,
      ...stylesPublic.components.button.variants.primary,
    },
    submitButtonDisabled: {
      opacity: 0.6,
      cursor: "not-allowed",
    },
    badge: {
      display: "inline-block",
      padding: `${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[2]}`,
      borderRadius: stylesPublic.borders.radius.full,
      backgroundColor: stylesPublic.colors.neutral[100],
      color: stylesPublic.colors.text.secondary,
      fontSize: stylesPublic.typography.scale.sm,
      fontWeight: stylesPublic.typography.weights.semibold,
    },
    productImage: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: stylesPublic.borders.radius.sm,
    },
    actionButton: {
      ...stylesPublic.components.button.sizes.sm,
      padding: stylesPublic.spacing.scale[2],
      minWidth: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    editAction: {
      backgroundColor: stylesPublic.colors.semantic.info.main,
      color: stylesPublic.colors.semantic.info.contrast,
      "&:hover": {
        backgroundColor: stylesPublic.colors.semantic.info.dark,
      },
    },
    deleteAction: {
      backgroundColor: stylesPublic.colors.semantic.error.main,
      color: stylesPublic.colors.semantic.error.contrast,
      "&:hover": {
        backgroundColor: stylesPublic.colors.semantic.error.dark,
      },
    },
    viewAction: {
      backgroundColor: stylesPublic.colors.semantic.success.main,
      color: stylesPublic.colors.semantic.success.contrast,
      "&:hover": {
        backgroundColor: stylesPublic.colors.semantic.success.dark,
      },
    },
  };

  // Manejar loading y error
  if (loading && !productos.length && !localidades.length && !tallas.length) {
    return (
      <div style={{ ...styles.pageContainer, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <h3>Cargando datos...</h3>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div style={{ ...styles.pageContainer, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div style={{ textAlign: "center", padding: "2rem", backgroundColor: "#fee2e2", borderRadius: "8px", color: "#991b1b" }}>
          <h3>Error</h3>
          <p>{error}</p>
          <button
            onClick={() => navigate("/login")}
            style={{
              padding: "8px 16px",
              backgroundColor: "#991b1b",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginTop: "1rem",
            }}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container} className="productos-container">
        {/* Header */}
        <div style={styles.header} className="productos-header">
          <div style={styles.headerContent} className="productos-header-content">
            <div>
              <h1 style={styles.title} className="productos-title">Gestión de Productos</h1>
              <p style={styles.subtitle}>Administra tu catálogo de productos</p>
            </div>
            <button
              style={styles.addButton}
              className="productos-add-btn"
              onClick={() => {
                setIsEditMode(false);
                setProducto({
                  nombre: "",
                  descripcion: "",
                  localidadId: "",
                  tipoTela: "",
                  tallasDisponibles: [],
                });
                setImagePreview(null);
                setError(null);
                setShowModal(true);
              }}
            >
              <FaPlus size={14} style={{ marginRight: "8px" }} />
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content} className="productos-content">
          {/* Sistema de notificaciones centralizado */}
          <NotificationContainer
            notifications={notifications}
            onRemoveNotification={removeNotification}
            onClearAll={clearAllNotifications}
          />
          
          {error && <div style={styles.error}>{error}</div>}

          {/* Controles */}
          <div style={styles.controlsContainer} className="productos-filters">
            <div style={styles.searchContainer}>
              <FaSearch style={{ color: stylesPublic.colors.text.tertiary }} size={16} />
              <input
                type="text"
                placeholder="Buscar productos por nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
              <select
                value={filterLocalidad}
                onChange={(e) => setFilterLocalidad(e.target.value)}
                style={styles.filterSelect}
              >
                <option value="">Todas las localidades</option>
                {localidades.map((localidad) => (
                  <option key={localidad._id} value={localidad._id}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ ...stylesPublic.typography.body.small, color: stylesPublic.colors.text.tertiary }}>
              Total: {filteredProducts.length} productos
            </div>
          </div>

          {/* Tabla de productos */}
          {filteredProducts.length > 0 ? (
            <div style={styles.tableContainer} className="productos-table-container">
              <table style={styles.table} className="productos-table">
                <thead style={styles.tableHeader}>
                  <tr>
                    <th style={styles.tableHeaderCell}>Imagen</th>
                    <th style={styles.tableHeaderCell}>Producto</th>
                    <th style={styles.tableHeaderCell}>Localidad</th>
                    <th style={styles.tableHeaderCell}>Tipo de Tela</th>
                    <th style={styles.tableHeaderCell}>Tallas Disponibles</th>
                    <th style={styles.tableHeaderCell}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((producto) => {
                    const productSizes = getProductSizes(producto.tallasDisponibles);
                    return (
                      <tr key={producto._id} style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <img
                            src={producto.imagenURL || "/placeholder.svg"}
                            alt={producto.nombre || "Producto"}
                            style={styles.productImage}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ fontWeight: stylesPublic.typography.weights.semibold }}>
                            {producto.nombre || "Sin nombre"}
                          </div>
                          <div style={{ ...stylesPublic.typography.body.small, color: stylesPublic.colors.text.tertiary }}>
                            {producto.descripcion?.length > 80
                              ? `${producto.descripcion.substring(0, 80)}...`
                              : producto.descripcion || "-"}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.badge}>{getLocalidadNombre(producto.localidadId)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.badge}>{producto.tipoTela || "-"}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                            {productSizes.map((talla) => (
                              <span key={talla._id} style={styles.badge}>
                                {talla.talla}
                                {talla.rangoEdad && ` (${talla.rangoEdad})`}
                                {talla.medida && ` (${talla.medida})`}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionsContainer} className="productos-actions">
                            <button
                              style={{ ...styles.actionButton, ...styles.viewAction }}
                              className="productos-action-btn"
                              onClick={() => setSelectedProduct(producto)}
                              title="Ver detalles"
                            >
                              <FaEye size={14} />
                            </button>
                            <button
                              style={{ ...styles.actionButton, ...styles.editAction }}
                              className="productos-action-btn"
                              onClick={() => handleEditProduct(producto)}
                              title="Editar producto"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              style={{ ...styles.actionButton, ...styles.deleteAction }}
                              className="productos-action-btn"
                              onClick={() => handleDeleteProduct(producto._id)}
                              title="Eliminar producto"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <h3 style={styles.emptyStateText}>
                {searchTerm || filterLocalidad ? "No se encontraron productos" : "No hay productos registrados"}
              </h3>
              <p style={styles.emptyStateSubtext}>
                {searchTerm || filterLocalidad
                  ? "Intenta cambiar los filtros de búsqueda"
                  : "Comienza agregando tu primer producto"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal para crear/editar producto */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div style={styles.modalContent} className="productos-modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{isEditMode ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
              <button onClick={() => setShowModal(false)} style={styles.modalCloseButton}>
                ×
              </button>
            </div>
            <div style={styles.modalBody} className="productos-modal-body">
              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="nombre">
                      Nombre<span style={styles.requiredField}>*</span>
                    </label>
                    <input
                      style={styles.input}
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={producto.nombre}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Nombre del producto"
                      maxLength={100}
                      minLength={3}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="localidadId">
                      Localidad<span style={styles.requiredField}>*</span>
                    </label>
                    <select
                      style={styles.select}
                      id="localidadId"
                      name="localidadId"
                      value={producto.localidadId}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    >
                      <option value="">Seleccionar</option>
                      {localidades.map((localidad) => (
                        <option key={localidad._id} value={localidad._id}>
                          {localidad.nombre}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="tipoTela">
                      Tipo de Tela<span style={styles.requiredField}>*</span>
                    </label>
                    <input
                      style={styles.input}
                      type="text"
                      id="tipoTela"
                      name="tipoTela"
                      value={producto.tipoTela}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Ej: Algodón"
                      maxLength={50}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="descripcion">
                      Descripción<span style={styles.requiredField}>*</span>
                    </label>
                    <textarea
                      style={styles.textarea}
                      id="descripcion"
                      name="descripcion"
                      value={producto.descripcion}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Descripción del producto"
                      maxLength={500}
                      minLength={10}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Imagen{isEditMode ? "" : <span style={styles.requiredField}>*</span>}
                    </label>
                    <div
                      style={styles.imageUploadArea}
                      onClick={() => document.getElementById("imagen").click()}
                    >
                      <div style={styles.uploadText}>{imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}</div>
                      <div style={styles.uploadSubtext}>PNG, JPG (máx. 5MB)</div>
                      <input
                        style={styles.fileInput}
                        type="file"
                        id="imagen"
                        name="imagen"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                      />
                    </div>
                    {imagePreview && (
                      <div style={styles.previewContainer}>
                        <img src={imagePreview} alt="Vista previa" style={styles.previewImage} />
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ ...styles.formGroup, ...styles.tallasSection }}>
                  <label style={styles.label}>
                    Tallas Disponibles<span style={styles.requiredField}>*</span>
                    <span style={styles.helpText}> (Seleccione al menos una)</span>
                  </label>
                  <div style={styles.tallasContainer} className="productos-tallas-grid">
                    {orderedGroupedTallas.map(([genero, sizes]) => (
                      <div key={genero} style={styles.genderGroup} className="productos-talla-group">
                        <h4 style={styles.genderTitle}>{genero}</h4>
                        <div style={styles.sizesGrid} className="productos-talla-checkboxes">
                          {sizes.map((talla) => {
                            const isSelected = producto.tallasDisponibles.some((t) => t._id === talla._id);
                            return (
                              <label
                                key={talla._id}
                                style={isSelected ? { ...styles.tallaCheckbox, ...styles.tallaCheckboxSelected } : styles.tallaCheckbox}
                              >
                                <input
                                  type="checkbox"
                                  id={`talla-${talla._id}`}
                                  checked={isSelected}
                                  onChange={() => handleTallaChange(talla._id)}
                                  disabled={loading}
                                  style={{ marginRight: "8px" }}
                                />
                                {`${talla.talla}${talla.rangoEdad ? ` (${talla.rangoEdad})` : ""}${
                                  talla.medida ? ` (${talla.medida})` : ""
                                }`}
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressBarFill, width: `${uploadProgress}%` }}></div>
                    </div>
                    <div style={styles.progressText}>Subiendo... {uploadProgress}%</div>
                  </div>
                )}

                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }} className="productos-modal-actions">
                  <button
                    type="button"
                    style={{
                      padding: "0.6rem 1.25rem",
                      borderRadius: "4px",
                      border: "1px solid #e2e8f0",
                      backgroundColor: "#f8fafc",
                      color: "#64748b",
                      fontSize: "0.9rem",
                      fontWeight: "500",
                      cursor: "pointer",
                      flex: "1",
                    }}
                    onClick={() => setShowModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...styles.submitButton,
                      ...(loading ? styles.submitButtonDisabled : {}),
                      flex: "2",
                    }}
                    disabled={loading}
                  >
                    {loading ? "Procesando..." : isEditMode ? "Actualizar Producto" : "Guardar Producto"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal para ver producto */}
      {selectedProduct && (
        <div style={styles.modalOverlay} onClick={() => setSelectedProduct(null)}>
          <div style={{ ...styles.modalContent, maxWidth: "700px" }} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Detalles del Producto</h2>
              <button onClick={() => setSelectedProduct(null)} style={styles.modalCloseButton}>
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              <div style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                <div style={{ height: "200px", backgroundColor: "#f8f9fa", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                  <img
                    src={selectedProduct.imagenURL || "/placeholder.svg"}
                    alt={selectedProduct.nombre || "Producto"}
                    style={{ width: "100%", height: "100%", objectFit: "contain" }}
                  />
                </div>

                <div>
                  <h3 style={{ color: "#1e293b", marginBottom: "0.75rem", fontSize: "1.5rem", fontWeight: "700", lineHeight: "1.3" }}>
                    {selectedProduct.nombre || "Sin nombre"}
                  </h3>

                  <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
                    <span style={{ ...styles.badge, backgroundColor: stylesPublic.colors.secondary[100], color: stylesPublic.colors.secondary[600] }}>
                      📍 {getLocalidadNombre(selectedProduct.localidadId)}
                    </span>
                    <span style={{ ...styles.badge, backgroundColor: stylesPublic.colors.accent[100], color: stylesPublic.colors.accent[600] }}>
                      🧵 {selectedProduct.tipoTela || "-"}
                    </span>
                  </div>

                  <div style={{ backgroundColor: "#f8fafc", padding: "1rem", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                    <h4 style={{ color: "#64748b", marginBottom: "0.5rem", fontSize: "0.85rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                      Descripción
                    </h4>
                    <p style={{ color: "#475569", fontSize: "0.95rem", lineHeight: "1.6", margin: 0 }}>
                      {selectedProduct.descripcion || "Sin descripción"}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: "#f8fafc", borderRadius: "8px", padding: "1.5rem", border: "1px solid #e2e8f0" }}>
                <h4 style={{ color: "#1e293b", marginBottom: "1.25rem", fontSize: "1.2rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  📏 Tallas Disponibles
                </h4>

                {orderedGroupedTallas.map(([genero, sizes]) => {
                  const availableSizes = sizes.filter((t) =>
                    selectedProduct.tallasDisponibles?.some((st) => st._id === t._id)
                  );

                  if (availableSizes.length === 0) return null;

                  return (
                    <div key={genero} style={{ marginBottom: "1.5rem" }}>
                      <h5 style={{ color: "#64748b", marginBottom: "0.75rem", fontSize: "0.9rem", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.5px", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span style={{ width: "8px", height: "8px", backgroundColor: "#0D1B2A", borderRadius: "50%" }}></span>
                        {genero}
                      </h5>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                        {availableSizes.map((talla) => (
                          <div
                            key={talla._id}
                            style={{
                              backgroundColor: stylesPublic.colors.primary[500],
                              color: "white",
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              boxShadow: "0 2px 4px rgba(13, 27, 42, 0.2)",
                              border: "1px solid #1a2a44",
                            }}
                          >
                            {talla.talla}
                            {talla.rangoEdad && (
                              <span style={{ opacity: 0.9, fontSize: "0.8rem" }}>
                                {" "}({talla.rangoEdad})
                              </span>
                            )}
                            {talla.medida && (
                              <span style={{ opacity: 0.9, fontSize: "0.8rem" }}>
                                {" "}- {talla.medida}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {selectedProduct.tallasDisponibles?.length === 0 && (
                  <div style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.95rem", fontStyle: "italic", padding: "2rem" }}>
                    No hay tallas disponibles para este producto
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;