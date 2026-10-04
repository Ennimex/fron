import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Send } from "lucide-react"
import { publicAPI } from "../../services/api"
import stylesPublic from "../../styles/stylesGlobal"

const TIPOS = [
  { valor: "queja", etiqueta: "Queja" },
  { valor: "sugerencia", etiqueta: "Sugerencia" },
  { valor: "felicitacion", etiqueta: "Felicitación" },
]

const FORM_VACIO = { tipo: "sugerencia", nombre: "", email: "", telefono: "", mensaje: "", quiereContacto: false }

// Buzón de quejas y sugerencias. Admite anónimos; si quiere que lo contacten,
// pide correo o teléfono. Sustituye los "comentarios de la comunidad" sin backend.
const Buzon = () => {
  const [form, setForm] = useState(FORM_VACIO)
  const [enviando, setEnviando] = useState(false)
  const [error, setError] = useState("")
  const [enviado, setEnviado] = useState(false)

  const cambiar = (e) => {
    const { name, value, type, checked } = e.target
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }))
  }

  const enviar = async (e) => {
    e.preventDefault()
    setError("")
    if (!form.mensaje.trim()) {
      setError("Escribe tu mensaje.")
      return
    }
    if (form.quiereContacto && !form.email.trim() && !form.telefono.trim()) {
      setError("Para contactarte necesitamos tu correo o tu teléfono.")
      return
    }
    setEnviando(true)
    try {
      await publicAPI.enviarBuzon({ ...form, mensaje: form.mensaje.trim() })
      setEnviado(true)
      setForm(FORM_VACIO)
    } catch (err) {
      setError(err?.error || "No se pudo enviar. Intenta de nuevo.")
    } finally {
      setEnviando(false)
    }
  }

  const s = {
    main: { maxWidth: "720px", margin: "0 auto", padding: `${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[4]}` },
    campo: { display: "block", marginBottom: stylesPublic.spacing.scale[4] },
    etiqueta: { display: "block", marginBottom: "6px", fontWeight: 600 },
    input: {
      width: "100%",
      padding: "10px 14px",
      border: `1px solid ${stylesPublic.colors.neutral[300]}`,
      borderRadius: stylesPublic.borders.radius.md,
      boxSizing: "border-box",
      fontFamily: "inherit",
      fontSize: "1rem",
    },
    radios: { display: "flex", gap: stylesPublic.spacing.scale[4], flexWrap: "wrap", marginBottom: stylesPublic.spacing.scale[4] },
    error: { color: stylesPublic.colors.semantic.error.main, marginBottom: stylesPublic.spacing.scale[3] },
    boton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      border: "none",
      borderRadius: stylesPublic.borders.radius.md,
      background: stylesPublic.colors.gradients.primary,
      color: "#fff",
      fontWeight: 600,
      cursor: "pointer",
    },
  }

  if (enviado) {
    return (
      <main style={s.main}>
        <h1 style={stylesPublic.typography.headings.h1}>Gracias</h1>
        <p style={stylesPublic.typography.body.large}>Recibimos tu mensaje. Si dejaste un medio de contacto, te buscaremos pronto.</p>
        <p>
          <Link to="/">Volver al inicio</Link>
        </p>
      </main>
    )
  }

  return (
    <main style={s.main}>
      <h1 style={stylesPublic.typography.headings.h1}>Quejas y sugerencias</h1>
      <p style={stylesPublic.typography.body.large}>
        Cuéntanos qué podemos mejorar o qué te gustó. Puedes escribir sin dejar tu nombre.
      </p>
      <form onSubmit={enviar} noValidate>
        <fieldset style={{ border: "none", padding: 0, margin: 0 }}>
          <legend style={s.etiqueta}>Tipo de mensaje</legend>
          <div style={s.radios}>
            {TIPOS.map((t) => (
              <label key={t.valor} style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <input type="radio" name="tipo" value={t.valor} checked={form.tipo === t.valor} onChange={cambiar} />
                {t.etiqueta}
              </label>
            ))}
          </div>
        </fieldset>

        <label style={s.campo}>
          <span style={s.etiqueta}>Mensaje</span>
          <textarea name="mensaje" value={form.mensaje} onChange={cambiar} rows={5} maxLength={2000} style={s.input} />
        </label>

        <label style={s.campo}>
          <span style={s.etiqueta}>Nombre (opcional)</span>
          <input name="nombre" value={form.nombre} onChange={cambiar} style={s.input} />
        </label>
        <label style={s.campo}>
          <span style={s.etiqueta}>Correo (opcional)</span>
          <input name="email" type="email" value={form.email} onChange={cambiar} style={s.input} />
        </label>
        <label style={s.campo}>
          <span style={s.etiqueta}>Teléfono (opcional)</span>
          <input name="telefono" type="tel" value={form.telefono} onChange={cambiar} style={s.input} />
        </label>
        <label style={{ ...s.campo, display: "flex", alignItems: "center", gap: "8px" }}>
          <input type="checkbox" name="quiereContacto" checked={form.quiereContacto} onChange={cambiar} />
          Quiero que me contacten
        </label>

        {error && (
          <p role="alert" style={s.error}>
            {error}
          </p>
        )}

        <button type="submit" style={s.boton} disabled={enviando}>
          <Send size={18} aria-hidden="true" /> {enviando ? "Enviando..." : "Enviar"}
        </button>
      </form>
    </main>
  )
}

export default Buzon
