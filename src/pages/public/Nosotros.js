import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

// Paleta de colores inspirada en la Huasteca
const colors = {
  deepRed: '#A91B0D',
  vibrantYellow: '#FFC107',
  emeraldGreen: '#2E7D32',
  turquoise: '#26A69A',
  warmBeige: '#F5E8C7',
  darkGrey: '#4A4A4A',
  white: '#FFFFFF',
};

const textStyles = {
  title: { fontFamily: "'Roboto', sans-serif", fontWeight: 'bold' },
  subtitle: { fontFamily: "'Roboto', sans-serif", fontWeight: 600 },
  paragraph: { fontFamily: "'Roboto', sans-serif", fontWeight: 400 },
  fontPrimary: "'Roboto', sans-serif",
};

const layout = { sectionPadding: { padding: '50px 0' } };

const buttons = {
  primary: {
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    color: colors.white,
  },
  secondary: {
    borderRadius: '5px',
    cursor: 'pointer',
  },
};

const Nosotros = () => {
  const [animate, setAnimate] = useState(false);
  
  // Efecto para activar animaciones al cargar el componente
  useEffect(() => {
    setAnimate(true);
  }, []);

  const styles = {
    section: { marginBottom: '70px' },
    card: {
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      border: 'none',
    },
    image: { 
      borderRadius: '10px', 
      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
      transition: 'transform 0.5s ease',
    },
    imageHover: {
      transform: 'scale(1.03)',
    },
    timelineItem: {
      position: 'relative',
      paddingLeft: '30px',
      marginBottom: '20px',
      borderLeft: `3px solid ${colors.vibrantYellow}`,
      transition: 'all 0.3s ease',
    },
    timelineItemHover: {
      borderLeft: `5px solid ${colors.emeraldGreen}`,
      paddingLeft: '35px',
      backgroundColor: `rgba(${parseInt(colors.vibrantYellow.slice(1, 3), 16)}, ${parseInt(colors.vibrantYellow.slice(3, 5), 16)}, ${parseInt(colors.vibrantYellow.slice(5, 7), 16)}, 0.05)`,
      borderRadius: '0 8px 8px 0',
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
      transition: 'all 0.3s ease',
      color: colors.deepRed,
    },
    subtitleHover: {
      color: colors.emeraldGreen,
    },
    paragraph: { 
      ...textStyles.paragraph, 
      fontSize: '17px', 
      lineHeight: '1.7',
      color: colors.darkGrey,
    },
    featureCard: {
      marginBottom: '20px',
      backgroundColor: `rgba(${parseInt(colors.vibrantYellow.slice(1, 3), 16)}, ${parseInt(colors.vibrantYellow.slice(3, 5), 16)}, ${parseInt(colors.vibrantYellow.slice(5, 7), 16)}, 0.1)`,
      padding: '15px 20px',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.vibrantYellow}`,
      transition: 'all 0.3s ease',
    },
    featureCardHover: {
      backgroundColor: `rgba(${parseInt(colors.vibrantYellow.slice(1, 3), 16)}, ${parseInt(colors.vibrantYellow.slice(3, 5), 16)}, ${parseInt(colors.vibrantYellow.slice(5, 7), 16)}, 0.15)`,
      borderLeft: `6px solid ${colors.emeraldGreen}`,
      transform: 'translateX(5px)',
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
    button: {
      ...buttons.primary,
      marginTop: '30px',
      padding: '12px 25px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: colors.deepRed,
      position: 'relative',
      overflow: 'hidden',
    },
    policySection: {
      padding: '40px 0',
      backgroundColor: `rgba(${parseInt(colors.warmBeige.slice(1, 3), 16)}, ${parseInt(colors.warmBeige.slice(3, 5), 16)}, ${parseInt(colors.warmBeige.slice(5, 7), 16)}, 0.1)`,
      marginTop: '50px',
      borderRadius: '10px',
    },
    policyButton: {
      ...buttons.secondary,
      backgroundColor: colors.deepRed,
      padding: '12px 25px',
      transition: 'all 0.3s ease',
      margin: '0 auto',
      display: 'block',
      border: `2px solid ${colors.deepRed}`,
      color: colors.warmBeige,
    },
  };

  const [hoveredTimeline, setHoveredTimeline] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [buttonHover, setButtonHover] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [policyButtonHover, setPolicyButtonHover] = useState(false);

  const timelineData = [
    { 
      year: '2015', 
      description: 'Fundación de la escuela de danza folclórica en Huejutla de Reyes, Hidalgo.',
      icon: '💃',
    },
    { 
      year: '2018', 
      description: 'Primera participación en el Festival Nacional de Danza Folclórica.',
      icon: '🎉',
    },
    { 
      year: '2023', 
      description: 'Reconocimiento como "Mejor Escuela de Danza Folclórica" en Hidalgo.',
      icon: '🏆',
    },
  ];

  const featuresData = [
    { 
      title: 'Autenticidad Cultural', 
      desc: 'Preservamos las tradiciones huastecas en cada danza y traje.',
      icon: '🌟',
    },
    { 
      title: 'Enseñanza Experta', 
      desc: 'Instructores con experiencia en danzas huastecas y zapateado.',
      icon: '👩‍🏫',
    },
    { 
      title: 'Comunidad Inclusiva', 
      desc: 'Acogemos a bailarines de todas las edades y niveles.',
      icon: '🤝',
    },
  ];

  return (
    <div style={{ backgroundColor: colors.warmBeige, color: colors.deepRed }}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <Container>
          <Row className="text-center">
            <Col>
              <h1 style={styles.title}>Nuestra Historia Huasteca</h1>
              <p 
                style={{ 
                  ...styles.paragraph, 
                  color: colors.warmBeige, 
                  fontSize: '20px', 
                  maxWidth: '700px', 
                  margin: '0 auto', 
                  opacity: animate ? 0.9 : 0,
                  transform: animate ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 1s ease, transform 1s ease',
                  transitionDelay: '0.2s',
                }}
              >
                Celebramos la danza folclórica huasteca con pasión y tradición.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={layout.sectionPadding}>
        {/* Historia de la escuela con imagen */}
        <Row className="align-items-center" style={styles.section}>
          <Col md={6} className="mb-4 mb-md-0">
            <div 
              style={{ 
                position: 'relative', 
                overflow: 'hidden', 
                borderRadius: '10px',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
              }}
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => setImageHover(false)}
            >
              <Image 
                src="https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940" 
                alt="Historia de la Escuela Huasteca" 
                fluid 
                style={{
                  ...styles.image,
                  transform: imageHover ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                }} 
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`,
                  padding: '30px 20px 15px',
                  transform: imageHover ? 'translateY(0)' : 'translateY(100%)',
                  transition: 'transform 0.5s ease',
                }}
              >
                <h4 style={{ color: colors.warmBeige, marginBottom: '5px' }}>Tradición desde el corazón</h4>
                <p style={{ color: colors.warmBeige, marginBottom: 0, fontSize: '14px' }}>
                  Nuestra escuela en Huejutla de Reyes, Hidalgo
                </p>
              </div>
            </div>
          </Col>
          <Col md={6}>
            <div 
              style={{ 
                opacity: animate ? 1 : 0, 
                transform: animate ? 'translateX(0)' : 'translateX(20px)',
                transition: 'opacity 0.8s ease, transform 0.8s ease',
              }}
            >
              <h2 style={styles.subtitle}>
                Nuestra Historia
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '60px', height: '4px', backgroundColor: colors.vibrantYellow }}></span>
              </h2>
              <p style={styles.paragraph}>
                La Escuela de Danza Folclórica Huasteca fue fundada en 2015 en Huejutla de Reyes, Hidalgo, México, con la misión de preservar y difundir la rica tradición de la danza huasteca. Desde nuestros inicios, hemos formado bailarines que celebran nuestra cultura con orgullo.
              </p>
              <div style={{ marginTop: '30px' }}>
                {timelineData.map((item, index) => (
                  <div 
                    key={index} 
                    style={{
                      ...styles.timelineItem,
                      ...(hoveredTimeline === index ? styles.timelineItemHover : {}),
                    }}
                    onMouseEnter={() => setHoveredTimeline(index)}
                    onMouseLeave={() => setHoveredTimeline(null)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                      <span style={{ marginRight: '10px', fontSize: '20px' }}>{item.icon}</span>
                      <h5 style={{ color: colors.deepRed, fontWeight: 600, margin: 0 }}>{item.year}</h5>
                    </div>
                    <p style={{ ...styles.paragraph, marginBottom: '0' }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* Misión, Visión y Valores */}
        <div style={styles.section}>
          <Row className="text-center mb-5">
            <Col>
              <h2 style={{
                ...textStyles.subtitle,
                position: 'relative',
                display: 'inline-block',
                paddingBottom: '15px',
                color: colors.deepRed,
              }}>
                Nuestra Filosofía
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
            {[
              { 
                title: "Misión", 
                color: colors.turquoise,
                content: "Preservar y difundir la danza folclórica huasteca, fomentando el amor por nuestra cultura a través de la enseñanza y la práctica.",
              },
              { 
                title: "Visión", 
                color: colors.emeraldGreen,
                content: "Ser un referente nacional en la enseñanza y promoción de la danza folclórica huasteca para 2030.",
              },
              { 
                title: "Valores", 
                color: colors.deepRed,
                content: [
                  "Autenticidad: Respetamos las tradiciones huastecas.",
                  "Pasión: Danzamos con el corazón.",
                  "Inclusión: Acogemos a todos los amantes de la danza.",
                  "Calidad: Ofrecemos enseñanza y trajes de excelencia.",
                ],
              },
            ].map((item, index) => (
              <Col md={4} key={index} className="mb-4 mb-md-0">
                <Card 
                  style={{
                    ...styles.card,
                    backgroundColor: item.color,
                    color: colors.warmBeige,
                  }}
                  className="hover-card"
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{
                      fontFamily: textStyles.title.fontFamily,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      borderBottom: `2px solid ${colors.warmBeige}`,
                      paddingBottom: '10px',
                    }}>
                      {item.title}
                    </Card.Title>
                    {Array.isArray(item.content) ? (
                      <ul style={{
                        textAlign: 'left',
                        paddingLeft: '20px',
                      }}>
                        {item.content.map((point, i) => (
                          <li key={i} style={{ marginBottom: '10px' }}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <Card.Text style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        flex: 1,
                      }}>
                        {item.content}
                      </Card.Text>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Diferenciadores */}
        <div>
          <Row className="text-center mb-5">
            <Col>
              <h2 style={{
                ...styles.subtitle,
                display: 'inline-block',
              }}>
                ¿Por qué elegirnos?
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80px', height: '4px', backgroundColor: colors.vibrantYellow }}></span>
              </h2>
            </Col>
          </Row>
          <Row className="align-items-center g-4">
            <Col md={6} className="order-md-2 mb-4 mb-md-0">
              <div 
                style={{ 
                  position: 'relative', 
                  overflow: 'hidden', 
                  borderRadius: '10px',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'translateX(0)' : 'translateX(20px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '20px', 
                    right: '20px', 
                    backgroundColor: colors.emeraldGreen,
                    color: colors.warmBeige,
                    padding: '10px 15px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 2,
                  }}
                >
                  Excelencia en danza
                </div>
                <Image 
                  src="https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940" 
                  alt="¿Por qué elegirnos?" 
                  fluid 
                  style={styles.image} 
                />
              </div>
            </Col>
            <Col md={6} className="order-md-1">
              <div
                style={{
                  opacity: animate ? 1 : 0,
                  transform: animate ? 'translateX(0)' : 'translateX(-20px)',
                  transition: 'opacity 0.8s ease, transform 0.8s ease',
                }}
              >
                <h3 style={{ ...styles.subtitle, fontSize: '22px', marginBottom: '20px', color: colors.emeraldGreen }}>
                  <span style={{ marginRight: '10px', fontSize: '24px' }}>🌟</span>
                  Excelencia en cada paso
                </h3>
                <p style={{ ...styles.paragraph, marginBottom: '25px' }}>
                  En la Escuela de Danza Folclórica Huasteca, combinamos autenticidad cultural, enseñanza experta y un compromiso con la comunidad para ofrecerte una experiencia única.
                </p>
                <div>
                  {featuresData.map((feature, index) => (
                    <div 
                      key={index} 
                      style={{
                        ...styles.featureCard,
                        ...(hoveredFeature === index ? styles.featureCardHover : {}),
                      }}
                      onMouseEnter={() => setHoveredFeature(index)}
                      onMouseLeave={() => setHoveredFeature(null)}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '22px', marginRight: '10px' }}>{feature.icon}</span>
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.deepRed, marginBottom: '5px' }}>
                          {feature.title}
                        </h4>
                      </div>
                      <p style={{ ...styles.paragraph, marginBottom: 0, paddingLeft: '32px' }}>{feature.desc}</p>
                    </div>
                  ))}
                </div>
                <button 
                  style={{ 
                    ...styles.button,
                    backgroundColor: buttonHover ? colors.emeraldGreen : colors.deepRed,
                  }}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>Solicitar información</span>
                  <span 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)`,
                      transition: 'left 0.5s ease',
                      left: buttonHover ? '100%' : '-100%',
                    }}
                  ></span>
                </button>
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      {/* Llamado a la acción final */}
      <div style={{ 
        background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`,
        padding: '60px 0',
        color: colors.warmBeige,
        marginTop: '50px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 40%)`,
        }}></div>
        
        <Container className="text-center">
          <h2 style={{ 
            color: colors.warmBeige, 
            marginBottom: '20px',
            fontFamily: textStyles.title.fontFamily,
            fontSize: '32px',
            fontWeight: 700,
          }}>¿Listo para danzar con nosotros?</h2>
          <p style={{ 
            color: colors.warmBeige, 
            maxWidth: '700px', 
            margin: '0 auto 30px',
            fontSize: '18px',
            opacity: 0.9,
          }}>
            Únete a nuestra comunidad y celebra la tradición huasteca a través de la danza.
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
            Contáctanos hoy
          </button>
        </Container>
      </div>

      {/* SECCIÓN: Políticas y Términos */}
      <Container>
        <div style={styles.policySection}>
          <Row className="text-center">
            <Col>
              <h2 style={{
                ...textStyles.subtitle,
                color: colors.deepRed,
                marginBottom: '25px',
              }}>
                Políticas y Términos
              </h2>
              <p style={{
                ...styles.paragraph,
                maxWidth: '700px',
                margin: '0 auto 30px',
              }}>
                Conoce nuestras políticas de inscripción, alquiler de trajes y protección de datos. Nos comprometemos a ofrecer transparencia y calidad en todos nuestros servicios.
              </p>
              <button
                style={{
                  ...styles.policyButton,
                  backgroundColor: policyButtonHover ? colors.warmBeige : colors.deepRed,
                  color: policyButtonHover ? colors.deepRed : colors.warmBeige,
                }}
                onMouseEnter={() => setPolicyButtonHover(true)}
                onMouseLeave={() => setPolicyButtonHover(false)}
              >
                Ver Políticas
              </button>
            </Col>
          </Row>
        </div>
      </Container>

      {/* CSS para efectos hover */}
      <style jsx>{`
        .hover-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default Nosotros;