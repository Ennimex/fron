import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import productos from "../../services/base";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    details: false,
    info: false,
    cta: false,
  });

  useEffect(() => {
    const productoEncontrado = productos.find(p => p._id === id);
    if (productoEncontrado) {
      setProducto(productoEncontrado);
      // Animaciones escalonadas como en Inicio.js
      setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
      setTimeout(() => setIsVisible(prev => ({ ...prev, details: true })), 300);
      setTimeout(() => setIsVisible(prev => ({ ...prev, info: true })), 600);
      setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 900);
    } else {
      navigate('/productos');
    }
  }, [id, navigate]);

  if (!producto) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#F5E8C7'
    }}>
      Cargando...
    </div>;
  }

  const customStyles = {
    heroSection: {
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
      padding: "80px 0 40px",
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
    productContainer: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)",
      opacity: isVisible.details ? 1 : 0,
      transform: isVisible.details ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    imageContainer: {
      position: "relative",
      overflow: "hidden",
      borderRadius: "12px",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
    },
    image: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
      transition: "transform 0.5s ease",
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(2rem, 4vw, 2.8rem)",
      fontWeight: 600,
      color: "#23102d",
      marginBottom: "1.5rem",
    },
    description: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.1rem",
      color: "#403a3c",
      lineHeight: "1.7",
      marginBottom: "2rem",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: "20px",
      marginBottom: "2rem",
      opacity: isVisible.info ? 1 : 0,
      transform: isVisible.info ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out 0.3s",
    },
    infoItem: {
      backgroundColor: "#FFF8E1",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      transition: "all 0.3s ease",
      borderLeft: "3px solid #ff4060",
    },
    infoLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#1f8a80",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
    },
    infoValue: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1rem",
      color: "#403a3c",
    },
    ctaSection: {
      background: `linear-gradient(135deg, #ff8090 0%, #1f8a80 100%)`,
      padding: "40px 20px",
      borderRadius: "15px",
      marginTop: "40px",
      textAlign: "center",
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
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
  };

  return (
    <div style={{ backgroundColor: "#F5E8C7", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container>
        </Container>
      </section>

      {/* Product Details */}
      <Container style={{ position: "relative", zIndex: 2 }}>
        <div style={customStyles.productContainer}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div 
                style={customStyles.imageContainer}
                className="animate-in"
              >
                <Image
                  src={producto.image}
                  alt={producto.title}
                  fluid
                  style={customStyles.image}
                />
              </div>
            </Col>

            <Col lg={6}>
              <h1 style={customStyles.title}>{producto.title}</h1>
              <p style={customStyles.description}>{producto.description}</p>

              <div style={customStyles.infoGrid}>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Categoría</div>
                  <div style={customStyles.infoValue}>{producto.category}</div>
                </div>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Material</div>
                  <div style={customStyles.infoValue}>{producto.material}</div>
                </div>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Color</div>
                  <div style={customStyles.infoValue}>{producto.color}</div>
                </div>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Tallas</div>
                  <div style={customStyles.infoValue}>{producto.talla.join(", ")}</div>
                </div>
              </div>

              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/productos')}
                style={{ 
                  backgroundColor: "#ff4060",
                  borderColor: "#ff4060",
                  borderRadius: "30px",
                  padding: "12px 30px",
                  fontWeight: "500",
                  fontSize: "1.1rem",
                  marginTop: "20px",
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver a Productos
              </Button>
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div style={customStyles.ctaSection}>
          <div style={customStyles.ctaOverlay}></div>
          <Container style={{ position: "relative", zIndex: 2 }}>
            <h2 style={{ 
              fontFamily: "'Playfair Display', serif", 
              fontSize: "clamp(1.8rem, 3vw, 2.5rem)", 
              fontWeight: 600, 
              color: "#ffffff", 
              marginBottom: "1rem" 
            }}>
              ¿Te encanta este diseño?
            </h2>
            <p style={{ 
              fontSize: "1.1rem", 
              color: "#ffffff", 
              maxWidth: "700px", 
              margin: "0 auto 2rem",
              opacity: 0.9
            }}>
              También podemos crearlo a tu medida con los colores y detalles que prefieras.
            </p>
            <Button 
              variant="outline-light" 
              size="lg"
              style={{ 
                borderRadius: "30px",
                padding: "12px 30px",
                fontWeight: "500",
                fontSize: "1.1rem",
              }}
            >
              <i className="bi bi-chat-square-text me-2"></i>
              Solicitar personalización
            </Button>
          </Container>
        </div>
      </Container>
    </div>
  );
};

export default ProductoDetalle;