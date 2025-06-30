"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Image } from "react-bootstrap"
import stylesPublic from "../../styles/stylesPublic"
import api from "../../services/api"

const NosotrosEnhanced = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    historia: false,
    mision: false,
    colaboradores: false,
    valores: false,
    cta: false,
  })

  const [colaboradores, setColaboradores] = useState([])
  const [nosotrosData, setNosotrosData] = useState({
    mision: "",
    vision: "",
  })
  const [loading, setLoading] = useState(true)
  const [loadingNosotros, setLoadingNosotros] = useState(true)

  useEffect(() => {
    // Animaciones escalonadas más suaves
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, historia: true })), 400)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, mision: true })), 700)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, colaboradores: true })), 1000)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, valores: true })), 1300)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, cta: true })), 1600)

    const fetchNosotrosData = async () => {
      try {
        setLoadingNosotros(true)
        const response = await fetch("http://localhost:5000/api/nosotros")
        if (response.ok) {
          const data = await response.json()
          setNosotrosData({
            mision: data.mision || "",
            vision: data.vision || "",
          })
        }
      } catch (error) {
        console.error("Error al cargar información de nosotros:", error)
      } finally {
        setLoadingNosotros(false)
      }
    }

    const fetchColaboradores = async () => {
      try {
        const data = await api.get("/public/colaboradores")
        setColaboradores(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar colaboradores:", error)
        setLoading(false)
      }
    }

    fetchNosotrosData()
    fetchColaboradores()
  }, [])

  const valores = [
    {
      icon: "🤝",
      titulo: "Comercio Justo",
      descripcion:
        "Garantizamos precios equitativos y condiciones dignas para nuestras artesanas, construyendo relaciones duraderas basadas en el respeto mutuo.",
      color: stylesPublic.colors.gradients.primary,
    },
    {
      icon: "🌱",
      titulo: "Sostenibilidad",
      descripcion:
        "Utilizamos materiales naturales y procesos eco-amigables, preservando el medio ambiente para las futuras generaciones.",
      color: stylesPublic.colors.gradients.secondary,
    },
    {
      icon: "🎨",
      titulo: "Autenticidad",
      descripcion:
        "Cada pieza conserva las técnicas tradicionales de la cultura huasteca, manteniendo viva nuestra herencia ancestral.",
      color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.semantic.success.light})`,
    },
  ]

  const historiaTexto =
    "La Aterciopelada nació como un sueño de preservar y celebrar las tradiciones artesanales de la región Huasteca. A lo largo de los años, hemos crecido desde nuestras humildes raíces hasta convertirnos en una boutique reconocida por la calidad excepcional de nuestras creaciones. Cada pieza cuenta una historia, cada bordado lleva consigo la sabiduría ancestral de nuestras maestras artesanas. Nuestro compromiso trasciende la simple comercialización: somos guardianes de una herencia cultural que se transmite de generación en generación, adaptándose a los tiempos modernos sin perder su esencia tradicional."

  const styles = `
    .enhanced-nosotros {
      font-family: ${stylesPublic.typography.families.body};
      background: ${stylesPublic.colors.surface.primary};
    }

    .enhanced-hero {
      background: ${stylesPublic.colors.gradients.primary};
      min-height: 70vh;
      display: flex;
      align-items: center;
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
      text-align: center;
      max-width: 800px;
      margin: 0 auto;
    }

    .enhanced-hero-title {
      font-size: ${stylesPublic.typography.headings.h1.fontSize};
      font-family: ${stylesPublic.typography.headings.h1.fontFamily};
      font-weight: 300;
      line-height: ${stylesPublic.typography.headings.h1.lineHeight};
      color: ${stylesPublic.colors.text.inverse};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      position: relative;
    }

    .enhanced-hero-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[16]};
      height: 2px;
      background: ${stylesPublic.colors.text.inverse};
      opacity: 0.7;
    }

    .enhanced-hero-subtitle {
      font-size: ${stylesPublic.typography.scale.xl};
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
      line-height: ${stylesPublic.typography.leading.relaxed};
      margin-top: ${stylesPublic.spacing.scale[6]};
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

    .enhanced-historia-section {
      background: ${stylesPublic.colors.surface.secondary};
      opacity: ${isVisible.historia ? 1 : 0};
      transform: translateY(${isVisible.historia ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    }

    .enhanced-mision-section {
      background: ${stylesPublic.colors.gradients.secondary};
      opacity: ${isVisible.mision ? 1 : 0};
      transform: translateY(${isVisible.mision ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
    }

    .enhanced-colaboradores-section {
      background: ${stylesPublic.colors.surface.primary};
      opacity: ${isVisible.colaboradores ? 1 : 0};
      transform: translateY(${isVisible.colaboradores ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    }

    .enhanced-valores-section {
      background: ${stylesPublic.colors.gradients.primary};
      opacity: ${isVisible.valores ? 1 : 0};
      transform: translateY(${isVisible.valores ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.8s;
    }

    .enhanced-cta-section {
      background: ${stylesPublic.colors.gradients.accent};
      opacity: ${isVisible.cta ? 1 : 0};
      transform: translateY(${isVisible.cta ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 1s;
    }

    .enhanced-card {
      background: ${stylesPublic.colors.surface.primary};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.xl};
      padding: ${stylesPublic.spacing.scale[8]};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      box-shadow: ${stylesPublic.shadows.base};
    }

    .enhanced-card:hover {
      transform: translateY(-4px);
      box-shadow: ${stylesPublic.shadows.xl};
      border-color: ${stylesPublic.colors.primary[300]};
    }

    .enhanced-team-card {
      text-align: center;
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      animation: fadeInScale 0.6s ease-out forwards;
    }

    .enhanced-team-image {
      width: ${stylesPublic.spacing.scale[32]};
      height: ${stylesPublic.spacing.scale[32]};
      border-radius: ${stylesPublic.borders.radius.full};
      object-fit: cover;
      border: 3px solid ${stylesPublic.colors.primary[500]};
      margin: 0 auto ${stylesPublic.spacing.scale[6]};
      display: block;
      transition: transform 0.3s ease;
    }

    .enhanced-team-card:hover .enhanced-team-image {
      transform: scale(1.05);
    }

    .enhanced-value-card {
      text-align: center;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .enhanced-value-icon {
      width: ${stylesPublic.spacing.scale[16]};
      height: ${stylesPublic.spacing.scale[16]};
      border-radius: ${stylesPublic.borders.radius.full};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${stylesPublic.typography.scale["2xl"]};
      margin: 0 auto ${stylesPublic.spacing.scale[6]};
      box-shadow: ${stylesPublic.shadows.lg};
      transition: transform 0.3s ease;
    }

    .enhanced-value-card:hover .enhanced-value-icon {
      transform: scale(1.1);
    }

    .enhanced-historia-content {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[12]};
    }

    .enhanced-historia-image {
      flex: 1;
      border-radius: ${stylesPublic.borders.radius.xl};
      overflow: hidden;
      box-shadow: ${stylesPublic.shadows.xl};
    }

    .enhanced-historia-text {
      flex: 1;
    }

    .enhanced-historia-paragraph {
      font-size: ${stylesPublic.typography.scale.lg};
      line-height: ${stylesPublic.typography.leading.relaxed};
      color: ${stylesPublic.colors.text.secondary};
      text-align: justify;
    }

    .enhanced-cta-content {
      text-align: center;
      position: relative;
      z-index: 2;
    }

    .enhanced-cta-button {
      background: ${stylesPublic.colors.surface.primary};
      color: ${stylesPublic.colors.primary[500]};
      border: 2px solid ${stylesPublic.colors.surface.primary};
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]};
      border-radius: ${stylesPublic.borders.radius.full};
      font-weight: ${stylesPublic.typography.weights.medium};
      font-size: ${stylesPublic.typography.scale.lg};
      transition: all 0.3s ease;
      cursor: pointer;
      text-decoration: none;
      display: inline-block;
    }

    .enhanced-cta-button:hover {
      background: transparent;
      color: ${stylesPublic.colors.surface.primary};
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.xl};
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

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .enhanced-hero {
        min-height: 60vh;
        padding: ${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[4]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale["2xl"]};
      }

      .enhanced-historia-content {
        flex-direction: column;
        gap: ${stylesPublic.spacing.scale[8]};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[16]} 0;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .enhanced-hero {
        min-height: 50vh;
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

      .enhanced-team-image {
        width: ${stylesPublic.spacing.scale[24]};
        height: ${stylesPublic.spacing.scale[24]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .enhanced-hero {
        min-height: 40vh;
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

      .enhanced-team-image {
        width: ${stylesPublic.spacing.scale[20]};
        height: ${stylesPublic.spacing.scale[20]};
      }
    }
  `

  return (
    <>
      <style>{styles}</style>

      <div className="enhanced-nosotros">
        {/* Hero Section */}
        <section className="enhanced-hero">
          <Container>
            <div className="enhanced-hero-content">
              <h1 className="enhanced-hero-title">Nosotros</h1>
              <p className="enhanced-hero-subtitle">Nuestra historia, valores y pasión por la artesanía huasteca</p>
            </div>
          </Container>
        </section>

        {/* Historia Section */}
        <section className="enhanced-historia-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title">Nuestra Historia</h2>
            <p className="enhanced-section-subtitle">Un legado de tradición y excelencia artesanal</p>

            <div className="enhanced-historia-content">
              <div className="enhanced-historia-image">
                <Image
                  src="https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=2940"
                  alt="Historia de La Aterciopelada"
                  fluid
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
              <div className="enhanced-historia-text">
                <p className="enhanced-historia-paragraph">{historiaTexto}</p>
              </div>
            </div>
          </Container>
        </section>

        {/* Misión y Visión Section */}
        <section className="enhanced-mision-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title" style={{ color: stylesPublic.colors.text.inverse }}>
              Nuestra Misión y Visión
            </h2>
            <p className="enhanced-section-subtitle" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Los principios que guían nuestro trabajo
            </p>

            <Row className="g-4 justify-content-center">
              <Col md={6}>
                <div className="enhanced-card">
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.xl,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.text.primary,
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                  >
                    Misión
                  </h3>
                  {loadingNosotros ? (
                    <div className="enhanced-loading">
                      <div className="enhanced-loading-spinner"></div>
                      <p>Cargando...</p>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.base,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {nosotrosData.mision ||
                        "Preservar y modernizar las técnicas artesanales huastecas, creando piezas únicas que celebren nuestra herencia cultural mientras apoyamos a las comunidades locales con comercio justo y sostenible."}
                    </p>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <div className="enhanced-card">
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.xl,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.text.primary,
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                  >
                    Visión
                  </h3>
                  {loadingNosotros ? (
                    <div className="enhanced-loading">
                      <div className="enhanced-loading-spinner"></div>
                      <p>Cargando...</p>
                    </div>
                  ) : (
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.base,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {nosotrosData.vision ||
                        "Ser reconocidos como el referente en moda artesanal huasteca, combinando tradición y diseño contemporáneo para llevar nuestra cultura al mundo."}
                    </p>
                  )}
                </div>
              </Col>
            </Row>
          </Container>
        </section>

        {/* Colaboradores Section */}
        <section className="enhanced-colaboradores-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title">Nuestros Colaboradores</h2>
            <p className="enhanced-section-subtitle">Conoce a los colaboradores que hacen posible nuestra labor</p>

            {loading ? (
              <div className="enhanced-loading">
                <div className="enhanced-loading-spinner"></div>
                <p>Cargando colaboradores...</p>
              </div>
            ) : colaboradores.length > 0 ? (
              <Row className="g-4">
                {colaboradores.map((colaborador, idx) => (
                  <Col md={4} key={idx}>
                    <div className="enhanced-card enhanced-team-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <Image
                        src={
                          colaborador.imagen ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(colaborador.nombre)}&background=random&color=fff&size=150`
                        }
                        alt={colaborador.nombre}
                        className="enhanced-team-image"
                      />
                      <h3
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.medium,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        {colaborador.nombre}
                      </h3>
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.base,
                          color: stylesPublic.colors.primary[500],
                          fontWeight: stylesPublic.typography.weights.medium,
                          marginBottom: stylesPublic.spacing.scale[4],
                        }}
                      >
                        {colaborador.rol}
                      </p>
                      {colaborador.descripcion && (
                        <p
                          style={{
                            fontSize: stylesPublic.typography.scale.sm,
                            color: stylesPublic.colors.text.secondary,
                            lineHeight: stylesPublic.typography.leading.relaxed,
                          }}
                        >
                          {colaborador.descripcion}
                        </p>
                      )}
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="enhanced-empty-state">
                <div className="enhanced-empty-icon">👥</div>
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.primary,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  Equipo en Construcción
                </h3>
                <p>Estamos trabajando en presentar a nuestro increíble equipo de colaboradores.</p>
              </div>
            )}
          </Container>
        </section>

        {/* Valores Section */}
        <section className="enhanced-valores-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title" style={{ color: stylesPublic.colors.text.inverse }}>
              Nuestros Valores
            </h2>
            <p className="enhanced-section-subtitle" style={{ color: "rgba(255, 255, 255, 0.9)" }}>
              Los pilares que sostienen nuestro compromiso
            </p>

            <Row className="g-4">
              {valores.map((valor, idx) => (
                <Col md={4} key={idx}>
                  <div className="enhanced-card enhanced-value-card" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className="enhanced-value-icon" style={{ background: valor.color }}>
                      {valor.icon}
                    </div>
                    <h3
                      style={{
                        fontSize: stylesPublic.typography.scale.lg,
                        fontWeight: stylesPublic.typography.weights.medium,
                        color: stylesPublic.colors.text.primary,
                        marginBottom: stylesPublic.spacing.scale[4],
                      }}
                    >
                      {valor.titulo}
                    </h3>
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.base,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                      }}
                    >
                      {valor.descripcion}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="enhanced-cta-section enhanced-section">
          <Container>
            <div className="enhanced-cta-content">
              <h2
                style={{
                  fontSize: stylesPublic.typography.scale["2xl"],
                  fontWeight: 300,
                  color: stylesPublic.colors.text.inverse,
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              >
                Únete a Nuestra Comunidad
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
                Descubre la belleza de la artesanía huasteca y forma parte de esta tradición
              </p>
              <a href="/contacto" className="enhanced-cta-button">
                Conoce Más Sobre Nosotros
              </a>
            </div>
          </Container>
        </section>
      </div>
    </>
  )
}

export default NosotrosEnhanced
