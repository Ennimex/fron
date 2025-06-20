import { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import stylesPublic from '../../styles/stylesPublic';

const Servicios = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({
    hero: false,
    servicios: false,
    beneficios: false,
    cta: false,
  });
  const [hoveredService, setHoveredService] = useState(null);

  useEffect(() => {
    // Animaciones escalonadas como en Inicio.js
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, servicios: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, beneficios: true })), 600);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 900);
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
  // Estilos consistentes con Inicio.js
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
    },
    section: {
      padding: stylesPublic.spacing.section.large,
      maxWidth: stylesPublic.utils.container.maxWidth,
      margin: stylesPublic.spacing.margin.auto,
      position: "relative",
    },
    serviciosSection: {
      background: stylesPublic.colors.background.gradient.secondary,
      opacity: isVisible.servicios ? 1 : 0,
      transform: isVisible.servicios ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
    },
    beneficiosSection: {
      background: `linear-gradient(135deg, #FFB199 0%, #F58DAD 100%)`,
      opacity: isVisible.beneficios ? 1 : 0,
      transform: isVisible.beneficios ? "translateY(0)" : "translateY(20px)",
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
    pinkButton: stylesPublic.elements.buttons.primary,
    serviceCard: stylesPublic.elements.cards.default,
    benefitIcon: {
      ...stylesPublic.elements.decorative.circle,
      fontSize: "1.8rem",
    },
  };

  // Datos de servicios para la boutique
  const serviciosData = useMemo(() => [
    {
      id: 'diseno',
      titulo: "Diseño Personalizado",
      descripcion: "Creación de piezas únicas según tus preferencias y medidas, fusionando tradición huasteca con diseño contemporáneo.",
      imagen: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2940",
    },
    {
      id: 'confeccion',
      titulo: "Confección Artesanal",
      descripcion: "Elaboración de prendas con técnicas tradicionales huastecas, garantizando calidad y autenticidad en cada puntada.",
      imagen: "https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=2940",
    },
    {
      id: 'bordado',
      titulo: "Bordado a Mano",
      descripcion: "Bordados tradicionales huastecos realizados por nuestras maestras artesanas, con motivos ancestrales y colores vibrantes.",
      imagen: "https://images.unsplash.com/photo-1612903351440-147fb1e94e48?q=80&w=2940",
    },
    {
      id: 'asesoria',
      titulo: "Asesoría de Estilo",
      descripcion: "Guía experta para combinar prendas y accesorios huastecos con tu guardarropa, creando looks únicos.",
      imagen: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2940",
    },
  ], []);

  // Beneficios de la boutique
  const beneficiosData = useMemo(() => [
    { 
      id: 'calidad',
      titulo: "Calidad Superior", 
      descripcion: "Cada pieza es elaborada con los mejores materiales y técnicas artesanales.",
      color: "linear-gradient(135deg, #ff0070, #ff1030)",
    },
    { 
      id: 'autenticidad',
      titulo: "Autenticidad", 
      descripcion: "Diseños que preservan la esencia cultural de la Huasteca.",
      color: "linear-gradient(135deg, #1f8a80, #8840b8)",
    },
    { 
      id: 'artesanos',
      titulo: "Artesanos Expertos", 
      descripcion: "Trabajamos directamente con maestros artesanos huastecos.",
      color: "linear-gradient(135deg, #ff1030, #ff0070)",
    },
    { 
      id: 'exclusividad',
      titulo: "Exclusividad", 
      descripcion: "Piezas únicas y colecciones limitadas que no encontrarás en otro lugar.",
      color: "linear-gradient(135deg, #8840b8, #23102d)",
    },
  ], []);
  // Renderizado de cards de servicios
  const renderServiceCards = useCallback(() => {
    return serviciosData.map((servicio, idx) => (
      <Col md={6} lg={3} key={idx} className="mb-4">
        <Card 
          className="service-card h-100 shadow" 
          style={{ 
            ...customStyles.serviceCard,
            transform: hoveredService === servicio.id ? stylesPublic.elements.cards.hover.transform : "translateY(0)",
            borderLeft: `${stylesPublic.borders.width.thick} solid ${
              idx === 0 ? stylesPublic.colors.primary.main : 
              idx === 1 ? stylesPublic.colors.secondary.main : 
              idx === 2 ? stylesPublic.colors.accent.orange : 
              stylesPublic.colors.accent.purple
            }`,
          }}
          onMouseEnter={() => setHoveredService(servicio.id)}
          onMouseLeave={() => setHoveredService(null)}
        >
          <div style={{ 
            fontSize: stylesPublic.typography.fontSize["2xl"], 
            marginBottom: stylesPublic.spacing.md 
          }}>
            {ServiceIcons[servicio.id]}
          </div>
          <Card.Body>
            <h3 style={{ 
              fontFamily: stylesPublic.typography.fontFamily.heading, 
              fontSize: stylesPublic.typography.fontSize.xl, 
              fontWeight: stylesPublic.typography.fontWeight.semiBold, 
              color: stylesPublic.colors.text.primary, 
              marginBottom: stylesPublic.spacing.md 
            }}>
              {servicio.titulo}
            </h3>
            <p style={{ 
              fontSize: stylesPublic.typography.fontSize.sm, 
              color: stylesPublic.colors.text.secondary, 
              lineHeight: stylesPublic.typography.lineHeight.paragraph 
            }}>
              {servicio.descripcion}
            </p>
            <Button 
              variant="outline-primary" 
              style={{ 
                borderColor: stylesPublic.colors.primary.main, 
                color: stylesPublic.colors.primary.main,
                borderRadius: stylesPublic.borders.radius.button,
                marginTop: stylesPublic.spacing.md,
              }}
              onClick={() => navigate(`/servicios/${servicio.id}`)}
            >
              Conocer más
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  }, [serviciosData, hoveredService, navigate, ServiceIcons, customStyles.serviceCard]);
  // Renderizado de beneficios
  const renderBenefitCards = useCallback(() => {
    return beneficiosData.map((beneficio, idx) => (
      <Col md={6} lg={3} key={idx} className="mb-4">
        <Card 
          className="h-100 shadow" 
          style={{ 
            ...stylesPublic.elements.cards.default,
            textAlign: "center",
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
              fontFamily: stylesPublic.typography.fontFamily.heading, 
              fontSize: stylesPublic.typography.fontSize.lg, 
              fontWeight: stylesPublic.typography.fontWeight.semiBold, 
              color: stylesPublic.colors.text.primary, 
              marginBottom: stylesPublic.spacing.md 
            }}>
              {beneficio.titulo}
            </h3>
            <p style={{ 
              fontSize: stylesPublic.typography.fontSize.sm, 
              color: stylesPublic.colors.text.secondary, 
              lineHeight: stylesPublic.typography.lineHeight.paragraph 
            }}>
              {beneficio.descripcion}
            </p>
          </Card.Body>
        </Card>
      </Col>
    ));
  }, [beneficiosData, ServiceIcons, customStyles.benefitIcon]);

  return (
    <>      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.raised, 
          maxWidth: "900px", 
          padding: stylesPublic.spacing.section.medium 
        }}>
          <h1 className="animate-in" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: "clamp(3rem, 6vw, 5rem)", 
            fontWeight: stylesPublic.typography.fontWeight.bold, 
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.lg, 
            letterSpacing: stylesPublic.typography.letterSpacing.tight, 
            lineHeight: stylesPublic.typography.lineHeight.tight, 
            animationDelay: "0.3s" 
          }}>
            Servicios Exclusivos
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
            Descubre nuestros servicios artesanales que celebran la tradición huasteca
          </p>
          <Button className="animate-in" style={{ 
            ...customStyles.pinkButton, 
            animationDelay: "1.2s" 
          }} onClick={() => navigate("/contacto")}>
            Contáctanos
          </Button>
        </Container>
      </section>      {/* Servicios Section */}
      <section style={customStyles.serviciosSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.lg 
          }}>
            Nuestros Servicios
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ 
            fontSize: stylesPublic.typography.fontSize.lg, 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing["3xl"]}` 
          }}>
            Ofrecemos una experiencia única en diseño y confección de moda huasteca
          </p>
          <Row className="g-4">
            {renderServiceCards()}
          </Row>
        </Container>
      </section>      {/* Beneficios Section */}
      <section style={customStyles.beneficiosSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: "#ffffff", 
            textShadow: stylesPublic.shadows.sm, 
            marginBottom: stylesPublic.spacing.lg 
          }}>
            Beneficios Exclusivos
            <span style={{ 
              ...customStyles.titleUnderline, 
              background: "#ffffff" 
            }}></span>
          </h2>
          <p className="text-center" style={{ 
            fontSize: stylesPublic.typography.fontSize.lg, 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            color: "#ffffff", 
            textShadow: stylesPublic.shadows.sm, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing["3xl"]}` 
          }}>
            Razones para elegir los servicios de La Aterciopelada
          </p>
          <Row className="g-4">
            {renderBenefitCards()}
          </Row>
        </Container>
      </section>      {/* CTA Section */}
      <section style={customStyles.ctaSection}>
        <Container style={{ 
          ...customStyles.section, 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.raised, 
          textAlign: "center" 
        }}>
          <h2 className="animate-in" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: "#ffffff", 
            marginBottom: stylesPublic.spacing.md, 
            animationDelay: "0.3s" 
          }}>
            ¿Listo para vivir la experiencia Aterciopelada?
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
            Agenda una cita con nuestros diseñadores y descubre cómo podemos crear piezas únicas para ti
          </p>
          <Button className="animate-in" style={{ 
            ...customStyles.pinkButton, 
            animationDelay: "0.7s" 
          }} onClick={() => navigate("/contacto")}>
            Agendar cita
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Servicios;