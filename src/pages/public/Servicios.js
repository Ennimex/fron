"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles } from "lucide-react"
import { servicioService } from "../../services/servicioService"
import stylesPublic from "../../styles/stylesGlobal"

const ServiciosEnhanced = () => {
  const navigate = useNavigate()
  const [servicios, setServicios] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarServicios = async () => {
      try {
        setLoading(true)
        const data = await servicioService.getAll()
        setServicios(data)
        setTimeout(() => {
          setLoading(false)
        }, 300)
      } catch (error) {
        console.error("Error al cargar los servicios:", error)
        setServicios([])
        setLoading(false)
      }
    }

    cargarServicios()
  }, [])



  const buttonStyle = {
    fontFamily: stylesPublic.typography.families.body,
    fontSize: stylesPublic.typography.scale.base,
    fontWeight: stylesPublic.typography.weights.medium,
    padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`,
    borderRadius: stylesPublic.borders.radius.full,
    border: "none",
    cursor: "pointer",
    transition: stylesPublic.animations.transitions.elegant,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: stylesPublic.colors.primary[500],
    color: stylesPublic.colors.primary.contrast,
    boxShadow: stylesPublic.shadows.brand.primary,
  }

  const cardStyle = {
    backgroundColor: stylesPublic.colors.surface.primary,
    borderRadius: stylesPublic.borders.radius.xl,
    border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    boxShadow: stylesPublic.shadows.base,
    transition: stylesPublic.animations.transitions.elegant,
    padding: stylesPublic.spacing.scale[6],
    height: "100%",
    display: "flex",
    flexDirection: "column",
  }

  if (loading) {
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
          <p>Cargando servicios...</p>
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
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
            textAlign: "center",
          }}
        >
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
            <span
              style={{
                fontSize: stylesPublic.typography.scale["2xl"],
              }}
            >
              <Sparkles size={20} aria-hidden="true" />
            </span>
            <span
              style={{
                fontSize: stylesPublic.typography.scale.sm,
                fontWeight: stylesPublic.typography.weights.medium,
                color: stylesPublic.colors.primary[800],
              }}
            >
              Servicios Artesanales
            </span>
          </div>
          <h1
            style={{
              ...stylesPublic.typography.headings.h1,
              margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
            }}
          >
            Tradición y
            <span
              style={{
                display: "block",
                background: stylesPublic.colors.gradients.elegant,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Excelencia Artesanal
            </span>
          </h1>
          <p
            style={{
              ...stylesPublic.typography.body.large,
              maxWidth: "600px",
              margin: `0 auto ${stylesPublic.spacing.scale[8]} auto`,
            }}
          >
            Descubre la excelencia artesanal que celebra la rica tradición textil huasteca, donde cada servicio refleja
            nuestro compromiso con la calidad y la preservación cultural.
          </p>
          <button
            style={primaryButtonStyle}
            onClick={() => navigate("/contacto")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.elegant
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.primary
            }}
          >
            Explorar Servicios
          </button>
        </div>
      </section>

      {/* Servicios Section */}
      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: `${stylesPublic.spacing.scale[20]} ${stylesPublic.spacing.scale[4]}`,
        }}
      >
        <div style={{ textAlign: "center", marginBottom: stylesPublic.spacing.scale[16] }}>
          <h2
            style={{
              ...stylesPublic.typography.headings.h2,
              margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
            }}
          >
            Nuestros Servicios
          </h2>
          <div
            style={{
              width: stylesPublic.spacing.scale[24],
              height: stylesPublic.spacing.scale[1],
              background: stylesPublic.colors.gradients.luxury,
              borderRadius: stylesPublic.borders.radius.full,
              margin: `0 auto ${stylesPublic.spacing.scale[6]} auto`,
            }}
          />
          <p
            style={{
              ...stylesPublic.typography.body.large,
              maxWidth: "700px",
              margin: "0 auto",
              color: stylesPublic.colors.text.secondary,
            }}
          >
            Cada servicio refleja nuestro compromiso con la excelencia artesanal y la preservación cultural
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: stylesPublic.spacing.scale[6],
            marginBottom: stylesPublic.spacing.scale[16],
          }}
        >
          {servicios.length === 0 && (
            <p style={{ ...stylesPublic.typography.body.large, textAlign: "center" }}>
              Aún no hay servicios publicados.
            </p>
          )}
          {servicios.map((servicio, idx) => (
            <div
              key={servicio._id}
              style={{
                ...cardStyle,
                animationDelay: `${0.1 * idx}s`,
                animation: "fadeInUp 0.6s ease-out forwards",
                opacity: 0,
                transform: "translateY(20px)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)"
                e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
                e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)"
                e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
              }}
            >
              {servicio.imagenURL && (
                <img
                  src={servicio.imagenURL}
                  alt={servicio.titulo || servicio.nombre}
                  style={{
                    width: "80px",
                    height: "80px",
                    objectFit: "cover",
                    borderRadius: "50%",
                    margin: "0 auto 16px auto",
                    boxShadow: stylesPublic.shadows.lg,
                    background: stylesPublic.colors.surface.primary,
                  }}
                />
              )}
              <div
                style={{
                  fontSize: stylesPublic.typography.scale["4xl"],
                  textAlign: "center",
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              >
                {servicio.icono}
              </div>
              <h3
                style={{
                  ...stylesPublic.typography.headings.h4,
                  textAlign: "center",
                  marginBottom: stylesPublic.spacing.scale[3],
                  color: stylesPublic.colors.text.primary,
                }}
              >
                {servicio.titulo || servicio.nombre}
              </h3>
              <p
                style={{
                  ...stylesPublic.typography.body.base,
                  textAlign: "center",
                  color: stylesPublic.colors.text.secondary,
                  lineHeight: 1.6,
                  flex: 1,
                }}
              >
                {servicio.descripcion}
              </p>
            </div>
          ))}
        </div>

        {/* Información adicional */}
        <div
          style={{
            background: stylesPublic.colors.surface.glass,
            borderRadius: stylesPublic.borders.radius.xl,
            padding: stylesPublic.spacing.scale[8],
            textAlign: "center",
            border: `1px solid ${stylesPublic.colors.neutral[200]}`,
            backdropFilter: "blur(10px)",
          }}
        >
          <h3
            style={{
              ...stylesPublic.typography.headings.h3,
              marginBottom: stylesPublic.spacing.scale[4],
              color: stylesPublic.colors.text.primary,
            }}
          >
            ¿Buscas algo personalizado?
          </h3>
          <p
            style={{
              ...stylesPublic.typography.body.large,
              marginBottom: stylesPublic.spacing.scale[6],
              color: stylesPublic.colors.text.secondary,
              maxWidth: "600px",
              margin: `0 auto ${stylesPublic.spacing.scale[6]} auto`,
            }}
          >
            Creamos servicios únicos adaptados a tus necesidades. Desde eventos especiales hasta colecciones
            exclusivas, trabajamos contigo para materializar tu visión artesanal.
          </p>
          <button
            style={primaryButtonStyle}
            onClick={() => navigate("/contacto")}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.elegant
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = stylesPublic.shadows.brand.primary
            }}
          >
            Solicitar Consulta
          </button>
        </div>
      </section>

      {/* Beneficios Section */}

      {/* CTA Section */}
      <section
        style={{
          background: stylesPublic.colors.gradients.secondary,
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
          }}
        >
          <h2
            style={{
              ...stylesPublic.typography.headings.h2,
              marginBottom: stylesPublic.spacing.scale[4],
              color: stylesPublic.colors.text.inverse,
            }}
          >
            Comienza Tu Experiencia Artesanal
          </h2>
          <p
            style={{
              ...stylesPublic.typography.body.large,
              marginBottom: stylesPublic.spacing.scale[8],
              color: stylesPublic.colors.text.inverse,
              opacity: 0.95,
              lineHeight: 1.7,
            }}
          >
            Cada servicio que ofrecemos está diseñado para celebrar la rica tradición textil de la Huasteca,
            combinando técnicas ancestrales con diseños contemporáneos para crear experiencias verdaderamente únicas.
          </p>
          <button
            style={{
              ...buttonStyle,
              backgroundColor: stylesPublic.colors.surface.primary,
              color: stylesPublic.colors.primary[600],
              border: `2px solid ${stylesPublic.colors.surface.primary}`,
              padding: `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]}`,
              fontSize: stylesPublic.typography.scale.lg,
              boxShadow: stylesPublic.shadows.lg,
            }}
            onClick={() => navigate("/contacto")}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = stylesPublic.colors.surface.primary
              e.currentTarget.style.transform = "translateY(-2px)"
              e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = stylesPublic.colors.surface.primary
              e.currentTarget.style.color = stylesPublic.colors.primary[600]
              e.currentTarget.style.transform = "translateY(0)"
              e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
            }}
          >
            Descubrir Servicios
          </button>
        </div>
      </section>
    </div>
  )
}

export default ServiciosEnhanced