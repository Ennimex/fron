import { useState, useEffect, useMemo } from "react";
import axios from "axios";
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
import adminStyles from "../../styles/stylesAdmin";

const GestionTallas = () => {
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
    
    // Estilos de filtros y búsqueda
    filtersContainer: {
      ...adminStyles.containers.content,
      ...adminStyles.forms.formGroup,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: adminStyles.spacing.lg,
      alignItems: 'end',
    },
    searchContainer: {
      position: 'relative',
    },
    searchIcon: {
      position: 'absolute',
      left: '0.75rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: adminStyles.colors.grayLight,
    },
    searchInput: {
      ...adminStyles.forms.input,
      paddingLeft: '2.5rem',
    },
    filterSelect: adminStyles.forms.input,
    totalCounter: {
      ...adminStyles.utilities.flexEnd,
      ...adminStyles.utilities.textRight,
      color: adminStyles.colors.gray,
      fontSize: '0.875rem',
      fontWeight: '500',
    },
      // Estilos de tabla
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
    tableHeaderRight: {
      ...adminStyles.tables.th,
      ...adminStyles.utilities.textRight,
    },
    tableCell: {
      ...adminStyles.tables.td,
      borderTop: `1px solid ${adminStyles.colors.border}`,
      borderBottom: `1px solid ${adminStyles.colors.border}`,
    },    tableCellBold: {
      ...adminStyles.tables.td,
      fontWeight: '500',
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
    tableCellLast: {
      ...adminStyles.tables.td,
      ...adminStyles.utilities.textRight,
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
      maxWidth: '700px',
      maxHeight: '90vh',
      overflow: 'auto',
    },
    modalHeader: {
      ...adminStyles.utilities.flexBetween,
      marginBottom: adminStyles.spacing.xl,
    },
    modalTitle: adminStyles.modalStyles.title,
    modalCloseButton: adminStyles.modalStyles.closeButton,
    modalBody: {
      padding: adminStyles.spacing.xl,
    },
    modalActions: {
      ...adminStyles.modalStyles.actions,
      marginTop: adminStyles.spacing.xl,
      paddingTop: adminStyles.spacing.lg,
      borderTop: `1px solid ${adminStyles.colors.border}`,
    },
    
    // Estilos de formulario mejorados
    formContainer: {
      width: '100%',
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: adminStyles.spacing.lg,
      marginBottom: adminStyles.spacing.xl,
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
      fontSize: adminStyles.typography.textXs,
      color: adminStyles.colors.textMuted,
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
    select: {
      ...adminStyles.forms.input,
      width: '100%',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.lg}`,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      cursor: 'pointer',
      backgroundColor: adminStyles.colors.backgroundLight,
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
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
    loadingSpinner: adminStyles.loadingStyles.spinner,
    
    // Utilidades
    flexBetween: adminStyles.utilities.flexBetween,
    textCenter: adminStyles.utilities.textCenter,
    flexCenter: adminStyles.utilities.flexCenter,
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

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tallasRes, categoriasRes] = await Promise.all([
          api.get("/tallas"),
          api.get("/public/categorias"),
        ]);
        setTallas(tallasRes.data);
        setCategorias(categoriasRes.data);
      } catch (err) {
        setError(err.response?.data?.error || "Error al cargar datos");
      } finally {
        setLoading({
          table: false,
          form: false,
          categorias: false,
        });
      }
    };

    fetchData();
  }, [api]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTallaActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form
  const validateForm = () => {
    if (!tallaActual.talla.trim()) {
      setError("La talla es obligatoria");
      return false;
    }
    
    if (tallaActual.talla.trim().length < 1) {
      setError("La talla debe tener al menos 1 caracter");
      return false;
    }
    
    if (tallaActual.talla.trim().length > 20) {
      setError("La talla no puede exceder los 20 caracteres");
      return false;
    }
    
    if (!tallaActual.categoriaId) {
      setError("Debe seleccionar una categoría");
      return false;
    }
    
    if (tallaActual.rangoEdad && tallaActual.rangoEdad.length > 30) {
      setError("El rango de edad no puede exceder los 30 caracteres");
      return false;
    }
    
    if (tallaActual.medida && tallaActual.medida.length > 30) {
      setError("La medida no puede exceder los 30 caracteres");
      return false;
    }
    
    const generosValidos = ["Unisex", "Niño", "Niña", "Dama", "Caballero"];
    if (!generosValidos.includes(tallaActual.genero)) {
      setError("El género seleccionado no es válido");
      return false;
    }
    
    setError(null);
    return true;
  };

  // Save or update size
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading({ ...loading, form: true });
      const tallaData = {
        ...tallaActual,
        categoriaId: tallaActual.categoriaId?._id || tallaActual.categoriaId,
      };

      let response;
      if (modoEdicion) {
        response = await api.put(`/tallas/${tallaData._id}`, tallaData);
      } else {
        response = await api.post("/tallas", tallaData);
      }

      if (response.data) {
        await fetchTallas();
        closeModal();
      }
    } catch (err) {
      setError(err.response?.data?.error || `Error al ${modoEdicion ? "actualizar" : "crear"} la talla`);
    } finally {
      setLoading({ ...loading, form: false });
    }
  };

  // Reload sizes
  const fetchTallas = async () => {
    try {
      setLoading({ ...loading, table: true });
      const response = await api.get("/tallas");
      setTallas(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar tallas");
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
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Edit and delete
  const handleEdit = (talla) => {
    openModal(talla);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta talla?")) return;

    try {
      setLoading({ ...loading, table: true });
      await api.delete(`/tallas/${id}`);
      await fetchTallas();
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar la talla");
    } finally {
      setLoading({ ...loading, table: false });
    }
  };

  // Reset form
  const resetForm = () => {
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
  };

  // Filtering
  const filteredTallas = tallas.filter((talla) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      talla.talla.toLowerCase().includes(searchLower) ||
      talla.genero.toLowerCase().includes(searchLower) ||
      (talla.rangoEdad && talla.rangoEdad.toLowerCase().includes(searchLower)) ||
      (talla.medida && talla.medida.toLowerCase().includes(searchLower)) ||
      (getCategoriaNombre(talla.categoriaId)?.toLowerCase().includes(searchLower));

    const matchesGenero = !filters.genero || talla.genero === filters.genero;
    const matchesCategoria = !filters.categoria ||
      (talla.categoriaId?._id || talla.categoriaId) === filters.categoria;

    return matchesSearch && matchesGenero && matchesCategoria;
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
          >
            <FaPlus size={14} style={{ marginRight: adminStyles.spacing.xs }} />
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
              <h3>Cargando tallas...</h3>
            </div>
          </div>
        ) : filteredTallas.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={styles.emptyStateText}>
              {searchTerm ? "No se encontraron tallas" : "No hay tallas registradas"}
            </h3>
            <p style={adminStyles.containers.emptyStateSubtext}>
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
                          style={adminStyles.combineStyles(
                            styles.actionButton,
                            styles.editAction
                          )}
                          title="Editar talla"
                          disabled={loading.form}
                          aria-label={`Editar talla ${talla.talla}`}
                        >
                          <FaEdit size={12} />
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(talla._id)}
                          style={adminStyles.combineStyles(
                            styles.actionButton,
                            styles.deleteAction,
                            { marginRight: 0 } // Eliminar margen del último botón
                          )}
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
          <div style={styles.modalOverlay} className="modal-overlay">
            <div style={styles.modalContent}>
              <div style={styles.modalBody}>
                <div style={styles.modalHeader}>
                  <h3 style={styles.modalTitle}>
                    {modoEdicion ? "Editar Talla" : "Nueva Talla"}
                  </h3>
                  <button
                    onClick={closeModal}
                    style={styles.modalCloseButton}
                    aria-label="Cerrar modal"
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
                      <small style={adminStyles.forms.helpText}>
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
                      <small style={adminStyles.forms.helpText}>
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
                      style={adminStyles.combineStyles(
                        styles.primaryButton,
                        loading.form ? styles.disabledButton : {}
                      )}
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
                          <FaSave style={{ marginRight: adminStyles.spacing.xs }} />
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
      </div>
    </div>
  );
};

export default GestionTallas;