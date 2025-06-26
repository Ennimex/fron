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
  const [formError, setFormError] = useState(false);  const [isVisible, setIsVisible] = useState({
    hero: false,
    contactInfo: false,
    formSection: false,
    social: false
  });  // Animation trigger on mount
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
  };  const contactInfo = [
    {
      icon: <IonIcon icon={callOutline} style={{ fontSize: '32px', color: stylesPublic.colors.primary.main }} />,
      title: "Teléfono",
      content: "+52 771 123 4567 (Ventas)\n+52 771 987 6543 (Consultas)"
    },
    {
      icon: <IonIcon icon={mailOutline} style={{ fontSize: '32px', color: stylesPublic.colors.primary.main }} />,
      title: "Correo Electrónico",
      content: "ventas@laaterciopelada.com\nconsultas@laaterciopelada.com"
    },
    {
      icon: <IonIcon icon={timeOutline} style={{ fontSize: '32px', color: stylesPublic.colors.primary.main }} />,
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 10:00 AM - 4:00 PM"
    }
  ];  const socialNetworks = [
    {
      icon: <IonIcon icon={logoFacebook} style={{ fontSize: '24px', color: stylesPublic.colors.primary.main }} />,
      name: "Facebook",
      handle: "@LaAterciopelada",
      url: "https://web.facebook.com/people/La-Aterciopelada/61567232369483/?sk=photos"
    },
    {
      icon: <IonIcon icon={logoWhatsapp} style={{ fontSize: '24px', color: stylesPublic.colors.primary.main }} />,
      name: "WhatsApp",
      handle: "+52 771 123 4567",
      url: "https://wa.me/527711234567"
    }
  ];  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-in {
      animation: fadeInUp 0.8s forwards;
    }
    
    .form-input {
      position: relative;
      margin-bottom: 25px;
    }

    .form-input input,
    .form-input textarea {
      width: 100%;
      padding: 16px 20px;
      border: 2px solid #E0E0E0;
      border-radius: 12px;
      background: #FFFFFF;
      font-size: 16px;
      transition: all 0.3s ease;
    }

    .form-input input:focus,
    .form-input textarea:focus {
      border-color: ${stylesPublic.colors.secondary.main};
      box-shadow: 0 4px 20px rgba(31, 138, 128, 0.15);
      outline: none;
    }

    .form-input label {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      background: #FFFFFF;
      padding: 0 5px;
      color: ${stylesPublic.colors.text.light};
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .form-input textarea ~ label {
      top: 20px;
      transform: translateY(0);
    }

    .form-input input:focus ~ label,
    .form-input textarea:focus ~ label,
    .form-input input:not(:placeholder-shown) ~ label,
    .form-input textarea:not(:placeholder-shown) ~ label {
      top: 0;
      transform: translateY(-50%) scale(0.85);
      color: ${stylesPublic.colors.secondary.main};
    }

    .hover-card {
      transition: ${stylesPublic.transitions.preset.bounce};
      border: ${stylesPublic.borders.style.accent};
    }
    .hover-card:hover {
      transform: ${stylesPublic.elements.cards.hover.transform};
      box-shadow: ${stylesPublic.shadows.hover};
      border-color: ${stylesPublic.colors.primary.main};
    }
    
    .social-card {
      transition: ${stylesPublic.transitions.preset.default};
      border-left: ${stylesPublic.borders.width.thick} solid ${stylesPublic.colors.primary.main};
    }
    .social-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(255, 0, 112, 0.2);
    }
    
    .submit-button {
      background: ${stylesPublic.colors.background.gradient.cta};
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: ${stylesPublic.borders.radius.button};
      font-weight: ${stylesPublic.typography.fontWeight.semiBold};
      transition: ${stylesPublic.transitions.preset.buttonHover};
    }
    .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.button};
    }
    
    .floating-element {
      position: fixed;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      opacity: 0.7;
      animation: float 8s ease-in-out infinite;
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
      50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
    }

    /* Responsive Design */
    @media (max-width: 992px) {
      .container-fluid {
        padding: 0 10px;
      }
      .hero-section h1 {
        font-size: 2rem !important;
      }
      .hero-section p {
        font-size: 1rem !important;
      }
      .contact-info-card {
        margin-bottom: 20px;
      }
    }

    @media (max-width: 768px) {
      .hero-section {
        padding: 60px 0 40px !important;
      }
      .hero-section h1 {
        font-size: 1.75rem !important;
      }
      .contact-info-grid {
        grid-template-columns: 1fr !important;
        gap: 15px !important;
      }
      .contact-form-section {
        padding: 40px 0 !important;
      }
      .form-input input,
      .form-input textarea {
        padding: 14px 16px;
        font-size: 14px;
      }
      .submit-button {
        padding: 12px 24px;
        font-size: 14px;
      }
      .social-networks-section {
        padding: 40px 0 !important;
      }
    }

    @media (max-width: 576px) {
      .hero-section {
        padding: 40px 0 30px !important;
      }
      .hero-section h1 {
        font-size: 1.5rem !important;
      }
      .hero-section p {
        font-size: 0.9rem !important;
      }
      .contact-info-card {
        padding: 20px 15px !important;
      }
      .contact-info-card h5 {
        font-size: 1rem !important;
      }
      .contact-info-card p {
        font-size: 0.85rem !important;
      }
      .form-input {
        margin-bottom: 20px;
      }
      .form-input input,
      .form-input textarea {
        padding: 12px 14px;
        font-size: 13px;
      }
      .submit-button {
        padding: 10px 20px;
        font-size: 13px;
        width: 100%;
      }
      .social-card {
        padding: 15px !important;
      }
      .social-card h6 {
        font-size: 0.9rem !important;
      }
      .social-card p {
        font-size: 0.8rem !important;
      }
    }

    @media (max-width: 480px) {
      .container-fluid {
        padding: 0 5px;
      }
      .hero-section h1 {
        font-size: 1.3rem !important;
      }
      .contact-info-card {
        padding: 15px 10px !important;
      }
      .form-input input,
      .form-input textarea {
        padding: 10px 12px;
        font-size: 12px;
      }
    }
  `;
  const customStyles = {
    heroSection: {
      background: stylesPublic.colors.background.gradient.primary,
      padding: "100px 0",
      color: stylesPublic.colors.text.primary,
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default
    },
    heroOverlay: {
      ...stylesPublic.utils.overlay.standard,
      background: stylesPublic.elements.backgroundPatterns.floral,
      opacity: 0.8,
      pointerEvents: 'none'
    },
    section: {
      marginBottom: stylesPublic.spacing["4xl"],
      opacity: isVisible.contactInfo ? 1 : 0,
      transform: isVisible.contactInfo ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default
    },    formSection: {
      opacity: isVisible.formSection ? 1 : 0,
      transform: isVisible.formSection ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default,
      marginBottom: "80px" // Añadiendo espacio en la parte inferior
    },    socialSection: {
      opacity: isVisible.social ? 1 : 0,
      transform: isVisible.social ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.transitions.preset.default
    },
    titleUnderline: stylesPublic.elements.decorative.underline,
    whiteUnderline: {
      background: stylesPublic.colors.background.alt,
      boxShadow: stylesPublic.shadows.sm,
    },
    contactCard: {
      borderLeft: `${stylesPublic.borders.width.thick} solid ${stylesPublic.colors.primary.main}`,
      borderRadius: stylesPublic.borders.radius.card,
      transition: stylesPublic.transitions.preset.default,
      height: "100%"
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
        {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ position: "relative", zIndex: stylesPublic.utils.zIndex.raised, textAlign: "center" }}>
          <h1 className="animate-in" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h1, 
            fontWeight: stylesPublic.typography.fontWeight.bold, 
            marginBottom: stylesPublic.spacing.lg,
            color: stylesPublic.colors.text.primary
          }}>
            Contacto
          </h1>
          <div className="animate-in" style={{ 
            width: "80px", 
            height: "2px", 
            background: `linear-gradient(90deg, ${stylesPublic.colors.primary.main}, ${stylesPublic.colors.secondary.main})`,
            margin: "0 auto 2rem" 
          }}></div>
          <p className="animate-in" style={{ 
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            maxWidth: "700px", 
            margin: "0 auto", 
            lineHeight: stylesPublic.typography.lineHeight.paragraph,
            color: stylesPublic.colors.text.secondary
          }}>
            Conéctate con nosotros y descubre el arte textil de la Huasteca
          </p>
        </Container>
      </section>      <Container style={{ paddingBottom: "40px" }}>
        {/* Información de Contacto */}
        <section style={customStyles.section}>          <h2 className="text-center" style={{ 
            fontFamily: stylesPublic.typography.fontFamily.heading, 
            fontSize: stylesPublic.typography.fontSize.h2, 
            fontWeight: stylesPublic.typography.fontWeight.semiBold, 
            color: stylesPublic.colors.text.primary, 
            marginBottom: stylesPublic.spacing.lg 
          }}>
            Información de Contacto
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ 
            fontSize: stylesPublic.typography.fontSize.lg, 
            fontWeight: stylesPublic.typography.fontWeight.light, 
            color: stylesPublic.colors.text.secondary, 
            maxWidth: "800px", 
            margin: `0 auto ${stylesPublic.spacing["3xl"]}` 
          }}>
            Estamos aquí para responder tus preguntas y ayudarte con tus pedidos especiales
          </p>
          
          <Row className="g-4 justify-content-center">
            {contactInfo.map((info, index) => (
              <Col md={6} lg={4} key={index} className="animate-in" style={{ animationDelay: `${0.2 * index}s` }}>
                <Card className="hover-card h-100" style={customStyles.contactCard}>
                  <Card.Body className="text-center d-flex flex-column">                    <div className="mb-3">
                      {info.icon}
                    </div>
                    <h3 style={{ 
                      fontFamily: stylesPublic.typography.fontFamily.heading, 
                      fontSize: stylesPublic.typography.fontSize.xl, 
                      fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                      color: stylesPublic.colors.text.primary, 
                      marginBottom: stylesPublic.spacing.md 
                    }}>
                      {info.title}
                    </h3>
                    <p style={{ 
                      color: stylesPublic.colors.text.secondary, 
                      lineHeight: stylesPublic.typography.lineHeight.paragraph, 
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
                          color: stylesPublic.colors.secondary.main, 
                          fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                          marginTop: stylesPublic.spacing.lg 
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
            <Col lg={7} className="mb-5 mb-lg-0">              <h2 className="text-center" style={{ 
                fontFamily: stylesPublic.typography.fontFamily.heading, 
                fontSize: stylesPublic.typography.fontSize.h2, 
                fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.lg 
              }}>
                Envíanos un Mensaje
                <span style={customStyles.titleUnderline}></span>
              </h2>
                {formSubmitted && (
                <Alert variant="success" className="mb-4" style={{ 
                  background: `rgba(${parseInt(stylesPublic.colors.secondary.main.slice(1, 3), 16)}, ${parseInt(stylesPublic.colors.secondary.main.slice(3, 5), 16)}, ${parseInt(stylesPublic.colors.secondary.main.slice(5, 7), 16)}, 0.1)`, 
                  borderColor: stylesPublic.colors.secondary.main 
                }}>
                  <Alert.Heading style={{ color: stylesPublic.colors.secondary.main }}>¡Mensaje Enviado!</Alert.Heading>
                  <p style={{ color: stylesPublic.colors.text.secondary }}>Gracias por contactarnos. Te responderemos en breve.</p>
                </Alert>
              )}
              
              {formError && (
                <Alert variant="danger" className="mb-4" style={{ 
                  background: `rgba(${parseInt(stylesPublic.colors.primary.main.slice(1, 3), 16)}, ${parseInt(stylesPublic.colors.primary.main.slice(3, 5), 16)}, ${parseInt(stylesPublic.colors.primary.main.slice(5, 7), 16)}, 0.1)`, 
                  borderColor: stylesPublic.colors.primary.main 
                }}>
                  <Alert.Heading style={{ color: stylesPublic.colors.primary.main }}>Error en el formulario</Alert.Heading>
                  <p style={{ color: stylesPublic.colors.text.secondary }}>Por favor completa los campos requeridos.</p>
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
                
                <p className="text-muted mb-4">* Campos obligatorios</p>
                
                <div className="text-center">
                  <button type="submit" className="submit-button">
                    Enviar Mensaje
                  </button>
                </div>
              </form>
            </Col>
            
            <Col lg={5}>              <h2 className="text-center" style={{ 
                fontFamily: stylesPublic.typography.fontFamily.heading, 
                fontSize: stylesPublic.typography.fontSize.h2, 
                fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                color: stylesPublic.colors.text.primary, 
                marginBottom: stylesPublic.spacing.lg 
              }}>
                Síguenos
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              <div className="mb-4">
                {socialNetworks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"                    className="d-flex align-items-center mb-3 p-3 rounded social-card"
                    style={{ background: stylesPublic.colors.background.alt, textDecoration: "none", color: stylesPublic.colors.text.primary }}
                  >
                    <div className="me-3">
                      {social.icon}
                    </div>
                    <div>
                      <h4 style={{ 
                        fontSize: stylesPublic.typography.fontSize.lg, 
                        fontWeight: stylesPublic.typography.fontWeight.semiBold, 
                        marginBottom: "0.25rem" 
                      }}>{social.name}</h4>
                      <p style={{ 
                        color: stylesPublic.colors.text.secondary, 
                        marginBottom: "0" 
                      }}>{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
            </Col>
          </Row>        </section>
      </Container>
    </>
  );
};

export default Contacto;