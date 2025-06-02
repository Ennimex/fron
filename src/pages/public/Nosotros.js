import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Nosotros = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState({
    hero: false,
    historia: false,
    mision: false,
    equipo: false,
    valores: false,
    cta: false,
  });

  useEffect(() => {
    // Animaciones escalonadas como en Inicio.js
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, historia: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, mision: true })), 600);
    setTimeout(() => setIsVisible(prev => ({ ...prev, equipo: true })), 900);
    setTimeout(() => setIsVisible(prev => ({ ...prev, valores: true })), 1200);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 1500);
  }, []);

  const equipo = [
    { 
      nombre: "María Hernández", 
      rol: "Fundadora & Diseñadora", 
      bio: "Maestra artesana con 25 años de experiencia en bordado tradicional huasteco.",
      imagen: "/team/maria.jpg"
    },
    { 
      nombre: "Carlos Méndez", 
      rol: "Director Comercial", 
      bio: "Especialista en comercio justo y desarrollo comunitario.",
      imagen: "/team/carlos.jpg"
    },
    { 
      nombre: "Luisa Torres", 
      rol: "Coordinadora de Producción", 
      bio: "Encargada de mantener los más altos estándares de calidad artesanal.",
      imagen: "/team/luisa.jpg"
    },
  ];

  const valores = [
    { icon: "🤝", titulo: "Comercio Justo", descripcion: "Garantizamos precios equitativos y condiciones dignas para nuestras artesanas." },
    { icon: "🌱", titulo: "Sostenibilidad", descripcion: "Utilizamos materiales naturales y procesos eco-amigables en todas nuestras piezas." },
    { icon: "🎨", titulo: "Autenticidad", descripcion: "Cada pieza conserva las técnicas tradicionales de la cultura huasteca." },
  ];

  const historia = [
    { año: "1995", evento: "Nace el taller familiar en Xilitla, San Luis Potosí" },
    { año: "2008", evento: "Primera exposición internacional en París" },
    { año: "2015", evento: "Reconocimiento por la UNESCO como patrimonio cultural" },
    { año: "2020", evento: "Lanzamiento de la plataforma digital" },
  ];

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
    historiaSection: {
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`,
      opacity: isVisible.historia ? 1 : 0,
      transform: isVisible.historia ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    misionSection: {
      background: `linear-gradient(135deg, #FFD1BA 0%, #F8B4C4 100%)`,
      opacity: isVisible.mision ? 1 : 0,
      transform: isVisible.mision ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    equipoSection: {
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`,
      opacity: isVisible.equipo ? 1 : 0,
      transform: isVisible.equipo ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    valoresSection: {
      background: `linear-gradient(135deg, #FFD1BA 0%, #F8B4C4 100%)`,
      opacity: isVisible.valores ? 1 : 0,
      transform: isVisible.valores ? "translateY(0)" : "translateY(20px)",
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
    whiteUnderline: {
      background: `#ffffff`,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
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
    card: {
      background: "#ffffff",
      borderRadius: "12px",
      padding: "2.5rem 2rem",
      textAlign: "center",
      boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)",
      transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      border: "1px solid rgba(232, 180, 184, 0.15)",
      height: "100%",
    },
    teamImage: {
      width: "150px",
      height: "150px",
      borderRadius: "50%",
      objectFit: "cover",
      border: "3px solid #ff4060",
      margin: "0 auto 1.5rem",
    },
    valueIcon: {
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
    timelineItem: {
      position: "relative",
      paddingLeft: "30px",
      marginBottom: "30px",
      borderLeft: "3px solid #ff4060",
    },
  };

  return (
    <>
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ position: "relative", zIndex: 2, maxWidth: "900px", padding: "4rem 2rem" }}>
          <h1 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700, color: "#23102d", marginBottom: "1.5rem", letterSpacing: "-0.02em", lineHeight: 1.1, animationDelay: "0.3s" }}>
            La Aterciopelada
          </h1>
          <div className="animate-in" style={{ width: "80px", height: "2px", background: "linear-gradient(90deg, #ff0070, #1f8a80, transparent)", margin: "0 auto 2rem", animationDelay: "0.9s" }}></div>
          <p className="animate-in" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 300, color: "#403a3c", marginBottom: "3rem", letterSpacing: "0.5px", animationDelay: "0.6s" }}>
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
            <Col md={6}>
              <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem" }}>
                Nuestra Historia
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              <div style={{ marginTop: "2rem" }}>
                {historia.map((item, idx) => (
                  <div key={idx} style={customStyles.timelineItem}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#23102d", marginBottom: "0.5rem" }}>
                      {item.año}
                    </h3>
                    <p style={{ fontFamily: "'Roboto', sans-serif", color: "#403a3c", lineHeight: 1.6 }}>
                      {item.evento}
                    </p>
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Misión Section */}
      <section style={customStyles.misionSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", marginBottom: "1.5rem" }}>
            Nuestra Misión
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          
          <Row className="g-4">
            <Col md={4}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>
                    Misión
                  </h3>
                  <p style={{ fontFamily: "'Roboto', sans-serif", color: "#403a3c", lineHeight: 1.6 }}>
                    Preservar y modernizar las técnicas artesanales huastecas, creando piezas únicas que celebren nuestra herencia cultural mientras apoyamos a las comunidades artesanas.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>
                    Visión
                  </h3>
                  <p style={{ fontFamily: "'Roboto', sans-serif", color: "#403a3c", lineHeight: 1.6 }}>
                    Ser reconocidos como el referente en moda artesanal huasteca, combinando tradición y diseño contemporáneo para llevar nuestra cultura al mundo.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="h-100" style={customStyles.card}>
                <Card.Body>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.5rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>
                    Filosofía
                  </h3>
                  <p style={{ fontFamily: "'Roboto', sans-serif", color: "#403a3c", lineHeight: 1.6 }}>
                    Cada puntada cuenta una historia, cada diseño honra una tradición. Creemos en la moda con propósito y el comercio justo como pilares fundamentales.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Equipo Section */}
      <section style={customStyles.equipoSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem" }}>
            Nuestro Equipo
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontFamily: "'Roboto', sans-serif", fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#403a3c", maxWidth: "800px", margin: "0 auto 3rem" }}>
            Conoce al equipo apasionado que da vida a La Aterciopelada
          </p>
          
          <Row className="g-4">
            {equipo.map((miembro, idx) => (
              <Col md={4} key={idx}>
                <Card className="h-100" style={customStyles.card}>
                  <Card.Body className="text-center">
                    <Image 
                      src={miembro.imagen} 
                      alt={miembro.nombre} 
                      style={customStyles.teamImage}
                    />
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#23102d", marginBottom: "0.5rem" }}>
                      {miembro.nombre}
                    </h3>
                    <p style={{ fontFamily: "'Roboto', sans-serif", color: "#ff4060", fontWeight: "500", marginBottom: "1rem" }}>
                      {miembro.rol}
                    </p>
                    <p style={{ fontFamily: "'Roboto', sans-serif", color: "#403a3c", lineHeight: 1.6 }}>
                      {miembro.bio}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Valores Section */}
      <section style={customStyles.valoresSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", marginBottom: "1.5rem" }}>
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
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>
                      {valor.titulo}
                    </h3>
                    <p style={{ fontFamily: "'Roboto', sans-serif", color: "#403a3c", lineHeight: 1.6 }}>
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
        <Container style={{ ...customStyles.section, position: "relative", zIndex: 2, textAlign: "center" }}>
          <h2 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#ffffff", marginBottom: "1rem", animationDelay: "0.3s" }}>
            Únete a Nuestra Comunidad
          </h2>
          <p className="animate-in" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#ffffff", opacity: 0.75, maxWidth: "700px", margin: "0 auto 2rem", animationDelay: "0.5s" }}>
            Descubre la belleza de la artesanía huasteca y forma parte de esta tradición
          </p>
          <Button className="animate-in" style={{ ...customStyles.pinkButton, animationDelay: "0.7s" }} onClick={() => navigate("/contacto")}>
            Contáctanos
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Nosotros;