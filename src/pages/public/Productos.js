"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import { useAuth } from "../../context/AuthContext"
import { publicAPI } from "../../services/api"
import stylesPublic from "../../styles/stylesPublic"

const ProductCard = React.memo(
  ({ producto, vistaGrilla, handleProductClick, animationDelay }) => {
    return (
      <div
        className={`product-card ${vistaGrilla ? "grid-view" : "list-view"}`}
        style={{
          animationDelay: `${animationDelay}s`,
          animation: "fadeInScale 0.5s ease-out forwards",
        }}
        onClick={(e) => handleProductClick(producto._id, e)}
      >
        <div className="product-image-container">
          <img
            src={producto.imagenURL || "/placeholder.svg"}
            alt={producto.nombre}
            className="product-image"
            loading="lazy"
          />
          <div className="product-badge">
            <i className="bi bi-heart"></i>
          </div>
        </div>

        <div className="product-content">
          <div className="product-header">
            <h3 className="product-name">{producto.nombre}</h3>
            {producto.localidadId?.nombre && <span className="product-origin">{producto.localidadId.nombre}</span>}
          </div>

          <p className="product-summary">{producto.descripcion}</p>

          {producto.tallasDisponibles?.length > 0 && (
            <div className="product-sizes">
              <span className="sizes-label">Tallas:</span>
              <span className="sizes-count">{producto.tallasDisponibles.length} disponibles</span>
            </div>
          )}
        </div>
      </div>
    )
  },
  (prevProps, nextProps) => {
    return (
      prevProps.producto._id === nextProps.producto._id &&
      prevProps.vistaGrilla === nextProps.vistaGrilla &&
      prevProps.animationDelay === nextProps.animationDelay
    )
  },
)

