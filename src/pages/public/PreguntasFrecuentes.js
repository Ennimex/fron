import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ChevronDown, MessageCircle } from "lucide-react"
import { publicAPI } from "../../services/api"
import { useConfig } from "../../context/ConfigContext"
import { urlWhatsApp } from "../../utils/whatsapp"
import stylesPublic from "../../styles/stylesGlobal"

// Acordeón de preguntas activas. Si no encuentra respuesta, manda a WhatsApp o al buzón.
const PreguntasFrecuentes = () => {
  const { config } = useConfig()
  const [preguntas, setPreguntas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [abierta, setAbierta] = useState(null)

  useEffect(() => {
    let activo = true
    publicAPI
      .getPreguntasFrecuentes()
      .then((data) => activo && setPreguntas(Array.isArray(data) ? data : []))
      .catch(() => activo && setPreguntas([]))
      .finally(() => activo && setCargando(false))
    return () => {
      activo = false
    }
  }, [])

  const waUrl = urlWhatsApp(config, "Hola, tengo una duda que no encontré en las preguntas frecuentes.")

  const s = {
    main: { maxWidth: "860px", margin: "0 auto", padding: `${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[4]}` },
    item: {
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
      borderRadius: stylesPublic.borders.radius.lg,
      marginBottom: stylesPublic.spacing.scale[3],
      background: stylesPublic.colors.surface.primary,
    },
    boton: {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[3],
      padding: stylesPublic.spacing.scale[4],
      background: "transparent",
      border: "none",
      cursor: "pointer",
      textAlign: "left",
      ...stylesPublic.typography.body.large,
      fontWeight: 600,
    },
    respuesta: {
      padding: `0 ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[4]}`,
      whiteSpace: "pre-wrap",
      ...stylesPublic.typography.body.large,
    },
    pie: { marginTop: stylesPublic.spacing.scale[8], textAlign: "center" },
    enlace: { display: "inline-flex", alignItems: "center", gap: "8px" },
  }

  return (
    <main style={s.main}>
      <h1 style={stylesPublic.typography.headings.h1}>Preguntas frecuentes</h1>
      {cargando && <p style={stylesPublic.typography.body.large}>Cargando...</p>}
      {!cargando && preguntas.length === 0 && (
        <p style={stylesPublic.typography.body.large}>Aún no hay preguntas publicadas.</p>
      )}
      {preguntas.map((p) => {
        const abiertaEsta = abierta === p._id
        return (
          <div key={p._id} style={s.item}>
            <button
              type="button"
              style={s.boton}
              aria-expanded={abiertaEsta}
              aria-controls={`faq-${p._id}`}
              onClick={() => setAbierta(abiertaEsta ? null : p._id)}
            >
              <span>{p.pregunta}</span>
              <ChevronDown
                size={20}
                aria-hidden="true"
                style={{ flexShrink: 0, transform: abiertaEsta ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
              />
            </button>
            {abiertaEsta && (
              <div id={`faq-${p._id}`} style={s.respuesta}>
                {p.respuesta}
              </div>
            )}
          </div>
        )
      })}
      <div style={s.pie}>
        <p style={stylesPublic.typography.body.large}>¿No encontraste tu respuesta?</p>
        {waUrl && (
          <a href={waUrl} target="_blank" rel="noopener noreferrer" style={s.enlace}>
            <MessageCircle size={18} aria-hidden="true" /> Escríbenos por WhatsApp
          </a>
        )}
        <p style={{ marginTop: stylesPublic.spacing.scale[3] }}>
          <Link to="/buzon">Déjanos una queja o sugerencia</Link>
        </p>
      </div>
    </main>
  )
}

export default PreguntasFrecuentes
