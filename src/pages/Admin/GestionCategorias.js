import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import categoriaService from "../../services/categoriaService";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSpinner,
  FaSearch,
  FaLock,
  FaTags,
} from "react-icons/fa";
import stylesGlobal from "../../styles/stylesGlobal";
import adminTheme from "../../styles/adminTheme";
import StatCard from "../../components/admin/ui/StatCard";

// Kit de UI compartido del panel: garantiza que esta vista se vea igual
// que las demás (encabezado, modal, confirmación, campos, botones).
import AdminHeader from "../../components/admin/ui/AdminHeader";
import AdminModal from "../../components/admin/ui/AdminModal";
import ConfirmDialog from "../../components/admin/ui/ConfirmDialog";
import Campo from "../../components/admin/ui/Campo";
import { BotonPrimario, BotonSecundario, BotonIcono } from "../../components/admin/ui/Botones";

const GestionCategorias = () => {
  const { user, isAuthenticated } = useAuth();

  // Mapeo de estilos globales
  const styles = {
    pageContainer: {
      padding: stylesGlobal.spacing.sections.md,
      backgroundColor: adminTheme.bg,
      minHeight: "100vh",
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
    // --- Tarjetas de resumen (stat cards) ---
    statGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: stylesGlobal.spacing.scale[5],
      marginBottom: stylesGlobal.spacing.scale[6],
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
    mediaCount: {
      color: stylesGlobal.colors.primary[600],
      fontSize: stylesGlobal.typography.scale.sm,
      fontWeight: stylesGlobal.typography.weights.semibold,
    },
    mediaFooter: {
      display: "flex",
      justifyContent: "flex-end",
      gap: stylesGlobal.spacing.scale[2],
      marginTop: "auto",
      paddingTop: stylesGlobal.spacing.scale[3],
      borderTop: `1px solid ${stylesGlobal.colors.neutral[200]}`,
    },
    searchContainer: { position: "relative" },
    searchIcon: {
      position: "absolute",
      left: stylesGlobal.spacing.scale[3],
      top: "50%",
      transform: "translateY(-50%)",
      color: stylesGlobal.colors.text.muted,
    },
    input: { ...stylesGlobal.components.input.base, width: "100%" },
    textarea: {
      ...stylesGlobal.components.input.base,
      width: "100%",
      minHeight: "120px",
      resize: "vertical",
    },
    modalImagePreview: {
      maxWidth: "100%",
      maxHeight: "150px",
      marginTop: stylesGlobal.spacing.scale[4],
      borderRadius: stylesGlobal.borders.radius.sm,
      border: `${stylesGlobal.borders.width[1]} solid ${stylesGlobal.borders.colors.default}`,
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: "center",
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    loadingContainer: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: "center",
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
  // Confirmación de borrado: { id, nombre }
  const [confirmacion, setConfirmacion] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

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
      setError(err.error || err.message || "Error al cargar categorías");
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
      setError(err.error || err.message || `Error al ${modoEdicion ? "actualizar" : "crear"} la categoría`);
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
      setModoEdicion(false);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    resetForm();
  };

  // Eliminar (la confirmación la pide el ConfirmDialog)
  const ejecutarEliminacion = async () => {
    if (!confirmacion) return;
    setConfirmLoading(true);
    try {
      setError(null);
      await categoriaService.delete(confirmacion.id);
      setConfirmacion(null);
      await fetchCategorias();
    } catch (err) {
      setError(err.error || err.message || "Error al eliminar la categoría");
    } finally {
      setConfirmLoading(false);
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
      <div
        style={{
          ...styles.pageContainer,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          textAlign: "center",
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
          icon={FaTags}
          titulo="Gestión de Categorías"
          subtitulo="Organiza tus colecciones artesanales"
          accion={
            <BotonPrimario icono={FaPlus} onClick={() => openModal()} aria-label="Nueva categoría">
              Nueva Categoría
            </BotonPrimario>
          }
        />

        {/* Tarjetas de resumen (datos reales) */}
        <div style={styles.statGrid}>
          <StatCard label="Total de categorías" value={totalCategorias} />
          <StatCard label="Con imagen" value={conImagen} />
          <StatCard label="Con descripción" value={conDescripcion} />
        </div>

        {/* Error message */}
        {error && !modalVisible && <div style={styles.error}>{error}</div>}

        {/* Search */}
        <Campo
          etiqueta="Buscar categorías"
          htmlFor="categorias-buscar"
          style={{ marginBottom: stylesGlobal.spacing.scale[6] }}
        >
          <div style={styles.searchContainer}>
            <FaSearch style={styles.searchIcon} />
            <input
              id="categorias-buscar"
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...styles.input, paddingLeft: stylesGlobal.spacing.scale[10] }}
            />
          </div>
        </Campo>

        {/* Galería de categorías */}
        {loading ? (
          <div style={styles.loadingContainer}>
            <FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: stylesGlobal.spacing.scale[2] }} />
            <h3 style={stylesGlobal.typography.headings.h3}>Cargando categorías...</h3>
          </div>
        ) : filteredCategorias.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={stylesGlobal.typography.headings.h3}>
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
                      loading="lazy"
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
                  <div style={styles.mediaCount}>
                    {categoria.productosCount ?? 0}{" "}
                    {(categoria.productosCount ?? 0) === 1 ? "producto" : "productos"}
                  </div>
                  <p style={styles.mediaDesc}>
                    {categoria.descripcion || "Sin descripción"}
                  </p>
                  <div style={styles.mediaFooter}>
                    <BotonIcono
                      variante="editar"
                      onClick={() => openModal(categoria)}
                      title="Editar categoría"
                      disabled={loading}
                      aria-label={`Editar categoría ${categoria.nombre}`}
                    >
                      <FaEdit size={15} />
                    </BotonIcono>
                    <BotonIcono
                      variante="eliminar"
                      onClick={() => setConfirmacion({ id: categoria._id, nombre: categoria.nombre })}
                      title="Eliminar categoría"
                      disabled={loading}
                      aria-label={`Eliminar categoría ${categoria.nombre}`}
                    >
                      <FaTrash size={15} />
                    </BotonIcono>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de alta/edición */}
        <AdminModal
          abierto={modalVisible}
          onCerrar={closeModal}
          titulo={modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
          maxWidth="600px"
          bloqueado={loading}
          pie={
            <>
              <BotonSecundario onClick={closeModal} disabled={loading}>
                Cancelar
              </BotonSecundario>
              <BotonPrimario
                type="submit"
                form="form-categoria"
                disabled={loading}
                aria-label={modoEdicion ? "Actualizar categoría" : "Crear categoría"}
              >
                {loading ? (
                  <>
                    <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                    {modoEdicion ? "Actualizando..." : "Guardando..."}
                  </>
                ) : modoEdicion ? (
                  "Actualizar"
                ) : (
                  "Guardar"
                )}
              </BotonPrimario>
            </>
          }
        >
          <form id="form-categoria" onSubmit={handleSubmit}>
            {error && <div style={styles.error}>{error}</div>}

            <Campo
              etiqueta="Nombre de la Categoría"
              htmlFor="nombre"
              requerido
              pista={`${categoriaActual.nombre.length}/50 caracteres`}
            >
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
            </Campo>

            <Campo
              etiqueta="Descripción"
              htmlFor="descripcion"
              opcional
              pista={`${categoriaActual.descripcion?.length || 0}/200 caracteres. Proporciona una descripción que ayude a identificar esta categoría.`}
            >
              <textarea
                id="descripcion"
                name="descripcion"
                value={categoriaActual.descripcion}
                onChange={handleChange}
                style={styles.textarea}
                rows="3"
                placeholder="Descripción breve de la categoría (opcional)"
              />
            </Campo>

            <Campo
              etiqueta="Imagen de la Categoría"
              htmlFor="imagen"
              opcional
              pista="Formatos admitidos: JPEG, PNG, GIF, WEBP. Tamaño máximo: 5MB."
            >
              <input
                id="imagen"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                style={styles.input}
              />
              {categoriaActual.imagenURL && (
                <img
                  src={categoriaActual.imagenURL}
                  alt="Vista previa"
                  style={styles.modalImagePreview}
                />
              )}
            </Campo>
          </form>
        </AdminModal>

        {/* Confirmación de borrado */}
        <ConfirmDialog
          abierto={Boolean(confirmacion)}
          titulo="¿Eliminar categoría?"
          nombre={confirmacion ? confirmacion.nombre : ""}
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

export default GestionCategorias;
