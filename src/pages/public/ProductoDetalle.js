import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Palette, Ruler, Tag, MessageCircle } from "lucide-react"
import { publicAPI } from "../../services/api"
import stylesPublic from "../../styles/stylesGlobal"

// Estilos CSS responsivos y animaciones
const responsiveStyles = `
  /* Animaciones mejoradas */
  @keyframes fadeInUp {
    from { 
      opacity: 0; 
      transform: translateY(30px); 
    }
    to { 
      opacity: 1; 
      transform: translateY(0); 
    }
  }
  
  @keyframes slideInLeft {
    from { 
      opacity: 0; 
      transform: translateX(-40px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes slideInRight {
    from { 
      opacity: 0; 
      transform: translateX(40px); 
    }
    to { 
      opacity: 1; 
      transform: translateX(0); 
    }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(1.02); }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  /* Clases de animación */
  .animate-in-up {
    animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .animate-in-left {
    animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .animate-in-right {
    animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  }
  
  .loading-shimmer {
    background: linear-gradient(90deg, 
      #f0f0f0 25%, 
      #e0e0e0 50%, 
      #f0f0f0 75%
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .pulse-animation {
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  
  /* Responsividad */
  @media (max-width: 1200px) {
    .producto-grid {
      grid-template-columns: 1fr !important;
      gap: 3rem !important;
    }
    
    .producto-container {
      padding: 2rem !important;
    }
    
    .producto-image {
      height: 500px !important;
    }
    
    .producto-specs-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)) !important;
    }
  }
  
  @media (max-width: 1024px) {
    .producto-grid {
      grid-template-columns: 1fr !important;
      gap: 2rem !important;
    }
    
    .producto-container {
      padding: 1.5rem !important;
    }
    
    .producto-image {
      height: 450px !important;
    }
    
    .producto-specs-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 1.5rem !important;
    }
  }
  
  @media (max-width: 768px) {
    /* Ajustar padding top para móviles */
    .producto-main-container {
      padding-top: 70px !important;
    }
    
    .producto-hero {
      padding: 3rem 0 2rem !important;
    }
    
    .producto-hero h1 {
      font-size: 2rem !important;
      line-height: 1.2 !important;
    }
    
    .producto-hero p {
      font-size: 1rem !important;
    }
    
    .producto-container {
      padding: 1rem !important;
      margin: 0 1rem !important;
    }
    
    .producto-image {
      height: 300px !important;
    }
    
    .producto-specs-grid {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
    
    .producto-actions {
      flex-direction: column !important;
      align-items: stretch !important;
    }
    
    .producto-button {
      width: 100% !important;
      justify-content: center !important;
      margin: 0 0 0.75rem 0 !important;
    }
    
    .producto-card {
      padding: 1rem !important;
    }
  }
  
  @media (max-width: 480px) {
    /* Ajustar padding top para pantallas muy pequeñas */
    .producto-main-container {
      padding-top: 60px !important;
    }
    
    .producto-hero {
      padding: 2rem 0 1.5rem !important;
    }
    
    .producto-hero h1 {
      font-size: 1.75rem !important;
    }
    
    .producto-hero .badge {
      font-size: 0.8rem !important;
      padding: 0.375rem 0.75rem !important;
    }
    
    .producto-container {
      padding: 0.75rem !important;
      margin: 0 0.5rem !important;
    }
    
    .producto-image {
      height: 250px !important;
    }
    
    .producto-title {
      font-size: 1.5rem !important;
    }
    
    .producto-description {
      font-size: 0.95rem !important;
    }
    
    .producto-card {
      padding: 0.75rem !important;
    }
    
    .producto-button {
      font-size: 0.9rem !important;
      padding: 0.75rem 1rem !important;
    }
  }
  
  /* Mejoras de accesibilidad */
  @media (prefers-reduced-motion: reduce) {
    .animate-in-up,
    .animate-in-left,
    .animate-in-right,
    .pulse-animation {
      animation: none !important;
    }
    
    * {
      transition: none !important;
    }
  }
  
  /* Hover effects solo en dispositivos no táctiles */
  @media (hover: hover) and (pointer: fine) {
    .hover-lift:hover {
      transform: translateY(-4px) !important;
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15) !important;
    }
    
    .hover-scale:hover {
      transform: scale(1.02) !important;
    }
    
    .spec-card:hover {
      border-color: rgba(59, 130, 246, 0.3) !important;
      background: rgba(255, 255, 255, 0.95) !important;
    }
    
    .producto-image:hover {
      transform: translateY(-4px) scale(1.02) !important;
      box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35) !important;
    }
    
    .producto-image:hover img {
      transform: scale(1.05) !important;
    }
    
    .producto-button:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.3) !important;
    }
  }
  
  /* Estados de focus para accesibilidad */
  .producto-button:focus,
  .spec-card:focus {
    outline: 2px solid rgba(59, 130, 246, 0.5);
    outline-offset: 2px;
  }
`;

