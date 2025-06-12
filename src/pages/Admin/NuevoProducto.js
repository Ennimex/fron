"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import axios from "axios"
import { useAuth } from "../../context/AuthContext"
import "../../styles/GestionProductos.css"

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
    setProducto((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTallaChange = (tallaId) => {
    setProducto((prev) => {
      const exists = prev.tallasDisponibles.some((t) => t._id === tallaId)
      if (exists) {
        return {
          ...prev,
          tallasDisponibles: prev.tallasDisponibles.filter((t) => t._id !== tallaId),
        }
      } else {
        const talla = tallas.find((t) => t._id === tallaId)
        return {
          ...prev,
          tallasDisponibles: [...prev.tallasDisponibles, talla],
        }
      }
    })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.match("image.*")) {
      setError("Por favor, selecciona un archivo de imagen válido")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no debe exceder los 5MB")
      return
    }

    setError(null)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (producto.tallasDisponibles.length === 0) {
      setError("Selecciona al menos una talla disponible")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()

      Object.entries(producto).forEach(([key, value]) => {
        if (key === "tallasDisponibles") {
          value.forEach((t) => formData.append(`${key}._id`, t._id))
        } else {
          formData.append(key, value)
        }
      })

      const imageInput = document.querySelector('input[type="file"]')
      if (imageInput.files[0]) {
        formData.append("imagen", imageInput.files[0])
      }

      const response = await axios.post("http://localhost:5000/api/productos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        },
      })

      if (response.status === 201) {
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
      console.error("Error al crear producto:", err)
      setError(
        err.response?.data?.message || err.message || "Error al crear el producto. Por favor, intenta nuevamente.",
      )
    } finally {
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

  if (!user || user.role !== "admin") {
    return null
  }

  if (loading && localidades.length === 0) {
    return (
      <div className="page-container">
        <div className="container">
          <div className="loading-container">
            <p className="loading-text">Cargando sistema de productos...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-container">
      <div className="container">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div>
              <h1 className="title">Gestión de Productos</h1>
              <p className="subtitle">Administra tu catálogo de productos</p>
            </div>
            <button className="add-button" onClick={() => setShowCreateModal(true)}>
              Agregar Producto
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="content">
          {error && <div className="error">{error}</div>}

          {/* Controles */}
          <div className="controls-container">
            <div className="search-container">
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input form-input"
              />
              <select
                value={filterLocalidad}
                onChange={(e) => setFilterLocalidad(e.target.value)}
                className="filter-select form-input"
              >
                <option value="">Todas las localidades</option>
                {localidades.map((localidad) => (
                  <option key={localidad._id} value={localidad._id}>
                    {localidad.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="total-products">Total: {filteredProducts.length} productos</div>
          </div>

          {/* Tabla de productos */}
          {filteredProducts.length > 0 ? (
            <div className="table-container">
              <table className="table">
                <thead className="table-header">
                  <tr>
                    <th className="table-header-cell">Imagen</th>
                    <th className="table-header-cell">Producto</th>
                    <th className="table-header-cell">Localidad</th>
                    <th className="table-header-cell">Tipo de Tela</th>
                    <th className="table-header-cell">Tallas Disponibles</th>
                    <th className="table-header-cell">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((producto) => {
                    const productSizes = getProductSizes(producto.tallasDisponibles)
                    return (
                      <tr key={producto._id} className="table-row">
                        <td className="table-cell">
                          <img
                            src={producto.imagenURL || "/placeholder.svg?height=50&width=50"}
                            alt={producto.nombre}
                            className="product-image"
                          />
                        </td>
                        <td className="table-cell">
                          <div className="product-name">{producto.nombre}</div>
                          <div className="product-description">
                            {producto.descripcion.length > 80
                              ? `${producto.descripcion.substring(0, 80)}...`
                              : producto.descripcion}
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="badge">{getLocalidadNombre(producto.localidadId)}</span>
                        </td>
                        <td className="table-cell">
                          <span className="badge">{producto.tipoTela}</span>
                        </td>
                        <td className="table-cell">
                          <div className="sizes-container">
                            {productSizes.map((talla) => (
                              <span key={talla._id} className="size-badge">
                                {talla.talla}
                                {talla.rangoEdad && ` (${talla.rangoEdad})`}
                                {talla.medida && ` (${talla.medida})`}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="actions-container">
                            <button
                              className="action-button view-button"
                              onClick={() => setSelectedProduct(producto)}
                            >
                              Ver
                            </button>
                            <button
                              className="action-button edit-button"
                              onClick={() => {
                                alert("Función de edición próximamente")
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="action-button delete-button"
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
            <div className="empty-state">
              <h3 className="empty-state-text">
                {searchTerm || filterLocalidad ? "No se encontraron productos" : "No hay productos registrados"}
              </h3>
              <p className="empty-state-subtext">
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
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Agregar Nuevo Producto</h2>
              <button className="modal-close" onClick={() => setShowCreateModal(false)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {error && <div className="error">{error}</div>}

              <form onSubmit={handleSubmit}>
                <div className="form-grid">
                  {/* Campo Nombre */}
                  <div className="form-group">
                    <label className="label" htmlFor="nombre">
                      Nombre<span className="required-field">*</span>
                    </label>
                    <input
                      className="form-input input"
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
                  <div className="form-group">
                    <label className="label" htmlFor="localidadId">
                      Localidad<span className="required-field">*</span>
                    </label>
                    <select
                      className="form-input select"
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
                  <div className="form-group">
                    <label className="label" htmlFor="tipoTela">
                      Tipo de Tela<span className="required-field">*</span>
                    </label>
                    <input
                      className="form-input input"
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

                <div className="description-image-grid">
                  {/* Campo Descripción */}
                  <div className="form-group">
                    <label className="label" htmlFor="descripcion">
                      Descripción<span className="required-field">*</span>
                    </label>
                    <textarea
                      className="form-input textarea"
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
                  <div className="form-group">
                    <label className="label">
                      Imagen<span className="required-field">*</span>
                    </label>
                    <div
                      className="form-input image-upload-area"
                      onClick={() => document.getElementById("imagen").click()}
                    >
                      <div className="upload-text">{imagePreview ? "Cambiar imagen" : "Seleccionar imagen"}</div>
                      <div className="upload-subtext">PNG, JPG (máx. 5MB)</div>
                      <input
                        className="file-input"
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
                      <div className="preview-container">
                        <img src={imagePreview || "/placeholder.svg"} alt="Vista previa" className="preview-image" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Campo Tallas Disponibles */}
                <div className="form-group tallas-section">
                  <label className="label">
                    Tallas Disponibles<span className="required-field">*</span>
                    <span className="help-text inline-help-text">(Seleccione al menos una)</span>
                  </label>
                  <div className="tallas-container">
                    {orderedGroupedTallas.map(([genero, sizes]) => (
                      <div key={genero} className="gender-group">
                        <h4 className="gender-title">{genero}</h4>
                        <div className="sizes-grid">
                          {sizes.map((talla) => {
                            const isSelected = producto.tallasDisponibles.some((t) => t._id === talla._id)
                            return (
                              <label
                                key={talla._id}
                                className={`talla-checkbox ${isSelected ? "talla-checkbox-selected" : ""}`}
                              >
                                <input
                                  className="checkbox"
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
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div className="progress-bar-fill" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <div className="progress-text">Subiendo... {uploadProgress}%</div>
                  </div>
                )}

                {/* Botones de acción */}
                <div className="form-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={() => setShowCreateModal(false)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`submit-button ${loading ? "submit-button-disabled" : ""}`}
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
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content product-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Detalles del Producto</h2>
              <button className="modal-close" onClick={() => setSelectedProduct(null)}>
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* Product Header Section */}
              <div className="product-view-header">
                {/* Product Image */}
                <div className="product-view-image-container">
                  <img
                    src={selectedProduct.imagenURL || "/placeholder.svg"}
                    alt={selectedProduct.nombre}
                    className="product-view-image"
                  />
                </div>

                {/* Product Basic Info */}
                <div className="product-view-info">
                  <h3 className="product-view-title">{selectedProduct.nombre}</h3>
                  <div className="product-view-badges">
                    <span className="badge product-view-badge-localidad">
                      📍 {getLocalidadNombre(selectedProduct.localidadId)}
                    </span>
                    <span className="badge product-view-badge-tela">🧵 {selectedProduct.tipoTela}</span>
                  </div>
                  <div className="product-view-description-container">
                    <h4 className="product-view-description-label">Descripción</h4>
                    <p className="product-view-description">{selectedProduct.descripcion}</p>
                  </div>
                </div>
              </div>

              {/* Available Sizes Section */}
              <div className="product-view-sizes-container">
                <h4 className="product-view-sizes-title">📏 Tallas Disponibles</h4>
                {orderedGroupedTallas.map(([genero, sizes]) => {
                  const availableSizes = sizes.filter((t) =>
                    selectedProduct.tallasDisponibles?.some((st) => st._id === t._id)
                  )
                  if (availableSizes.length === 0) return null
                  return (
                    <div key={genero} className="product-view-gender-group">
                      <h5 className="product-view-gender-title">
                        <span className="product-view-gender-indicator"></span>
                        {genero}
                      </h5>
                      <div className="product-view-sizes-grid">
                        {availableSizes.map((talla) => (
                          <div key={talla._id} className="product-view-size-item">
                            {talla.talla}
                            {talla.rangoEdad && <span className="product-view-size-detail"> ({talla.rangoEdad})</span>}
                            {talla.medida && <span className="product-view-size-detail"> - {talla.medida}</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
                {selectedProduct.tallasDisponibles?.length === 0 && (
                  <div className="product-view-no-sizes">No hay tallas disponibles para este producto</div>
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