"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { publicAPI } from "../../services/api"
import { Search, Grid, List, Sliders, Heart, Info } from "lucide-react"
import stylesPublic from "../../styles/stylesGlobal"

const ProductCard = React.memo(
  ({ producto, vistaGrilla, handleProductClick, animationDelay }) => {
    const cardStyle = {
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.xl,
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
      boxShadow: stylesPublic.shadows.base,
      transition: stylesPublic.animations.transitions.elegant,
      cursor: "pointer",
      overflow: "hidden",
      display: "flex",
      flexDirection: vistaGrilla ? "column" : "row",
      height: vistaGrilla ? "auto" : "160px",
      animationDelay: `${animationDelay}s`,
      animation: "fadeInUp 0.5s ease-out forwards",
      opacity: 0,
      transform: "translateY(20px)",
    }

    const imageContainerStyle = {
      position: "relative",
      overflow: "hidden",
      background: stylesPublic.colors.surface.secondary,
      width: vistaGrilla ? "100%" : "160px",
      height: vistaGrilla ? "220px" : "100%",
      flexShrink: 0,
    }

    const imageStyle = {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.4s ease",
    }

    const badgeStyle = {
      position: "absolute",
      top: stylesPublic.spacing.scale[3],
      right: stylesPublic.spacing.scale[3],
      width: stylesPublic.spacing.scale[8],
      height: stylesPublic.spacing.scale[8],
      background: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.full,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: stylesPublic.colors.text.tertiary,
      opacity: 0,
      transition: "opacity 0.3s ease",
    }

    const contentStyle = {
      padding: stylesPublic.spacing.scale[5],
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: vistaGrilla ? "flex-start" : "center",
    }

    return (
      <div
        style={cardStyle}
        onClick={(e) => handleProductClick(producto._id, e)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-4px)"
          e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
          e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
          const image = e.currentTarget.querySelector("img")
          if (image) image.style.transform = "scale(1.05)"
          const badge = e.currentTarget.querySelector(".product-badge")
          if (badge) badge.style.opacity = "1"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
          e.currentTarget.style.boxShadow = stylesPublic.shadows.base
          e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
          const image = e.currentTarget.querySelector("img")
          if (image) image.style.transform = "scale(1)"
          const badge = e.currentTarget.querySelector(".product-badge")
          if (badge) badge.style.opacity = "0"
        }}
      >
        <div style={imageContainerStyle}>
          <img
            src={producto.imagenURL || "/placeholder.svg?height=220&width=280"}
            alt={producto.nombre}
            style={imageStyle}
            loading="lazy"
            onError={(e) => {
              e.target.src = "/placeholder.svg?height=220&width=280"
            }}
          />
          <div className="product-badge" style={badgeStyle}>
            <Heart size={16} />
          </div>
        </div>
        <div style={contentStyle}>
          <div style={{ marginBottom: stylesPublic.spacing.scale[3] }}>
            <h3
              style={{
                fontSize: vistaGrilla ? stylesPublic.typography.scale.lg : stylesPublic.typography.scale.base,
                fontWeight: stylesPublic.typography.weights.medium,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[1]} 0`,
                lineHeight: stylesPublic.typography.leading.tight,
              }}
            >
              {producto.nombre}
            </h3>
            {producto.localidadId?.nombre && (
              <span
                style={{
                  fontSize: stylesPublic.typography.scale.xs,
                  color: stylesPublic.colors.text.tertiary,
                  textTransform: "uppercase",
                  letterSpacing: stylesPublic.typography.tracking.wide,
                }}
              >
                {producto.localidadId.nombre}
              </span>
            )}
          </div>
          <p
            style={{
              fontSize: stylesPublic.typography.scale.sm,
              color: stylesPublic.colors.text.secondary,
              lineHeight: stylesPublic.typography.leading.relaxed,
              margin: `0 0 ${stylesPublic.spacing.scale[3]} 0`,
              display: "-webkit-box",
              WebkitLineClamp: vistaGrilla ? 2 : 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {producto.descripcion}
          </p>
          {producto.tallasDisponibles?.length > 0 && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: stylesPublic.spacing.scale[2],
                fontSize: stylesPublic.typography.scale.xs,
              }}
            >
              <span style={{ color: stylesPublic.colors.text.tertiary }}>Tallas:</span>
              <span
                style={{
                  color: stylesPublic.colors.primary[500],
                  fontWeight: stylesPublic.typography.weights.medium,
                }}
              >
                {producto.tallasDisponibles.length} disponibles
              </span>
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
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [productosApi, setProductosApi] = useState([])
  const [categorias, setCategorias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [tallasUnicas, setTallasUnicas] = useState([])
  const [loading, setLoading] = useState(true)

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

  const buttonStyle = {
    fontFamily: stylesPublic.typography.families.body,
    fontSize: stylesPublic.typography.scale.sm,
    fontWeight: 500,
    padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
    borderRadius: stylesPublic.borders.radius.md,
    border: `1px solid ${stylesPublic.colors.neutral[300]}`,
    cursor: "pointer",
    transition: stylesPublic.animations.transitions.elegant,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: stylesPublic.spacing.scale[2],
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: stylesPublic.colors.primary[500],
    color: stylesPublic.colors.primary.contrast,
    border: `1px solid ${stylesPublic.colors.primary[500]}`,
    boxShadow: stylesPublic.shadows.brand.primary,
  }

  const inputStyle = {
    width: "100%",
    padding: `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[6]}`,
    border: "none",
    background: "transparent",
    fontSize: stylesPublic.typography.scale.base,
    color: stylesPublic.colors.text.primary,
    fontFamily: stylesPublic.typography.families.body,
    outline: "none",
  }

  const selectStyle = {
    width: "100%",
    padding: stylesPublic.spacing.scale[3],
    border: `1px solid ${stylesPublic.colors.neutral[300]}`,
    borderRadius: stylesPublic.borders.radius.md,
    background: stylesPublic.colors.surface.primary,
    color: stylesPublic.colors.text.primary,
    fontSize: stylesPublic.typography.scale.sm,
    fontFamily: stylesPublic.typography.families.body,
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: stylesPublic.colors.gradients.hero,
          fontFamily: stylesPublic.typography.families.body,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: stylesPublic.spacing.scale[20],
            color: stylesPublic.colors.text.secondary,
          }}
        >
          <div
            style={{
              width: stylesPublic.spacing.scale[8],
              height: stylesPublic.spacing.scale[8],
              border: `2px solid ${stylesPublic.colors.primary[200]}`,
              borderTop: `2px solid ${stylesPublic.colors.primary[500]}`,
              borderRadius: stylesPublic.borders.radius.full,
              animation: "spin 1s linear infinite",
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          />
          <p>Cargando productos...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: stylesPublic.colors.gradients.hero,
        fontFamily: stylesPublic.typography.families.body,
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: stylesPublic.colors.gradients.sunset,
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: stylesPublic.spacing.scale[2],
              background: stylesPublic.colors.gradients.luxury,
              padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
              borderRadius: stylesPublic.borders.radius.full,
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          >
            <Search
              style={{
                width: stylesPublic.spacing.scale[4],
                height: stylesPublic.spacing.scale[4],
                color: stylesPublic.colors.primary[600],
              }}
            />
            <span
              style={{
                fontSize: stylesPublic.typography.scale.sm,
                fontWeight: 500,
                color: stylesPublic.colors.primary[800],
              }}
            >
              Catálogo de Productos
            </span>
          </div>
          <h1
            style={{
              ...stylesPublic.typography.headings.h1,
              margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
            }}
          >
            Productos de
            <span
              style={{
                display: "block",
                background: stylesPublic.colors.gradients.elegant,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Danza Huasteca
            </span>
          </h1>
          <p
            style={{
              ...stylesPublic.typography.body.large,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            Colección artesanal de ropa y accesorios para danza huasteca, elaborados con técnicas ancestrales y
            materiales de la más alta calidad.
          </p>
        </div>
      </section>

      {/* Alert Section */}
      {isAuthenticated && (
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]}`,
          }}
        >
          <div
            style={{
              background: stylesPublic.colors.semantic.warning.light,
              border: `1px solid ${stylesPublic.colors.semantic.warning.main}`,
              color: stylesPublic.colors.semantic.warning.main,
              padding: `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[6]}`,
              borderRadius: stylesPublic.borders.radius.lg,
              display: "flex",
              alignItems: "center",
              gap: stylesPublic.spacing.scale[2],
              fontSize: stylesPublic.typography.scale.sm,
            }}
          >
            <Info size={16} />
            Se requiere anticipo del 50% para realizar pedidos
          </div>
        </section>
      )}

      {/* Controls Section */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[12]}`,
        }}
      >
        {/* Search Section */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: stylesPublic.spacing.scale[2],
            marginBottom: stylesPublic.spacing.scale[8],
            padding: stylesPublic.spacing.scale[2],
            border: `1px solid ${stylesPublic.colors.neutral[300]}`,
            borderRadius: stylesPublic.borders.radius.full,
            background: stylesPublic.colors.surface.primary,
            boxShadow: stylesPublic.shadows.sm,
          }}
        >
          <input
            name="busqueda"
            type="text"
            placeholder="Buscar productos..."
            style={inputStyle}
            onChange={handleChange}
            value={filtros.busqueda}
          />
          <button
            style={{
              ...primaryButtonStyle,
              borderRadius: stylesPublic.borders.radius.full,
              padding: stylesPublic.spacing.scale[3],
            }}
          >
            <Search size={16} />
          </button>
        </div>

        {/* Filter Bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: stylesPublic.spacing.scale[6],
            flexWrap: "wrap",
            gap: stylesPublic.spacing.scale[4],
          }}
        >
          <div style={{ display: "flex", gap: stylesPublic.spacing.scale[4], alignItems: "center" }}>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: filtrosExpandidos ? stylesPublic.colors.primary[500] : "transparent",
                color: filtrosExpandidos ? stylesPublic.colors.primary.contrast : stylesPublic.colors.text.secondary,
                borderColor: filtrosExpandidos ? stylesPublic.colors.primary[500] : stylesPublic.colors.neutral[300],
              }}
              onClick={toggleFiltros}
            >
              <Sliders size={16} />
              Filtros
              {filtrosActivos > 0 && ` (${filtrosActivos})`}
            </button>
          </div>

          <div
            style={{
              display: "flex",
              border: `1px solid ${stylesPublic.colors.neutral[300]}`,
              borderRadius: stylesPublic.borders.radius.md,
              overflow: "hidden",
            }}
          >
            <button
              style={{
                ...buttonStyle,
                backgroundColor: vistaGrilla ? stylesPublic.colors.primary[500] : "transparent",
                color: vistaGrilla ? stylesPublic.colors.primary.contrast : stylesPublic.colors.text.secondary,
                border: "none",
                borderRadius: 0,
              }}
              onClick={() => vistaGrilla || toggleVistaGrilla()}
              disabled={isTransitioning}
            >
              <Grid size={16} />
            </button>
            <button
              style={{
                ...buttonStyle,
                backgroundColor: !vistaGrilla ? stylesPublic.colors.primary[500] : "transparent",
                color: !vistaGrilla ? stylesPublic.colors.primary.contrast : stylesPublic.colors.text.secondary,
                border: "none",
                borderRadius: 0,
              }}
              onClick={() => !vistaGrilla || toggleVistaGrilla()}
              disabled={isTransitioning}
            >
              <List size={16} />
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        {filtrosExpandidos && (
          <div
            style={{
              background: stylesPublic.colors.surface.glass,
              borderRadius: stylesPublic.borders.radius.xl,
              padding: stylesPublic.spacing.scale[6],
              marginBottom: stylesPublic.spacing.scale[8],
              border: `1px solid ${stylesPublic.colors.neutral[200]}`,
              backdropFilter: "blur(10px)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: stylesPublic.spacing.scale[4],
                marginBottom: stylesPublic.spacing.scale[6],
              }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: stylesPublic.typography.scale.xs,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: stylesPublic.spacing.scale[2],
                    textTransform: "uppercase",
                    letterSpacing: stylesPublic.typography.tracking.wide,
                  }}
                >
                  Ordenar
                </label>
                <select name="ordenar" style={selectStyle} onChange={handleChange} value={filtros.ordenar}>
                  <option value="">Relevancia</option>
                  <option value="nombre-asc">A - Z</option>
                  <option value="nombre-desc">Z - A</option>
                  <option value="newest">Recientes</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: stylesPublic.typography.scale.xs,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: stylesPublic.spacing.scale[2],
                    textTransform: "uppercase",
                    letterSpacing: stylesPublic.typography.tracking.wide,
                  }}
                >
                  Talla
                </label>
                <select name="talla" style={selectStyle} onChange={handleChange} value={filtros.talla}>
                  <option value="">Todas</option>
                  {tallasUnicas.map((talla) => (
                    <option key={talla} value={talla}>
                      {talla}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: stylesPublic.typography.scale.xs,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: stylesPublic.spacing.scale[2],
                    textTransform: "uppercase",
                    letterSpacing: stylesPublic.typography.tracking.wide,
                  }}
                >
                  Categoría
                </label>
                <select name="categoria" style={selectStyle} onChange={handleChange} value={filtros.categoria}>
                  <option value="">Todas</option>
                  {categorias.map((categoria) => (
                    <option key={categoria._id} value={categoria.nombre}>
                      {categoria.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: stylesPublic.typography.scale.xs,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: stylesPublic.spacing.scale[2],
                    textTransform: "uppercase",
                    letterSpacing: stylesPublic.typography.tracking.wide,
                  }}
                >
                  Localidad
                </label>
                <select name="localidad" style={selectStyle} onChange={handleChange} value={filtros.localidad}>
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
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: "transparent",
                  color: stylesPublic.colors.text.secondary,
                }}
                onClick={limpiarFiltros}
              >
                Limpiar filtros
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Results Section */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `0 ${stylesPublic.spacing.scale[4]}`,
        }}
      >
        <div
          style={{
            textAlign: "center",
            fontSize: stylesPublic.typography.scale.sm,
            color: stylesPublic.colors.text.tertiary,
            marginBottom: stylesPublic.spacing.scale[8],
          }}
        >
          {productosFiltrados.length} productos encontrados
        </div>

        {productosFiltrados.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: vistaGrilla ? "repeat(auto-fill, minmax(280px, 1fr))" : "1fr",
              gap: vistaGrilla ? stylesPublic.spacing.scale[8] : stylesPublic.spacing.scale[4],
              marginBottom: stylesPublic.spacing.scale[20],
            }}
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
          <div
            style={{
              textAlign: "center",
              padding: `${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[8]}`,
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div
              style={{
                fontSize: stylesPublic.typography.scale["4xl"],
                marginBottom: stylesPublic.spacing.scale[4],
                opacity: 0.5,
              }}
            >
              🔍
            </div>
            <h3
              style={{
                fontSize: stylesPublic.typography.scale.xl,
                fontWeight: stylesPublic.typography.weights.medium,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
              }}
            >
              Sin resultados
            </h3>
            <p
              style={{
                fontSize: stylesPublic.typography.scale.base,
                color: stylesPublic.colors.text.secondary,
                marginBottom: stylesPublic.spacing.scale[6],
              }}
            >
              No encontramos productos que coincidan con tu búsqueda
            </p>
            <button style={primaryButtonStyle} onClick={limpiarFiltros}>
              Reiniciar búsqueda
            </button>
          </div>
        )}
      </section>
    </div>
  )
}

export default Productos
