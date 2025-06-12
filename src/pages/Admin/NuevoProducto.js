"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"

const GestionProductos = () => {
  // Hooks y estados
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()

  // Estados para datos
  const [localidades, setLocalidades] = useState([])
  const [tallas, setTallas] = useState([])
  const [productos, setProductos] = useState([])

  // Estados para UI
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterLocalidad, setFilterLocalidad] = useState("")
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    localidadId: "",
    tipoTela: "",
    tallasDisponibles: [],
  })

  // Verificar autenticación y rol
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } })
      return
    }
    if (user.role !== "admin") {
      navigate("/no-autorizado")
    }
  }, [user, navigate, location])

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      if (!user || user.role !== "admin") return

      try {
        setLoading(true)
        setError(null)

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
        ])

        setLocalidades(locResponse.data)
        setTallas(tallasResponse.data)
        setProductos(productosResponse.data)
      } catch (err) {
        setError(err.response?.data?.message || err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  // Manejadores de eventos para formulario
  const handleChange = (e) => {
    const { name, value } = e.target
    console.log(`Input changed: ${name} = ${value}`)
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTallaChange = (tallaId) => {
    setProducto((prev) => {
      const exists = prev.tallasDisponibles.some((t) => t._id === tallaId)
      if (exists) {
        console.log(`Talla removed: ${tallaId}`)
        return {
          ...prev,
          tallasDisponibles: prev.tallasDisponibles.filter((t) => t._id !== tallaId),
        }
      } else {
        const talla = tallas.find((t) => t._id === tallaId)
        console.log(`Talla added: ${tallaId} (${talla.talla})`)
        return {
          ...prev,
          tallasDisponibles: [...prev.tallasDisponibles, talla],
        }
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) {
      console.log("No image selected")
      return
    }

    if (!file.type.match("image.*")) {
      console.log("Invalid file type selected")
      setError("Por favor, selecciona un archivo de imagen válido")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log(`Image too large: ${file.size} bytes`)
      setError("La imagen no debe exceder los 5MB")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      console.log(`Image preview generated: ${file.name}`)
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (producto.tallasDisponibles.length === 0) {
      console.log("Form submission failed: No tallas selected")
      setError("Selecciona al menos una talla disponible")
      return
    }

    console.log("Submitting form with data:", {
      ...producto,
      tallasDisponibles: producto.tallasDisponibles.map((t) => t._id),
    })

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      Object.entries(producto).forEach(([key, value]) => {
        if (key === "tallasDisponibles") {
          // Append each talla ID as part of an array
          value.forEach((t) => formData.append(`tallasDisponibles[]`, t._id))
        } else {
          formData.append(key, value)
        }
      })

      const imageInput = document.querySelector('input[type="file"]')
      if (imageInput.files[0]) {
        console.log(`Appending image to form: ${imageInput.files[0].name}`)
        formData.append("imagen", imageInput.files[0])
      }

      console.log("Sending POST request to create product")
      const response = await axios.post("http://localhost:5000/api/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          console.log(`Upload progress: ${percentCompleted}%`)
          setUploadProgress(percentCompleted)
        },
      })

      if (response.status === 201) {
        console.log("Product created successfully:", response.data)
        setProductos((prev) => [response.data, ...prev])
        setProducto({
          nombre: "",
          descripcion: "",
          localidadId: "",
          tipoTela: "",
          tallasDisponibles: [],
        })
        setImagePreview(null)
        setShowCreateModal(false)
        setError(null)
        alert("Producto creado exitosamente")
      }
    } catch (err) {
      console.error("Error during form submission:", err)
      setError(
        err.response?.data?.message || err.message || "Error al crear el producto. Por favor, intenta nuevamente.",
      )
    } finally {
      console.log("Form submission completed, resetting loading state")
      setLoading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      return
    }

    try {
      await axios.delete(`http://localhost:5000/api/productos/${productId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })

      setProductos((prev) => prev.filter((p) => p._id !== productId))
      alert("Producto eliminado exitosamente")
    } catch (err) {
      alert("Error al eliminar el producto")
    }
  }

  // Filtrar productos
  const filteredProducts = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocalidad =
      !filterLocalidad ||
      (typeof producto.localidadId === "object" && producto.localidadId?._id === filterLocalidad) ||
      producto.localidadId === filterLocalidad

    return matchesSearch && matchesLocalidad
  })

  // Función para obtener el nombre de la localidad
  const getLocalidadNombre = (localidadId) => {
    if (typeof localidadId === "object" && localidadId !== null) {
      if (localidadId.nombre) {
        return localidadId.nombre
      }
      const localidad = localidades.find((l) => l._id === localidadId._id)
      if (localidad) return localidad.nombre
    }

    const localidad = localidades.find((l) => l._id === localidadId)
    if (localidad) return localidad.nombre

    return "Sin localidad"
  }

  // Función para obtener las tallas específicas de un producto
  const getProductSizes = (tallasDisponibles) => {
    if (!tallasDisponibles || tallasDisponibles.length === 0) return []
    return tallasDisponibles.map((t) => ({
      _id: t._id,
      talla: t.talla,
      rangoEdad: t.rangoEdad,
      medida: t.medida,
      genero: t.genero,
    }))
  }

  // Lógica para agrupar tallas
  const groupedTallas = tallas.reduce((acc, talla) => {
    const genero = talla.genero || "Otro"
    if (!acc[genero]) {
      acc[genero] = []
    }
    acc[genero].push(talla)
    return acc
  }, {})

  const genderOrder = ["Niño", "Niña", "Dama", "Caballero"]
  const orderedGroupedTallas = Object.entries(groupedTallas).sort(([generoA], [generoB]) => {
    const indexA = genderOrder.indexOf(generoA)
    const indexB = genderOrder.indexOf(generoB)
    if (indexA === -1 && indexB === -1) return 0
    if (indexA === -1) return 1
    if (indexB === -1) return -1
    return indexA - indexB
  })

  // Estilos
  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      padding: "1.5rem",
    },
    container: {
      maxWidth: "1400px",
      margin: "0 auto",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    header: {
      background: "#1a2332",
      padding: "1.5rem 2rem",
      color: "white",
      borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
    },
    headerContent: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "1rem",
    },
    title: {
      fontSize: "1.75rem",
      fontWeight: "600",
      margin: "0",
      color: "#ffffff",
    },
    subtitle: {
      fontSize: "0.95rem",
      opacity: "0.8",
      margin: "0.5rem 0 0 0",
      color: "#e2e8f0",
    },
    addButton: {
      padding: "0.75rem 1.5rem",
      borderRadius: "4px",
      backgroundColor: "#3498db",
      color: "white",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontWeight: "500",
      fontSize: "0.95rem",
      border: "none",
    },
    content: {
      padding: "2rem",
    },
    controlsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "2rem",
      flexWrap: "wrap",
      gap: "1rem",
    },
    searchContainer: {
      display: "flex",
      gap: "1rem",
      alignItems: "center",
      flexWrap: "wrap",
    },
    searchInput: {
      padding: "0.6rem 1rem",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      fontSize: "0.95rem",
      minWidth: "250px",
    },
    filterSelect: {
      padding: "0.6rem 1rem",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      fontSize: "0.95rem",
      backgroundColor: "white",
      minWidth: "200px",
    },
    tableContainer: {
      overflowX: "auto",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      backgroundColor: "white",
    },
    tableHeader: {
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e2e8f0",
    },
    tableHeaderCell: {
      padding: "1rem",
      textAlign: "left",
      fontWeight: "600",
      color: "#1a2332",
      fontSize: "0.9rem",
      borderRight: "1px solid #e2e8f0",
    },
    tableRow: {
      borderBottom: "1px solid #f1f3f4",
      transition: "background-color 0.2s ease",
    },
    tableCell: {
      padding: "1rem",
      borderRight: "1px solid #f1f3f4",
      fontSize: "0.9rem",
      color: "#374151",
      whiteSpace: "normal",
    },
    productImage: {
      width: "50px",
      height: "50px",
      objectFit: "cover",
      borderRadius: "4px",
      border: "1px solid #e2e8f0",
    },
    productName: {
      fontWeight: "600",
      color: "#1a2332",
      marginBottom: "0.25rem",
    },
    productDescription: {
      color: "#64748b",
      fontSize: "0.85rem",
    },
    badge: {
      padding: "0.25rem 0.75rem",
      borderRadius: "4px",
      fontSize: "0.8rem",
      fontWeight: "500",
      backgroundColor: "#e2e8f0",
      color: "#1a2332",
    },
    sizeBadge: {
      padding: "0.2rem 0.5rem",
      borderRadius: "3px",
      fontSize: "0.7rem",
      fontWeight: "500",
      backgroundColor: "#3498db",
      color: "white",
      margin: "0.1rem",
      display: "inline-block",
    },
    actionsContainer: {
      display: "flex",
      gap: "0.5rem",
    },
    actionButton: {
      padding: "0.4rem 0.75rem",
      borderRadius: "4px",
      border: "none",
      cursor: "pointer",
      fontSize: "0.8rem",
      fontWeight: "500",
      transition: "all 0.2s ease",
    },
    editButton: {
      backgroundColor: "#3498db",
      color: "white",
    },
    deleteButton: {
      backgroundColor: "#e74c3c",
      color: "white",
    },
    viewButton: {
      backgroundColor: "#2ecc71",
      color: "white",
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: "white",
      borderRadius: "6px",
      width: "90%",
      maxWidth: "800px",
      maxHeight: "90vh",
      overflow: "auto",
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
    },
    modalHeader: {
      padding: "1rem 1.5rem",
      borderBottom: "1px solid #e2e8f0",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#1a2332",
      color: "white",
    },
    modalTitle: {
      margin: 0,
      fontSize: "1.1rem",
      fontWeight: "600",
    },
    modalBody: {
      padding: "1.5rem",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "1rem",
    },
    formGroup: {
      marginBottom: "1rem",
    },
    label: {
      display: "block",
      marginBottom: "0.35rem",
      fontWeight: "500",
      color: "#1a2332",
      fontSize: "0.85rem",
    },
    input: {
      width: "100%",
      padding: "0.6rem 0.75rem",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      fontSize: "0.9rem",
      transition: "all 0.2s ease-in-out",
      backgroundColor: "#ffffff",
      boxSizing: "border-box",
    },
    textarea: {
      width: "100%",
      padding: "0.6rem 0.75rem",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      minHeight: "100px",
      fontSize: "0.9rem",
      resize: "vertical",
      transition: "all 0.2s ease-in-out",
      backgroundColor: "#ffffff",
      fontFamily: "inherit",
      boxSizing: "border-box",
    },
    select: {
      width: "100%",
      padding: "0.6rem 0.75rem",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      fontSize: "0.9rem",
      backgroundColor: "#ffffff",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      boxSizing: "border-box",
    },
    imageUploadArea: {
      border: "1px dashed #cbd5e1",
      borderRadius: "4px",
      padding: "1rem",
      textAlign: "center",
      transition: "all 0.2s ease-in-out",
      backgroundColor: "#f8fafc",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100px",
    },
    fileInput: {
      display: "none",
    },
    uploadText: {
      color: "#475569",
      fontSize: "0.9rem",
      marginBottom: "0.25rem",
    },
    uploadSubtext: {
      color: "#94a3b8",
      fontSize: "0.8rem",
    },
    previewContainer: {
      marginTop: "0.75rem",
      textAlign: "center",
    },
    previewImage: {
      maxWidth: "150px",
      maxHeight: "150px",
      borderRadius: "4px",
      objectFit: "cover",
      border: "1px solid #e2e8f0",
    },
    tallasSection: {
      gridColumn: "1 / -1",
      marginTop: "0.5rem",
    },
    tallasContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      marginTop: "0.5rem",
    },
    genderGroup: {
      backgroundColor: "#f8fafc",
      borderRadius: "4px",
      padding: "1rem",
      border: "1px solid #e2e8f0",
    },
    genderTitle: {
      marginBottom: "0.75rem",
      color: "#1a2332",
      fontSize: "0.9rem",
      fontWeight: "600",
    },
    sizesGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: "0.5rem",
    },
    tallaCheckbox: {
      display: "flex",
      alignItems: "center",
      gap: "0.4rem",
      padding: "0.4rem 0.6rem",
      backgroundColor: "#ffffff",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease-in-out",
      border: "1px solid #e2e8f0",
      fontSize: "0.8rem",
      fontWeight: "500",
    },
    tallaCheckboxSelected: {
      backgroundColor: "#3498db",
      borderColor: "#3498db",
      color: "#ffffff",
    },
    checkbox: {
      width: "16px",
      height: "16px",
      cursor: "pointer",
      accentColor: "#3498db",
    },
    submitButton: {
      backgroundColor: "#3498db",
      color: "white",
      padding: "0.75rem 1.5rem",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "1rem",
      fontWeight: "600",
      width: "100%",
      marginTop: "1.5rem",
      transition: "all 0.2s ease-in-out",
    },
    submitButtonDisabled: {
      backgroundColor: "#94a3b8",
      cursor: "not-allowed",
    },
    error: {
      color: "#e74c3c",
      backgroundColor: "#fef2f2",
      border: "1px solid #fecaca",
      padding: "0.75rem 1rem",
      borderRadius: "4px",
      textAlign: "center",
      fontSize: "0.9rem",
      marginBottom: "1.5rem",
    },
    progressContainer: {
      marginTop: "1.5rem",
    },
    progressBar: {
      width: "100%",
      height: "6px",
      backgroundColor: "#e2e8f0",
      borderRadius: "3px",
      overflow: "hidden",
      marginBottom: "0.5rem",
    },
    progressBarFill: {
      height: "100%",
      borderRadius: "3px",
      backgroundColor: "#3498db",
      width: `${uploadProgress}%`,
      transition: "width 0.3s ease",
    },
    progressText: {
      textAlign: "center",
      fontSize: "0.85rem",
      color: "#64748b",
      fontWeight: "500",
    },
    requiredField: {
      color: "#e74c3c",
      marginLeft: "4px",
    },
    helpText: {
      fontSize: "0.85rem",
      color: "#64748b",
      marginTop: "0.5rem",
    },
    emptyState: {
      textAlign: "center",
      padding: "3rem 2rem",
      color: "#64748b",
    },
    emptyStateText: {
      fontSize: "1.1rem",
      fontWeight: "600",
      marginBottom: "0.5rem",
      color: "#1a2332",
    },
    emptyStateSubtext: {
      fontSize: "0.95rem",
      color: "#64748b",
    },
    modalCloseButton: {
      background: "none",
      border: "none",
      color: "white",
      fontSize: "1.5rem",
      cursor: "pointer",
      padding: "0.5rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  }

  if (!user || user.role !== "admin") {
    return null
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
    )
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

            <button className="add-button" style={styles.addButton} onClick={() => setShowCreateModal(true)}>
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
                    const productSizes = getProductSizes(producto.tallasDisponibles)
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
                              onClick={() => {
                                alert("Función de edición próximamente")
                              }}
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
                    )
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

      {/* Modal para crear producto */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => setShowCreateModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Agregar Nuevo Producto</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)} style={styles.modalCloseButton}>
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
                      Imagen<span style={styles.requiredField}>*</span>
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
                        required
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
                            const isSelected = producto.tallasDisponibles.some((t) => t._id === talla._id)
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
                            )
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
                      <div style={styles.progressBarFill}></div>
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
                    onClick={() => setShowCreateModal(false)}
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
                    {loading ? "Procesando..." : "Guardar Producto"}
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
  )
}

export default GestionProductos