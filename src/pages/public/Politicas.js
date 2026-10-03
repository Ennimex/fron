import React, { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useConfig } from "../../context/ConfigContext"
import stylesPublic from "../../styles/stylesGlobal"

// Muestra los textos legales que la clienta captura en Configuración.
// Con HashRouter la URL real es /#/politicas#privacidad y el navegador no
// hace scroll al ancla por sí solo, así que lo hacemos aquí.
const Seccion = ({ id, titulo, texto }) => (
  <section id={id} tabIndex={-1} style={{ marginBottom: stylesPublic.spacing.scale[8], outline: "none" }}>
    <h2 style={{ ...stylesPublic.typography.headings.h2, marginBottom: stylesPublic.spacing.scale[4] }}>{titulo}</h2>
    {texto ? (
      <div style={{ ...stylesPublic.typography.body.large, whiteSpace: "pre-wrap" }}>{texto}</div>
    ) : (
      <p style={stylesPublic.typography.body.large}>Este documento aún no se ha publicado.</p>
    )}
  </section>
)

const Politicas = () => {
  const { config } = useConfig()
  const { hash } = useLocation()

  useEffect(() => {
    const id = (hash || "").replace("#", "")
    if (!id) return
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" })
      el.focus({ preventScroll: true })
    }
  }, [hash])

  return (
    <main style={{ maxWidth: "860px", margin: "0 auto", padding: `${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[4]}` }}>
      <h1 style={{ ...stylesPublic.typography.headings.h1, marginBottom: stylesPublic.spacing.scale[8] }}>Políticas</h1>
      <Seccion id="terminos" titulo="Términos y Condiciones" texto={config?.terminosCondiciones} />
      <Seccion id="privacidad" titulo="Aviso de Privacidad" texto={config?.avisoPrivacidad} />
    </main>
  )
}

export default Politicas
