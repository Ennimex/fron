import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import productos from '../../services/base';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaMountain, FaWater, FaLeaf, FaTree, FaUmbrellaBeach, FaCity, FaMonument, FaSeedling, FaLandmark, FaMapMarkedAlt } from 'react-icons/fa';
import stylesPublic from '../../styles/stylesPublic';

const Inicio = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  const [localidades, setLocalidades] = useState([]);
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
  const { user } = useAuth();
  const isAuthenticated = user && user.isAuthenticated;
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLocalidades, setIsLoadingLocalidades] = useState(true);

  // Función para obtener un icono consistente basado en el nombre de la localidad
  const getLocalidadIcon = (nombre) => {
    const hash = nombre.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    const iconos = [
      { icon: <FaMountain size={32} />, color: stylesPublic.colors.gradients.primary },
      { icon: <FaWater size={32} />, color: stylesPublic.colors.gradients.secondary },
      { icon: <FaLeaf size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.main}, ${stylesPublic.colors.semantic.success.light})` },
      { icon: <FaTree size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.neutral[800]}, ${stylesPublic.colors.neutral[600]})` },
      { icon: <FaUmbrellaBeach size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.warning.main}, ${stylesPublic.colors.semantic.warning.light})` },
      { icon: <FaCity size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.neutral[600]}, ${stylesPublic.colors.neutral[400]})` },
      { icon: <FaMonument size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.neutral[700]}, ${stylesPublic.colors.neutral[500]})` },
      { icon: <FaLandmark size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.secondary[600]}, ${stylesPublic.colors.secondary[400]})` },
      { icon: <FaSeedling size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.success.dark}, ${stylesPublic.colors.semantic.success.main})` },
      { icon: <FaMapMarkedAlt size={32} />, color: `linear-gradient(135deg, ${stylesPublic.colors.semantic.info.main}, ${stylesPublic.colors.semantic.info.light})` }
    ];
    
    return iconos[hash % iconos.length];
  };

  useEffect(() => {
    const regions = [
      { nombre: "Huasteca Potosina", descripcion: "Cuna de técnicas ancestrales donde cada puntada cuenta la historia de generaciones de maestras artesanas." },
      { nombre: "Huasteca Veracruzana", descripcion: "Paleta cromática rica en matices naturales que captura la esencia tropical de la región." },
      { nombre: "Huasteca Hidalguense", descripcion: "Precisión geométrica en patrones que reflejan la arquitectura cultural de pueblos originarios." },
      { nombre: "Huasteca Tamaulipas", descripcion: "Convergencia de influencias que enriquecen nuestra identidad textil contemporánea." },
    ];

    const cargarCategorias = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:5000/api/public/categorias');
        
        if (response.data && response.data.length > 0) {
          const categoriasData = response.data.map(categoria => ({
            nombre: categoria.nombre,
            cantidad: categoria.productos?.length || 0,
            imagen: categoria.imagenURL || '',
            descripcion: categoria.descripcion || `Colección de ${categoria.nombre.toLowerCase()} con detalles artesanales únicos`,
          }));
          setCategorias(categoriasData);
        } else {
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
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error);
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
      } finally {
        setIsLoading(false);
      }
    };

    const cargarLocalidades = async () => {
      try {
        setIsLoadingLocalidades(true);
        const response = await axios.get('http://localhost:5000/api/public/localidades');
        
        if (response.data && response.data.length > 0) {
          setLocalidades(response.data);
        } else {
          setLocalidades(regions);
        }
      } catch (error) {
        console.error("Error al cargar localidades:", error);
        setLocalidades(regions);
      } finally {
        setIsLoadingLocalidades(false);
      }
    };

    cargarCategorias();
    cargarLocalidades();
    
    // Animaciones progresivas
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

  const collections = [
    { icon: "👗", title: "Alta Costura Tradicional", description: "Piezas únicas de vestimenta ceremonial y cotidiana, donde cada bordado narra historias ancestrales." },
    { icon: "✨", title: "Accesorios de Autor", description: "Complementos exclusivos que elevan cualquier atuendo, desde rebozos hasta joyería textil." },
  ];

  // CSS con tokens del sistema refactorizado
  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(${stylesPublic.spacing.scale[8]}); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes float {
      0%, 100% { 
        transform: translateY(0px) scale(1); 
        opacity: 0.6; 
      }
      50% { 
        transform: translateY(-${stylesPublic.spacing.scale[5]}) scale(1.2); 
        opacity: 0.8; 
      }
    }
    
    .animate-in { 
      animation: fadeInUp ${stylesPublic.animations.duration.slowest} forwards; 
    }
    
    .reason-card, .region-card, .clothing-card, .collection-card {
      transition: ${stylesPublic.animations.transitions.base};
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
      border-radius: ${stylesPublic.borders.radius.lg};
    }
    
    .reason-card:hover, .region-card:hover, .clothing-card:hover, .collection-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[3]});
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[500]};
    }
    
    .reason-card:nth-child(1), .clothing-card:nth-child(1), .region-card:nth-child(1), .collection-card:nth-child(1) { 
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[500]}; 
    }
    .reason-card:nth-child(2), .clothing-card:nth-child(2), .region-card:nth-child(2), .collection-card:nth-child(2) { 
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.secondary[500]}; 
    }
    .reason-card:nth-child(3), .clothing-card:nth-child(3), .region-card:nth-child(3), .collection-card:nth-child(3) { 
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[700]}; 
    }
    .reason-card:nth-child(4), .clothing-card:nth-child(4), .region-card:nth-child(4), .collection-card:nth-child(4) { 
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.secondary[700]}; 
    }
    
    .clothing-image { 
      transition: ${stylesPublic.animations.transitions.transform}; 
    }
    .clothing-card:hover .clothing-image { 
      transform: scale(1.05); 
    }
    
    .collection-icon { 
      transition: ${stylesPublic.animations.transitions.transform}; 
    }
    .collection-card:hover .collection-icon { 
      transform: scale(1.1); 
    }
    
    .floating-element {
      position: fixed;
      width: ${stylesPublic.spacing.scale[1]};
      height: ${stylesPublic.spacing.scale[1]};
      border-radius: ${stylesPublic.borders.radius.full};
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
      pointer-events: none;
    }
    
    .floating-element:nth-child(1) { 
      top: 20%; 
      left: 10%; 
      background: ${stylesPublic.colors.primary[500]}; 
    }
    .floating-element:nth-child(2) { 
      top: 60%; 
      right: 15%; 
      background: ${stylesPublic.colors.secondary[500]}; 
      animation-delay: 2s; 
    }
    .floating-element:nth-child(3) { 
      bottom: 30%; 
      left: 20%; 
      background: ${stylesPublic.colors.primary[700]}; 
      animation-delay: 4s; 
    }
    
    /* Responsividad */
    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .reason-card, .region-card, .clothing-card, .collection-card {
        margin-bottom: ${stylesPublic.spacing.scale[4]};
      }
      .clothing-image {
        max-width: 150px !important;
        height: 120px !important;
      }
      .floating-element {
        display: none;
      }
    }
    
    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .reason-card, .region-card, .clothing-card, .collection-card {
        padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[4]} !important;
        margin-bottom: ${stylesPublic.spacing.scale[3]};
      }
      .clothing-image {
        max-width: 120px !important;
        height: 100px !important;
      }
      .collection-card {
        padding: ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[6]} !important;
      }
    }
    
    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .reason-card, .region-card, .clothing-card, .collection-card {
        padding: ${stylesPublic.spacing.scale[4]} !important;
        text-align: center;
      }
      .clothing-image {
        max-width: 100px !important;
        height: 80px !important;
      }
    }
  `;

  // Estilos usando tokens del sistema refactorizado
  const styles = {
    heroSection: {
      background: stylesPublic.colors.gradients.hero,
      height: "85vh",
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
      backdropFilter: "blur(2px)",
      opacity: 0.3,
      pointerEvents: 'none',
      zIndex: 1,
    },
    section: {
      padding: stylesPublic.spacing.sections.lg,
      maxWidth: stylesPublic.utils.container.maxWidth['2xl'],
      margin: stylesPublic.spacing.margins.auto,
      position: "relative",
    },
    reasonsSection: {
      background: stylesPublic.colors.gradients.warm,
      opacity: isVisible.reasons ? 1 : 0,
      transform: isVisible.reasons ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    regionsSection: {
      background: stylesPublic.colors.gradients.secondary,
      opacity: isVisible.regions ? 1 : 0,
      transform: isVisible.regions ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    regionsOverlay: {
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
    clothingSection: {
      opacity: isVisible.clothing ? 1 : 0,
      transform: isVisible.clothing ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
      background: stylesPublic.colors.gradients.warm,
    },
    collectionsSection: {
      background: stylesPublic.colors.gradients.primary,
      opacity: isVisible.collections ? 1 : 0,
      transform: isVisible.collections ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
    },
    collectionsOverlay: {
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
    commentsSection: {
      opacity: isVisible.comments ? 1 : 0,
      transform: isVisible.comments ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
      background: stylesPublic.colors.gradients.warm,
    },
    ctaSection: {
      background: stylesPublic.colors.gradients.accent,
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
      position: "relative",
    },
    ctaOverlay: stylesPublic.utils.overlay.blur,
    titleUnderline: {
      display: 'block',
      width: stylesPublic.spacing.scale[20],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.sm,
      margin: `${stylesPublic.spacing.scale[4]} auto`,
    },
    whiteUnderline: {
      background: stylesPublic.colors.neutral[0],
      boxShadow: stylesPublic.shadows.sm,
    },
  };

  return (
    <>
      <style>{animationStyles}</style>
      
      {/* Elementos flotantes decorativos */}
      <div style={{ 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%", 
        height: "100%", 
        pointerEvents: "none", 
        zIndex: stylesPublic.utils.zIndex.hide 
      }}>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
        <div className="floating-element"></div>
      </div>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <Container style={{ 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.base, 
          maxWidth: stylesPublic.utils.container.maxWidth.lg, 
          padding: stylesPublic.spacing.scale[8]
        }}>
          <h1 className="animate-in" style={{ 
            ...stylesPublic.typography.headings.h1,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            animationDelay: "0.3s" 
          }}>
            La Aterciopelada
          </h1>
          <div className="animate-in" style={{ 
            ...styles.titleUnderline,
            animationDelay: "0.9s" 
          }}></div>
          <p className="animate-in" style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            marginBottom: stylesPublic.spacing.scale[12], 
            animationDelay: "0.6s" 
          }}>
            Boutique Huasteca · Tradición Artesanal Refinada
          </p>
          <Button 
            className="animate-in" 
            style={{ 
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.lg,
              animationDelay: "1.2s" 
            }} 
            onClick={() => navigate("/productos")}
          >
            Explorar Colección
          </Button>
        </Container>
      </section>

      {/* Reasons Section */}
      <section style={styles.reasonsSection}>
        <Container style={styles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            ¿Por qué elegir La Aterciopelada?
            <span style={styles.titleUnderline}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Sumérgete en la pasión y el arte de la artesanía huasteca
          </p>
          <Row className="g-4">
            {reasons.map((reason, idx) => (
              <Col md={6} lg={3} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="reason-card h-100" style={{
                  ...stylesPublic.components.card.base,
                  padding: stylesPublic.spacing.scale[8]
                }}>
                  <Card.Body>
                    <h3 style={{ 
                      ...stylesPublic.typography.headings.h4,
                      color: stylesPublic.colors.text.primary, 
                      marginBottom: stylesPublic.spacing.scale[4]
                    }}>
                      {reason.name}
                    </h3>
                    <p style={{ 
                      ...stylesPublic.typography.body.small,
                      color: stylesPublic.colors.text.secondary
                    }}>
                      {reason.description}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Regions/Localidades Section */}
      <section style={styles.regionsSection}>
        <div style={styles.regionsOverlay}></div>
        <Container style={{ ...styles.section, position: "relative", zIndex: stylesPublic.utils.zIndex.docked }}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Localidades de la Huasteca
            <span style={{ ...styles.titleUnderline, ...styles.whiteUnderline }}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.inverse, 
            textShadow: stylesPublic.shadows.sm, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Descubre la riqueza cultural que inspira nuestras creaciones artesanales
          </p>
          
          {isLoadingLocalidades ? (
            <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[12] }}>
              <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.text.inverse }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p style={{ 
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.inverse,
                marginTop: stylesPublic.spacing.scale[3]
              }}>
                Cargando localidades...
              </p>
            </div>
          ) : localidades.length > 0 ? (
            <Row className="g-4">
              {localidades.map((localidad, idx) => {
                const { icon, color } = getLocalidadIcon(localidad.nombre);
                return (
                  <Col 
                    md={6} 
                    lg={localidades.length <= 3 ? 4 : 3} 
                    key={localidad._id || idx} 
                    className="animate-in" 
                    style={{ animationDelay: `${0.2 * idx}s` }}
                  >
                    <Card 
                      className="region-card h-100" 
                      style={{ 
                        ...stylesPublic.components.card.base,
                        ...stylesPublic.components.card.interactive,
                        padding: stylesPublic.spacing.scale[8]
                      }}
                      onClick={() => navigate(`/productos?localidad=${localidad.nombre}`)}
                    >
                      <Card.Body style={{ textAlign: "center" }}>
                        <div style={{ 
                          width: stylesPublic.spacing.scale[16],
                          height: stylesPublic.spacing.scale[16],
                          borderRadius: stylesPublic.borders.radius.full,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: color,
                          color: stylesPublic.colors.text.inverse,
                          margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
                          boxShadow: stylesPublic.shadows.brand.primary
                        }}>
                          {icon}
                        </div>
                        <h3 style={{ 
                          ...stylesPublic.typography.headings.h4,
                          color: stylesPublic.colors.text.primary, 
                          marginBottom: stylesPublic.spacing.scale[4]
                        }}>
                          {localidad.nombre}
                        </h3>
                        <p style={{ 
                          ...stylesPublic.typography.body.small,
                          color: stylesPublic.colors.text.secondary
                        }}>
                          {localidad.descripcion}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          ) : (
            <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[16] }}>
              <div style={{ 
                fontSize: stylesPublic.typography.scale["4xl"], 
                color: stylesPublic.colors.text.inverse, 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                <i className="bi bi-geo-alt"></i>
              </div>
              <h3 style={{ 
                ...stylesPublic.typography.headings.h3,
                color: stylesPublic.colors.text.inverse, 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                No se encontraron localidades
              </h3>
              <p style={{ 
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.inverse, 
                opacity: 0.8 
              }}>
                Estamos trabajando para agregar nuevas localidades pronto.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Clothing Categories Section */}
      <section style={styles.clothingSection}>
        <Container style={styles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Categorías de Ropa
            <span style={styles.titleUnderline}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Descubre piezas únicas tejidas con la esencia de la tradición huasteca
          </p>
          
          {isLoading ? (
            <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[12] }}>
              <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p style={{ 
                ...stylesPublic.typography.body.base,
                marginTop: stylesPublic.spacing.scale[3]
              }}>
                Cargando categorías...
              </p>
            </div>
          ) : clothingItems.length > 0 ? (
            <Row className="g-4">
              {clothingItems.map((item, idx) => (
                <Col 
                  md={6} 
                  lg={clothingItems.length <= 3 ? 4 : 3} 
                  key={idx} 
                  className="animate-in" 
                  style={{ animationDelay: `${0.2 * idx}s` }}
                >
                  <Card 
                    className="clothing-card h-100" 
                    style={{ 
                      ...stylesPublic.components.card.base,
                      ...stylesPublic.components.card.interactive,
                      padding: stylesPublic.spacing.scale[10],
                      textAlign: "center" 
                    }}
                    onClick={item.onClick}
                  >
                    <Card.Img 
                      variant="top" 
                      src={item.image || 'https://via.placeholder.com/200x150?text=Sin+Imagen'} 
                      alt={item.name} 
                      className="clothing-image" 
                      style={{ 
                        maxWidth: "200px", 
                        height: "150px", 
                        objectFit: "cover", 
                        borderRadius: stylesPublic.borders.radius.md, 
                        margin: `0 auto ${stylesPublic.spacing.scale[6]}` 
                      }} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/200x150?text=Imagen+No+Disponible';
                      }}
                    />
                    <Card.Body>
                      <h3 style={{ 
                        ...stylesPublic.typography.headings.h4,
                        color: stylesPublic.colors.text.primary, 
                        marginBottom: stylesPublic.spacing.scale[4]
                      }}>
                        {item.name}
                      </h3>
                      <p style={{ 
                        ...stylesPublic.typography.body.small,
                        color: stylesPublic.colors.text.secondary
                      }}>
                        {item.description}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[16] }}>
              <div style={{ 
                fontSize: stylesPublic.typography.scale["4xl"], 
                color: stylesPublic.colors.primary[500], 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                <i className="bi bi-emoji-frown"></i>
              </div>
              <h3 style={{ 
                ...stylesPublic.typography.headings.h3,
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.scale[4] 
              }}>
                No se encontraron categorías
              </h3>
              <p style={{ 
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.secondary 
              }}>
                Estamos trabajando para agregar nuevas categorías pronto.
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* Collections Section */}
      <section style={styles.collectionsSection}>
        <div style={styles.collectionsOverlay}></div>
        <Container style={{ ...styles.section, position: "relative", zIndex: stylesPublic.utils.zIndex.docked }}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Colecciones Selectas
            <span style={{ ...styles.titleUnderline, ...styles.whiteUnderline }}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.inverse, 
            textShadow: stylesPublic.shadows.sm, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Viste la historia, abraza la artesanía
          </p>
          <Row className="g-4">
            {collections.map((collection, idx) => (
              <Col md={6} lg={4} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="collection-card h-100" style={{ 
                  ...stylesPublic.components.card.base,
                  padding: stylesPublic.spacing.scale[12],
                  textAlign: "center" 
                }}>
                  <Card.Body>
                    <div className="collection-icon" style={{ 
                      width: stylesPublic.spacing.scale[16],
                      height: stylesPublic.spacing.scale[16],
                      borderRadius: stylesPublic.borders.radius.full,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: idx === 0 ? stylesPublic.colors.gradients.primary : stylesPublic.colors.gradients.secondary,
                      boxShadow: stylesPublic.shadows.brand.primary,
                      margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
                      fontSize: stylesPublic.typography.scale["2xl"]
                    }}>
                      {collection.icon}
                    </div>
                    <h3 style={{ 
                      ...stylesPublic.typography.headings.h4,
                      color: stylesPublic.colors.text.primary, 
                      marginBottom: stylesPublic.spacing.scale[6]
                    }}>
                      {collection.title}
                    </h3>
                    <p style={{ 
                      ...stylesPublic.typography.body.small,
                      color: stylesPublic.colors.text.secondary
                    }}>
                      {collection.description}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Comments Section */}
      <section style={styles.commentsSection}>
        <Container style={styles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Comentarios de la Comunidad
            <span style={styles.titleUnderline}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Comparte tu experiencia con nuestra comunidad artesanal
          </p>
          
          {isAuthenticated ? (
            <Card style={{ 
              ...stylesPublic.components.card.base,
              background: stylesPublic.colors.surface.glass,
              marginBottom: stylesPublic.spacing.scale[12]
            }}>
              <Card.Body style={{ padding: stylesPublic.spacing.scale[6] }}>
                <form onSubmit={handleSubmitComentario}>
                  <div style={{ display: "flex", alignItems: "flex-start", marginBottom: stylesPublic.spacing.scale[3] }}>
                    <div style={{ marginRight: stylesPublic.spacing.scale[3] }}>
                      <div style={{ 
                        width: stylesPublic.spacing.scale[12], 
                        height: stylesPublic.spacing.scale[12], 
                        borderRadius: stylesPublic.borders.radius.full, 
                        background: stylesPublic.colors.primary[500], 
                        color: stylesPublic.colors.text.inverse, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center" 
                      }}>
                        <i className="bi bi-person-circle fs-4"></i>
                      </div>
                    </div>
                    <textarea
                      className="form-control border-0 shadow-none"
                      rows="3"
                      placeholder="¿Qué te pareció tu experiencia con nosotros?"
                      value={comentarioTexto}
                      onChange={(e) => setComentarioTexto(e.target.value)}
                      style={{ 
                        ...stylesPublic.components.input.base,
                        backgroundColor: stylesPublic.colors.surface.secondary, 
                        resize: "none" 
                      }}
                    />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ 
                      ...stylesPublic.typography.body.caption,
                      color: stylesPublic.colors.text.secondary 
                    }}>
                      <i className="bi bi-info-circle me-1"></i>
                      Tu comentario será visible para toda la comunidad
                    </div>
                    <Button 
                      type="submit" 
                      style={{ 
                        ...stylesPublic.components.button.variants.primary,
                        ...stylesPublic.components.button.sizes.base,
                        borderRadius: stylesPublic.borders.radius.full,
                        padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[6]}`
                      }}
                    >
                      <i className="bi bi-send-fill me-2"></i>
                      Publicar comentario
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          ) : (
            <Card style={{ 
              ...stylesPublic.components.card.base,
              background: stylesPublic.colors.surface.glass,
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[12]
            }}>
              <Card.Body style={{ padding: stylesPublic.spacing.scale[12] }}>
                <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                  <i className="bi bi-chat-quote display-4" style={{ color: stylesPublic.colors.primary[500] }}></i>
                </div>
                <h3 style={{ 
                  ...stylesPublic.typography.headings.h4,
                  color: stylesPublic.colors.text.primary, 
                  marginBottom: stylesPublic.spacing.scale[4] 
                }}>
                  ¡Únete a la conversación!
                </h3>
                <p style={{ 
                  ...stylesPublic.typography.body.base,
                  color: stylesPublic.colors.text.secondary, 
                  marginBottom: stylesPublic.spacing.scale[6] 
                }}>
                  Inicia sesión para compartir tu experiencia con la comunidad artesanal
                </p>
                <Button 
                  style={{ 
                    ...stylesPublic.components.button.variants.primary,
                    ...stylesPublic.components.button.sizes.lg,
                    borderRadius: stylesPublic.borders.radius.full,
                    padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[12]}`
                  }} 
                  onClick={() => navigate("/login")}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Iniciar Sesión
                </Button>
              </Card.Body>
            </Card>
          )}
          
          <Row className="g-4">
            {comentarios.map((comentario) => (
              <Col lg={4} md={6} key={comentario.id} className="animate-in" style={{ animationDelay: "0.2s" }}>
                <Card className="h-100" style={{ 
                  ...stylesPublic.components.card.base,
                  background: stylesPublic.colors.surface.glass
                }}>
                  <Card.Body style={{ padding: stylesPublic.spacing.scale[6] }}>
                    <div style={{ display: "flex", alignItems: "center", marginBottom: stylesPublic.spacing.scale[3] }}>
                      <div style={{ 
                        width: stylesPublic.spacing.scale[10], 
                        height: stylesPublic.spacing.scale[10], 
                        borderRadius: stylesPublic.borders.radius.full, 
                        background: stylesPublic.colors.primary[500], 
                        color: stylesPublic.colors.text.inverse, 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        marginRight: stylesPublic.spacing.scale[3] 
                      }}>
                        <i className="bi bi-person"></i>
                      </div>
                      <div>
                        <h6 style={{ 
                          ...stylesPublic.typography.headings.h6,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: 0 
                        }}>
                          {comentario.usuario}
                        </h6>
                        <small style={{ 
                          ...stylesPublic.typography.body.caption,
                          color: stylesPublic.colors.text.secondary 
                        }}>
                          {new Date(comentario.fecha).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                      </div>
                    </div>
                    <p style={{ 
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.secondary, 
                      marginBottom: 0 
                    }}>
                      {comentario.texto}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section - Solo se muestra si el usuario NO está autenticado */}
      {!isAuthenticated && (
        <section style={styles.ctaSection}>
          <div style={styles.ctaOverlay}></div>
          <Container style={{ 
            ...styles.section, 
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
              Celebra la Tradición Huasteca
            </h2>
            <p className="animate-in" style={{ 
              ...stylesPublic.typography.body.large,
              color: stylesPublic.colors.text.inverse, 
              opacity: 0.75, 
              maxWidth: "700px", 
              margin: `0 auto ${stylesPublic.spacing.scale[8]}`, 
              animationDelay: "0.5s" 
            }}>
              Únete a nuestra comunidad y descubre piezas artesanales únicas
            </p>
            <Button 
              className="animate-in" 
              style={{ 
                ...stylesPublic.components.button.variants.primary,
                ...stylesPublic.components.button.sizes.lg,
                animationDelay: "0.7s" 
              }} 
              onClick={() => navigate("/login?register=true")}
            >
              Regístrate
            </Button>
            <p className="animate-in" style={{ 
              ...stylesPublic.typography.body.small,
              color: stylesPublic.colors.text.inverse, 
              opacity: 0.75, 
              marginTop: stylesPublic.spacing.scale[4], 
              animationDelay: "0.9s" 
            }}>
              <i className="bi bi-shield-check me-2"></i>
              Tu información está segura con nosotros.
            </p>
          </Container>
        </section>
      )}
    </>
  );
};

export default Inicio;