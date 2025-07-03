"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Palette, Ruler, Tag, MessageCircle } from "lucide-react"
import { publicAPI } from "../../services/api"
import stylesPublic from "../../styles/stylesGlobal"

const ProductoDetalleEnhanced = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [producto, setProducto] = useState(null)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    image: false,
    details: false,
    specs: false,
    actions: false,
  })

  useEffect(() => {
    const cargarProducto = async () => {
      try {
        const data = await publicAPI.getProductoById(id)
        setProducto(data)

        // Animaciones escalonadas
        setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, image: true })), 300)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, details: true })), 500)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, specs: true })), 700)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, actions: true })), 900)
      } catch (error) {
        console.error("Error al cargar producto:", error)
        navigate("/productos")
      }
    }

    cargarProducto()
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
    marginLeft: stylesPublic.spacing.scale[4],
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

  if (!producto) {
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
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            gap: stylesPublic.spacing.scale[4],
          }}
        >
          <div
            style={{
              width: stylesPublic.spacing.scale[16],
              height: stylesPublic.spacing.scale[16],
              borderRadius: stylesPublic.borders.radius.full,
              background: stylesPublic.colors.primary[500],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
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
                fontSize: stylesPublic.typography.scale.xl,
                fontWeight: stylesPublic.typography.weights.light,
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
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 0.4; transform: scale(1); }
              50% { opacity: 0.8; transform: scale(1.02); }
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
        position: "relative",
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from { 
              opacity: 0; 
              transform: translateY(${stylesPublic.spacing.scale[12]}) scale(0.95); 
            }
            to { 
              opacity: 1; 
              transform: translateY(0) scale(1); 
            }
          }
          
          @keyframes slideInLeft {
            from { 
              opacity: 0; 
              transform: translateX(-${stylesPublic.spacing.scale[16]}) scale(0.9); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes slideInRight {
            from { 
              opacity: 0; 
              transform: translateX(${stylesPublic.spacing.scale[16]}) scale(0.9); 
            }
            to { 
              opacity: 1; 
              transform: translateX(0) scale(1); 
            }
          }
          
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          .animate-in-up {
            animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          
          .animate-in-left {
            animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          
          .animate-in-right {
            animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
          
          .loading-shimmer {
            background: linear-gradient(90deg, 
              ${stylesPublic.colors.neutral[200]} 25%, 
              ${stylesPublic.colors.neutral[100]} 50%, 
              ${stylesPublic.colors.neutral[200]} 75%
            );
            background-size: 200% 100%;
            animation: shimmer 2s infinite;
          }
        `}
      </style>

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
        style={{
          padding: `${stylesPublic.spacing.scale[25]} 0 ${stylesPublic.spacing.scale[15]}`,
          position: "relative",
          opacity: isVisible.hero ? 1 : 0,
          transform: isVisible.hero ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[12]})`,
          transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
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
            className="animate-in-up"
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
            className="animate-in-up"
            style={{
              display: "block",
              width: stylesPublic.spacing.scale[24],
              height: stylesPublic.spacing.scale[1],
              background: stylesPublic.colors.gradients.luxury,
              borderRadius: stylesPublic.borders.radius.sm,
              margin: `${stylesPublic.spacing.scale[6]} auto`,
              animationDelay: "0.2s",
            }}
          />

          <p
            className="animate-in-up"
            style={{
              ...stylesPublic.typography.body.large,
              color: stylesPublic.colors.text.secondary,
              maxWidth: "600px",
              margin: "0 auto",
              lineHeight: 1.6,
              animationDelay: "0.4s",
            }}
          >
            Descubre cada detalle de esta pieza artesanal única, creada con técnicas tradicionales huastecas
          </p>
        </div>
      </section>

      {/* Product Details */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[25]}`,
        }}
      >
        <div
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
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
              gap: stylesPublic.spacing.scale[12],
              alignItems: "center",
            }}
          >
            {/* Product Image */}
            <div
              className={isVisible.image ? "animate-in-left" : ""}
              style={{
                opacity: isVisible.image ? 1 : 0,
                animationDelay: "0.2s",
              }}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: stylesPublic.borders.radius.xl,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  transition: "all 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]}) scale(1.02)`
                  e.currentTarget.style.boxShadow = "0 32px 64px -12px rgba(0, 0, 0, 0.35)"
                  const img = e.currentTarget.querySelector("img")
                  if (img) img.style.transform = "scale(1.05)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0) scale(1)"
                  e.currentTarget.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                  const img = e.currentTarget.querySelector("img")
                  if (img) img.style.transform = "scale(1)"
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
                    }}
                  />
                )}
                <img
                  src={producto.imagenURL || "/placeholder.svg?height=600&width=600"}
                  alt={producto.nombre}
                  style={{
                    width: "100%",
                    height: "600px",
                    objectFit: "cover",
                    transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
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
              className={isVisible.details ? "animate-in-right" : ""}
              style={{
                opacity: isVisible.details ? 1 : 0,
                animationDelay: "0.4s",
              }}
            >
              <h1
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
                className={isVisible.specs ? "animate-in-up" : ""}
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: stylesPublic.spacing.scale[6],
                  marginBottom: stylesPublic.spacing.scale[10],
                  opacity: isVisible.specs ? 1 : 0,
                  animationDelay: "0.6s",
                }}
              >
                <div
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]})`
                    e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                    e.currentTarget.style.borderColor = stylesPublic.colors.primary[300]
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                  }}
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
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]})`
                    e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                    e.currentTarget.style.borderColor = stylesPublic.colors.primary[300]
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                  }}
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
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]})`
                    e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                    e.currentTarget.style.borderColor = stylesPublic.colors.primary[300]
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                  }}
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
                  style={cardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]})`
                    e.currentTarget.style.boxShadow = "0 20px 40px -12px rgba(0, 0, 0, 0.15)"
                    e.currentTarget.style.borderColor = stylesPublic.colors.primary[300]
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.95)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "none"
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.2)"
                    e.currentTarget.style.background = "rgba(255, 255, 255, 0.8)"
                  }}
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
                className={isVisible.actions ? "animate-in-up" : ""}
                style={{
                  opacity: isVisible.actions ? 1 : 0,
                  animationDelay: "0.8s",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: stylesPublic.spacing.scale[4],
                }}
              >
                <button
                  style={primaryButtonStyle}
                  onClick={() => navigate("/productos")}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`
                    e.currentTarget.style.boxShadow = "0 12px 24px -8px rgba(0, 0, 0, 0.3)"
                    e.currentTarget.style.background = stylesPublic.colors.gradients.secondary
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.primary
                    e.currentTarget.style.background = stylesPublic.colors.primary[500]
                  }}
                >
                  <ArrowLeft size={16} />
                  Volver a Productos
                </button>

                <button
                  style={whatsappButtonStyle}
                  onClick={handleWhatsAppContact}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`
                    e.currentTarget.style.boxShadow = "0 12px 24px -8px rgba(37, 211, 102, 0.4)"
                    e.currentTarget.style.background = "linear-gradient(135deg, #128C7E, #25D366)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = "0 8px 32px -8px rgba(37, 211, 102, 0.4)"
                    e.currentTarget.style.background = "linear-gradient(135deg, #25D366, #128C7E)"
                  }}
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
