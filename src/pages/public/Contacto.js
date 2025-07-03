"use client"

import { useState, useEffect } from "react"
import { Mail, Phone, Clock, MapPin, Send, MessageCircle } from "lucide-react"
import stylesPublic from "../../styles/stylesGlobal"

const Contacto = () => {
  const [formState, setFormState] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: "",
  })
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formError, setFormError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Cualquier lógica de inicialización si es necesaria
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState({
      ...formState,
      [name]: value,
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
      icon: Phone,
      title: "Teléfono",
      content: "+52 771 123 4567\n+52 771 987 6543",
      action: () => window.open("tel:+527711234567"),
    },
    {
      icon: Mail,
      title: "Correo Electrónico",
      content: "ventas@laaterciopelada.com\nconsultas@laaterciopelada.com",
      action: () => window.open("mailto:ventas@laaterciopelada.com"),
    },
    {
      icon: Clock,
      title: "Horario de Atención",
      content: "Lunes a Viernes: 9:00 AM - 7:00 PM\nSábados: 10:00 AM - 4:00 PM\nDomingos: Cerrado",
    },
    {
      icon: MapPin,
      title: "Ubicación",
      content: "Región Huasteca\nSan Luis Potosí, México",
      action: () => window.open("https://maps.google.com/?q=Huasteca+Potosina"),
    },
  ]

  const socialNetworks = [
    {
      icon: MessageCircle,
      name: "Facebook",
      handle: "@LaAterciopelada",
      url: "https://web.facebook.com/people/La-Aterciopelada/61567232369483/?sk=photos",
      description: "Síguenos para ver nuestras últimas creaciones",
    },
    {
      icon: MessageCircle,
      name: "WhatsApp",
      handle: "+52 771 123 4567",
      url: "https://wa.me/527711234567",
      description: "Contáctanos directamente para consultas rápidas",
    },
  ]

  const containerStyle = {
    maxWidth: stylesPublic.utils.container.maxWidth.xl,
    margin: stylesPublic.spacing.margins.auto,
    padding: `0 ${stylesPublic.spacing.scale[4]}`,
  }

  const cardStyle = {
    ...stylesPublic.components.card.base,
    ...stylesPublic.components.card.interactive,
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: stylesPublic.colors.gradients.hero,
        fontFamily: stylesPublic.typography.families.body,
      }}
    >
      <style>
        {`
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
          
          .form-social-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: ${stylesPublic.spacing.scale[12]};
          }
          
          @media (max-width: 1024px) {
            .form-social-grid {
              grid-template-columns: 1fr;
              gap: ${stylesPublic.spacing.scale[8]};
            }
          }
        `}
      </style>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: stylesPublic.colors.gradients.sunset,
            opacity: 0.4,
          }}
        />
        <div style={{ ...containerStyle, position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: stylesPublic.spacing.scale[2],
                background: stylesPublic.colors.gradients.luxury,
                padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
                borderRadius: stylesPublic.borders.radius.full,
                marginBottom: stylesPublic.spacing.scale[4],
              }}
            >
              <MessageCircle
                style={{
                  width: stylesPublic.spacing.scale[4],
                  height: stylesPublic.spacing.scale[4],
                  color: stylesPublic.colors.primary[600],
                }}
              />
              <span
                style={{
                  fontSize: stylesPublic.typography.scale.sm,
                  fontWeight: 500,
                  color: stylesPublic.colors.primary[800],
                }}
              >
                Contáctanos
              </span>
            </div>
            <h1
              style={{
                ...stylesPublic.typography.headings.h1,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                color: stylesPublic.colors.text.primary,
              }}
            >
              Conecta con
              <span
                style={{
                  display: "block",
                  background: stylesPublic.colors.gradients.elegant,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                La Aterciopelada
              </span>
            </h1>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                maxWidth: "600px",
                margin: "0 auto",
                color: stylesPublic.colors.text.secondary,
              }}
            >
              Estamos aquí para responder tus preguntas, ayudarte con tus pedidos especiales y conectarte con el
              auténtico arte textil huasteco.
            </p>
          </div>
        </div>
      </section>

      <div style={containerStyle}>
        {/* Contact Info Section */}
        <section
          style={{
            padding: `${stylesPublic.spacing.scale[16]} 0`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: stylesPublic.spacing.scale[12] }}>
            <h2
              style={{
                fontSize: stylesPublic.typography.scale["2xl"],
                fontWeight: stylesPublic.typography.weights.light,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
              }}
            >
              Información de Contacto
            </h2>
            <p
              style={{
                fontSize: stylesPublic.typography.scale.base,
                color: stylesPublic.colors.text.secondary,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Múltiples formas de conectar contigo y brindarte la mejor atención
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: stylesPublic.spacing.scale[6],
            }}
          >
            {contactInfo.map((info, index) => {
              const IconComponent = info.icon
              return (
                <div
                  key={index}
                  style={{
                    ...cardStyle,
                    padding: stylesPublic.spacing.scale[6],
                    cursor: info.action ? "pointer" : "default",
                    textAlign: "center",
                    animation: "fadeInUp 0.5s ease-out forwards",
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                  onClick={info.action}
                  onMouseEnter={(e) => {
                    if (info.action) {
                      e.currentTarget.style.transform = "translateY(-4px)"
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                      e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (info.action) {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                      e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
                    }
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                  >
                    <IconComponent
                      style={{
                        width: stylesPublic.spacing.scale[8],
                        height: stylesPublic.spacing.scale[8],
                        color: stylesPublic.colors.primary[500],
                      }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.lg,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.text.primary,
                      margin: `0 0 ${stylesPublic.spacing.scale[3]} 0`,
                    }}
                  >
                    {info.title}
                  </h3>
                  <p
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.secondary,
                      lineHeight: stylesPublic.typography.leading.relaxed,
                      margin: 0,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {info.content}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        {/* Form and Social Section */}
        <section
          style={{
            padding: `${stylesPublic.spacing.scale[16]} 0`,
          }}
        >
          <div className="form-social-grid">
            {/* Form Section */}
            <div>
              <div style={{ marginBottom: stylesPublic.spacing.scale[8] }}>
                <h2
                  style={{
                    fontSize: stylesPublic.typography.scale["2xl"],
                    fontWeight: stylesPublic.typography.weights.light,
                    color: stylesPublic.colors.text.primary,
                    margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                  }}
                >
                  Envíanos un Mensaje
                </h2>
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.base,
                    color: stylesPublic.colors.text.secondary,
                    margin: 0,
                  }}
                >
                  Nos encantaría conocer tu historia y cómo podemos ayudarte
                </p>
              </div>

              <div style={cardStyle}>
                <div style={{ padding: stylesPublic.spacing.scale[8] }}>
                  {formSubmitted && (
                    <div
                      style={{
                        background: stylesPublic.colors.semantic.success.light,
                        color: stylesPublic.colors.semantic.success.main,
                        borderLeft: `4px solid ${stylesPublic.colors.semantic.success.main}`,
                        borderRadius: stylesPublic.borders.radius.lg,
                        padding: stylesPublic.spacing.scale[5],
                        marginBottom: stylesPublic.spacing.scale[6],
                      }}
                    >
                      <h5
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.medium,
                          marginBottom: stylesPublic.spacing.scale[2],
                          margin: 0,
                        }}
                      >
                        ¡Mensaje Enviado!
                      </h5>
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.base,
                          margin: 0,
                          lineHeight: stylesPublic.typography.leading.relaxed,
                        }}
                      >
                        Gracias por contactarnos. Te responderemos en breve.
                      </p>
                    </div>
                  )}

                  {formError && (
                    <div
                      style={{
                        background: stylesPublic.colors.semantic.error.light,
                        color: stylesPublic.colors.semantic.error.main,
                        borderLeft: `4px solid ${stylesPublic.colors.semantic.error.main}`,
                        borderRadius: stylesPublic.borders.radius.lg,
                        padding: stylesPublic.spacing.scale[5],
                        marginBottom: stylesPublic.spacing.scale[6],
                      }}
                    >
                      <h5
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.medium,
                          marginBottom: stylesPublic.spacing.scale[2],
                          margin: 0,
                        }}
                      >
                        Error en el formulario
                      </h5>
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.base,
                          margin: 0,
                          lineHeight: stylesPublic.typography.leading.relaxed,
                        }}
                      >
                        Por favor completa los campos requeridos.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: stylesPublic.typography.scale.sm,
                          fontWeight: stylesPublic.typography.weights.medium,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        Nombre *
                      </label>
                      <input
                        name="nombre"
                        type="text"
                        value={formState.nombre}
                        onChange={handleInputChange}
                        style={{
                          ...stylesPublic.components.input.base,
                          border: `2px solid ${stylesPublic.borders.colors.muted}`,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = stylesPublic.colors.primary[500]
                          e.target.style.boxShadow = `0 0 0 4px ${stylesPublic.colors.primary[500]}20`
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = stylesPublic.borders.colors.muted
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: stylesPublic.typography.scale.sm,
                          fontWeight: stylesPublic.typography.weights.medium,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        Correo Electrónico *
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={formState.email}
                        onChange={handleInputChange}
                        style={{
                          ...stylesPublic.components.input.base,
                          border: `2px solid ${stylesPublic.borders.colors.muted}`,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = stylesPublic.colors.primary[500]
                          e.target.style.boxShadow = `0 0 0 4px ${stylesPublic.colors.primary[500]}20`
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = stylesPublic.borders.colors.muted
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: stylesPublic.typography.scale.sm,
                          fontWeight: stylesPublic.typography.weights.medium,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        Teléfono
                      </label>
                      <input
                        name="telefono"
                        type="tel"
                        value={formState.telefono}
                        onChange={handleInputChange}
                        style={{
                          ...stylesPublic.components.input.base,
                          border: `2px solid ${stylesPublic.borders.colors.muted}`,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = stylesPublic.colors.primary[500]
                          e.target.style.boxShadow = `0 0 0 4px ${stylesPublic.colors.primary[500]}20`
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = stylesPublic.borders.colors.muted
                          e.target.style.boxShadow = "none"
                        }}
                      />
                    </div>

                    <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                      <label
                        style={{
                          display: "block",
                          fontSize: stylesPublic.typography.scale.sm,
                          fontWeight: stylesPublic.typography.weights.medium,
                          color: stylesPublic.colors.text.primary,
                          marginBottom: stylesPublic.spacing.scale[2],
                        }}
                      >
                        Mensaje *
                      </label>
                      <textarea
                        name="mensaje"
                        rows={5}
                        value={formState.mensaje}
                        onChange={handleInputChange}
                        style={{
                          ...stylesPublic.components.input.base,
                          border: `${stylesPublic.borders.width[2]} solid ${stylesPublic.borders.colors.muted}`,
                          borderRadius: stylesPublic.borders.radius.lg,
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = stylesPublic.colors.primary[500]
                          e.target.style.boxShadow = `0 0 0 4px ${stylesPublic.colors.primary[500]}20`
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = stylesPublic.colors.neutral[300]
                          e.target.style.boxShadow = "none"
                        }}
                      />
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

                    <div style={{ textAlign: "center" }}>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        style={{
                          ...stylesPublic.components.button.variants.primary,
                          ...stylesPublic.components.button.sizes.base,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: stylesPublic.spacing.scale[2],
                          margin: "0 auto",
                          opacity: isSubmitting ? 0.7 : 1,
                          border: "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSubmitting) {
                            e.target.style.transform = "translateY(-2px)"
                            e.target.style.boxShadow = stylesPublic.shadows.brand.primary
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isSubmitting) {
                            e.target.style.transform = "translateY(0)"
                            e.target.style.boxShadow = stylesPublic.shadows.brand.primary
                          }
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <div
                              style={{
                                width: stylesPublic.spacing.scale[4],
                                height: stylesPublic.spacing.scale[4],
                                border: "2px solid transparent",
                                borderTop: "2px solid currentColor",
                                borderRadius: stylesPublic.borders.radius.full,
                                animation: "spin 1s linear infinite",
                              }}
                            />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Send size={16} />
                            Enviar Mensaje
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* Social Section */}
            <div>
              <div style={{ marginBottom: stylesPublic.spacing.scale[8] }}>
                <h2
                  style={{
                    fontSize: stylesPublic.typography.scale["2xl"],
                    fontWeight: stylesPublic.typography.weights.light,
                    color: stylesPublic.colors.text.primary,
                    margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                  }}
                >
                  Síguenos
                </h2>
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.base,
                    color: stylesPublic.colors.text.secondary,
                    margin: 0,
                  }}
                >
                  Mantente conectado con nuestras últimas creaciones
                </p>
              </div>

              <div>
                {socialNetworks.map((social, index) => {
                  const IconComponent = social.icon
                  return (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        ...cardStyle,
                        padding: stylesPublic.spacing.scale[6],
                        marginBottom: stylesPublic.spacing.scale[4],
                        display: "flex",
                        alignItems: "center",
                        gap: stylesPublic.spacing.scale[4],
                        textDecoration: "none",
                        color: "inherit",
                        animation: "fadeInUp 0.6s ease-out forwards",
                        animationDelay: `${index * 0.2}s`,
                        opacity: 0,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-2px)"
                        e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
                        e.currentTarget.style.borderColor = stylesPublic.colors.primary[300]
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)"
                        e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                        e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
                      }}
                    >
                      <div>
                        <IconComponent
                          style={{
                            width: stylesPublic.spacing.scale[6],
                            height: stylesPublic.spacing.scale[6],
                            color: stylesPublic.colors.primary[500],
                          }}
                        />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                            fontSize: stylesPublic.typography.scale.base,
                            fontWeight: stylesPublic.typography.weights.medium,
                            marginBottom: stylesPublic.spacing.scale[1],
                            margin: `0 0 ${stylesPublic.spacing.scale[1]} 0`,
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
                            margin: `0 0 ${stylesPublic.spacing.scale[1]} 0`,
                          }}
                        >
                          {social.handle}
                        </p>
                        <p
                          style={{
                            fontSize: stylesPublic.typography.scale.xs,
                            color: stylesPublic.colors.text.secondary,
                            margin: 0,
                            lineHeight: stylesPublic.typography.leading.relaxed,
                          }}
                        >
                          {social.description}
                        </p>
                      </div>
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Contacto
