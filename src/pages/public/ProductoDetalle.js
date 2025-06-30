"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Container, Row, Col, Image } from "react-bootstrap"
import "bootstrap-icons/font/bootstrap-icons.min.css"
import stylesPublic from "../../styles/stylesPublic"

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
    // Obtener producto desde la API
    fetch(`http://localhost:5000/api/public/productos/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProducto(data)
        // Animaciones escalonadas más sofisticadas
        setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, image: true })), 300)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, details: true })), 500)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, specs: true })), 700)
        setTimeout(() => setIsVisible((prev) => ({ ...prev, actions: true })), 900)
      })
      .catch(() => {
        navigate("/productos")
      })
  }, [id, navigate])

  // CSS con animaciones y estilos refinados
  const cssStyles = `
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

    @keyframes pulse {
      0%, 100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.02); }
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
    
    .product-image-container {
      position: relative;
      overflow: hidden;
      border-radius: ${stylesPublic.borders.radius.xl};
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .product-image-container::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      opacity: 0;
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2;
      pointer-events: none;
    }

    .product-image-container:hover::before {
      opacity: 1;
    }

    .product-image-container:hover {
      transform: translateY(-${stylesPublic.spacing.scale[2]}) scale(1.02);
      box-shadow: 0 32px 64px -12px rgba(0, 0, 0, 0.35);
    }
    
    .product-image {
      width: 100%;
      height: ${stylesPublic.spacing.scale[150]};
      object-fit: cover;
      transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .product-image-container:hover .product-image {
      transform: scale(1.05);
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

    .spec-card {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: ${stylesPublic.borders.radius.xl};
      padding: ${stylesPublic.spacing.scale[6]};
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;
      overflow: hidden;
    }

    .spec-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
      transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .spec-card:hover::before {
      left: 100%;
    }

    .spec-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[2]});
      box-shadow: 0 20px 40px -12px rgba(0, 0, 0, 0.15);
      border-color: ${stylesPublic.colors.primary[300]};
      background: rgba(255, 255, 255, 0.95);
    }

    .back-button {
      position: relative;
      overflow: hidden;
      background: ${stylesPublic.colors.gradients.primary};
      border: none;
      border-radius: ${stylesPublic.borders.radius.full};
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]};
      color: ${stylesPublic.colors.text.inverse};
      font-weight: ${stylesPublic.typography.weights.medium};
      font-size: ${stylesPublic.typography.scale.base};
      letter-spacing: -0.01em;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
      display: inline-flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
    }

    .back-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .back-button:hover::before {
      left: 100%;
    }

    .back-button:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.3);
      background: ${stylesPublic.colors.gradients.secondary};
    }

    .loading-skeleton {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .product-image {
        height: ${stylesPublic.spacing.scale[125]} !important;
      }
      .product-title {
        font-size: ${stylesPublic.typography.scale["2xl"]} !important;
      }
      .spec-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[4]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .product-image {
        height: ${stylesPublic.spacing.scale[100]} !important;
      }
      .product-title {
        font-size: ${stylesPublic.typography.scale.xl} !important;
      }
      .spec-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[3]} !important;
      }
      .product-container {
        padding: ${stylesPublic.spacing.scale[6]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .product-image {
        height: ${stylesPublic.spacing.scale[75]} !important;
      }
      .product-title {
        font-size: ${stylesPublic.typography.scale.lg} !important;
        margin-bottom: ${stylesPublic.spacing.scale[3]} !important;
      }
      .spec-grid {
        grid-template-columns: 1fr !important;
        gap: ${stylesPublic.spacing.scale[2]} !important;
      }
      .spec-card {
        padding: ${stylesPublic.spacing.scale[4]} !important;
      }
      .product-container {
        padding: ${stylesPublic.spacing.scale[4]} !important;
        border-radius: ${stylesPublic.borders.radius.lg} !important;
      }
      .back-button {
        width: 100%;
        justify-content: center;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .product-image {
        height: ${stylesPublic.spacing.scale[62]} !important;
      }
      .product-title {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
      .product-container {
        padding: ${stylesPublic.spacing.scale[3]} !important;
        border-radius: ${stylesPublic.borders.radius.md} !important;
      }
    }
  `

  if (!producto) {
    return (
      <>
        <style>{cssStyles}</style>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: stylesPublic.colors.gradients.warm,
            gap: stylesPublic.spacing.scale[4],
          }}
        >
          <div
            className="loading-skeleton"
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
            <i
              className="bi bi-image"
              style={{
                fontSize: stylesPublic.typography.scale["2xl"],
                color: stylesPublic.colors.text.inverse,
              }}
            ></i>
          </div>
          <div
            style={{
              textAlign: "center",
              maxWidth: "300px",
            }}
          >
            <h3
              style={{
                ...stylesPublic.typography.headings.h4,
                color: stylesPublic.colors.text.primary,
                marginBottom: stylesPublic.spacing.scale[2],
                fontWeight: stylesPublic.typography.weights.light,
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
      </>
    )
  }

  const customStyles = {
    pageContainer: {
      background: stylesPublic.colors.gradients.hero,
      minHeight: "100vh",
      position: "relative",
    },
    pageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
      pointerEvents: "none",
      zIndex: 1,
    },
    heroSection: {
      padding: `${stylesPublic.spacing.scale[25]} 0 ${stylesPublic.spacing.scale[15]}`,
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[12]})`,
      transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    heroContent: {
      position: "relative",
      zIndex: stylesPublic.utils.zIndex.docked,
      textAlign: "center",
    },
    heroTitle: {
      ...stylesPublic.typography.headings.h1,
      fontWeight: stylesPublic.typography.weights.extralight,
      letterSpacing: "-0.02em",
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[6],
    },
    heroSubtitle: {
      ...stylesPublic.typography.body.large,
      color: stylesPublic.colors.text.secondary,
      maxWidth: "600px",
      margin: "0 auto",
      lineHeight: 1.6,
    },
    titleUnderline: {
      display: "block",
      width: stylesPublic.spacing.scale[24],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.sm,
      margin: `${stylesPublic.spacing.scale[6]} auto`,
    },
    productContainer: {
      maxWidth: stylesPublic.utils.container.maxWidth["2xl"],
      margin: stylesPublic.spacing.margins.auto,
      padding: stylesPublic.spacing.scale[10],
      background: "rgba(255, 255, 255, 0.9)",
      backdropFilter: "blur(20px)",
      borderRadius: stylesPublic.borders.radius["2xl"],
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      position: "relative",
      zIndex: stylesPublic.utils.zIndex.base,
      marginBottom: stylesPublic.spacing.scale[25],
    },
    productTitle: {
      ...stylesPublic.typography.headings.h2,
      fontWeight: stylesPublic.typography.weights.light,
      letterSpacing: "-0.01em",
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[6],
      lineHeight: 1.2,
    },
    productDescription: {
      ...stylesPublic.typography.body.large,
      color: stylesPublic.colors.text.secondary,
      marginBottom: stylesPublic.spacing.scale[10],
      lineHeight: 1.7,
    },
    specsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
      gap: stylesPublic.spacing.scale[6],
      marginBottom: stylesPublic.spacing.scale[10],
    },
    specLabel: {
      ...stylesPublic.typography.body.caption,
      fontWeight: stylesPublic.typography.weights.semibold,
      color: stylesPublic.colors.primary[600],
      marginBottom: stylesPublic.spacing.scale[2],
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    specValue: {
      ...stylesPublic.typography.body.base,
      color: stylesPublic.colors.text.primary,
      fontWeight: stylesPublic.typography.weights.medium,
    },
  }

  return (
    <>
      <style>{cssStyles}</style>

      <div style={customStyles.pageContainer}>
        <div style={customStyles.pageOverlay}></div>

        {/* Hero Section */}
        <section style={customStyles.heroSection}>
          <Container style={customStyles.heroContent}>
            <h1 className="animate-in-up" style={customStyles.heroTitle}>
              Detalle del Producto
            </h1>
            <div
              className="animate-in-up"
              style={{
                ...customStyles.titleUnderline,
                animationDelay: "0.2s",
              }}
            ></div>
            <p
              className="animate-in-up"
              style={{
                ...customStyles.heroSubtitle,
                animationDelay: "0.4s",
              }}
            >
              Descubre cada detalle de esta pieza artesanal única, creada con técnicas tradicionales huastecas
            </p>
          </Container>
        </section>

        {/* Product Details */}
        <Container>
          <div className="product-container" style={customStyles.productContainer}>
            <Row className="align-items-center">
              <Col lg={6} className="mb-5 mb-lg-0">
                <div
                  className={`product-image-container ${isVisible.image ? "animate-in-left" : ""}`}
                  style={{
                    opacity: isVisible.image ? 1 : 0,
                    animationDelay: "0.2s",
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
                  <Image
                    src={producto.imagenURL || "/placeholder.svg"}
                    alt={producto.nombre}
                    fluid
                    className="product-image"
                    onLoad={() => setImageLoaded(true)}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/600x400?text=Imagen+No+Disponible"
                      setImageLoaded(true)
                    }}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <div
                  className={isVisible.details ? "animate-in-right" : ""}
                  style={{
                    opacity: isVisible.details ? 1 : 0,
                    animationDelay: "0.4s",
                  }}
                >
                  <h1 className="product-title" style={customStyles.productTitle}>
                    {producto.nombre}
                  </h1>
                  <p style={customStyles.productDescription}>
                    {producto.descripcion ||
                      "Esta pieza artesanal representa la rica tradición textil de la Huasteca, elaborada con técnicas ancestrales que han sido transmitidas de generación en generación."}
                  </p>

                  <div
                    className={`spec-grid ${isVisible.specs ? "animate-in-up" : ""}`}
                    style={{
                      ...customStyles.specsGrid,
                      opacity: isVisible.specs ? 1 : 0,
                      animationDelay: "0.6s",
                    }}
                  >
                    <div className="spec-card">
                      <div style={customStyles.specLabel}>
                        <i className="bi bi-geo-alt me-2"></i>
                        Localidad de Origen
                      </div>
                      <div style={customStyles.specValue}>{producto.localidadId?.nombre || "Región Huasteca"}</div>
                    </div>

                    <div className="spec-card">
                      <div style={customStyles.specLabel}>
                        <i className="bi bi-palette me-2"></i>
                        Tipo de Tela
                      </div>
                      <div style={customStyles.specValue}>{producto.tipoTela || "Algodón Artesanal"}</div>
                    </div>

                    <div className="spec-card">
                      <div style={customStyles.specLabel}>
                        <i className="bi bi-rulers me-2"></i>
                        Tallas Disponibles
                      </div>
                      <div style={customStyles.specValue}>
                        {producto.tallasDisponibles?.map((td) => td.talla).join(", ") || "Talla Única"}
                      </div>
                    </div>

                    <div className="spec-card">
                      <div style={customStyles.specLabel}>
                        <i className="bi bi-tags me-2"></i>
                        Categorías
                      </div>
                      <div style={customStyles.specValue}>
                        {producto.tallasDisponibles
                          ?.map((td) => td.categoriaId?.nombre)
                          .filter(Boolean)
                          .join(", ") || "Artesanía Tradicional"}
                      </div>
                    </div>
                  </div>

                  <div
                    className={isVisible.actions ? "animate-in-up" : ""}
                    style={{
                      opacity: isVisible.actions ? 1 : 0,
                      animationDelay: "0.8s",
                    }}
                  >
                    <button className="back-button" onClick={() => navigate("/productos")}>
                      <i className="bi bi-arrow-left"></i>
                      Volver a Productos
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  )
}

export default ProductoDetalleEnhanced