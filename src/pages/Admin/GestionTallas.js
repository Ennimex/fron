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
} from "react-icons/fa";

const GestionTallas = () => {
  // Estados principales
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

  // Configuración de Axios
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

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setTallaActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validar formulario
  const validateForm = () => {
    if (!tallaActual.talla.trim()) {
      setError("La talla es obligatoria");
      return false;
    }
    if (!tallaActual.categoriaId) {
      setError("Debe seleccionar una categoría");
      return false;
    }
    setError(null);
    return true;
  };

  // Guardar o actualizar talla
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading({ ...loading, form: true });
      const tallaData = {
        ...tallaActual,
        _id: tallaActual._id || Date.now().toString(),
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

  // Recargar tallas
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

  // Editar y eliminar
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

  // Resetear formulario
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

  // Filtrado
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

  // Obtener nombre de categoría
  const getCategoriaNombre = (id) => {
    const categoryId = typeof id === "object" && id !== null ? id._id : id;
    const categoria = categorias.find((c) => c._id === categoryId);
    return categoria ? categoria.nombre : "Sin categoría";
  };

  // Obtener rango o medida
  const getRangoOMedida = (talla) => {
    return talla.rangoEdad || talla.medida || "-";
  };

  // Manejar filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Estilos mejorados
  const styles = {
    dashboardContainer: {
      backgroundColor: "#f8fafc",
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "'Inter', sans-serif",
    },
    headerSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.5rem",
    },
    statsContainer: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "1rem",
      marginBottom: "2rem",
    },
    statCard: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
      transition: "transform 0.2s ease-in-out",
      ":hover": {
        transform: "translateY(-4px)",
      },
    },
    statTitle: {
      margin: "0 0 0.5rem 0",
      color: "#6b7280",
      fontSize: "0.875rem",
      fontWeight: "500",
      textTransform: "uppercase",
    },
    statValue: {
      margin: 0,
      fontSize: "1.5rem",
      fontWeight: "600",
      color: "#1f2937",
    },
    filterContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "1.5rem",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
      marginBottom: "1.5rem",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
      overflow: "hidden",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
    },
    th: {
      padding: "1rem 1.5rem",
      textAlign: "left",
      fontSize: "0.75rem",
      fontWeight: "500",
      color: "#6b7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      backgroundColor: "#f9fafb",
    },
    td: {
      padding: "1rem 1.5rem",
      fontSize: "0.875rem",
      color: "#374151",
      borderTop: "1px solid #e5e7eb",
    },
    button: {
      padding: "0.75rem 1.5rem",
      borderRadius: "8px",
      border: "none",
      fontWeight: "500",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      gap: "0.5rem",
    },
    primaryButton: {
      backgroundColor: "#2563eb",
      color: "white",
      ":hover": {
        backgroundColor: "#1d4ed8",
      },
    },
    secondaryButton: {
      backgroundColor: "#e5e7eb",
      color: "#374151",
      ":hover": {
        backgroundColor: "#d1d5db",
      },
    },
    actionButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1.25rem",
      transition: "color 0.2s ease-in-out",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.6)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      animation: "fadeIn 0.3s ease-in-out",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "2rem",
      borderRadius: "12px",
      width: "90%",
      maxWidth: "600px",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      animation: "slideIn 0.3s ease-in-out",
    },
    input: {
      width: "100%",
      padding: "0.75rem",
      border: "1px solid #d1d5db",
      borderRadius: "8px",
      fontSize: "0.875rem",
      transition: "all 0.2s ease-in-out",
      ":focus": {
        outline: "none",
        borderColor: "#2563eb",
        boxShadow: "0 0 0 3px rgba(37,99,235,0.1)",
      },
    },
    label: {
      display: "block",
      fontSize: "0.875rem",
      color: "#6b7280",
      marginBottom: "0.5rem",
      fontWeight: "500",
    },
    error: {
      backgroundColor: "#fef2f2",
      borderLeft: "4px solid #dc2626",
      color: "#991b1b",
      padding: "1rem",
      borderRadius: "8px",
      marginBottom: "1rem",
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.headerSection}>
        <h2 style={{ ...styles.statValue, margin: 0 }}>Gestión de Tallas</h2>
        <button
          style={{ ...styles.button, ...styles.primaryButton }}
          onClick={() => openModal()}
        >
          <FaPlus /> Nueva Talla
        </button>
      </div>

      <div style={styles.filterContainer}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
          alignItems: "end",
        }}>
          <div>
            <label style={styles.label}>Buscar</label>
            <div style={{ position: "relative" }}>
              <FaSearch style={{
                position: "absolute",
                left: "0.75rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#9ca3af",
              }} />
              <input
                type="text"
                placeholder="Buscar tallas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  ...styles.input,
                  paddingLeft: "2.5rem",
                }}
              />
            </div>
          </div>

          <div>
            <label style={styles.label}>Género</label>
            <select
              name="genero"
              value={filters.genero}
              onChange={handleFilterChange}
              style={styles.input}
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
              style={styles.input}
            >
              <option value="">Todas</option>
              {categorias.map((categoria) => (
                <option key={categoria._id} value={categoria._id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            color: "#6b7280",
            fontSize: "0.875rem",
            fontWeight: "500",
          }}>
            Total: {filteredTallas.length} tallas
          </div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        {loading.table || loading.categorias ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "2rem",
          }}>
            <FaSpinner style={{
              fontSize: "1.5rem",
              color: "#2563eb",
              animation: "spin 1s linear infinite",
            }} />
          </div>
        ) : filteredTallas.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "2rem",
            color: "#6b7280",
            fontSize: "1rem",
          }}>
            {searchTerm ? "No se encontraron tallas" : "No hay tallas registradas"}
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Categoría</th>
                  <th style={styles.th}>Talla</th>
                  <th style={styles.th}>Rango/Medida</th>
                  <th style={{ ...styles.th, textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTallas.map((talla) => (
                  <tr
                    key={talla._id}
                    style={{
                      transition: "background-color 0.2s ease-in-out",
                      ":hover": {
                        backgroundColor: "#f9fafb",
                      },
                    }}
                  >
                    <td style={styles.td}>{getCategoriaNombre(talla.categoriaId)}</td>
                    <td style={{ ...styles.td, fontWeight: "500" }}>{talla.talla}</td>
                    <td style={styles.td}>{getRangoOMedida(talla)}</td>
                    <td style={{ ...styles.td, textAlign: "right" }}>
                      <button
                        onClick={() => handleEdit(talla)}
                        style={{
                          ...styles.actionButton,
                          color: "#2563eb",
                          ":hover": {
                            color: "#1d4ed8",
                          },
                        }}
                        title="Editar"
                        disabled={loading.form}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(talla._id)}
                        style={{
                          ...styles.actionButton,
                          color: "#dc2626",
                          ":hover": {
                            color: "#b91c1c",
                          },
                        }}
                        title="Eliminar"
                        disabled={loading.table}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {modoEdicion ? "Editar Talla" : "Nueva Talla"}
              </h3>
              <button
                onClick={closeModal}
                style={{
                  ...styles.actionButton,
                  color: "#6b7280",
                  fontSize: "1.5rem",
                  ":hover": {
                    color: "#374151",
                  },
                }}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={styles.error}>
                  {error}
                </div>
              )}

              <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1.5rem",
              }}>
                <div>
                  <label style={styles.label}>Categoría *</label>
                  <select
                    name="categoriaId"
                    value={tallaActual.categoriaId?._id || tallaActual.categoriaId || ""}
                    onChange={handleChange}
                    style={styles.input}
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

                <div>
                  <label style={styles.label}>Talla *</label>
                  <input
                    type="text"
                    name="talla"
                    value={tallaActual.talla}
                    onChange={handleChange}
                    style={styles.input}
                    required
                    disabled={loading.form}
                  />
                </div>

                <div>
                  <label style={styles.label}>Género *</label>
                  <select
                    name="genero"
                    value={tallaActual.genero}
                    onChange={handleChange}
                    style={styles.input}
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

                <div>
                  <label style={styles.label}>Rango de edad</label>
                  <input
                    type="text"
                    name="rangoEdad"
                    value={tallaActual.rangoEdad}
                    onChange={handleChange}
                    style={styles.input}
                    disabled={loading.form}
                    placeholder="Ej: 2-4 años"
                  />
                </div>

                <div>
                  <label style={styles.label}>Medida</label>
                  <input
                    type="text"
                    name="medida"
                    value={tallaActual.medida}
                    onChange={handleChange}
                    style={styles.input}
                    disabled={loading.form}
                    placeholder="Ej: 90cm"
                  />
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
                marginTop: "2rem",
              }}>
                <button
                  type="button"
                  onClick={closeModal}
                  style={{ ...styles.button, ...styles.secondaryButton }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{ ...styles.button, ...styles.primaryButton }}
                  disabled={loading.form}
                >
                  {loading.form ? <FaSpinner style={{ animation: "spin 1s linear infinite" }} /> : <FaSave />}
                  {modoEdicion ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionTallas;