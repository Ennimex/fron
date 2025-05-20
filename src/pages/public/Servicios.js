import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Image, Badge } from 'react-bootstrap';

// Iconos para los servicios de danza folclórica
const ServiceIcons = {
  clases: "💃",
  alquiler: "👗",
  coreografia: "🎭",
  eventos: "🎉",
  talleres: "📚",
  calidad: "⭐",
  atencion: "👥",
  pasion: "❤️",
  accesibilidad: "🌟",
};

// Paleta de colores inspirada en la Huasteca
const colors = {
  deepRed: '#A91B0D',
  vibrantYellow: '#FFC107',
  emeraldGreen: '#2E7D32',
  turquoise: '#26A69A',
  warmBeige: '#F5E8C7',
  darkGrey: '#4A4A4A',
};

const textStyles = {
  title: { fontFamily: "'Roboto', sans-serif", fontWeight: 'bold' },
  subtitle: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  paragraph: { fontFamily: "'Roboto', sans-serif", fontWeight: 400 },
};

const layout = { sectionPadding: { padding: '50px 0' } };

const buttons = {
  primary: {
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const Servicios = () => {
  // Estados para animaciones y efectos interactivos
  const [animate, setAnimate] = useState(false);
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  // Activar animaciones al cargar el componente
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Estilos optimizados
  const styles = {
    section: { 
      marginBottom: '70px',
      position: 'relative',
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`,
      padding: '80px 0',
      color: colors.warmBeige,
      marginBottom: '50px',
      position: 'relative',
      overflow: 'hidden',
    },
    heroPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `radial-gradient(${colors.warmBeige} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.1,
    },
    card: {
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      height: '100%',
      border: 'none',
      backgroundColor: colors.warmBeige,
    },
    benefitCard: {
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      height: '100%',
      border: 'none',
      backgroundColor: colors.turquoise,
      color: colors.warmBeige,
      overflow: 'hidden',
      position: 'relative',
    },
    image: { 
      borderRadius: '10px', 
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.5s ease',
    },
    imageContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '10px',
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
    },
    title: { 
      ...textStyles.title, 
      color: colors.warmBeige, 
      fontSize: '48px', 
      marginBottom: '25px', 
      fontWeight: 800,
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    },
    subtitle: { 
      ...textStyles.subtitle, 
      position: 'relative', 
      paddingBottom: '15px', 
      marginBottom: '25px',
      transition: 'color 0.3s ease',
      color: colors.deepRed,
    },
    paragraph: { 
      ...textStyles.paragraph, 
      fontSize: '17px', 
      lineHeight: '1.7',
      color: colors.darkGrey,
    },
    badge: {
      backgroundColor: colors.vibrantYellow,
      color: colors.warmBeige,
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginBottom: '15px',
    },
    heroSubtitle: {
      ...textStyles.paragraph, 
      color: colors.warmBeige, 
      fontSize: '20px', 
      maxWidth: '700px', 
      margin: '0 auto', 
      opacity: animate ? 0.9 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
    },
    fadeIn: (delay = 0) => ({
      opacity: animate ? 1 : 0, 
      transition: `opacity 0.8s ease ${delay}s`,
    }),
    slideUp: (delay = 0) => ({
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }),
    slideRight: (delay = 0) => ({
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateX(0)' : 'translateX(-20px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }),
    slideLeft: (delay = 0) => ({
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateX(0)' : 'translateX(20px)',
      transition: `opacity 0.8s ease ${delay}s, transform 0.8s ease ${delay}s`,
    }),
    listItem: {
      marginBottom: '15px',
      paddingLeft: '5px',
    },
  };

  // Datos para servicios de danza folclórica
  const serviciosData = [
    {
      id: 'clases',
      titulo: 'Clases de Danza Folclórica',
      descripcion: 'Ofrecemos clases de danza folclórica huasteca para todos los niveles y edades, impartidas por expertos:',
      listItems: [
        {
          titulo: 'Danzas Tradicionales Huastecas',
          descripcion: 'Aprende sones huastecos y danzas tradicionales de la región.'
        },
        {
          titulo: 'Técnicas de Zapateado',
          descripcion: 'Domina el zapateado característico del estilo huasteco.'
        },
        {
          titulo: 'Danza para Niños y Adultos',
          descripcion: 'Clases adaptadas para diferentes edades y niveles de experiencia.'
        },
      ],
      imagen: "https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940",
    },
    {
      id: 'alquiler',
      titulo: 'Alquiler de Trajes Folclóricos',
      descripcion: 'Facilitamos tu preparación para eventos con nuestro servicio de alquiler de trajes huastecos:',
      listItems: [
        {
          titulo: 'Trajes Tradicionales',
          descripcion: 'Huipiles y faldas con bordados artesanales, disponibles en varias tallas.'
        },
        {
          titulo: 'Accesorios Folclóricos',
          descripcion: 'Alquila tocados, rebozos y joyería tradicional para completar tu atuendo.'
        },
      ],
      imagen: 'https://images.unsplash.com/photo-1612903351440-147fb1e94e48?q=80&w=2940',
    },
    {
      id: 'coreografia',
      titulo: 'Coreografía Folclórica Personalizada',
      descripcion: 'Creamos coreografías únicas para festivales, presentaciones o competencias huastecas:',
      listItems: [
        {
          titulo: 'Coreografías para Solistas y Grupos',
          descripcion: 'Rutinas que resaltan la riqueza cultural de la Huasteca.'
        },
        {
          titulo: 'Preparación para Festivales',
          descripcion: 'Entrenamiento para destacar en eventos culturales y competencias regionales.'
        },
      ],
      imagen: 'https://images.unsplash.com/photo-1595957882097-3f7db803ed93?q=80&w=2940',
    },
    {
      id: 'eventos',
      titulo: 'Organización de Eventos Folclóricos',
      descripcion: 'Organizamos eventos de danza folclórica en Huejutla de Reyes, Hidalgo, para celebrar la cultura huasteca. Desde festivales hasta presentaciones, nuestro equipo cuida cada detalle.',
      listItems: [],
      imagen: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
    },
    {
      id: 'talleres',
      titulo: 'Talleres Culturales',
      descripcion: 'Ofrecemos talleres para profundizar en la cultura huasteca a través de la danza:',
      listItems: [
        {
          titulo: 'Historia de la Danza Huasteca',
          descripcion: 'Explora el contexto cultural e histórico de las danzas tradicionales.'
        },
        {
          titulo: 'Taller de Bordado y Vestimenta',
          descripcion: 'Aprende sobre los bordados y la confección de trajes huastecos.'
        },
      ],
      imagen: 'https://images.unsplash.com/photo-1605733160314-4fc7dac4b611?q=80&w=2940',
    },
  ];

  // Datos para beneficios
  const benefitsData = [
    { 
      id: 'calidad',
      title: "Autenticidad Cultural", 
      content: "Nuestros servicios celebran la rica tradición huasteca con trajes y danzas auténticas.",
    },
    { 
      id: 'atencion',
      title: "Atención Personalizada", 
      content: "Cada cliente recibe un servicio adaptado a sus necesidades culturales y artísticas.",
    },
    { 
      id: 'pasion',
      title: "Pasión por la Huasteca", 
      content: "Nuestra misión es preservar y compartir el amor por la danza folclórica huasteca.",
    },
    { 
      id: 'accesibilidad',
      title: "Accesibilidad Cultural", 
      content: "Ofrecemos servicios inclusivos para que todos puedan disfrutar de la danza huasteca.",
    },
  ];

  // Función para renderizar cards de beneficios con animación optimizada
  const renderBenefitCards = useCallback(() => {
    return benefitsData.map((item, index) => (
      <Col md={3} key={index} className="mb-4 mb-md-0">
        <div 
          style={{ 
            ...styles.slideUp(0.5 + (index * 0.1)),
            height: '100%',
          }}
          onMouseEnter={() => setHoveredCard(index)}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <Card 
            style={{
              ...styles.benefitCard,
              transform: hoveredCard === index ? 'translateY(-10px)' : 'translateY(0)',
              boxShadow: hoveredCard === index ? '0 10px 25px rgba(0, 0, 0, 0.2)' : '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Card.Body className="d-flex flex-column">
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '15px',
                transition: 'transform 0.3s ease',
                transform: hoveredCard === index ? 'scale(1.1)' : 'scale(1)',
              }}>
                {ServiceIcons[item.id]}
              </div>
              <Card.Title style={{ 
                fontFamily: textStyles.title.fontFamily, 
                fontSize: '20px', 
                fontWeight: 'bold', 
                marginBottom: '15px',
                borderBottom: `2px solid ${colors.warmBeige}`,
                paddingBottom: '10px',
              }}>
                {item.title}
              </Card.Title>
              <Card.Text style={{ fontSize: '16px', lineHeight: '1.6', flex: 1 }}>
                {item.content}
              </Card.Text>
              {hoveredCard === index && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '5px',
                    background: `linear-gradient(to right, ${colors.deepRed}, ${colors.emeraldGreen})`,
                  }}
                />
              )}
            </Card.Body>
          </Card>
        </div>
      </Col>
    ));
  }, [hoveredCard, animate, styles]);

  // Función para renderizar servicios con animación optimizada
  const renderServicios = useCallback(() => {
    return serviciosData.map((servicio, index) => {
      const isEven = index % 2 === 0;

      return (
        <Row
          className="align-items-center"
          style={{ 
            ...styles.section,
            paddingTop: index > 0 ? '20px' : '0',
          }}
          key={servicio.id}
        >
          <Col md={6} className={`mb-4 mb-md-0 ${isEven ? 'order-md-1' : 'order-md-2'}`}>
            <div 
              style={{ 
                ...styles.imageContainer,
                ...styles[isEven ? 'slideLeft' : 'slideRight'](0.2 + (index * 0.05)),
              }}
              onMouseEnter={() => setHoveredService(servicio.id)}
              onMouseLeave={() => setHoveredService(null)}
            >
              <Image
                src={servicio.imagen}
                alt={servicio.titulo}
                fluid
                style={{
                  ...styles.image,
                  transform: hoveredService === servicio.id ? 'scale(1.05)' : 'scale(1)',
                }}
              />
              {hoveredService === servicio.id && (
                <div 
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`,
                    padding: '30px 20px 15px',
                    transform: 'translateY(0)',
                    transition: 'transform 0.5s ease',
                  }}
                >
                  <h4 style={{ color: colors.warmBeige, marginBottom: '5px' }}>
                    <span style={{ marginRight: '10px' }}>{ServiceIcons[servicio.id]}</span>
                    {servicio.titulo}
                  </h4>
                  <p style={{ color: colors.warmBeige, marginBottom: 0, fontSize: '14px' }}>
                    Conoce más sobre este servicio
                  </p>
                </div>
              )}
            </div>
          </Col>

          <Col md={6} className={isEven ? 'order-md-2' : 'order-md-1'}>
            <div style={styles[isEven ? 'slideRight' : 'slideLeft'](0.3 + (index * 0.05))}>
              <h2 style={{
                ...styles.subtitle,
                color: hoveredService === servicio.id ? colors.emeraldGreen : colors.deepRed,
              }}>
                {servicio.titulo}
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '60px',
                  height: '4px',
                  backgroundColor: colors.vibrantYellow,
                  transition: 'width 0.3s ease',
                  width: hoveredService === servicio.id ? '100px' : '60px',
                }}></span>
              </h2>
              <p style={styles.paragraph}>
                {servicio.descripcion}
              </p>
              {servicio.listItems.length > 0 && (
                <ul style={{ paddingLeft: '20px' }}>
                  {servicio.listItems.map((item, idx) => (
                    <li key={idx} style={styles.listItem}>
                      <div style={{
                        transition: 'transform 0.3s ease',
                        transform: hoveredService === servicio.id ? 'translateX(5px)' : 'translateX(0)',
                      }}>
                        <strong>{item.titulo}:</strong> {item.descripcion}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <button 
                style={{
                  ...buttons.primary,
                  marginTop: '20px',
                  padding: '10px 20px',
                  fontSize: '15px',
                  backgroundColor: colors.deepRed,
                  color: colors.warmBeige,
                  transition: 'all 0.3s ease',
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'translateY(0)' : 'translateY(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.emeraldGreen;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.deepRed;
                }}
              >
                <span style={{ position: 'relative', zIndex: 2 }}>Solicitar información</span>
                <span 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                    transition: 'left 0.5s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.left = '100%';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.left = '-100%';
                  }}
                ></span>
              </button>
            </div>
          </Col>
        </Row>
      );
    });
  }, [hoveredService, animate, styles]);

  return (
    <div style={{ backgroundColor: colors.warmBeige, color: colors.deepRed }}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <Container>
          <Row className="text-center">
            <Col>
              <h1 style={styles.title}>Nuestros Servicios de Danza Folclórica Huasteca</h1>
              <p style={styles.heroSubtitle}>
                En nuestra escuela en Huejutla de Reyes, Hidalgo, celebramos la tradición huasteca con servicios que inspiran y fortalecen la danza folclórica.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={layout.sectionPadding}>
        {/* Secciones de servicios */}
        {renderServicios()}

        {/* ¿Por Qué Elegirnos? */}
        <div style={{...styles.section, marginTop: '50px'}}>
          <Row className="text-center mb-5">
            <Col>
              <h2 style={{
                ...styles.subtitle,
                display: 'inline-block',
                ...styles.fadeIn(0.5),
              }}>
                ¿Por Qué Elegirnos?
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: colors.vibrantYellow,
                }}></span>
              </h2>
            </Col>
          </Row>
          <Row className="g-4">
            {renderBenefitCards()}
          </Row>
        </div>
        
        {/* Llamado a la acción */}
        <div 
          style={{
            ...styles.fadeIn(0.8),
            marginTop: '50px',
            padding: '40px',
            borderRadius: '10px',
            background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`,
            color: colors.warmBeige,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
          }}></div>
          
          <h3 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            marginBottom: '20px',
            position: 'relative',
          }}>¿Listo para celebrar la danza huasteca?</h3>
          
          <p style={{
            fontSize: '18px',
            maxWidth: '800px',
            margin: '0 auto 25px',
            position: 'relative',
          }}>
            Únete a nuestra comunidad y descubre cómo preservar y compartir la tradición huasteca. Contáctanos hoy.
          </p>
          
          <button style={{
            backgroundColor: 'transparent',
            border: `2px solid ${colors.warmBeige}`,
            color: colors.warmBeige,
            padding: '12px 30px',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: textStyles.fontPrimary,
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.warmBeige;
            e.currentTarget.style.color = colors.deepRed;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.warmBeige;
          }}
          >
            Solicitar información
          </button>
        </div>
      </Container>
    </div>
  );
};

export default Servicios;