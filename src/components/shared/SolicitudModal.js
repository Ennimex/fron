"use client"

import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { X, Check, MessageCircle } from "lucide-react"
import { useConfig } from "../../context/ConfigContext"
import solicitudService from "../../services/solicitudService"
import stylesPublic from "../../styles/stylesGlobal"

// Modal reutilizable para solicitar cotización de uno o varios productos.
// `productos` = arreglo de objetos de producto (con _id, nombre, imagenURL).
const SolicitudModal = ({ productos = [], onClose }) => {
  const navigate = useNavigate()
  const { config } = useConfig()
  const [mensaje, setMensaje] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [exito, setExito] = useState(false)
  const [error, setError] = useState("")

  // Normaliza los productos al formato que espera el backend (snapshot)
  const items = productos.map((p) => ({
    productoId: p._id || p.productoId,
    nombre: p.nombre,
    imagenURL: p.imagenURL,
  }))

  const enviarSolicitud = async () => {
    setError("")
    setEnviando(true)
    try {
      await solicitudService.create({ productos: items, mensaje })
      setExito(true)
    } catch (e) {
      setError(e?.error || "No se pudo enviar la solicitud. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  const enviarPorWhatsApp = () => {
    const lista = items.map((p) => `• ${p.nombre || "Producto"}`).join("\n")
    const texto = `¡Hola! Me interesa cotizar estas prendas de La Aterciopelada:\n\n${lista}\n${
      mensaje ? `\n${mensaje}\n` : ""
    }\n¿Me podrían dar más información sobre disponibilidad y precios? ¡Gracias!`

    // Número/URL de WhatsApp desde la configuración del sitio; si no hay, fallback
    const waConfig = config?.redesSociales?.whatsapp || ""
    let base
    if (waConfig.startsWith("http")) base = waConfig
    else if (waConfig) base = `https://wa.me/${waConfig.replace(/\D/g, "")}`
    else base = "https://wa.me/527715563522"

    const url = `${base}${base.includes("?") ? "&" : "?"}text=${encodeURIComponent(texto)}`
    window.open(url, "_blank")
  }

  const overlayStyle = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: stylesPublic.spacing.scale[4],
    zIndex: 1000,
  }

  const cardStyle = {
    backgroundColor: stylesPublic.colors.surface.primary,
    borderRadius: stylesPublic.borders.radius.xl,
    maxWidth: "480px",
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: stylesPublic.spacing.scale[6],
    boxShadow: stylesPublic.shadows.lg,
  }

  const botonBase = {
    fontFamily: stylesPublic.typography.families.body,
    fontSize: stylesPublic.typography.scale.base,
    fontWeight: 500,
    padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`,
    borderRadius: stylesPublic.borders.radius.md,
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: stylesPublic.spacing.scale[2],
    width: "100%",
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={cardStyle} onClick={(e) => e.stopPropagation()}>
        {exito ? (
          <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[4] }}>
            <div style={{ color: "#16a34a", marginBottom: stylesPublic.spacing.scale[3] }}>
              <Check size={48} />
            </div>
            <h3
              style={{
                fontSize: stylesPublic.typography.scale.xl,
                fontWeight: stylesPublic.typography.weights.semibold,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
              }}
            >
              ¡Solicitud enviada!
            </h3>
            <p
              style={{
                color: stylesPublic.colors.text.secondary,
                marginBottom: stylesPublic.spacing.scale[6],
              }}
            >
              Recibimos tu solicitud y te contactaremos pronto. Puedes verla en "Mis Solicitudes".
            </p>
            <button
              type="button"
              style={{
                ...botonBase,
                backgroundColor: stylesPublic.colors.primary[500],
                color: stylesPublic.colors.primary.contrast,
                marginBottom: stylesPublic.spacing.scale[3],
              }}
              onClick={() => navigate("/solicitudes")}
            >
              Ver mis solicitudes
            </button>
            <button
              type="button"
              style={{
                ...botonBase,
                background: "transparent",
                color: stylesPublic.colors.text.secondary,
                border: `1px solid ${stylesPublic.colors.neutral[300]}`,
              }}
              onClick={onClose}
            >
              Seguir explorando
            </button>
          </div>
        ) : (
          <>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: stylesPublic.spacing.scale[4],
              }}
            >
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  fontWeight: stylesPublic.typography.weights.semibold,
                  color: stylesPublic.colors.text.primary,
                  margin: 0,
                }}
              >
                Solicitar cotización
              </h3>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: stylesPublic.colors.text.tertiary,
                  display: "flex",
                }}
              >
                <X size={22} />
              </button>
            </div>

            <p
              style={{
                fontSize: stylesPublic.typography.scale.sm,
                color: stylesPublic.colors.text.secondary,
                marginTop: 0,
                marginBottom: stylesPublic.spacing.scale[3],
              }}
            >
              {items.length === 1
                ? "Vas a solicitar información de esta prenda:"
                : `Vas a solicitar información de ${items.length} prendas:`}
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: stylesPublic.spacing.scale[2],
                marginBottom: stylesPublic.spacing.scale[4],
                maxHeight: "180px",
                overflowY: "auto",
              }}
            >
              {items.map((p, idx) => (
                <div
                  key={p.productoId || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: stylesPublic.spacing.scale[3],
                    background: stylesPublic.colors.surface.secondary,
                    borderRadius: stylesPublic.borders.radius.md,
                    padding: stylesPublic.spacing.scale[2],
                  }}
                >
                  <img
                    src={p.imagenURL || "/placeholder.svg"}
                    alt={p.nombre || "Producto"}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "cover",
                      borderRadius: stylesPublic.borders.radius.md,
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg"
                    }}
                  />
                  <span
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.primary,
                    }}
                  >
                    {p.nombre || "Producto"}
                  </span>
                </div>
              ))}
            </div>

            <textarea
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              placeholder="¿Alguna duda? Ej: ¿tienen la talla M? ¿precio? ¿colores?"
              rows={3}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: stylesPublic.spacing.scale[3],
                borderRadius: stylesPublic.borders.radius.md,
                border: `1px solid ${stylesPublic.colors.neutral[300]}`,
                fontFamily: stylesPublic.typography.families.body,
                fontSize: stylesPublic.typography.scale.sm,
                color: stylesPublic.colors.text.primary,
                resize: "vertical",
                marginBottom: stylesPublic.spacing.scale[3],
              }}
            />

            {error && (
              <p
                style={{
                  color: "#dc2626",
                  fontSize: stylesPublic.typography.scale.sm,
                  marginTop: 0,
                  marginBottom: stylesPublic.spacing.scale[3],
                }}
              >
                {error}
              </p>
            )}

            <button
              type="button"
              disabled={enviando}
              onClick={enviarSolicitud}
              style={{
                ...botonBase,
                backgroundColor: stylesPublic.colors.primary[500],
                color: stylesPublic.colors.primary.contrast,
                opacity: enviando ? 0.7 : 1,
                cursor: enviando ? "not-allowed" : "pointer",
                marginBottom: stylesPublic.spacing.scale[3],
              }}
            >
              {enviando ? "Enviando..." : "Enviar solicitud"}
            </button>

            <button
              type="button"
              onClick={enviarPorWhatsApp}
              style={{
                ...botonBase,
                background: "linear-gradient(135deg, #25D366, #128C7E)",
                color: "#ffffff",
              }}
            >
              <MessageCircle size={18} /> Enviar por WhatsApp
            </button>

            <p
              style={{
                fontSize: stylesPublic.typography.scale.xs,
                color: stylesPublic.colors.text.tertiary,
                textAlign: "center",
                marginBottom: 0,
                marginTop: stylesPublic.spacing.scale[3],
              }}
            >
              La solicitud se envía con los datos de tu cuenta.
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default SolicitudModal
