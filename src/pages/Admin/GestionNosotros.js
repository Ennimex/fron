import React, { useState, useEffect, useCallback } from "react";
import { FaSave, FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes, FaBook } from "react-icons/fa";
import { Heart, Leaf, Palette, Star, Users, Award, Shield, Sparkles, Gem, Sun } from "lucide-react";
import { adminAPI } from "../../services/api";
import stylesGlobal from "../../styles/stylesGlobal";

// Iconos disponibles para los valores (se guardan por nombre)
const ICON_MAP = { Heart, Leaf, Palette, Star, Users, Award, Shield, Sparkles, Gem, Sun };
const ICON_OPTIONS = Object.keys(ICON_MAP);

const GestionNosotros = () => {
  const [historia, setHistoria] = useState("");
  const [savingHistoria, setSavingHistoria] = useState(false);

  const [valores, setValores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  // Formulario de valor (crear/editar)
  const [valorForm, setValorForm] = useState({ icon: "Heart", titulo: "", descripcion: "" });
  const [editId, setEditId] = useState(null);
  const [savingValor, setSavingValor] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const [nosotros, listaValores] = await Promise.all([
        adminAPI.getNosotros(),
        adminAPI.getValores(),
      ]);
      setHistoria(nosotros?.historia || "");
      setValores(Array.isArray(listaValores) ? listaValores : []);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error?.error || "Error al cargar la información" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const notify = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
  };

  const guardarHistoria = async () => {
    setSavingHistoria(true);
    try {
      await adminAPI.updateNosotros({ historia });
      notify("exito", "Historia guardada correctamente.");
    } catch (error) {
      notify("error", error?.error || "Error al guardar la historia");
    } finally {
      setSavingHistoria(false);
    }
  };

  const resetForm = () => {
    setValorForm({ icon: "Heart", titulo: "", descripcion: "" });
    setEditId(null);
  };

  const editarValor = (v) => {
    setValorForm({ icon: v.icon || "Heart", titulo: v.titulo || "", descripcion: v.descripcion || "" });
    setEditId(v._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const guardarValor = async (e) => {
    e.preventDefault();
    if (!valorForm.titulo || !valorForm.descripcion) {
      notify("error", "Título y descripción son requeridos.");
      return;
    }
    setSavingValor(true);
    try {
      if (editId) {
        await adminAPI.updateValor(editId, valorForm);
        notify("exito", "Valor actualizado.");
      } else {
        await adminAPI.createValor(valorForm);
        notify("exito", "Valor agregado.");
      }
      resetForm();
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al guardar el valor");
    } finally {
      setSavingValor(false);
    }
  };

  const eliminarValor = async (id) => {
    if (!window.confirm("¿Eliminar este valor?")) return;
    try {
      await adminAPI.deleteValor(id);
      notify("exito", "Valor eliminado.");
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al eliminar el valor");
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
    textarea: { width: "100%", padding: "10px 14px", fontSize: "0.95rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", minHeight: "140px", resize: "vertical", fontFamily: stylesGlobal.typography.families.body, marginBottom: "1rem" },
    button: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", fontSize: "0.95rem", fontWeight: 600, color: "#fff", background: stylesGlobal.colors.gradients.primary, border: "none", borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    buttonGhost: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "0.9rem", fontWeight: 600, color: stylesGlobal.colors.text.secondary, background: "transparent", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    valorItem: { display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, marginBottom: "10px" },
    iconBadge: { width: "40px", height: "40px", borderRadius: "50%", background: stylesGlobal.colors.primary[50], color: stylesGlobal.colors.primary[600], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
    iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "6px", color: stylesGlobal.colors.text.secondary },
    alert: (tipo) => ({ padding: "12px 16px", borderRadius: stylesGlobal.borders.radius.md, marginBottom: "1rem", fontWeight: 600, fontSize: "0.9rem", background: tipo === "exito" ? "rgba(34,197,94,0.12)" : "rgba(225,29,72,0.1)", color: tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main, borderLeft: `4px solid ${tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main}` }),
    grid2: { display: "grid", gridTemplateColumns: "120px 1fr", gap: "1rem", alignItems: "start" },
  };

  if (loading) {
    return (
      <div style={{ ...s.container, textAlign: "center", paddingTop: "4rem" }}>
        <FaSpinner className="spin" /> Cargando...
        <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <FaBook size={22} color={stylesGlobal.colors.primary[500]} />
        <h1 style={s.title}>Nosotros: Historia y Valores</h1>
      </div>

      {mensaje.texto && <div style={s.alert(mensaje.tipo)}>{mensaje.texto}</div>}

      {/* Historia */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>Historia</h2>
        <label style={s.label}>Texto de la historia</label>
        <textarea style={s.textarea} value={historia} onChange={(e) => setHistoria(e.target.value)} placeholder="Escribe la historia de la empresa..." />
        <button style={{ ...s.button, opacity: savingHistoria ? 0.7 : 1 }} onClick={guardarHistoria} disabled={savingHistoria}>
          {savingHistoria ? <FaSpinner className="spin" /> : <FaSave />} Guardar historia
        </button>
      </div>

      {/* Formulario de valor */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>{editId ? "Editar valor" : "Agregar valor"}</h2>
        <form onSubmit={guardarValor}>
          <div style={s.grid2}>
            <div>
              <label style={s.label}>Icono</label>
              <select style={s.input} value={valorForm.icon} onChange={(e) => setValorForm({ ...valorForm, icon: e.target.value })}>
                {ICON_OPTIONS.map((name) => <option key={name} value={name}>{name}</option>)}
              </select>
            </div>
            <div>
              <label style={s.label}>Título</label>
              <input style={s.input} value={valorForm.titulo} onChange={(e) => setValorForm({ ...valorForm, titulo: e.target.value })} placeholder="Ej. Comercio Justo" />
            </div>
          </div>
          <label style={s.label}>Descripción</label>
          <textarea style={{ ...s.textarea, minHeight: "90px" }} value={valorForm.descripcion} onChange={(e) => setValorForm({ ...valorForm, descripcion: e.target.value })} placeholder="Descripción del valor" />
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ ...s.button, opacity: savingValor ? 0.7 : 1 }} disabled={savingValor}>
              {savingValor ? <FaSpinner className="spin" /> : editId ? <FaSave /> : <FaPlus />}
              {editId ? "Guardar cambios" : "Agregar valor"}
            </button>
            {editId && (
              <button type="button" style={s.buttonGhost} onClick={resetForm}>
                <FaTimes /> Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de valores */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>Valores actuales ({valores.length})</h2>
        {valores.length === 0 && <p style={{ color: stylesGlobal.colors.text.muted }}>Aún no hay valores. Agrega el primero arriba.</p>}
        {valores.map((v) => {
          const Icono = ICON_MAP[v.icon] || Star;
          return (
            <div key={v._id} style={s.valorItem}>
              <div style={s.iconBadge}><Icono size={20} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: stylesGlobal.colors.text.primary }}>{v.titulo}</div>
                <div style={{ fontSize: "0.875rem", color: stylesGlobal.colors.text.secondary }}>{v.descripcion}</div>
              </div>
              <button style={s.iconBtn} onClick={() => editarValor(v)} title="Editar"><FaEdit /></button>
              <button style={{ ...s.iconBtn, color: stylesGlobal.colors.semantic.error.main }} onClick={() => eliminarValor(v._id)} title="Eliminar"><FaTrash /></button>
            </div>
          );
        })}
      </div>

      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default GestionNosotros;
