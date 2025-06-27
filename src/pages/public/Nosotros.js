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
    // Animaciones escalonadas progresivas
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
    { 
      icon: "🤝", 
      titulo: "Comercio Justo", 
      descripcion: "Garantizamos precios equitativos y condiciones dignas para nuestras artesanas.",
      color: stylesPublic.colors.gradients.primary
    },
    { 
      icon: "🌱", 
      titulo: "Sostenibilidad", 
      descripcion: "Utilizamos materiales naturales y procesos eco-amigables en todas nuestras piezas.",
      color: stylesPublic.colors.gradients.secondary
    },
    { 
      icon: "🎨", 
      titulo: "Autenticidad", 
      descripcion: "Cada pieza conserva las técnicas tradicionales de la cultura huasteca.",
      color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.semantic.success.light})`
    },
  ];

  const historiaTexto = "La Aterciopelada nació como un sueño de preservar y celebrar las tradiciones artesanales de la región Huasteca. A lo largo de los años, hemos crecido desde nuestras humildes raíces hasta convertirnos en una boutique reconocida por la calidad excepcional de nuestras creaciones. Cada pieza cuenta una historia, cada bordado lleva consigo la sabiduría ancestral de nuestras maestras artesanas. Nuestro compromiso trasciende la simple comercialización: somos guardianes de una herencia cultural que se transmite de generación en generación, adaptándose a los tiempos modernos sin perder su esencia tradicional.";

  // CSS usando exclusivamente tokens del sistema refactorizado
  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(${stylesPublic.spacing.scale[8]}); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-in {
      animation: fadeInUp ${stylesPublic.animations.duration.slowest} forwards;
    }

    .timeline-item {
      position: relative;
      padding-left: ${stylesPublic.spacing.scale[12]};
      margin-bottom: ${stylesPublic.spacing.scale[12]};
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[500]};
    }

    .timeline-item::before {
      content: '';
      position: absolute;
      left: -${stylesPublic.spacing.scale[2]};
      top: 0;
      width: ${stylesPublic.spacing.scale[4]};
      height: ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.full};
      background: ${stylesPublic.colors.primary[500]};
      box-shadow: ${stylesPublic.shadows.sm};
    }

    .value-card {
      transition: ${stylesPublic.animations.transitions.base};
    }

    .value-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[2]});
      box-shadow: ${stylesPublic.shadows.lg};
    }

    .team-card {
      transition: ${stylesPublic.animations.transitions.base};
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
    }

    .team-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.brand.primary};
      border-color: ${stylesPublic.colors.primary[500]};
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .timeline-item {
        padding-left: ${stylesPublic.spacing.scale[8]};
        margin-bottom: ${stylesPublic.spacing.scale[8]};
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale['2xl']} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .timeline-item {
        padding-left: ${stylesPublic.spacing.scale[6]};
        margin-bottom: ${stylesPublic.spacing.scale[6]};
      }
      .hero-section {
        padding: ${stylesPublic.spacing.scale[15]} 0 !important;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.xl} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.sm} !important;
      }
      .team-image {
        width: ${stylesPublic.spacing.scale[30]} !important;
        height: ${stylesPublic.spacing.scale[30]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.lg} !important;
      }
      .team-image {
        width: ${stylesPublic.spacing.scale[25]} !important;
        height: ${stylesPublic.spacing.scale[25]} !important;
      }
      .timeline-item {
        padding-left: ${stylesPublic.spacing.scale[4]};
        text-align: center;
      }
    }
  `;

  const customStyles = {
    heroSection: {
      background: stylesPublic.colors.gradients.hero,
      height: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[8]})`,
      transition: stylesPublic.animations.transitions.slow,
    },
    heroOverlay: {
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
    section: {
      padding: stylesPublic.spacing.sections.lg,
      maxWidth: stylesPublic.utils.container.maxWidth['2xl'],
      margin: stylesPublic.spacing.margins.auto,
      position: "relative",
    },
    historiaSection: {
      background: stylesPublic.colors.gradients.warm,
      opacity: isVisible.historia ? 1 : 0,
      transform: isVisible.historia ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    misionSection: {
      background: stylesPublic.colors.gradients.secondary,
      opacity: isVisible.mision ? 1 : 0,
      transform: isVisible.mision ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    colaboradoresSection: {
      background: stylesPublic.colors.gradients.warm,
      opacity: isVisible.colaboradores ? 1 : 0,
      transform: isVisible.colaboradores ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    valoresSection: {
      background: stylesPublic.colors.gradients.primary,
      opacity: isVisible.valores ? 1 : 0,
      transform: isVisible.valores ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    ctaSection: {
      background: stylesPublic.colors.gradients.accent,
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
      position: "relative",
    },
    titleUnderline: {
      display: 'block',
      width: stylesPublic.spacing.scale[20],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.sm,
      margin: `${stylesPublic.spacing.scale[4]} auto`,
    },
    whiteUnderline: {
      background: stylesPublic.colors.surface.primary,
      boxShadow: stylesPublic.shadows.sm,
    },
    card: {
      ...stylesPublic.components.card.base,
      padding: stylesPublic.spacing.scale[8]
    },
    teamImage: {
      width: stylesPublic.spacing.scale[38],
      height: stylesPublic.spacing.scale[38],
      borderRadius: stylesPublic.borders.radius.full,
      objectFit: "cover",
      border: `${stylesPublic.borders.width[2]}px solid ${stylesPublic.colors.primary[500]}`,
      margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
      display: "block"
    },
    valueIcon: {
      width: stylesPublic.spacing.scale[18],
      height: stylesPublic.spacing.scale[18],
      borderRadius: stylesPublic.borders.radius.full,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: stylesPublic.typography.scale['2xl'],
      margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
      boxShadow: stylesPublic.shadows.brand.primary
    },
  };

  return (
    <>
      <style>{animationStyles}</style>
      
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.docked, 
          maxWidth: stylesPublic.utils.container.maxWidth.lg, 
          padding: stylesPublic.spacing.scale[8]
        }}>
          <h1 className="animate-in" style={{ 
            ...stylesPublic.typography.headings.h1,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            animationDelay: "0.3s" 
          }}>
            Nosotros
          </h1>
          <div className="animate-in" style={{ 
            ...customStyles.titleUnderline,
            animationDelay: "0.9s" 
          }}></div>
          <p className="animate-in" style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            marginBottom: stylesPublic.spacing.scale[12], 
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
                style={{ 
                  borderRadius: stylesPublic.borders.radius.lg, 
                  boxShadow: stylesPublic.shadows.xl 
                }}
              />
            </Col>
            <Col md={6}>
              <h2 style={{ 
                ...stylesPublic.typography.headings.h2,
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.scale[6], 
                textAlign: "center" 
              }}>
                Nuestra Historia
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              <div style={{ marginTop: stylesPublic.spacing.scale[8] }}>
                <p style={{ 
                  ...stylesPublic.typography.body.large,
                  color: stylesPublic.colors.text.secondary, 
                  textAlign: "justify"
                }}>
                  {historiaTexto}
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Misión y Visión Section */}
      <section style={customStyles.misionSection}>
        <Container style={customStyles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.inverse, 
            textShadow: stylesPublic.shadows.sm, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Nuestra Misión y Visión
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          
          <Row className="g-4 justify-content-center">
            <Col md={6}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>
                  <h3 style={{ 
                    ...stylesPublic.typography.headings.h4,
                    color: stylesPublic.colors.text.primary, 
                    marginBottom: stylesPublic.spacing.scale[4] 
                  }}>
                    Misión
                  </h3>
                  {loadingNosotros ? (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: stylesPublic.spacing.scale[24]
                    }}>
                      <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ 
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.secondary,
                      whiteSpace: 'pre-wrap'
                    }}>
                      {nosotrosData.mision || 'Preservar y modernizar las técnicas artesanales huastecas, creando piezas únicas que celebren nuestra herencia cultural mientras apoyamos a las comunidades locales con comercio justo y sostenible.'}
                    </p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>
                  <h3 style={{ 
                    ...stylesPublic.typography.headings.h4,
                    color: stylesPublic.colors.text.primary, 
                    marginBottom: stylesPublic.spacing.scale[4] 
                  }}>
                    Visión
                  </h3>
                  {loadingNosotros ? (
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: stylesPublic.spacing.scale[24]
                    }}>
                      <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ 
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.secondary,
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
        <Container style={customStyles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Nuestros Colaboradores
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Conoce a los colaboradores que hacen posible nuestra labor
          </p>
          
          {loading ? (
            <div style={{ 
              textAlign: "center", 
              padding: stylesPublic.spacing.scale[12] 
            }}>
              <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p style={{ 
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.secondary,
                marginTop: stylesPublic.spacing.scale[3]
              }}>
                Cargando colaboradores...
              </p>
            </div>
          ) : colaboradores.length > 0 ? (
            <Row className="g-4">
              {colaboradores.map((colaborador, idx) => (
                <Col md={4} key={idx}>
                  <Card className="team-card h-100" style={customStyles.card}>
                    <Card.Body style={{ textAlign: "center" }}>
                      <Image 
                        src={colaborador.imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(colaborador.nombre)}&background=random&color=fff&size=150`}
                        alt={colaborador.nombre} 
                        style={customStyles.teamImage}
                      />
                      <h3 style={{ 
                        ...stylesPublic.typography.headings.h5,
                        color: stylesPublic.colors.text.primary, 
                        marginBottom: stylesPublic.spacing.scale[2] 
                      }}>
                        {colaborador.nombre}
                      </h3>
                      <p style={{ 
                        ...stylesPublic.typography.body.base,
                        color: stylesPublic.colors.primary[500], 
                        fontWeight: stylesPublic.typography.weights.medium, 
                        marginBottom: stylesPublic.spacing.scale[4] 
                      }}>
                        {colaborador.rol}
                      </p>
                      {colaborador.descripcion && (
                        <p style={{ 
                          ...stylesPublic.typography.body.small,
                          color: stylesPublic.colors.text.secondary
                        }}>
                          {colaborador.descripcion}
                        </p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ 
              textAlign: "center", 
              padding: stylesPublic.spacing.scale[16] 
            }}>
              <div style={{ 
                fontSize: stylesPublic.typography.scale["4xl"], 
                color: stylesPublic.colors.text.tertiary, 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                👥
              </div>
              <h3 style={{ 
                ...stylesPublic.typography.headings.h4,
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                Equipo en Construcción
              </h3>
              <p style={{ 
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.secondary 
              }}>
                Estamos trabajando en presentar a nuestro increíble equipo de colaboradores.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Valores Section */}
      <section style={customStyles.valoresSection}>
        <Container style={customStyles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.inverse, 
            textShadow: stylesPublic.shadows.sm, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Nuestros Valores
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          
          <Row className="g-4">
            {valores.map((valor, idx) => (
              <Col md={4} key={idx}>
                <Card className="value-card h-100" style={customStyles.card}>
                  <Card.Body style={{ textAlign: "center" }}>
                    <div style={{ 
                      ...customStyles.valueIcon, 
                      background: valor.color
                    }}>
                      {valor.icon}
                    </div>
                    <h3 style={{ 
                      ...stylesPublic.typography.headings.h5,
                      color: stylesPublic.colors.text.primary, 
                      marginBottom: stylesPublic.spacing.scale[4] 
                    }}>
                      {valor.titulo}
                    </h3>
                    <p style={{ 
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.secondary
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
        <Container style={{ 
          ...customStyles.section, 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.docked, 
          textAlign: "center" 
        }}>
          <h2 className="animate-in" style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.inverse, 
            marginBottom: stylesPublic.spacing.scale[4], 
            animationDelay: "0.3s" 
          }}>
            Únete a Nuestra Comunidad
          </h2>
          <p className="animate-in" style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.inverse, 
            opacity: 0.75, 
            maxWidth: "700px", 
            margin: `0 auto ${stylesPublic.spacing.scale[8]}`, 
            animationDelay: "0.5s" 
          }}>
            Descubre la belleza de la artesanía huasteca y forma parte de esta tradición
          </p>
          <div className="animate-in" style={{ animationDelay: "0.7s" }}>
            <button
              style={{
                ...stylesPublic.components.button.variants.primary,
                ...stylesPublic.components.button.sizes.lg,
                background: stylesPublic.colors.surface.primary,
                color: stylesPublic.colors.primary[500],
                border: `${stylesPublic.borders.width[2]}px solid ${stylesPublic.colors.surface.primary}`,
                transition: stylesPublic.animations.transitions.base
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = stylesPublic.colors.surface.primary;
              }}
              onMouseLeave={(e) => {
                e.target.style.background = stylesPublic.colors.surface.primary;
                e.target.style.color = stylesPublic.colors.primary[500];
              }}
              onClick={() => window.location.href = '/contacto'}
            >
              Conoce Más Sobre Nosotros
            </button>
          </div>
        </Container>
      </section>
    </>
  );
};

export default Nosotros;