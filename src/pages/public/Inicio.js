import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
// import productos from "../../services/base"
import { useAuth } from "../../context/AuthContext"
import axios from "axios"
import {
  FaMountain,
  FaWater,
  FaLeaf,
  FaTree,
  FaUmbrellaBeach,
  FaCity,
  FaMonument,
  FaSeedling,
  FaLandmark,
  FaMapMarkedAlt,
} from "react-icons/fa"
import stylesPublic from "../../styles/stylesPublic"

const InicioEnhanced = () => {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [isVisible, setIsVisible] = useState({
    hero: false,
    reasons: false,
    regions: false,
    clothing: false,
    collections: false,
    comments: false,
    cta: false,
  })
  const [comentarios, setComentarios] = useState([])
  const [comentarioTexto, setComentarioTexto] = useState("")
  const { user } = useAuth()
  const isAuthenticated = user && user.isAuthenticated
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLocalidades, setIsLoadingLocalidades] = useState(true)

  const getLocalidadIcon = (nombre) => {
    const hash = nombre.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    const iconos = [
      { icon: <FaMountain size={28} />, color: stylesPublic.colors.gradients.primary },
      { icon: <FaWater size={28} />, color: stylesPublic.colors.gradients.secondary },
      {
        icon: <FaLeaf size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.semantic.success.light})`,
      },
      {
        icon: <FaTree size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.neutral[800]}, ${stylesPublic.colors.neutral[600]})`,
      },
      {
        icon: <FaUmbrellaBeach size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.warning.main}, ${stylesPublic.colors.semantic.warning.light})`,
      },
      {
        icon: <FaCity size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.neutral[600]}, ${stylesPublic.colors.neutral[400]})`,
      },
      {
        icon: <FaMonument size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.neutral[700]}, ${stylesPublic.colors.neutral[500]})`,
      },
      {
        icon: <FaLandmark size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.secondary[600]}, ${stylesPublic.colors.secondary[400]})`,
      },
      {
        icon: <FaSeedling size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.dark}, ${stylesPublic.colors.semantic.success.main})`,
      },
      {
        icon: <FaMapMarkedAlt size={28} />,
        color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.info.main}, ${stylesPublic.colors.semantic.info.light})`,
      },
    ]

    return iconos[hash % iconos.length]
  }

  useEffect(() => {
    const regions = [
      {
        nombre: "Huasteca Potosina",
        descripcion:
          "Cuna de técnicas ancestrales donde cada puntada cuenta la historia de generaciones de maestras artesanas.",
      },
      {
        nombre: "Huasteca Veracruzana",
        descripcion: "Paleta cromática rica en matices naturales que captura la esencia tropical de la región.",
      },
      {
        nombre: "Huasteca Hidalguense",
        descripcion: "Precisión geométrica en patrones que reflejan la arquitectura cultural de pueblos originarios.",
      },
      {
        nombre: "Huasteca Tamaulipas",
        descripcion: "Convergencia de influencias que enriquecen nuestra identidad textil contemporánea.",
      },
    ]

    const cargarCategorias = async () => {
      try {
        setIsLoading(true)
        const response = await axios.get("http://localhost:5000/api/public/categorias")
        if (response.data && response.data.length > 0) {
          const categoriasData = response.data.map((categoria) => ({
            nombre: categoria.nombre,
            cantidad: categoria.productos?.length || 0,
            imagen: categoria.imagenURL || "",
            descripcion:
              categoria.descripcion || `Colección de ${categoria.nombre.toLowerCase()} con detalles artesanales únicos`,
          }))
          setCategorias(categoriasData)
        } else {
          setCategorias([])
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error)
        setCategorias([])
      } finally {
        setIsLoading(false)
      }
    }

    const cargarLocalidades = async () => {
      try {
        setIsLoadingLocalidades(true)
        const response = await axios.get("http://localhost:5000/api/public/localidades")

        if (response.data && response.data.length > 0) {
          setLocalidades(response.data)
        } else {
          setLocalidades(regions)
        }
      } catch (error) {
        console.error("Error al cargar localidades:", error)
        setLocalidades(regions)
      } finally {
        setIsLoadingLocalidades(false)
      }
    }

    cargarCategorias()
    cargarLocalidades()

    // Animaciones más suaves y escalonadas
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, reasons: true })), 400)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, regions: true })), 700)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, clothing: true })), 1000)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, collections: true })), 1300)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, comments: true })), 1600)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, cta: true })), 1900)
  }, [])

  const handleSubmitComentario = (e) => {
    e.preventDefault()
    if (!comentarioTexto.trim()) return
    const nuevoComentario = {
      id: Date.now(),
      texto: comentarioTexto,
      fecha: new Date(),
      usuario: "Usuario actual",
    }
    setComentarios([nuevoComentario, ...comentarios])
    setComentarioTexto("")
  }

  const clothingItems = categorias.map((cat) => ({
    image: cat.imagen,
    name: cat.nombre,
    description: cat.descripcion,
    onClick: () => navigate(`/productos?categoria=${cat.nombre}`),
  }))

  const reasons = [
    {
      name: "Calidad Artesanal",
      description:
        "Cada pieza es elaborada a mano por maestras artesanas, garantizando una calidad excepcional y atención al detalle.",
    },
    {
      name: "Exclusividad",
      description:
        "Ofrecemos diseños únicos que combinan tradición y modernidad, perfectos para quienes buscan piezas irrepetibles.",
    },
    {
      name: "Sostenibilidad",
      description:
        "Nuestros procesos respetan el medio ambiente, utilizando materiales naturales y apoyando comunidades locales.",
    },
    {
      name: "Conexión Cultural",
      description: "Cada creación celebra la rica herencia huasteca, conectándote con siglos de historia y tradición.",
    },
  ]

  const collections = [
    {
      icon: "👗",
      title: "Alta Costura Tradicional",
      description:
        "Piezas únicas de vestimenta ceremonial y cotidiana, donde cada bordado narra historias ancestrales.",
    },
    {
      icon: "✨",
      title: "Accesorios de Autor",
      description: "Complementos exclusivos que elevan cualquier atuendo, desde rebozos hasta joyería textil.",
    },
  ]

  const styles = `
    .enhanced-inicio {
      font-family: ${stylesPublic.typography.families.body};
      background: ${stylesPublic.colors.surface.primary};
    }

    .enhanced-hero {
      background: ${stylesPublic.colors.gradients.hero};
      min-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      overflow: hidden;
      opacity: ${isVisible.hero ? 1 : 0};
      transform: translateY(${isVisible.hero ? "0" : "30px"});
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .enhanced-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
      opacity: 0.3;
    }

    .enhanced-hero-content {
      position: relative;
      z-index: 2;
      max-width: 900px;
      margin: 0 auto;
      padding: ${stylesPublic.spacing.scale[8]};
    }

    .enhanced-hero-title {
      font-size: ${stylesPublic.typography.headings.h1.fontSize};
      font-family: ${stylesPublic.typography.headings.h1.fontFamily};
      font-weight: 300;
      line-height: ${stylesPublic.typography.headings.h1.lineHeight};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      position: relative;
    }

    .enhanced-hero-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[20]};
      height: 2px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-hero-subtitle {
      font-size: ${stylesPublic.typography.scale.xl};
      color: ${stylesPublic.colors.text.secondary};
      margin: ${stylesPublic.spacing.scale[6]} 0 ${stylesPublic.spacing.scale[8]};
      font-weight: 300;
      line-height: ${stylesPublic.typography.leading.relaxed};
    }

    .enhanced-hero-button {
      background: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
      border: 2px solid ${stylesPublic.colors.primary[500]};
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]};
      border-radius: ${stylesPublic.borders.radius.full};
      font-weight: ${stylesPublic.typography.weights.medium};
      font-size: ${stylesPublic.typography.scale.lg};
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .enhanced-hero-button:hover {
      background: transparent;
      color: ${stylesPublic.colors.primary[500]};
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.xl};
    }

    .enhanced-section {
      padding: ${stylesPublic.spacing.scale[20]} 0;
      position: relative;
    }

    .enhanced-section-title {
      font-size: ${stylesPublic.typography.scale["2xl"]};
      font-weight: 300;
      color: ${stylesPublic.colors.text.primary};
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      position: relative;
    }

    .enhanced-section-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[12]};
      height: 1px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-section-subtitle {
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.text.secondary};
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[12]};
      font-weight: 300;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .enhanced-reasons-section {
      background: ${stylesPublic.colors.surface.secondary};
      opacity: ${isVisible.reasons ? 1 : 0};
      transform: translateY(${isVisible.reasons ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    }

    .enhanced-regions-section {
      background: ${stylesPublic.colors.gradients.secondary};
      opacity: ${isVisible.regions ? 1 : 0};
      transform: translateY(${isVisible.regions ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
    }

    .enhanced-clothing-section {
      background: ${stylesPublic.colors.surface.primary};
      opacity: ${isVisible.clothing ? 1 : 0};
      transform: translateY(${isVisible.clothing ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    }

    .enhanced-collections-section {
      background: ${stylesPublic.colors.gradients.primary};
      opacity: ${isVisible.collections ? 1 : 0};
      transform: translateY(${isVisible.collections ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s;
    }

    .enhanced-comments-section {
      background: ${stylesPublic.colors.surface.secondary};
      opacity: ${isVisible.comments ? 1 : 0};
      transform: translateY(${isVisible.comments ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1s;
    }

    .enhanced-cta-section {
      background: ${stylesPublic.colors.gradients.accent};
      opacity: ${isVisible.cta ? 1 : 0};
      transform: translateY(${isVisible.cta ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1.2s;
    }

    .enhanced-card {
      background: ${stylesPublic.colors.surface.primary};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.xl};
      padding: ${stylesPublic.spacing.scale[8]};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      box-shadow: ${stylesPublic.shadows.base};
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .enhanced-card:hover {
      transform: translateY(-6px);
      box-shadow: ${stylesPublic.shadows.xl};
      border-color: ${stylesPublic.colors.primary[300]};
    }

    .enhanced-region-card {
      text-align: center;
      cursor: pointer;
    }

    .enhanced-region-icon {
      width: ${stylesPublic.spacing.scale[14]};
      height: ${stylesPublic.spacing.scale[14]};
      border-radius: ${stylesPublic.borders.radius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto ${stylesPublic.spacing.scale[6]};
      color: ${stylesPublic.colors.text.inverse};
      box-shadow: ${stylesPublic.shadows.lg};
      transition: transform 0.3s ease;
    }

    .enhanced-region-card:hover .enhanced-region-icon {
      transform: scale(1.1);
    }

    .enhanced-clothing-card {
      text-align: center;
      cursor: pointer;
    }

    .enhanced-clothing-image {
      width: 100%;
      max-width: 200px;
      height: 150px;
      object-fit: cover;
      border-radius: ${stylesPublic.borders.radius.lg};
      margin: 0 auto ${stylesPublic.spacing.scale[6]};
      transition: transform 0.3s ease;
    }

    .enhanced-clothing-card:hover .enhanced-clothing-image {
      transform: scale(1.05);
    }

    .enhanced-collection-card {
      text-align: center;
    }

    .enhanced-collection-icon {
      width: ${stylesPublic.spacing.scale[14]};
      height: ${stylesPublic.spacing.scale[14]};
      border-radius: ${stylesPublic.borders.radius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto ${stylesPublic.spacing.scale[6]};
      font-size: ${stylesPublic.typography.scale["2xl"]};
      box-shadow: ${stylesPublic.shadows.lg};
      transition: transform 0.3s ease;
    }

    .enhanced-collection-card:hover .enhanced-collection-icon {
      transform: scale(1.1);
    }

    .enhanced-comment-form {
      background: ${stylesPublic.colors.surface.glass};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.xl};
      padding: ${stylesPublic.spacing.scale[8]};
      margin-bottom: ${stylesPublic.spacing.scale[12]};
      backdrop-filter: blur(10px);
    }

    .enhanced-comment-input {
      width: 100%;
      padding: ${stylesPublic.spacing.scale[4]};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.lg};
      background: ${stylesPublic.colors.surface.primary};
      font-family: ${stylesPublic.typography.families.body};
      font-size: ${stylesPublic.typography.scale.base};
      resize: none;
      transition: ${stylesPublic.animations.transitions.base};
    }

    .enhanced-comment-input:focus {
      outline: none;
      border-color: ${stylesPublic.colors.primary[500]};
      box-shadow: 0 0 0 3px ${stylesPublic.colors.primary[500]}20;
    }

    .enhanced-comment-button {
      background: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]};
      border-radius: ${stylesPublic.borders.radius.full};
      font-weight: ${stylesPublic.typography.weights.medium};
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .enhanced-comment-button:hover {
      background: ${stylesPublic.colors.primary[600]};
      transform: translateY(-1px);
    }

    .enhanced-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${stylesPublic.spacing.scale[16]};
      color: ${stylesPublic.colors.text.secondary};
    }

    .enhanced-loading-spinner {
      width: ${stylesPublic.spacing.scale[8]};
      height: ${stylesPublic.spacing.scale[8]};
      border: 2px solid ${stylesPublic.colors.primary[200]};
      border-top: 2px solid ${stylesPublic.colors.primary[500]};
      border-radius: ${stylesPublic.borders.radius.full};
      animation: spin 1s linear infinite;
      margin-bottom: ${stylesPublic.spacing.scale[4]};
    }

    .enhanced-empty-state {
      text-align: center;
      padding: ${stylesPublic.spacing.scale[16]};
      color: ${stylesPublic.colors.text.secondary};
    }

    .enhanced-empty-icon {
      font-size: ${stylesPublic.typography.scale["4xl"]};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      opacity: 0.5;
    }

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

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .enhanced-hero {
        min-height: 70vh;
        padding: ${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[4]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale["2xl"]};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[16]} 0;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .enhanced-hero {
        min-height: 60vh;
        padding: ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[3]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale.xl};
      }

      .enhanced-hero-subtitle {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[12]} 0;
      }

      .enhanced-clothing-image {
        max-width: 150px;
        height: 120px;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .enhanced-hero {
        min-height: 50vh;
        padding: ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[2]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[8]} 0;
      }

      .enhanced-card {
        padding: ${stylesPublic.spacing.scale[6]};
      }

      .enhanced-clothing-image {
        max-width: 120px;
        height: 100px;
      }
    }
  `

  return (
    <>
      <style>{styles}</style>

      <div className="enhanced-inicio">
        {/* Hero Section */}
        <section className="enhanced-hero">
          <Container>
            <div className="enhanced-hero-content">
              <h1 className="enhanced-hero-title">La Aterciopelada</h1>
              <p className="enhanced-hero-subtitle">Boutique Huasteca · Tradición Artesanal Refinada</p>
              <a
                href="/productos"
                className="enhanced-hero-button"
                onClick={(e) => {
                  e.preventDefault()
                  navigate("/productos")
                }}
              >
                Explorar Colección
              </a>
            </div>
          </Container>
        </section>

        {/* Reasons Section */}
        <section className="enhanced-reasons-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title">¿Por qué elegir La Aterciopelada?</h2>
            <p className="enhanced-section-subtitle">Sumérgete en la pasión y el arte de la artesanía huasteca</p>
            <Row className="g-4">
              {reasons.map((reason, idx) => (
                <Col md={6} lg={3} key={idx}>
                  <div className="enhanced-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                    <h3
                      style={{
                        fontSize: stylesPublic.typography.scale.lg,
                        fontWeight: stylesPublic.typography.weights.medium,
                        color: stylesPublic.colors.text.primary,
                        marginBottom: stylesPublic.spacing.scale[4],
                      }}
                    >
                      {reason.name}
                    </h3>
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                      }}
                    >
                      {reason.description}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Regions Section */}
        <section className="enhanced-regions-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title" style={{ color: stylesPublic.colors.text.inverse }}>
              Localidades de la Huasteca
            </h2>
            <p className="enhanced-section-subtitle" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Descubre la riqueza cultural que inspira nuestras creaciones artesanales
            </p>

            {isLoadingLocalidades ? (
              <div className="enhanced-loading">
                <div className="enhanced-loading-spinner"></div>
                <p style={{ color: stylesPublic.colors.text.inverse }}>Cargando localidades...</p>
              </div>
            ) : localidades.length > 0 ? (
              <Row className="g-4">
                {localidades.map((localidad, idx) => {
                  const { icon, color } = getLocalidadIcon(localidad.nombre)
                  return (
                    <Col md={6} lg={localidades.length <= 3 ? 4 : 3} key={localidad._id || idx}>
                      <div
                        className="enhanced-card enhanced-region-card"
                        style={{ animationDelay: `${idx * 0.1}s` }}
                        onClick={() => navigate(`/productos?localidad=${localidad.nombre}`)}
                      >
                        <div className="enhanced-region-icon" style={{ background: color }}>
                          {icon}
                        </div>
                        <h3
                          style={{
                            fontSize: stylesPublic.typography.scale.lg,
                            fontWeight: stylesPublic.typography.weights.medium,
                            color: stylesPublic.colors.text.primary,
                            marginBottom: stylesPublic.spacing.scale[4],
                          }}
                        >
                          {localidad.nombre}
                        </h3>
                        <p
                          style={{
                            fontSize: stylesPublic.typography.scale.sm,
                            color: stylesPublic.colors.text.secondary,
                            lineHeight: stylesPublic.typography.leading.relaxed,
                          }}
                        >
                          {localidad.descripcion}
                        </p>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            ) : (
              <div className="enhanced-empty-state">
                <div className="enhanced-empty-icon" style={{ color: stylesPublic.colors.text.inverse }}>
                  <i className="bi bi-geo-alt"></i>
                </div>
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    color: stylesPublic.colors.text.inverse,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  No se encontraron localidades
                </h3>
                <p style={{ color: stylesPublic.colors.text.inverse, opacity: 0.8 }}>
                  Estamos trabajando para agregar nuevas localidades pronto.
                </p>
              </div>
            )}
          </Container>
        </section>

        {/* Clothing Categories Section */}
        <section className="enhanced-clothing-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title">Categorías de Ropa</h2>
            <p className="enhanced-section-subtitle">
              Descubre piezas únicas tejidas con la esencia de la tradición huasteca
            </p>

            {isLoading ? (
              <div className="enhanced-loading">
                <div className="enhanced-loading-spinner"></div>
                <p>Cargando categorías...</p>
              </div>
            ) : clothingItems.length > 0 ? (
              <Row className="g-4">
                {clothingItems.map((item, idx) => (
                  <Col md={6} lg={clothingItems.length <= 3 ? 4 : 3} key={idx}>
                    <div
                      className="enhanced-card enhanced-clothing-card"
                      style={{ animationDelay: `${idx * 0.1}s` }}
                      onClick={item.onClick}
                    >
                      <img
                        src={item.image || "https://via.placeholder.com/200x150?text=Sin+Imagen"}
                        alt={item.name}
                        className="enhanced-clothing-image"
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src = "https://via.placeholder.com/200x150?text=Imagen+No+Disponible"
                        }}
                      />
                      <h3
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.medium,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: stylesPublic.spacing.scale[4],
                        }}
                      >
                        {item.name}
                      </h3>
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.sm,
                          color: stylesPublic.colors.text.secondary,
                          lineHeight: stylesPublic.typography.leading.relaxed,
                        }}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="enhanced-empty-state">
                <div className="enhanced-empty-icon">
                  <i className="bi bi-emoji-frown"></i>
                </div>
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    color: stylesPublic.colors.text.primary,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  No se encontraron categorías
                </h3>
                <p>Estamos trabajando para agregar nuevas categorías pronto.</p>
              </div>
            )}
          </Container>
        </section>

        {/* Collections Section */}
        <section className="enhanced-collections-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title" style={{ color: stylesPublic.colors.text.inverse }}>
              Colecciones Selectas
            </h2>
            <p className="enhanced-section-subtitle" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Viste la historia, abraza la artesanía
            </p>
            <Row className="g-4">
              {collections.map((collection, idx) => (
                <Col md={6} lg={6} key={idx}>
                  <div className="enhanced-card enhanced-collection-card" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div
                      className="enhanced-collection-icon"
                      style={{
                        background:
                          idx === 0 ? stylesPublic.colors.gradients.primary : stylesPublic.colors.gradients.secondary,
                      }}
                    >
                      {collection.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: stylesPublic.typography.scale.lg,
                        fontWeight: stylesPublic.typography.weights.medium,
                        color: stylesPublic.colors.text.primary,
                        marginBottom: stylesPublic.spacing.scale[6],
                      }}
                    >
                      {collection.title}
                    </h3>
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                      }}
                    >
                      {collection.description}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Comments Section */}
        <section className="enhanced-comments-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title">Comentarios de la Comunidad</h2>
            <p className="enhanced-section-subtitle">Comparte tu experiencia con nuestra comunidad artesanal</p>

            {isAuthenticated ? (
              <div className="enhanced-comment-form">
                <form onSubmit={handleSubmitComentario}>
                  <div
                    style={{ display: "flex", alignItems: "flex-start", marginBottom: stylesPublic.spacing.scale[4] }}
                  >
                    <div style={{ marginRight: stylesPublic.spacing.scale[3] }}>
                      <div
                        style={{
                          width: stylesPublic.spacing.scale[12],
                          height: stylesPublic.spacing.scale[12],
                          borderRadius: stylesPublic.borders.radius.full,
                          background: stylesPublic.colors.primary[500],
                          color: stylesPublic.colors.text.inverse,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-person-circle fs-4"></i>
                      </div>
                    </div>
                    <textarea
                      rows="3"
                      placeholder="¿Qué te pareció tu experiencia con nosotros?"
                      value={comentarioTexto}
                      onChange={(e) => setComentarioTexto(e.target.value)}
                      className="enhanced-comment-input"
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.text.secondary,
                      }}
                    >
                      <i className="bi bi-info-circle me-1"></i>
                      Tu comentario será visible para toda la comunidad
                    </div>
                    <button type="submit" className="enhanced-comment-button">
                      <i className="bi bi-send-fill me-2"></i>
                      Publicar comentario
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="enhanced-comment-form" style={{ textAlign: "center" }}>
                <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                  <i className="bi bi-chat-quote display-4" style={{ color: stylesPublic.colors.primary[500] }}></i>
                </div>
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.primary,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  ¡Únete a la conversación!
                </h3>
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.base,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: stylesPublic.spacing.scale[6],
                  }}
                >
                  Inicia sesión para compartir tu experiencia con la comunidad artesanal
                </p>
                <a
                  href="/login"
                  className="enhanced-hero-button"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/login")
                  }}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </a>
              </div>
            )}

            <Row className="g-4">
              {comentarios.map((comentario) => (
                <Col lg={4} md={6} key={comentario.id}>
                  <div className="enhanced-card" style={{ animationDelay: "0.2s" }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: stylesPublic.spacing.scale[3] }}>
                      <div
                        style={{
                          width: stylesPublic.spacing.scale[10],
                          height: stylesPublic.spacing.scale[10],
                          borderRadius: stylesPublic.borders.radius.full,
                          background: stylesPublic.colors.primary[500],
                          color: stylesPublic.colors.text.inverse,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: stylesPublic.spacing.scale[3],
                        }}
                      >
                        <i className="bi bi-person"></i>
                      </div>
                      <div>
                        <h6
                          style={{
                            fontSize: stylesPublic.typography.scale.base,
                            fontWeight: stylesPublic.typography.weights.medium,
                            color: stylesPublic.colors.text.primary,
                            marginBottom: 0,
                          }}
                        >
                          {comentario.usuario}
                        </h6>
                        <small
                          style={{
                            fontSize: stylesPublic.typography.scale.xs,
                            color: stylesPublic.colors.text.secondary,
                          }}
                        >
                          {new Date(comentario.fecha).toLocaleDateString("es-MX", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </small>
                      </div>
                    </div>
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.base,
                        color: stylesPublic.colors.text.secondary,
                        marginBottom: 0,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                      }}
                    >
                      {comentario.texto}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* CTA Section - Solo se muestra si el usuario NO está autenticado */}
        {!isAuthenticated && (
          <section className="enhanced-cta-section enhanced-section">
            <Container>
              <div style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                <h2
                  style={{
                    fontSize: stylesPublic.typography.scale["2xl"],
                    fontWeight: 300,
                    color: stylesPublic.colors.text.inverse,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  Celebra la Tradición Huasteca
                </h2>
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.lg,
                    color: "rgba(255, 255, 255, 0.9)",
                    maxWidth: "700px",
                    margin: `0 auto ${stylesPublic.spacing.scale[8]}`,
                    lineHeight: stylesPublic.typography.leading.relaxed,
                  }}
                >
                  Únete a nuestra comunidad y descubre piezas artesanales únicas
                </p>
                <a
                  href="/login?register=true"
                  className="enhanced-hero-button"
                  onClick={(e) => {
                    e.preventDefault()
                    navigate("/login?register=true")
                  }}
                >
                  Regístrate
                </a>
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.sm,
                    color: "rgba(255, 255, 255, 0.8)",
                    marginTop: stylesPublic.spacing.scale[4],
                  }}
                >
                  <i className="bi bi-shield-check me-2"></i>
                  Tu información está segura con nosotros.
                </p>
              </div>
            </Container>
          </section>
        )}
      </div>
    </>
  )
}

export default InicioEnhanced
