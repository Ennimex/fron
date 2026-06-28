import React, { useState, useEffect, useCallback } from "react";
import { FaSave, FaSpinner, FaImage, FaInfoCircle, FaAddressCard, FaShareAlt } from "react-icons/fa";
import { adminAPI } from "../../services/api";
import { useConfig } from "../../context/ConfigContext";
import stylesGlobal from "../../styles/stylesGlobal";
import adminTheme from "../../styles/adminTheme";

// Estilos responsivos (sub-nav a fila en móvil)
if (typeof document !== "undefined" && !document.getElementById("gestion-config-styles")) {
  const el = document.createElement("style");
  el.id = "gestion-config-styles";
  el.textContent = `
    .spin{animation:spin 1s linear infinite}
    @keyframes spin{to{transform:rotate(360deg)}}
    @media (max-width: 768px){
      .settings-layout{grid-template-columns:1fr !important;}
      .settings-subnav{flex-direction:row !important; overflow-x:auto; position:static !important;}
      .settings-subnav button{white-space:nowrap;}
    }
  `;
  document.head.appendChild(el);
}

const TABS = [
  { id: "identidad", label: "Identidad", icon: FaInfoCircle },
  { id: "contacto", label: "Contacto", icon: FaAddressCard },
  { id: "redes", label: "Redes sociales", icon: FaShareAlt },
];

