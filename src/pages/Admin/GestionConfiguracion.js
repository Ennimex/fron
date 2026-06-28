import React, { useState, useEffect, useCallback } from "react";
import { FaSave, FaSpinner, FaImage, FaCog } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import { useConfig } from "../../context/ConfigContext";
import stylesGlobal from "../../styles/stylesGlobal";

const GestionConfiguracion = () => {
  const { refreshConfig } = useConfig();

  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    direccion: "",
    telefono: "",
    email: "",
    horarios: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
    twitter: "",
    tiktok: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mensaje, setMensaje] = useState({ tipo: "", texto: "" });

  const cargar = useCallback(async () => {
    try {
      const data = await adminAPI.getConfiguracion();
      const redes = data?.redesSociales || {};
      setForm({
        nombre: data?.nombre || "",
        descripcion: data?.descripcion || "",
        direccion: data?.direccion || "",
        telefono: data?.telefono || "",
        email: data?.email || "",
        horarios: data?.horarios || "",
        facebook: redes.facebook || "",
        instagram: redes.instagram || "",
        whatsapp: redes.whatsapp || "",
        twitter: redes.twitter || "",
        tiktok: redes.tiktok || "",
      });
      setLogoPreview(data?.logoUrl || "");
    } catch (error) {
      setMensaje({ tipo: "error", texto: error?.error || "No se pudo cargar la configuración" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogo = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setMensaje({ tipo: "error", texto: "El logo debe ser una imagen." });
      return;
    }
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMensaje({ tipo: "", texto: "" });

    try {
      const fd = new FormData();
      fd.append("nombre", form.nombre);
      fd.append("descripcion", form.descripcion);
      fd.append("direccion", form.direccion);
      fd.append("telefono", form.telefono);
      fd.append("email", form.email);
      fd.append("horarios", form.horarios);
      fd.append("redesSociales[facebook]", form.facebook);
      fd.append("redesSociales[instagram]", form.instagram);
      fd.append("redesSociales[whatsapp]", form.whatsapp);
      fd.append("redesSociales[twitter]", form.twitter);
      fd.append("redesSociales[tiktok]", form.tiktok);
      if (logoFile) fd.append("logo", logoFile);

      await adminAPI.updateConfiguracion(fd);
      setMensaje({ tipo: "exito", texto: "Configuración guardada correctamente." });
      setLogoFile(null);
      // Refrescar el contexto para que Navbar/Footer/Contacto se actualicen
      await refreshConfig();
    } catch (error) {
      setMensaje({ tipo: "error", texto: error?.error || "Error al guardar la configuración" });
    } finally {
      setSaving(false);
    }
  };

  const s = {
    container: { padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: stylesGlobal.typography.families.body },
    header: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" },
    title: { fontSize: "1.6rem", fontWeight: 700, color: stylesGlobal.colors.text.primary, margin: 0, fontFamily: stylesGlobal.typography.families.display },
    card: { background: "#fff", borderRadius: stylesGlobal.borders.radius.lg, boxShadow: stylesGlobal.shadows.md, padding: "1.5rem", marginBottom: "1.5rem", border: `1px solid ${stylesGlobal.borders.colors.muted}` },
    sectionTitle: { fontSize: "1.1rem", fontWeight: 600, color: stylesGlobal.colors.primary[600], marginBottom: "1rem" },
    group: { marginBottom: "1rem" },
    label: { display: "block", marginBottom: "6px", fontSize: "0.9rem", fontWeight: 600, color: stylesGlobal.colors.text.primary },
    input: { width: "100%", padding: "10px 14px", fontSize: "0.95rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", fontFamily: stylesGlobal.typography.families.body },
    textarea: { width: "100%", padding: "10px 14px", fontSize: "0.95rem", border: `1px solid ${stylesGlobal.borders.colors.muted}`, borderRadius: stylesGlobal.borders.radius.md, boxSizing: "border-box", minHeight: "80px", resize: "vertical", fontFamily: stylesGlobal.typography.families.body },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem" },
    logoBox: { display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" },
    logoPreview: { width: "96px", height: "96px", objectFit: "contain", borderRadius: stylesGlobal.borders.radius.md, border: `1px solid ${stylesGlobal.borders.colors.muted}`, background: "#fafafa" },
    button: { display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 28px", fontSize: "1rem", fontWeight: 600, color: "#fff", background: stylesGlobal.colors.gradients.primary, border: "none", borderRadius: stylesGlobal.borders.radius.lg, cursor: "pointer" },
    alert: (tipo) => ({
      padding: "12px 16px", borderRadius: stylesGlobal.borders.radius.md, marginBottom: "1rem", fontWeight: 600, fontSize: "0.9rem",
      background: tipo === "exito" ? "rgba(34,197,94,0.12)" : "rgba(225,29,72,0.1)",
      color: tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main,
      borderLeft: `4px solid ${tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main}`,
    }),
  };

  if (loading) {
    return (
      <div style={{ ...s.container, textAlign: "center", paddingTop: "4rem" }}>
        <FaSpinner className="spin" /> Cargando configuración...
        <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div style={s.header}>
        <FaCog size={24} color={stylesGlobal.colors.primary[500]} />
        <h1 style={s.title}>Configuración del Sitio</h1>
      </div>

      {mensaje.texto && <div style={s.alert(mensaje.tipo)}>{mensaje.texto}</div>}

      <form onSubmit={handleSubmit}>
        {/* Identidad */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Identidad</h2>
          <div style={s.group}>
            <label style={s.label}>Nombre del sitio</label>
            <input style={s.input} name="nombre" value={form.nombre} onChange={handleChange} placeholder="La Aterciopelada" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Descripción / eslogan</label>
            <textarea style={s.textarea} name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Breve descripción que aparece en el footer" />
          </div>
          <div style={s.group}>
            <label style={s.label}>Logo</label>
            <div style={s.logoBox}>
              {logoPreview ? (
                <img src={logoPreview} alt="Logo" style={s.logoPreview} />
              ) : (
                <div style={{ ...s.logoPreview, display: "flex", alignItems: "center", justifyContent: "center", color: "#bbb" }}>
                  <FaImage size={28} />
                </div>
              )}
              <label style={{ ...s.button, background: stylesGlobal.colors.neutral[700] }}>
                <FaImage /> Subir logo
                <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
              </label>
            </div>
          </div>
        </div>

        {/* Contacto */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Contacto</h2>
          <div style={s.grid}>
            <div style={s.group}>
              <label style={s.label}>Dirección</label>
              <input style={s.input} name="direccion" value={form.direccion} onChange={handleChange} placeholder="Calle, ciudad, estado" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Teléfono</label>
              <input style={s.input} name="telefono" value={form.telefono} onChange={handleChange} placeholder="+52 ..." />
            </div>
            <div style={s.group}>
              <label style={s.label}>Email</label>
              <input style={s.input} name="email" value={form.email} onChange={handleChange} placeholder="info@tusitio.com" />
            </div>
            <div style={s.group}>
              <label style={s.label}>Horarios</label>
              <input style={s.input} name="horarios" value={form.horarios} onChange={handleChange} placeholder="Lun-Vie 9:00-18:00" />
            </div>
          </div>
        </div>

        {/* Redes sociales */}
        <div style={s.card}>
          <h2 style={s.sectionTitle}>Redes sociales (URLs)</h2>
          <div style={s.grid}>
            <div style={s.group}>
              <label style={s.label}>Facebook</label>
              <input style={s.input} name="facebook" value={form.facebook} onChange={handleChange} placeholder="https://facebook.com/..." />
            </div>
            <div style={s.group}>
              <label style={s.label}>Instagram</label>
              <input style={s.input} name="instagram" value={form.instagram} onChange={handleChange} placeholder="https://instagram.com/..." />
            </div>
            <div style={s.group}>
              <label style={s.label}>WhatsApp</label>
              <input style={s.input} name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="https://wa.me/52..." />
            </div>
            <div style={s.group}>
              <label style={s.label}>Twitter / X</label>
              <input style={s.input} name="twitter" value={form.twitter} onChange={handleChange} placeholder="https://x.com/..." />
            </div>
            <div style={s.group}>
              <label style={s.label}>TikTok</label>
              <input style={s.input} name="tiktok" value={form.tiktok} onChange={handleChange} placeholder="https://tiktok.com/@..." />
            </div>
          </div>
        </div>

        <button type="submit" style={{ ...s.button, opacity: saving ? 0.7 : 1 }} disabled={saving}>
          {saving ? <FaSpinner className="spin" /> : <FaSave />}
          {saving ? "Guardando..." : "Guardar configuración"}
          <style>{`.spin{animation:spin 1s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
      </form>
    </div>
  );
};

export default GestionConfiguracion;
