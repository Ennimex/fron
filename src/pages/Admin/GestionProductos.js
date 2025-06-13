import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { styles } from "../../styles/gestionProductosStyles";

const GestionProductos = () => {
  // Hooks y estados
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Estados para datos
  const [localidades, setLocalidades] = useState([]);
  const [tallas, setTallas] = useState([]);
  const [productos, setProductos] = useState([]);

  // Estados para UI
  const [showModal, setShowModal] = useState(false); // Unified modal state
  const [isEditMode, setIsEditMode] = useState(false); // Track create vs edit mode
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLocalidad, setFilterLocalidad] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

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

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "admin") return;

      try {
        setLoading(true);
        setError(null);

        const [locResponse, tallasResponse, productosResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/public/localidades", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get("http://localhost:5000/api/public/tallas", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
          axios.get("http://localhost:5000/api/productos", {
            headers: { Authorization: `Bearer ${user.token}` },
          }),
        ]);

        setLocalidades(locResponse.data);
        setTallas(tallasResponse.data);
        setProductos(productosResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Manejadores de eventos para formulario
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
      setError("Por favor, selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe exceder los 5MB");
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (producto.tallasDisponibles.length === 0) {
      setError("Selecciona al menos una talla disponible");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      Object.entries(producto).forEach(([key, value]) => {
        if (key === "tallasDisponibles") {
          value.forEach((t) => formData.append(`tallasDisponibles[]`, t._id));
        } else {
          formData.append(key, value);
        }
      });

      const imageInput = document.querySelector('input[type="file"]');
      if (imageInput.files[0]) {
        formData.append("imagen", imageInput.files[0]);
      }

      let response;
      if (isEditMode) {
        // Update product
        response = await axios.put(
          `http://localhost:5000/api/productos/${producto._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${user.token}`,
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress(percentCompleted);
            },
          }
        );
      } else {
        // Create product
        response = await axios.post("http://localhost:5000/api/productos", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          },
        });
      }

      if (response.status === 201 || response.status === 200) {
        if (isEditMode) {
          setProductos((prev) =>
            prev.map((p) =>
              p._id === producto._id ? response.data.producto : p
            )
          );
          alert("Producto actualizado exitosamente");
        } else {
          setProductos((prev) => [response.data, ...prev]);
          alert("Producto creado exitosamente");
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

        // Recargar productos
        const productosResponse = await axios.get("http://localhost:5000/api/productos", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setProductos(productosResponse.data);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          `Error al ${isEditMode ? "actualizar" : "crear"} el producto. Por favor, intenta nuevamente.`
      );
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleEditProduct = (product) => {
    setProducto({
      _id: product._id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      localidadId: product.localidadId?._id || product.localidadId,
      tipoTela: product.tipoTela,
      tallasDisponibles: product.tallasDisponibles || [],
    });
    setImagePreview(product.imagenURL || null);
    setIsEditMode(true);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/productos/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      setProductos((prev) => prev.filter((p) => p._id !== productId));
      alert("Producto eliminado exitosamente");
    } catch (err) {
      alert("Error al eliminar el producto");
    }
  };

  // Filtrar productos
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLocalidad =
      !filterLocalidad ||
      (typeof producto.localidadId === "object" && producto.localidadId?._id === filterLocalidad) ||
      producto.localidadId === filterLocalidad;

    return matchesSearch && matchesLocalidad;
  });

  // Función para obtener el nombre de la localidad
  const getLocalidadNombre = (localidadId) => {
    if (typeof localidadId === "object" && localidadId !== null) {
      if (localidadId.nombre) {
        return localidadId.nombre;
      }
      const localidad = localidades.find((l) => l._id === localidadId._id);
      if (localidad) return localidad.nombre;
    }

    const localidad = localidades.find((l) => l._id === localidadId);
    if (localidad) return localidad.nombre;

    return "Sin localidad";
  };

  // Función para obtener las tallas específicas de un producto
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

  // Lógica para agrupar tallas
  const groupedTallas = tallas.reduce((acc, talla) => {
    const genero = talla.genero || "Otro";
    if (!acc[genero]) {
      acc[genero] = [];
    }
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

  if (!user || user.role !== "admin") {
    return null;
  }

  if (loading && localidades.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.container}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#64748b", fontSize: "1rem" }}>Cargando sistema de productos...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <style>
        {`
          .form-input:focus {
            outline: none !important;
            border-color: #3498db !important;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1) !important;
          }
          
          .submit-button:hover:not(:disabled) {
            background-color: #2980b9;
          }
          
          .table-row:hover {
            background-color: #f8f9fa;
          }
          
          .action-button:hover {
            opacity: 0.9;
          }
          
          .add-button:hover {
            background-color: #2980b9;
          }
          
          .modal-close:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
        `}
      </style>

      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerContent}>
            <div>
              <h1 style={styles.title}>Gestión de Productos</h1>
              <p style={styles.subtitle}>Administra tu catálogo de productos</p>
            </div>

            <button className="add-button" style={styles.addButton} onClick={() => {
              setIsEditMode(false);
              setProducto({
                nombre: "",
                descripcion: "",
                localidadId: "",
                tipoTela: "",
                tallasDisponibles: [],
              });
              setImagePreview(null);
              setShowModal(true);
            }}>
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {error && <div style={styles.error}>{error}</div>}

          {/* Controles */}
          <div style={styles.controlsContainer}>
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={styles.searchInput}
                className="form-input"
              />
              <select
                value={filterLocalidad}
                onChange={(e) => setFilterLocalidad(e.target.value)}
                style={styles.filterSelect}
                className="form-input"
              >
                <option value="">Todas las localidades</option>
                {localidades.map((localidad) => (
                  <option key={localidad._id} value={localidad._id}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ fontSize: "0.9rem", color: "#64748b" }}>Total: {filteredProducts.length} productos</div>
          </div>

          {/* Tabla de productos */}
          {filteredProducts.length > 0 ? (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
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
                      <tr key={producto._id} className="table-row" style={styles.tableRow}>
                        <td style={styles.tableCell}>
                          <img
                            src={producto.imagenURL || "/placeholder.svg?height=50&width=50"}
                            alt={producto.nombre}
                            style={styles.productImage}
                          />
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.productName}>{producto.nombre}</div>
                          <div style={styles.productDescription}>
                            {producto.descripcion.length > 80
                              ? `${producto.descripcion.substring(0, 80)}...`
                              : producto.descripcion}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.badge}>{getLocalidadNombre(producto.localidadId)}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <span style={styles.badge}>{producto.tipoTela}</span>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                            {productSizes.map((talla) => (
                              <span key={talla._id} style={styles.sizeBadge}>
                                {talla.talla}
                                {talla.rangoEdad && ` (${talla.rangoEdad})`}
                                {talla.medida && ` (${talla.medida})`}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={styles.tableCell}>
                          <div style={styles.actionsContainer}>
                            <button
                              className="action-button"
                              style={{ ...styles.actionButton, ...styles.viewButton }}
                              onClick={() => setSelectedProduct(producto)}
                            >
                              Ver
                            </button>
                            <button
                              className="action-button"
                              style={{ ...styles.actionButton, ...styles.editButton }}
                              onClick={() => handleEditProduct(producto)}
                            >
                              Editar
                            </button>
                            <button
                              className="action-button"
                              style={{ ...styles.actionButton, ...styles.deleteButton }}
                              onClick={() => handleDeleteProduct(producto._id)}
                            >
                              Eliminar
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
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>{isEditMode ? "Editar Producto" : "Agregar Nuevo Producto"}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} style={styles.modalCloseButton}>
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              {error && <div style={styles.error}>{error}</div>}

              <form onSubmit={handleSubmit}>
                <div style={styles.formGrid}>
                  {/* Campo Nombre */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="nombre">
                      Nombre<span style={styles.requiredField}>*</span>
                    </label>
                    <input
                      className="form-input"
                      style={styles.input}
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={producto.nombre}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Nombre del producto"
                    />
                  </div>

                  {/* Campo Localidad */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="localidadId">
                      Localidad<span style={styles.requiredField}>*</span>
                    </label>
                    <select
                      className="form-input"
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

                  {/* Campo Tipo de Tela */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="tipoTela">
                      Tipo de Tela<span style={styles.requiredField}>*</span>
                    </label>
                    <input
                      className="form-input"
                      style={styles.input}
                      type="text"
                      id="tipoTela"
                      name="tipoTela"
                      value={producto.tipoTela}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Ej: Algodón"
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  {/* Campo Descripción */}
                  <div style={styles.formGroup}>
                    <label style={styles.label} htmlFor="descripcion">
                      Descripción<span style={styles.requiredField}>*</span>
                    </label>
                    <textarea
                      className="form-input"
                      style={styles.textarea}
                      id="descripcion"
                      name="descripcion"
                      value={producto.descripcion}
                      onChange={handleChange}
                      required
                      disabled={loading}
                      placeholder="Descripción del producto"
                    />
                  </div>

                  {/* Campo Imagen */}
                  <div style={styles.formGroup}>
                    <label style={styles.label}>
                      Imagen{isEditMode ? "" : <span style={styles.requiredField}>*</span>}
                    </label>
                    <div
                      className="form-input"
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
                        <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" style={styles.previewImage} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Campo Tallas Disponibles */}
                <div style={{ ...styles.formGroup, ...styles.tallasSection }}>
                  <label style={styles.label}>
                    Tallas Disponibles<span style={styles.requiredField}>*</span>
                    <span style={{ ...styles.helpText, marginLeft: "0.5rem", display: "inline" }}>
                      (Seleccione al menos una)
                    </span>
                  </label>
                  <div style={styles.tallasContainer}>
                    {orderedGroupedTallas.map(([genero, sizes]) => (
                      <div key={genero} style={styles.genderGroup}>
                        <h4 style={styles.genderTitle}>{genero}</h4>
                        <div style={styles.sizesGrid}>
                          {sizes.map((talla) => {
                            const isSelected = producto.tallasDisponibles.some((t) => t._id === talla._id);
                            return (
                              <label
                                key={talla._id}
                                style={{
                                  ...styles.tallaCheckbox,
                                  ...(isSelected ? styles.tallaCheckboxSelected : {}),
                                }}
                              >
                                <input
                                  style={styles.checkbox}
                                  type="checkbox"
                                  id={`talla-${talla._id}`}
                                  checked={isSelected}
                                  onChange={() => handleTallaChange(talla._id)}
                                  disabled={loading}
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

                {/* Barra de progreso */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={styles.progressContainer}>
                    <div style={styles.progressBar}>
                      <div style={{ ...styles.progressBarFill, width: `${uploadProgress}%` }}></div>
                    </div>
                    <div style={styles.progressText}>Subiendo... {uploadProgress}%</div>
                  </div>
                )}

                {/* Botones de acción */}
                <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
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
                    className="submit-button"
                    style={{
                      ...styles.submitButton,
                      ...(loading ? styles.submitButtonDisabled : {}),
                      flex: "2",
                      marginTop: 0,
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
              <button className="modal-close" onClick={() => setSelectedProduct(null)} style={styles.modalCloseButton}>
                ×
              </button>
            </div>

            <div style={styles.modalBody}>
              {/* Product Header Section */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "200px 1fr",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                {/* Product Image */}
                <div
                  style={{
                    height: "200px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #e2e8f0",
                  }}
                >
                  <img
                    src={selectedProduct.imagenURL || "/placeholder.svg"}
                    alt={selectedProduct.nombre}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                    }}
                  />
                </div>

                {/* Product Basic Info */}
                <div>
                  <h3
                    style={{
                      color: "#1a2332",
                      marginBottom: "0.75rem",
                      fontSize: "1.5rem",
                      fontWeight: "700",
                      lineHeight: "1.3",
                    }}
                  >
                    {selectedProduct.nombre}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: "#e3f2fd",
                        color: "#1565c0",
                        fontWeight: "600",
                      }}
                    >
                      📍 {getLocalidadNombre(selectedProduct.localidadId)}
                    </span>
                    <span
                      style={{
                        ...styles.badge,
                        backgroundColor: "#f3e5f5",
                        color: "#7b1fa2",
                        fontWeight: "600",
                      }}
                    >
                      🧵 {selectedProduct.tipoTela}
                    </span>
                  </div>

                  <div
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: "1rem",
                      borderRadius: "8px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <h4
                      style={{
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        fontSize: "0.85rem",
                        fontWeight: "600",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      Descripción
                    </h4>
                    <p
                      style={{
                        color: "#475569",
                        fontSize: "0.95rem",
                        lineHeight: "1.6",
                        margin: 0,
                      }}
                    >
                      {selectedProduct.descripcion}
                    </p>
                  </div>
                </div>
              </div>

              {/* Available Sizes Section */}
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  borderRadius: "8px",
                  padding: "1.5rem",
                  border: "1px solid #e2e8f0",
                }}
              >
                <h4
                  style={{
                    color: "#1a2332",
                    marginBottom: "1.25rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                  }}
                >
                  📏 Tallas Disponibles
                </h4>

                {orderedGroupedTallas.map(([genero, sizes]) => {
                  const availableSizes = sizes.filter((t) =>
                    selectedProduct.tallasDisponibles?.some((st) => st._id === t._id)
                  );

                  if (availableSizes.length === 0) return null;

                  return (
                    <div key={genero} style={{ marginBottom: "1.5rem" }}>
                      <h5
                        style={{
                          color: "#64748b",
                          marginBottom: "0.75rem",
                          fontSize: "0.9rem",
                          fontWeight: "600",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span
                          style={{
                            width: "8px",
                            height: "8px",
                            backgroundColor: "#3498db",
                            borderRadius: "50%",
                          }}
                        ></span>
                        {genero}
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "0.5rem",
                        }}
                      >
                        {availableSizes.map((talla) => (
                          <div
                            key={talla._id}
                            style={{
                              backgroundColor: "#3498db",
                              color: "white",
                              padding: "0.5rem 1rem",
                              borderRadius: "6px",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              boxShadow: "0 2px 4px rgba(52, 152, 219, 0.2)",
                              border: "1px solid #2980b9",
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
                  <div
                    style={{
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: "0.95rem",
                      fontStyle: "italic",
                      padding: "2rem",
                    }}
                  >
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