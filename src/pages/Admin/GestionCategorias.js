import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
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
  const navigate = useNavigate();
  const { checkTokenExpiration } = useAuth();
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

  // Función para verificar token antes de cada operación
  const verifyTokenAndProceed = useCallback(async () => {
    if (!checkTokenExpiration()) {
      navigate('/login');
      return false;
    }
    return true;
  }, [checkTokenExpiration, navigate]);

  // Cargar categorías
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
    // Validar nombre
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
    
    // Validación de caracteres especiales en el nombre
    const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s-]+$/;
    if (!nombreRegex.test(categoriaActual.nombre.trim())) {
      setError("El nombre solo debe contener letras, números, espacios y guiones");
      return false;
    }
    
    // Validar descripción
    if (categoriaActual.descripcion && categoriaActual.descripcion.length > 200) {
      setError("La descripción no puede exceder los 200 caracteres");
      return false;
    }
    
    // Validar imagen
    if (selectedFile) {
      // Verificar tipo de archivo
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setError("El archivo debe ser una imagen (JPEG, PNG, GIF o WEBP)");
        return false;
      }
      
      // Verificar tamaño (máximo 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB en bytes
      if (selectedFile.size > maxSize) {
        setError("La imagen no puede superar los 5MB");
        return false;
      }
    }
    
    setError(null);
    return true;
  };

  // Guardar o actualizar categoría
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

  // Eliminar categoría
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
      backgroundColor: "#f0f4f8",
      minHeight: "100vh",
      padding: "1.5rem",
      fontFamily: "'Inter', sans-serif",
      fontSize: "0.9rem",
    },
    headerSection: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.2rem",
      backgroundColor: "white",
      padding: "1rem 1.5rem",
      borderRadius: "10px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
    },
    headerTitle: {
      fontSize: "1.4rem",
      fontWeight: "600",
      color: "#1a202c",
      margin: 0,
    },
    tableContainer: {
      backgroundColor: "white",
      borderRadius: "10px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
      overflow: "hidden",
      transition: "box-shadow 0.3s ease",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      fontSize: "0.85rem",
    },
    th: {
      padding: "0.8rem 1.2rem",
      textAlign: "left",
      fontSize: "0.7rem",
      fontWeight: "600",
      color: "#4a5568",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      backgroundColor: "#f9fafb",
      borderBottom: "2px solid #e2e8f0",
    },
    td: {
      padding: "0.8rem 1.2rem",
      fontSize: "0.85rem",
      color: "#2d3748",
      borderTop: "1px solid #edf2f7",
      verticalAlign: "middle",
    },
    button: {
      padding: "0.6rem 1.2rem",
      borderRadius: "6px",
      border: "none",
      fontWeight: "500",
      fontSize: "0.85rem",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
    },
    primaryButton: {
      backgroundColor: "#3182ce",
      color: "white",
      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
      ":hover": {
        backgroundColor: "#2c5282",
        transform: "translateY(-1px)",
      },
    },
    secondaryButton: {
      backgroundColor: "#e2e8f0",
      color: "#4a5568",
      ":hover": {
        backgroundColor: "#cbd5e0",
      },
    },
    actionButton: {
      background: "none",
      border: "none",
      cursor: "pointer",
      fontSize: "1rem",
      padding: "0.3rem",
      borderRadius: "4px",
      transition: "all 0.2s ease-in-out",
    },
    editButton: {
      color: "#3182ce",
      marginRight: "0.5rem",
    },
    deleteButton: {
      color: "#e53e3e",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      backdropFilter: "blur(3px)",
      animation: "fadeIn 0.2s ease-in-out",
    },
    modalContent: {
      backgroundColor: "white",
      padding: "1.5rem",
      borderRadius: "10px",
      width: "90%",
      maxWidth: "500px",
      maxHeight: "85vh",
      overflow: "auto",
      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)",
      animation: "slideIn 0.3s ease-in-out",
    },
    modalHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "1.2rem",
      paddingBottom: "0.8rem",
      borderBottom: "1px solid #e2e8f0",
    },
    modalTitle: {
      margin: 0,
      fontSize: "1.2rem",
      fontWeight: "600",
      color: "#1a202c",
    },
    closeButton: {
      background: "none",
      border: "none",
      color: "#718096",
      fontSize: "1.2rem",
      cursor: "pointer",
      transition: "color 0.2s ease",
      ":hover": {
        color: "#2d3748",
      },
    },
    input: {
      width: "100%",
      padding: "0.6rem 0.8rem",
      border: "1px solid #e2e8f0",
      borderRadius: "6px",
      fontSize: "0.85rem",
      transition: "all 0.2s ease-in-out",
      backgroundColor: "#f8fafc",
      ":focus": {
        outline: "none",
        borderColor: "#3182ce",
        boxShadow: "0 0 0 3px rgba(49,130,206,0.1)",
        backgroundColor: "white",
      },
    },
    label: {
      display: "block",
      fontSize: "0.8rem",
      color: "#4a5568",
      marginBottom: "0.4rem",
      fontWeight: "500",
    },
    error: {
      backgroundColor: "#FEF2F2",
      borderLeft: "4px solid #DC2626",
      color: "#991B1B",
      padding: "0.8rem 1rem",
      borderRadius: "6px",
      marginBottom: "1rem",
      fontSize: "0.85rem",
    },
    searchContainer: {
      marginBottom: "1.2rem",
    },
    searchWrapper: {
      position: "relative",
      backgroundColor: "white",
      borderRadius: "8px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
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
      padding: "0.6rem 1rem 0.6rem 2.5rem",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      fontSize: "0.85rem",
      transition: "all 0.2s ease-in-out",
      ":focus": {
        outline: "none",
        borderColor: "#3182ce",
        boxShadow: "0 0 0 3px rgba(49,130,206,0.1)",
      },
    },
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "2rem",
    },
    thumbnail: {
      width: "45px",
      height: "45px",
      borderRadius: "6px",
      objectFit: "cover",
      border: "1px solid #e2e8f0",
    },
    placeholderImage: {
      width: "45px",
      height: "45px",
      color: "#9ca3af",
      padding: "0.5rem",
      backgroundColor: "#f3f4f6",
      borderRadius: "6px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    formGroup: {
      marginBottom: "1.2rem",
    },
    imagePreview: {
      marginTop: "0.5rem",
      maxWidth: "100%",
      maxHeight: "150px",
      borderRadius: "6px",
      objectFit: "contain",
      border: "1px solid #e2e8f0",
    },
    modalActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "0.8rem",
      marginTop: "1.5rem",
      paddingTop: "1rem",
      borderTop: "1px solid #e2e8f0",
    },
    fileInput: {
      fontSize: "0.8rem",
    },
    tableRow: {
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: "#f9fafb",
      },
    },
    spinAnimation: {
      animation: "spin 1s linear infinite",
      fontSize: "1.2rem",
    },
    // Clases adicionales para mejorar la interactividad
    hoverTransition: {
      transition: "transform 0.2s, box-shadow 0.2s",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)",
      },
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.headerSection}>
        <h2 style={styles.headerTitle}>Gestión de Categorías</h2>
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
            <FaSpinner style={styles.spinAnimation} />
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Imagen</th>
                <th style={styles.th}>Nombre</th>
                <th style={styles.th}>Descripción</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategorias.map((categoria) => (
                <tr key={categoria._id} style={styles.tableRow}>
                  <td style={styles.td}>
                    {categoria.imagenURL ? (
                      <img
                        src={categoria.imagenURL}
                        alt={categoria.nombre}
                        style={styles.thumbnail}
                      />
                    ) : (
                      <div style={styles.placeholderImage}>
                        <FaImage />
                      </div>
                    )}
                  </td>
                  <td style={styles.td}>{categoria.nombre}</td>
                  <td style={styles.td}>{categoria.descripcion}</td>
                  <td style={styles.td}>
                    <button
                      onClick={() => openModal(categoria)}
                      style={{
                        ...styles.actionButton,
                        ...styles.editButton,
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
                        ...styles.deleteButton,
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
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>
                {modoEdicion ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <button
                onClick={closeModal}
                style={styles.closeButton}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {error && <div style={styles.error}>{error}</div>}

              <div style={styles.formGroup}>
                <label style={styles.label}>Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={categoriaActual.nombre}
                  onChange={handleChange}
                  required
                  style={styles.input}
                  placeholder="Ingrese el nombre de la categoría"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Descripción</label>
                <textarea
                  name="descripcion"
                  value={categoriaActual.descripcion}
                  onChange={handleChange}
                  style={styles.input}
                  rows="3"
                  placeholder="Descripción breve de la categoría"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Imagen</label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{...styles.input, ...styles.fileInput}}
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
                    <FaSpinner style={styles.spinAnimation} />
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