import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import productos from '../../services/base';

const Inicio = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    reasons: false,
    regions: false,
    clothing: false,
    collections: false,
    comments: false,
    cta: false,
  });
  const [comentarios, setComentarios] = useState([]);
  const [comentarioTexto, setComentarioTexto] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    checkAuth();

    // Obtener categorías únicas y su información
    const categoriasUnicas = [...new Set(productos.map(p => p.category))];
    const categoriasData = categoriasUnicas.map(categoria => {
      const productosCategoria = productos.filter(p => p.category === categoria);
      return {
        nombre: categoria,
        cantidad: productosCategoria.length,
        imagen: productosCategoria[0]?.image || '',
        descripcion: `Colección de ${categoria.toLowerCase()} con detalles artesanales únicos`,
      };
    });
    setCategorias(categoriasData);

    // Animaciones
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, reasons: true })), 500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, regions: true })), 900);
    setTimeout(() => setIsVisible(prev => ({ ...prev, clothing: true })), 1300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, collections: true })), 1500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, comments: true })), 1700);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 2100);
  }, []);

  const handleSubmitComentario = (e) => {
    e.preventDefault();
    if (!comentarioTexto.trim()) return;
    const nuevoComentario = {
      id: Date.now(),
      texto: comentarioTexto,
      fecha: new Date(),
      usuario: "Usuario actual",
    };
    setComentarios([nuevoComentario, ...comentarios]);
    setComentarioTexto('');
  };

  // Actualizar clothingItems con datos reales y agregar manejo de clicks
  const clothingItems = categorias.map(cat => ({
    image: cat.imagen,
    name: cat.nombre,
    description: cat.descripcion,
    onClick: () => navigate(`/productos?categoria=${cat.nombre}`),
  }));

  const reasons = [
    { name: "Calidad Artesanal", description: "Cada pieza es elaborada a mano por maestras artesanas, garantizando una calidad excepcional y atención al detalle." },
    { name: "Exclusividad", description: "Ofrecemos diseños únicos que combinan tradición y modernidad, perfectos para quienes buscan piezas irrepetibles." },
    { name: "Sostenibilidad", description: "Nuestros procesos respetan el medio ambiente, utilizando materiales naturales y apoyando comunidades locales." },
    { name: "Conexión Cultural", description: "Cada creación celebra la rica herencia huasteca, conectándote con siglos de historia y tradición." },
  ];

  const regions = [
    { name: "Huasteca Potosina", description: "Cuna de técnicas ancestrales donde cada puntada cuenta la historia de generaciones de maestras artesanas." },
    { name: "Huasteca Veracruzana", description: "Paleta cromática rica en matices naturales que captura la esencia tropical de la región." },
    { name: "Huasteca Hidalguense", description: "Precisión geométrica en patrones que reflejan la arquitectura cultural de pueblos originarios." },
    { name: "Huasteca Tamaulipas", description: "Convergencia de influencias que enriquecen nuestra identidad textil contemporánea." },
  ];

  // Actualizar clothingItems con datos reales
  const collections = [
    { icon: "👗", title: "Alta Costura Tradicional", description: "Piezas únicas de vestimenta ceremonial y cotidiana, donde cada bordado narra historias ancestrales." },
    { icon: "✨", title: "Accesorios de Autor", description: "Complementos exclusivos que elevan cualquier atuendo, desde rebozos hasta joyería textil." },
    { icon: "🏡", title: "Decoración Artesanal", description: "Textiles para el hogar que transforman espacios en refugios de calidez cultural." },
    { icon: "🎨", title: "Arte Textil Coleccionable", description: "Obras maestras de terciopelada destinadas a coleccionistas que aprecian la excelencia artesanal." },
    { icon: "👶", title: "Herencia Infantil", description: "Piezas delicadas para las nuevas generaciones, sembrando el amor por la tradición." },
    { icon: "🌟", title: "Fusión Moderna", description: "Reinterpretación contemporánea de técnicas milenarias para el guardarropa urbano." },
  ];

  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
      50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
    }
    .animate-in { animation: fadeInUp 0.8s forwards; }
    .reason-card, .region-card, .clothing-card, .collection-card {
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid rgba(232, 180, 184, 0.15);
    }
    .reason-card:hover, .region-card:hover, .clothing-card:hover, .collection-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(255, 0, 112, 0.35), 0 10px 20px rgba(31, 138, 128, 0.25), 0 6px 12px rgba(44, 35, 41, 0.18);
      border-color: #ff4060;
    }
    .reason-card:nth-child(1), .clothing-card:nth-child(1), .region-card:nth-child(1), .collection-card:nth-child(1) { border-left: 3px solid #ff0070; }
    .reason-card:nth-child(2), .clothing-card:nth-child(2), .region-card:nth-child(2), .collection-card:nth-child(2) { border-left: 3px solid #1f8a80; }
    .reason-card:nth-child(3), .clothing-card:nth-child(3), .region-card:nth-child(3), .collection-card:nth-child(3) { border-left: 3px solid #ff1030; }
    .reason-card:nth-child(4), .clothing-card:nth-child(4), .region-card:nth-child(4), .collection-card:nth-child(4) { border-left: 3px solid #8840b8; }
    .clothing-image { transition: transform 0.3s ease; }
    .clothing-card:hover .clothing-image { transform: scale(1.05); }
    .collection-icon { transition: transform 0.3s ease; }
    .collection-card:hover .collection-icon { transform: scale(1.1); }
    .floating-element {
      position: fixed;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
    }
    .floating-element:nth-child(1) { top: 20%; left: 10%; background: #ff0070; }
    .floating-element:nth-child(2) { top: 60%; right: 15%; background: #1f8a80; animation-delay: 2s; }
    .floating-element:nth-child(3) { bottom: 30%; left: 20%; background: #ff1030; animation-delay: 4s; }
  `;

  const customStyles = {
    heroSection: {
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
      height: "85vh",
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
    reasonsSection: {
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`,
      opacity: isVisible.reasons ? 1 : 0,
      transform: isVisible.reasons ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    regionsSection: {
      background: `linear-gradient(135deg, #FFD1BA 0%, #F8B4C4 100%)`,
      opacity: isVisible.regions ? 1 : 0,
      transform: isVisible.regions ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    regionsOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="huasteca-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><polygon points="15,15 20,25 10,25" fill="%23ff0070" opacity="0.45"/><polygon points="35,25 40,35 30,35" fill="%231f8a80" opacity="0.4"/><rect x="25" y="10" width="10" height="10" transform="rotate(45 30 15)" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23huasteca-pattern)"/></svg>')`,
      opacity: 0.8,
      zIndex: 1,
    },
    clothingSection: {
      opacity: isVisible.clothing ? 1 : 0,
      transform: isVisible.clothing ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`,
    },
    collectionsSection: {
      background: `linear-gradient(135deg, #FFD1BA 0%, #F8B4C4 100%)`,
      opacity: isVisible.collections ? 1 : 0,
      transform: isVisible.collections ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    collectionsOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="huasteca-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><polygon points="15,15 20,25 10,25" fill="%23ff0070" opacity="0.45"/><polygon points="35,25 40,35 30,35" fill="%231f8a80" opacity="0.4"/><rect x="25" y="10" width="10" height="10" transform="rotate(45 30 15)" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23huasteca-pattern)"/></svg>')`,
      opacity: 0.8,
      zIndex: 1,
    },
    commentsSection: {
      opacity: isVisible.comments ? 1 : 0,
      transform: isVisible.comments ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`,
    },
    ctaSection: {
      background: `linear-gradient(135deg, #ff8090 0%, #1f8a80 100%)`,
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
    },
    ctaOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 30% 40%, #FFF8E1 0%, rgba(245,232,199,0) 50%)`,
      zIndex: 1,
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
    collectionIcon: {
      width: "70px",
      height: "70px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "1.8rem",
      color: "#ffffff",
      boxShadow: "0 8px 24px rgba(232, 180, 184, 0.45)",
    },
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="floating-elements" style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ position: "relative", zIndex: 2, maxWidth: "900px", padding: "4rem 2rem" }}>
          <h1 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(3rem, 6vw, 5rem)", fontWeight: 700, color: "#23102d", marginBottom: "1.5rem", letterSpacing: "-0.02em", lineHeight: 1.1, animationDelay: "0.3s" }}>
            La Aterciopelada
          </h1>
          <div className="animate-in" style={{ width: "80px", height: "2px", background: "linear-gradient(90deg, #ff0070, #1f8a80, transparent)", margin: "0 auto 2rem", animationDelay: "0.9s" }}></div>
          <p className="animate-in" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", fontWeight: 300, color: "#403a3c", marginBottom: "3rem", letterSpacing: "0.5px", animationDelay: "0.6s" }}>
            Boutique Huasteca · Tradición Artesanal Refinada
          </p>
          <Button className="animate-in" style={{ ...customStyles.pinkButton, animationDelay: "1.2s" }} onClick={() => navigate("/productos")}>
            Explorar Colección
          </Button>
        </Container>
      </section>

      {/* Reasons Section */}
      <section style={customStyles.reasonsSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem", position: "relative" }}>
            ¿Por qué elegir La Aterciopelada?
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#403a3c", maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
            Sumérgete en la pasión y el arte de la artesanía huasteca
          </p>
          <Row className="g-4">
            {reasons.map((reason, idx) => (
              <Col md={6} lg={3} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="reason-card h-100 shadow" style={{ background: "#ffffff", borderRadius: "12px", padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)" }}>
                  <Card.Body>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{reason.name}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#403a3c", lineHeight: 1.6, fontWeight: 400 }}>{reason.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Regions Section */}
      <section style={customStyles.regionsSection}>
        <div style={customStyles.regionsOverlay}></div>
        <Container style={{ ...customStyles.section, position: "relative", zIndex: 2 }}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem", position: "relative" }}>
            Raíces de Tradición
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
            Explora la herencia cultural que inspira nuestras creaciones
          </p>
          <Row className="g-4">
            {regions.map((region, idx) => (
              <Col md={6} lg={3} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="region-card h-100 shadow" style={{ background: "#ffffff", borderRadius: "12px", padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)" }}>
                  <Card.Body>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{region.name}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#403a3c", lineHeight: 1.6, fontWeight: 400 }}>{region.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Clothing Categories Section */}
      <section style={customStyles.clothingSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem", position: "relative" }}>
            Categorías de Ropa
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#403a3c", maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
            Descubre piezas únicas tejidas con la esencia de la tradición huasteca
          </p>
          <Row className="g-4">
            {clothingItems.map((item, idx) => (
              <Col md={6} lg={3} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="clothing-card h-100 shadow" style={{ background: "#ffffff", borderRadius: "12px", padding: "2.5rem 2rem", textAlign: "center", boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)" }}>
                  <Card.Img variant="top" src={item.image} alt={item.name} className="clothing-image" style={{ maxWidth: "200px", height: "150px", objectFit: "cover", borderRadius: "8px", margin: "0 auto 1.5rem" }} />
                  <Card.Body>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem", letterSpacing: "-0.01em" }}>{item.name}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#403a3c", lineHeight: 1.6, fontWeight: 400 }}>{item.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Collections Section */}
      <section style={customStyles.collectionsSection}>
        <div style={customStyles.collectionsOverlay}></div>
        <Container style={{ ...customStyles.section, position: "relative", zIndex: 2 }}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem", position: "relative" }}>
            Colecciones Selectas
            <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#ffffff", textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)", maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
            Viste la historia, abraza la artesanía
          </p>
          <Row className="g-4">
            {collections.map((collection, idx) => (
              <Col md={6} lg={4} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="collection-card h-100 shadow" style={{ background: "#ffffff", borderRadius: "16px", padding: "3rem 2.5rem", boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)" }}>
                  <Card.Body className="text-center">
                    <div className="collection-icon" style={{ ...customStyles.collectionIcon, background: idx === 0 ? "linear-gradient(135deg, #ff0070, #ff1030)" : idx === 1 ? "linear-gradient(135deg, #1f8a80, #8840b8)" : idx === 2 ? "linear-gradient(135deg, #ff1030, #ff0070)" : idx === 3 ? "linear-gradient(135deg, #8840b8, #23102d)" : idx === 4 ? "linear-gradient(135deg, #1f8a80, #ff1030)" : "linear-gradient(135deg, #ff0070, #1f8a80)" }}>
                      {collection.icon}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>{collection.title}</h3>
                    <p style={{ fontSize: "0.95rem", color: "#403a3c", lineHeight: 1.7, fontWeight: 400 }}>{collection.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Comments Section */}
      <section style={customStyles.commentsSection}>
        <Container style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#23102d", marginBottom: "1.5rem", position: "relative" }}>
            Comentarios de la Comunidad
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#403a3c", maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
            Comparte tu experiencia con nuestra comunidad artesanal
          </p>
          {isLoggedIn ? (
            <Card className="mb-5 shadow-sm" style={{ background: "rgba(255,255,255,0.9)", borderRadius: "12px", border: "none" }}>
              <Card.Body className="p-4">
                <form onSubmit={handleSubmitComentario}>
                  <div className="d-flex align-items-start mb-3">
                    <div className="me-3">
                      <div style={{ width: "45px", height: "45px", borderRadius: "50%", background: "#ff4060", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <i className="bi bi-person-circle fs-4"></i>
                      </div>
                    </div>
                    <textarea
                      className="form-control border-0 shadow-none"
                      rows="3"
                      placeholder="¿Qué te pareció tu experiencia con nosotros?"
                      value={comentarioTexto}
                      onChange={(e) => setComentarioTexto(e.target.value)}
                      style={{ backgroundColor: "#f8f9fa", resize: "none", fontSize: "1.1rem" }}
                    ></textarea>
                  </div>
                  <div className="d-flex justify-content-between align-items-center">
                    <div style={{ fontSize: "0.9rem", color: "#403a3c" }}>
                      <i className="bi bi-info-circle me-1"></i>
                      Tu comentario será visible para toda la comunidad
                    </div>
                    <Button type="submit" style={customStyles.pinkButton} className="rounded-pill px-4 py-2">
                      <i className="bi bi-send-fill me-2"></i>
                      Publicar comentario
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          ) : (
            <Card className="text-center mb-5 shadow-sm" style={{ background: "rgba(255,255,255,0.9)", borderRadius: "12px", border: "none" }}>
              <Card.Body className="p-5">
                <div className="mb-4">
                  <i className="bi bi-chat-quote display-4" style={{ color: "#ff4060" }}></i>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.4rem", fontWeight: 600, color: "#23102d", marginBottom: "1rem" }}>¡Únete a la conversación!</h3>
                <p style={{ fontSize: "1.1rem", color: "#403a3c", marginBottom: "1.5rem" }}>
                  Inicia sesión para compartir tu experiencia con la comunidad artesanal
                </p>
                <Button style={customStyles.pinkButton} className="rounded-pill px-5 py-3" onClick={() => navigate("/login")}>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </Button>
              </Card.Body>
            </Card>
          )}
          <Row className="g-4">
            {comentarios.map((comentario) => (
              <Col lg={4} md={6} key={comentario.id} className="animate-in" style={{ animationDelay: "0.2s" }}>
                <Card className="h-100 shadow-sm" style={{ background: "rgba(255,255,255,0.9)", borderRadius: "12px", border: "none" }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-center mb-3">
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#ff4060", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", marginRight: "1rem" }}>
                        <i className="bi bi-person"></i>
                      </div>
                      <div>
                        <h6 style={{ fontFamily: "'Playfair Display', serif", marginBottom: 0, color: "#23102d" }}>{comentario.usuario}</h6>
                        <small style={{ color: "#403a3c" }}>
                          {new Date(comentario.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                      </div>
                    </div>
                    <p style={{ color: "#403a3c", marginBottom: 0 }}>{comentario.texto}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section style={customStyles.ctaSection}>
        <div style={customStyles.ctaOverlay}></div>
        <Container style={{ ...customStyles.section, position: "relative", zIndex: 2, textAlign: "center" }}>
          <h2 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: "#ffffff", marginBottom: "1rem", animationDelay: "0.3s" }}>
            Celebra la Tradición Huasteca
          </h2>
          <p className="animate-in" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: "#ffffff", opacity: 0.75, maxWidth: "700px", margin: "0 auto 2rem", animationDelay: "0.5s" }}>
            Únete a nuestra comunidad y descubre piezas artesanales únicas
          </p>
          <Button className="animate-in" style={{ ...customStyles.pinkButton, animationDelay: "0.7s" }} onClick={() => navigate("/login?register=true")}>
            Regístrate
          </Button>
          <p className="animate-in" style={{ fontSize: "0.9rem", color: "#ffffff", opacity: 0.75, marginTop: "1rem", animationDelay: "0.9s" }}>
            <i className="bi bi-shield-check me-2"></i>
            Tu información está segura con nosotros.
          </p>
        </Container>
      </section>
    </>
  );
};

export default Inicio;