import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import "bootstrap-icons/font/bootstrap-icons.min.css";
import stylesPublic from "../../styles/stylesPublic";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    details: false,
    info: false,
  });

  useEffect(() => {
    // Obtener producto desde la API
    fetch(`http://localhost:5000/api/public/productos/${id}`)
      .then(res => res.json())
      .then(data => {
        setProducto(data);
        setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
        setTimeout(() => setIsVisible(prev => ({ ...prev, details: true })), 300);
        setTimeout(() => setIsVisible(prev => ({ ...prev, info: true })), 600);
      })
      .catch(() => {
        navigate('/productos');
      });
  }, [id, navigate]);

  // CSS usando exclusivamente tokens del sistema refactorizado
  const cssStyles = `
    .animate-in {
      animation: fadeInUp ${stylesPublic.animations.duration.slowest} forwards;
    }
    
    @keyframes fadeInUp {
      from { 
        opacity: 0; 
        transform: translateY(${stylesPublic.spacing.scale[8]}); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .product-image {
        height: ${stylesPublic.spacing.scale[100]} !important;
      }
      .product-title {
        font-size: ${stylesPublic.typography.scale.xl} !important;
      }
      .info-grid {
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[4]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .product-container {
        padding: ${stylesPublic.spacing.scale[4]} !important;
        border-radius: ${stylesPublic.borders.radius.lg} !important;
      }
      .product-image {
        height: ${stylesPublic.spacing.scale[75]} !important;
      }
      .product-title {
        font-size: ${stylesPublic.typography.scale.lg} !important;
        margin-bottom: ${stylesPublic.spacing.scale[2]} !important;
      }
      .info-grid {
        grid-template-columns: 1fr !important;
        gap: ${stylesPublic.spacing.scale[2]} !important;
      }
      .info-item {
        padding: ${stylesPublic.spacing.scale[2]} !important;
        border-radius: ${stylesPublic.borders.radius.md} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .product-container {
        padding: ${stylesPublic.spacing.scale[3]} !important;
        border-radius: ${stylesPublic.borders.radius.md} !important;
      }
      .product-image {
        height: ${stylesPublic.spacing.scale[75]} !important;
      }
    }
  `;

  if (!producto) {
    return (
      <>
        <style>{cssStyles}</style>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: stylesPublic.colors.surface.secondary
        }}>
          <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </>
    );
  }

  const customStyles = {
    heroSection: {
      background: stylesPublic.colors.gradients.hero,
      padding: `${stylesPublic.spacing.scale[20]} 0 ${stylesPublic.spacing.scale[10]}`,
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
    productContainer: {
      maxWidth: stylesPublic.utils.container.maxWidth['2xl'],
      margin: stylesPublic.spacing.margins.auto,
      padding: stylesPublic.spacing.scale[8],
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.xl,
      boxShadow: stylesPublic.shadows.lg,
      opacity: isVisible.details ? 1 : 0,
      transform: isVisible.details ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.slow,
    },
    imageContainer: {
      position: "relative",
      overflow: "hidden",
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows.lg,
      transition: stylesPublic.animations.transitions.base,
    },
    image: {
      width: "100%",
      height: stylesPublic.spacing.scale[125],
      objectFit: "cover",
      transition: stylesPublic.animations.transitions.transform,
    },
    title: {
      ...stylesPublic.typography.headings.h2,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[4],
    },
    description: {
      ...stylesPublic.typography.body.large,
      color: stylesPublic.colors.text.secondary,
      marginBottom: stylesPublic.spacing.scale[6],
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
      gap: stylesPublic.spacing.scale[6],
      marginBottom: stylesPublic.spacing.scale[6],
      opacity: isVisible.info ? 1 : 0,
      transform: isVisible.info ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.slow,
    },
    infoItem: {
      ...stylesPublic.components.card.base,
      backgroundColor: stylesPublic.colors.surface.secondary,
      padding: stylesPublic.spacing.scale[4],
      borderRadius: stylesPublic.borders.radius.lg,
      borderLeft: `${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[500]}`,
      transition: stylesPublic.animations.transitions.base,
    },
    infoLabel: {
      ...stylesPublic.typography.body.caption,
      fontWeight: stylesPublic.typography.weights.bold,
      color: stylesPublic.colors.secondary[500],
      marginBottom: stylesPublic.spacing.scale[1],
      textTransform: "uppercase",
    },
    infoValue: {
      ...stylesPublic.typography.body.base,
      color: stylesPublic.colors.text.secondary,
    },
    backButton: {
      ...stylesPublic.components.button.variants.primary,
      ...stylesPublic.components.button.sizes.lg,
      marginTop: stylesPublic.spacing.scale[4],
      display: 'inline-flex',
      alignItems: 'center',
      gap: stylesPublic.spacing.scale[2],
    }
  };

  return (
    <>
      <style>{cssStyles}</style>
      
      <div style={{ 
        backgroundColor: stylesPublic.colors.surface.secondary, 
        minHeight: "100vh" 
      }}>
        {/* Hero Section */}
        <section style={customStyles.heroSection}>
          <div style={customStyles.heroOverlay}></div>
          <Container style={{ 
            position: "relative", 
            zIndex: stylesPublic.utils.zIndex.docked 
          }}>
            <div style={{ textAlign: "center" }}>
              <h1 style={{
                ...stylesPublic.typography.headings.h1,
                color: stylesPublic.colors.text.primary,
                marginBottom: stylesPublic.spacing.scale[4]
              }}>
                Detalle del Producto
              </h1>
              <div style={{
                display: 'block',
                width: stylesPublic.spacing.scale[20],
                height: stylesPublic.spacing.scale[1],
                background: stylesPublic.colors.gradients.accent,
                borderRadius: stylesPublic.borders.radius.sm,
                margin: `${stylesPublic.spacing.scale[4]} auto`,
              }}></div>
            </div>
          </Container>
        </section>

        {/* Product Details */}
        <Container style={{ 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.base, 
          marginBottom: stylesPublic.spacing.scale[20] 
        }}>
          <div className="product-container" style={customStyles.productContainer}>
            <Row className="align-items-center">
              <Col lg={6} className="mb-5 mb-lg-0">
                <div 
                  style={customStyles.imageContainer}
                  className="animate-in"
                  onMouseOver={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1.05)';
                  }}
                  onMouseOut={(e) => {
                    const img = e.currentTarget.querySelector('img');
                    if (img) img.style.transform = 'scale(1)';
                  }}
                >
                  <Image
                    src={producto.imagenURL}
                    alt={producto.nombre}
                    fluid
                    className="product-image"
                    style={customStyles.image}
                  />
                </div>
              </Col>

              <Col lg={6}>
                <h1 className="product-title" style={customStyles.title}>
                  {producto.nombre}
                </h1>
                <p style={customStyles.description}>
                  {producto.descripcion}
                </p>

                <div className="info-grid" style={customStyles.infoGrid}>
                  <div 
                    className="info-item"
                    style={customStyles.infoItem}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`;
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.md;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.sm;
                    }}
                  >
                    <div style={customStyles.infoLabel}>Localidad</div>
                    <div style={customStyles.infoValue}>
                      {producto.localidadId?.nombre || 'No especificada'}
                    </div>
                  </div>

                  <div 
                    className="info-item"
                    style={customStyles.infoItem}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`;
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.md;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.sm;
                    }}
                  >
                    <div style={customStyles.infoLabel}>Tipo de Tela</div>
                    <div style={customStyles.infoValue}>
                      {producto.tipoTela || 'No especificado'}
                    </div>
                  </div>

                  <div 
                    className="info-item"
                    style={customStyles.infoItem}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`;
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.md;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.sm;
                    }}
                  >
                    <div style={customStyles.infoLabel}>Tallas Disponibles</div>
                    <div style={customStyles.infoValue}>
                      {producto.tallasDisponibles?.map(td => td.talla).join(", ") || 'No especificadas'}
                    </div>
                  </div>

                  <div 
                    className="info-item"
                    style={customStyles.infoItem}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`;
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.md;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.sm;
                    }}
                  >
                    <div style={customStyles.infoLabel}>Categorías</div>
                    <div style={customStyles.infoValue}>
                      {producto.tallasDisponibles?.map(td => td.categoriaId?.nombre).filter(Boolean).join(", ") || 'No especificadas'}
                    </div>
                  </div>
                </div>

                <Button 
                  style={customStyles.backButton}
                  onClick={() => navigate('/productos')}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`;
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.glow;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.primary;
                  }}
                >
                  <i className="bi bi-arrow-left"></i>
                  Volver a Productos
                </Button>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default ProductoDetalle;