import React, { useState, useEffect, useCallback } from "react";
import { FaInbox, FaSpinner, FaTrash, FaWhatsapp, FaEnvelope, FaCheck, FaEnvelopeOpen } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import { urlWhatsApp } from "../../utils/whatsapp";
import stylesGlobal from "../../styles/stylesGlobal";

const ETIQUETA_TIPO = { queja: "Queja", sugerencia: "Sugerencia", felicitacion: "Felicitación" };
const ETIQUETA_ESTADO = { nuevo: "Nuevo", leido: "Leído", atendido: "Atendido" };

const GestionBuzon = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({ estado: "", tipo: "" });
  const [aviso, setAviso] = useState({ tipo: "", texto: "" });
  const [notas, setNotas] = useState({}); // id → texto en edición

  const notify = (tipo, texto) => {
    setAviso({ tipo, texto });
    setTimeout(() => setAviso({ tipo: "", texto: "" }), 4000);
  };

  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (filtros.estado) params.estado = filtros.estado;
      if (filtros.tipo) params.tipo = filtros.tipo;
      const lista = await adminAPI.getBuzon(params);
      setMensajes(Array.isArray(lista) ? lista : []);
    } catch (error) {
      notify("error", error?.error || "Error al cargar el buzón");
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => { cargar(); }, [cargar]);

  const cambiarEstado = async (m, estado) => {
    try {
      await adminAPI.updateBuzon(m._id, { estado });
      await cargar();
    } catch (error) {
      notify("error", error?.error || "No se pudo cambiar el estado");
    }
  };

  const guardarNota = async (m) => {
    try {
      await adminAPI.updateBuzon(m._id, { notaInterna: notas[m._id] ?? m.notaInterna ?? "" });
      notify("exito", "Nota guardada.");
      await cargar();
    } catch (error) {
      notify("error", error?.error || "No se pudo guardar la nota");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este mensaje?")) return;
    try {
      await adminAPI.deleteBuzon(id);
      notify("exito", "Mensaje eliminado.");
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al eliminar");
    }
  };

  const s = {
    container: { padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: stylesGlobal.typography.families.body },
    header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" },
    title: { fontSize: "1.6rem", fontWeight: 700, color: stylesGlobal.colors.text.primary, margin: 0, fontFamily: stylesGlobal.typography.families.display },
    filtros: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "1rem" },
    select: { padding: "8px 12px", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, fontFamily: stylesGlobal.typography.families.body },
    card: { background: "#fff", borderRadius: stylesGlobal.borders.radius.lg, boxShadow: stylesGlobal.shadows.md, padding: "1.25rem", marginBottom: "1rem", border: `1px solid ${stylesGlobal.borders.colors.muted}` },
    meta: { display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center", fontSize: "0.85rem", color: stylesGlobal.colors.text.secondary, marginBottom: "8px" },
    chip: (fondo) => ({ padding: "2px 10px", borderRadius: "999px", fontWeight: 600, fontSize: "0.78rem", background: fondo, color: "#fff" }),
    mensaje: { whiteSpace: "pre-wrap", color: stylesGlobal.colors.text.primary, marginBottom: "10px" },
    acciones: { display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" },
    btn: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "6px 12px", fontSize: "0.85rem", fontWeight: 600, border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, background: "#fff", cursor: "pointer", color: stylesGlobal.colors.text.primary, textDecoration: "none" },
    textarea: { width: "100%", padding: "8px 12px", fontSize: "0.9rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", minHeight: "60px", resize: "vertical", fontFamily: stylesGlobal.typography.families.body, marginTop: "10px" },
    alert: (tipo) => ({ padding: "12px 16px", borderRadius: stylesGlobal.borders.radius.md, marginBottom: "1rem", fontWeight: 600, fontSize: "0.9rem", background: tipo === "exito" ? "rgba(34,197,94,0.12)" : "rgba(225,29,72,0.1)", color: tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main }),
  };

  const colorTipo = { queja: stylesGlobal.colors.semantic.error.main, sugerencia: stylesGlobal.colors.primary[500], felicitacion: stylesGlobal.colors.semantic.success.main };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <FaInbox size={22} color={stylesGlobal.colors.primary[500]} />
        <h1 style={s.title}>Buzón de quejas y sugerencias</h1>
      </div>

      {aviso.texto && <div style={s.alert(aviso.tipo)}>{aviso.texto}</div>}

      <div style={s.filtros}>
        <select style={s.select} value={filtros.estado} onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })} aria-label="Filtrar por estado">
          <option value="">Todos los estados</option>
          <option value="nuevo">Nuevos</option>
          <option value="leido">Leídos</option>
          <option value="atendido">Atendidos</option>
        </select>
        <select style={s.select} value={filtros.tipo} onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })} aria-label="Filtrar por tipo">
          <option value="">Todos los tipos</option>
          <option value="queja">Quejas</option>
          <option value="sugerencia">Sugerencias</option>
          <option value="felicitacion">Felicitaciones</option>
        </select>
      </div>

      {loading && <p><FaSpinner className="spin" /> Cargando...</p>}
      {!loading && mensajes.length === 0 && <p style={{ color: stylesGlobal.colors.text.muted }}>No hay mensajes con esos filtros.</p>}

      {mensajes.map((m) => {
        // Para escribirle por WhatsApp se usa SU teléfono, no el del negocio
        const wa = m.telefono ? urlWhatsApp({ redesSociales: { whatsapp: m.telefono } }, `Hola ${m.nombre || ""}, te escribimos de La Aterciopelada por tu ${(ETIQUETA_TIPO[m.tipo] || "mensaje").toLowerCase()}.`) : null;
        return (
          <div key={m._id} style={{ ...s.card, borderLeft: `4px solid ${colorTipo[m.tipo] || "#999"}` }}>
            <div style={s.meta}>
              <span style={s.chip(colorTipo[m.tipo] || "#999")}>{ETIQUETA_TIPO[m.tipo] || m.tipo}</span>
              <span>{ETIQUETA_ESTADO[m.estado] || m.estado}</span>
              <span>{new Date(m.createdAt).toLocaleString("es-MX")}</span>
              <span>{m.nombre || "Anónimo"}</span>
              {m.email && <span>{m.email}</span>}
              {m.telefono && <span>{m.telefono}</span>}
            </div>
            <div style={s.mensaje}>{m.mensaje}</div>
            <div style={s.acciones}>
              {m.estado === "nuevo" && (
                <button style={s.btn} onClick={() => cambiarEstado(m, "leido")}><FaEnvelopeOpen /> Marcar leído</button>
              )}
              {m.estado !== "atendido" && (
                <button style={s.btn} onClick={() => cambiarEstado(m, "atendido")}><FaCheck /> Marcar atendido</button>
              )}
              {wa && (
                <a style={s.btn} href={wa} target="_blank" rel="noopener noreferrer"><FaWhatsapp /> WhatsApp</a>
              )}
              {m.email && (
                <a style={s.btn} href={`mailto:${m.email}?subject=${encodeURIComponent("Sobre tu mensaje a La Aterciopelada")}`}><FaEnvelope /> Correo</a>
              )}
              <button style={{ ...s.btn, color: stylesGlobal.colors.semantic.error.main, marginLeft: "auto" }} onClick={() => eliminar(m._id)}><FaTrash /> Eliminar</button>
            </div>
            <textarea
              style={s.textarea}
              placeholder="Nota interna: qué se respondió o se hizo"
              value={notas[m._id] ?? m.notaInterna ?? ""}
              onChange={(e) => setNotas({ ...notas, [m._id]: e.target.value })}
              onBlur={() => (notas[m._id] !== undefined && notas[m._id] !== (m.notaInterna || "")) && guardarNota(m)}
              aria-label="Nota interna"
            />
          </div>
        );
      })}

      <style>{`.spin{animation:spin 1s linear infinite}`}</style>
    </div>
  );
};

export default GestionBuzon;
