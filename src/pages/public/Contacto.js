import React, { useState } from 'react';
import { colors, textStyles, layout, buttons } from '../../styles/styles';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Contacto = () => {
  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({
      ...formState,
      [id.replace('form', '').toLowerCase()]: value
    });
  };

  const enviarContacto = async (contacto) => {
    try {
      const response = await fetch('http://localhost:5000/contacto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contacto)
      });
      return response.ok;
    } catch (error) {
      console.error('Error al enviar el contacto:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Simulación de envío de formulario
    if (formState.nombre && formState.email && formState.mensaje) {
      const exito = await enviarContacto(formState);
      if (exito) {
      setFormSubmitted(true);
      setFormError(false);
      setFormState({
        nombre: '',
        email: '',
        telefono: '',
        mensaje: ''
      });
    } else {
      setFormError(true);
    }
    } else {
      setFormError(true);
    }
  };

  const styles = {
    section: { 
      marginBottom: '70px',
      animation: 'fadeIn 0.8s ease-in-out',
    },
    card: {
      borderRadius: '12px',
      boxShadow: '0 6px 20px rgba(13, 27, 42, 0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%',
      border: 'none',
      overflow: 'hidden',
      backgroundColor: colors.white,
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 25px rgba(13, 27, 42, 0.15)',
      }
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.primaryDark} 0%, ${colors.primaryMedium} 100%)`,
      padding: '100px 0 80px',
      color: colors.white,
      marginBottom: '60px',
      position: 'relative',
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'url("/path/to/pattern.svg") repeat',
      opacity: 0.1,
    },
    title: { 
      ...textStyles.title, 
      color: colors.white, 
      fontSize: '54px', 
      marginBottom: '25px', 
      fontWeight: 800,
      textShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
    subtitle: { 
      ...textStyles.subtitle, 
      position: 'relative', 
      paddingBottom: '20px', 
      marginBottom: '30px',
      fontSize: '28px',
      color: colors.primaryDark,
    },
    paragraph: { 
      ...textStyles.paragraph, 
      fontSize: '17px', 
      lineHeight: '1.8',
      color: colors.primaryMedium,
    },
    formControl: {
      borderRadius: '8px',
      border: `1px solid ${colors.accent}`,
      padding: '12px 18px',
      marginBottom: '22px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
      '&:focus': {
        borderColor: colors.primaryLight,
        boxShadow: `0 0 0 3px rgba(65, 90, 119, 0.1)`,
      }
    },
    button: {
      ...buttons.primary,
      padding: '14px 30px',
      fontSize: '16px',
      fontWeight: 600,
      transition: 'all 0.3s ease',
      backgroundColor: colors.primaryDark,
      letterSpacing: '0.5px',
      border: 'none',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(13, 27, 42, 0.2)',
      '&:hover': {
        backgroundColor: colors.primaryMedium,
        transform: 'translateY(-2px)',
        boxShadow: '0 6px 15px rgba(13, 27, 42, 0.25)',
      }
    },
    infoCard: {
      padding: '30px',
      borderRadius: '12px',
      backgroundColor: colors.white,
      boxShadow: '0 6px 20px rgba(13, 27, 42, 0.08)',
      marginBottom: '30px',
      borderLeft: `5px solid ${colors.primaryLight}`,
    },
    infoIcon: {
      fontSize: '24px',
      marginRight: '12px',
      color: colors.primaryLight,
    },
    socialLink: {
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      marginBottom: '15px',
      textDecoration: 'none',
      color: colors.primaryMedium,
      borderRadius: '8px',
      transition: 'all 0.3s ease',
      backgroundColor: 'rgba(224, 225, 221, 0.5)',
      '&:hover': {
        backgroundColor: colors.primaryLight,
        color: colors.white,
        transform: 'translateX(5px)',
      }
    },
    map: {
      border: 0, 
      borderRadius: '12px', 
      boxShadow: '0 6px 20px rgba(13, 27, 42, 0.1)',
      width: '100%',
      height: '450px',
    }
  };

  // Información de contacto en tarjetas separadas
  const contactInfo = [
    {
      icon: "📍",
      title: "Dirección",
      content: "Calle Principal #123, Huejutla de Reyes, Hidalgo, México",
      link: "https://maps.app.goo.gl/UzrK1BW2QVNirmmt8",
      linkText: "Ver en Google Maps"
    },
    {
      icon: "📞",
      title: "Teléfono",
      content: "+52 123 456 7890 (Oficina Principal)\n+52 987 654 3210 (Atención al Cliente)"
    },
    {
      icon: "📧",
      title: "Correo Electrónico",
      content: "info@jadacompany.com (Consultas Generales)\nventas@jadacompany.com (Solicitudes de Presupuesto)"
    },
    {
      icon: "🕒",
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 6:00 PM\nSábados: 10:00 AM - 2:00 PM\nDomingos y Festivos: Cerrado"
    }
  ];

  // Redes sociales
  const socialNetworks = [
    {
      icon: "📱",
      name: "Facebook",
      handle: "JADA Company",
      url: "https://facebook.com/jadacompany"
    },
    {
      icon: "📷",
      name: "Instagram",
      handle: "@JADACompany",
      url: "https://instagram.com/jadacompany"
    },
    {
      icon: "🔗",
      name: "LinkedIn",
      handle: "JADA Company",
      url: "https://linkedin.com/company/jadacompany"
    }
  ];

  return (
    <div style={{ backgroundColor: colors.white, color: colors.primaryDark }}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroOverlay}></div>
        <Container>
          <Row className="text-center">
            <Col>
              <h1 style={styles.title}>Contacto</h1>
              <p style={{ 
                ...styles.paragraph, 
                color: colors.white, 
                fontSize: '22px', 
                maxWidth: '800px', 
                margin: '0 auto', 
                opacity: 0.95,
                fontWeight: 300,
              }}>
                Estamos aquí para escucharte. Contáctanos y descubre cómo JADA Company puede impulsar tus proyectos al siguiente nivel.
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container style={{...layout.sectionPadding, maxWidth: '1100px'}}>
        {/* Información de Contacto */}
        <Row style={styles.section}>
          <Col>
            <h2 style={styles.subtitle}>
              Información de Contacto
              <span style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '80px', 
                height: '4px', 
                backgroundColor: colors.primaryLight,
                borderRadius: '2px' 
              }}></span>
            </h2>
          </Col>
        </Row>
        
        <Row style={{marginBottom: '50px'}}>
          {contactInfo.map((info, index) => (
            <Col md={6} lg={3} key={index} className="mb-4">
              <div style={styles.infoCard}>
                <h3 style={{
                  fontSize: '20px',
                  marginBottom: '15px',
                  color: colors.primaryDark,
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={styles.infoIcon}>{info.icon}</span>
                  {info.title}
                </h3>
                <p style={{
                  ...styles.paragraph,
                  whiteSpace: 'pre-line'
                }}>
                  {info.content}
                </p>
                {info.link && (
                  <a 
                    href={info.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      color: colors.primaryLight,
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-block',
                      marginTop: '8px',
                      transition: 'color 0.3s ease',
                      '&:hover': {
                        color: colors.primaryDark,
                      }
                    }}
                  >
                    {info.linkText} →
                  </a>
                )}
              </div>
            </Col>
          ))}
        </Row>

        <Row style={styles.section}>
          {/* Formulario de Contacto */}
          <Col lg={7}>
            <h2 style={styles.subtitle}>
              Envíanos un Mensaje
              <span style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '80px', 
                height: '4px', 
                backgroundColor: colors.primaryLight,
                borderRadius: '2px' 
              }}></span>
            </h2>
            
            {formSubmitted && (
              <Alert variant="success" style={{
                backgroundColor: 'rgba(40, 167, 69, 0.1)',
                border: '1px solid rgba(40, 167, 69, 0.2)',
                borderRadius: '8px',
                marginBottom: '25px',
                padding: '16px 20px'
              }}>
                <Alert.Heading>¡Mensaje Enviado!</Alert.Heading>
                <p>Gracias por contactarnos. Nos pondremos en contacto contigo a la brevedad.</p>
              </Alert>
            )}
            
            {formError && (
              <Alert variant="danger" style={{
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                border: '1px solid rgba(220, 53, 69, 0.2)',
                borderRadius: '8px',
                marginBottom: '25px',
                padding: '16px 20px'
              }}>
                <Alert.Heading>Error en el formulario</Alert.Heading>
                <p>Por favor completa todos los campos requeridos (nombre, email y mensaje).</p>
              </Alert>
            )}
            
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formNombre">
                <Form.Label style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.primaryDark,
                  marginBottom: '8px'
                }}>Nombre*</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Tu nombre" 
                  style={styles.formControl}
                  onChange={handleInputChange}
                  value={formState.nombre}
                />
              </Form.Group>
              
              <Form.Group controlId="formEmail">
                <Form.Label style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.primaryDark,
                  marginBottom: '8px'
                }}>Correo Electrónico*</Form.Label>
                <Form.Control 
                  type="email" 
                  placeholder="tu@email.com" 
                  style={styles.formControl}
                  onChange={handleInputChange}
                  value={formState.email}
                />
              </Form.Group>
              
              <Form.Group controlId="formTelefono">
                <Form.Label style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.primaryDark,
                  marginBottom: '8px'
                }}>Teléfono</Form.Label>
                <Form.Control 
                  type="tel" 
                  placeholder="+52 123 456 7890" 
                  style={styles.formControl}
                  onChange={handleInputChange}
                  value={formState.telefono}
                />
              </Form.Group>
              
              <Form.Group controlId="formMensaje">
                <Form.Label style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: colors.primaryDark,
                  marginBottom: '8px'
                }}>Mensaje*</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={6} 
                  placeholder="¿En qué podemos ayudarte?" 
                  style={{...styles.formControl, resize: 'vertical'}}
                  onChange={handleInputChange}
                  value={formState.mensaje}
                />
              </Form.Group>
              
              <p style={{
                fontSize: '14px',
                color: colors.primaryLight,
                marginBottom: '20px'
              }}>* Campos requeridos</p>
              
              <Button 
                type="submit"
                style={styles.button}
              >
                Enviar Mensaje
              </Button>
            </Form>
          </Col>

          {/* Redes Sociales */}
          <Col lg={5}>
            <h2 style={{...styles.subtitle, marginTop: {xs: '40px', lg: '0'}}}>
              Síguenos en Redes
              <span style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '80px', 
                height: '4px', 
                backgroundColor: colors.primaryLight,
                borderRadius: '2px' 
              }}></span>
            </h2>
            
            <p style={{...styles.paragraph, marginBottom: '30px'}}>
              Mantente al día con nuestras novedades, promociones y proyectos siguiéndonos en nuestras redes sociales:
            </p>
            
            <div>
              {socialNetworks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={styles.socialLink}
                >
                  <span style={{fontSize: '24px', marginRight: '15px'}}>{social.icon}</span>
                  <div>
                    <strong style={{display: 'block', fontSize: '18px'}}>{social.name}</strong>
                    <span style={{fontSize: '14px'}}>{social.handle}</span>
                  </div>
                </a>
              ))}
            </div>
            
            <Card style={{
              marginTop: '40px',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 6px 20px rgba(13, 27, 42, 0.08)',
              overflow: 'hidden'
            }}>
              <Card.Body style={{padding: '25px'}}>
                <Card.Title style={{
                  fontSize: '20px',
                  color: colors.primaryDark,
                  marginBottom: '15px',
                  fontWeight: 700
                }}>Atención Personalizada</Card.Title>
                <Card.Text style={styles.paragraph}>
                  Para proyectos especiales o consultas específicas, nuestro equipo de especialistas está disponible para brindarte una atención personalizada.
                </Card.Text>
                <Card.Text style={{
                  ...styles.paragraph,
                  fontSize: '16px',
                  fontWeight: 600,
                  marginTop: '15px'
                }}>
                  Agenda una reunión virtual o presencial:
                </Card.Text>
                <a 
                  href="mailto:reuniones@jadacompany.com"
                  style={{
                    display: 'inline-block',
                    padding: '10px 20px',
                    backgroundColor: 'rgba(65, 90, 119, 0.1)',
                    color: colors.primaryDark,
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                    transition: 'all 0.3s ease',
                    marginTop: '10px',
                    '&:hover': {
                      backgroundColor: 'rgba(65, 90, 119, 0.2)',
                    }
                  }}
                >
                  reuniones@jadacompany.com
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Mapa de Ubicación */}
        <Row style={styles.section}>
          <Col>
            <h2 style={styles.subtitle}>
              Encuéntranos
              <span style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '80px', 
                height: '4px', 
                backgroundColor: colors.primaryLight,
                borderRadius: '2px' 
              }}></span>
            </h2>
            <p style={{...styles.paragraph, marginBottom: '30px'}}>
              Visítanos en nuestra sede principal en Huejutla de Reyes, Hidalgo. Estamos ubicados en una zona céntrica de fácil acceso.
            </p>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d714.7272224437176!2d-98.40721287703151!3d21.14354955461783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2smx!4v1741701738633!5m2!1sen!2smx" 
              style={styles.map}
              allowFullScreen="" 
              loading="lazy"
              title="Ubicación de JADA Company"
            ></iframe>
          </Col>
        </Row>
        
        {/* FAQ Section */}
        <Row style={{...styles.section, marginTop: '50px'}}>
          <Col>
            <h2 style={styles.subtitle}>
              Preguntas Frecuentes
              <span style={{ 
                position: 'absolute', 
                bottom: 0, 
                left: 0, 
                width: '80px', 
                height: '4px', 
                backgroundColor: colors.primaryLight,
                borderRadius: '2px' 
              }}></span>
            </h2>
            
            <div style={{marginTop: '30px'}}>
              {[
                {
                  question: "¿Cuánto tiempo tarda la respuesta a mis consultas?",
                  answer: "Nos comprometemos a responder todas las consultas en un plazo máximo de 24 horas hábiles."
                },
                {
                  question: "¿Ofrecen servicios de consultoría personalizada?",
                  answer: "Sí, contamos con un equipo de especialistas que pueden brindar asesoría personalizada para tu proyecto o negocio."
                },
                {
                  question: "¿Realizan envíos a nivel nacional?",
                  answer: "Sí, realizamos envíos a toda la República Mexicana. Los tiempos de entrega varían según la ubicación."
                }
              ].map((faq, index) => (
                <div key={index} style={{
                  marginBottom: '20px',
                  padding: '20px 25px',
                  borderRadius: '10px',
                  backgroundColor: index % 2 === 0 ? 'rgba(224, 225, 221, 0.5)' : 'white',
                  boxShadow: index % 2 === 0 ? 'none' : '0 3px 15px rgba(13, 27, 42, 0.05)',
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 700,
                    color: colors.primaryDark,
                    marginBottom: '10px'
                  }}>{faq.question}</h3>
                  <p style={{
                    ...styles.paragraph,
                    marginBottom: 0
                  }}>{faq.answer}</p>
                </div>
              ))}
            </div>
          </Col>
        </Row>
      </Container>
      
      {/* CTA Section */}
      <div style={{
        backgroundColor: colors.primaryLight,
        padding: '60px 0',
        color: 'white',
      }}>
        <Container className="text-center">
          <h2 style={{
            fontSize: '32px',
            fontWeight: 700,
            marginBottom: '20px'
          }}>¿Listo para comenzar?</h2>
          <p style={{
            fontSize: '18px',
            maxWidth: '700px',
            margin: '0 auto 30px',
            opacity: 0.9
          }}>
            Nuestro equipo está listo para ayudarte a llevar tu proyecto al siguiente nivel.
          </p>
          <Button style={{
            backgroundColor: 'white',
            color: colors.primaryDark,
            border: 'none',
            padding: '12px 30px',
            fontSize: '16px',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: colors.white,
              transform: 'translateY(-3px)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
            }
          }}>
            Contáctanos Ahora
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default Contacto;