import { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSearch, FaLock, FaRulerCombined } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import stylesGlobal from "../../styles/stylesGlobal";
import adminTheme from "../../styles/adminTheme";

import { tallaService, categoriaService } from "../../services";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";

// Kit de UI compartido del panel: garantiza que esta vista se vea igual
// que las demás (encabezado, filas-tarjeta, modal, confirmación, campos).
import AdminHeader from "../../components/admin/ui/AdminHeader";
import AdminModal from "../../components/admin/ui/AdminModal";
import ConfirmDialog from "../../components/admin/ui/ConfirmDialog";
import Campo from "../../components/admin/ui/Campo";
import { BotonPrimario, BotonSecundario, BotonIcono } from "../../components/admin/ui/Botones";
import { Thead, Fila, Miniatura, TextoCelda } from "../../components/admin/ui/ListaFilas";

const COLUMNAS = "2fr 1.4fr 1.6fr auto";

const TALLA_VACIA = {
  _id: "",
  categoriaId: "",
  genero: "Unisex",
  talla: "",
  rangoEdad: "",
  medida: "",
};

const GestionTallas = () => {
  const { user, isAuthenticated } = useAuth();
  const { notifications, addNotification, removeNotification, clearAllNotifications } = useAdminNotifications();

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
    filtros: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: stylesGlobal.spacing.gaps.lg,
      alignItems: "end",
      marginBottom: stylesGlobal.spacing.scale[6],
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
    select: { ...stylesGlobal.components.input.base, width: "100%", cursor: "pointer" },
    totalCounter: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.muted,
      textAlign: "right",
      paddingBottom: stylesGlobal.spacing.scale[3],
    },
    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: "center",
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    loadingContainer: { padding: stylesGlobal.spacing.scale[8], textAlign: "center" },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: `0 ${stylesGlobal.spacing.gaps.lg}`,
    },
  };

  // Estado principal
  const [tallas, setTallas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [tallaActual, setTallaActual] = useState(TALLA_VACIA);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState({ table: true, form: false, categorias: true });
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [filters, setFilters] = useState({ genero: "", categoria: "" });
  // Confirmación de borrado: { id, nombre }
  const [confirmacion, setConfirmacion] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Carga inicial
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
        addNotification(errorMsg, "error");
      } finally {
        setLoading({ table: false, form: false, categorias: false });
      }
    };

    fetchData();
  }, [addNotification]);

  const resetForm = useCallback(() => {
    setTallaActual(TALLA_VACIA);
    setModoEdicion(false);
    setError(null);
  }, []);

  const closeModal = useCallback(() => {
    setModalVisible(false);
    resetForm();

    // Retornar el foco al botón que abrió el modal
    setTimeout(() => {
      const addButton = document.querySelector('button[aria-label="Nueva talla"]');
      if (addButton) addButton.focus();
    }, 100);
  }, [resetForm]);

  // Escape cierra el modal y se bloquea el scroll del body mientras esté abierto
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && modalVisible) {
        closeModal();
      }
    };

    if (modalVisible) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [modalVisible, closeModal]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTallaActual((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar o actualizar talla
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validation = tallaService.validate(tallaActual);
    if (!validation.isValid) {
      setError(validation.errors.join(", "));
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, form: true }));
      // Payload limpio: solo los campos editables (antes se enviaba el
      // documento completo con _id/__v y la categoría poblada)
      const tallaData = {
        categoriaId: tallaActual.categoriaId?._id || tallaActual.categoriaId,
        genero: tallaActual.genero,
        talla: tallaActual.talla.trim(),
        rangoEdad: tallaActual.rangoEdad || "",
        medida: tallaActual.medida || "",
      };
      const categoria = categorias.find((c) => c._id === tallaData.categoriaId);

      if (modoEdicion) {
        await tallaService.update(tallaActual._id, tallaData);
        addNotification(
          `Talla "${tallaData.talla}" de la categoría "${categoria?.nombre || "N/A"}" actualizada exitosamente`,
          "success"
        );
      } else {
        await tallaService.create(tallaData);
        addNotification(
          `Nueva talla "${tallaData.talla}" creada en la categoría "${categoria?.nombre || "N/A"}"`,
          "success"
        );
      }

      await fetchTallas();
      closeModal();
      setError(null);
    } catch (err) {
      const errorMsg = err.error || err.message || `Error al ${modoEdicion ? "actualizar" : "crear"} la talla`;
      setError(errorMsg);
      addNotification(errorMsg, "error");
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  };

  const fetchTallas = async () => {
    try {
      setLoading((prev) => ({ ...prev, table: true }));
      const response = await tallaService.getAll();
      setTallas(response);
    } catch (err) {
      const errorMsg = err.error || err.message || "Error al cargar tallas";
      setError(errorMsg);
      addNotification(errorMsg, "error");
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  };

  const openModal = (talla = null) => {
    if (talla) {
      setTallaActual(talla);
      setModoEdicion(true);
    } else {
      resetForm();
      setModoEdicion(false);
    }

    setModalVisible(true);
    setError(null);

    // Enfocar el primer campo del formulario al abrir
    setTimeout(() => {
      const firstInput = document.querySelector('select[name="categoriaId"]');
      if (firstInput) firstInput.focus();
    }, 100);
  };

  // Eliminar (la confirmación la pide el ConfirmDialog)
  const ejecutarEliminacion = async () => {
    if (!confirmacion) return;
    setConfirmLoading(true);
    try {
      await tallaService.delete(confirmacion.id);
      addNotification(`Talla "${confirmacion.nombre}" eliminada exitosamente`, "success");
      setConfirmacion(null);
      await fetchTallas();
      setError(null);
    } catch (err) {
      const errorMsg = err.error || err.message || "Error al eliminar la talla";
      setError(errorMsg);
      addNotification(errorMsg, "error");
    } finally {
      setConfirmLoading(false);
    }
  };

  const filteredTallas = tallaService.filter(tallas, {
    search: searchTerm,
    genero: filters.genero,
    categoria: filters.categoria,
  });

  const getCategoriaNombre = (id) => {
    const categoryId = typeof id === "object" && id !== null ? id._id : id;
    const categoria = categorias.find((c) => c._id === categoryId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Guardias de acceso
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== "admin") {
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
          icon={FaRulerCombined}
          titulo="Gestión de Tallas"
          subtitulo="Administra y supervisa todas las tallas del sistema"
          accion={
            <BotonPrimario icono={FaPlus} onClick={() => openModal()} aria-label="Nueva talla">
              Nueva Talla
            </BotonPrimario>
          }
        />

        {error && !modalVisible && <div style={styles.error}>{error}</div>}

        {/* Filtros */}
        <div style={styles.filtros}>
          <Campo etiqueta="Buscar" htmlFor="tallas-buscar" style={{ marginBottom: 0 }}>
            <div style={styles.searchContainer}>
              <FaSearch style={styles.searchIcon} />
              <input
                id="tallas-buscar"
                type="text"
                placeholder="Buscar tallas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ ...styles.input, paddingLeft: stylesGlobal.spacing.scale[10] }}
              />
            </div>
          </Campo>

          <Campo etiqueta="Género" htmlFor="tallas-genero" style={{ marginBottom: 0 }}>
            <select
              id="tallas-genero"
              name="genero"
              value={filters.genero}
              onChange={handleFilterChange}
              style={styles.select}
            >
              <option value="">Todos</option>
              <option value="Unisex">Unisex</option>
              <option value="Niño">Niño</option>
              <option value="Niña">Niña</option>
              <option value="Dama">Dama</option>
              <option value="Caballero">Caballero</option>
            </select>
          </Campo>

          <Campo etiqueta="Categoría" htmlFor="tallas-categoria" style={{ marginBottom: 0 }}>
            <select
              id="tallas-categoria"
              name="categoria"
              value={filters.categoria}
              onChange={handleFilterChange}
              style={styles.select}
            >
              <option value="">Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </Campo>

          <div style={styles.totalCounter}>
            Total: {filteredTallas.length} {filteredTallas.length === 1 ? "talla" : "tallas"}
          </div>
        </div>

        {/* Lista */}
        {loading.table || loading.categorias ? (
          <div style={styles.loadingContainer}>
            <FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: stylesGlobal.spacing.scale[2] }} />
            <h3 style={stylesGlobal.typography.headings.h3}>Cargando tallas...</h3>
          </div>
        ) : filteredTallas.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={stylesGlobal.typography.headings.h3}>
              {searchTerm ? "No se encontraron tallas" : "No hay tallas registradas"}
            </h3>
            <p style={stylesGlobal.typography.body.base}>
              {searchTerm ? "Intenta con otros términos de búsqueda" : "¡Agrega una nueva talla para comenzar!"}
            </p>
          </div>
        ) : (
          <div>
            <Thead columnas={COLUMNAS}>
              <div>Talla</div>
              <div>Género</div>
              <div>Categoría · Rango / Medida</div>
              <div style={{ textAlign: "right" }}>Acciones</div>
            </Thead>

            {filteredTallas.map((talla) => (
              <Fila key={talla._id} columnas={COLUMNAS}>
                <div style={{ display: "flex", alignItems: "center", gap: stylesGlobal.spacing.scale[4], minWidth: 0 }}>
                  <Miniatura>{(talla.talla || "?")[0].toUpperCase()}</Miniatura>
                  <div
                    style={{
                      fontWeight: stylesGlobal.typography.weights.semibold,
                      color: stylesGlobal.colors.text.primary,
                    }}
                  >
                    {talla.talla}
                  </div>
                </div>
                <TextoCelda>{talla.genero || "—"}</TextoCelda>
                <TextoCelda>
                  {[getCategoriaNombre(talla.categoriaId), [talla.rangoEdad, talla.medida].filter(Boolean).join(" / ")]
                    .filter(Boolean)
                    .join(" · ")}
                </TextoCelda>
                <div
                  className="admin-acciones"
                  style={{ display: "flex", gap: stylesGlobal.spacing.scale[2], justifyContent: "flex-end" }}
                >
                  <BotonIcono
                    variante="editar"
                    onClick={() => openModal(talla)}
                    title="Editar talla"
                    aria-label={`Editar talla ${talla.talla}`}
                  >
                    <FaEdit size={15} />
                  </BotonIcono>
                  <BotonIcono
                    variante="eliminar"
                    onClick={() => setConfirmacion({ id: talla._id, nombre: talla.talla })}
                    title="Eliminar talla"
                    aria-label={`Eliminar talla ${talla.talla}`}
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
          abierto={modalVisible}
          onCerrar={closeModal}
          titulo={modoEdicion ? "Editar Talla" : "Nueva Talla"}
          maxWidth="640px"
          bloqueado={loading.form}
          pie={
            <>
              <BotonSecundario onClick={closeModal} disabled={loading.form}>
                Cancelar
              </BotonSecundario>
              <BotonPrimario
                type="submit"
                form="form-talla"
                disabled={loading.form}
                aria-label={modoEdicion ? "Actualizar talla" : "Crear talla"}
              >
                {loading.form ? (
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
          <form id="form-talla" onSubmit={handleSubmit} noValidate>
            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.formGrid}>
              <Campo etiqueta="Categoría" htmlFor="talla-categoria" requerido>
                <select
                  id="talla-categoria"
                  name="categoriaId"
                  value={tallaActual.categoriaId?._id || tallaActual.categoriaId || ""}
                  onChange={handleChange}
                  style={styles.select}
                  disabled={loading.categorias || loading.form}
                >
                  <option value="">Seleccione una categoría</option>
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria._id}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </Campo>

              <Campo etiqueta="Talla" htmlFor="talla-talla" requerido pista={`${tallaActual.talla.length}/20 caracteres`}>
                <input
                  id="talla-talla"
                  type="text"
                  name="talla"
                  value={tallaActual.talla}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading.form}
                  maxLength={20}
                  placeholder="Ej: S, M, L, XL, 38, 40..."
                />
              </Campo>

              <Campo etiqueta="Género" htmlFor="talla-genero" requerido>
                <select
                  id="talla-genero"
                  name="genero"
                  value={tallaActual.genero}
                  onChange={handleChange}
                  style={styles.select}
                  disabled={loading.form}
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Niño">Niño</option>
                  <option value="Niña">Niña</option>
                  <option value="Dama">Dama</option>
                  <option value="Caballero">Caballero</option>
                </select>
              </Campo>

              <Campo
                etiqueta="Rango de edad"
                htmlFor="talla-rango"
                opcional
                pista="Rango recomendado para esta talla."
              >
                <input
                  id="talla-rango"
                  type="text"
                  name="rangoEdad"
                  value={tallaActual.rangoEdad}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading.form}
                  maxLength={30}
                  placeholder="Ej: 2-4 años"
                />
              </Campo>

              <Campo etiqueta="Medida" htmlFor="talla-medida" opcional pista="Medidas específicas de esta talla.">
                <input
                  id="talla-medida"
                  type="text"
                  name="medida"
                  value={tallaActual.medida}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loading.form}
                  maxLength={30}
                  placeholder="Ej: 90cm, 32 pulgadas"
                />
              </Campo>
            </div>
          </form>
        </AdminModal>

        {/* Confirmación de borrado */}
        <ConfirmDialog
          abierto={Boolean(confirmacion)}
          titulo="¿Eliminar talla?"
          nombre={confirmacion ? `${confirmacion.nombre} · ${getCategoriaNombre(tallas.find((t) => t._id === confirmacion.id)?.categoriaId)}` : ""}
          cargando={confirmLoading}
          onCancelar={() => setConfirmacion(null)}
          onConfirmar={ejecutarEliminacion}
        />

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
