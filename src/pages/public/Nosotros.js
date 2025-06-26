import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';
import stylesPublic from '../../styles/stylesPublic';
import api from '../../services/api';

const Nosotros = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    historia: false,
    mision: false,
    colaboradores: false,
    valores: false,
    cta: false,
  });
  
  const [colaboradores, setColaboradores] = useState([]);
  const [nosotrosData, setNosotrosData] = useState({
    mision: '',
    vision: ''
  });
  const [loading, setLoading] = useState(true);
  const [loadingNosotros, setLoadingNosotros] = useState(true);

  useEffect(() => {
    // Animaciones escalonadas como en Inicio.js
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, historia: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, mision: true })), 600);
    setTimeout(() => setIsVisible(prev => ({ ...prev, colaboradores: true })), 900);
    setTimeout(() => setIsVisible(prev => ({ ...prev, valores: true })), 1200);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 1500);
    
    // Obtener información de nosotros (misión y visión)
    const fetchNosotrosData = async () => {
      try {
        setLoadingNosotros(true);
        const response = await fetch('http://localhost:5000/api/nosotros');
        if (response.ok) {
          const data = await response.json();
          setNosotrosData({
            mision: data.mision || '',
            vision: data.vision || ''
          });
        } else {
          console.error('Error al cargar información de nosotros');
        }
      } catch (error) {
        console.error('Error al cargar información de nosotros:', error);
      } finally {
        setLoadingNosotros(false);
      }
    };
    
    // Obtener colaboradores de la API
    const fetchColaboradores = async () => {
      try {
        const data = await api.get('/public/colaboradores');
        setColaboradores(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar colaboradores:', error);
        setLoading(false);
      }
    };
    
    fetchNosotrosData();
    fetchColaboradores();
  }, []);

  const valores = [
    { icon: "🤝", titulo: "Comercio Justo", descripcion: "Garantizamos precios equitativos y condiciones dignas para nuestras artesanas." },
    { icon: "🌱", titulo: "Sostenibilidad", descripcion: "Utilizamos materiales naturales y procesos eco-amigables en todas nuestras piezas." },
    { icon: "🎨", titulo: "Autenticidad", descripcion: "Cada pieza conserva las técnicas tradicionales de la cultura huasteca." },
  ];

  const historiaTexto = "La Aterciopelada nació como un sueño de preservar y celebrar las tradiciones artesanales de la región Huasteca. A lo largo de los años, hemos crecido desde nuestras humildes raíces hasta convertirnos en un referente de la moda artesanal mexicana, siempre manteniendo nuestro compromiso con la calidad, la autenticidad y el respeto hacia nuestras artesanas. Cada pieza que creamos es testimonio de una rica herencia cultural que se entrelaza con diseños contemporáneos, creando prendas únicas que cuentan historias milenarias mientras abrazan la modernidad.";
  const customStyles = {
    heroSection: {
      background: stylesPublic.colors.background.gradient.primary,
      height: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: stylesPublic.transitions.preset.pageIn,
    },
    heroOverlay: {
      ...stylesPublic.utils.overlay.standard,
      background: stylesPublic.elements.backgroundPatterns.floral,
      opacity: 0.8,
    },    section: {
      padding: stylesPublic.spacing.section.large,
      maxWidth: stylesPublic.utils.container.maxWidth,
      margin: stylesPublic.spacing.margin.auto,
      position: "relative",
      '@media (max-width: 768px)': {
        padding: stylesPublic.spacing.section.medium,
      },
      '@media (max-width: 480px)': {
        padding: stylesPublic.spacing.section.small,
      },
    },
    historiaSection: {
      background: stylesPublic.colors.background.gradient.secondary,
      opacity: isVisible.historia ? 1 : 0,
      transform: isVisible.historia ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
    },    misionSection: {
      background: `linear-gradient(135deg, #FFD1BA 0%, #F8B4C4 100%)`,
      opacity: isVisible.mision ? 1 : 0,
      transform: isVisible.mision ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
    },
    colaboradoresSection: {
      background: stylesPublic.colors.background.gradient.secondary,
      opacity: isVisible.colaboradores ? 1 : 0,
      transform: isVisible.colaboradores ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
    },
    valoresSection: {
      background: `linear-gradient(135deg, #FFD1BA 0%, #F8B4C4 100%)`,
      opacity: isVisible.valores ? 1 : 0,
      transform: isVisible.valores ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
    },
    ctaSection: {
      background: stylesPublic.colors.background.gradient.accent,
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
      position: "relative",
    },
    titleUnderline: stylesPublic.elements.decorative.underline,
    whiteUnderline: {
      background: `#ffffff`,
      boxShadow: stylesPublic.shadows.sm,
    },
    pinkButton: stylesPublic.elements.buttons.primary,    card: stylesPublic.elements.cards.default,    teamImage: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      border: `3px solid ${stylesPublic.colors.primary.main}`,
      margin: `0 auto ${stylesPublic.spacing.lg}`,
      '@media (max-width: 768px)': {
        width: "120px",
        height: "120px",
      },
      '@media (max-width: 480px)': {
        width: "100px",
        height: "100px",
      },
    },
    valueIcon: {
      ...stylesPublic.elements.decorative.circle,
      fontSize: "1.8rem",
    },    timelineItem: {
      position: "relative",
      paddingLeft: stylesPublic.spacing.xl,
      marginBottom: stylesPublic.spacing.xl,
      borderLeft: `${stylesPublic.borders.width.thicker} solid ${stylesPublic.colors.primary.main}`,
      '@media (max-width: 768px)': {
        paddingLeft: stylesPublic.spacing.lg,
        marginBottom: stylesPublic.spacing.lg,
      },
      '@media (max-width: 480px)': {
        paddingLeft: stylesPublic.spacing.md,
        marginBottom: stylesPublic.spacing.md,
      },
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>        <Container style={{ position: "relative", zIndex: stylesPublic.utils.zIndex.raised, maxWidth: "900px", padding: stylesPublic.spacing.section.medium }}>
          <h1 className="animate-in" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h1, 
            fontWeight: stylesPublic.typography.fontWeight.bold, 
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.lg, 
            letterSpacing: stylesPublic.typography.letterSpacing.tight, 
            lineHeight: stylesPublic.typography.lineHeight.tight, 
            animationDelay: "0.3s" 
          }}>
            Nosotros
          </h1>
          <div className="animate-in" style={{ 
            width: "80px", 
            height: "2px", 
            background: `linear-gradient(90deg, ${stylesPublic.colors.primary.main}, ${stylesPublic.colors.secondary.main}, transparent)`, 
            margin: "0 auto 2rem", 
            animationDelay: "0.9s" 
          }}></div>
          <p className="animate-in" style={{ 
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            color: stylesPublic.colors.text.secondary, 
            marginBottom: stylesPublic.spacing["3xl"], 
            letterSpacing: stylesPublic.typography.letterSpacing.wide, 
            animationDelay: "0.6s" 
          }}>
            Nuestra historia, valores y pasión por la artesanía huasteca
          </p>
        </Container>
      </section>

      {/* Historia Section */}
      <section style={customStyles.historiaSection}>
        <Container style={customStyles.section}>
          <Row className="align-items-center">
            <Col md={6} className="mb-5 mb-md-0">
              <Image 
                src="https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=2940" 
                alt="Historia de La Aterciopelada" 
                fluid 
                style={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}
              />
            </Col>
            <Col md={6}>              <h2 className="text-center" style={{ 
                fontFamily: stylesPublic.typography.fontFamily.heading, 
                fontSize: stylesPublic.typography.fontSize.h2, 
                fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.lg 
              }}>
                Nuestra Historia
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              <div style={{ marginTop: "2rem" }}>
                <p style={{ 
                  fontFamily: stylesPublic.typography.fontFamily.body, 
                  fontSize: stylesPublic.typography.fontSize.lg,
                  color: stylesPublic.colors.text.secondary, 
                  lineHeight: stylesPublic.typography.lineHeight.paragraph,
                  textAlign: "justify"
                }}>
                  {historiaTexto}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Misión Section */}
      <section style={customStyles.misionSection}>
        <Container style={customStyles.section}>          <h2 className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: "#ffffff", 
            textShadow: stylesPublic.shadows.sm, 
            marginBottom: stylesPublic.spacing.lg 
          }}>
            Nuestra Misión
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          
          <Row className="g-4 justify-content-center">
            <Col md={6}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>                  <h3 style={{ 
                    fontFamily: stylesPublic.typography.fontFamily.heading, 
                    fontSize: stylesPublic.typography.fontSize.xl, 
                    fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                    color: stylesPublic.colors.text.primary, 
                    marginBottom: stylesPublic.spacing.md 
                  }}>
                    Misión
                  </h3>
                  {loadingNosotros ? (
                    <p style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.body, 
                      color: stylesPublic.colors.text.secondary, 
                      lineHeight: stylesPublic.typography.lineHeight.paragraph,
                      fontStyle: 'italic'
                    }}>
                      Cargando misión...
                    </p>
                  ) : (
                    <p style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.body, 
                      color: stylesPublic.colors.text.secondary, 
                      lineHeight: stylesPublic.typography.lineHeight.paragraph,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {nosotrosData.mision || 'Preservar y modernizar las técnicas artesanales huastecas, creando piezas únicas que celebren nuestra herencia cultural mientras apoyamos a las comunidades artesanas.'}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>                  <h3 style={{ 
                    fontFamily: stylesPublic.typography.fontFamily.heading, 
                    fontSize: stylesPublic.typography.fontSize.xl, 
                    fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                    color: stylesPublic.colors.text.primary, 
                    marginBottom: stylesPublic.spacing.md 
                  }}>
                    Visión
                  </h3>
                  {loadingNosotros ? (
                    <p style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.body, 
                      color: stylesPublic.colors.text.secondary, 
                      lineHeight: stylesPublic.typography.lineHeight.paragraph,
                      fontStyle: 'italic'
                    }}>
                      Cargando visión...
                    </p>
                  ) : (
                    <p style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.body, 
                      color: stylesPublic.colors.text.secondary, 
                      lineHeight: stylesPublic.typography.lineHeight.paragraph,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {nosotrosData.vision || 'Ser reconocidos como el referente en moda artesanal huasteca, combinando tradición y diseño contemporáneo para llevar nuestra cultura al mundo.'}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Colaboradores Section */}
      <section style={customStyles.colaboradoresSection}>
        <Container style={customStyles.section}>          <h2 className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.lg 
          }}>
            Nuestros Colaboradores
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.body, 
            fontSize: stylesPublic.typography.fontSize.lg, 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing["3xl"]}` 
          }}>
            Conoce a los colaboradores que hacen posible nuestra labor
          </p>
            {loading ? (
            <div className="text-center my-5">
              <p>Cargando colaboradores...</p>
            </div>
          ) : (
            <Row className="g-4">
              {colaboradores.map((colaborador, idx) => (
                <Col md={4} key={idx}>
                  <Card className="h-100" style={customStyles.card}>
                    <Card.Body className="text-center">
                      <Image 
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(colaborador.nombre)}&background=random&color=fff&size=150`}
                        alt={colaborador.nombre} 
                        style={customStyles.teamImage}
                      />                    <h3 style={{ 
                        fontFamily: stylesPublic.typography.fontFamily.heading, 
                        fontSize: stylesPublic.typography.fontSize.xl, 
                        fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                        color: stylesPublic.colors.text.primary, 
                        marginBottom: stylesPublic.spacing.xs 
                      }}>
                        {colaborador.nombre}
                      </h3>
                      <p style={{ 
                        fontFamily: stylesPublic.typography.fontFamily.body, 
                        color: stylesPublic.colors.primary.main, 
                        fontWeight: stylesPublic.typography.fontWeight.medium, 
                        marginBottom: stylesPublic.spacing.md 
                      }}>
                        {colaborador.rol}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Valores Section */}
      <section style={customStyles.valoresSection}>
        <Container style={customStyles.section}>          <h2 className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: "#ffffff", 
            textShadow: stylesPublic.shadows.sm, 
            marginBottom: stylesPublic.spacing.lg 
          }}>
            Nuestros Valores
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          
          <Row className="g-4">
            {valores.map((valor, idx) => (
              <Col md={4} key={idx}>
                <Card className="h-100" style={customStyles.card}>
                  <Card.Body className="text-center">
                    <div style={{ 
                      ...customStyles.valueIcon, 
                      background: idx === 0 ? "linear-gradient(135deg, #ff0070, #ff1030)" : 
                                  idx === 1 ? "linear-gradient(135deg, #1f8a80, #8840b8)" : 
                                  "linear-gradient(135deg, #8840b8, #23102d)"
                    }}>
                      {valor.icon}
                    </div>                    <h3 style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.heading, 
                      fontSize: stylesPublic.typography.fontSize.xl, 
                      fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                      color: stylesPublic.colors.text.primary, 
                      marginBottom: stylesPublic.spacing.md 
                    }}>
                      {valor.titulo}
                    </h3>
                    <p style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.body, 
                      color: stylesPublic.colors.text.secondary, 
                      lineHeight: stylesPublic.typography.lineHeight.paragraph 
                    }}>
                      {valor.descripcion}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={customStyles.ctaSection}>
        <Container style={{ ...customStyles.section, position: "relative", zIndex: 2, textAlign: "center" }}>          <h2 className="animate-in" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: "#ffffff", 
            marginBottom: stylesPublic.spacing.md, 
            animationDelay: "0.3s" 
          }}>
            Únete a Nuestra Comunidad
          </h2>
          <p className="animate-in" style={{ 
            fontSize: stylesPublic.typography.fontSize.lg, 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            color: "#ffffff", 
            opacity: 0.75, 
            maxWidth: "700px", 
            margin: `0 auto ${stylesPublic.spacing.xl}`, 
            animationDelay: "0.5s" 
          }}>
            Descubre la belleza de la artesanía huasteca y forma parte de esta tradición
          </p>
        </Container>
      </section>
    </>
  );
};

export default Nosotros;