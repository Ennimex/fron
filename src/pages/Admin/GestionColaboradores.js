import React, { useState, useEffect, useCallback } from "react";
import { FaSave, FaSpinner, FaPlus, FaEdit, FaTrash, FaTimes, FaUserFriends, FaImage } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import stylesGlobal from "../../styles/stylesGlobal";

const GestionColaboradores = () => {
  const [colaboradores, setColaboradores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const [form, setForm] = useState({ nombre: "", rol: "", descripcion: "" });
  const [fotoFile, setFotoFile] = useState(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const cargar = useCallback(async () => {
    try {
      const lista = await adminAPI.getColaboradores();
      setColaboradores(Array.isArray(lista) ? lista : []);
    } catch (error) {
      setMensaje({ tipo: "error", texto: error?.error || "Error al cargar colaboradores" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const notify = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje({ tipo: "", texto: "" }), 4000);
  };

  const resetForm = () => {
    setForm({ nombre: "", rol: "", descripcion: "" });
    setFotoFile(null);
    setFotoPreview("");
    setEditId(null);
  };

  const editar = (c) => {
    setForm({ nombre: c.nombre || "", rol: c.rol || "", descripcion: c.descripcion || "" });
    setFotoPreview(c.imagen || "");
    setFotoFile(null);
    setEditId(c._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      notify("error", "La foto debe ser una imagen.");
      return;
    }
    setFotoFile(file);
    setFotoPreview(URL.createObjectURL(file));
  };

  const guardar = async (e) => {
    e.preventDefault();
    if (!form.nombre) {
      notify("error", "El nombre es requerido.");
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("nombre", form.nombre);
      fd.append("rol", form.rol);
      fd.append("descripcion", form.descripcion);
      if (fotoFile) fd.append("imagen", fotoFile);

      if (editId) {
        await adminAPI.updateColaborador(editId, fd);
        notify("exito", "Colaborador actualizado.");
      } else {
        await adminAPI.createColaborador(fd);
        notify("exito", "Colaborador agregado.");
      }
      resetForm();
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al guardar el colaborador");
    } finally {
      setSaving(false);
    }
  };

  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar este colaborador?")) return;
    try {
      await adminAPI.deleteColaborador(id);
      notify("exito", "Colaborador eliminado.");
      await cargar();
    } catch (error) {
      notify("error", error?.error || "Error al eliminar el colaborador");
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
    textarea: { width: "100%", padding: "10px 14px", fontSize: "0.95rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", minHeight: "80px", resize: "vertical", fontFamily: stylesGlobal.typography.families.body, marginBottom: "1rem" },
    button: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "10px 22px", fontSize: "0.95rem", fontWeight: 600, color: "#fff", background: stylesGlobal.colors.gradients.primary, border: "none", borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    buttonGhost: { display: "inline-flex", alignItems: "center", gap: "6px", padding: "10px 18px", fontSize: "0.9rem", fontWeight: 600, color: stylesGlobal.colors.text.secondary, background: "transparent", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    item: { display: "flex", alignItems: "center", gap: "14px", padding: "12px", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, marginBottom: "10px" },
    avatar: { width: "52px", height: "52px", borderRadius: "50%", objectFit: "cover", border: `2px solid ${stylesGlobal.colors.primary[200]}`, flexShrink: 0 },
    iconBtn: { background: "none", border: "none", cursor: "pointer", padding: "6px", color: stylesGlobal.colors.text.secondary },
    fotoBox: { display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" },
    fotoPreview: { width: "80px", height: "80px", objectFit: "cover", borderRadius: "50%", border: `1px solid ${stylesGlobal.borders.colors.muted}`, background: "#fafafa" },
    alert: (tipo) => ({ padding: "12px 16px", borderRadius: stylesGlobal.borders.radius.md, marginBottom: "1rem", fontWeight: 600, fontSize: "0.9rem", background: tipo === "exito" ? "rgba(34,197,94,0.12)" : "rgba(225,29,72,0.1)", color: tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main, borderLeft: `4px solid ${tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main}` }),
    grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
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
        <FaUserFriends size={22} color={stylesGlobal.colors.primary[500]} />
        <h1 style={s.title}>Colaboradores / Equipo</h1>
      </div>

      {mensaje.texto && <div style={s.alert(mensaje.tipo)}>{mensaje.texto}</div>}

      {/* Formulario */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>{editId ? "Editar colaborador" : "Agregar colaborador"}</h2>
        <form onSubmit={guardar}>
          <div style={s.fotoBox}>
            {fotoPreview ? (
              <img src={fotoPreview} alt="Foto" style={s.fotoPreview} />
            ) : (
              <div style={{ ...s.fotoPreview, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
                <FaImage size={24} />
              </div>
            )}
            <label style={{ ...s.button, background: stylesGlobal.colors.neutral[700] }}>
              <FaImage /> {fotoPreview ? "Cambiar foto" : "Subir foto"}
              <input type="file" accept="image/*" onChange={handleFoto} style={{ display: "none" }} />
            </label>
          </div>

          <div style={s.grid2}>
            <div>
              <label style={s.label}>Nombre</label>
              <input style={s.input} value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} placeholder="Nombre completo" />
            </div>
            <div>
              <label style={s.label}>Rol</label>
              <input style={s.input} value={form.rol} onChange={(e) => setForm({ ...form, rol: e.target.value })} placeholder="Ej. Maestra artesana" />
            </div>
          </div>

          <label style={s.label}>Descripción (opcional)</label>
          <textarea style={s.textarea} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Breve descripción" />

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={{ ...s.button, opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? <FaSpinner className="spin" /> : editId ? <FaSave /> : <FaPlus />}
              {editId ? "Guardar cambios" : "Agregar colaborador"}
            </button>
            {editId && (
              <button type="button" style={s.buttonGhost} onClick={resetForm}>
                <FaTimes /> Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista */}
      <div style={s.card}>
        <h2 style={s.sectionTitle}>Colaboradores actuales ({colaboradores.length})</h2>
        {colaboradores.length === 0 && <p style={{ color: stylesGlobal.colors.text.muted }}>Aún no hay colaboradores. Agrega el primero arriba.</p>}
        {colaboradores.map((c) => (
          <div key={c._id} style={s.item}>
            <img
              src={c.imagen || `https://ui-avatars.com/api/?name=${encodeURIComponent(c.nombre || "?")}&background=random&color=fff&size=80`}
              alt={c.nombre}
              style={s.avatar}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, color: stylesGlobal.colors.text.primary }}>{c.nombre}</div>
              <div style={{ fontSize: "0.875rem", color: stylesGlobal.colors.primary[500] }}>{c.rol}</div>
              {c.descripcion && <div style={{ fontSize: "0.8rem", color: stylesGlobal.colors.text.secondary }}>{c.descripcion}</div>}
            </div>
            <button style={s.iconBtn} onClick={() => editar(c)} title="Editar"><FaEdit /></button>
            <button style={{ ...s.iconBtn, color: stylesGlobal.colors.semantic.error.main }} onClick={() => eliminar(c._id)} title="Eliminar"><FaTrash /></button>
          </div>
        ))}
      </div>

      <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default GestionColaboradores;
