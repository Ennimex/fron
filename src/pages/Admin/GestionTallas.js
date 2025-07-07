import { useState, useEffect, useCallback } from "react";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaSearch,
  FaLock
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import stylesGlobal from "../../styles/stylesGlobal";

// Importar los nuevos servicios
import { tallaService, categoriaService } from "../../services";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";

// Estilos CSS responsivos para GestionTallas
const responsiveStyles = `
  @media (max-width: 768px) {
    .tallas-container {
      padding: 1rem !important;
    }
    
    .tallas-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 1rem !important;
    }
    
    .tallas-title {
      font-size: 1.5rem !important;
      text-align: center !important;
    }
    
    .tallas-add-btn {
      align-self: center !important;
      width: fit-content !important;
    }
    
    .tallas-controls {
      flex-direction: column !important;
      gap: 1rem !important;
    }
    
    .tallas-search {
      width: 100% !important;
    }
    
    .tallas-cards {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
    
    .tallas-card {
      margin: 0 !important;
    }
    
    .tallas-card-header {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 0.75rem !important;
    }
    
    .tallas-card-title {
      text-align: center !important;
      font-size: 1.125rem !important;
    }
    
    .tallas-grid {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
    }
    
    .tallas-item {
      padding: 0.75rem !important;
    }
    
    .tallas-item-content {
      flex-direction: column !important;
      align-items: stretch !important;
      gap: 0.5rem !important;
    }
    
    .tallas-item-actions {
      justify-content: center !important;
      gap: 0.5rem !important;
    }
    
    .tallas-form {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
  }

  @media (max-width: 480px) {
    .tallas-container {
      padding: 0.75rem !important;
    }
    
    .tallas-title {
      font-size: 1.25rem !important;
    }
    
    .tallas-card {
      border-radius: 0.5rem !important;
    }
    
    .tallas-item {
      padding: 0.5rem !important;
    }
    
    .tallas-item-actions button {
      padding: 0.375rem 0.75rem !important;
      font-size: 0.75rem !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-tallas-styles]')) {
    styleElement.setAttribute('data-tallas-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const GestionTallas = () => {
  const { user, isAuthenticated } = useAuth();
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();

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
    filtersContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: stylesGlobal.spacing.gaps.lg,
      alignItems: 'end',
      padding: stylesGlobal.spacing.scale[4],
    },
    searchContainer: {
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: stylesGlobal.spacing.scale[3],
      top: '50%',
      transform: 'translateY(-50%)',
      color: stylesGlobal.colors.text.muted,
    },
    searchInput: {
      ...stylesGlobal.components.input.base,
      paddingLeft: stylesGlobal.spacing.scale[10],
    },
    filterSelect: stylesGlobal.components.input.base,
    totalCounter: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.muted,
      textAlign: 'right',
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
    tableHeaderRight: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.secondary,
      padding: stylesGlobal.spacing.scale[3],
      textAlign: 'right',
      backgroundColor: stylesGlobal.colors.surface.tertiary,
    },
    tableCell: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    tableCellBold: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
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
    tableCellLast: {
      ...stylesGlobal.typography.body.base,
      padding: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderBottom: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRight: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderTopRightRadius: stylesGlobal.borders.radius.sm,
      borderBottomRightRadius: stylesGlobal.borders.radius.sm,
      textAlign: 'right',
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
    modalOverlay: {
      ...stylesGlobal.utils.overlay.base,
      ...stylesGlobal.utils.overlay.elegant,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: stylesGlobal.utils.zIndex.modal,
    },
    modalContent: {
      ...stylesGlobal.components.card.luxury,
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto',
      position: 'relative',
      margin: '0 20px',
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      zIndex: stylesGlobal.utils.zIndex.modal + 1,
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    modalTitle: stylesGlobal.typography.headings.h2,
    modalCloseButton: {
      ...stylesGlobal.components.button.variants.ghost,
      ...stylesGlobal.components.button.sizes.xs,
    },
    modalBody: {
      padding: stylesGlobal.spacing.scale[6],
    },
    modalActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: stylesGlobal.spacing.gaps.md,
      marginTop: stylesGlobal.spacing.scale[6],
      paddingTop: stylesGlobal.spacing.scale[4],
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    formContainer: {
      width: '100%',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: stylesGlobal.spacing.gaps.lg,
      marginBottom: stylesGlobal.spacing.scale[6],
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
    charCount: {
      ...stylesGlobal.typography.body.caption,
      color: stylesGlobal.colors.text.muted,
      marginLeft: stylesGlobal.spacing.scale[2],
    },
    input: stylesGlobal.components.input.base,
    select: {
      ...stylesGlobal.components.input.base,
      cursor: 'pointer',
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
    loadingSpinner: {
      animation: 'spin 1s linear infinite',
      marginRight: stylesGlobal.spacing.scale[2],
    },
    flexBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
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

  // Main states
  const [tallas, setTallas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tallaActual, setTallaActual] = useState({
    _id: "",
    categoriaId: "",
    genero: "Unisex",
    talla: "",
    rangoEdad: "",
    medida: "",
  });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState({
    table: true,
    form: false,
    categorias: true,
  });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({
    genero: "",
    categoria: "",
  });

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tallasRes, categoriasRes] = await Promise.all([
          tallaService.getAll(),
          categoriaService.getAll(),
        ]);
        setTallas(tallasRes);
        setCategorias(categoriasRes);
      } catch (err) {
        const errorMsg = err.error || err.message || "Error al cargar datos";
        setError(errorMsg);
        addNotification(errorMsg, 'error');
      } finally {
        setLoading({
          table: false,
          form: false,
          categorias: false,
        });
      }
    };

    fetchData();
  }, [addNotification]);

  // Reset form
  const resetForm = useCallback(() => {
    setTallaActual({
      _id: "",
      categoriaId: "",
      genero: "Unisex",
      talla: "",
      rangoEdad: "",
      medida: "",
    });
    setModoEdicion(false);
    setError(null);
  }, []);

  // Modal controls
  const closeModal = useCallback(() => {
    setModalVisible(false);
    resetForm();
    
    // Retornar el foco al botón que abrió el modal
    setTimeout(() => {
      const addButton = document.querySelector('button[aria-label="Nueva talla"]');
      if (addButton) {
        addButton.focus();
      }
    }, 100);
  }, [resetForm]);

  // Manejo de tecla Escape para cerrar modal
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && modalVisible) {
        closeModal();
      }
    };

    if (modalVisible) {
      document.addEventListener('keydown', handleEscape);
      // Bloquear scroll del body cuando el modal está abierto
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [modalVisible, closeModal]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTallaActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };



  // Save or update size
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar con el nuevo servicio
    const validation = tallaService.validate(tallaActual);
    if (!validation.isValid) {
      setError(validation.errors.join(', '));
      return;
    }

    try {
      setLoading({ ...loading, form: true });
      const tallaData = {
        ...tallaActual,
        categoriaId: tallaActual.categoriaId?._id || tallaActual.categoriaId,
      };

      if (modoEdicion) {
        await tallaService.update(tallaData._id, tallaData);
        // Agregar notificación de éxito para actualización
        const categoria = categorias.find(c => c._id === tallaData.categoriaId);
        const msg = `Talla "${tallaData.talla}" de la categoría "${categoria?.nombre || 'N/A'}" actualizada exitosamente`;
        addNotification(msg, 'success');
      } else {
        await tallaService.create(tallaData);
        // Agregar notificación de éxito para creación
        const categoria = categorias.find(c => c._id === tallaData.categoriaId);
        const msg = `Nueva talla "${tallaData.talla}" creada en la categoría "${categoria?.nombre || 'N/A'}"`;
        addNotification(msg, 'success');
      }

      await fetchTallas();
      closeModal();
      setError(null);
    } catch (err) {
      const errorMsg = err.error || err.message || `Error al ${modoEdicion ? "actualizar" : "crear"} la talla`;
      setError(errorMsg);
      // Agregar notificación de error
      addNotification(errorMsg, 'error');
    } finally {
      setLoading({ ...loading, form: false });
    }
  };

  // Reload sizes
  const fetchTallas = async () => {
    try {
      setLoading({ ...loading, table: true });
      const response = await tallaService.getAll();
      setTallas(response);
    } catch (err) {
      const errorMsg = err.error || err.message || "Error al cargar tallas";
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setLoading({ ...loading, table: false });
    }
  };

  // Modal controls
  const openModal = (talla = null) => {
    if (talla) {
      setTallaActual(talla);
      setModoEdicion(true);
    } else {
      resetForm();
      setModoEdicion(false);
    }
    
    setModalVisible(true);
    setError(null); // Limpiar errores previos
    
    // Enfocar el primer campo del formulario después de que se abra el modal
    setTimeout(() => {
      const firstInput = document.querySelector('select[name="categoriaId"]');
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  };

  // Edit and delete
  const handleEdit = (talla) => {
    openModal(talla);
  };

  const handleDelete = async (id) => {
    // Encontrar la talla que se va a eliminar para mostrar información en la notificación
    const tallaAEliminar = tallas.find(t => t._id === id);
    const confirmMessage = tallaAEliminar 
      ? `¿Está seguro de eliminar la talla "${tallaAEliminar.talla}" de la categoría "${getCategoriaNombre(tallaAEliminar.categoriaId)}"?`
      : "¿Está seguro de eliminar esta talla?";
    
    if (!window.confirm(confirmMessage)) return;

    try {
      setLoading({ ...loading, table: true });
      await tallaService.delete(id);
      
      // Agregar notificación de éxito
      if (tallaAEliminar) {
        const msg = `Talla "${tallaAEliminar.talla}" eliminada exitosamente`;
        addNotification(msg, 'success');
      }
      
      await fetchTallas();
      setError(null);
    } catch (err) {
      const errorMsg = err.error || err.message || "Error al eliminar la talla";
      setError(errorMsg);
      // Agregar notificación de error
      addNotification(errorMsg, 'error');
    } finally {
      setLoading({ ...loading, table: false });
    }
  };

  // Filter sizes using new service
  const filteredTallas = tallaService.filter(tallas, {
    search: searchTerm,
    genero: filters.genero,
    categoria: filters.categoria
  });

  // Get category name
  const getCategoriaNombre = (id) => {
    const categoryId = typeof id === "object" && id !== null ? id._id : id;
    const categoria = categorias.find((c) => c._id === categoryId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  // Get range or measure
  const getRangoOMedida = (talla) => {
    return talla.rangoEdad || talla.medida || "-";
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Check if user is authenticated and has admin role
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
              Gestión de Tallas
            </h1>
            <p style={styles.subtitle}>
              Administra y supervisa todas las tallas del sistema
            </p>
          </div>
          <button
            style={styles.addButton}
            onClick={() => openModal()}
            aria-label="Nueva talla"
            type="button"
          >
            <FaPlus size={14} style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
            Nueva Talla
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Filter Container */}
        <div style={styles.filtersContainer}>
          <div>
            <label style={styles.label}>Buscar</label>
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                type="text"
                placeholder="Buscar tallas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Género</label>
            <select
              name="genero"
              value={filters.genero}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">Todos</option>
              <option value="Unisex">Unisex</option>
              <option value="Niño">Niño</option>
              <option value="Niña">Niña</option>
              <option value="Dama">Dama</option>
              <option value="Caballero">Caballero</option>
            </select>
          </div>

          <div>
            <label style={styles.label}>Categoría</label>
            <select
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
              style={styles.filterSelect}
            >
              <option value="">Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.totalCounter}>
            Total: {filteredTallas.length} tallas
          </div>
        </div>

        {/* Table Container */}
        {loading.table || loading.categorias ? (
          <div style={styles.loadingContainer}>
            <FaSpinner style={styles.loadingSpinner} />
            <div style={styles.textCenter}>
              <h3 style={stylesGlobal.typography.headings.h3}>Cargando tallas...</h3>
            </div>
          </div>
        ) : filteredTallas.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>
              {searchTerm ? "No se encontraron tallas" : "No hay tallas registradas"}
            </h3>
            <p style={stylesGlobal.typography.body.base}>
              {searchTerm ? "Intenta con otros términos de búsqueda" : "¡Agrega una nueva talla para comenzar!"}
            </p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Categoría</th>
                  <th style={styles.tableHeader}>Talla</th>
                  <th style={styles.tableHeader}>Género</th>
                  <th style={styles.tableHeader}>Rango/Medida</th>
                  <th style={styles.tableHeaderRight}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTallas.map((talla) => (
                  <tr key={talla._id}>
                    <td style={styles.tableCellFirst}>{getCategoriaNombre(talla.categoriaId)}</td>
                    <td style={styles.tableCellBold}>{talla.talla}</td>
                    <td style={styles.tableCell}>{talla.genero}</td>
                    <td style={styles.tableCell}>{getRangoOMedida(talla)}</td>
                    <td style={styles.tableCellLast}>
                      <div style={styles.actionsContainer}>
                        <button
                          onClick={() => handleEdit(talla)}
                          style={{
                            ...styles.actionButton,
                            ...styles.editAction,
                          }}
                          title="Editar talla"
                          disabled={loading.form}
                          aria-label={`Editar talla ${talla.talla}`}
                        >
                          <FaEdit size={12} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(talla._id)}
                          style={{
                            ...styles.actionButton,
                            ...styles.deleteAction,
                          }}
                          title="Eliminar talla"
                          disabled={loading.table}
                          aria-label={`Eliminar talla ${talla.talla}`}
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
                closeModal();
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
              maxWidth: '700px',
              width: '90%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}>
              <div style={styles.modalBody}>
                <div style={styles.modalHeader}>
                  <h3 id="modal-title" style={styles.modalTitle}>
                    {modoEdicion ? "Editar Talla" : "Nueva Talla"}
                  </h3>
                  <button
                    onClick={closeModal}
                    style={styles.modalCloseButton}
                    aria-label="Cerrar modal"
                    type="button"
                  >
                    <FaTimes />
                  </button>
                </div>

                <form onSubmit={handleSubmit} style={styles.formContainer}>
                  {error && (
                    <div style={styles.error}>
                      {error}
                    </div>
                  )}

                  <div style={styles.formGrid}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Categoría
                        <span style={styles.requiredField}>*</span>
                      </label>
                      <select
                        name="categoriaId"
                        value={tallaActual.categoriaId?._id || tallaActual.categoriaId || ""}
                        onChange={handleChange}
                        style={styles.select}
                        required
                        disabled={loading.categorias}
                      >
                        <option value="">Seleccione una categoría</option>
                        {categorias.map((categoria) => (
                          <option key={categoria._id} value={categoria._id}>
                            {categoria.nombre}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Talla
                        <span style={styles.requiredField}>*</span>
                        <span style={styles.charCount}>
                          ({tallaActual.talla.length}/20)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="talla"
                        value={tallaActual.talla}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        disabled={loading.form}
                        maxLength={20}
                        minLength={1}
                        placeholder="Ej: S, M, L, XL, 38, 40..."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Género
                        <span style={styles.requiredField}>*</span>
                      </label>
                      <select
                        name="genero"
                        value={tallaActual.genero}
                        onChange={handleChange}
                        style={styles.select}
                        required
                        disabled={loading.form}
                      >
                        <option value="Unisex">Unisex</option>
                        <option value="Niño">Niño</option>
                        <option value="Niña">Niña</option>
                        <option value="Dama">Dama</option>
                        <option value="Caballero">Caballero</option>
                      </select>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Rango de edad
                        <span style={styles.charCount}>
                          ({tallaActual.rangoEdad?.length || 0}/30)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="rangoEdad"
                        value={tallaActual.rangoEdad}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading.form}
                        maxLength={30}
                        placeholder="Ej: 2-4 años"
                      />
                      <small style={stylesGlobal.typography.body.caption}>
                        Opcional: Especifica el rango de edad recomendado para esta talla.
                      </small>
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>
                        Medida
                        <span style={styles.charCount}>
                          ({tallaActual.medida?.length || 0}/30)
                        </span>
                      </label>
                      <input
                        type="text"
                        name="medida"
                        value={tallaActual.medida}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading.form}
                        maxLength={30}
                        placeholder="Ej: 90cm, 32 pulgadas"
                      />
                      <small style={stylesGlobal.typography.body.caption}>
                        Opcional: Proporciona medidas específicas para esta talla.
                      </small>
                    </div>
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
                      style={{
                        ...styles.primaryButton,
                        ...(loading.form ? styles.disabledButton : {}),
                      }}
                      disabled={loading.form}
                      aria-label={modoEdicion ? "Actualizar talla" : "Crear talla"}
                    >
                      {loading.form ? (
                        <>
                          <FaSpinner style={styles.loadingSpinner} />
                          {modoEdicion ? "Actualizando..." : "Guardando..."}
                        </>
                      ) : (
                        <>
                          <FaSave style={{ marginRight: stylesGlobal.spacing.scale[1] }} />
                          {modoEdicion ? "Actualizar" : "Guardar"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Contenedor de notificaciones */}
        <NotificationContainer
          notifications={notifications}
          onRemoveNotification={removeNotification}
          onClearAll={clearAllNotifications}
        />
      </div>
    </div>
  );
};

export default GestionTallas;