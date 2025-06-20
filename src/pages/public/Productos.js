import React, { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import productos from "../../services/base"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import { useAuth } from '../../context/AuthContext'
import stylesPublic from "../../styles/stylesPublic" // Importamos el sistema centralizado de estilos

const ProductoCard = React.memo(({ producto, vistaGrilla, handleProductClick, animationDelay }) => {
  const key = `${producto._id}-${vistaGrilla ? 'grid' : 'list'}`;
  
  return (
    <div
      key={key}
      className={`productos-product-card ${vistaGrilla ? "grid-view" : "list-view"} animate-in`}
      style={{ animationDelay: `${animationDelay}s` }}
      onClick={(e) => handleProductClick(producto._id, e)}
    >
      <div className={`productos-product-content ${vistaGrilla ? "grid-view" : "list-view"}`}>
        <div className={`productos-product-image-container ${vistaGrilla ? "grid-view" : "list-view"}`}>
          <img
            src={producto.image || "/placeholder.svg"}
            alt={producto.title}
            className="productos-product-image"
            loading="lazy"
          />
        </div>
        <div className={`productos-product-details ${vistaGrilla ? "grid-view" : "list-view"}`}>
          <h3 className={`productos-product-title ${vistaGrilla ? "" : "list-view"}`}>{producto.title}</h3>
          <p className="productos-product-description">{producto.description}</p>
          <button className="productos-view-more-button" onClick={(e) => handleProductClick(producto._id, e)}>
            Ver más
          </button>
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  return prevProps.producto._id === nextProps.producto._id && 
         prevProps.vistaGrilla === nextProps.vistaGrilla &&
         prevProps.animationDelay === nextProps.animationDelay;
})

const Productos = () => {
  const { isAuthenticated } = useAuth(); // Solo desestructuramos lo que necesitamos
  const navigate = useNavigate()
  const location = useLocation()
  const [filtros, setFiltros] = useState({
    ordenar: "",
    talla: "",
    categoria: "",
    color: "",
    material: "",
    precio: "",
    busqueda: "",
  })
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false)
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [filtrosActivos, setFiltrosActivos] = useState(0)
  const [vistaGrilla, setVistaGrilla] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // Precarga las imágenes
    productos.forEach((producto) => {
      const img = new Image()
      img.src = producto.image
    })

    setProductosFiltrados(productos)
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handleChange = (e) => {
    const newFiltros = { ...filtros, [e.target.name]: e.target.value }
    setFiltros(newFiltros)

    // Filtra los productos inmediatamente
    const { resultado, contadorFiltros } = filtrarProductos(productos, newFiltros)
    setProductosFiltrados(resultado)
    setFiltrosActivos(contadorFiltros)
  }

  const limpiarFiltros = () => {
    const resetFiltros = {
      ordenar: "",
      talla: "",
      categoria: "",
      color: "",
      material: "",
      precio: "",
      busqueda: "",
    }

    setFiltros(resetFiltros)
    document.querySelectorAll(".form-select").forEach((select) => (select.value = ""))
    const searchInput = document.querySelector("input[name='busqueda']")
    if (searchInput) searchInput.value = ""

    const { resultado, contadorFiltros } = filtrarProductos(productos, resetFiltros)
    setProductosFiltrados(resultado)
    setFiltrosActivos(contadorFiltros)
  }

  const toggleFiltros = () => {
    setFiltrosExpandidos(!filtrosExpandidos)
  }

  const toggleVistaGrilla = () => {
    if (isTransitioning) return
    
    setIsTransitioning(true)
    setTimeout(() => {
      setVistaGrilla(!vistaGrilla)
      setTimeout(() => setIsTransitioning(false), 300)
    }, 50)
  }

  const handleProductClick = (productoId, event) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }
    navigate(`/producto/${productoId}`)
  }

  const filtrarProductos = useCallback((productos, filtros) => {
    let resultado = [...productos]
    let contadorFiltros = 0

    if (filtros.busqueda) {
      const searchTerm = filtros.busqueda.toLowerCase()
      resultado = resultado.filter(
        (producto) =>
          producto.title.toLowerCase().includes(searchTerm) ||
          producto.description.toLowerCase().includes(searchTerm) ||
          producto.category.toLowerCase().includes(searchTerm),
      )
      contadorFiltros++
    }

    if (filtros.categoria) {
      resultado = resultado.filter((producto) => producto.category.toLowerCase() === filtros.categoria.toLowerCase())
      contadorFiltros++
    }

    if (filtros.color) {
      resultado = resultado.filter((producto) => producto.color.toLowerCase() === filtros.color.toLowerCase())
      contadorFiltros++
    }

    if (filtros.material) {
      resultado = resultado.filter((producto) =>
        producto.material.toLowerCase().includes(filtros.material.toLowerCase()),
      )
      contadorFiltros++
    }

    if (filtros.talla) {
      resultado = resultado.filter((producto) => producto.talla.includes(filtros.talla))
      contadorFiltros++
    }

    if (filtros.precio) {
      switch (filtros.precio) {
        case "low":
          resultado = resultado.filter((producto) => producto.price < 50)
          break
        case "medium":
          resultado = resultado.filter((producto) => producto.price >= 50 && producto.price <= 100)
          break
        case "high":
          resultado = resultado.filter((producto) => producto.price > 100)
          break
        default:
          break
      }
      contadorFiltros++
    }

    if (filtros.ordenar) {
      if (filtros.ordenar === "asc") {
        resultado.sort((a, b) => a.price - b.price)
      } else if (filtros.ordenar === "desc") {
        resultado.sort((a, b) => b.price - a.price)
      } else if (filtros.ordenar === "rating") {
        resultado.sort((a, b) => b.rating - a.rating)
      } else if (filtros.ordenar === "newest") {
        resultado.sort((a, b) => b._id.localeCompare(a._id))
      }
      contadorFiltros++
    }

    return { resultado, contadorFiltros }
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const categoria = query.get("categoria")
    const initialFiltros = {
      ordenar: "",
      talla: "",
      categoria: categoria || "",
      color: "",
      material: "",
      precio: "",
      busqueda: "",
    }
    setFiltros(initialFiltros)
    const { resultado, contadorFiltros } = filtrarProductos(productos, initialFiltros)
    setProductosFiltrados(resultado)
    setFiltrosActivos(contadorFiltros)
  }, [location.search, filtrarProductos])
  const customStyles = {
    section: {
      padding: stylesPublic.spacing.section.large,
      maxWidth: stylesPublic.utils.container.maxWidth,
      margin: stylesPublic.spacing.margin.auto,
      background: stylesPublic.colors.background.gradient.secondary,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.pageIn,
      position: "relative",
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: stylesPublic.elements.backgroundPatterns.geometric,
      opacity: 0.8,
      zIndex: stylesPublic.utils.zIndex.background,
    },
    titleUnderline: stylesPublic.elements.decorative.underline,
    pinkButton: {
      ...stylesPublic.elements.buttons.primary,
      ...stylesPublic.elements.buttons.small,
    },
  }
  const cssStyles = `
    :root {
      --huasteca-red: ${stylesPublic.colors.primary.main};
      --huasteca-green: ${stylesPublic.colors.secondary.main};
      --huasteca-beige: ${stylesPublic.colors.background.alt};
      --huasteca-yellow: ${stylesPublic.colors.background.main};
      --huasteca-dark: ${stylesPublic.colors.text.primary};
    }

    .productos-container {
      background: ${stylesPublic.colors.background.gradient.secondary};
      min-height: calc(100vh - 76px);
      padding-top: 30px;
      padding-bottom: 60px;
      font-family: ${stylesPublic.typography.fontFamily.heading};
    }

    .productos-header {
      margin-bottom: 30px;
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .productos-title {
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 600;
      color: var(--huasteca-dark);
    }

    .productos-subtitle {
      font-size: clamp(1rem, 2vw, 1.2rem);
      font-weight: 300;
      color: #403a3c;
      max-width: 800px;
      margin: 0 auto 3rem;
      letter-spacing: 0.5px;
    }

    .productos-filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255,255,255,0.9);
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(255, 0, 112, 0.2);
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }

    .productos-search-container {
      position: relative;
      flex: 1;
      max-width: 400px;
    }

    .productos-search-input {
      width: 100%;
      padding: 10px 15px 10px 40px;
      border-radius: 8px;
      border: 1px solid var(--huasteca-red);
      font-size: 0.9375rem;
      background-color: #f8f9fa;
    }

    .productos-search-input:focus {
      outline: none;
      border-color: var(--huasteca-green);
      box-shadow: 0 0 5px rgba(31, 138, 128, 0.5);
    }

    .productos-search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--huasteca-red);
    }

    .productos-filter-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .productos-filter-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      border: 1px solid var(--huasteca-red);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      font-size: 0.875rem;
      background-color: var(--huasteca-beige);
      color: var(--huasteca-red);
    }

    .productos-filter-button.expanded {
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-filter-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0 6px;
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-filter-count.active {
      background-color: #ff1030;
    }

    .productos-view-toggle {
      display: flex;
      align-items: center;
    }

    .productos-view-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-left: 8px;
      background-color: #e9ecef;
      color: var(--huasteca-red);
    }

    .productos-view-button.active {
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-view-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .productos-filter-panel {
      background: rgba(255,255,255,0.9);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 8px 16px rgba(255, 0, 112, 0.2);
      display: none;
      position: relative;
      z-index: 2;
    }

    .productos-filter-panel.expanded {
      display: block;
    }

    .productos-filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .productos-filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--huasteca-red);
      margin-bottom: 8px;
    }

    .productos-filter-select.form-select {
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--huasteca-red);
      background-color: var(--huasteca-yellow);
      font-size: 0.875rem;
    }

    .productos-clear-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      color: var(--huasteca-red);
      background-color: rgba(255, 0, 112, 0.1);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .productos-clear-button:hover {
      background-color: rgba(255, 0, 112, 0.2);
    }

    .productos-apply-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      color: var(--huasteca-beige);
      background-color: var(--huasteca-red);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
    }

    .productos-apply-button:hover {
      background-color: var(--huasteca-green);
    }

    .productos-results-info {
      font-size: 0.9375rem;
      color: var(--huasteca-dark);
      margin-bottom: 20px;
      position: relative;
      z-index: 2;
    }

    .productos-product-grid {
      display: grid;
      gap: 20px;
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .productos-product-grid.grid-view {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .productos-product-grid.list-view {
      grid-template-columns: 1fr;
    }

    .productos-product-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15);
      border: 1px solid rgba(232, 180, 184, 0.15);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      cursor: pointer;
    }

    .productos-product-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(255, 0, 112, 0.35);
      border-color: #ff4060;
    }

    .productos-product-card.grid-view {
      height: 400px;
    }

    .productos-product-card.list-view {
      height: 180px;
    }

    .productos-product-content {
      display: flex;
      height: 100%;
      transition: all 0.4s ease;
    }

    .productos-product-content.grid-view {
      flex-direction: column;
      padding: 0;
    }

    .productos-product-content.list-view {
      flex-direction: row;
      padding: 15px;
    }

    .productos-product-image-container {
      overflow: hidden;
      background: #f5f5f5;
      position: relative;
      transition: all 0.4s ease;
    }

    .productos-product-image-container.grid-view {
      width: 100%;
      height: 220px;
      border-radius: 12px 12px 0 0;
    }

    .productos-product-image-container.list-view {
      width: 180px;
      height: 170px;
      border-radius: 8px;
    }

    .productos-product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease, opacity 0.3s ease;
      will-change: transform, opacity;
      position: absolute;
      top: 0;
      left: 0;
    }

    .productos-product-card:hover .productos-product-image {
      transform: scale(1.05);
    }

    .productos-product-details {
      flex: 1;
      text-align: center;
      position: relative;
      padding-bottom: 45px;
      transition: all 0.4s ease;
    }

    .productos-product-details.grid-view {
      padding: 15px 15px 45px;
    }

    .productos-product-details.list-view {
      padding: 0 0 0 20px;
      text-align: left;
    }

    .productos-product-title {
      font-size: 1.3rem;
      font-weight: 600;
      margin-bottom: 8px;
      color: var(--huasteca-dark);
      transition: font-size 0.4s ease;
    }

    .productos-product-title.list-view {
      font-size: 1.25rem;
    }

    .productos-product-description {
      font-size: 0.95rem;
      color: #403a3c;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .productos-product-price-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 8px;
      transition: justify-content 0.4s ease;
    }

    .productos-product-price-container.list-view {
      justify-content: flex-start;
    }

    .productos-product-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--huasteca-red);
      transition: font-size 0.4s ease;
    }

    .productos-product-price.list-view {
      font-size: 1.375rem;
    }

    .productos-product-original-price {
      text-decoration: line-through;
      font-size: 0.875rem;
      color: #403a3c;
      margin-left: 15px;
    }

    .productos-view-more-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 8px 20px;
      color: #ffffff;
      background-color: var(--huasteca-red);
      border: none;
      border-radius: 30px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s;
      position: absolute;
      bottom: 10px;
      right: 10px;
    }

    .productos-no-results {
      text-align: center;
      padding: 40px 20px;
      background: rgba(255,255,255,0.9);
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(255, 0, 112, 0.2);
      position: relative;
      z-index: 2;
    }

    .productos-no-results-icon {
      font-size: 3rem;
      color: var(--huasteca-red);
      margin-bottom: 20px;
    }

    .productos-no-results-text {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--huasteca-dark);
    }

    .productos-no-results-subtext {
      font-size: 1.125rem;
      font-weight: 400;
      color: #403a3c;
    }

    .alert {
      padding: 15px;
      margin-bottom: 20px;
      border: 1px solid transparent;
      border-radius: 4px;
    }

    .alert-warning {
      background-color: #FFF3CD;
      border-color: #FFEEBA;
      color: #856404;
    }

    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .animate-in {
      animation: fadeInUp 0.8s forwards;
    }

    .productResults {
      transition: opacity 0.3s ease;
    }

    .productos-product-grid.transitioning .productos-product-card {
      opacity: 0.5;
      transition: opacity 0.3s ease;
    }

    .productos-product-grid:not(.transitioning) .productos-product-card {
      opacity: 1;
      transition: opacity 0.3s ease 0.1s;
    }

    @media (max-width: 768px) {
      .productos-filter-bar {
        flex-direction: column;
        gap: 15px;
      }

      .productos-search-container {
        max-width: 100%;
      }

      .productos-filter-grid {
        grid-template-columns: 1fr;
      }

      .productos-product-card.list-view {
        height: auto;
      }

      .productos-product-content.list-view {
        flex-direction: column;
      }

      .productos-product-image-container.list-view {
        width: 100%;
        height: 200px;
      }

      .productos-product-details.list-view {
        padding: 15px;
        text-align: center;
      }

      .productos-product-price-container.list-view {
        justify-content: center;
      }
    }

    @media (max-width: 576px) {
      .productos-product-grid.grid-view {
        grid-template-columns: 1fr;
      }

      .productos-product-card.grid-view {
        height: auto;
      }
    }
  `

  return (
    <>
      <style>{cssStyles}</style>
      <section style={customStyles.section}>
        <div style={customStyles.overlay}></div>
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div className="productos-header">
            <h1 className="productos-title animate-in">Productos de Danza</h1>
            <span style={customStyles.titleUnderline}></span>
            <p className="productos-subtitle animate-in" style={{ animationDelay: "0.3s" }}>
              Explora nuestra selección de ropa, calzado y accesorios para danza huasteca.
            </p>
          </div>

          {/* Modificamos la condición del alert para usar isAuthenticated */}
          {isAuthenticated && (
            <div
              className="alert alert-warning animate-in"
              style={{
                animationDelay: "0.4s",
                backgroundColor: "#FFF3CD",
                borderColor: "#FFEEBA",
                color: "#856404",
                borderRadius: "8px",
                padding: "15px",
                marginBottom: "25px",
                borderLeft: "5px solid #FFC107",
              }}
            >
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <strong>Importante:</strong> Para realizar un pedido se requiere un anticipo del 50%. El resto se paga al
              recibir el producto.
            </div>
          )}

          <div className="productos-filter-bar">
            <div className="productos-search-container">
              <i className="bi bi-search productos-search-icon"></i>
              <input
                name="busqueda"
                type="text"
                placeholder="Buscar productos de danza..."
                className="productos-search-input"
                onChange={handleChange}
                value={filtros.busqueda}
              />
            </div>

            <div className="productos-filter-actions">
              <button
                className={`productos-filter-button ${filtrosExpandidos ? "expanded" : ""}`}
                onClick={toggleFiltros}
              >
                <i className="bi bi-funnel"></i>
                Filtros
                {filtrosActivos > 0 && (
                  <span className={`productos-filter-count ${filtrosActivos > 0 ? "active" : ""}`}>
                    {filtrosActivos}
                  </span>
                )}
              </button>

              <div className="productos-view-toggle">
                <div
                  className={`productos-view-button ${vistaGrilla ? "active" : ""}`}
                  onClick={() => vistaGrilla || toggleVistaGrilla()}
                  style={{ opacity: isTransitioning ? 0.6 : 1 }}
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </div>
                <div
                  className={`productos-view-button ${!vistaGrilla ? "active" : ""}`}
                  onClick={() => !vistaGrilla || toggleVistaGrilla()}
                  style={{ opacity: isTransitioning ? 0.6 : 1 }}
                >
                  <i className="bi bi-list-ul"></i>
                </div>
              </div>
            </div>
          </div>

          <div className={`productos-filter-panel ${filtrosExpandidos ? "expanded" : ""}`}>
            <div className="productos-filter-grid">
              <div className="productos-filter-group">
                <label className="productos-filter-label">Ordenar por</label>
                <select
                  name="ordenar"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.ordenar}
                >
                  <option value="">Relevancia</option>
                  <option value="asc">Precio: Menor a Mayor</option>
                  <option value="desc">Precio: Mayor a Menor</option>
                  <option value="rating">Mejor valorados</option>
                  <option value="newest">Más recientes</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Talla</label>
                <select
                  name="talla"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.talla}
                >
                  <option value="">Todas las tallas</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="Única">Única</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Categoría</label>
                <select
                  name="categoria"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.categoria}
                >
                  <option value="">Todas las categorías</option>
                  <option value="Huasteca">Huasteca</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Color</label>
                <select
                  name="color"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.color}
                >
                  <option value="">Todos los colores</option>
                  <option value="Rojo">Rojo</option>
                  <option value="Verde">Verde</option>
                  <option value="Blanco">Blanco</option>
                  <option value="Negro">Negro</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Material</label>
                <select
                  name="material"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.material}
                >
                  <option value="">Todos los materiales</option>
                  <option value="Algodón">Algodón</option>
                  <option value="Seda">Seda</option>
                  <option value="Lino">Lino</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Precio</label>
                <select
                  name="precio"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.precio}
                >
                  <option value="">Cualquier precio</option>
                  <option value="low">Menos de $50</option>
                  <option value="medium">$50 - $100</option>
                  <option value="high">Más de $100</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "20px" }}>
              <button className="productos-clear-button" onClick={limpiarFiltros}>
                <i className="bi bi-trash3"></i>
                Limpiar filtros
              </button>
              <button className="productos-apply-button" onClick={toggleFiltros}>
                <i className="bi bi-check2"></i>
                Aplicar filtros
              </button>
            </div>
          </div>

          <div className="productos-results-info animate-in" style={{ animationDelay: "0.5s" }}>
            Mostrando {productosFiltrados.length} productos {filtrosActivos > 0 ? "filtrados" : ""}
          </div>

          {productosFiltrados.length > 0 ? (
            <div className="productResults">
              <div
                className={`productos-product-grid ${vistaGrilla ? "grid-view" : "list-view"} ${isTransitioning ? "transitioning" : ""}`}
                key={`product-grid-${vistaGrilla ? 'grid' : 'list'}`}
              >
                {productosFiltrados.map((producto, idx) => (
                  <ProductoCard
                    key={`${producto._id}-${vistaGrilla ? 'grid' : 'list'}-${idx}`}
                    producto={producto}
                    vistaGrilla={vistaGrilla}
                    handleProductClick={handleProductClick}
                    animationDelay={0.1 * (idx % 10)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="productos-no-results animate-in" style={{ animationDelay: "0.5s" }}>
              <div className="productos-no-results-icon">
                <i className="bi bi-search"></i>
              </div>
              <h3 className="productos-no-results-text">No se encontraron productos</h3>
              <p className="productos-no-results-subtext">
                Prueba con diferentes criterios de búsqueda o elimina algunos filtros.
              </p>
              <button className="productos-clear-button productos-no-results-button" onClick={limpiarFiltros}>
                <i className="bi bi-arrow-repeat"></i>
                Restablecer filtros
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default Productos