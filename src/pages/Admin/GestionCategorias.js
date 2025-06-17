import { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaSave,
  FaPlus,
  FaTimes,
  FaSpinner,
  FaSearch,
  FaImage,
} from "react-icons/fa";

const GestionCategorias = () => {
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

  // Cargar categorías
  const fetchCategorias = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/categorias");
      setCategorias(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    fetchCategorias();
  }, [fetchCategorias]);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategoriaActual((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar cambio de archivo
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Validar formulario
  const validateForm = () => {
    if (!categoriaActual.nombre.trim()) {
      setError("El nombre es obligatorio");
      return false;
    }
    setError(null);
    return true;
  };

  // Guardar o actualizar categoría
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setError(
        err.response?.data?.error ||
          `Error al ${modoEdicion ? "actualizar" : "crear"} la categoría`
      );
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

  // Eliminar categoría
  const handleDelete = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar esta categoría?")) return;

    try {
      setLoading(true);
      await api.delete(`/categorias/${id}`);
      await fetchCategorias();
    } catch (err) {
      setError(err.response?.data?.error || "Error al eliminar la categoría");
    } finally {
      setLoading(false);
    }
  };

  // Resetear formulario
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

  // Filtrar categorías
  const filteredCategorias = categorias.filter((categoria) =>
    categoria.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    categoria.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
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
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
      marginBottom: "1.5rem",
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow:
        "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.05)",
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
      boxShadow:
        "0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
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
    searchContainer: {
      marginBottom: "1.5rem",
    },
    searchWrapper: {
      position: "relative",
    },
    searchIcon: {
      position: "absolute",
      left: "0.75rem",
      top: "50%",
      transform: "translateY(-50%)",
      color: "#9ca3af",
    },
    searchInput: {
      width: "100%",
      padding: "0.75rem 2rem 0.75rem 3rem",
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
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    },
    thumbnail: {
      width: "50px",
      height: "50px",
      borderRadius: "8px",
      objectFit: "cover",
    },
    placeholderImage: {
      width: "50px",
      height: "50px",
      color: "#9ca3af",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    imagePreview: {
      marginTop: "0.5rem",
      maxWidth: "100%",
      borderRadius: "8px",
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "1rem",
      marginTop: "2rem",
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.headerSection}>
        <h2>Gestión de Categorías</h2>
        <button
          onClick={() => openModal()}
          style={{ ...styles.button, ...styles.primaryButton }}
        >
          <FaPlus /> Nueva Categoría
        </button>
      </div>

      {/* Buscador */}
      <div style={styles.searchContainer}>
        <div style={styles.searchWrapper}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Tabla de categorías */}
      <div style={styles.tableContainer}>
        {loading ? (
          <div style={styles.loading}>
            <FaSpinner
              style={{
                fontSize: "1.5rem",
                color: "#2563eb",
                animation: "spin 1s linear infinite",
              }}
            />
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map((categoria) => (
                <tr key={categoria._id}>
                  <td>
                    {categoria.imagenURL ? (
                      <img
                        src={categoria.imagenURL}
                        alt={categoria.nombre}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <FaImage style={styles.placeholderImage} />
                    )}
                  </td>
                  <td>{categoria.nombre}</td>
                  <td>{categoria.descripcion}</td>
                  <td>
                    <button
                      onClick={() => openModal(categoria)}
                      style={{
                        ...styles.actionButton,
                        color: "#2563eb",
                        ":hover": {
                          color: "#1d4ed8",
                        },
                      }}
                      title="Editar"
                      disabled={loading}
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(categoria._id)}
                      style={{
                        ...styles.actionButton,
                        color: "#dc2626",
                        ":hover": {
                          color: "#b91c1c",
                        },
                      }}
                      title="Eliminar"
                      disabled={loading}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {modalVisible && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: "600" }}>
                {modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
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
              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.formGroup}>
                <label>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={categoriaActual.nombre}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label>Descripción</label>
                <textarea
                  name="descripcion"
                  value={categoriaActual.descripcion}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label>Imagen</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={styles.input}
                />
                {categoriaActual.imagenURL && (
                  <img
                    src={categoriaActual.imagenURL}
                    alt="Preview"
                    style={styles.imagePreview}
                  />
                )}
              </div>

              <div style={styles.modalActions}>
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
                  disabled={loading}
                >
                  {loading ? (
                    <FaSpinner className="spin" />
                  ) : (
                    <FaSave />
                  )}
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

export default GestionCategorias;