"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Container, Row, Col, Card, Button } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import stylesPublic from "../../styles/stylesPublic"
import api from "../../services/api"

const ServiciosEnhanced = () => {
  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState({
    hero: false,
    servicios: false,
    beneficios: false,
    cta: false,
  })
  const [hoveredService, setHoveredService] = useState(null)
  const [hoveredBenefit, setHoveredBenefit] = useState(null)
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Animaciones más suaves y escalonadas
    const timeouts = [
      setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 150),
      setTimeout(() => setIsVisible((prev) => ({ ...prev, servicios: true })), 400),
      setTimeout(() => setIsVisible((prev) => ({ ...prev, beneficios: true })), 650),
      setTimeout(() => setIsVisible((prev) => ({ ...prev, cta: true })), 900),
    ]

    return () => timeouts.forEach(clearTimeout)
  }, [])

  // Cargar servicios desde la API
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true)
        const data = await api.get("/servicios")
        setServicios(data)
      } catch (error) {
        console.error("Error al cargar los servicios:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchServicios()
  }, [])

  // Iconos refinados para los servicios
  const ServiceIcons = useMemo(
    () => ({
      diseno: "✨",
      confeccion: "🧵",
      bordado: "🎨",
      asesoria: "💡",
      talleres: "👩‍🏫",
      calidad: "⭐",
      autenticidad: "🌿",
      artesanos: "👐",
      exclusividad: "💎",
    }),
    [],
  )

  // Beneficios rediseñados con mejor copy
  const beneficiosData = useMemo(
    () => [
      {
        id: "calidad",
        titulo: "Excelencia Artesanal",
        descripcion:
          "Cada pieza es meticulosamente elaborada por maestras artesanas con décadas de experiencia, garantizando la más alta calidad.",
        color: stylesPublic.colors.gradients.primary,
      },
      {
        id: "autenticidad",
        titulo: "Herencia Cultural",
        descripcion:
          "Preservamos técnicas ancestrales huastecas, manteniendo viva la tradición textil de nuestros pueblos originarios.",
        color: stylesPublic.colors.gradients.secondary,
      },
      {
        id: "artesanos",
        titulo: "Comercio Justo",
        descripcion:
          "Trabajamos directamente con comunidades artesanales, asegurando condiciones dignas y precios justos.",
        color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.semantic.success.light})`,
      },
      {
        id: "exclusividad",
        titulo: "Piezas Únicas",
        descripcion:
          "Cada creación es irrepetible, diseñada especialmente para quienes valoran la autenticidad y la exclusividad.",
        color: `linear-gradient(135deg, ${stylesPublic.colors.secondary[600]}, ${stylesPublic.colors.primary[700]})`,
      },
    ],
    [],
  )

  // CSS mejorado con animaciones más sofisticadas
  const animationStyles = `
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
    
    @keyframes slideInLeft {
      from { 
        opacity: 0; 
        transform: translateX(-${stylesPublic.spacing.scale[12]}); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    
    @keyframes slideInRight {
      from { 
        opacity: 0; 
        transform: translateX(${stylesPublic.spacing.scale[12]}); 
      }
      to { 
        opacity: 1; 
        transform: translateX(0); 
      }
    }
    
    @keyframes pulse {
      0%, 100% { 
        opacity: 0.7; 
        transform: scale(1); 
      }
      50% { 
        opacity: 1; 
        transform: scale(1.05); 
      }
    }
    
    .animate-in { 
      animation: fadeInUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
    }
    
    .animate-left { 
      animation: slideInLeft 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
    }
    
    .animate-right { 
      animation: slideInRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; 
    }
    
    .service-card {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid ${stylesPublic.colors.neutral[200]};
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .service-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[3]}) scale(1.02);
      box-shadow: 0 ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[12]} rgba(0, 0, 0, 0.15);
      border-color: ${stylesPublic.colors.primary[300]};
    }
    
    .benefit-card {
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(15px);
      background: rgba(255, 255, 255, 0.1);
    }
    
    .benefit-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[2]});
      box-shadow: 0 ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[16]} rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.15);
    }
    
    .loading-pulse {
      animation: pulse 1.8s ease-in-out infinite;
    }
    
    .service-icon {
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .service-card:hover .service-icon {
      transform: scale(1.2) rotate(5deg);
    }
    
    .benefit-icon {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }
    
    .benefit-card:hover .benefit-icon {
      transform: scale(1.1);
      filter: brightness(1.2);
    }

    /* Responsive Design Mejorado */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .service-card, .benefit-card {
        margin-bottom: ${stylesPublic.spacing.scale[6]};
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale["3xl"]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .service-card, .benefit-card {
        padding: ${stylesPublic.spacing.scale[8]} !important;
        margin-bottom: ${stylesPublic.spacing.scale[5]};
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale["2xl"]} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.lg} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .service-card, .benefit-card {
        padding: ${stylesPublic.spacing.scale[6]} !important;
        margin-bottom: ${stylesPublic.spacing.scale[4]};
        text-align: center;
      }
      .hero-section {
        padding: ${stylesPublic.spacing.scale[20]} 0 ${stylesPublic.spacing.scale[15]} !important;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.xl} !important;
      }
    }
  `

  // Estilos refinados con mejor jerarquía visual
  const customStyles = {
    heroSection: {
      background: `linear-gradient(135deg, 
        ${stylesPublic.colors.primary[300]} 0%, 
        ${stylesPublic.colors.secondary[400]} 25%, 
        ${stylesPublic.colors.primary[500]} 50%, 
        ${stylesPublic.colors.secondary[500]} 75%, 
        ${stylesPublic.colors.primary[600]} 100%)`,
      padding: `${stylesPublic.spacing.scale[32]} 0 ${stylesPublic.spacing.scale[20]}`,
      position: "relative",
      overflow: "hidden",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[8]})`,
      transition: "all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `
        radial-gradient(circle at 20% 80%, ${stylesPublic.colors.secondary[400]}40 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, ${stylesPublic.colors.primary[400]}40 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, ${stylesPublic.colors.secondary[300]}30 0%, transparent 70%)
      `,
      pointerEvents: "none",
    },
    section: {
      padding: `${stylesPublic.spacing.scale[20]} 0`,
      maxWidth: stylesPublic.utils.container.maxWidth["2xl"],
      margin: stylesPublic.spacing.margins.auto,
      position: "relative",
    },
    serviciosSection: {
      background: `linear-gradient(180deg, 
        ${stylesPublic.colors.surface.primary} 0%, 
        ${stylesPublic.colors.neutral[50]} 100%)`,
      opacity: isVisible.servicios ? 1 : 0,
      transform: isVisible.servicios ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
    },
    beneficiosSection: {
      background: `linear-gradient(135deg, 
        ${stylesPublic.colors.primary[600]} 0%, 
        ${stylesPublic.colors.secondary[700]} 50%, 
        ${stylesPublic.colors.primary[800]} 100%)`,
      position: "relative",
      overflow: "hidden",
      opacity: isVisible.beneficios ? 1 : 0,
      transform: isVisible.beneficios ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.4s",
    },
    beneficiosOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: `radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
      pointerEvents: "none",
    },
    ctaSection: {
      background: `linear-gradient(135deg, 
        ${stylesPublic.colors.secondary[500]} 0%, 
        ${stylesPublic.colors.primary[600]} 100%)`,
      position: "relative",
      overflow: "hidden",
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.6s",
    },
    titleUnderline: {
      display: "block",
      width: stylesPublic.spacing.scale[24],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.full,
      margin: `${stylesPublic.spacing.scale[6]} auto`,
      boxShadow: `0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]} rgba(0,0,0,0.1)`,
    },
    whiteUnderline: {
      background: `linear-gradient(90deg, transparent 0%, ${stylesPublic.colors.surface.primary} 50%, transparent 100%)`,
      boxShadow: `0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[4]} rgba(255,255,255,0.3)`,
    },
    serviceCard: {
      padding: stylesPublic.spacing.scale[10],
      borderRadius: stylesPublic.borders.radius.xl,
      minHeight: stylesPublic.spacing.scale[88],
      display: "flex",
      flexDirection: "column",
    },
    benefitCard: {
      padding: stylesPublic.spacing.scale[10],
      borderRadius: stylesPublic.borders.radius.xl,
      textAlign: "center",
      minHeight: stylesPublic.spacing.scale[75],
    },
    benefitIcon: {
      width: stylesPublic.spacing.scale[20],
      height: stylesPublic.spacing.scale[20],
      borderRadius: stylesPublic.borders.radius.full,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: stylesPublic.typography.scale["3xl"],
      margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
      boxShadow: `0 ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[8]} rgba(0,0,0,0.2)`,
      border: `2px solid rgba(255,255,255,0.3)`,
    },
    loadingCard: {
      padding: stylesPublic.spacing.scale[10],
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.xl,
      textAlign: "center",
      minHeight: stylesPublic.spacing.scale[88],
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    },
  }

  // Renderizado mejorado de cards de servicios
  const renderServiceCards = useCallback(() => {
    if (loading) {
      return (
        <Row className="g-6 justify-content-center">
          {[1, 2, 3, 4].map((item, index) => (
            <Col md={6} lg={6} key={item}>
              <div
                className="loading-pulse"
                style={{
                  ...customStyles.loadingCard,
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                <div
                  style={{
                    fontSize: stylesPublic.typography.scale["4xl"],
                    marginBottom: stylesPublic.spacing.scale[4],
                    color: stylesPublic.colors.primary[400],
                  }}
                >
                  ⏳
                </div>
                <p
                  style={{
                    ...stylesPublic.typography.body.large,
                    color: stylesPublic.colors.text.secondary,
                    fontWeight: stylesPublic.typography.weights.light,
                    margin: 0,
                  }}
                >
                  Cargando servicios...
                </p>
              </div>
            </Col>
          ))}
        </Row>
      )
    }

    if (servicios.length === 0) {
      const serviciosPredeterminados = [
        {
          _id: "confeccion",
          titulo: "Confección Artesanal",
          descripcion:
            "Creamos prendas únicas utilizando técnicas tradicionales huastecas transmitidas por generaciones. Cada pieza cuenta una historia de tradición y maestría artesanal.",
          icono: "🧵",
        },
        {
          _id: "accesorios",
          titulo: "Accesorios Exclusivos",
          descripcion:
            "Diseñamos complementos únicos como rebozos, bolsos y joyería textil que realzan tu estilo personal con la elegancia de la artesanía huasteca.",
          icono: "💎",
        },
      ]

      return (
        <Row className="g-6 justify-content-center">
          {serviciosPredeterminados.map((servicio, idx) => (
            <Col md={6} key={servicio._id}>
              <Card
                className={`service-card h-100 ${idx % 2 === 0 ? "animate-left" : "animate-right"}`}
                style={{
                  ...customStyles.serviceCard,
                  animationDelay: `${idx * 0.3}s`,
                  borderLeft: `${stylesPublic.borders.width[4]}px solid ${
                    idx === 0 ? stylesPublic.colors.primary[500] : stylesPublic.colors.secondary[500]
                  }`,
                }}
                onMouseEnter={() => setHoveredService(servicio._id)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div
                  className="service-icon"
                  style={{
                    fontSize: stylesPublic.typography.scale["4xl"],
                    marginBottom: stylesPublic.spacing.scale[6],
                    textAlign: "center",
                    filter: hoveredService === servicio._id ? "brightness(1.2)" : "brightness(1)",
                  }}
                >
                  {servicio.icono}
                </div>
                <Card.Body
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    padding: 0,
                  }}
                >
                  <h3
                    style={{
                      ...stylesPublic.typography.headings.h3,
                      fontWeight: stylesPublic.typography.weights.light,
                      color: stylesPublic.colors.text.primary,
                      marginBottom: stylesPublic.spacing.scale[4],
                      textAlign: "center",
                    }}
                  >
                    {servicio.titulo}
                  </h3>
                  <p
                    style={{
                      ...stylesPublic.typography.body.large,
                      color: stylesPublic.colors.text.secondary,
                      lineHeight: 1.7,
                      flexGrow: 1,
                      textAlign: "center",
                    }}
                  >
                    {servicio.descripcion}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )
    }

    return (
      <Row className="g-6">
        {servicios.map((servicio, idx) => (
          <Col md={6} lg={4} key={servicio._id}>
            <Card
              className="service-card h-100 animate-in"
              style={{
                ...customStyles.serviceCard,
                animationDelay: `${idx * 0.2}s`,
                borderLeft: `${stylesPublic.borders.width[4]}px solid ${
                  idx === 0
                    ? stylesPublic.colors.primary[500]
                    : idx === 1
                      ? stylesPublic.colors.secondary[500]
                      : idx === 2
                        ? stylesPublic.colors.semantic.warning.main
                        : stylesPublic.colors.secondary[700]
                }`,
              }}
              onMouseEnter={() => setHoveredService(servicio._id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              {servicio.imagen && (
                <Card.Img
                  variant="top"
                  src={servicio.imagen}
                  alt={servicio.titulo || servicio.nombre}
                  style={{
                    height: stylesPublic.spacing.scale[50],
                    objectFit: "cover",
                    borderRadius: `${stylesPublic.borders.radius.lg} ${stylesPublic.borders.radius.lg} 0 0`,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                />
              )}
              <div
                className="service-icon"
                style={{
                  fontSize: stylesPublic.typography.scale["3xl"],
                  marginBottom: stylesPublic.spacing.scale[4],
                  textAlign: "center",
                }}
              >
                {servicio.icono || ServiceIcons[Object.keys(ServiceIcons)[idx % Object.keys(ServiceIcons).length]]}
              </div>
              <Card.Body style={{ padding: 0, flex: 1, display: "flex", flexDirection: "column" }}>
                <h3
                  style={{
                    ...stylesPublic.typography.headings.h4,
                    fontWeight: stylesPublic.typography.weights.light,
                    color: stylesPublic.colors.text.primary,
                    marginBottom: stylesPublic.spacing.scale[4],
                    textAlign: "center",
                  }}
                >
                  {servicio.titulo || servicio.nombre}
                </h3>
                <p
                  style={{
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.text.secondary,
                    lineHeight: 1.6,
                    flexGrow: 1,
                    textAlign: "center",
                  }}
                >
                  {servicio.descripcion}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }, [servicios, loading, hoveredService, ServiceIcons, customStyles.serviceCard, customStyles.loadingCard])

  // Renderizado mejorado de beneficios
  const renderBenefitCards = useCallback(() => {
    return (
      <Row className="g-6">
        {beneficiosData.map((beneficio, idx) => (
          <Col md={6} lg={3} key={idx}>
            <Card
              className="benefit-card h-100 animate-in"
              style={{
                ...customStyles.benefitCard,
                animationDelay: `${idx * 0.15}s`,
              }}
              onMouseEnter={() => setHoveredBenefit(beneficio.id)}
              onMouseLeave={() => setHoveredBenefit(null)}
            >
              <div
                className="benefit-icon"
                style={{
                  ...customStyles.benefitIcon,
                  background: beneficio.color,
                  transform: hoveredBenefit === beneficio.id ? "scale(1.1)" : "scale(1)",
                }}
              >
                {ServiceIcons[beneficio.id]}
              </div>
              <Card.Body style={{ padding: 0 }}>
                <h3
                  style={{
                    ...stylesPublic.typography.headings.h4,
                    fontWeight: stylesPublic.typography.weights.light,
                    color: stylesPublic.colors.text.inverse,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  {beneficio.titulo}
                </h3>
                <p
                  style={{
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.text.inverse,
                    opacity: 0.9,
                    lineHeight: 1.6,
                  }}
                >
                  {beneficio.descripcion}
                </p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    )
  }, [beneficiosData, ServiceIcons, customStyles.benefitCard, customStyles.benefitIcon, hoveredBenefit])

  return (
    <>
      <style>{animationStyles}</style>

      {/* Hero Section Mejorado */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container
          style={{
            position: "relative",
            zIndex: stylesPublic.utils.zIndex.docked,
            textAlign: "center",
          }}
        >
          <h1
            className="animate-in"
            style={{
              ...stylesPublic.typography.headings.display,
              fontWeight: stylesPublic.typography.weights.extralight,
              color: stylesPublic.colors.text.primary,
              marginBottom: stylesPublic.spacing.scale[6],
              animationDelay: "0.2s",
              letterSpacing: "-0.02em",
            }}
          >
            Servicios Artesanales
          </h1>
          <div
            className="animate-in"
            style={{
              ...customStyles.titleUnderline,
              animationDelay: "0.4s",
            }}
          ></div>
          <p
            className="animate-in"
            style={{
              ...stylesPublic.typography.body.xl,
              color: stylesPublic.colors.text.secondary,
              marginBottom: stylesPublic.spacing.scale[12],
              animationDelay: "0.6s",
              maxWidth: "600px",
              margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
              lineHeight: 1.6,
            }}
          >
            Descubre la excelencia artesanal que celebra la rica tradición textil huasteca
          </p>
          <Button
            className="animate-in"
            style={{
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.lg,
              animationDelay: "0.8s",
              borderRadius: stylesPublic.borders.radius.full,
              padding: `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[10]}`,
              fontWeight: stylesPublic.typography.weights.medium,
              boxShadow: `0 ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[6]} rgba(0,0,0,0.15)`,
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            onClick={() => navigate("/contacto")}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`
              e.currentTarget.style.boxShadow = `0 ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[8]} rgba(0,0,0,0.2)`
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = `0 ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[6]} rgba(0,0,0,0.15)`
            }}
          >
            Explorar Servicios
          </Button>
        </Container>
      </section>

      {/* Servicios Section Mejorado */}
      <section style={customStyles.serviciosSection}>
        <Container style={customStyles.section}>
          <h2
            style={{
              ...stylesPublic.typography.headings.h1,
              fontWeight: stylesPublic.typography.weights.extralight,
              color: stylesPublic.colors.text.primary,
              marginBottom: stylesPublic.spacing.scale[6],
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Nuestros Servicios
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p
            style={{
              ...stylesPublic.typography.body.xl,
              color: stylesPublic.colors.text.secondary,
              maxWidth: "700px",
              margin: `0 auto ${stylesPublic.spacing.scale[16]}`,
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            Cada servicio refleja nuestro compromiso con la excelencia artesanal y la preservación cultural
          </p>

          {renderServiceCards()}

          {/* Información adicional mejorada */}
          <Row className="mt-5">
            <Col xs={12} className="text-center">
              <div
                className="animate-in"
                style={{
                  background: `linear-gradient(135deg, ${stylesPublic.colors.surface.primary} 0%, ${stylesPublic.colors.neutral[50]} 100%)`,
                  padding: stylesPublic.spacing.scale[16],
                  borderRadius: stylesPublic.borders.radius.xl,
                  boxShadow: `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[12]} rgba(0,0,0,0.08)`,
                  maxWidth: "800px",
                  margin: "0 auto",
                  border: `1px solid ${stylesPublic.colors.neutral[200]}`,
                  animationDelay: "1s",
                }}
              >
                <h3
                  style={{
                    ...stylesPublic.typography.headings.h3,
                    fontWeight: stylesPublic.typography.weights.light,
                    color: stylesPublic.colors.text.primary,
                    marginBottom: stylesPublic.spacing.scale[6],
                  }}
                >
                  ¿Buscas algo personalizado?
                </h3>
                <p
                  style={{
                    ...stylesPublic.typography.body.large,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: stylesPublic.spacing.scale[8],
                    lineHeight: 1.6,
                  }}
                >
                  Creamos servicios únicos adaptados a tus necesidades. Desde eventos especiales hasta colecciones
                  exclusivas, trabajamos contigo para materializar tu visión artesanal.
                </p>
                <Button
                  style={{
                    ...stylesPublic.components.button.variants.primary,
                    ...stylesPublic.components.button.sizes.lg,
                    borderRadius: stylesPublic.borders.radius.full,
                    fontWeight: stylesPublic.typography.weights.medium,
                    boxShadow: `0 ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[6]} rgba(0,0,0,0.15)`,
                    transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  }}
                  onClick={() => navigate("/contacto")}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`
                    e.currentTarget.style.boxShadow = `0 ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[8]} rgba(0,0,0,0.2)`
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = `0 ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[6]} rgba(0,0,0,0.15)`
                  }}
                >
                  Solicitar Consulta
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Beneficios Section Mejorado */}
      <section style={customStyles.beneficiosSection}>
        <div style={customStyles.beneficiosOverlay}></div>
        <Container
          style={{
            ...customStyles.section,
            position: "relative",
            zIndex: stylesPublic.utils.zIndex.docked,
          }}
        >
          <h2
            style={{
              ...stylesPublic.typography.headings.h1,
              fontWeight: stylesPublic.typography.weights.extralight,
              color: stylesPublic.colors.text.inverse,
              textShadow: `0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]} rgba(0,0,0,0.3)`,
              marginBottom: stylesPublic.spacing.scale[6],
              textAlign: "center",
              letterSpacing: "-0.01em",
            }}
          >
            Por Qué Elegirnos
            <span
              style={{
                ...customStyles.titleUnderline,
                ...customStyles.whiteUnderline,
              }}
            ></span>
          </h2>
          <p
            style={{
              ...stylesPublic.typography.body.xl,
              color: stylesPublic.colors.text.inverse,
              textShadow: `0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[2]} rgba(0,0,0,0.3)`,
              maxWidth: "700px",
              margin: `0 auto ${stylesPublic.spacing.scale[16]}`,
              textAlign: "center",
              lineHeight: 1.7,
              opacity: 0.95,
            }}
          >
            Cada detalle refleja nuestro compromiso con la excelencia y la tradición artesanal
          </p>
          {renderBenefitCards()}
        </Container>
      </section>

      {/* CTA Section Mejorado */}
      <section style={customStyles.ctaSection}>
        <Container
          style={{
            ...customStyles.section,
            position: "relative",
            zIndex: stylesPublic.utils.zIndex.docked,
            textAlign: "center",
          }}
        >
          <h2
            className="animate-in"
            style={{
              ...stylesPublic.typography.headings.h1,
              fontWeight: stylesPublic.typography.weights.extralight,
              color: stylesPublic.colors.text.inverse,
              marginBottom: stylesPublic.spacing.scale[6],
              animationDelay: "0.2s",
              letterSpacing: "-0.01em",
            }}
          >
            Comienza Tu Experiencia Artesanal
          </h2>
          <p
            className="animate-in"
            style={{
              ...stylesPublic.typography.body.xl,
              color: stylesPublic.colors.text.inverse,
              opacity: 0.95,
              maxWidth: "800px",
              margin: `0 auto ${stylesPublic.spacing.scale[10]}`,
              animationDelay: "0.4s",
              lineHeight: 1.7,
            }}
          >
            Cada servicio que ofrecemos está diseñado para celebrar la rica tradición textil de la Huasteca, combinando
            técnicas ancestrales con diseños contemporáneos para crear experiencias verdaderamente únicas.
          </p>
          <Button
            className="animate-in"
            style={{
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.xl,
              animationDelay: "0.6s",
              background: stylesPublic.colors.surface.primary,
              color: stylesPublic.colors.primary[600],
              border: `2px solid ${stylesPublic.colors.surface.primary}`,
              borderRadius: stylesPublic.borders.radius.full,
              fontWeight: stylesPublic.typography.weights.medium,
              boxShadow: `0 ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[8]} rgba(0,0,0,0.2)`,
              transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            }}
            onClick={() => navigate("/contacto")}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "transparent"
              e.currentTarget.style.color = stylesPublic.colors.surface.primary
              e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]})`
              e.currentTarget.style.boxShadow = `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[12]} rgba(0,0,0,0.3)`
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = stylesPublic.colors.surface.primary
              e.currentTarget.style.color = stylesPublic.colors.primary[600]
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = `0 ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[8]} rgba(0,0,0,0.2)`
            }}
          >
            Descubrir Servicios
          </Button>
        </Container>
      </section>
    </>
  )
}

export default ServiciosEnhanced