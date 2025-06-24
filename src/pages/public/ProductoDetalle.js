import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import stylesPublic from "../../styles/stylesPublic"; // Importamos el sistema centralizado de estilos

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);  const [isVisible, setIsVisible] = useState({
    hero: false,
    details: false,
    info: false,
  });

  useEffect(() => {
    // Obtener producto desde la API
    fetch(`http://localhost:5000/api/public/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);        setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
        setTimeout(() => setIsVisible(prev => ({ ...prev, details: true })), 300);
        setTimeout(() => setIsVisible(prev => ({ ...prev, info: true })), 600);
      })
      .catch(() => {
        navigate('/productos');
      });
  }, [id, navigate]);
  if (!producto) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: stylesPublic.colors.background.alt
    }}>
      Cargando...
    </div>;
  }

  const customStyles = {
    heroSection: {
      background: stylesPublic.colors.background.gradient.primary,
      padding: "80px 0 40px",
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: stylesPublic.transitions.preset.pageIn,
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: stylesPublic.elements.backgroundPatterns.floral,
      opacity: 0.8,
      zIndex: stylesPublic.utils.zIndex.background,
    },
    productContainer: {
      maxWidth: stylesPublic.utils.container.maxWidth,
      margin: stylesPublic.spacing.margin.auto,
      padding: stylesPublic.spacing.section.small,
      backgroundColor: stylesPublic.colors.background.main,
      borderRadius: stylesPublic.borders.radius.xl,
      boxShadow: stylesPublic.shadows.card,      opacity: isVisible.details ? 1 : 0,
      transform: isVisible.details ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.pageIn,
    },
    imageContainer: {
      position: "relative",
      overflow: "hidden",
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows.lg,
      transition: stylesPublic.transitions.preset.default,
    },
    image: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
      transition: "transform 0.5s ease",
    },
    title: {
      fontFamily: stylesPublic.typography.fontFamily.heading,
      fontSize: stylesPublic.typography.fontSize.h2,
      fontWeight: stylesPublic.typography.fontWeight.semiBold,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.md,
    },
    description: {
      fontFamily: stylesPublic.typography.fontFamily.body,
      fontSize: stylesPublic.typography.fontSize.p,
      color: stylesPublic.colors.text.secondary,
      lineHeight: stylesPublic.typography.lineHeight.paragraph,
      marginBottom: stylesPublic.spacing.lg,
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: stylesPublic.spacing.gap.lg,
      marginBottom: stylesPublic.spacing.lg,
      opacity: isVisible.info ? 1 : 0,
      transform: isVisible.info ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.pageIn,
    },    infoItem: {
      backgroundColor: stylesPublic.colors.background.alt,
      padding: stylesPublic.spacing.md,
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows.md,
      transition: stylesPublic.transitions.preset.default,
      borderLeft: `${stylesPublic.borders.width.thick} solid ${stylesPublic.colors.primary.light}`,
    },
    infoLabel: {
      fontFamily: stylesPublic.typography.fontFamily.body,
      fontSize: stylesPublic.typography.fontSize.small,
      fontWeight: stylesPublic.typography.fontWeight.bold,
      color: stylesPublic.colors.secondary.main,
      marginBottom: stylesPublic.spacing.xs,
      textTransform: "uppercase",
    },    infoValue: {
      fontFamily: stylesPublic.typography.fontFamily.body,
      fontSize: stylesPublic.typography.fontSize.md,
      color: stylesPublic.colors.text.secondary,
    },
  };
  return (
    <div style={{ backgroundColor: stylesPublic.colors.background.alt, minHeight: "100vh" }}>
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container>
        </Container>
      </section>      {/* Product Details */}
      <Container style={{ position: "relative", zIndex: 2, marginBottom: "80px" }}>
        <div style={customStyles.productContainer}>
          <Row className="align-items-center">
            <Col lg={6} className="mb-5 mb-lg-0">
              <div 
                style={customStyles.imageContainer}
                className="animate-in"
              >
                <Image
                  src={producto.imagenURL}
                  alt={producto.nombre}
                  fluid
                  style={customStyles.image}
                />
              </div>
            </Col>

            <Col lg={6}>
              <h1 style={customStyles.title}>{producto.nombre}</h1>
              <p style={customStyles.description}>{producto.descripcion}</p>

              <div style={customStyles.infoGrid}>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Localidad</div>
                  <div style={customStyles.infoValue}>{producto.localidadId?.nombre}</div>
                </div>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Tela</div>
                  <div style={customStyles.infoValue}>{producto.tipoTela}</div>
                </div>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Tallas</div>
                  <div style={customStyles.infoValue}>
                    {producto.tallasDisponibles?.map(td => td.talla).join(", ")}
                  </div>
                </div>
                <div style={customStyles.infoItem}>
                  <div style={customStyles.infoLabel}>Categorías</div>
                  <div style={customStyles.infoValue}>
                    {producto.tallasDisponibles?.map(td => td.categoriaId?.nombre).filter(Boolean).join(", ")}
                  </div>
                </div>
              </div>              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => navigate('/productos')}
                style={{ 
                  backgroundColor: stylesPublic.colors.primary.light,
                  borderColor: stylesPublic.colors.primary.light,
                  borderRadius: stylesPublic.borders.radius.button,
                  padding: stylesPublic.spacing.sm + " " + stylesPublic.spacing.lg,
                  fontWeight: stylesPublic.typography.fontWeight.medium,
                  fontSize: stylesPublic.typography.fontSize.lg,
                  marginTop: stylesPublic.spacing.md,
                }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                Volver a Productos
              </Button>            </Col>
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default ProductoDetalle;