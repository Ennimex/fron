import React, { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Users, Heart, Leaf, Palette, Star } from "lucide-react"
import { publicAPI } from "../../services/api"
import stylesPublic from "../../styles/stylesGlobal"

const Nosotros = () => {
  const navigate = useNavigate()
  const [colaboradores, setColaboradores] = useState([])
  const [nosotrosData, setNosotrosData] = useState({
    mision: "",
    vision: "",
  })
  const [loading, setLoading] = useState(true)
  const [loadingNosotros, setLoadingNosotros] = useState(true)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoadingNosotros(true)
        setLoading(true)

        const [nosotrosResponse, colaboradoresResponse] = await Promise.all([
          publicAPI.getNosotros(),
          publicAPI.getColaboradores(),
        ])

        setNosotrosData({
          mision: nosotrosResponse.mision || "",
          vision: nosotrosResponse.vision || "",
        })

        setColaboradores(colaboradoresResponse)

        setTimeout(() => {
          setLoadingNosotros(false)
          setLoading(false)
        }, 300)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setLoadingNosotros(false)
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  // Valores de la empresa
  const valores = useMemo(
    () => [
      {
        icon: Heart,
        titulo: "Comercio Justo",
        descripcion:
          "Garantizamos precios equitativos y condiciones dignas para nuestras artesanas, construyendo relaciones duraderas basadas en el respeto mutuo.",
        color: stylesPublic.colors.gradients.primary,
      },
      {
        icon: Leaf,
        titulo: "Sostenibilidad",
        descripcion:
          "Utilizamos materiales naturales y procesos eco-amigables, preservando el medio ambiente para las futuras generaciones.",
        color: stylesPublic.colors.gradients.secondary,
      },
      {
        icon: Palette,
        titulo: "Autenticidad",
        descripcion:
          "Cada pieza conserva las técnicas tradicionales de la cultura huasteca, manteniendo viva nuestra herencia ancestral.",
        color: stylesPublic.colors.gradients.luxury,
      },
    ],
    []
  )

  const historiaTexto =
    "La Aterciopelada nació como un sueño de preservar y celebrar las tradiciones artesanales de la región Huasteca. A lo largo de los años, hemos crecido desde nuestras humildes raíces hasta convertirnos en una boutique reconocida por la calidad excepcional de nuestras creaciones. Cada pieza cuenta una historia, cada bordado lleva consigo la sabiduría ancestral de nuestras maestras artesanas. Nuestro compromiso trasciende la simple comercialización: somos guardianes de una herencia cultural que se transmite de generación en generación, adaptándose a los tiempos modernos sin perder su esencia tradicional."

  const containerStyle = {
    maxWidth: stylesPublic.utils.container.maxWidth.xl,
    margin: stylesPublic.spacing.margins.auto,
    padding: `0 ${stylesPublic.spacing.scale[4]}`,
  }

  const cardStyle = {
    ...stylesPublic.components.card.base,
    ...stylesPublic.components.card.interactive,
    padding: stylesPublic.spacing.scale[6],
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }

  if (loading && loadingNosotros) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: stylesPublic.colors.gradients.hero,
          fontFamily: stylesPublic.typography.families.body,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: stylesPublic.spacing.scale[20],
            color: stylesPublic.colors.text.secondary,
          }}
        >
          <div
            style={{
              width: stylesPublic.spacing.scale[8],
              height: stylesPublic.spacing.scale[8],
              border: `2px solid ${stylesPublic.colors.primary[200]}`,
              borderTop: `2px solid ${stylesPublic.colors.primary[500]}`,
              borderRadius: stylesPublic.borders.radius.full,
              animation: "spin 1s linear infinite",
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          />
          <p>Cargando información...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    )
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
              <Users
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
                Sobre Nosotros
              </span>
            </div>
            <h1
              style={{
                ...stylesPublic.typography.headings.h1,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                color: stylesPublic.colors.text.primary,
              }}
            >
              Conoce a
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
              Nuestra historia, valores y pasión por la artesanía huasteca que nos define como guardianes de una
              tradición ancestral.
            </p>
          </div>
        </div>
      </section>

      {/* Historia Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          background: stylesPublic.colors.surface.secondary,
        }}
      >
        <div style={containerStyle}>
          <div style={{ textAlign: "center", marginBottom: stylesPublic.spacing.scale[12] }}>
            <h2
              style={{
                fontSize: stylesPublic.typography.scale["2xl"],
                fontWeight: stylesPublic.typography.weights.light,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
              }}
            >
              Nuestra Historia
            </h2>
            <p
              style={{
                fontSize: stylesPublic.typography.scale.base,
                color: stylesPublic.colors.text.secondary,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Un legado de tradición y excelencia artesanal
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: stylesPublic.spacing.scale[12],
              alignItems: "center",
            }}
          >
            <div>
              <img
                src="https://images.unsplash.com/photo-1604176354204-9268737828e4?q=80&w=2940"
                alt="Historia de La Aterciopelada"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: stylesPublic.borders.radius.xl,
                  boxShadow: stylesPublic.shadows.xl,
                }}
              />
            </div>
            <div>
              <p
                style={{
                  fontSize: stylesPublic.typography.scale.lg,
                  lineHeight: stylesPublic.typography.leading.relaxed,
                  color: stylesPublic.colors.text.secondary,
                  textAlign: "justify",
                }}
              >
                {historiaTexto}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          background: stylesPublic.colors.gradients.secondary,
        }}
      >
        <div style={containerStyle}>
          <h2
            style={{
              fontSize: stylesPublic.typography.scale["2xl"],
              fontWeight: stylesPublic.typography.weights.light,
              color: stylesPublic.colors.text.inverse,
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          >
            Nuestra Misión y Visión
          </h2>
          <p
            style={{
              fontSize: stylesPublic.typography.scale.lg,
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[12],
              fontWeight: stylesPublic.typography.weights.light,
              maxWidth: "700px",
              margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            }}
          >
            Los principios que guían nuestro trabajo
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: window.innerWidth <= 768 ? "1fr" : "1fr 1fr",
              gap: stylesPublic.spacing.scale[6],
              justifyContent: "center",
            }}
          >
            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  fontWeight: stylesPublic.typography.weights.medium,
                  color: stylesPublic.colors.text.primary,
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              >
                Misión
              </h3>
              {loadingNosotros ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: stylesPublic.spacing.scale[8],
                  }}
                >
                  <div
                    style={{
                      width: stylesPublic.spacing.scale[6],
                      height: stylesPublic.spacing.scale[6],
                      border: `2px solid ${stylesPublic.colors.primary[200]}`,
                      borderTop: `2px solid ${stylesPublic.colors.primary[500]}`,
                      borderRadius: stylesPublic.borders.radius.full,
                      animation: "spin 1s linear infinite",
                      marginBottom: stylesPublic.spacing.scale[2],
                    }}
                  />
                  <p style={{ color: stylesPublic.colors.text.secondary }}>
                    Cargando...
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.base,
                    color: stylesPublic.colors.text.secondary,
                    lineHeight: stylesPublic.typography.leading.relaxed,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {nosotrosData.mision ||
                    "Preservar y modernizar las técnicas artesanales huastecas, creando piezas únicas que celebren nuestra herencia cultural mientras apoyamos a las comunidades locales con comercio justo y sostenible."}
                </p>
              )}
            </div>

            <div style={cardStyle}>
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  fontWeight: stylesPublic.typography.weights.medium,
                  color: stylesPublic.colors.text.primary,
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              >
                Visión
              </h3>
              {loadingNosotros ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: stylesPublic.spacing.scale[8],
                  }}
                >
                  <div
                    style={{
                      width: stylesPublic.spacing.scale[6],
                      height: stylesPublic.spacing.scale[6],
                      border: `2px solid ${stylesPublic.colors.primary[200]}`,
                      borderTop: `2px solid ${stylesPublic.colors.primary[500]}`,
                      borderRadius: stylesPublic.borders.radius.full,
                      animation: "spin 1s linear infinite",
                      marginBottom: stylesPublic.spacing.scale[2],
                    }}
                  />
                  <p style={{ color: stylesPublic.colors.text.secondary }}>
                    Cargando...
                  </p>
                </div>
              ) : (
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.base,
                    color: stylesPublic.colors.text.secondary,
                    lineHeight: stylesPublic.typography.leading.relaxed,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {nosotrosData.vision ||
                    "Ser reconocidos como el referente en moda artesanal huasteca, combinando tradición y diseño contemporáneo para llevar nuestra cultura al mundo."}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Colaboradores Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          background: stylesPublic.colors.surface.primary,
        }}
      >
        <div style={containerStyle}>
          <h2
            style={{
              fontSize: stylesPublic.typography.scale["2xl"],
              fontWeight: stylesPublic.typography.weights.light,
              color: stylesPublic.colors.text.primary,
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          >
            Nuestros Colaboradores
          </h2>
          <p
            style={{
              fontSize: stylesPublic.typography.scale.lg,
              color: stylesPublic.colors.text.secondary,
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[12],
              fontWeight: stylesPublic.typography.weights.light,
              maxWidth: "700px",
              margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            }}
          >
            Conoce a los colaboradores que hacen posible nuestra labor
          </p>

          {loading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: stylesPublic.spacing.scale[16],
                color: stylesPublic.colors.text.secondary,
              }}
            >
              <div
                style={{
                  width: stylesPublic.spacing.scale[8],
                  height: stylesPublic.spacing.scale[8],
                  border: `2px solid ${stylesPublic.colors.primary[200]}`,
                  borderTop: `2px solid ${stylesPublic.colors.primary[500]}`,
                  borderRadius: stylesPublic.borders.radius.full,
                  animation: "spin 1s linear infinite",
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              />
              <p>Cargando colaboradores...</p>
            </div>
          ) : colaboradores.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
                gap: stylesPublic.spacing.scale[6],
              }}
            >
              {colaboradores.map((colaborador, idx) => (
                <div
                  key={idx}
                  style={{
                    ...cardStyle,
                    textAlign: "center",
                    cursor: "pointer",
                    animation: "fadeInUp 0.5s ease-out forwards",
                    animationDelay: `${idx * 0.1}s`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                  }}
                >
                  <img
                    src={
                      colaborador.imagen ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        colaborador.nombre
                      )}&background=random&color=fff&size=150`
                    }
                    alt={colaborador.nombre}
                    style={{
                      width: stylesPublic.spacing.scale[32],
                      height: stylesPublic.spacing.scale[32],
                      borderRadius: stylesPublic.borders.radius.full,
                      objectFit: "cover",
                      border: `3px solid ${stylesPublic.colors.primary[500]}`,
                      margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
                      display: "block",
                    }}
                  />
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.lg,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.text.primary,
                      marginBottom: stylesPublic.spacing.scale[2],
                    }}
                  >
                    {colaborador.nombre}
                  </h3>
                  <p
                    style={{
                      fontSize: stylesPublic.typography.scale.base,
                      color: stylesPublic.colors.primary[500],
                      fontWeight: stylesPublic.typography.weights.medium,
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                  >
                    {colaborador.rol}
                  </p>
                  {colaborador.descripcion && (
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.text.secondary,
                        lineHeight: stylesPublic.typography.leading.relaxed,
                      }}
                    >
                      {colaborador.descripcion}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: stylesPublic.spacing.scale[16],
                color: stylesPublic.colors.text.secondary,
              }}
            >
              <Users
                style={{
                  width: stylesPublic.spacing.scale[16],
                  height: stylesPublic.spacing.scale[16],
                  margin: `0 auto ${stylesPublic.spacing.scale[4]}`,
                  opacity: 0.5,
                }}
              />
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  fontWeight: stylesPublic.typography.weights.medium,
                  color: stylesPublic.colors.text.primary,
                  margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                }}
              >
                Equipo en Construcción
              </h3>
              <p>Estamos trabajando en presentar a nuestro increíble equipo de colaboradores.</p>
            </div>
          )}
        </div>
      </section>

      {/* Valores Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          background: stylesPublic.colors.gradients.primary,
        }}
      >
        <div style={containerStyle}>
          <h2
            style={{
              fontSize: stylesPublic.typography.scale["2xl"],
              fontWeight: stylesPublic.typography.weights.light,
              color: stylesPublic.colors.text.inverse,
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          >
            Nuestros Valores
          </h2>
          <p
            style={{
              fontSize: stylesPublic.typography.scale.lg,
              color: "rgba(255, 255, 255, 0.9)",
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[12],
              fontWeight: stylesPublic.typography.weights.light,
              maxWidth: "700px",
              margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            }}
          >
            Los pilares que sostienen nuestro compromiso
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
              gap: stylesPublic.spacing.scale[6],
            }}
          >
            {valores.map((valor, idx) => {
              const IconComponent = valor.icon
              return (
                <div
                  key={idx}
                  style={{
                    ...cardStyle,
                    textAlign: "center",
                    cursor: "pointer",
                    animation: "fadeInUp 0.5s ease-out forwards",
                    animationDelay: `${idx * 0.1}s`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                  }}
                >
                  <div
                    style={{
                      width: stylesPublic.spacing.scale[16],
                      height: stylesPublic.spacing.scale[16],
                      borderRadius: stylesPublic.borders.radius.full,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: `0 auto ${stylesPublic.spacing.scale[6]}`,
                      background: valor.color,
                      boxShadow: stylesPublic.shadows.lg,
                    }}
                  >
                    <IconComponent
                      style={{
                        width: stylesPublic.spacing.scale[8],
                        height: stylesPublic.spacing.scale[8],
                        color: stylesPublic.colors.surface.primary,
                      }}
                    />
                  </div>
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.lg,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.text.primary,
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                  >
                    {valor.titulo}
                  </h3>
                  <p
                    style={{
                      fontSize: stylesPublic.typography.scale.base,
                      color: stylesPublic.colors.text.secondary,
                      lineHeight: stylesPublic.typography.leading.relaxed,
                    }}
                  >
                    {valor.descripcion}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          background: stylesPublic.colors.surface.primary,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decorative elements */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(252, 251, 249, 0.98))",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "-20%",
            left: "-10%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background: stylesPublic.colors.gradients.luxury,
            opacity: 0.06,
            filter: "blur(100px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-30%",
            right: "-15%",
            width: "350px",
            height: "350px",
            borderRadius: "50%",
            background: stylesPublic.colors.gradients.primary,
            opacity: 0.05,
            filter: "blur(90px)",
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
              <Star
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
                Únete a Nosotros
              </span>
            </div>
            <h2
              style={{
                fontSize: stylesPublic.typography.scale["2xl"],
                fontWeight: stylesPublic.typography.weights.light,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
              }}
            >
              Únete a Nuestra Comunidad
            </h2>
            <p
              style={{
                fontSize: stylesPublic.typography.scale.lg,
                color: stylesPublic.colors.text.secondary,
                maxWidth: "600px",
                margin: `0 auto ${stylesPublic.spacing.scale[8]}`,
                lineHeight: stylesPublic.typography.leading.relaxed,
              }}
            >
              Descubre la belleza de la artesanía huasteca y forma parte de esta tradición
            </p>
            <button
              onClick={() => navigate("/contacto")}
              style={{
                ...stylesPublic.components.button.variants.primary,
                ...stylesPublic.components.button.sizes.lg,
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: stylesPublic.spacing.scale[2],
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)"
                e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.primary
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.primary
              }}
            >
              <Heart size={20} />
              Conoce Más Sobre Nosotros
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
export default Nosotros