const GestionConfiguracion = () => {
  const { refreshConfig } = useConfig();

  const [activeTab, setActiveTab] = useState("identidad");
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
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: adminTheme.bg,
      padding: stylesGlobal.spacing.sections.md,
      fontFamily: stylesGlobal.typography.families.body,
    },
    inner: { maxWidth: "1100px", margin: "0 auto" },
    topbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "1rem",
      marginBottom: stylesGlobal.spacing.scale[6],
      flexWrap: "wrap",
    },
    title: {
      fontFamily: adminTheme.serif,
      fontSize: "1.9rem",
      fontWeight: 700,
      color: stylesGlobal.colors.text.primary,
      margin: 0,
    },
    subtitle: { ...stylesGlobal.typography.body.base, color: stylesGlobal.colors.text.secondary, marginTop: "4px" },
    saveBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "12px 24px",
      fontSize: "0.95rem",
      fontWeight: 600,
      color: "#fff",
      background: stylesGlobal.colors.gradients.primary,
      border: "none",
      borderRadius: stylesGlobal.borders.radius.lg,
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    layout: {
      display: "grid",
      gridTemplateColumns: "230px 1fr",
      gap: stylesGlobal.spacing.scale[6],
      alignItems: "start",
    },
    subnav: {
      display: "flex",
      flexDirection: "column",
      gap: stylesGlobal.spacing.scale[2],
      position: "sticky",
      top: stylesGlobal.spacing.scale[4],
    },
    tab: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "12px 16px",
      borderRadius: stylesGlobal.borders.radius.lg,
      border: "none",
      background: "transparent",
      color: stylesGlobal.colors.text.secondary,
      fontSize: "0.95rem",
      fontWeight: 600,
      cursor: "pointer",
      textAlign: "left",
      width: "100%",
      fontFamily: stylesGlobal.typography.families.body,
      transition: stylesGlobal.animations.transitions.base,
    },
    tabActive: {
      backgroundColor: stylesGlobal.colors.primary[50],
      color: stylesGlobal.colors.primary[600],
    },
    content: { minWidth: 0 },
    sectionLabel: {
      color: stylesGlobal.colors.primary[600],
      fontSize: stylesGlobal.typography.scale.sm,
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: stylesGlobal.typography.tracking.wide,
      margin: `0 0 ${stylesGlobal.spacing.scale[4]} 0`,
      paddingBottom: stylesGlobal.spacing.scale[2],
      borderBottom: `1px solid ${stylesGlobal.colors.neutral[200]}`,
    },
    settingCard: {
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.xl,
      padding: stylesGlobal.spacing.scale[5],
      marginBottom: stylesGlobal.spacing.scale[4],
      boxShadow: stylesGlobal.shadows.sm,
    },
    settingTitle: { fontSize: "1rem", fontWeight: 700, color: stylesGlobal.colors.text.primary, margin: 0 },
    settingHelp: { ...stylesGlobal.typography.body.small, color: stylesGlobal.colors.text.tertiary, margin: "2px 0 12px 0" },
    input: {
      width: "100%",
      padding: "10px 14px",
      fontSize: "0.95rem",
      border: `1px solid ${stylesGlobal.colors.neutral[300]}`,
      borderRadius: stylesGlobal.borders.radius.md,
      boxSizing: "border-box",
      fontFamily: stylesGlobal.typography.families.body,
      backgroundColor: stylesGlobal.colors.surface.primary,
    },
    textarea: {
      width: "100%",
      padding: "10px 14px",
      fontSize: "0.95rem",
      border: `1px solid ${stylesGlobal.colors.neutral[300]}`,
      borderRadius: stylesGlobal.borders.radius.md,
      boxSizing: "border-box",
      minHeight: "90px",
      resize: "vertical",
      fontFamily: stylesGlobal.typography.families.body,
      backgroundColor: stylesGlobal.colors.surface.primary,
    },
    logoBox: { display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" },
    logoPreview: {
      width: "88px",
      height: "88px",
      objectFit: "contain",
      borderRadius: stylesGlobal.borders.radius.md,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      background: stylesGlobal.colors.neutral[50],
    },
    uploadBtn: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 18px",
      fontSize: "0.9rem",
      fontWeight: 600,
      color: stylesGlobal.colors.text.secondary,
      background: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[300]}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      cursor: "pointer",
    },
    alert: (tipo) => ({
      padding: "12px 16px",
      borderRadius: stylesGlobal.borders.radius.md,
      marginBottom: "1rem",
      fontWeight: 600,
      fontSize: "0.9rem",
      background: tipo === "exito" ? "rgba(34,197,94,0.12)" : "rgba(225,29,72,0.1)",
      color: tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main,
      borderLeft: `4px solid ${tipo === "exito" ? stylesGlobal.colors.semantic.success.main : stylesGlobal.colors.semantic.error.main}`,
    }),
  };

  // Tarjeta de campo (función, no componente, para no perder el foco al teclear)
  const field = (name, title, help, placeholder, textarea = false) => (
    <div style={s.settingCard}>
      <div style={s.settingTitle}>{title}</div>
      {help && <div style={s.settingHelp}>{help}</div>}
      {textarea ? (
        <textarea style={s.textarea} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} />
      ) : (
        <input style={s.input} name={name} value={form[name]} onChange={handleChange} placeholder={placeholder} />
      )}
    </div>
  );

  if (loading) {
    return (
      <div style={{ ...s.pageContainer, textAlign: "center", paddingTop: "4rem" }}>
        <FaSpinner className="spin" /> Cargando configuración...
      </div>
    );
  }

  return (
    <div style={s.pageContainer}>
      <div style={s.inner}>
        <form onSubmit={handleSubmit}>
          {/* Barra superior con título y guardar */}
          <div style={s.topbar}>
            <div>
              <h1 style={s.title}>Configuración del Sitio</h1>
              <p style={s.subtitle}>Administra la identidad pública de tu tienda</p>
            </div>
            <button type="submit" style={{ ...s.saveBtn, opacity: saving ? 0.7 : 1 }} disabled={saving}>
              {saving ? <FaSpinner className="spin" /> : <FaSave />}
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>

          {mensaje.texto && <div style={s.alert(mensaje.tipo)}>{mensaje.texto}</div>}

          <div style={s.layout} className="settings-layout">
            {/* Sub-navegación */}
            <aside style={s.subnav} className="settings-subnav">
              {TABS.map((t) => {
                const Icon = t.icon;
                const active = activeTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    style={{ ...s.tab, ...(active ? s.tabActive : {}) }}
                    onClick={() => setActiveTab(t.id)}
                    aria-pressed={active}
                  >
                    <Icon size={16} />
                    {t.label}
                  </button>
                );
              })}
            </aside>

            {/* Contenido de la pestaña activa */}
            <div style={s.content}>
              {activeTab === "identidad" && (
                <>
                  <h2 style={s.sectionLabel}>Información básica</h2>
                  {field("nombre", "Nombre del sitio", "Aparece en el navbar, el footer y las cotizaciones", "La Aterciopelada")}
                  {field("descripcion", "Descripción / eslogan", "Breve texto que aparece en el footer", "Breve descripción de tu tienda", true)}
                  <div style={s.settingCard}>
                    <div style={s.settingTitle}>Logo</div>
                    <div style={s.settingHelp}>Imagen que representa tu marca (PNG o JPG)</div>
                    <div style={s.logoBox}>
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" style={s.logoPreview} />
                      ) : (
                        <div style={{ ...s.logoPreview, display: "flex", alignItems: "center", justifyContent: "center", color: stylesGlobal.colors.text.muted }}>
                          <FaImage size={28} />
                        </div>
                      )}
                      <label style={s.uploadBtn}>
                        <FaImage /> {logoPreview ? "Cambiar logo" : "Subir logo"}
                        <input type="file" accept="image/*" onChange={handleLogo} style={{ display: "none" }} />
                      </label>
                    </div>
                  </div>
                </>
              )}

              {activeTab === "contacto" && (
                <>
                  <h2 style={s.sectionLabel}>Datos de contacto</h2>
                  {field("email", "Correo de contacto", "Dirección principal para avisos de cotizaciones", "info@tusitio.com")}
                  {field("telefono", "Teléfono", "Número de contacto del negocio", "+52 ...")}
                  {field("direccion", "Dirección", "Ubicación física (opcional)", "Calle, ciudad, estado")}
                  {field("horarios", "Horarios", "Horario de atención", "Lun-Vie 9:00-18:00")}
                </>
              )}

              {activeTab === "redes" && (
                <>
                  <h2 style={s.sectionLabel}>Redes sociales (URLs)</h2>
                  {field("whatsapp", "WhatsApp", "Enlace wa.me usado en los botones de contacto", "https://wa.me/52...")}
                  {field("facebook", "Facebook", "URL de tu página", "https://facebook.com/...")}
                  {field("instagram", "Instagram", "URL de tu perfil", "https://instagram.com/...")}
                  {field("twitter", "Twitter / X", "URL de tu perfil", "https://x.com/...")}
                  {field("tiktok", "TikTok", "URL de tu perfil", "https://tiktok.com/@...")}
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GestionConfiguracion;
