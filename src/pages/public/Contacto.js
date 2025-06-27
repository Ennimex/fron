import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { mailOutline, callOutline, timeOutline, logoFacebook, logoWhatsapp } from 'ionicons/icons';
import stylesPublic from '../../styles/stylesPublic';

const Contacto = () => {
  const [formState, setFormState] = useState({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState(false);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    contactInfo: false,
    formSection: false,
    social: false
  });

  // Animation trigger on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, contactInfo: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, formSection: true })), 500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, social: true })), 700);
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormState({
      ...formState,
      [id.replace('form', '').toLowerCase()]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formState.nombre && formState.email && formState.mensaje) {
      // Simulación de envío exitoso
      setTimeout(() => {
        setFormSubmitted(true);
        setFormError(false);
        setFormState({
          nombre: '',
          email: '',
          telefono: '',
          mensaje: ''
        });
      }, 1000);
    } else {
      setFormError(true);
    }
  };

  const contactInfo = [
    {
      icon: <IonIcon icon={callOutline} style={{ fontSize: stylesPublic.typography.scale['2xl'], color: stylesPublic.colors.primary[500] }} />,
      title: "Teléfono",
      content: "+52 771 123 4567 (Ventas)\n+52 771 987 6543 (Consultas)"
    },
    {
      icon: <IonIcon icon={mailOutline} style={{ fontSize: stylesPublic.typography.scale['2xl'], color: stylesPublic.colors.primary[500] }} />,
      title: "Correo Electrónico",
      content: "ventas@laaterciopelada.com\nconsultas@laaterciopelada.com"
    },
    {
      icon: <IonIcon icon={timeOutline} style={{ fontSize: stylesPublic.typography.scale['2xl'], color: stylesPublic.colors.primary[500] }} />,
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 10:00 AM - 4:00 PM"
    }
  ];

  const socialNetworks = [
    {
      icon: <IonIcon icon={logoFacebook} style={{ fontSize: stylesPublic.typography.scale.xl, color: stylesPublic.colors.primary[500] }} />,
      name: "Facebook",
      handle: "@LaAterciopelada",
      url: "https://web.facebook.com/people/La-Aterciopelada/61567232369483/?sk=photos"
    },
    {
      icon: <IonIcon icon={logoWhatsapp} style={{ fontSize: stylesPublic.typography.scale.xl, color: stylesPublic.colors.primary[500] }} />,
      name: "WhatsApp",
      handle: "+52 771 123 4567",
      url: "https://wa.me/527711234567"
    }
  ];

  // CSS usando exclusivamente tokens del sistema refactorizado
  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(${stylesPublic.spacing.scale[5]}); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-in {
      animation: fadeInUp ${stylesPublic.animations.duration.slowest} forwards;
    }
    
    .form-input {
      position: relative;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .form-input input,
    .form-input textarea {
      width: 100%;
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[5]};
      border: ${stylesPublic.borders.width[2]}px solid ${stylesPublic.borders.colors.default};
      border-radius: ${stylesPublic.borders.radius.lg};
      background: ${stylesPublic.colors.surface.primary};
      font-size: ${stylesPublic.typography.scale.base};
      font-family: ${stylesPublic.typography.families.body};
      color: ${stylesPublic.colors.text.primary};
      transition: ${stylesPublic.animations.transitions.base};
    }

    .form-input input:focus,
    .form-input textarea:focus {
      border-color: ${stylesPublic.colors.secondary[500]};
      box-shadow: 0 ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[5]} ${stylesPublic.colors.secondary[500]}15;
      outline: none;
    }

    .form-input label {
      position: absolute;
      left: ${stylesPublic.spacing.scale[4]};
      top: 50%;
      transform: translateY(-50%);
      background: ${stylesPublic.colors.surface.primary};
      padding: 0 ${stylesPublic.spacing.scale[1]};
      color: ${stylesPublic.colors.text.tertiary};
      font-size: ${stylesPublic.typography.scale.sm};
      font-family: ${stylesPublic.typography.families.body};
      transition: ${stylesPublic.animations.transitions.base};
      pointer-events: none;
    }

    .form-input textarea ~ label {
      top: ${stylesPublic.spacing.scale[5]};
      transform: translateY(0);
    }

    .form-input input:focus ~ label,
    .form-input textarea:focus ~ label,
    .form-input input:not(:placeholder-shown) ~ label,
    .form-input textarea:not(:placeholder-shown) ~ label {
      top: 0;
      transform: translateY(-50%) scale(0.85);
      color: ${stylesPublic.colors.secondary[500]};
    }

    .hover-card {
      transition: ${stylesPublic.animations.transitions.base};
      border: ${stylesPublic.borders.width[1]}px solid ${stylesPublic.borders.colors.default};
    }
    .hover-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[2]});
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[500]};
    }
    
    .social-card {
      transition: ${stylesPublic.animations.transitions.base};
      border-left: ${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[500]};
    }
    .social-card:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.brand.primary};
    }
    
    .submit-button {
      background: ${stylesPublic.colors.gradients.accent};
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]};
      border-radius: ${stylesPublic.borders.radius.full};
      font-weight: ${stylesPublic.typography.weights.semibold};
      font-family: ${stylesPublic.typography.families.body};
      font-size: ${stylesPublic.typography.scale.base};
      transition: ${stylesPublic.animations.transitions.base};
      cursor: pointer;
    }
    .submit-button:hover {
      transform: translateY(-${stylesPublic.spacing.scale[1]});
      box-shadow: ${stylesPublic.shadows.brand.primary};
    }
    
    .floating-element {
      position: fixed;
      width: ${stylesPublic.spacing.scale[1]};
      height: ${stylesPublic.spacing.scale[1]};
      border-radius: ${stylesPublic.borders.radius.full};
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
      50% { transform: translateY(-${stylesPublic.spacing.scale[5]}) scale(1.2); opacity: 0.8; }
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .container-fluid {
        padding: 0 ${stylesPublic.spacing.scale[3]};
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale['2xl']} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
      .contact-info-card {
        margin-bottom: ${stylesPublic.spacing.scale[5]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .hero-section {
        padding: ${stylesPublic.spacing.scale[15]} 0 ${stylesPublic.spacing.scale[10]} !important;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.xl} !important;
      }
      .contact-info-grid {
        grid-template-columns: 1fr !important;
        gap: ${stylesPublic.spacing.scale[4]} !important;
      }
      .contact-form-section {
        padding: ${stylesPublic.spacing.scale[10]} 0 !important;
      }
      .form-input input,
      .form-input textarea {
        padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[4]};
        font-size: ${stylesPublic.typography.scale.sm};
      }
      .submit-button {
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]};
        font-size: ${stylesPublic.typography.scale.sm};
      }
      .social-networks-section {
        padding: ${stylesPublic.spacing.scale[10]} 0 !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .hero-section {
        padding: ${stylesPublic.spacing.scale[10]} 0 ${stylesPublic.spacing.scale[8]} !important;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.lg} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.sm} !important;
      }
      .contact-info-card {
        padding: ${stylesPublic.spacing.scale[5]} ${stylesPublic.spacing.scale[4]} !important;
      }
      .contact-info-card h5 {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
      .contact-info-card p {
        font-size: ${stylesPublic.typography.scale.sm} !important;
      }
      .form-input {
        margin-bottom: ${stylesPublic.spacing.scale[5]};
      }
      .form-input input,
      .form-input textarea {
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[4]};
        font-size: ${stylesPublic.typography.scale.xs};
      }
      .submit-button {
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[5]};
        font-size: ${stylesPublic.typography.scale.xs};
        width: 100%;
      }
      .social-card {
        padding: ${stylesPublic.spacing.scale[4]} !important;
      }
      .social-card h6 {
        font-size: ${stylesPublic.typography.scale.sm} !important;
      }
      .social-card p {
        font-size: ${stylesPublic.typography.scale.xs} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .container-fluid {
        padding: 0 ${stylesPublic.spacing.scale[1]};
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
      .contact-info-card {
        padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[3]} !important;
      }
      .form-input input,
      .form-input textarea {
        padding: ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[3]};
        font-size: ${stylesPublic.typography.scale.xs};
      }
    }
  `;

  const customStyles = {
    heroSection: {
      background: stylesPublic.colors.gradients.hero,
      padding: `${stylesPublic.spacing.scale[25]} 0`,
      color: stylesPublic.colors.text.primary,
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base
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
    section: {
      marginBottom: stylesPublic.spacing.scale[16],
      opacity: isVisible.contactInfo ? 1 : 0,
      transform: isVisible.contactInfo ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base
    },
    formSection: {
      opacity: isVisible.formSection ? 1 : 0,
      transform: isVisible.formSection ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base,
      marginBottom: stylesPublic.spacing.scale[20]
    },
    socialSection: {
      opacity: isVisible.social ? 1 : 0,
      transform: isVisible.social ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[5]})`,
      transition: stylesPublic.animations.transitions.base
    },
    titleUnderline: {
      display: 'block',
      width: stylesPublic.spacing.scale[20],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.sm,
      margin: `${stylesPublic.spacing.scale[4]} auto`,
    },
    whiteUnderline: {
      background: stylesPublic.colors.surface.primary,
      boxShadow: stylesPublic.shadows.sm,
    },
    contactCard: {
      borderLeft: `${stylesPublic.borders.width[4]}px solid ${stylesPublic.colors.primary[500]}`,
      borderRadius: stylesPublic.borders.radius.lg,
      transition: stylesPublic.animations.transitions.base,
      height: "100%"
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ 
          position: "relative", 
          zIndex: stylesPublic.utils.zIndex.docked, 
          textAlign: "center" 
        }}>
          <h1 className="animate-in" style={{ 
            ...stylesPublic.typography.headings.h1,
            marginBottom: stylesPublic.spacing.scale[6],
            color: stylesPublic.colors.text.primary
          }}>
            Contacto
          </h1>
          <div className="animate-in" style={{ 
            ...customStyles.titleUnderline
          }}></div>
          <p className="animate-in" style={{ 
            ...stylesPublic.typography.body.large,
            maxWidth: "700px", 
            margin: "0 auto", 
            color: stylesPublic.colors.text.secondary
          }}>
            Conéctate con nosotros y descubre el arte textil de la Huasteca
          </p>
        </Container>
      </section>

      <Container style={{ paddingBottom: stylesPublic.spacing.scale[10] }}>
        {/* Información de Contacto */}
        <section style={customStyles.section}>
          <h2 style={{ 
            ...stylesPublic.typography.headings.h2,
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.scale[6], 
            textAlign: "center" 
          }}>
            Información de Contacto
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p style={{ 
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Estamos aquí para responder tus preguntas y ayudarte con tus pedidos especiales
          </p>
          
          <Row className="g-4 justify-content-center">
            {contactInfo.map((info, index) => (
              <Col md={6} lg={4} key={index} className="animate-in" style={{ animationDelay: `${0.2 * index}s` }}>
                <Card className="hover-card h-100" style={{
                  ...stylesPublic.components.card.base,
                  ...customStyles.contactCard,
                  padding: stylesPublic.spacing.scale[8]
                }}>
                  <Card.Body style={{ 
                    textAlign: "center", 
                    display: "flex", 
                    flexDirection: "column" 
                  }}>
                    <div style={{ marginBottom: stylesPublic.spacing.scale[3] }}>
                      {info.icon}
                    </div>
                    <h3 style={{ 
                      ...stylesPublic.typography.headings.h4,
                      color: stylesPublic.colors.text.primary, 
                      marginBottom: stylesPublic.spacing.scale[4] 
                    }}>
                      {info.title}
                    </h3>
                    <p style={{ 
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.secondary, 
                      flexGrow: 1 
                    }}>
                      {info.content.split('\n').map((line, i) => (
                        <span key={i}>
                          {line}
                          <br />
                        </span>
                      ))}
                    </p>
                    {info.link && (
                      <a 
                        href={info.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ 
                          color: stylesPublic.colors.secondary[500], 
                          fontWeight: stylesPublic.typography.weights.semibold, 
                          marginTop: stylesPublic.spacing.scale[6],
                          textDecoration: "none"
                        }}
                      >
                        {info.linkText} →
                      </a>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>

        {/* Formulario y Redes Sociales */}
        <section style={customStyles.formSection}>
          <Row>
            <Col lg={7} className="mb-5 mb-lg-0">
              <h2 style={{ 
                ...stylesPublic.typography.headings.h2,
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.scale[6], 
                textAlign: "center" 
              }}>
                Envíanos un Mensaje
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              {formSubmitted && (
                <Alert variant="success" className="mb-4" style={{ 
                  background: stylesPublic.colors.semantic.success.light,
                  borderColor: stylesPublic.colors.semantic.success.main,
                  color: stylesPublic.colors.semantic.success.main,
                  borderRadius: stylesPublic.borders.radius.md,
                  padding: stylesPublic.spacing.scale[4]
                }}>
                  <Alert.Heading style={{ 
                    ...stylesPublic.typography.headings.h5,
                    color: stylesPublic.colors.semantic.success.main 
                  }}>
                    ¡Mensaje Enviado!
                  </Alert.Heading>
                  <p style={{ 
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: 0
                  }}>
                    Gracias por contactarnos. Te responderemos en breve.
                  </p>
                </Alert>
              )}
              
              {formError && (
                <Alert variant="danger" className="mb-4" style={{ 
                  background: stylesPublic.colors.semantic.error.light,
                  borderColor: stylesPublic.colors.semantic.error.main,
                  color: stylesPublic.colors.semantic.error.main,
                  borderRadius: stylesPublic.borders.radius.md,
                  padding: stylesPublic.spacing.scale[4]
                }}>
                  <Alert.Heading style={{ 
                    ...stylesPublic.typography.headings.h5,
                    color: stylesPublic.colors.semantic.error.main 
                  }}>
                    Error en el formulario
                  </Alert.Heading>
                  <p style={{ 
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.text.secondary,
                    marginBottom: 0
                  }}>
                    Por favor completa los campos requeridos.
                  </p>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="form-input">
                  <input
                    id="formNombre"
                    type="text"
                    placeholder=" "
                    value={formState.nombre}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="formNombre">Nombre *</label>
                </div>
                
                <div className="form-input">
                  <input
                    id="formEmail"
                    type="email"
                    placeholder=" "
                    value={formState.email}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="formEmail">Correo Electrónico *</label>
                </div>
                
                <div className="form-input">
                  <input
                    id="formTelefono"
                    type="tel"
                    placeholder=" "
                    value={formState.telefono}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="formTelefono">Teléfono</label>
                </div>
                
                <div className="form-input">
                  <textarea
                    id="formMensaje"
                    rows={5}
                    placeholder=" "
                    value={formState.mensaje}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="formMensaje">Mensaje *</label>
                </div>
                
                <p style={{ 
                  ...stylesPublic.typography.body.caption,
                  color: stylesPublic.colors.text.tertiary,
                  marginBottom: stylesPublic.spacing.scale[6]
                }}>
                  * Campos obligatorios
                </p>
                
                <div style={{ textAlign: "center" }}>
                  <button type="submit" className="submit-button">
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </Col>
            
            <Col lg={5}>
              <h2 style={{ 
                ...stylesPublic.typography.headings.h2,
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.scale[6], 
                textAlign: "center" 
              }}>
                Síguenos
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                {socialNetworks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center mb-3 p-3 rounded social-card"
                    style={{ 
                      background: stylesPublic.colors.surface.secondary, 
                      textDecoration: "none", 
                      color: stylesPublic.colors.text.primary,
                      borderRadius: stylesPublic.borders.radius.md,
                      padding: stylesPublic.spacing.scale[4],
                      marginBottom: stylesPublic.spacing.scale[3],
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <div style={{ marginRight: stylesPublic.spacing.scale[3] }}>
                      {social.icon}
                    </div>
                    <div>
                      <h4 style={{ 
                        ...stylesPublic.typography.headings.h6,
                        marginBottom: stylesPublic.spacing.scale[1]
                      }}>
                        {social.name}
                      </h4>
                      <p style={{ 
                        ...stylesPublic.typography.body.small,
                        color: stylesPublic.colors.text.secondary, 
                        marginBottom: 0 
                      }}>
                        {social.handle}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </Col>
          </Row>
        </section>
      </Container>
    </>
  );
};

export default Contacto;