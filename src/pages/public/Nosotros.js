import React, { useState, useEffect } from 'react';
import { colors, textStyles, layout, buttons } from '../../styles/styles';
import { Container, Row, Col, Card, Image } from 'react-bootstrap';

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
      borderLeft: `3px solid ${colors.primaryLight}`,
      transition: 'all 0.3s ease',
    },
    timelineItemHover: {
      borderLeft: `5px solid ${colors.primaryMedium}`,
      paddingLeft: '35px',
      backgroundColor: `rgba(${parseInt(colors.primaryLight.slice(1, 3), 16)}, ${parseInt(colors.primaryLight.slice(3, 5), 16)}, ${parseInt(colors.primaryLight.slice(5, 7), 16)}, 0.05)`,
      borderRadius: '0 8px 8px 0',
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 100%)`,
      padding: '80px 0',
      color: colors.white,
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
      backgroundImage: `radial-gradient(${colors.white} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.1,
    },
    title: { 
      ...textStyles.title, 
      color: colors.white, 
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
    },
    subtitleHover: {
      color: colors.primaryDark,
    },
    paragraph: { 
      ...textStyles.paragraph, 
      fontSize: '17px', 
      lineHeight: '1.7' 
    },
    featureCard: {
      marginBottom: '20px',
      backgroundColor: `rgba(${parseInt(colors.primaryLight.slice(1, 3), 16)}, ${parseInt(colors.primaryLight.slice(3, 5), 16)}, ${parseInt(colors.primaryLight.slice(5, 7), 16)}, 0.1)`,
      padding: '15px 20px',
      borderRadius: '8px',
      borderLeft: `4px solid ${colors.primaryLight}`,
      transition: 'all 0.3s ease',
    },
    featureCardHover: {
      backgroundColor: `rgba(${parseInt(colors.primaryLight.slice(1, 3), 16)}, ${parseInt(colors.primaryLight.slice(3, 5), 16)}, ${parseInt(colors.primaryLight.slice(5, 7), 16)}, 0.15)`,
      borderLeft: `6px solid ${colors.primaryMedium}`,
      transform: 'translateX(5px)',
    },
    badge: {
      backgroundColor: colors.primaryLight,
      color: colors.white,
      padding: '5px 10px',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'inline-block',
      marginBottom: '15px',
    },
    underlineAnimation: {
      position: 'relative',
      display: 'inline-block',
      '&:after': {
        content: '""',
        position: 'absolute',
        width: '100%',
        transform: 'scaleX(0)',
        height: '2px',
        bottom: 0,
        left: 0,
        backgroundColor: colors.primaryLight,
        transformOrigin: 'bottom right',
        transition: 'transform 0.3s ease-out',
      },
      '&:hover:after': {
        transform: 'scaleX(1)',
        transformOrigin: 'bottom left',
      },
    },
    button: {
      ...buttons.primary,
      marginTop: '30px',
      padding: '12px 25px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      backgroundColor: colors.primaryMedium,
      position: 'relative',
      overflow: 'hidden',
      '&:before': {
        content: '""',
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '300px',
        height: '300px',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%) scale(0)',
        transition: 'transform 0.6s ease',
      },
      '&:hover:before': {
        transform: 'translate(-50%, -50%) scale(1)',
      },
    },
    policySection: {
      padding: '40px 0',
      backgroundColor: `rgba(${parseInt(colors.primaryLight.slice(1, 3), 16)}, ${parseInt(colors.primaryLight.slice(3, 5), 16)}, ${parseInt(colors.primaryLight.slice(5, 7), 16)}, 0.1)`,
      marginTop: '50px',
      borderRadius: '10px',
    },
    policyButton: {
      ...buttons.secondary,
      backgroundColor: colors.primaryDark,
      padding: '12px 25px',
      transition: 'all 0.3s ease',
      margin: '0 auto',
      display: 'block',
      border: `2px solid ${colors.primaryDark}`,
    },
  };
  
  const sectionStyle = {
    marginBottom: '70px',
  };
  
  const cardStyle = {
    borderRadius: '10px',
    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    height: '100%',
    border: 'none',
  };

  const [hoveredTimeline, setHoveredTimeline] = useState(null);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [buttonHover, setButtonHover] = useState(false);
  const [imageHover, setImageHover] = useState(false);
  const [policyButtonHover, setPolicyButtonHover] = useState(false);

  const timelineData = [
    { 
      year: '2024', 
      description: 'Lanzamiento de nuestra primera colección de diseños personalizados.',
      icon: '🚀',
    },
    { 
      year: '2025', 
      description: 'Expansión de nuestra presencia en el mercado nacional con proyectos destacados.',
      icon: '🌎',
    },
    { 
      year: '2025', 
      description: 'Reconocimiento como "Mejor Empresa de Diseño" en los Premios Nacionales de Innovación.',
      icon: '🏆',
    },
  ];


  const featuresData = [
    { 
      title: 'Personalización', 
      desc: 'Cada diseño está creado a medida para reflejar la esencia de nuestros clientes.',
      icon: '✨',
    },
    { 
      title: 'Tecnología', 
      desc: 'Integramos herramientas avanzadas para garantizar precisión y funcionalidad.',
      icon: '💻',
    },
    { 
      title: 'Materiales ecológicos', 
      desc: 'Utilizamos materiales sostenibles y de alta calidad en todos nuestros proyectos.',
      icon: '🌱',
    },
  ];

  return (
    <div style={{ backgroundColor: colors.white, color: colors.primaryDark }}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <Container>
          <Row className="text-center">
            <Col>
              <h1 style={styles.title}>Conoce Nuestra Historia</h1>
              <p 
                style={{ 
                  ...styles.paragraph, 
                  color: colors.white, 
                  fontSize: '20px', 
                  maxWidth: '700px', 
                  margin: '0 auto', 
                  opacity: animate ? 0.9 : 0,
                  transform: animate ? 'translateY(0)' : 'translateY(20px)',
                  transition: 'opacity 1s ease, transform 1s ease',
                  transitionDelay: '0.2s',
                }}
              >
                Diseños que conectan, experiencias que enamoran.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={layout.sectionPadding}>
        {/* Historia de la empresa con imagen */}
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
                src="/public/img.webp" 
                alt="Historia de JADA Company" 
                fluid 
                style={{
                  ...styles.image,
                  transform: imageHover ? 'scale(1.05)' : 'scale(1)',
                  transition: 'transform 0.5s ease',
                }} 
                onError={(e) => { e.target.src = "https://via.placeholder.com/600x400"; }} 
              />
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                  padding: '30px 20px 15px',
                  transform: imageHover ? 'translateY(0)' : 'translateY(100%)',
                  transition: 'transform 0.5s ease',
                }}
              >
                <h4 style={{ color: colors.white, marginBottom: '5px' }}>Innovación desde el primer día</h4>
                <p style={{ color: colors.white, marginBottom: 0, fontSize: '14px' }}>
                  Nuestra sede central en Huejutla de Reyes, Hidalgo
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
                <span style={{ position: 'absolute', bottom: 0, left: 0, width: '60px', height: '4px', backgroundColor: colors.primaryLight }}></span>
              </h2>
              <p style={styles.paragraph}>
                JADA Company nació en 2025 en Huejutla de Reyes, Hidalgo, México, con el propósito de revolucionar el mundo del diseño al ofrecer soluciones que combinan creatividad, funcionalidad y sostenibilidad.
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
                      <h5 style={{ color: colors.primaryDark, fontWeight: 600, margin: 0 }}>{item.year}</h5>
                    </div>
                    <p style={{ ...styles.paragraph, marginBottom: '0' }}>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
        <Container style={layout.sectionPadding}>
        {/* Misión, Visión y Valores */}
        <div style={sectionStyle}>
          <Row className="text-center mb-5">
            <Col>
              <h2 style={{
                ...textStyles.subtitle,
                position: 'relative',
                display: 'inline-block',
                paddingBottom: '15px'
              }}>
                Nuestra Filosofía
                <span style={{
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '80px',
                  height: '4px',
                  backgroundColor: colors.primaryLight
                }}></span>
              </h2>
            </Col>
          </Row>
          <Row className="g-4">
            {[
              { 
                title: "Misión", 
                color: colors.primaryLight,
                content: "Mejorar la calidad de vida con persianas de alta calidad que combinan diseño, funcionalidad y sostenibilidad."
              },
              { 
                title: "Visión", 
                color: colors.primaryMedium,
                content: "Ser la empresa líder en el mercado europeo de persianas, con presencia en más de 10 países para 2030."
              },
              { 
                title: "Valores", 
                color: colors.primaryDark,
                content: [
                  "Calidad: Productos duraderos y funcionales.",
                  "Innovación: Mejora constante.",
                  "Sostenibilidad: Materiales ecológicos.",
                  "Servicio al Cliente: Atención prioritaria."
                ]
              }
            ].map((item, index) => (
              <Col md={4} key={index} className="mb-4 mb-md-0">
                <Card 
                  style={{
                    ...cardStyle,
                    backgroundColor: item.color,
                    color: colors.white
                  }}
                  className="hover-card"
                >
                  <Card.Body className="d-flex flex-column">
                    <Card.Title style={{
                      fontFamily: textStyles.title.fontFamily,
                      fontSize: '24px',
                      fontWeight: 'bold',
                      marginBottom: '20px',
                      borderBottom: `2px solid ${colors.white}`,
                      paddingBottom: '10px'
                    }}>
                      {item.title}
                    </Card.Title>
                    {Array.isArray(item.content) ? (
                      <ul style={{
                        textAlign: 'left',
                        paddingLeft: '20px'
                      }}>
                        {item.content.map((point, i) => (
                          <li key={i} style={{marginBottom: '10px'}}>{point}</li>
                        ))}
                      </ul>
                    ) : (
                      <Card.Text style={{
                        fontSize: '16px',
                        lineHeight: '1.6',
                        flex: 1
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
      </Container>

        {/* Diferenciadores */}
        <div>
          <Row className="text-center mb-5">
            <Col>
              
              <h2 style={{
                ...styles.subtitle,
                display: 'inline-block',
              }}>
                ¿Por qué elegirnos?
                <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '80px', height: '4px', backgroundColor: colors.primaryLight }}></span>
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
                    backgroundColor: colors.primaryMedium,
                    color: colors.white,
                    padding: '10px 15px',
                    borderRadius: '5px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    zIndex: 2,
                  }}
                >
                  Excelencia en diseño
                </div>
                <Image src="https://via.placeholder.com/600x400" alt="¿Por qué elegirnos?" fluid style={styles.image} />
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
                <h3 style={{ ...styles.subtitle, fontSize: '22px', marginBottom: '20px', color: colors.primaryMedium }}>
                  <span style={{ marginRight: '10px', fontSize: '24px' }}>🌟</span>
                  Excelencia en cada detalle
                </h3>
                <p style={{ ...styles.paragraph, marginBottom: '25px' }}>
                  En JADA Company, combinamos diseño personalizado, tecnología avanzada y un compromiso sólido con la sostenibilidad para ofrecerte experiencias únicas.
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
                        <h4 style={{ fontSize: '18px', fontWeight: 'bold', color: colors.primaryDark, marginBottom: '5px' }}>
                          {feature.title}
                        </h4>
                      </div>
                      <p style={{ ...styles.paragraph, marginBottom: 0, paddingLeft: '32px' }}>{feature.desc}</p>
                    </div>
                  ))}
                </div>
                <button 
                  style={{ 
                    ...buttons.primary, 
                    marginTop: '30px', 
                    padding: '12px 25px', 
                    fontSize: '16px', 
                    transition: 'all 0.3s ease', 
                    backgroundColor: buttonHover ? colors.primaryDark : colors.primaryMedium,
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                  onMouseEnter={() => setButtonHover(true)}
                  onMouseLeave={() => setButtonHover(false)}
                >
                  <span style={{ position: 'relative', zIndex: 2 }}>Solicitar presupuesto gratuito</span>
                  <span 
                    style={{ 
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
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
        background: `linear-gradient(135deg, ${colors.primaryMedium} 0%, ${colors.primaryDark} 100%)`,
        padding: '60px 0',
        color: colors.white,
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
            color: colors.white, 
            marginBottom: '20px',
            fontFamily: textStyles.title.fontFamily,
            fontSize: '32px',
            fontWeight: 700,
          }}>¿Listo para crear algo increíble?</h2>
          <p style={{ 
            color: colors.white, 
            maxWidth: '700px', 
            margin: '0 auto 30px',
            fontSize: '18px',
            opacity: 0.9
          }}>
            Permítenos convertir tus ideas en realidad con nuestro equipo experto en diseño.
          </p>
          <button style={{
            backgroundColor: 'transparent',
            border: `2px solid ${colors.white}`,
            color: colors.white,
            padding: '12px 30px',
            borderRadius: '5px',
            fontSize: '16px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontFamily: textStyles.fontPrimary,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = colors.white;
            e.currentTarget.style.color = colors.primaryDark;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = colors.white;
          }}
          >
            Contáctanos hoy
          </button>
        </Container>
      </div>

      {/* SECCIÓN NUEVA: Políticas y Términos */}
      <Container>
        <div style={styles.policySection}>
          <Row className="text-center">
            <Col>
              <h2 style={{
                ...textStyles.subtitle,
                color: colors.primaryDark,
                marginBottom: '25px',
              }}>
                Políticas y Términos
              </h2>
              <p style={{
                ...styles.paragraph,
                maxWidth: '700px',
                margin: '0 auto 30px',
              }}>
                Conoce nuestras políticas de privacidad, términos de servicio y garantía de productos.
                Nos comprometemos con la transparencia y la protección de los datos de nuestros clientes.
              </p>
              <button
                style={{
                  ...styles.policyButton,
                  backgroundColor: policyButtonHover ? colors.white : colors.primaryDark,
                  color: policyButtonHover ? colors.primaryDark : colors.white,
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