const Productos = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [filtros, setFiltros] = useState({
    ordenar: "",
    talla: "",
    categoria: "",
    localidad: "",
    busqueda: "",
  })

  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false)
  const [productosFiltrados, setProductosFiltrados] = useState([])
  const [filtrosActivos, setFiltrosActivos] = useState(0)
  const [vistaGrilla, setVistaGrilla] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [productosApi, setProductosApi] = useState([])
  const [categorias, setCategorias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [tallasUnicas, setTallasUnicas] = useState([])
  const [loading, setLoading] = useState(true)

  // ... (mantener toda la lógica existente igual que en la versión anterior)
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        const [productosData, categoriasData, localidadesData, tallasData] = await Promise.all([
          publicAPI.getProductos(),
          publicAPI.getCategorias(),
          publicAPI.getLocalidades(),
          publicAPI.getTallas(),
        ])

        setProductosApi(productosData)
        setProductosFiltrados(productosData)
        setCategorias(categoriasData)
        setLocalidades(localidadesData)

        const tallasUnicasData = [...new Set(tallasData.map((t) => t.talla))].sort()
        setTallasUnicas(tallasUnicasData)

        setTimeout(() => {
          setIsVisible(true)
          setLoading(false)
        }, 300)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setProductosApi([])
        setProductosFiltrados([])
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const handleChange = (e) => {
    const newFiltros = { ...filtros, [e.target.name]: e.target.value }
    setFiltros(newFiltros)

    const { resultado, contadorFiltros } = filtrarProductos(productosApi, newFiltros)
    setProductosFiltrados(resultado)
    setFiltrosActivos(contadorFiltros)
  }

  const limpiarFiltros = () => {
    const resetFiltros = {
      ordenar: "",
      talla: "",
      categoria: "",
      localidad: "",
      busqueda: "",
    }

    setFiltros(resetFiltros)
    document.querySelectorAll(".minimal-select").forEach((select) => (select.value = ""))
    const searchInput = document.querySelector("input[name='busqueda']")
    if (searchInput) searchInput.value = ""

    const { resultado, contadorFiltros } = filtrarProductos(productosApi, resetFiltros)
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
          producto.nombre?.toLowerCase().includes(searchTerm) ||
          producto.descripcion?.toLowerCase().includes(searchTerm) ||
          producto.localidadId?.nombre?.toLowerCase().includes(searchTerm),
      )
      contadorFiltros++
    }

    if (filtros.categoria) {
      resultado = resultado.filter((producto) =>
        producto.tallasDisponibles?.some(
          (td) => td.categoriaId?.nombre?.toLowerCase() === filtros.categoria.toLowerCase(),
        ),
      )
      contadorFiltros++
    }

    if (filtros.localidad) {
      resultado = resultado.filter(
        (producto) => producto.localidadId?.nombre?.toLowerCase() === filtros.localidad.toLowerCase(),
      )
      contadorFiltros++
    }

    if (filtros.talla) {
      resultado = resultado.filter((producto) => producto.tallasDisponibles?.some((td) => td.talla === filtros.talla))
      contadorFiltros++
    }

    if (filtros.ordenar) {
      switch (filtros.ordenar) {
        case "nombre-asc":
          resultado.sort((a, b) => a.nombre.localeCompare(b.nombre))
          break
        case "nombre-desc":
          resultado.sort((a, b) => b.nombre.localeCompare(a.nombre))
          break
        case "newest":
          resultado.sort((a, b) => b._id.localeCompare(a._id))
          break
        default:
          break
      }
    }

    return { resultado, contadorFiltros }
  }, [])

  useEffect(() => {
    const query = new URLSearchParams(location.search)
    const categoria = query.get("categoria")
    const localidad = query.get("localidad")
    const initialFiltros = {
      ordenar: "",
      talla: "",
      categoria: categoria || "",
      localidad: localidad || "",
      busqueda: "",
    }
    setFiltros(initialFiltros)
    const { resultado, contadorFiltros } = filtrarProductos(productosApi, initialFiltros)
    setProductosFiltrados(resultado)
    setFiltrosActivos(contadorFiltros)
  }, [location.search, filtrarProductos, productosApi])

  const styles = `
    .minimal-container {
      min-height: 100vh;
      background: ${stylesPublic.colors.surface.primary};
      padding: ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[4]};
      font-family: ${stylesPublic.typography.families.body};
    }

    .minimal-header {
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[16]};
      padding: ${stylesPublic.spacing.scale[20]} ${stylesPublic.spacing.scale[8]};
      background: linear-gradient(135deg, 
        ${stylesPublic.colors.primary[100]} 0%, 
        ${stylesPublic.colors.secondary[100]} 30%, 
        ${stylesPublic.colors.primary[50]} 70%, 
        ${stylesPublic.colors.secondary[50]} 100%);
      border-radius: ${stylesPublic.borders.radius.xl};
      position: relative;
      overflow: hidden;
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "20px"});
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .minimal-header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(circle at 70% 30%, ${stylesPublic.colors.secondary[200]}30 0%, transparent 60%);
      pointer-events: none;
    }

    .minimal-title {
      font-size: ${stylesPublic.typography.headings.h1.fontSize};
      font-family: ${stylesPublic.typography.headings.h1.fontFamily};
      font-weight: 300;
      line-height: ${stylesPublic.typography.headings.h1.lineHeight};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      position: relative;
      z-index: 2;
    }

    .minimal-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[16]};
      height: 2px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .minimal-subtitle {
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.text.secondary};
      font-weight: 300;
      max-width: 500px;
      margin: 0 auto;
      line-height: ${stylesPublic.typography.leading.relaxed};
      position: relative;
      z-index: 2;
    }

    .minimal-controls {
      max-width: 1200px;
      margin: 0 auto ${stylesPublic.spacing.scale[12]};
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "15px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    }

    .minimal-search-section {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[4]};
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      padding: ${stylesPublic.spacing.scale[2]};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.full};
      background: ${stylesPublic.colors.surface.primary};
      box-shadow: ${stylesPublic.shadows.sm};
    }

    .minimal-search-input {
      flex: 1;
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[6]};
      border: none;
      background: transparent;
      font-size: ${stylesPublic.typography.scale.base};
      color: ${stylesPublic.colors.text.primary};
      font-family: ${stylesPublic.typography.families.body};
    }

    .minimal-search-input:focus {
      outline: none;
    }

    .minimal-search-input::placeholder {
      color: ${stylesPublic.colors.text.tertiary};
      font-weight: 300;
    }

    .minimal-search-btn {
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]};
      background: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      border-radius: ${stylesPublic.borders.radius.full};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
    }

    .minimal-search-btn:hover {
      background: ${stylesPublic.colors.primary[600]};
      transform: scale(1.05);
    }

    .minimal-filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .minimal-filters {
      display: flex;
      gap: ${stylesPublic.spacing.scale[4]};
      align-items: center;
    }

    .minimal-filter-toggle {
      background: transparent;
      border: 1px solid ${stylesPublic.borders.colors.muted};
      color: ${stylesPublic.colors.text.secondary};
      padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.md};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      font-size: ${stylesPublic.typography.scale.sm};
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      font-family: ${stylesPublic.typography.families.body};
    }

    .minimal-filter-toggle:hover,
    .minimal-filter-toggle.active {
      border-color: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.primary[500]};
    }

    .minimal-view-toggle {
      display: flex;
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.md};
      overflow: hidden;
    }

    .minimal-view-btn {
      padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]};
      background: transparent;
      border: none;
      color: ${stylesPublic.colors.text.secondary};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      font-size: ${stylesPublic.typography.scale.sm};
    }

    .minimal-view-btn.active {
      background: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
    }

    .minimal-view-btn:hover:not(.active) {
      background: ${stylesPublic.colors.neutral[100]};
    }

    .minimal-filters-panel {
      background: ${stylesPublic.colors.surface.secondary};
      border-radius: ${stylesPublic.borders.radius.lg};
      padding: ${stylesPublic.spacing.scale[6]};
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      display: ${filtrosExpandidos ? "block" : "none"};
      border: 1px solid ${stylesPublic.borders.colors.muted};
    }

    .minimal-filters-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: ${stylesPublic.spacing.scale[4]};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .minimal-filter-group label {
      display: block;
      font-size: ${stylesPublic.typography.scale.xs};
      font-weight: ${stylesPublic.typography.weights.medium};
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      text-transform: uppercase;
      letter-spacing: ${stylesPublic.typography.tracking.wide};
    }

    .minimal-select {
      width: 100%;
      padding: ${stylesPublic.spacing.scale[3]};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.md};
      background: ${stylesPublic.colors.surface.primary};
      color: ${stylesPublic.colors.text.primary};
      font-size: ${stylesPublic.typography.scale.sm};
      font-family: ${stylesPublic.typography.families.body};
    }

    .minimal-select:focus {
      outline: none;
      border-color: ${stylesPublic.colors.primary[500]};
    }

    .minimal-clear-btn {
      background: transparent;
      color: ${stylesPublic.colors.text.secondary};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.md};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      font-size: ${stylesPublic.typography.scale.sm};
      font-family: ${stylesPublic.typography.families.body};
    }

    .minimal-clear-btn:hover {
      border-color: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.primary[500]};
    }

    .minimal-results-count {
      text-align: center;
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.tertiary};
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "10px"});
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
    }

    .minimal-products-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      gap: ${stylesPublic.spacing.scale[8]};
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "15px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
    }

    .minimal-products-grid.grid-view {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }

    .minimal-products-grid.list-view {
      grid-template-columns: 1fr;
      gap: ${stylesPublic.spacing.scale[4]};
    }

    .product-card {
      background: ${stylesPublic.colors.surface.primary};
      border-radius: ${stylesPublic.borders.radius.lg};
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      border: 1px solid transparent;
    }

    .product-card:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[200]};
    }

    .product-card.grid-view {
      display: flex;
      flex-direction: column;
    }

    .product-card.list-view {
      display: flex;
      flex-direction: row;
      height: 160px;
    }

    .product-image-container {
      position: relative;
      overflow: hidden;
      background: ${stylesPublic.colors.surface.secondary};
    }

    .product-card.grid-view .product-image-container {
      height: 220px;
      width: 100%;
    }

    .product-card.list-view .product-image-container {
      width: 160px;
      height: 100%;
    }

    .product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .product-card:hover .product-image {
      transform: scale(1.05);
    }

    .product-badge {
      position: absolute;
      top: ${stylesPublic.spacing.scale[3]};
      right: ${stylesPublic.spacing.scale[3]};
      width: ${stylesPublic.spacing.scale[8]};
      height: ${stylesPublic.spacing.scale[8]};
      background: ${stylesPublic.colors.surface.primary};
      border-radius: ${stylesPublic.borders.radius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      color: ${stylesPublic.colors.text.tertiary};
      font-size: ${stylesPublic.typography.scale.sm};
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .product-card:hover .product-badge {
      opacity: 1;
    }

    .product-content {
      padding: ${stylesPublic.spacing.scale[5]};
      flex: 1;
    }

    .product-card.list-view .product-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .product-header {
      margin-bottom: ${stylesPublic.spacing.scale[3]};
    }

    .product-name {
      font-size: ${stylesPublic.typography.scale.lg};
      font-weight: ${stylesPublic.typography.weights.medium};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[1]};
      line-height: ${stylesPublic.typography.leading.tight};
    }

    .product-card.list-view .product-name {
      font-size: ${stylesPublic.typography.scale.base};
    }

    .product-origin {
      font-size: ${stylesPublic.typography.scale.xs};
      color: ${stylesPublic.colors.text.tertiary};
      text-transform: uppercase;
      letter-spacing: ${stylesPublic.typography.tracking.wide};
    }

    .product-summary {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      line-height: ${stylesPublic.typography.leading.relaxed};
      margin-bottom: ${stylesPublic.spacing.scale[3]};
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-card.list-view .product-summary {
      -webkit-line-clamp: 1;
    }

    .product-sizes {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      font-size: ${stylesPublic.typography.scale.xs};
    }

    .sizes-label {
      color: ${stylesPublic.colors.text.tertiary};
    }

    .sizes-count {
      color: ${stylesPublic.colors.primary[500]};
      font-weight: ${stylesPublic.typography.weights.medium};
    }

    .minimal-no-results {
      text-align: center;
      padding: ${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[8]};
      max-width: 500px;
      margin: 0 auto;
    }

    .minimal-no-results-icon {
      font-size: ${stylesPublic.typography.scale["3xl"]};
      color: ${stylesPublic.colors.text.tertiary};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
    }

    .minimal-no-results-title {
      font-size: ${stylesPublic.typography.scale.xl};
      font-weight: ${stylesPublic.typography.weights.medium};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
    }

    .minimal-no-results-text {
      font-size: ${stylesPublic.typography.scale.base};
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .minimal-reset-btn {
      background: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]};
      border-radius: ${stylesPublic.borders.radius.md};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      font-family: ${stylesPublic.typography.families.body};
    }

    .minimal-reset-btn:hover {
      background: ${stylesPublic.colors.primary[600]};
      transform: translateY(-1px);
    }

    .minimal-alert {
      background: ${stylesPublic.colors.semantic.warning.light};
      border: 1px solid ${stylesPublic.colors.semantic.warning.main};
      color: ${stylesPublic.colors.semantic.warning.main};
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[6]};
      border-radius: ${stylesPublic.borders.radius.md};
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      max-width: 1200px;
      margin-left: auto;
      margin-right: auto;
      font-size: ${stylesPublic.typography.scale.sm};
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "10px"});
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.1s;
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .minimal-container {
        padding: ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[3]};
      }

      .minimal-search-section {
        flex-direction: column;
        border-radius: ${stylesPublic.borders.radius.lg};
      }

      .minimal-filter-bar {
        flex-direction: column;
        gap: ${stylesPublic.spacing.scale[4]};
        align-items: stretch;
      }

      .minimal-filters {
        justify-content: center;
      }

      .minimal-products-grid.grid-view {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      }

      .product-card.list-view {
        flex-direction: column;
        height: auto;
      }

      .product-card.list-view .product-image-container {
        width: 100%;
        height: 180px;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .minimal-filters-grid {
        grid-template-columns: 1fr;
      }

      .minimal-products-grid.grid-view {
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .minimal-container {
        padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[2]};
      }

      .minimal-title {
        font-size: ${stylesPublic.typography.scale["2xl"]};
      }

      .minimal-products-grid.grid-view {
        grid-template-columns: 1fr;
        gap: ${stylesPublic.spacing.scale[4]};
      }

      .product-card.grid-view .product-image-container {
        height: 200px;
      }
    }
  `

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="minimal-container">
          <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[16] }}>
            <i
              className="bi bi-arrow-repeat"
              style={{ fontSize: stylesPublic.typography.scale.xl, animation: "spin 1s linear infinite" }}
            ></i>
            <p style={{ marginTop: stylesPublic.spacing.scale[4], color: stylesPublic.colors.text.secondary }}>
              Cargando productos...
            </p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{styles}</style>
      <div className="minimal-container">
        <div className="minimal-header">
          <h1 className="minimal-title">Productos de Danza</h1>
          <p className="minimal-subtitle">Colección artesanal de ropa y accesorios para danza huasteca</p>
        </div>

        {isAuthenticated && (
          <div className="minimal-alert">
            <i className="bi bi-info-circle" style={{ marginRight: stylesPublic.spacing.scale[2] }}></i>
            Se requiere anticipo del 50% para realizar pedidos
          </div>
        )}

        <div className="minimal-controls">
          <div className="minimal-search-section">
            <input
              name="busqueda"
              type="text"
              placeholder="Buscar productos..."
              className="minimal-search-input"
              onChange={handleChange}
              value={filtros.busqueda}
            />
            <button className="minimal-search-btn">
              <i className="bi bi-search"></i>
            </button>
          </div>

          <div className="minimal-filter-bar">
            <div className="minimal-filters">
              <button className={`minimal-filter-toggle ${filtrosExpandidos ? "active" : ""}`} onClick={toggleFiltros}>
                <i className="bi bi-sliders"></i>
                Filtros
                {filtrosActivos > 0 && ` (${filtrosActivos})`}
              </button>
            </div>

            <div className="minimal-view-toggle">
              <button
                className={`minimal-view-btn ${vistaGrilla ? "active" : ""}`}
                onClick={() => vistaGrilla || toggleVistaGrilla()}
                disabled={isTransitioning}
              >
                <i className="bi bi-grid"></i>
              </button>
              <button
                className={`minimal-view-btn ${!vistaGrilla ? "active" : ""}`}
                onClick={() => !vistaGrilla || toggleVistaGrilla()}
                disabled={isTransitioning}
              >
                <i className="bi bi-list"></i>
              </button>
            </div>
          </div>

          <div className="minimal-filters-panel">
            <div className="minimal-filters-grid">
              <div className="minimal-filter-group">
                <label>Ordenar</label>
                <select name="ordenar" className="minimal-select" onChange={handleChange} value={filtros.ordenar}>
                  <option value="">Relevancia</option>
                  <option value="nombre-asc">A - Z</option>
                  <option value="nombre-desc">Z - A</option>
                  <option value="newest">Recientes</option>
                </select>
              </div>

              <div className="minimal-filter-group">
                <label>Talla</label>
                <select name="talla" className="minimal-select" onChange={handleChange} value={filtros.talla}>
                  <option value="">Todas</option>
                  {tallasUnicas.map((talla) => (
                    <option key={talla} value={talla}>
                      {talla}
                    </option>
                  ))}
                </select>
              </div>

              <div className="minimal-filter-group">
                <label>Categoría</label>
                <select name="categoria" className="minimal-select" onChange={handleChange} value={filtros.categoria}>
                  <option value="">Todas</option>
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="minimal-filter-group">
                <label>Localidad</label>
                <select name="localidad" className="minimal-select" onChange={handleChange} value={filtros.localidad}>
                  <option value="">Todas</option>
                  {localidades.map((localidad) => (
                    <option key={localidad._id} value={localidad.nombre}>
                      {localidad.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <button className="minimal-clear-btn" onClick={limpiarFiltros}>
                Limpiar filtros
              </button>
            </div>
          </div>
        </div>

        <div className="minimal-results-count">{productosFiltrados.length} productos encontrados</div>

        {productosFiltrados.length > 0 ? (
          <div
            className={`minimal-products-grid ${vistaGrilla ? "grid-view" : "list-view"} ${isTransitioning ? "transitioning" : ""}`}
          >
            {productosFiltrados.map((producto, idx) => (
              <ProductCard
                key={`${producto._id}-${vistaGrilla ? "grid" : "list"}-${idx}`}
                producto={producto}
                vistaGrilla={vistaGrilla}
                handleProductClick={handleProductClick}
                animationDelay={0.05 * (idx % 20)}
              />
            ))}
          </div>
        ) : (
          <div className="minimal-no-results">
            <div className="minimal-no-results-icon">
              <i className="bi bi-search"></i>
            </div>
            <h3 className="minimal-no-results-title">Sin resultados</h3>
            <p className="minimal-no-results-text">No encontramos productos que coincidan con tu búsqueda</p>
            <button className="minimal-reset-btn" onClick={limpiarFiltros}>
              Reiniciar búsqueda
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default Productos