// Inyectar estilos CSS mejorados
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-producto-detalle-styles]')) {
    styleElement.setAttribute('data-producto-detalle-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const ProductoDetalleEnhanced = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    image: false,
    details: false,
    specs: false,
    actions: false
  })

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        setLoading(true)
        const data = await publicAPI.getProductoById(id)
        setProducto(data)
        setLoading(false)

        // Activar animaciones de forma escalonada después de que el producto esté cargado
        const timeouts = []
        
        requestAnimationFrame(() => {
          timeouts.push(setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100))
          timeouts.push(setTimeout(() => setIsVisible(prev => ({ ...prev, image: true })), 300))
          timeouts.push(setTimeout(() => setIsVisible(prev => ({ ...prev, details: true })), 500))
          timeouts.push(setTimeout(() => setIsVisible(prev => ({ ...prev, specs: true })), 700))
          timeouts.push(setTimeout(() => setIsVisible(prev => ({ ...prev, actions: true })), 900))
        })

        // Cleanup function
        return () => {
          timeouts.forEach(timeout => clearTimeout(timeout))
        }
      } catch (error) {
        console.error("Error al cargar producto:", error)
        navigate("/productos")
      }
    }

    const cleanup = cargarProducto()
    
    // Cleanup en el unmount del componente
    return () => {
      if (cleanup && typeof cleanup === 'function') {
        cleanup()
      }
    }
  }, [id, navigate])

  const handleWhatsAppContact = () => {
    const phoneNumber = "527715563522"
    const message = `¡Hola! Me interesa este producto de La Aterciopelada:

📋 *${producto?.nombre || "Producto"}*

${producto?.descripcion ? `📝 Descripción: ${producto.descripcion}` : ""}

${producto?.localidadId?.nombre ? `📍 Localidad: ${producto.localidadId.nombre}` : ""}

${producto?.tallasDisponibles?.length ? `👗 Tallas disponibles: ${producto.tallasDisponibles.length}` : ""}

¿Podrían proporcionarme más información sobre disponibilidad, precios y formas de pago?

¡Gracias! 😊`

    const encodedMessage = encodeURIComponent(message)
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappURL, "_blank")
  }

  // Estilos responsivos mejorados
  const buttonStyle = {
    fontFamily: stylesPublic.typography.families.body,
    fontSize: stylesPublic.typography.scale.base,
    fontWeight: 500,
    padding: `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]}`,
    borderRadius: stylesPublic.borders.radius.full,
    border: "none",
    cursor: "pointer",
    transition: stylesPublic.animations.transitions.elegant,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: stylesPublic.spacing.scale[2],
    minHeight: "44px", // Accesibilidad táctil
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: stylesPublic.colors.primary[500],
    color: stylesPublic.colors.primary.contrast,
    boxShadow: stylesPublic.shadows.brand.primary,
  }

  const whatsappButtonStyle = {
    ...buttonStyle,
    background: "linear-gradient(135deg, #25D366, #128C7E)",
    color: "#ffffff",
    boxShadow: "0 8px 32px -8px rgba(37, 211, 102, 0.4)",
  }

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(20px)",
    border: `1px solid rgba(255, 255, 255, 0.2)`,
    borderRadius: stylesPublic.borders.radius.xl,
    padding: stylesPublic.spacing.scale[6],
    transition: stylesPublic.animations.transitions.elegant,
    position: "relative",
    overflow: "hidden",
  }

  if (loading || !producto) {
    return (
      <div
        className="producto-main-container"
        style={{
          minHeight: "100vh",
          background: stylesPublic.colors.gradients.hero,
          fontFamily: stylesPublic.typography.families.body,
          paddingTop: "80px", // Espacio para el navbar fijo
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 80px)",
            gap: stylesPublic.spacing.scale[4],
            padding: stylesPublic.spacing.scale[4],
          }}
        >
          <div
            className="pulse-animation"
            style={{
              width: stylesPublic.spacing.scale[16],
              height: stylesPublic.spacing.scale[16],
              borderRadius: stylesPublic.borders.radius.full,
              background: stylesPublic.colors.primary[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: stylesPublic.typography.scale["2xl"],
                color: stylesPublic.colors.text.inverse,
              }}
            >
              🖼️
            </div>
          </div>
          <div style={{ textAlign: "center", maxWidth: "300px" }}>
            <h3
              style={{
                ...stylesPublic.typography.headings.h3,
                color: stylesPublic.colors.text.primary,
                marginBottom: stylesPublic.spacing.scale[2],
              }}
            >
              Cargando Producto
            </h3>
            <p
              style={{
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.secondary,
                margin: 0,
              }}
            >
              Preparando los detalles de esta pieza artesanal...
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="producto-main-container"
      style={{
        minHeight: "100vh",
        background: stylesPublic.colors.gradients.hero,
        fontFamily: stylesPublic.typography.families.body,
        position: "relative",
        paddingTop: "80px", // Espacio para el navbar fijo
      }}
    >
      {/* Background Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Hero Section */}
      <section
        className={`producto-hero ${isVisible.hero ? 'animate-in-up' : ''}`}
        style={{
          padding: `${stylesPublic.spacing.scale[25]} 0 ${stylesPublic.spacing.scale[15]}`,
          position: "relative",
          opacity: isVisible.hero ? 1 : 0,
          transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
          transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
            textAlign: "center",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div
            className="badge"
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
            <div
              style={{
                width: stylesPublic.spacing.scale[4],
                height: stylesPublic.spacing.scale[4],
                color: stylesPublic.colors.primary[600],
              }}
            >
              🎨
            </div>
            <span
              style={{
                fontSize: stylesPublic.typography.scale.sm,
                fontWeight: 500,
                color: stylesPublic.colors.primary[800],
              }}
            >
              Detalle del Producto
            </span>
          </div>

          <h1
            style={{
              ...stylesPublic.typography.headings.h1,
              fontWeight: stylesPublic.typography.weights.light,
              letterSpacing: "-0.02em",
              color: stylesPublic.colors.text.primary,
              margin: `0 0 ${stylesPublic.spacing.scale[6]} 0`,
            }}
          >
            Pieza
            <span
              style={{
                display: "block",
                background: stylesPublic.colors.gradients.elegant,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Artesanal Única
            </span>
          </h1>

          <div
            style={{
              display: "block",
              width: stylesPublic.spacing.scale[24],
              height: stylesPublic.spacing.scale[1],
              background: stylesPublic.colors.gradients.luxury,
              borderRadius: stylesPublic.borders.radius.sm,
              margin: `${stylesPublic.spacing.scale[6]} auto`,
            }}
          />

          <p
            style={{
              ...stylesPublic.typography.body.large,
              color: stylesPublic.colors.text.secondary,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
            }}
          >
            Descubre cada detalle de esta pieza artesanal única, creada con técnicas tradicionales huastecas
          </p>
        </div>
      </section>

      {/* Product Details */}
      <section
        className="producto-container"
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[25]}`,
        }}
      >
        <div
          className="producto-card"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            borderRadius: stylesPublic.borders.radius["2xl"],
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            padding: stylesPublic.spacing.scale[10],
            position: "relative",
            zIndex: 2,
          }}
        >
          <div
            className="producto-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: stylesPublic.spacing.scale[12],
              alignItems: "center",
            }}
          >
            {/* Product Image */}
            <div
              className={`producto-image-container ${isVisible.image ? "animate-in-left" : ""}`}
              style={{
                opacity: isVisible.image ? 1 : 0,
                transform: isVisible.image ? "translateX(0)" : "translateX(-40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <div
                className="producto-image hover-lift"
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: stylesPublic.borders.radius.xl,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                  height: "600px",
                  background: stylesPublic.colors.neutral[100],
                }}
              >
                {!imageLoaded && (
                  <div
                    className="loading-shimmer"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: stylesPublic.typography.scale["4xl"],
                      color: stylesPublic.colors.neutral[400],
                    }}
                  >
                    🖼️
                  </div>
                )}
                <img
                  src={producto.imagenURL || "/placeholder.svg?height=600&width=600"}
                  alt={producto.nombre}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: imageLoaded ? 1 : 0,
                  }}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=600&width=600"
                    setImageLoaded(true)
                  }}
                />
              </div>
            </div>

            {/* Product Info */}
            <div
              className={`producto-details ${isVisible.details ? "animate-in-right" : ""}`}
              style={{
                opacity: isVisible.details ? 1 : 0,
                transform: isVisible.details ? "translateX(0)" : "translateX(40px)",
                transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              <h1
                className="producto-title"
                style={{
                  ...stylesPublic.typography.headings.h2,
                  fontWeight: stylesPublic.typography.weights.light,
                  letterSpacing: "-0.01em",
                  color: stylesPublic.colors.text.primary,
                  margin: `0 0 ${stylesPublic.spacing.scale[6]} 0`,
                  lineHeight: 1.2,
                }}
              >
                {producto.nombre}
              </h1>

              <p
                className="producto-description"
                style={{
                  ...stylesPublic.typography.body.large,
                  color: stylesPublic.colors.text.secondary,
                  marginBottom: stylesPublic.spacing.scale[10],
                  lineHeight: 1.7,
                }}
              >
                {producto.descripcion ||
                  "Esta pieza artesanal representa la rica tradición textil de la Huasteca, elaborada con técnicas ancestrales que han sido transmitidas de generación en generación."}
              </p>

              {/* Specs Grid */}
              <div
                className={`producto-specs-grid ${isVisible.specs ? "animate-in-up" : ""}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: stylesPublic.spacing.scale[6],
                  marginBottom: stylesPublic.spacing.scale[10],
                  opacity: isVisible.specs ? 1 : 0,
                  transform: isVisible.specs ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <div
                  className="spec-card hover-lift"
                  style={cardStyle}
                >
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.xs,
                      fontWeight: stylesPublic.typography.weights.semibold,
                      color: stylesPublic.colors.primary[600],
                      marginBottom: stylesPublic.spacing.scale[2],
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[2],
                    }}
                  >
                    <MapPin size={16} />
                    Localidad de Origen
                  </div>
                  <div
                    style={{
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.primary,
                      fontWeight: stylesPublic.typography.weights.medium,
                    }}
                  >
                    {producto.localidadId?.nombre || "Región Huasteca"}
                  </div>
                </div>

                <div
                  className="spec-card hover-lift"
                  style={cardStyle}
                >
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.xs,
                      fontWeight: stylesPublic.typography.weights.semibold,
                      color: stylesPublic.colors.primary[600],
                      marginBottom: stylesPublic.spacing.scale[2],
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[2],
                    }}
                  >
                    <Palette size={16} />
                    Tipo de Tela
                  </div>
                  <div
                    style={{
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.primary,
                      fontWeight: stylesPublic.typography.weights.medium,
                    }}
                  >
                    {producto.tipoTela || "Algodón Artesanal"}
                  </div>
                </div>

                <div
                  className="spec-card hover-lift"
                  style={cardStyle}
                >
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.xs,
                      fontWeight: stylesPublic.typography.weights.semibold,
                      color: stylesPublic.colors.primary[600],
                      marginBottom: stylesPublic.spacing.scale[2],
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[2],
                    }}
                  >
                    <Ruler size={16} />
                    Tallas Disponibles
                  </div>
                  <div
                    style={{
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.primary,
                      fontWeight: stylesPublic.typography.weights.medium,
                    }}
                  >
                    {producto.tallasDisponibles?.map((td) => td.talla).join(", ") || "Talla Única"}
                  </div>
                </div>

                <div
                  className="spec-card hover-lift"
                  style={cardStyle}
                >
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.xs,
                      fontWeight: stylesPublic.typography.weights.semibold,
                      color: stylesPublic.colors.primary[600],
                      marginBottom: stylesPublic.spacing.scale[2],
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[2],
                    }}
                  >
                    <Tag size={16} />
                    Categorías
                  </div>
                  <div
                    style={{
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.primary,
                      fontWeight: stylesPublic.typography.weights.medium,
                    }}
                  >
                    {producto.tallasDisponibles
                      ?.map((td) => td.categoriaId?.nombre)
                      .filter(Boolean)
                      .join(", ") || "Artesanía Tradicional"}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className={`producto-actions ${isVisible.actions ? "animate-in-up" : ""}`}
                style={{
                  opacity: isVisible.actions ? 1 : 0,
                  transform: isVisible.actions ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: stylesPublic.spacing.scale[4],
                }}
              >
                <button
                  className="producto-button hover-lift"
                  style={primaryButtonStyle}
                  onClick={() => navigate("/productos")}
                >
                  <ArrowLeft size={16} />
                  Volver a Productos
                </button>

                <button
                  className="producto-button hover-lift"
                  style={whatsappButtonStyle}
                  onClick={handleWhatsAppContact}
                >
                  <MessageCircle size={16} />
                  Contactar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProductoDetalleEnhanced
