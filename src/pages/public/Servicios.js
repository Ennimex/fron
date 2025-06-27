import { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import stylesPublic from '../../styles/stylesPublic';
import api from '../../services/api';

const Servicios = () => {
  const navigate = useNavigate();
  
  const [isVisible, setIsVisible] = useState({
    hero: false,
    servicios: false,
    tecnicas: false,
    beneficios: false,
    cta: false,
  });
  const [hoveredService, setHoveredService] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Animaciones escalonadas progresivas
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, servicios: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, tecnicas: true })), 500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, beneficios: true })), 700);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 900);
  }, []);

  // Cargar servicios desde la API
  useEffect(() => {
    const fetchServicios = async () => {
      try {
        setLoading(true);
        const data = await api.get('/servicios');
        setServicios(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar los servicios:', error);
        setLoading(false);
      }
    };

    fetchServicios();
  }, []);

  // Iconos para los servicios de la boutique
  const ServiceIcons = useMemo(() => ({
    diseno: "🎨",
    confeccion: "✂️",
    bordado: "🧵",
    asesoria: "💡",
    talleres: "👩‍🏫",
    calidad: "⭐",
    autenticidad: "🌿",
    artesanos: "👐",
    exclusividad: "✨",
  }), []);

  // Beneficios de la boutique
  const beneficiosData = useMemo(() => [
    { 
      id: 'calidad',
      titulo: "Calidad Superior", 
      descripcion: "Cada pieza es elaborada con los mejores materiales y técnicas artesanales.",
      color: stylesPublic.colors.gradients.primary,
    },
    { 
      id: 'autenticidad',
      titulo: "Autenticidad", 
      descripcion: "Diseños que preservan la esencia cultural de la Huasteca.",
      color: stylesPublic.colors.gradients.secondary,
    },
    { 
      id: 'artesanos',
      titulo: "Artesanos Expertos", 
      descripcion: "Trabajamos directamente con maestros artesanos huastecos.",
      color: `linear-gradient(135deg, ${stylesPublic.colors.primary[700]}, ${stylesPublic.colors.primary[500]})`,
    },
    { 
      id: 'exclusividad',
      titulo: "Exclusividad", 
      descripcion: "Piezas únicas y colecciones limitadas que no encontrarás en otro lugar.",
      color: `linear-gradient(135deg, ${stylesPublic.colors.secondary[700]}, ${stylesPublic.colors.neutral[800]})`,
    },
  ], []);

  // CSS usando exclusivamente tokens del sistema refactorizado
  const animationStyles = `
    @keyframes pulse {
      0%, 100% { opacity: 0.6; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.1); }
    }
    
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(${stylesPublic.spacing.scale[5]}); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-in {
      animation: fadeInUp ${stylesPublic.animations.duration.slowest} forwards;
    }
    
    .service-card {
      transition: ${stylesPublic.animations.transitions.base};
    }
    
    .service-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.lg};
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .service-card {
        margin-bottom: ${stylesPublic.spacing.scale[5]};
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale['2xl']} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .service-card {
        padding: ${stylesPublic.spacing.scale[6]} !important;
        margin-bottom: ${stylesPublic.spacing.scale[4]};
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
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .service-card {
        padding: ${stylesPublic.spacing.scale[4]} !important;
        text-align: center;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.lg} !important;
      }
    }
  `;

  // Estilos usando tokens del sistema refactorizado
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
    serviciosSection: {
      background: stylesPublic.colors.gradients.warm,
      opacity: isVisible.servicios ? 1 : 0,
      transform: isVisible.servicios ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    beneficiosSection: {
      background: stylesPublic.colors.gradients.secondary,
      opacity: isVisible.beneficios ? 1 : 0,
      transform: isVisible.beneficios ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
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
    serviceCard: {
      ...stylesPublic.components.card.base,
      padding: stylesPublic.spacing.scale[8],
    },
    benefitIcon: {
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

  // Renderizado de cards de servicios
  const renderServiceCards = useCallback(() => {
    if (loading) {
      return (
        <Row className="g-4 justify-content-center">
          {[1, 2, 3, 4].map((item) => (
            <Col md={6} lg={3} key={item}>
              <div style={{
                padding: stylesPublic.spacing.scale[8],
                backgroundColor: stylesPublic.colors.surface.primary,
                borderRadius: stylesPublic.borders.radius.lg,
                textAlign: 'center',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                boxShadow: stylesPublic.shadows.sm
              }}>
                <div style={{
                  fontSize: stylesPublic.typography.scale["2xl"],
                  marginBottom: stylesPublic.spacing.scale[4],
                  animation: 'pulse 1.5s infinite'
                }}>⏳</div>
                <p style={{ 
                  ...stylesPublic.typography.body.base,
                  color: stylesPublic.colors.text.secondary,
                  margin: 0
                }}>
                  Cargando...
                </p>
              </div>
            </Col>
          ))}
        </Row>
      );
    }

    if (servicios.length === 0) {
      // Servicios principales que manejamos
      const serviciosPredeterminados = [
        {
          _id: 'confeccion',
          titulo: 'Confección y Costura',
          descripcion: 'Elaboración de prendas con técnicas tradicionales transmitidas por generaciones de artesanos huastecos. Desde vestidos ceremoniales hasta ropa contemporánea.',
          icono: '✂️'
        },
        {
          _id: 'accesorios',
          titulo: 'Accesorios Artesanales',
          descripcion: 'Creación de complementos únicos como rebozos, bolsos, joyería textil y elementos decorativos que realzan tu estilo personal.',
          icono: '💍'
        }
      ];

      return serviciosPredeterminados.map((servicio, idx) => (
        <Col md={6} key={servicio._id} className="mb-4">
          <Card 
            className="service-card h-100" 
            style={{ 
              ...customStyles.serviceCard,
              transform: hoveredService === servicio._id ? `translateY(-${stylesPublic.spacing.scale[2]})` : "translateY(0)",
              borderLeft: `${stylesPublic.borders.width[4]}px solid ${
                idx === 0 ? stylesPublic.colors.primary[500] : stylesPublic.colors.secondary[500]
              }`,
              minHeight: '350px'
            }}
            onMouseEnter={() => setHoveredService(servicio._id)}
            onMouseLeave={() => setHoveredService(null)}
          >
            <div style={{ 
              fontSize: stylesPublic.typography.scale["3xl"], 
              marginBottom: stylesPublic.spacing.scale[4],
              padding: `${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[4]} 0`,
              textAlign: 'center'
            }}>
              {servicio.icono}
            </div>
            <Card.Body style={{ display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ 
                ...stylesPublic.typography.headings.h4,
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                {servicio.titulo}
              </h3>
              <p style={{ 
                ...stylesPublic.typography.body.small,
                color: stylesPublic.colors.text.secondary,
                flexGrow: 1
              }}>
                {servicio.descripcion}
              </p>
            </Card.Body>
          </Card>
        </Col>
      ));
    }

    return servicios.map((servicio, idx) => (
      <Col md={6} lg={3} key={servicio._id} className="mb-4">
        <Card 
          className="service-card h-100" 
          style={{ 
            ...customStyles.serviceCard,
            transform: hoveredService === servicio._id ? `translateY(-${stylesPublic.spacing.scale[2]})` : "translateY(0)",
            borderLeft: `${stylesPublic.borders.width[4]}px solid ${
              idx === 0 ? stylesPublic.colors.primary[500] : 
              idx === 1 ? stylesPublic.colors.secondary[500] : 
              idx === 2 ? stylesPublic.colors.semantic.warning.main : 
              stylesPublic.colors.secondary[700]
            }`,
          }}
          onMouseEnter={() => setHoveredService(servicio._id)}
          onMouseLeave={() => setHoveredService(null)}
        >
          {/* Mostrar imagen si está disponible */}
          {servicio.imagen && (
            <Card.Img 
              variant="top" 
              src={servicio.imagen} 
              alt={servicio.titulo || servicio.nombre}
              style={{
                height: '200px',
                objectFit: 'cover',
                borderRadius: `${stylesPublic.borders.radius.lg} ${stylesPublic.borders.radius.lg} 0 0`
              }}
            />
          )}
          <div style={{ 
            fontSize: stylesPublic.typography.scale["2xl"], 
            marginBottom: stylesPublic.spacing.scale[4],
            padding: stylesPublic.spacing.scale[4],
            textAlign: 'center'
          }}>
            {/* Usar el icono del servicio si está disponible, o un icono por defecto */}
            {servicio.icono || ServiceIcons[Object.keys(ServiceIcons)[idx % Object.keys(ServiceIcons).length]]}
          </div>
          <Card.Body>
            <h3 style={{ 
              ...stylesPublic.typography.headings.h4,
              color: stylesPublic.colors.text.primary, 
              marginBottom: stylesPublic.spacing.scale[4] 
            }}>
              {servicio.titulo || servicio.nombre}
            </h3>
            <p style={{ 
              ...stylesPublic.typography.body.small,
              color: stylesPublic.colors.text.secondary
            }}>
              {servicio.descripcion}
            </p>
          </Card.Body>
        </Card>
      </Col>
    ));
  }, [servicios, loading, hoveredService, ServiceIcons, customStyles.serviceCard]);

  // Renderizado de beneficios
  const renderBenefitCards = useCallback(() => {
    return beneficiosData.map((beneficio, idx) => (
      <Col md={6} lg={3} key={idx} className="mb-4">
        <Card 
          className="h-100" 
          style={{ 
            ...stylesPublic.components.card.base,
            textAlign: "center",
            padding: stylesPublic.spacing.scale[8]
          }}
        >
          <div style={{ 
            ...customStyles.benefitIcon, 
            background: beneficio.color 
          }}>
            {ServiceIcons[beneficio.id]}
          </div>
          <Card.Body>
            <h3 style={{ 
              ...stylesPublic.typography.headings.h5,
              color: stylesPublic.colors.text.primary, 
              marginBottom: stylesPublic.spacing.scale[4] 
            }}>
              {beneficio.titulo}
            </h3>
            <p style={{ 
              ...stylesPublic.typography.body.small,
              color: stylesPublic.colors.text.secondary
            }}>
              {beneficio.descripcion}
            </p>
          </Card.Body>
        </Card>
      </Col>
    ));
  }, [beneficiosData, ServiceIcons, customStyles.benefitIcon]);

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
            Servicios Exclusivos
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
            Descubre nuestros servicios artesanales que celebran la tradición huasteca
          </p>
          <Button 
            className="animate-in" 
            style={{ 
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.lg,
              animationDelay: "1.2s" 
            }} 
            onClick={() => navigate("/contacto")}
          >
            Contáctanos
          </Button>
        </Container>
      </section>

      {/* Servicios Section */}
      <section style={customStyles.serviciosSection}>
        <Container style={customStyles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Nuestros Servicios
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Ofrecemos una experiencia única en diseño y confección de moda huasteca
          </p>
          <Row className="g-4 justify-content-center">
            {renderServiceCards()}
          </Row>
          
          {/* Información adicional */}
          <Row className="mt-5">
            <Col xs={12} className="text-center">
              <div style={{
                background: stylesPublic.colors.surface.primary,
                padding: stylesPublic.spacing.scale[12],
                borderRadius: stylesPublic.borders.radius.lg,
                boxShadow: stylesPublic.shadows.sm,
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                <h3 style={{
                  ...stylesPublic.typography.headings.h4,
                  color: stylesPublic.colors.text.primary,
                  marginBottom: stylesPublic.spacing.scale[4]
                }}>
                  ¿Necesitas algo personalizado?
                </h3>
                <p style={{
                  ...stylesPublic.typography.body.base,
                  color: stylesPublic.colors.text.secondary,
                  marginBottom: stylesPublic.spacing.scale[8]
                }}>
                  Trabajamos contigo para crear servicios personalizados que se adapten a tus necesidades específicas. 
                  Desde eventos especiales hasta colecciones exclusivas.
                </p>
                <Button 
                  style={{
                    ...stylesPublic.components.button.variants.primary,
                    ...stylesPublic.components.button.sizes.base
                  }}
                  onClick={() => navigate("/contacto")}
                >
                  Solicitar Información
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Beneficios Section */}
      <section style={customStyles.beneficiosSection}>
        <Container style={customStyles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.inverse, 
            textShadow: stylesPublic.shadows.sm, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Beneficios Exclusivos
            <span style={{ 
              ...customStyles.titleUnderline, 
              ...customStyles.whiteUnderline
            }}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.inverse, 
            textShadow: stylesPublic.shadows.sm, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Razones para elegir los servicios de La Aterciopelada
          </p>
          <Row className="g-4">
            {renderBenefitCards()}
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
            Descubre la Experiencia Aterciopelada
          </h2>
          <p className="animate-in" style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.inverse, 
            opacity: 0.9, 
            maxWidth: "700px", 
            margin: `0 auto ${stylesPublic.spacing.scale[8]}`, 
            animationDelay: "0.5s" 
          }}>
            Cada servicio que ofrecemos está diseñado para celebrar la rica tradición textil de la Huasteca, 
            combinando técnicas ancestrales con diseños contemporáneos para crear piezas verdaderamente únicas.
          </p>
          <Button 
            className="animate-in" 
            style={{ 
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.lg,
              animationDelay: "0.7s" 
            }} 
            onClick={() => navigate("/contacto")}
          >
            Explorar Servicios
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Servicios;