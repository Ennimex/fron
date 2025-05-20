import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

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

  // Animation trigger on mount
  useEffect(() => {
    setTimeout(() => setIsVisible(prev => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, contactInfo: true })), 500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, formSection: true })), 900);
    setTimeout(() => setIsVisible(prev => ({ ...prev, social: true })), 1100);
    setTimeout(() => setIsVisible(prev => ({ ...prev, map: true })), 1300);
    setTimeout(() => setIsVisible(prev => ({ ...prev, faq: true })), 1500);
    setTimeout(() => setIsVisible(prev => ({ ...prev, cta: true })), 1700);
  }, []);

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

  const handleSubmit = async () => {
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

  const contactInfo = [
    {
      icon: "📍",
      title: "Dirección",
      content: "Calle de la Danza #456, Huejutla de Reyes, Hidalgo, México",
      link: "https://maps.app.goo.gl/UzrK1BW2QVNirmmt8",
      linkText: "Ver en Google Maps"
    },
    {
      icon: "📞",
      title: "Teléfono",
      content: "+52 789 123 4567 (Ventas)\n+52 789 987 6543 (Soporte Cultural)"
    },
    {
      icon: "📧",
      title: "Correo Electrónico",
      content: "contacto@huastecadanza.com (Consultas)\nventas@huastecadanza.com (Pedidos)"
    },
    {
      icon: "🕒",
      title: "Horario de Atención",
      content: "Lunes a Sábado: 8:00 AM - 7:00 PM\nDomingos: 10:00 AM - 3:00 PM"
    }
  ];

  const socialNetworks = [
    {
      icon: "📱",
      name: "Facebook",
      handle: "HuastecaDanza",
      url: "https://facebook.com/huastecadanza"
    },
    {
      icon: "📷",
      name: "Instagram",
      handle: "@HuastecaDanza",
      url: "https://instagram.com/huastecadanza"
    },
    {
      icon: "🎥",
      name: "TikTok",
      handle: "@HuastecaDanza",
      url: "https://tiktok.com/@huastecadanza"
    }
  ];

  const faqs = [
    {
      question: "¿Pueden personalizar trajes para mi grupo de danza?",
      answer: "Sí, ofrecemos servicios de personalización para trajes huastecos según las necesidades de tu grupo."
    },
    {
      question: "¿Cuánto tiempo tarda el envío de un traje?",
      answer: "Los envíos dentro de México tardan de 3 a 7 días hábiles, dependiendo de la ubicación."
    },
    {
      question: "¿Ofrecen renta de trajes para eventos?",
      answer: "Sí, tenemos opciones de renta para presentaciones y festivales. Contáctanos para detalles."
    }
  ];

  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes floatingLabel {
      from { transform: translateY(0); }
      to { transform: translateY(-25px) scale(0.85); }
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
      border-radius: 15px;
      background: #FFFFFF;
      font-size: 16px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .form-input input:focus,
    .form-input textarea:focus {
      border-color: #2E7D32;
      box-shadow: 0 4px 20px rgba(46, 125, 50, 0.15);
      transform: translateY(-2px);
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
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
      color: #2E7D32;
    }

    .submit-button {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .submit-button::after {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
      transition: all 0.5s ease;
    }

    .submit-button:hover::after {
      left: 100%;
    }

    .form-input input:hover,
    .form-input textarea:hover {
      border-color: #2E7D32;
    }

    .hover-card {
      transition: all 0.3s ease;
    }
    .hover-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
  `;

  const customStyles = {
    heroSection: {
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.85), rgba(44, 107, 62, 0.9)), url('https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '80px 0',
      color: '#F5E8C7',
      position: 'relative',
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    heroOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjQTkxQjBEIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMDAgODRMMjggMTAwTDU2IDg0TDU2IDUwTDI4IDM0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8L3N2Zz4=')",
      opacity: 0.1,
      zIndex: 1
    },
    section: {
      marginBottom: '60px',
      opacity: isVisible.contactInfo ? 1 : 0,
      transform: isVisible.contactInfo ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    formSection: {
      opacity: isVisible.formSection ? 1 : 0,
      transform: isVisible.formSection ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    socialSection: {
      opacity: isVisible.social ? 1 : 0,
      transform: isVisible.social ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    mapSection: {
      opacity: isVisible.map ? 1 : 0,
      transform: isVisible.map ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    faqSection: {
      opacity: isVisible.faq ? 1 : 0,
      transform: isVisible.faq ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    ctaSection: {
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.95), rgba(38, 166, 154, 0.9))`,
      padding: '60px 0',
      color: '#F5E8C7',
      position: 'relative',
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 0.8s ease-out'
    },
    titleUnderline: {
      display: 'block',
      width: '80px',
      height: '4px',
      backgroundColor: '#A91B0D',
      borderRadius: '2px',
      margin: '15px 0',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    },
    formControl: {
      borderRadius: '8px',
      border: '1px solid #2E7D32',
      padding: '12px 18px',
      marginBottom: '20px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      fontSize: '16px',
      border: '2px solid #E0E0E0',
      borderRadius: '12px',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.3s ease',
      outline: 'none',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      '&:focus': {
        borderColor: '#2E7D32',
        boxShadow: '0 4px 8px rgba(46,125,50,0.15)',
        transform: 'translateY(-2px)'
      }
    },
    formGroup: {
      marginBottom: '25px',
      position: 'relative'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '16px',
      fontWeight: '600',
      color: '#2E7D32',
      transition: 'color 0.3s ease'
    },
    button: {
      backgroundColor: '#A91B0D',
      color: '#F5E8C7',
      padding: '12px 30px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
    },
    ctaRedButton: {
      backgroundColor: '#A91B0D',
      color: '#F5E8C7',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 4px 15px rgba(169, 27, 13, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  };

  const customFormStyles = {
    input: {
      width: '100%',
      padding: '16px 20px',
      fontSize: '16px',
      border: '2px solid #E0E0E0',
      borderRadius: '15px',
      backgroundColor: '#FFFFFF',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    label: {
      position: 'absolute',
      left: '15px',
      background: '#FFFFFF',
      padding: '0 5px',
      color: '#2E7D32',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      fontSize: '14px',
      fontWeight: '600',
    },
    submitButton: {
      backgroundColor: '#A91B0D',
      color: '#F5E8C7',
      padding: '16px 32px',
      fontSize: '16px',
      fontWeight: '600',
      borderRadius: '15px',
      border: 'none',
      boxShadow: '0 4px 15px rgba(169, 27, 13, 0.2)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
  };

  return (
    <>
      <style>{animationStyles}</style>
      <div className="font-sans">
        {/* Hero Section */}
        <section style={customStyles.heroSection} className="py-5">
          <div style={customStyles.heroOverlay}></div>
          <Container className="py-5 text-center text-white" style={{ position: "relative", zIndex: 2 }}>
            <h1 className="display-3 fw-bold mb-4">
              Contacto
            </h1>
            <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px" }}>
              Conéctate con nosotros para descubrir cómo nuestros trajes y accesorios huastecos pueden realzar tus presentaciones de danza.
            </p>
          </Container>
        </section>

        <Container className="py-5">
          {/* Contact Info */}
          <section style={customStyles.section}>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-dark">
                Información de Contacto
                <span style={customStyles.titleUnderline}></span>
              </h2>
              <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
                Estamos aquí para ayudarte con cualquier consulta sobre nuestros productos y servicios.
              </p>
            </div>
            <Row className="g-4">
              {contactInfo.map((info, index) => (
                <Col md={6} lg={3} key={index}>
                  <Card className="h-100 border-0 shadow-lg rounded-4 bg-light hover-card" 
                        style={{
                          minHeight: '250px', // Altura mínima uniforme
                          transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                        }}>
                    <Card.Body className="d-flex flex-column p-4">
                      <div className="mb-3">
                        <span className="fs-1 text-success">{info.icon}</span>
                        <h3 className="h5 mt-3 text-danger fw-bold">{info.title}</h3>
                      </div>
                      <div className="flex-grow-1">
                        <p className="text-muted mb-0" style={{ whiteSpace: 'pre-line' }}>{info.content}</p>
                      </div>
                      {info.link && (
                        <a
                          href={info.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-success fw-semibold mt-3 text-decoration-none d-inline-block"
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

          {/* Form Section */}
          <section style={customStyles.formSection}>
            <Row>
              <Col lg={7}>
                <div className="text-center mb-5">
                  <h2 className="display-5 fw-bold text-dark">
                    Envíanos un Mensaje
                    <span style={customStyles.titleUnderline}></span>
                  </h2>
                  <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
                    Cuéntanos sobre tus necesidades y te responderemos a la brevedad.
                  </p>
                </div>
                {formSubmitted && (
                  <Alert variant="success" className="tw-bg-[#2E7D32]/10 tw-border-[#2E7D32]/20 tw-rounded-lg tw-mb-6 tw-p-4">
                    <Alert.Heading className="tw-text-[#2E7D32]">¡Mensaje Enviado!</Alert.Heading>
                    <p className="tw-text-[#4A4A4A]">Gracias por contactarnos. Te responderemos pronto.</p>
                  </Alert>
                )}
                {formError && (
                  <Alert variant="danger" className="tw-bg-[#A91B0D]/10 tw-border-[#A91B0D]/20 tw-rounded-lg tw-mb-6 tw-p-4">
                    <Alert.Heading className="tw-text-[#A91B0D]">Error en el formulario</Alert.Heading>
                    <p className="tw-text-[#4A4A4A]">Por favor completa todos los campos requeridos (nombre, email y mensaje).</p>
                  </Alert>
                )}
                <div className="tw-space-y-4">
                  <div className="form-input">
                    <input
                      id="formNombre"
                      type="text"
                      placeholder=" "
                      style={customFormStyles.input}
                      onChange={handleInputChange}
                      value={formState.nombre}
                    />
                    <label htmlFor="formNombre" style={customFormStyles.label}>
                      Nombre *
                    </label>
                  </div>

                  <div className="form-input">
                    <input
                      id="formEmail"
                      type="email"
                      placeholder=" "
                      style={customFormStyles.input}
                      onChange={handleInputChange}
                      value={formState.email}
                    />
                    <label htmlFor="formEmail" style={customFormStyles.label}>
                      Correo Electrónico *
                    </label>
                  </div>

                  <div className="form-input">
                    <input
                      id="formTelefono"
                      type="tel"
                      placeholder=" "
                      style={customFormStyles.input}
                      onChange={handleInputChange}
                      value={formState.telefono}
                    />
                    <label htmlFor="formTelefono" style={customFormStyles.label}>
                      Teléfono
                    </label>
                  </div>

                  <div className="form-input">
                    <textarea
                      id="formMensaje"
                      rows={6}
                      placeholder=" "
                      style={customFormStyles.input}
                      onChange={handleInputChange}
                      value={formState.mensaje}
                    />
                    <label htmlFor="formMensaje" style={customFormStyles.label}>
                      Mensaje *
                    </label>
                  </div>
                  
                  <p className="tw-text-sm tw-text-[#2E7D32] tw-mb-4">* Campos requeridos</p>
                  
                  <Button
                    className="submit-button"
                    style={customFormStyles.submitButton}
                    onClick={handleSubmit}
                  >
                    Enviar Mensaje
                    <div className="button-glow"></div>
                  </Button>
                </div>
              </Col>
              <Col lg={5}>
                <div className="text-center mb-5">
                  <h2 className="display-5 fw-bold text-dark">
                    Síguenos en Redes
                    <span style={customStyles.titleUnderline}></span>
                  </h2>
                  <p className="lead text-muted mx-auto mb-5">
                    Conéctate con nuestra comunidad de danza huasteca.
                  </p>
                </div>
                {socialNetworks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tw-flex tw-items-center tw-p-3 tw-mb-3 tw-rounded-lg tw-bg-[#F5E8C7] tw-text-[#A91B0D] tw-transition-all social-link"
                  >
                    <span className="tw-text-2xl tw-mr-4">{social.icon}</span>
                    <div>
                      <strong className="tw-block tw-text-lg">{social.name}</strong>
                      <span className="tw-text-sm">{social.handle}</span>
                    </div>
                  </a>
                ))}
                <Card className="tw-mt-6 tw-border-none tw-shadow-lg tw-rounded-xl tw-bg-[#FFF8E1]">
                  <Card.Body className="tw-p-6">
                    <Card.Title className="tw-text-lg tw-font-semibold tw-text-[#A91B0D] tw-mb-3">Consulta Personalizada</Card.Title>
                    <Card.Text className="tw-text-[#4A4A4A]">
                      ¿Buscas un traje único o asesoría para tu grupo de danza? Agenda una consulta con nuestro equipo.
                    </Card.Text>
                    <a
                      href="mailto:consultas@huastecadanza.com"
                      className="tw-inline-block tw-bg-[#2E7D32]/10 tw-text-[#2E7D32] tw-rounded-lg tw-px-4 tw-py-2 tw-font-semibold tw-mt-3 hover:tw-bg-[#2E7D32]/20"
                    >
                      consultas@huastecadanza.com
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </section>

          {/* Map Section */}
          <section style={customStyles.mapSection}>
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-dark">
                Encuéntranos
                <span style={customStyles.titleUnderline}></span>
              </h2>
              <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
                Visítanos en nuestra tienda en Huejutla de Reyes, Hidalgo.
              </p>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d714.7272224437176!2d-98.40721287703151!3d21.14354955461783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2smx!4v1741701738633!5m2!1sen!2smx"
              style={{ border: 0, borderRadius: '12px', boxShadow: '0 6px 20px rgba(0,0,0,0.1)', width: '100%', height: '450px' }}
              allowFullScreen=""
              loading="lazy"
              title="Ubicación de Huasteca Danza"
            ></iframe>
          </section>

          {/* FAQ Section */}
          <section style={customStyles.faqSection} className="mt-5">
            <div className="text-center mb-5">
              <h2 className="display-5 fw-bold text-dark">
                Preguntas Frecuentes
                <span style={customStyles.titleUnderline}></span>
              </h2>
              <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
                Resolvemos tus dudas más comunes sobre nuestros servicios.
              </p>
            </div>
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`tw-p-5 tw-mb-4 tw-rounded-lg ${index % 2 === 0 ? 'tw-bg-[#F5E8C7]' : 'tw-bg-white'} tw-shadow-md tw-animate-in`}
                style={{ animationDelay: `${0.2 * index}s` }}
              >
                <h3 className="tw-text-lg tw-font-semibold tw-text-[#A91B0D] tw-mb-2">{faq.question}</h3>
                <p className="tw-text-[#4A4A4A]">{faq.answer}</p>
              </div>
            ))}
          </section>
        </Container>

        {/* CTA Section */}
        <section style={customStyles.ctaSection} className="py-5 text-white">
          <Container className="py-5 text-center" style={{ position: "relative", zIndex: 2 }}>
            <h2 className="display-4 fw-bold mb-4">¿Listo para Bailar?</h2>
            <p className="lead opacity-75 mb-5 mx-auto" style={{ maxWidth: "700px" }}>
              Contáctanos hoy y descubre cómo nuestros trajes huastecos pueden hacer brillar tu próxima presentación.
            </p>
            <Button
              className="px-5 py-3 cta-button"
              style={customStyles.ctaRedButton}
              onClick={() => navigate('/login?register=true')}
            >
              Regístrate Ahora
            </Button>
          </Container>
        </section>
      </div>
    </>
  );
};

export default Contacto;