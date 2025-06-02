import { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
      height: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: "all 1.2s ease-out",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="floral-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="15" cy="15" r="1.5" fill="%23ff0070" opacity="0.45"/><circle cx="35" cy="25" r="1" fill="%231f8a80" opacity="0.4"/><circle cx="25" cy="35" r="1.2" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23floral-pattern)"/></svg>')`,
      opacity: 0.8,
      zIndex: 1,
    },
    section: {
      padding: "6rem 2rem",
      maxWidth: "1400px",
      margin: "0 auto",
      position: "relative",
    },
    serviciosSection: {
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`,
      opacity: isVisible.servicios ? 1 : 0,
      transform: isVisible.servicios ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    beneficiosSection: {
      background: `linear-gradient(135deg, #FFB199 0%, #F58DAD 100%)`, // Colores más intensos
      opacity: isVisible.beneficios ? 1 : 0,
      transform: isVisible.beneficios ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    ctaSection: {
      background: `linear-gradient(135deg, #ff8090 0%, #1f8a80 100%)`,
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
    },
    titleUnderline: {
      display: "block",
      width: "60px",
      height: "2px",
      background: `linear-gradient(90deg, #ff0070, #1f8a80)`,
      borderRadius: "1px",
      margin: "15px auto",
    },
    pinkButton: {
      backgroundColor: '#ff4060',
      borderColor: '#ff4060',
      color: '#ffffff',
      borderRadius: "30px",
      padding: "12px 30px",
      fontWeight: "500",
      fontSize: "1.1rem",
    },
    serviceCard: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "2.5rem 2rem",
      textAlign: "center",
      boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      border: "1px solid rgba(232, 180, 184, 0.15)",
      height: "100%",
    },
    benefitIcon: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      color: "#ffffff",
      boxShadow: "0 8px 24px rgba(232, 180, 184, 0.45)",
      margin: "0 auto 1.5rem",
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
            transform: hoveredService === servicio.id ? "translateY(-10px)" : "translateY(0)",
            borderLeft: `3px solid ${idx === 0 ? "#ff0070" : idx === 1 ? "#1f8a80" : idx === 2 ? "#ff1030" : "#8840b8"}`,
          }}
          onMouseEnter={() => setHoveredService(servicio.id)}
          onMouseLeave={() => setHoveredService(null)}
        >
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>
            {ServiceIcons[servicio.id]}
          </div>
          <Card.Body>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>
              {servicio.titulo}
            </h3>
            <p style={{ fontSize: "0.95rem", color: "#403a3c", lineHeight: 1.6 }}>
              {servicio.descripcion}
            </p>
            <Button 
              variant="outline-primary" 
              style={{ 
                borderColor: "#ff4060", 
                color: "#ff4060",
                borderRadius: "20px",
                marginTop: "1rem",
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
            background: "#ffffff", 
            borderRadius: "12px", 
            padding: "2rem 1.5rem",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ ...customStyles.benefitIcon, background: beneficio.color }}>
            {ServiceIcons[beneficio.id]}
          </div>
          <Card.Body>
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>
              {beneficio.titulo}
            </h3>
            <p style={{ fontSize: "0.9rem", color: "#403a3c", lineHeight: 1.6 }}>
              {beneficio.descripcion}
            </p>
          </Card.Body>
        </Card>
      </Col>
    ));
  }, [beneficiosData, ServiceIcons, customStyles.benefitIcon]);

  return (
    <>
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ position: "relative", zIndex: 2, maxWidth: "900px", padding: "4rem 2rem" }}>
          <h1 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700, color: "#23102d", marginBottom: "1.5rem", letterSpacing: "-0.02em", lineHeight: 1.1, animationDelay: "0.3s" }}>
            Servicios Exclusivos
          </h1>
          <div className="animate-in" style={{ width: "80px", height: "2px", background: "linear-gradient(90deg, #ff0070, #1f8a80, transparent)", margin: "0 auto 2rem", animationDelay: "0.9s" }}></div>
          <p className="animate-in" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 300, color: "#403a3c", marginBottom: "3rem", letterSpacing: "0.5px", animationDelay: "0.6s" }}>
            Descubre nuestros servicios artesanales que celebran la tradición huasteca
          </p>
          <Button className="animate-in" style={{ ...customStyles.pinkButton, animationDelay: "1.2s" }} onClick={() => navigate("/contacto")}>
            Contáctanos
          </Button>
        </Container>
      </section>

      {/* Servicios Section */}
      <section style={customStyles.serviciosSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem" }}>
            Nuestros Servicios
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#403a3c", maxWidth: "800px", margin: "0 auto 3rem" }}>
            Ofrecemos una experiencia única en diseño y confección de moda huasteca
          </p>
          <Row className="g-4">
            {renderServiceCards()}
          </Row>
        </Container>
      </section>

      {/* Beneficios Section */}
      <section style={customStyles.beneficiosSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", marginBottom: "1.5rem" }}>
            Beneficios Exclusivos
            <span style={{ ...customStyles.titleUnderline, background: "#ffffff" }}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", maxWidth: "800px", margin: "0 auto 3rem" }}>
            Razones para elegir los servicios de La Aterciopelada
          </p>
          <Row className="g-4">
            {renderBenefitCards()}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={customStyles.ctaSection}>
        <Container style={{ ...customStyles.section, position: "relative", zIndex: 2, textAlign: "center" }}>
          <h2 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#ffffff", marginBottom: "1rem", animationDelay: "0.3s" }}>
            ¿Listo para vivir la experiencia Aterciopelada?
          </h2>
          <p className="animate-in" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#ffffff", opacity: 0.75, maxWidth: "700px", margin: "0 auto 2rem", animationDelay: "0.5s" }}>
            Agenda una cita con nuestros diseñadores y descubre cómo podemos crear piezas únicas para ti
          </p>
          <Button className="animate-in" style={{ ...customStyles.pinkButton, animationDelay: "0.7s" }} onClick={() => navigate("/contacto")}>
            Agendar cita
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Servicios;