import React, { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import { useAuth } from '../../context/AuthContext'
import stylesPublic from "../../styles/stylesPublic"

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
            src={producto.imagenURL || "/placeholder.svg"}
            alt={producto.nombre}
            className="productos-product-image"
            loading="lazy"
          />
        </div>
        <div className={`productos-product-details ${vistaGrilla ? "grid-view" : "list-view"}`}>
          <h3 className={`productos-product-title ${vistaGrilla ? "" : "list-view"}`}>{producto.nombre}</h3>
          <p className="productos-product-description">{producto.descripcion}</p>
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
  const { isAuthenticated } = useAuth();
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
  const [productosApi, setProductosApi] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
  const [tallasUnicas, setTallasUnicas] = useState([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const productosRes = await fetch("http://localhost:5000/api/public/productos");
        const productosData = await productosRes.json();
        setProductosApi(productosData);
        setProductosFiltrados(productosData);

        const categoriasRes = await fetch("http://localhost:5000/api/public/categorias");
        const categoriasData = await categoriasRes.json();
        setCategorias(categoriasData);

        const localidadesRes = await fetch("http://localhost:5000/api/public/localidades");
        const localidadesData = await localidadesRes.json();
        setLocalidades(localidadesData);

        const tallasRes = await fetch("http://localhost:5000/api/public/tallas");
        const tallasData = await tallasRes.json();
        const tallasUnicasData = [...new Set(tallasData.map(t => t.talla))].sort();
        setTallasUnicas(tallasUnicasData);

        setTimeout(() => setIsVisible(true), 100);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setProductosApi([]);
        setProductosFiltrados([]);
      }
    };

    cargarDatos();
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
    document.querySelectorAll(".form-select").forEach((select) => (select.value = ""))
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
          producto.localidadId?.nombre?.toLowerCase().includes(searchTerm)
      )
      contadorFiltros++
    }

    if (filtros.categoria) {
      resultado = resultado.filter((producto) =>
        producto.tallasDisponibles?.some(td =>
          td.categoriaId?.nombre?.toLowerCase() === filtros.categoria.toLowerCase()
        )
      )
      contadorFiltros++
    }

    if (filtros.localidad) {
      resultado = resultado.filter((producto) =>
        producto.localidadId?.nombre?.toLowerCase() === filtros.localidad.toLowerCase()
      )
      contadorFiltros++
    }

    if (filtros.talla) {
      resultado = resultado.filter((producto) =>
        producto.tallasDisponibles?.some(td => td.talla === filtros.talla)
      )
      contadorFiltros++
    }

    if (filtros.ordenar) {
      switch (filtros.ordenar) {
        case 'nombre-asc':
          resultado.sort((a, b) => a.nombre.localeCompare(b.nombre))
          break
        case 'nombre-desc':
          resultado.sort((a, b) => b.nombre.localeCompare(a.nombre))
          break
        case 'newest':
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

  // CSS usando exclusivamente tokens del sistema refactorizado
  const cssStyles = `
    .productos-container {
      background: ${stylesPublic.colors.gradients.hero};
      min-height: calc(100vh - ${stylesPublic.spacing.scale[19]});
      padding-top: ${stylesPublic.spacing.scale[8]};
      padding-bottom: ${stylesPublic.spacing.scale[15]};
      font-family: ${stylesPublic.typography.families.body};
    }

    .productos-header {
      margin-bottom: ${stylesPublic.spacing.scale[8]};
      text-align: center;
      position: relative;
      z-index: ${stylesPublic.utils.zIndex.base};
    }

    .productos-title {
      ...${JSON.stringify(stylesPublic.typography.headings.h1).slice(1, -1)};
      color: ${stylesPublic.colors.text.primary};
    }

    .productos-subtitle {
      ...${JSON.stringify(stylesPublic.typography.body.large).slice(1, -1)};
      color: ${stylesPublic.colors.text.secondary};
      max-width: ${stylesPublic.utils.container.maxWidth.lg};
      margin: 0 auto ${stylesPublic.spacing.scale[12]};
      letter-spacing: ${stylesPublic.typography.tracking.wide};
    }

    .productos-filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: ${stylesPublic.colors.surface.glass};
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[5]};
      border-radius: ${stylesPublic.borders.radius.lg};
      box-shadow: ${stylesPublic.shadows.lg};
      margin-bottom: ${stylesPublic.spacing.scale[5]};
      position: relative;
      z-index: ${stylesPublic.utils.zIndex.base};
      backdrop-filter: blur(${stylesPublic.spacing.scale[3]});
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
    }

    .productos-search-container {
      position: relative;
      flex: 1;
      max-width: ${stylesPublic.spacing.scale[100]};
    }

    .productos-search-input {
      width: 100%;
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[10]};
      border-radius: ${stylesPublic.borders.radius.md};
      border: ${stylesPublic.borders.width[2]}px solid ${stylesPublic.colors.primary[500]};
      font-size: ${stylesPublic.typography.scale.base};
      background-color: ${stylesPublic.colors.surface.primary};
      color: ${stylesPublic.colors.text.primary};
      font-family: ${stylesPublic.typography.families.body};
      transition: ${stylesPublic.animations.transitions.base};
    }

    .productos-search-input:focus {
      outline: none;
      border-color: ${stylesPublic.colors.secondary[500]};
      box-shadow: 0 0 0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.colors.secondary[500]}20;
    }

    .productos-search-input::placeholder {
      color: ${stylesPublic.colors.text.disabled};
    }

    .productos-search-icon {
      position: absolute;
      left: ${stylesPublic.spacing.scale[4]};
      top: 50%;
      transform: translateY(-50%);
      color: ${stylesPublic.colors.primary[500]};
      font-size: ${stylesPublic.typography.scale.lg};
    }

    .productos-filter-actions {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[3]};
    }

    .productos-filter-button {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]};
      border: ${stylesPublic.borders.width[2]}px solid ${stylesPublic.colors.primary[500]};
      border-radius: ${stylesPublic.borders.radius.md};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      font-weight: ${stylesPublic.typography.weights.medium};
      font-size: ${stylesPublic.typography.scale.sm};
      background-color: ${stylesPublic.colors.surface.primary};
      color: ${stylesPublic.colors.primary[500]};
    }

    .productos-filter-button.expanded {
      background-color: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
    }

    .productos-filter-button:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.md};
    }

    .productos-filter-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: ${stylesPublic.spacing.scale[5]};
      height: ${stylesPublic.spacing.scale[5]};
      border-radius: ${stylesPublic.borders.radius.full};
      font-size: ${stylesPublic.typography.scale.xs};
      font-weight: ${stylesPublic.typography.weights.bold};
      padding: 0 ${stylesPublic.spacing.scale[2]};
      background-color: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
    }

    .productos-filter-count.active {
      background-color: ${stylesPublic.colors.secondary[500]};
    }

    .productos-view-toggle {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[1]};
    }

    .productos-view-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: ${stylesPublic.spacing.scale[10]};
      height: ${stylesPublic.spacing.scale[10]};
      border-radius: ${stylesPublic.borders.radius.md};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      background-color: ${stylesPublic.colors.surface.secondary};
      color: ${stylesPublic.colors.primary[500]};
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
    }

    .productos-view-button.active {
      background-color: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
    }

    .productos-view-button:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
    }

    .productos-view-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .productos-filter-panel {
      background: ${stylesPublic.colors.surface.glass};
      padding: ${stylesPublic.spacing.scale[5]};
      border-radius: ${stylesPublic.borders.radius.lg};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
      box-shadow: ${stylesPublic.shadows.lg};
      display: none;
      position: relative;
      z-index: ${stylesPublic.utils.zIndex.base};
      backdrop-filter: blur(${stylesPublic.spacing.scale[3]});
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
    }

    .productos-filter-panel.expanded {
      display: block;
    }

    .productos-filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(${stylesPublic.spacing.scale[50]}, 1fr));
      gap: ${stylesPublic.spacing.scale[4]};
    }

    .productos-filter-label {
      ...${JSON.stringify(stylesPublic.typography.body.caption).slice(1, -1)};
      font-weight: ${stylesPublic.typography.weights.semibold};
      color: ${stylesPublic.colors.secondary[500]};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      text-transform: uppercase;
    }

    .productos-filter-select.form-select {
      padding: ${stylesPublic.spacing.scale[3]};
      border-radius: ${stylesPublic.borders.radius.md};
      border: ${stylesPublic.borders.width[2]}px solid ${stylesPublic.colors.primary[500]};
      background-color: ${stylesPublic.colors.surface.primary};
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.primary};
      font-family: ${stylesPublic.typography.families.body};
      transition: ${stylesPublic.animations.transitions.base};
    }

    .productos-filter-select.form-select:focus {
      border-color: ${stylesPublic.colors.secondary[500]};
      box-shadow: 0 0 0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.colors.secondary[500]}20;
    }

    .productos-clear-button {
      ...${JSON.stringify(stylesPublic.components.button.variants.secondary).slice(1, -1)};
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]};
      font-size: ${stylesPublic.typography.scale.sm};
    }

    .productos-apply-button {
      ...${JSON.stringify(stylesPublic.components.button.variants.primary).slice(1, -1)};
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[5]};
      font-size: ${stylesPublic.typography.scale.sm};
    }

    .productos-results-info {
      ...${JSON.stringify(stylesPublic.typography.body.base).slice(1, -1)};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[5]};
      position: relative;
      z-index: ${stylesPublic.utils.zIndex.base};
    }

    .productos-product-grid {
      display: grid;
      gap: ${stylesPublic.spacing.scale[5]};
      transition: ${stylesPublic.animations.transitions.slow};
    }

    .productos-product-grid.grid-view {
      grid-template-columns: repeat(auto-fill, minmax(${stylesPublic.spacing.scale[62]}, 1fr));
    }

    .productos-product-grid.list-view {
      grid-template-columns: 1fr;
    }

    .productos-product-card {
      ...${JSON.stringify(stylesPublic.components.card.base).slice(1, -1)};
      background: ${stylesPublic.colors.surface.primary};
      border-radius: ${stylesPublic.borders.radius.lg};
      overflow: hidden;
      box-shadow: ${stylesPublic.shadows.lg};
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
      transition: ${stylesPublic.animations.transitions.base};
      cursor: pointer;
    }

    .productos-product-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[3]});
      box-shadow: ${stylesPublic.shadows.xl};
      border-color: ${stylesPublic.colors.primary[500]};
    }

    .productos-product-card.grid-view {
      height: ${stylesPublic.spacing.scale[100]};
    }

    .productos-product-card.list-view {
      height: ${stylesPublic.spacing.scale[45]};
    }

    .productos-product-content {
      display: flex;
      height: 100%;
      transition: ${stylesPublic.animations.transitions.base};
    }

    .productos-product-content.grid-view {
      flex-direction: column;
      padding: 0;
    }

    .productos-product-content.list-view {
      flex-direction: row;
      padding: ${stylesPublic.spacing.scale[4]};
    }

    .productos-product-image-container {
      overflow: hidden;
      background: ${stylesPublic.colors.surface.secondary};
      position: relative;
      transition: ${stylesPublic.animations.transitions.base};
    }

    .productos-product-image-container.grid-view {
      width: 100%;
      height: ${stylesPublic.spacing.scale[55]};
      border-radius: ${stylesPublic.borders.radius.lg} ${stylesPublic.borders.radius.lg} 0 0;
    }

    .productos-product-image-container.list-view {
      width: ${stylesPublic.spacing.scale[45]};
      height: ${stylesPublic.spacing.scale[42]};
      border-radius: ${stylesPublic.borders.radius.md};
    }

    .productos-product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: ${stylesPublic.animations.transitions.transform};
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
      padding-bottom: ${stylesPublic.spacing.scale[11]};
      transition: ${stylesPublic.animations.transitions.base};
    }

    .productos-product-details.grid-view {
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[11]};
    }

    .productos-product-details.list-view {
      padding: 0 0 0 ${stylesPublic.spacing.scale[5]};
      text-align: left;
    }

    .productos-product-title {
      ...${JSON.stringify(stylesPublic.typography.headings.h5).slice(1, -1)};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      color: ${stylesPublic.colors.text.primary};
      transition: ${stylesPublic.animations.transitions.base};
    }

    .productos-product-title.list-view {
      font-size: ${stylesPublic.typography.scale.xl};
    }

    .productos-product-description {
      ...${JSON.stringify(stylesPublic.typography.body.small).slice(1, -1)};
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${stylesPublic.spacing.scale[3]};
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .productos-view-more-button {
      ...${JSON.stringify(stylesPublic.components.button.variants.primary).slice(1, -1)};
      ...${JSON.stringify(stylesPublic.components.button.sizes.sm).slice(1, -1)};
      position: absolute;
      bottom: ${stylesPublic.spacing.scale[3]};
      right: ${stylesPublic.spacing.scale[3]};
      border-radius: ${stylesPublic.borders.radius.full};
    }

    .productos-view-more-button:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.brand.glow};
    }

    .productos-no-results {
      text-align: center;
      padding: ${stylesPublic.spacing.scale[10]} ${stylesPublic.spacing.scale[5]};
      background: ${stylesPublic.colors.surface.glass};
      border-radius: ${stylesPublic.borders.radius.lg};
      box-shadow: ${stylesPublic.shadows.lg};
      position: relative;
      z-index: ${stylesPublic.utils.zIndex.base};
      backdrop-filter: blur(${stylesPublic.spacing.scale[3]});
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
    }

    .productos-no-results-icon {
      font-size: ${stylesPublic.typography.scale['3xl']};
      color: ${stylesPublic.colors.primary[500]};
      margin-bottom: ${stylesPublic.spacing.scale[5]};
    }

    .productos-no-results-text {
      ...${JSON.stringify(stylesPublic.typography.headings.h4).slice(1, -1)};
      color: ${stylesPublic.colors.text.primary};
    }

    .productos-no-results-subtext {
      ...${JSON.stringify(stylesPublic.typography.body.large).slice(1, -1)};
      color: ${stylesPublic.colors.text.secondary};
    }

    .alert {
      padding: ${stylesPublic.spacing.scale[4]};
      margin-bottom: ${stylesPublic.spacing.scale[5]};
      border: ${stylesPublic.borders.width[1]}px solid transparent;
      border-radius: ${stylesPublic.borders.radius.md};
    }

    .alert-warning {
      background-color: ${stylesPublic.colors.semantic.warning.light};
      border-color: ${stylesPublic.colors.semantic.warning.main};
      color: ${stylesPublic.colors.semantic.warning.main};
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.semantic.warning.main};
    }

    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(${stylesPublic.spacing.scale[8]}); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    .animate-in {
      animation: fadeInUp ${stylesPublic.animations.duration.slowest} forwards;
    }

    .productResults {
      transition: ${stylesPublic.animations.transitions.opacity};
    }

    .productos-product-grid.transitioning .productos-product-card {
      opacity: 0.5;
      transition: ${stylesPublic.animations.transitions.opacity};
    }

    .productos-product-grid:not(.transitioning) .productos-product-card {
      opacity: 1;
      transition: opacity ${stylesPublic.animations.duration.base} ease ${stylesPublic.animations.duration.fast};
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints['2xl']}) {
      .productos-filter-bar {
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]};
      }

      .productos-product-grid.grid-view {
        grid-template-columns: repeat(auto-fill, minmax(${stylesPublic.spacing.scale[55]}, 1fr));
        gap: ${stylesPublic.spacing.scale[4]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .productos-container {
        padding-top: ${stylesPublic.spacing.scale[5]};
        padding-bottom: ${stylesPublic.spacing.scale[10]};
      }

      .productos-title {
        font-size: ${stylesPublic.typography.scale['2xl']};
      }

      .productos-subtitle {
        font-size: ${stylesPublic.typography.scale.base};
        margin: 0 auto ${stylesPublic.spacing.scale[8]};
      }

      .productos-filter-bar {
        flex-direction: column;
        gap: ${stylesPublic.spacing.scale[4]};
        padding: ${stylesPublic.spacing.scale[4]};
      }

      .productos-search-container {
        max-width: 100%;
      }

      .productos-filter-actions {
        width: 100%;
        justify-content: space-between;
      }

      .productos-product-grid.grid-view {
        grid-template-columns: repeat(auto-fill, minmax(${stylesPublic.spacing.scale[50]}, 1fr));
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .productos-container {
        padding-top: ${stylesPublic.spacing.scale[4]};
        padding-bottom: ${stylesPublic.spacing.scale[8]};
      }

      .productos-title {
        font-size: ${stylesPublic.typography.scale.xl};
      }

      .productos-subtitle {
        font-size: ${stylesPublic.typography.scale.sm};
      }

      .productos-filter-bar {
        margin-bottom: ${stylesPublic.spacing.scale[4]};
        padding: ${stylesPublic.spacing.scale[3]};
      }

      .productos-filter-panel {
        padding: ${stylesPublic.spacing.scale[4]};
        margin-bottom: ${stylesPublic.spacing.scale[4]};
      }

      .productos-filter-grid {
        grid-template-columns: 1fr;
        gap: ${stylesPublic.spacing.scale[3]};
      }

      .productos-filter-button {
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-view-button {
        width: ${stylesPublic.spacing.scale[9]};
        height: ${stylesPublic.spacing.scale[9]};
      }

      .productos-product-grid {
        gap: ${stylesPublic.spacing.scale[4]};
      }

      .productos-product-grid.grid-view {
        grid-template-columns: repeat(auto-fill, minmax(${stylesPublic.spacing.scale[45]}, 1fr));
      }

      .productos-product-card.list-view {
        height: auto;
      }

      .productos-product-content.list-view {
        flex-direction: column;
        padding: ${stylesPublic.spacing.scale[3]};
      }

      .productos-product-image-container.list-view {
        width: 100%;
        height: ${stylesPublic.spacing.scale[50]};
      }

      .productos-product-details.list-view {
        padding: ${stylesPublic.spacing.scale[3]} 0 0 0;
        text-align: center;
      }

      .productos-product-title.list-view {
        font-size: ${stylesPublic.typography.scale.base};
      }

      .productos-product-description {
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-view-more-button {
        font-size: ${stylesPublic.typography.scale.xs};
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .productos-container {
        padding-top: ${stylesPublic.spacing.scale[3]};
        padding-bottom: ${stylesPublic.spacing.scale[5]};
      }

      .productos-title {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .productos-subtitle {
        font-size: ${stylesPublic.typography.scale.xs};
        margin: 0 auto ${stylesPublic.spacing.scale[6]};
      }

      .productos-filter-bar {
        padding: ${stylesPublic.spacing.scale[3]};
        border-radius: ${stylesPublic.borders.radius.md};
      }

      .productos-search-input {
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[9]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-filter-button {
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-filter-count {
        min-width: ${stylesPublic.spacing.scale[4]};
        height: ${stylesPublic.spacing.scale[4]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-view-button {
        width: ${stylesPublic.spacing.scale[8]};
        height: ${stylesPublic.spacing.scale[8]};
      }

      .productos-filter-panel {
        padding: ${stylesPublic.spacing.scale[3]};
        border-radius: ${stylesPublic.borders.radius.md};
      }

      .productos-filter-label {
        font-size: ${stylesPublic.typography.scale.xs};
        margin-bottom: ${stylesPublic.spacing.scale[2]};
      }

      .productos-filter-select.form-select {
        padding: ${stylesPublic.spacing.scale[2]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-clear-button,
      .productos-apply-button {
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-results-info {
        font-size: ${stylesPublic.typography.scale.xs};
        margin-bottom: ${stylesPublic.spacing.scale[4]};
      }

      .productos-product-grid {
        gap: ${stylesPublic.spacing.scale[3]};
      }

      .productos-product-grid.grid-view {
        grid-template-columns: 1fr;
      }

      .productos-product-card.grid-view {
        height: auto;
        max-width: ${stylesPublic.spacing.scale[75]};
        margin: 0 auto;
      }

      .productos-product-card {
        border-radius: ${stylesPublic.borders.radius.md};
      }

      .productos-product-content.grid-view {
        padding: 0;
      }

      .productos-product-image-container.grid-view {
        height: ${stylesPublic.spacing.scale[50]};
      }

      .productos-product-details.grid-view {
        padding: ${stylesPublic.spacing.scale[3]};
      }

      .productos-product-title {
        font-size: ${stylesPublic.typography.scale.base};
        margin-bottom: ${stylesPublic.spacing.scale[2]};
      }

      .productos-product-description {
        font-size: ${stylesPublic.typography.scale.xs};
        margin-bottom: ${stylesPublic.spacing.scale[3]};
      }

      .productos-view-more-button {
        font-size: ${stylesPublic.typography.scale.xs};
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]};
      }

      .productos-no-results {
        padding: ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[4]};
      }

      .productos-no-results-text {
        font-size: ${stylesPublic.typography.scale.xl};
      }

      .productos-no-results-subtext {
        font-size: ${stylesPublic.typography.scale.xs};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .productos-container {
        padding-left: ${stylesPublic.spacing.scale[1]};
        padding-right: ${stylesPublic.spacing.scale[1]};
      }

      .productos-title {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .productos-subtitle {
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-filter-bar {
        padding: ${stylesPublic.spacing.scale[2]};
      }

      .productos-search-input {
        padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[8]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-search-icon {
        left: ${stylesPublic.spacing.scale[3]};
        font-size: ${stylesPublic.typography.scale.sm};
      }

      .productos-filter-button {
        padding: ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[2]};
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-view-button {
        width: ${stylesPublic.spacing.scale[7]};
        height: ${stylesPublic.spacing.scale[7]};
      }

      .productos-product-card.grid-view {
        max-width: ${stylesPublic.spacing.scale[70]};
      }

      .productos-product-image-container.grid-view {
        height: ${stylesPublic.spacing.scale[45]};
      }

      .productos-product-details.grid-view {
        padding: ${stylesPublic.spacing.scale[3]};
      }

      .productos-product-title {
        font-size: ${stylesPublic.typography.scale.sm};
      }

      .productos-product-description {
        font-size: ${stylesPublic.typography.scale.xs};
      }

      .productos-view-more-button {
        font-size: ${stylesPublic.typography.scale.xs};
        padding: ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]};
      }
    }
  `

  const customStyles = {
    section: {
      padding: stylesPublic.spacing.sections.lg,
      maxWidth: stylesPublic.utils.container.maxWidth['2xl'],
      margin: stylesPublic.spacing.margins.auto,
      background: stylesPublic.colors.gradients.secondary,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.slow,
      position: "relative",
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: stylesPublic.colors.gradients.glass,
      opacity: 0.1,
      pointerEvents: 'none',
      zIndex: 1,
    },
    titleUnderline: {
      display: 'block',
      width: stylesPublic.spacing.scale[20],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.sm,
      margin: `${stylesPublic.spacing.scale[4]} auto`,
    },
  }

  return (
    <>
      <style>{cssStyles}</style>
      <section style={customStyles.section}>
        <div style={customStyles.overlay}></div>
        <div className="container productos-container" style={{ position: "relative", zIndex: stylesPublic.utils.zIndex.base }}>
          <div className="productos-header">
            <h1 className="productos-title animate-in">Productos de Danza</h1>
            <span style={customStyles.titleUnderline}></span>
            <p className="productos-subtitle animate-in" style={{ animationDelay: "0.3s" }}>
              Explora nuestra selección de ropa, calzado y accesorios para danza huasteca.
            </p>
          </div>

          {isAuthenticated && (
            <div
              className="alert alert-warning animate-in"
              style={{ animationDelay: "0.4s" }}
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
                  <option value="nombre-asc">Nombre: A - Z</option>
                  <option value="nombre-desc">Nombre: Z - A</option>
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
                  {tallasUnicas.map(talla => (
                    <option key={talla} value={talla}>{talla}</option>
                  ))}
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
                  {categorias.map(categoria => (
                    <option key={categoria._id} value={categoria.nombre}>{categoria.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Localidad</label>
                <select
                  name="localidad"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.localidad}
                >
                  <option value="">Todas las localidades</option>
                  {localidades.map(localidad => (
                    <option key={localidad._id} value={localidad.nombre}>{localidad.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: stylesPublic.spacing.scale[4], marginTop: stylesPublic.spacing.scale[5] }}>
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