"use client"

import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FileText } from "lucide-react"
import solicitudService from "../../services/solicitudService"
import stylesPublic from "../../styles/stylesGlobal"

const ESTADOS = {
  pendiente: { bg: "#fef3c7", color: "#92400e", label: "Pendiente" },
  atendida: { bg: "#d1fae5", color: "#065f46", label: "Atendida" },
  cerrada: { bg: "#e5e7eb", color: "#374151", label: "Cerrada" },
}

const formatearFecha = (iso) => {
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    return ""
  }
}

const MisSolicitudes = () => {
  const navigate = useNavigate()
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let activo = true
    const cargar = async () => {
      try {
        const data = await solicitudService.getAll()
        if (activo) setSolicitudes(Array.isArray(data) ? data : [])
      } catch (e) {
        if (activo) setSolicitudes([])
      } finally {
        if (activo) setLoading(false)
      }
    }
    cargar()
    return () => {
      activo = false
    }
  }, [])

  const contenedor = {
    maxWidth: "1024px",
    margin: "0 auto",
    padding: `0 ${stylesPublic.spacing.scale[4]}`,
  }

  if (loading) {
    return (
      <section style={contenedor}>
        <p
          style={{
            textAlign: "center",
            padding: stylesPublic.spacing.scale[16],
            color: stylesPublic.colors.text.secondary,
          }}
        >
          Cargando tus solicitudes...
        </p>
      </section>
    )
  }

  return (
    <section style={contenedor}>
      <div style={{ marginBottom: stylesPublic.spacing.scale[8] }}>
        <h1
          style={{
            fontSize: stylesPublic.typography.scale["3xl"],
            fontWeight: stylesPublic.typography.weights.semibold,
            color: stylesPublic.colors.text.primary,
            margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
          }}
        >
          Mis Solicitudes
        </h1>
        <p style={{ fontSize: stylesPublic.typography.scale.base, color: stylesPublic.colors.text.secondary, margin: 0 }}>
          Aquí ves las cotizaciones que has solicitado y su estado.
        </p>
      </div>

      {solicitudes.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[5], marginBottom: stylesPublic.spacing.scale[20] }}>
          {solicitudes.map((s) => {
            const estado = ESTADOS[s.estado] || ESTADOS.pendiente
            return (
              <div
                key={s._id}
                style={{
                  backgroundColor: stylesPublic.colors.surface.primary,
                  border: `1px solid ${stylesPublic.colors.neutral[200]}`,
                  borderRadius: stylesPublic.borders.radius.xl,
                  boxShadow: stylesPublic.shadows.base,
                  padding: stylesPublic.spacing.scale[5],
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: stylesPublic.spacing.scale[2],
                    marginBottom: stylesPublic.spacing.scale[3],
                  }}
                >
                  <span style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.text.tertiary }}>
                    {formatearFecha(s.createdAt)}
                  </span>
                  <span
                    style={{
                      fontSize: stylesPublic.typography.scale.xs,
                      fontWeight: stylesPublic.typography.weights.medium,
                      background: estado.bg,
                      color: estado.color,
                      padding: `${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]}`,
                      borderRadius: stylesPublic.borders.radius.full,
                      textTransform: "uppercase",
                      letterSpacing: stylesPublic.typography.tracking.wide,
                    }}
                  >
                    {estado.label}
                  </span>
                </div>

                <div style={{ display: "flex", flexWrap: "wrap", gap: stylesPublic.spacing.scale[3], marginBottom: s.mensaje ? stylesPublic.spacing.scale[3] : 0 }}>
                  {(s.productos || []).map((p, idx) => (
                    <div
                      key={p.productoId || idx}
                      style={{ display: "flex", alignItems: "center", gap: stylesPublic.spacing.scale[2] }}
                    >
                      <img
                        src={p.imagenURL || "/placeholder.svg"}
                        alt={p.nombre || "Producto"}
                        style={{ width: "44px", height: "44px", objectFit: "cover", borderRadius: stylesPublic.borders.radius.md }}
                        onError={(e) => {
                          e.target.src = "/placeholder.svg"
                        }}
                      />
                      <span style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.text.primary }}>
                        {p.nombre || "Producto"}
                      </span>
                    </div>
                  ))}
                </div>

                {s.mensaje && (
                  <p
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.secondary,
                      background: stylesPublic.colors.surface.secondary,
                      borderRadius: stylesPublic.borders.radius.md,
                      padding: stylesPublic.spacing.scale[3],
                      margin: 0,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {s.mensaje}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: `${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[8]}`,
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <div style={{ marginBottom: stylesPublic.spacing.scale[4], color: stylesPublic.colors.text.tertiary }}>
            <FileText size={48} />
          </div>
          <h3
            style={{
              fontSize: stylesPublic.typography.scale.xl,
              fontWeight: stylesPublic.typography.weights.medium,
              color: stylesPublic.colors.text.primary,
              margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
            }}
          >
            Aún no tienes solicitudes
          </h3>
          <p style={{ fontSize: stylesPublic.typography.scale.base, color: stylesPublic.colors.text.secondary, marginBottom: stylesPublic.spacing.scale[6] }}>
            Cuando solicites cotización de una prenda, aparecerá aquí.
          </p>
          <button
            type="button"
            onClick={() => navigate("/productos")}
            style={{
              fontFamily: stylesPublic.typography.families.body,
              fontSize: stylesPublic.typography.scale.sm,
              fontWeight: 500,
              padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`,
              borderRadius: stylesPublic.borders.radius.md,
              backgroundColor: stylesPublic.colors.primary[500],
              color: stylesPublic.colors.primary.contrast,
              border: "none",
              cursor: "pointer",
            }}
          >
            Explorar productos
          </button>
        </div>
      )}
    </section>
  )
}

export default MisSolicitudes
