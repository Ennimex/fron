import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { mailOutline, callOutline, locationOutline, timeOutline, logoFacebook, logoInstagram, logoTwitter } from 'ionicons/icons';

const Contacto = () => {
  const navigate = useNavigate();
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
    social: false,
    map: false,
    faq: false,
    cta: false
  });

  // Paleta de colores alineada con La Aterciopelada
  const colors = {
    deepRed: '#ff0070',
    emeraldGreen: '#1f8a80',
    warmBeige: '#F5E8C7',
    vibrantYellow: '#FFC107',
    darkGrey: '#4A4A4A',
    softPink: '#ff8090',
    darkPurple: '#23102d'
  };

  // Animation trigger on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, contactInfo: true })), 300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, formSection: true })), 500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, social: true })), 700);
    setTimeout(() => setIsVisible(prev => ({ ...prev, map: true })), 900);
    setTimeout(() => setIsVisible(prev => ({ ...prev, faq: true })), 1100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 1300);
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
      icon: <IonIcon icon={locationOutline} style={{ fontSize: '32px', color: colors.deepRed }} />,
      title: "Dirección",
      content: "Calle Artesanal #123, Centro, Huejutla de Reyes, Hidalgo",
      link: "https://maps.app.goo.gl/UzrK1BW2QVNirmmt8",
      linkText: "Ver en mapa"
    },
    {
      icon: <IonIcon icon={callOutline} style={{ fontSize: '32px', color: colors.deepRed }} />,
      title: "Teléfono",
      content: "+52 771 123 4567 (Ventas)\n+52 771 987 6543 (Consultas)"
    },
    {
      icon: <IonIcon icon={mailOutline} style={{ fontSize: '32px', color: colors.deepRed }} />,
      title: "Correo Electrónico",
      content: "ventas@laaterciopelada.com\nconsultas@laaterciopelada.com"
    },
    {
      icon: <IonIcon icon={timeOutline} style={{ fontSize: '32px', color: colors.deepRed }} />,
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 10:00 AM - 4:00 PM"
    }
  ];

  const socialNetworks = [
    {
      icon: <IonIcon icon={logoFacebook} style={{ fontSize: '24px', color: colors.deepRed }} />,
      name: "Facebook",
      handle: "@LaAterciopeladaOficial",
      url: "https://facebook.com/laaterciopelada"
    },
    {
      icon: <IonIcon icon={logoInstagram} style={{ fontSize: '24px', color: colors.deepRed }} />,
      name: "Instagram",
      handle: "@LaAterciopelada",
      url: "https://instagram.com/laaterciopelada"
    },
    {
      icon: <IonIcon icon={logoTwitter} style={{ fontSize: '24px', color: colors.deepRed }} />,
      name: "Twitter",
      handle: "@AterciopeladaMX",
      url: "https://twitter.com/aterciopeladamx"
    }
  ];

  const faqs = [
    {
      question: "¿Cómo puedo realizar un pedido personalizado?",
      answer: "Ofrecemos servicios de personalización para todas nuestras prendas. Contáctanos con tus requerimientos y te enviaremos una cotización."
    },
    {
      question: "¿Cuáles son los tiempos de entrega?",
      answer: "Los envíos dentro de México tardan de 3 a 5 días hábiles. Para pedidos personalizados, el tiempo varía según la complejidad (normalmente 2-3 semanas)."
    },
    {
      question: "¿Ofrecen envíos internacionales?",
      answer: "Sí, realizamos envíos a todo el mundo. Los costos y tiempos varían según el destino."
    },
    {
      question: "¿Puedo visitar su taller?",
      answer: "¡Claro! Nuestro taller en Huejutla está abierto al público. Recomendamos agendar una cita para brindarte mejor atención."
    }
  ];

  const animationStyles = `
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
      border-color: ${colors.emeraldGreen};
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
      color: #757575;
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
      color: ${colors.emeraldGreen};
    }

    .hover-card {
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      border: 1px solid rgba(232, 180, 184, 0.15);
    }
    .hover-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 20px 40px rgba(255, 0, 112, 0.35), 
                  0 10px 20px rgba(31, 138, 128, 0.25), 
                  0 6px 12px rgba(44, 35, 41, 0.18);
      border-color: ${colors.deepRed};
    }
    
    .social-card {
      transition: all 0.3s ease;
      border-left: 3px solid ${colors.deepRed};
    }
    .social-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(255, 0, 112, 0.2);
    }
    
    .submit-button {
      background: linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%);
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 30px;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    .submit-button:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(255, 0, 112, 0.3);
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
  `;

  const customStyles = {
    heroSection: {
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
      padding: "100px 0",
      color: colors.darkPurple,  // Cambiado a darkPurple para mejor contraste
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
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
      pointerEvents: 'none'
    },
    section: {
      marginBottom: "80px",
      opacity: isVisible.contactInfo ? 1 : 0,
      transform: isVisible.contactInfo ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
    },
    formSection: {
      opacity: isVisible.formSection ? 1 : 0,
      transform: isVisible.formSection ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
    },
    socialSection: {
      opacity: isVisible.social ? 1 : 0,
      transform: isVisible.social ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
    },
    mapSection: {
      opacity: isVisible.map ? 1 : 0,
      transform: isVisible.map ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
    },
    faqSection: {
      opacity: isVisible.faq ? 1 : 0,
      transform: isVisible.faq ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
    },
    ctaSection: {
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
      padding: "80px 0",
      color: colors.darkPurple,  // Cambiado a darkPurple para mejor contraste
      position: "relative",
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out"
    },
    titleUnderline: {
      display: "block",
      width: "60px",
      height: "2px",
      background: `linear-gradient(90deg, ${colors.deepRed}, ${colors.emeraldGreen})`,
      borderRadius: "1px",
      margin: "15px auto",
    },
    whiteUnderline: {
      background: colors.warmBeige,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    contactCard: {
      borderLeft: `3px solid ${colors.deepRed}`,
      borderRadius: "12px",
      transition: "all 0.3s ease",
      height: "100%"
    },
    faqCard: {
      background: colors.warmBeige,
      borderRadius: "12px",
      border: "none",
      marginBottom: "20px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <h1 className="animate-in" style={{ 
            fontFamily: "'Playfair Display', serif", 
            fontSize: "clamp(2.5rem, 5vw, 4rem)", 
            fontWeight: 700, 
            marginBottom: "1.5rem",
            color: colors.darkPurple  // Asegurar color oscuro para el título
          }}>
            Contacto
          </h1>
          <div className="animate-in" style={{ 
            width: "80px", 
            height: "2px", 
            background: `linear-gradient(90deg, ${colors.deepRed}, ${colors.emeraldGreen})`,
            margin: "0 auto 2rem" 
          }}></div>
          <p className="animate-in" style={{ 
            fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)", 
            fontWeight: 300, 
            maxWidth: "700px", 
            margin: "0 auto", 
            lineHeight: "1.6",
            color: colors.darkGrey  // Asegurar color oscuro para el texto
          }}>
            Conéctate con nosotros y descubre el arte textil de la Huasteca
          </p>
        </Container>
      </section>

      <Container>
        {/* Información de Contacto */}
        <section style={customStyles.section}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: colors.darkPurple, marginBottom: "1.5rem" }}>
            Información de Contacto
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: colors.darkGrey, maxWidth: "800px", margin: "0 auto 3rem" }}>
            Estamos aquí para responder tus preguntas y ayudarte con tus pedidos especiales
          </p>
          
          <Row className="g-4">
            {contactInfo.map((info, index) => (
              <Col md={6} lg={3} key={index} className="animate-in" style={{ animationDelay: `${0.2 * index}s` }}>
                <Card className="hover-card h-100" style={customStyles.contactCard}>
                  <Card.Body className="text-center d-flex flex-column">
                    <div className="mb-3">
                      {info.icon}
                    </div>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: colors.darkPurple, marginBottom: "1rem" }}>
                      {info.title}
                    </h3>
                    <p style={{ color: colors.darkGrey, lineHeight: "1.6", flexGrow: 1 }}>
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
                        style={{ color: colors.emeraldGreen, fontWeight: "600", marginTop: "15px" }}
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
              <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: colors.darkPurple, marginBottom: "1.5rem" }}>
                Envíanos un Mensaje
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              {formSubmitted && (
                <Alert variant="success" className="mb-4" style={{ background: "rgba(31, 138, 128, 0.1)", borderColor: colors.emeraldGreen }}>
                  <Alert.Heading style={{ color: colors.emeraldGreen }}>¡Mensaje Enviado!</Alert.Heading>
                  <p style={{ color: colors.darkGrey }}>Gracias por contactarnos. Te responderemos en breve.</p>
                </Alert>
              )}
              
              {formError && (
                <Alert variant="danger" className="mb-4" style={{ background: "rgba(255, 0, 112, 0.1)", borderColor: colors.deepRed }}>
                  <Alert.Heading style={{ color: colors.deepRed }}>Error en el formulario</Alert.Heading>
                  <p style={{ color: colors.darkGrey }}>Por favor completa los campos requeridos.</p>
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
            
            <Col lg={5}>
              <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: colors.darkPurple, marginBottom: "1.5rem" }}>
                Síguenos
                <span style={customStyles.titleUnderline}></span>
              </h2>
              
              <div className="mb-4">
                {socialNetworks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center mb-3 p-3 rounded social-card"
                    style={{ background: colors.warmBeige, textDecoration: "none", color: colors.darkPurple }}
                  >
                    <div className="me-3">
                      {social.icon}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>{social.name}</h4>
                      <p style={{ color: colors.darkGrey, marginBottom: "0" }}>{social.handle}</p>
                    </div>
                  </a>
                ))}
              </div>
              
              <Card className="border-0 shadow-sm" style={{ background: colors.warmBeige }}>
                <Card.Body className="text-center">
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", fontWeight: 600, color: colors.darkPurple, marginBottom: "1rem" }}>
                    Boletín Cultural
                  </h3>
                  <p style={{ color: colors.darkGrey, marginBottom: "1.5rem" }}>
                    Suscríbete para recibir noticias sobre eventos, talleres y nuevas colecciones
                  </p>
                  <Button 
                    variant="outline-dark" 
                    style={{ borderColor: colors.deepRed, color: colors.deepRed }}
                    onClick={() => navigate("/newsletter")}
                  >
                    Suscribirme
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </section>

        {/* Mapa */}
        <section style={customStyles.mapSection}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: colors.darkPurple, marginBottom: "1.5rem" }}>
            Visítanos
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: colors.darkGrey, maxWidth: "800px", margin: "0 auto 3rem" }}>
            Nuestro taller está ubicado en el corazón de la Huasteca
          </p>
          
          <div className="rounded-3 overflow-hidden shadow-lg" style={{ height: "450px" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3740.222715667089!2d-98.4072127!3d20.4536186!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d61b1a6e8d5e3f%3A0x5f1a5e5b5e5b5e5b!2sHuejutla%20de%20Reyes%2C%20Hgo.!5e0!3m2!1sen!2smx!4v1620000000000!5m2!1sen!2smx"
              width="100%"
              height="100%"
              style={{ border: "0" }}
              allowFullScreen=""
              loading="lazy"
              title="Ubicación de La Aterciopelada"
            ></iframe>
          </div>
        </section>

        {/* Preguntas Frecuentes */}
        <section style={customStyles.faqSection}>
          <h2 className="text-center" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, color: colors.darkPurple, marginBottom: "1.5rem" }}>
            Preguntas Frecuentes
            <span style={customStyles.titleUnderline}></span>
          </h2>
          <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: colors.darkGrey, maxWidth: "800px", margin: "0 auto 3rem" }}>
            Resolvemos tus dudas sobre nuestros productos y servicios
          </p>
          
          <Row className="g-4">
            {faqs.map((faq, index) => (
              <Col md={6} key={index} className="animate-in" style={{ animationDelay: `${0.2 * index}s` }}>
                <Card className="h-100 hover-card" style={{ borderLeft: `3px solid ${index % 2 === 0 ? colors.deepRed : colors.emeraldGreen}` }}>
                  <Card.Body>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: "1.2rem", fontWeight: 600, color: colors.darkPurple, marginBottom: "1rem" }}>
                      {faq.question}
                    </h3>
                    <p style={{ color: colors.darkGrey, lineHeight: "1.6" }}>
                      {faq.answer}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      </Container>

      {/* CTA Section */}
      <section style={customStyles.ctaSection}>
        <Container style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <h2 className="animate-in" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(2rem, 4vw, 2.8rem)", fontWeight: 600, marginBottom: "1rem" }}>
            ¿Listo para descubrir más?
          </h2>
          <p className="animate-in" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, opacity: 0.9, maxWidth: "700px", margin: "0 auto 2rem" }}>
            Explora nuestra colección completa de prendas y accesorios artesanales
          </p>
          <Button 
            className="animate-in" 
            style={{ 
              background: colors.warmBeige, 
              color: colors.deepRed, 
              border: "none",
              padding: "12px 30px",
              fontWeight: "600",
              fontSize: "1.1rem",
              borderRadius: "30px"
            }}
            onClick={() => navigate("/productos")}
          >
            Ver Colección
          </Button>
        </Container>
      </section>
    </>
  );
};

export default Contacto;