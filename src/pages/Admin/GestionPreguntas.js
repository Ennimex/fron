import React, { useState, useEffect, useCallback } from "react";
import { FaSave, FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes, FaQuestionCircle, FaArrowUp, FaArrowDown, FaEye, FaEyeSlash } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import stylesGlobal from "../../styles/stylesGlobal";

const FORM_VACIO = { pregunta: "", respuesta: "" };

const GestionPreguntas = () => {
  const [preguntas, setPreguntas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });
  const [form, setForm] = useState(FORM_VACIO);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const lista = await adminAPI.getPreguntasTodas();
      setPreguntas(Array.isArray(lista) ? lista : []);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error?.error || "Error al cargar las preguntas" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const notify = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
  };

  const resetForm = () => { setForm(FORM_VACIO); setEditId(null); };

  const editar = (p) => {
    setForm({ pregunta: p.pregunta || "", respuesta: p.respuesta || "" });
    setEditId(p._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.pregunta.trim() || !form.respuesta.trim()) {
      notify("error", "Pregunta y respuesta son obligatorias.");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await adminAPI.updatePregunta(editId, form);
        notify("exito", "Pregunta actualizada.");
      } else {
        await adminAPI.createPregunta({ ...form, orden: preguntas.length });
        notify("exito", "Pregunta agregada.");
      }
      resetForm();
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al guardar la pregunta");
    } finally {
      setSaving(false);
    }
  };

  const alternarActiva = async (p) => {
    try {
      await adminAPI.updatePregunta(p._id, { activa: !p.activa });
      await cargar();
    } catch (error) {
      notify("error", error?.error || "No se pudo cambiar la visibilidad");
    }
  };

  // Intercambia el orden con la vecina de arriba o de abajo
  const mover = async (indice, direccion) => {
    const destino = indice + direccion;
    if (destino < 0 || destino >= preguntas.length) return;
    const a = preguntas[indice];
    const b = preguntas[destino];
    try {
      await Promise.all([
        adminAPI.updatePregunta(a._id, { orden: destino }),
        adminAPI.updatePregunta(b._id, { orden: indice }),
      ]);
      await cargar();
    } catch (error) {
      notify("error", error?.error || "No se pudo reordenar");
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar esta pregunta?")) return;
    try {
      await adminAPI.deletePregunta(id);
      notify("exito", "Pregunta eliminada.");
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al eliminar");
    }
  };

  const s = {
    container: { padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: stylesGlobal.typography.families.body },
    header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" },
    title: { fontSize: "1.6rem", fontWeight: 700, color: stylesGlobal.colors.text.primary, margin: 0, fontFamily: stylesGlobal.typography.families.display },
    card: { background: "#fff", borderRadius: stylesGlobal.borders.radius.lg, boxShadow: stylesGlobal.shadows.md, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${stylesGlobal.borders.colors.muted}` },
    sectionTitle: { fontSize: "1.15rem", fontWeight: 600, color: stylesGlobal.colors.primary[600], marginBottom: "1rem" },
    label: { display: "block", marginBottom: "6px", fontSize: "0.9rem", fontWeight: 600, color: stylesGlobal.colors.text.primary },
    input: { width: "100%", padding: "10px 14px", fontSize: "0.95rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", fontFamily: stylesGlobal.typography.families.body, marginBottom: "1rem" },
    textarea: { width: "100%", padding: "10px 14px", fontSize: "0.95rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", minHeight: "100px", resize: "vertical", fontFamily: stylesGlobal.typography.families.body, marginBottom: "1rem" },
    button: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", fontSize: "0.95rem", fontWeight: 600, color: "#fff", background: stylesGlobal.colors.gradients.primary, border: "none", borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    buttonGhost: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "0.9rem", fontWeight: 600, color: stylesGlobal.colors.text.secondary, background: "transparent", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    item: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, marginBottom: "10px" },
    iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "6px", color: stylesGlobal.colors.text.secondary },
    alert: (tipo) => ({ padding: "12px 16px", borderRadius: stylesGlobal.borders.radius.md, marginBottom: "1rem", fontWeight: 600, fontSize: "0.9rem", background: tipo === "exito" ? "rgba(34,197,94,0.12)" : "rgba(225,29,72,0.1)", color: tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main, borderLeft: `4px solid ${tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main}` }),
  };

  if (loading) {
    return (
      <div style={{ ...s.container, textAlign: "center", paddingTop: "4rem" }}>
        <FaSpinner className="spin" /> Cargando...
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <FaQuestionCircle size={22} color={stylesGlobal.colors.primary[500]} />
        <h1 style={s.title}>Preguntas frecuentes</h1>
      </div>

      {mensaje.texto && <div style={s.alert(mensaje.tipo)}>{mensaje.texto}</div>}

      <div style={s.card}>
        <h2 style={s.sectionTitle}>{editId ? "Editar pregunta" : "Nueva pregunta"}</h2>
        <form onSubmit={guardar}>
          <label style={s.label} htmlFor="faq-pregunta">Pregunta</label>
          <input id="faq-pregunta" style={s.input} value={form.pregunta} maxLength={200} onChange={(e) => setForm({ ...form, pregunta: e.target.value })} placeholder="Ej. ¿Cuánto tarda un pedido?" />
          <label style={s.label} htmlFor="faq-respuesta">Respuesta</label>
          <textarea id="faq-respuesta" style={s.textarea} value={form.respuesta} maxLength={2000} onChange={(e) => setForm({ ...form, respuesta: e.target.value })} placeholder="Respuesta clara y corta" />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ ...s.button, opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? <FaSpinner className="spin" /> : editId ? <FaSave /> : <FaPlus />}
              {editId ? "Guardar cambios" : "Agregar pregunta"}
            </button>
            {editId && (
              <button type="button" style={s.buttonGhost} onClick={resetForm}>
                <FaTimes /> Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div style={s.card}>
        <h2 style={s.sectionTitle}>Preguntas ({preguntas.length})</h2>
        {preguntas.length === 0 && <p style={{ color: stylesGlobal.colors.text.muted }}>Aún no hay preguntas. Agrega la primera arriba.</p>}
        {preguntas.map((p, i) => (
          <div key={p._id} style={{ ...s.item, opacity: p.activa ? 1 : 0.55 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <button style={s.iconBtn} onClick={() => mover(i, -1)} disabled={i === 0} title="Subir" aria-label="Subir"><FaArrowUp /></button>
              <button style={s.iconBtn} onClick={() => mover(i, 1)} disabled={i === preguntas.length - 1} title="Bajar" aria-label="Bajar"><FaArrowDown /></button>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: stylesGlobal.colors.text.primary }}>{p.pregunta}</div>
              <div style={{ fontSize: "0.875rem", color: stylesGlobal.colors.text.secondary, whiteSpace: "pre-wrap" }}>{p.respuesta}</div>
              {!p.activa && <div style={{ fontSize: "0.8rem", color: stylesGlobal.colors.text.muted }}>Oculta en el sitio</div>}
            </div>
            <button style={s.iconBtn} onClick={() => alternarActiva(p)} title={p.activa ? "Ocultar" : "Publicar"} aria-label={p.activa ? "Ocultar" : "Publicar"}>{p.activa ? <FaEye /> : <FaEyeSlash />}</button>
            <button style={s.iconBtn} onClick={() => editar(p)} title="Editar" aria-label="Editar"><FaEdit /></button>
            <button style={{ ...s.iconBtn, color: stylesGlobal.colors.semantic.error.main }} onClick={() => eliminar(p._id)} title="Eliminar" aria-label="Eliminar"><FaTrash /></button>
          </div>
        ))}
      </div>

      <style>{`.spin{animation:spin 1s linear infinite}`}</style>
    </div>
  );
};

export default GestionPreguntas;
