"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col } from "react-bootstrap"
import { IonIcon } from "@ionic/react"
import { mailOutline, callOutline, timeOutline, logoFacebook, logoWhatsapp, locationOutline } from "ionicons/icons"
import stylesPublic from "../../styles/stylesPublic"

const ContactoEnhanced = () => {
  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVisible, setIsVisible] = useState({
    hero: false,
    contactInfo: false,
    formSection: false,
    social: false,
  })

  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, contactInfo: true })), 400)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, formSection: true })), 700)
    setTimeout(() => setIsVisible((prev) => ({ ...prev, social: true })), 1000)
  }, [])

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormState({
      ...formState,
      [id.replace("form", "").toLowerCase()]: value,
    })

    // Clear errors when user starts typing
    if (formError) {
      setFormError(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formState.nombre || !formState.email || !formState.mensaje) {
      setFormError(true)
      return
    }

    setIsSubmitting(true)

    // Simulación de envío
    setTimeout(() => {
      setFormSubmitted(true)
      setFormError(false)
      setIsSubmitting(false)
      setFormState({
        nombre: "",
        email: "",
        telefono: "",
        mensaje: "",
      })

      // Hide success message after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false)
      }, 5000)
    }, 1500)
  }

  const contactInfo = [
    {
      icon: (
        <IonIcon
          icon={callOutline}
          style={{ fontSize: stylesPublic.typography.scale["2xl"], color: stylesPublic.colors.primary[500] }}
        />
      ),
      title: "Teléfono",
      content: "+52 771 123 4567 (Ventas)\n+52 771 987 6543 (Consultas)",
      action: () => window.open("tel:+527711234567"),
    },
    {
      icon: (
        <IonIcon
          icon={mailOutline}
          style={{ fontSize: stylesPublic.typography.scale["2xl"], color: stylesPublic.colors.primary[500] }}
        />
      ),
      title: "Correo Electrónico",
      content: "ventas@laaterciopelada.com\nconsultas@laaterciopelada.com",
      action: () => window.open("mailto:ventas@laaterciopelada.com"),
    },
    {
      icon: (
        <IonIcon
          icon={timeOutline}
          style={{ fontSize: stylesPublic.typography.scale["2xl"], color: stylesPublic.colors.primary[500] }}
        />
      ),
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 10:00 AM - 4:00 PM\nDomingos: Cerrado",
    },
    {
      icon: (
        <IonIcon
          icon={locationOutline}
          style={{ fontSize: stylesPublic.typography.scale["2xl"], color: stylesPublic.colors.primary[500] }}
        />
      ),
      title: "Ubicación",
      content: "Región Huasteca\nSan Luis Potosí, México",
      action: () => window.open("https://maps.google.com/?q=Huasteca+Potosina"),
    },
  ]

  const socialNetworks = [
    {
      icon: (
        <IonIcon
          icon={logoFacebook}
          style={{ fontSize: stylesPublic.typography.scale.xl, color: stylesPublic.colors.primary[500] }}
        />
      ),
      name: "Facebook",
      handle: "@LaAterciopelada",
      url: "https://web.facebook.com/people/La-Aterciopelada/61567232369483/?sk=photos",
      description: "Síguenos para ver nuestras últimas creaciones",
    },
    {
      icon: (
        <IonIcon
          icon={logoWhatsapp}
          style={{ fontSize: stylesPublic.typography.scale.xl, color: stylesPublic.colors.primary[500] }}
        />
      ),
      name: "WhatsApp",
      handle: "+52 771 123 4567",
      url: "https://wa.me/527711234567",
      description: "Contáctanos directamente para consultas rápidas",
    },
  ]

  const styles = `
    .enhanced-contacto {
      font-family: ${stylesPublic.typography.families.body};
      background: ${stylesPublic.colors.surface.primary};
    }

    .enhanced-hero {
      background: ${stylesPublic.colors.gradients.hero};
      min-height: 60vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      position: relative;
      overflow: hidden;
      opacity: ${isVisible.hero ? 1 : 0};
      transform: translateY(${isVisible.hero ? "0" : "30px"});
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .enhanced-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
      opacity: 0.3;
    }

    .enhanced-hero-content {
      position: relative;
      z-index: 2;
      max-width: 800px;
      margin: 0 auto;
      padding: ${stylesPublic.spacing.scale[8]};
    }

    .enhanced-hero-title {
      font-size: ${stylesPublic.typography.headings.h1.fontSize};
      font-family: ${stylesPublic.typography.headings.h1.fontFamily};
      font-weight: 300;
      line-height: ${stylesPublic.typography.headings.h1.lineHeight};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      position: relative;
    }

    .enhanced-hero-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[16]};
      height: 2px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-hero-subtitle {
      font-size: ${stylesPublic.typography.scale.xl};
      color: ${stylesPublic.colors.text.secondary};
      font-weight: 300;
      line-height: ${stylesPublic.typography.leading.relaxed};
      margin-top: ${stylesPublic.spacing.scale[6]};
    }

    .enhanced-section {
      padding: ${stylesPublic.spacing.scale[20]} 0;
      position: relative;
    }

    .enhanced-section-title {
      font-size: ${stylesPublic.typography.scale["2xl"]};
      font-weight: 300;
      color: ${stylesPublic.colors.text.primary};
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      position: relative;
    }

    .enhanced-section-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[12]};
      height: 1px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-section-subtitle {
      font-size: ${stylesPublic.typography.scale.lg};
      color: ${stylesPublic.colors.text.secondary};
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[12]};
      font-weight: 300;
      max-width: 700px;
      margin-left: auto;
      margin-right: auto;
    }

    .enhanced-contact-info-section {
      background: ${stylesPublic.colors.surface.secondary};
      opacity: ${isVisible.contactInfo ? 1 : 0};
      transform: translateY(${isVisible.contactInfo ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    }

    .enhanced-form-section {
      background: ${stylesPublic.colors.neutral[200]};
      opacity: ${isVisible.formSection ? 1 : 0};
      transform: translateY(${isVisible.formSection ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.4s;
    }

    .enhanced-social-section {
      background: ${stylesPublic.colors.gradients.secondary};
      opacity: ${isVisible.social ? 1 : 0};
      transform: translateY(${isVisible.social ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.6s;
    }

    .enhanced-contact-card {
      background: ${stylesPublic.colors.surface.primary};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.xl};
      padding: ${stylesPublic.spacing.scale[8]};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      height: 100%;
      box-shadow: ${stylesPublic.shadows.base};
      text-align: center;
      cursor: pointer;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .enhanced-contact-card:hover {
      transform: translateY(-6px);
      box-shadow: ${stylesPublic.shadows.xl};
      border-color: ${stylesPublic.colors.primary[300]};
    }

    .enhanced-contact-icon {
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      transition: transform 0.3s ease;
    }

    .enhanced-contact-card:hover .enhanced-contact-icon {
      transform: scale(1.1);
    }

    .enhanced-form-container {
      background: ${stylesPublic.colors.surface.glass};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.xl};
      padding: ${stylesPublic.spacing.scale[10]};
      backdrop-filter: blur(10px);
      box-shadow: ${stylesPublic.shadows.lg};
    }

    .enhanced-form-group {
      position: relative;
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .enhanced-form-input,
    .enhanced-form-textarea {
      width: 100%;
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[5]};
      border: 2px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.lg};
      background: ${stylesPublic.colors.surface.primary};
      font-size: ${stylesPublic.typography.scale.base};
      font-family: ${stylesPublic.typography.families.body};
      color: ${stylesPublic.colors.text.primary};
      transition: all 0.3s ease;
      outline: none;
    }

    .enhanced-form-input:focus,
    .enhanced-form-textarea:focus {
      border-color: ${stylesPublic.colors.primary[500]};
      box-shadow: 0 0 0 4px ${stylesPublic.colors.primary[500]}20;
    }

    .enhanced-form-label {
      position: absolute;
      left: ${stylesPublic.spacing.scale[5]};
      top: 50%;
      transform: translateY(-50%);
      background: ${stylesPublic.colors.surface.primary};
      padding: 0 ${stylesPublic.spacing.scale[2]};
      color: ${stylesPublic.colors.text.tertiary};
      font-size: ${stylesPublic.typography.scale.sm};
      font-family: ${stylesPublic.typography.families.body};
      transition: all 0.3s ease;
      pointer-events: none;
    }

    .enhanced-form-textarea ~ .enhanced-form-label {
      top: ${stylesPublic.spacing.scale[5]};
      transform: translateY(0);
    }

    .enhanced-form-input:focus ~ .enhanced-form-label,
    .enhanced-form-textarea:focus ~ .enhanced-form-label,
    .enhanced-form-input:not(:placeholder-shown) ~ .enhanced-form-label,
    .enhanced-form-textarea:not(:placeholder-shown) ~ .enhanced-form-label {
      top: 0;
      transform: translateY(-50%) scale(0.85);
      color: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-submit-button {
      background: ${stylesPublic.colors.gradients.primary};
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]};
      border-radius: ${stylesPublic.borders.radius.full};
      font-weight: ${stylesPublic.typography.weights.semibold};
      font-family: ${stylesPublic.typography.families.body};
      font-size: ${stylesPublic.typography.scale.base};
      transition: all 0.3s ease;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      margin: 0 auto;
    }

    .enhanced-submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.xl};
    }

    .enhanced-submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .enhanced-social-card {
      background: ${stylesPublic.colors.surface.primary};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.lg};
      padding: ${stylesPublic.spacing.scale[6]};
      transition: all 0.3s ease;
      cursor: pointer;
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[4]};
      text-decoration: none;
      color: inherit;
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .enhanced-social-card:hover {
      transform: translateY(-2px);
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[300]};
      color: inherit;
      text-decoration: none;
    }

    .enhanced-alert {
      border-radius: ${stylesPublic.borders.radius.lg};
      border: none;
      padding: ${stylesPublic.spacing.scale[5]};
      margin-bottom: ${stylesPublic.spacing.scale[6]};
    }

    .enhanced-alert.success {
      background: ${stylesPublic.colors.semantic.success.light};
      color: ${stylesPublic.colors.semantic.success.main};
      border-left: 4px solid ${stylesPublic.colors.semantic.success.main};
    }

    .enhanced-alert.error {
      background: ${stylesPublic.colors.semantic.error.light};
      color: ${stylesPublic.colors.semantic.error.main};
      border-left: 4px solid ${stylesPublic.colors.semantic.error.main};
    }

    .enhanced-loading-spinner {
      width: ${stylesPublic.spacing.scale[5]};
      height: ${stylesPublic.spacing.scale[5]};
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: ${stylesPublic.borders.radius.full};
      animation: spin 1s linear infinite;
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .enhanced-hero {
        min-height: 50vh;
        padding: ${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[4]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale["2xl"]};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[16]} 0;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .enhanced-hero {
        min-height: 40vh;
        padding: ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[3]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale.xl};
      }

      .enhanced-hero-subtitle {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[12]} 0;
      }

      .enhanced-form-container {
        padding: ${stylesPublic.spacing.scale[8]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .enhanced-hero {
        min-height: 35vh;
        padding: ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[2]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .enhanced-section {
        padding: ${stylesPublic.spacing.scale[8]} 0;
      }

      .enhanced-contact-card {
        padding: ${stylesPublic.spacing.scale[6]};
      }

      .enhanced-form-container {
        padding: ${stylesPublic.spacing.scale[6]};
      }

      .enhanced-social-card {
        flex-direction: column;
        text-align: center;
        gap: ${stylesPublic.spacing.scale[3]};
      }
    }
  `

  return (
    <>
      <style>{styles}</style>

      <div className="enhanced-contacto">
        {/* Hero Section */}
        <section className="enhanced-hero">
          <Container>
            <div className="enhanced-hero-content">
              <h1 className="enhanced-hero-title">Contacto</h1>
              <p className="enhanced-hero-subtitle">Conéctate con nosotros y descubre el arte textil de la Huasteca</p>
            </div>
          </Container>
        </section>

        {/* Contact Info Section */}
        <section className="enhanced-contact-info-section enhanced-section">
          <Container>
            <h2 className="enhanced-section-title">Información de Contacto</h2>
            <p className="enhanced-section-subtitle">
              Estamos aquí para responder tus preguntas y ayudarte con tus pedidos especiales
            </p>

            <Row className="g-4">
              {contactInfo.map((info, index) => (
                <Col md={6} lg={3} key={index}>
                  <div
                    className="enhanced-contact-card"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={info.action}
                  >
                    <div className="enhanced-contact-icon">{info.icon}</div>
                    <h3
                      style={{
                        fontSize: stylesPublic.typography.scale.lg,
                        fontWeight: stylesPublic.typography.weights.medium,
                        color: stylesPublic.colors.text.primary,
                        marginBottom: stylesPublic.spacing.scale[4],
                      }}
                    >
                      {info.title}
                    </h3>
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                        marginBottom: 0,
                      }}
                    >
                      {info.content.split("\n").map((line, i) => (
                        <span key={i}>
                          {line}
                          {i < info.content.split("\n").length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </Col>
              ))}
            </Row>
          </Container>
        </section>

        {/* Form and Social Section */}
        <section className="enhanced-form-section enhanced-section">
          <Container>
            <Row>
              <Col lg={8} className="mb-5 mb-lg-0">
                <h2 className="enhanced-section-title">Envíanos un Mensaje</h2>
                <p className="enhanced-section-subtitle">Nos encantaría conocer tu historia y cómo podemos ayudarte</p>

                <div className="enhanced-form-container">
                  {formSubmitted && (
                    <div className="enhanced-alert success">
                      <h5
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.medium,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        ¡Mensaje Enviado!
                      </h5>
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.base,
                          marginBottom: 0,
                          lineHeight: stylesPublic.typography.leading.relaxed,
                        }}
                      >
                        Gracias por contactarnos. Te responderemos en breve.
                      </p>
                    </div>
                  )}

                  {formError && (
                    <div className="enhanced-alert error">
                      <h5
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.medium,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        Error en el formulario
                      </h5>
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.base,
                          marginBottom: 0,
                          lineHeight: stylesPublic.typography.leading.relaxed,
                        }}
                      >
                        Por favor completa los campos requeridos.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="enhanced-form-group">
                      <input
                        id="formNombre"
                        type="text"
                        placeholder=" "
                        value={formState.nombre}
                        onChange={handleInputChange}
                        className="enhanced-form-input"
                      />
                      <label htmlFor="formNombre" className="enhanced-form-label">
                        Nombre *
                      </label>
                    </div>

                    <div className="enhanced-form-group">
                      <input
                        id="formEmail"
                        type="email"
                        placeholder=" "
                        value={formState.email}
                        onChange={handleInputChange}
                        className="enhanced-form-input"
                      />
                      <label htmlFor="formEmail" className="enhanced-form-label">
                        Correo Electrónico *
                      </label>
                    </div>

                    <div className="enhanced-form-group">
                      <input
                        id="formTelefono"
                        type="tel"
                        placeholder=" "
                        value={formState.telefono}
                        onChange={handleInputChange}
                        className="enhanced-form-input"
                      />
                      <label htmlFor="formTelefono" className="enhanced-form-label">
                        Teléfono
                      </label>
                    </div>

                    <div className="enhanced-form-group">
                      <textarea
                        id="formMensaje"
                        rows={5}
                        placeholder=" "
                        value={formState.mensaje}
                        onChange={handleInputChange}
                        className="enhanced-form-textarea"
                      />
                      <label htmlFor="formMensaje" className="enhanced-form-label">
                        Mensaje *
                      </label>
                    </div>

                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.xs,
                        color: stylesPublic.colors.text.tertiary,
                        marginBottom: stylesPublic.spacing.scale[6],
                        textAlign: "center",
                      }}
                    >
                      * Campos obligatorios
                    </p>

                    <button type="submit" className="enhanced-submit-button" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <div className="enhanced-loading-spinner"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill"></i>
                          Enviar Mensaje
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </Col>

              <Col lg={4}>
                <h2 className="enhanced-section-title">Síguenos</h2>
                <p className="enhanced-section-subtitle">Mantente conectado con nuestras últimas creaciones</p>

                <div>
                  {socialNetworks.map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="enhanced-social-card"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div>{social.icon}</div>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: stylesPublic.typography.scale.base,
                            fontWeight: stylesPublic.typography.weights.medium,
                            marginBottom: stylesPublic.spacing.scale[1],
                          }}
                        >
                          {social.name}
                        </h4>
                        <p
                          style={{
                            fontSize: stylesPublic.typography.scale.sm,
                            color: stylesPublic.colors.primary[500],
                            marginBottom: stylesPublic.spacing.scale[1],
                            fontWeight: stylesPublic.typography.weights.medium,
                          }}
                        >
                          {social.handle}
                        </p>
                        <p
                          style={{
                            fontSize: stylesPublic.typography.scale.xs,
                            color: stylesPublic.colors.text.secondary,
                            marginBottom: 0,
                            lineHeight: stylesPublic.typography.leading.relaxed,
                          }}
                        >
                          {social.description}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    </>
  )
}

export default ContactoEnhanced
