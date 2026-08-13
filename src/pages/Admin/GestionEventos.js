import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  FaCalendarAlt, FaPlus, FaEdit, FaTrash, FaLock, FaSpinner,
  FaImages, FaVideo, FaCloudUploadAlt, FaCheck,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";
import adminService from "../../services/adminServices";
import { fotoService } from "../../services/fotoService";
import { videoService } from "../../services/videoService";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import stylesGlobal from "../../styles/stylesGlobal";
import adminTheme from "../../styles/adminTheme";

/*
 * Gestión de Eventos — flujo unificado en un asistente de 2 pasos:
 *   Paso 1 "Datos del evento"  → solo título y fecha son obligatorios.
 *   Paso 2 "Galería (opcional)" → subida de fotos/videos del evento, en el mismo modal.
 * La lista muestra el estado de la galería de cada evento (insignia con conteos)
 * y permite entrar directo al paso 2 sin pasar por el formulario.
 */

// Animaciones, hovers y responsive (lo que los estilos inline de React no cubren)
const cssEventos = `
  @keyframes spin { to { transform: rotate(360deg); } }
  @keyframes evtVeloIn { from { opacity: 0; } to { opacity: 1; } }
  @keyframes evtModalIn {
    from { opacity: 0; transform: translateY(14px) scale(0.98); }
    to { opacity: 1; transform: none; }
  }
  .evt-overlay { animation: evtVeloIn 0.2s ease-out; }
  .evt-modal { animation: evtModalIn 0.25s ease-out; }
  .evt-cerrar { transition: all 0.15s ease; }
  .evt-cerrar:hover { background-color: #fdf2f4 !important; color: #d63384 !important; border-color: #f5c6d8 !important; }
  .evt-badge { transition: all 0.15s ease; cursor: pointer; }
  .evt-badge:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(45, 40, 35, 0.12); }
  .evt-icono { transition: filter 0.15s ease; }
  .evt-icono:hover { filter: brightness(0.94); }
  .evt-btn-archivos { transition: all 0.15s ease; }
  .evt-btn-archivos:hover { border-color: #d63384 !important; color: #d63384 !important; }
  .evt-celda-media .evt-quitar { opacity: 0; transition: opacity 0.15s ease; }
  .evt-celda-media:hover .evt-quitar { opacity: 1; }
  .evt-fila { transition: box-shadow 0.15s ease; }
  .evt-fila:hover { box-shadow: 0 4px 18px rgba(45, 40, 35, 0.1); }

  @media (max-width: 768px) {
    .evt-thead { display: none !important; }
    .evt-fila { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
    .evt-acciones { justify-content: flex-start !important; }
    .evt-cab { flex-direction: column !important; align-items: stretch !important; }
  }
  @media (max-width: 560px) {
    .evt-fila3 { grid-template-columns: 1fr !important; }
    .evt-modal { margin: 8px !important; width: calc(100% - 16px) !important; }
    .evt-pie { flex-direction: column-reverse !important; align-items: stretch !important; }
    .evt-pie button { width: 100%; justify-content: center; }
  }
`;

if (typeof document !== "undefined" && !document.head.querySelector("style[data-evt-eventos]")) {
  const styleElement = document.createElement("style");
  styleElement.setAttribute("data-evt-eventos", "true");
  styleElement.textContent = cssEventos;
  document.head.appendChild(styleElement);
}

const FORM_VACIO = { titulo: "", descripcion: "", fecha: "", ubicacion: "", horaInicio: "", horaFin: "" };

// eventoId de una foto/video puede venir poblado (objeto) o plano (string)
const idDe = (ref) => (ref && typeof ref === "object" ? ref._id : ref) || null;

const GestionEventos = () => {
  const { user, isAuthenticated } = useAuth();
  // El hook ya se suscribe a adminService.onNotification por dentro;
  // suscribirse otra vez aquí duplicaría cada notificación.
  const { notifications, removeNotification, clearAllNotifications } = useAdminNotifications();

  const styles = {
    pageContainer: {
      ...stylesGlobal.utils.container,
      padding: stylesGlobal.spacing.sections.md,
      backgroundColor: adminTheme.bg,
      minHeight: "100vh",
    },
    mainContainer: {
      maxWidth: stylesGlobal.utils.container.maxWidth.lg,
      margin: stylesGlobal.spacing.margins.auto,
      padding: stylesGlobal.spacing.scale[4],
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      marginBottom: stylesGlobal.spacing.scale[8],
      flexWrap: "wrap",
      gap: stylesGlobal.spacing.gaps.md,
    },
    title: {
      fontFamily: stylesGlobal.typography.families.display,
      fontSize: "1.9rem",
      fontWeight: 700,
      color: stylesGlobal.colors.text.primary,
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[2],
    },
    subtitle: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
      marginTop: stylesGlobal.spacing.scale[1],
    },
    addButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.gaps.xs,
    },

    // --- Lista de eventos ---
    thead: {
      display: "grid",
      gridTemplateColumns: "2.2fr 1.2fr 1.8fr 1.4fr auto",
      gap: stylesGlobal.spacing.scale[4],
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[5]}`,
      color: stylesGlobal.colors.text.tertiary,
      fontSize: stylesGlobal.typography.scale.xs,
      fontWeight: stylesGlobal.typography.weights.semibold,
      textTransform: "uppercase",
      letterSpacing: stylesGlobal.typography.tracking.wide,
    },
    fila: {
      display: "grid",
      gridTemplateColumns: "2.2fr 1.2fr 1.8fr 1.4fr auto",
      gap: stylesGlobal.spacing.scale[4],
      alignItems: "center",
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[5]}`,
      marginBottom: stylesGlobal.spacing.scale[3],
      boxShadow: stylesGlobal.shadows.sm,
    },
    celdaEvento: { display: "flex", alignItems: "center", gap: stylesGlobal.spacing.scale[4], minWidth: 0 },
    thumb: {
      width: "48px",
      height: "48px",
      borderRadius: stylesGlobal.borders.radius.md,
      background: stylesGlobal.colors.gradients.primary,
      color: stylesGlobal.colors.text.inverse,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: adminTheme.serif,
      fontWeight: 700,
      fontSize: "18px",
      flexShrink: 0,
    },
    nombreEvento: {
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.primary,
      fontSize: stylesGlobal.typography.scale.base,
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    lugarEvento: {
      fontSize: stylesGlobal.typography.scale.sm,
      color: stylesGlobal.colors.text.tertiary,
      marginTop: "2px",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    textoCelda: {
      color: stylesGlobal.colors.text.secondary,
      fontSize: stylesGlobal.typography.scale.sm,
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    chipProximo: {
      display: "inline-block",
      backgroundColor: stylesGlobal.colors.secondary[50],
      color: stylesGlobal.colors.secondary[650],
      fontSize: "11px",
      fontWeight: 700,
      borderRadius: stylesGlobal.borders.radius.full,
      padding: "2px 9px",
      marginLeft: stylesGlobal.spacing.scale[2],
    },
    badgeConFotos: {
      border: `1px solid ${stylesGlobal.colors.primary[100] || "#f5c6d8"}`,
      backgroundColor: stylesGlobal.colors.primary[50],
      color: stylesGlobal.colors.primary[650],
      borderRadius: stylesGlobal.borders.radius.full,
      padding: "7px 14px",
      fontSize: "12.5px",
      fontWeight: stylesGlobal.typography.weights.semibold,
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      width: "fit-content",
    },
    badgeSinFotos: {
      border: `1px dashed ${stylesGlobal.colors.accent[200]}`,
      backgroundColor: stylesGlobal.colors.accent[50],
      color: stylesGlobal.colors.accent[600],
      borderRadius: stylesGlobal.borders.radius.full,
      padding: "7px 14px",
      fontSize: "12.5px",
      fontWeight: stylesGlobal.typography.weights.semibold,
      display: "inline-flex",
      alignItems: "center",
      gap: "7px",
      width: "fit-content",
    },
    acciones: { display: "flex", gap: stylesGlobal.spacing.scale[2], justifyContent: "flex-end" },
    iconoBtn: {
      width: "36px",
      height: "36px",
      borderRadius: stylesGlobal.borders.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
    },
    iconoEditar: { backgroundColor: stylesGlobal.colors.accent[50], color: stylesGlobal.colors.accent[600] },
    iconoBorrar: { backgroundColor: stylesGlobal.colors.primary[50], color: stylesGlobal.colors.primary[500] },

    // --- Modal / asistente ---
    overlay: {
      ...stylesGlobal.utils.overlay.elegant,
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "flex-start",
      justifyContent: "center",
      zIndex: 1300,
      overflowY: "auto",
      padding: "4vh 16px",
    },
    // Modal blanco limpio (lenguaje del boceto aprobado): sin degradados
    // ni borde dorado de card.luxury, esquinas de 18px y sombra profunda.
    modal: {
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      border: "none",
      maxWidth: "660px",
      width: "100%",
      position: "relative",
      margin: "0 0 4vh",
      boxShadow: "0 24px 70px rgba(45, 40, 35, 0.3)",
      overflow: "hidden",
    },
    modalDelete: {
      backgroundColor: "#ffffff",
      borderRadius: "18px",
      border: "none",
      maxWidth: "480px",
      width: "100%",
      textAlign: "center",
      position: "relative",
      margin: "10vh 0 4vh",
      boxShadow: "0 24px 70px rgba(45, 40, 35, 0.3)",
      overflow: "hidden",
    },
    modalCab: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: `${stylesGlobal.spacing.scale[5]} ${stylesGlobal.spacing.scale[6]} 0`,
    },
    modalTitulo: { ...stylesGlobal.typography.headings.h2, fontSize: "1.45rem" },
    cerrar: {
      width: "34px",
      height: "34px",
      borderRadius: stylesGlobal.borders.radius.full,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      backgroundColor: stylesGlobal.colors.surface.primary,
      color: stylesGlobal.colors.text.tertiary,
      fontSize: "17px",
      lineHeight: 1,
      cursor: "pointer",
      flexShrink: 0,
    },
    pasos: {
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[2],
      padding: `${stylesGlobal.spacing.scale[4]} ${stylesGlobal.spacing.scale[6]} ${stylesGlobal.spacing.scale[5]}`,
    },
    paso: { display: "flex", alignItems: "center", gap: stylesGlobal.spacing.scale[2], fontSize: "13px", fontWeight: 600 },
    pasoNum: (estado) => ({
      width: "24px",
      height: "24px",
      borderRadius: stylesGlobal.borders.radius.full,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      border: `1.5px solid ${
        estado === "activo" ? stylesGlobal.colors.primary[500]
        : estado === "hecho" ? stylesGlobal.colors.secondary[650]
        : stylesGlobal.colors.neutral[200]
      }`,
      backgroundColor:
        estado === "activo" ? stylesGlobal.colors.primary[500]
        : estado === "hecho" ? stylesGlobal.colors.secondary[50]
        : stylesGlobal.colors.surface.primary,
      color:
        estado === "activo" ? stylesGlobal.colors.text.inverse
        : estado === "hecho" ? stylesGlobal.colors.secondary[650]
        : stylesGlobal.colors.text.tertiary,
    }),
    pasoTexto: (estado) => ({
      color:
        estado === "activo" ? stylesGlobal.colors.text.primary
        : estado === "hecho" ? stylesGlobal.colors.secondary[650]
        : stylesGlobal.colors.text.tertiary,
    }),
    pasoLinea: { flex: "0 1 60px", height: "1.5px", backgroundColor: stylesGlobal.colors.neutral[200] },
    pasoOpcional: { fontWeight: 500, color: stylesGlobal.colors.text.tertiary, fontSize: "12px" },
    modalCuerpo: { padding: `0 ${stylesGlobal.spacing.scale[6]} ${stylesGlobal.spacing.scale[6]}` },

    // --- Formulario (paso 1) ---
    campo: { marginBottom: stylesGlobal.spacing.scale[5] },
    label: {
      display: "block",
      fontSize: "13.5px",
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[2],
    },
    req: { color: stylesGlobal.colors.primary[500], marginLeft: "3px" },
    opc: { color: stylesGlobal.colors.text.tertiary, fontWeight: 500, fontSize: "12px", marginLeft: "6px" },
    input: { ...stylesGlobal.components.input.base, width: "100%" },
    inputError: { borderColor: stylesGlobal.colors.semantic.error.main },
    msjError: {
      color: stylesGlobal.colors.semantic.error.main,
      fontSize: "12.5px",
      marginTop: stylesGlobal.spacing.scale[1],
    },
    textarea: {
      ...stylesGlobal.components.input.base,
      width: "100%",
      minHeight: "90px",
      resize: "vertical",
      lineHeight: stylesGlobal.typography.leading.normal,
    },
    fila3: { display: "grid", gridTemplateColumns: "1.3fr 1fr 1fr", gap: stylesGlobal.spacing.scale[3] },
    pista: { ...stylesGlobal.typography.body.caption, marginTop: stylesGlobal.spacing.scale[2] },
    pie: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[3],
      padding: `${stylesGlobal.spacing.scale[4]} ${stylesGlobal.spacing.scale[6]}`,
      borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
      backgroundColor: stylesGlobal.colors.surface.secondary,
    },
    // Botón neutro del boceto: blanco con borde suave (no el verde delineado)
    btnSecundario: {
      ...stylesGlobal.components.button.sizes.base,
      backgroundColor: stylesGlobal.colors.surface.primary,
      color: stylesGlobal.colors.text.secondary,
      border: `1.5px solid ${stylesGlobal.colors.neutral[200]}`,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.gaps.xs,
    },
    btnPrimario: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: "inline-flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.gaps.xs,
    },
    btnDeshabilitado: { opacity: 0.55, cursor: "not-allowed" },

    // --- Galería (paso 2) ---
    subGaleria: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.text.secondary,
      marginBottom: stylesGlobal.spacing.scale[4],
      lineHeight: 1.55,
    },
    zonaSoltar: (activa) => ({
      border: `2px dashed ${activa ? stylesGlobal.colors.primary[400] : stylesGlobal.colors.neutral[300]}`,
      backgroundColor: activa ? stylesGlobal.colors.primary[50] : stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[6],
      textAlign: "center",
      transition: "all 0.15s",
      marginBottom: stylesGlobal.spacing.scale[4],
    }),
    btnArchivos: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      borderRadius: stylesGlobal.borders.radius.lg,
      border: `1.5px solid ${stylesGlobal.colors.neutral[300]}`,
      backgroundColor: stylesGlobal.colors.surface.primary,
      color: stylesGlobal.colors.text.secondary,
      fontWeight: 600,
      fontSize: "0.9rem",
      cursor: "pointer",
    },
    colaItem: {
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[3],
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.md,
      padding: stylesGlobal.spacing.scale[2],
    },
    colaThumb: {
      width: "44px",
      height: "44px",
      borderRadius: stylesGlobal.borders.radius.sm,
      overflow: "hidden",
      flexShrink: 0,
      backgroundColor: stylesGlobal.colors.neutral[100],
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    barraProgreso: {
      height: "6px",
      backgroundColor: stylesGlobal.colors.neutral[200],
      borderRadius: stylesGlobal.borders.radius.full,
      overflow: "hidden",
      marginTop: "6px",
    },
    mediaGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
      gap: stylesGlobal.spacing.scale[2],
    },
    celdaMedia: {
      position: "relative",
      aspectRatio: "1",
      borderRadius: stylesGlobal.borders.radius.md,
      overflow: "hidden",
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      backgroundColor: stylesGlobal.colors.neutral[100],
    },
    quitarMedia: {
      position: "absolute",
      top: "6px",
      right: "6px",
      width: "27px",
      height: "27px",
      borderRadius: stylesGlobal.borders.radius.full,
      border: "none",
      cursor: "pointer",
      background: "rgba(45, 40, 35, 0.55)",
      color: "#fff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    emptyState: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: "center",
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    loadingContainer: { padding: stylesGlobal.spacing.scale[8], textAlign: "center" },
  };

  // ============== Estado ==============
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Asistente (paso 1: datos, paso 2: galería)
  const [wizardAbierto, setWizardAbierto] = useState(false);
  const [paso, setPaso] = useState(1);
  const [soloGaleria, setSoloGaleria] = useState(false); // se abrió directo a la galería
  const [editId, setEditId] = useState(null); // id del evento (existente o recién creado)
  const [eventoActual, setEventoActual] = useState(null); // doc para el paso 2
  const [formData, setFormData] = useState(FORM_VACIO);
  const [erroresForm, setErroresForm] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  // Galería del evento
  const [galeriaFotos, setGaleriaFotos] = useState([]);
  const [galeriaVideos, setGaleriaVideos] = useState([]);
  const [galeriaLoading, setGaleriaLoading] = useState(false);
  const [cola, setCola] = useState([]);
  const [subiendo, setSubiendo] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const colaRef = useRef([]); // fuente de verdad de la cola (evita estado obsoleto en el bucle de subida)
  const colaIdRef = useRef(0);
  const subiendoRef = useRef(false);

  // Confirmaciones destructivas: { tipo: 'evento'|'foto'|'video', id, titulo }
  const [confirmacion, setConfirmacion] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ============== Carga de datos ==============
  const fetchEventos = useCallback(async () => {
    try {
      setLoading(true);
      const data = await adminService.getEventos();
      setEventos(data);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error("Error al cargar eventos:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.role === "admin") {
      fetchEventos();
    }
  }, [isAuthenticated, user, fetchEventos]);

  // Carga la galería de un evento y sincroniza los conteos de su fila en la lista
  const cargarMediaEvento = useCallback(async (eventoId) => {
    setGaleriaLoading(true);
    try {
      const [fotos, videos] = await Promise.all([
        adminService.getFotos({ eventoId }),
        adminService.getVideos({ eventoId }),
      ]);
      // Filtro defensivo por si el backend aún no aplica el query param
      const fotosEvento = (fotos || []).filter((f) => idDe(f.eventoId) === eventoId);
      const videosEvento = (videos || []).filter((v) => idDe(v.eventoId) === eventoId);
      setGaleriaFotos(fotosEvento);
      setGaleriaVideos(videosEvento);
      setEventos((prev) =>
        prev.map((e) =>
          e._id === eventoId ? { ...e, totalFotos: fotosEvento.length, totalVideos: videosEvento.length } : e
        )
      );
    } catch (err) {
      console.error("Error al cargar la galería del evento:", err);
    } finally {
      setGaleriaLoading(false);
    }
  }, []);

  // ============== Asistente ==============
  const abrirNuevo = () => {
    setFormData(FORM_VACIO);
    setErroresForm({});
    setEditId(null);
    setEventoActual(null);
    setSoloGaleria(false);
    setGaleriaFotos([]);
    setGaleriaVideos([]);
    colaRef.current = [];
    setCola([]);
    setPaso(1);
    setWizardAbierto(true);
  };

  const abrirEdicion = (evento) => {
    setFormData({
      titulo: evento.titulo || "",
      descripcion: evento.descripcion || "",
      fecha: evento.fecha ? evento.fecha.substring(0, 10) : "",
      ubicacion: evento.ubicacion || "",
      horaInicio: evento.horaInicio || "",
      horaFin: evento.horaFin || "",
    });
    setErroresForm({});
    setEditId(evento._id);
    setEventoActual(evento);
    setSoloGaleria(false);
    setGaleriaFotos([]);
    setGaleriaVideos([]);
    colaRef.current = [];
    setCola([]);
    setPaso(1);
    setWizardAbierto(true);
  };

  const abrirGaleria = (evento) => {
    setEditId(evento._id);
    setEventoActual(evento);
    setSoloGaleria(true);
    setGaleriaFotos([]);
    setGaleriaVideos([]);
    colaRef.current = [];
    setCola([]);
    setPaso(2);
    setWizardAbierto(true);
    cargarMediaEvento(evento._id);
  };

  const cerrarWizard = () => {
    if (subiendoRef.current) return; // no cerrar a media subida
    setWizardAbierto(false);
    setCola([]);
    colaRef.current = [];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (erroresForm[name]) setErroresForm((prev) => ({ ...prev, [name]: undefined }));
  };

  // Paso 1 → guarda el evento (crea o actualiza) y avanza a la galería
  const guardarYContinuar = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.titulo.trim()) errs.titulo = "Escribe un título para el evento.";
    if (!formData.fecha) errs.fecha = "Elige la fecha del evento.";
    setErroresForm(errs);
    if (Object.keys(errs).length) return;

    setFormLoading(true);
    try {
      let guardado;
      if (editId) {
        guardado = await adminService.updateEvento(editId, formData);
        setEventos((prev) =>
          prev.map((ev) =>
            ev._id === editId
              ? { ...guardado, totalFotos: ev.totalFotos || 0, totalVideos: ev.totalVideos || 0 }
              : ev
          )
        );
      } else {
        guardado = await adminService.createEvento(formData);
        guardado = { ...guardado, totalFotos: 0, totalVideos: 0 };
        setEventos((prev) => [guardado, ...prev]);
        setEditId(guardado._id);
      }
      setEventoActual(guardado);
      setPaso(2);
      cargarMediaEvento(guardado._id);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error("Error al guardar evento:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const volverADatos = () => {
    if (subiendoRef.current) return;
    setPaso(1);
  };

  // ============== Cola de subida (paso 2) ==============
  const sincronizarCola = () => setCola([...colaRef.current]);

  const patchItem = (id, patch) => {
    colaRef.current = colaRef.current.map((it) => (it.id === id ? { ...it, ...patch } : it));
    sincronizarCola();
  };

  const quitarDeCola = (id) => {
    const item = colaRef.current.find((it) => it.id === id);
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
    colaRef.current = colaRef.current.filter((it) => it.id !== id);
    sincronizarCola();
  };

  // Agrega archivos a la cola y arranca la subida automáticamente
  const agregarArchivos = (fileList) => {
    if (!eventoActual) return;
    const nuevos = [];
    Array.from(fileList || []).forEach((file) => {
      const esImg = file.type.startsWith("image/");
      const esVid = file.type.startsWith("video/");
      if (!esImg && !esVid) return;
      nuevos.push({
        id: ++colaIdRef.current,
        file,
        tipo: esImg ? "foto" : "video",
        titulo: file.name.replace(/\.[^.]+$/, "").slice(0, 100) || "Sin título",
        previewUrl: esImg ? URL.createObjectURL(file) : null,
        progress: 0,
        status: "pendiente", // pendiente | subiendo | ok | error
        error: "",
      });
    });
    if (!nuevos.length) return;
    colaRef.current = [...colaRef.current, ...nuevos];
    sincronizarCola();
    procesarCola(eventoActual._id);
  };

  const procesarCola = async (eventoId) => {
    if (subiendoRef.current) return; // ya hay un bucle activo; tomará los nuevos pendientes
    subiendoRef.current = true;
    setSubiendo(true);
    try {
      // Sube de uno en uno; el bucle relee la cola para incluir archivos agregados sobre la marcha
      let siguiente;
      while ((siguiente = colaRef.current.find((it) => it.status === "pendiente"))) {
        const item = siguiente;
        patchItem(item.id, { status: "subiendo", progress: 0, error: "" });
        try {
          const fd = new FormData();
          fd.append("titulo", (item.titulo || "Sin título").trim());
          fd.append("descripcion", "");
          fd.append("eventoId", eventoId);
          if (item.tipo === "foto") {
            fd.append("imagen", item.file);
            await fotoService.create(fd, (p) => patchItem(item.id, { progress: p }));
          } else {
            fd.append("video", item.file);
            await videoService.create(fd, (p) => patchItem(item.id, { progress: p }));
          }
          patchItem(item.id, { status: "ok", progress: 100 });
        } catch (err) {
          patchItem(item.id, { status: "error", error: err?.error || err?.message || "Error al subir" });
        }
      }
    } finally {
      subiendoRef.current = false;
      setSubiendo(false);
    }
    await cargarMediaEvento(eventoId);
    // Limpiar de la cola los que subieron bien (los errores quedan visibles para reintentar)
    colaRef.current.forEach((it) => {
      if (it.status === "ok" && it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
    colaRef.current = colaRef.current.filter((it) => it.status !== "ok");
    sincronizarCola();
  };

  const reintentarErrores = () => {
    if (!eventoActual) return;
    colaRef.current = colaRef.current.map((it) =>
      it.status === "error" ? { ...it, status: "pendiente", error: "" } : it
    );
    sincronizarCola();
    procesarCola(eventoActual._id);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer?.files?.length) agregarArchivos(e.dataTransfer.files);
  };

  // ============== Confirmaciones destructivas ==============
  const ejecutarConfirmacion = async () => {
    if (!confirmacion) return;
    setConfirmLoading(true);
    try {
      if (confirmacion.tipo === "evento") {
        await adminService.deleteEvento(confirmacion.id);
        setEventos((prev) => prev.filter((e) => e._id !== confirmacion.id));
      } else if (confirmacion.tipo === "foto") {
        await adminService.deleteFoto(confirmacion.id);
        await cargarMediaEvento(eventoActual._id);
      } else if (confirmacion.tipo === "video") {
        await adminService.deleteVideo(confirmacion.id);
        await cargarMediaEvento(eventoActual._id);
      }
      setConfirmacion(null);
    } catch (err) {
      // adminService ya maneja las notificaciones de error
      console.error("Error al eliminar:", err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const textosConfirmacion = {
    evento: {
      titulo: "¿Eliminar evento?",
      detalle: "Sus fotos y videos no se borran: pasarán a la galería general.",
    },
    foto: { titulo: "¿Quitar esta foto?", detalle: "Se eliminará definitivamente." },
    video: { titulo: "¿Quitar este video?", detalle: "Se eliminará definitivamente." },
  };

  // ============== Utilidades de presentación ==============
  const formatearFecha = (iso) =>
    iso ? new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" }) : "Sin fecha";

  const esFuturo = (iso) => {
    if (!iso) return false;
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return new Date(iso) >= hoy;
  };

  // ============== Guardias de acceso ==============
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (user?.role !== "admin") {
    return (
      <div style={{ ...styles.pageContainer, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", height: "80vh", textAlign: "center" }}>
        <FaLock size={50} style={{ color: stylesGlobal.colors.semantic.error.main }} />
        <h2 style={styles.title}>Acceso Denegado</h2>
        <p style={styles.subtitle}>
          No tienes permisos para acceder a esta sección. Esta área está reservada para administradores.
        </p>
      </div>
    );
  }

  const erroresEnCola = cola.filter((it) => it.status === "error").length;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContainer}>
        <div style={styles.header} className="evt-cab">
          <div>
            <h1 style={styles.title}>
              <FaCalendarAlt />
              Gestión de Eventos
            </h1>
            <p style={styles.subtitle}>
              Crea un evento y sube sus fotos en el mismo paso. Los eventos con fecha futura salen en
              “Próximos eventos” y los pasados en “Revive nuestros eventos”.
            </p>
          </div>
          <button style={styles.addButton} onClick={abrirNuevo} aria-label="Nuevo evento">
            <FaPlus size={14} />
            Nuevo Evento
          </button>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: stylesGlobal.spacing.scale[2] }} />
            <h3 style={stylesGlobal.typography.headings.h3}>Cargando eventos...</h3>
          </div>
        ) : eventos.length === 0 ? (
          <div style={styles.emptyState}>
            <h3 style={stylesGlobal.typography.headings.h3}>No hay eventos registrados</h3>
            <p style={stylesGlobal.typography.body.base}>¡Crea un nuevo evento para comenzar!</p>
          </div>
        ) : (
          <div>
            <div style={styles.thead} className="evt-thead">
              <div>Evento</div>
              <div>Fecha</div>
              <div>Descripción</div>
              <div>Galería</div>
              <div style={{ textAlign: "right" }}>Acciones</div>
            </div>

            {eventos.map((evento) => {
              const horario =
                evento.horaInicio && evento.horaFin
                  ? `${evento.horaInicio}–${evento.horaFin}`
                  : evento.horaInicio || evento.horaFin || "";
              const lugarHorario = [evento.ubicacion, horario].filter(Boolean).join(" · ");
              const totalFotos = evento.totalFotos || 0;
              const totalVideos = evento.totalVideos || 0;
              const partes = [];
              if (totalFotos) partes.push(`${totalFotos} ${totalFotos === 1 ? "foto" : "fotos"}`);
              if (totalVideos) partes.push(`${totalVideos} ${totalVideos === 1 ? "video" : "videos"}`);
              return (
                <div key={evento._id} style={styles.fila} className="evt-fila">
                  <div style={styles.celdaEvento}>
                    <div style={styles.thumb}>{(evento.titulo || "E")[0].toUpperCase()}</div>
                    <div style={{ minWidth: 0 }}>
                      <div style={styles.nombreEvento}>{evento.titulo || "Sin título"}</div>
                      {lugarHorario && <div style={styles.lugarEvento}>{lugarHorario}</div>}
                    </div>
                  </div>
                  <div style={styles.textoCelda}>
                    {formatearFecha(evento.fecha)}
                    {esFuturo(evento.fecha) && <span style={styles.chipProximo}>Próximo</span>}
                  </div>
                  <div style={styles.textoCelda}>{evento.descripcion || "—"}</div>
                  <div>
                    {partes.length ? (
                      <button
                        style={styles.badgeConFotos}
                        className="evt-badge"
                        onClick={() => abrirGaleria(evento)}
                        title="Ver y administrar la galería"
                        aria-label={`Galería de ${evento.titulo}: ${partes.join(" y ")}`}
                      >
                        <FaImages size={12} />
                        {partes.join(" · ")}
                      </button>
                    ) : (
                      <button
                        style={styles.badgeSinFotos}
                        className="evt-badge"
                        onClick={() => abrirGaleria(evento)}
                        title="Este evento aún no tiene fotos"
                        aria-label={`Agregar fotos a ${evento.titulo}`}
                      >
                        <FaPlus size={10} />
                        Agregar fotos
                      </button>
                    )}
                  </div>
                  <div style={styles.acciones} className="evt-acciones">
                    <button
                      style={{ ...styles.iconoBtn, ...styles.iconoEditar }}
                      className="evt-icono"
                      title="Editar evento"
                      onClick={() => abrirEdicion(evento)}
                      aria-label={`Editar evento ${evento.titulo}`}
                    >
                      <FaEdit size={15} />
                    </button>
                    <button
                      style={{ ...styles.iconoBtn, ...styles.iconoBorrar }}
                      className="evt-icono"
                      title="Eliminar evento"
                      onClick={() => setConfirmacion({ tipo: "evento", id: evento._id, titulo: evento.titulo })}
                      aria-label={`Eliminar evento ${evento.titulo}`}
                    >
                      <FaTrash size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============== Asistente: Datos → Galería ============== */}
      {wizardAbierto && (
        <div
          style={styles.overlay}
          className="evt-overlay"
          onClick={(e) => e.target === e.currentTarget && cerrarWizard()}
        >
          <div style={styles.modal} className="evt-modal">
            <div style={styles.modalCab}>
              <h2 style={styles.modalTitulo}>
                {paso === 2
                  ? `Galería de “${eventoActual?.titulo || "Evento"}”`
                  : editId
                  ? "Editar evento"
                  : "Nuevo evento"}
              </h2>
              <button
                style={styles.cerrar}
                className="evt-cerrar"
                onClick={cerrarWizard}
                disabled={subiendo}
                aria-label="Cerrar"
                title={subiendo ? "Espera a que termine la subida" : "Cerrar"}
              >
                ×
              </button>
            </div>

            {!soloGaleria && (
              <div style={styles.pasos}>
                <div style={styles.paso}>
                  <span style={styles.pasoNum(paso === 1 ? "activo" : "hecho")}>
                    {paso === 1 ? "1" : <FaCheck size={10} />}
                  </span>
                  <span style={styles.pasoTexto(paso === 1 ? "activo" : "hecho")}>Datos del evento</span>
                </div>
                <div style={styles.pasoLinea} />
                <div style={styles.paso}>
                  <span style={styles.pasoNum(paso === 2 ? "activo" : "pendiente")}>2</span>
                  <span style={styles.pasoTexto(paso === 2 ? "activo" : "pendiente")}>Galería</span>
                  <span style={styles.pasoOpcional}>(opcional)</span>
                </div>
              </div>
            )}

            {/* Paso 1: datos */}
            {paso === 1 && (
              <form onSubmit={guardarYContinuar} noValidate>
                <div style={{ ...styles.modalCuerpo, paddingTop: soloGaleria ? stylesGlobal.spacing.scale[4] : 0 }}>
                  <div style={styles.campo}>
                    <label style={styles.label} htmlFor="evento-titulo">
                      Título del evento<span style={styles.req} aria-hidden="true">*</span>
                    </label>
                    <input
                      id="evento-titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleInputChange}
                      placeholder="Ej. Taller de bordado de primavera"
                      maxLength={120}
                      style={{ ...styles.input, ...(erroresForm.titulo ? styles.inputError : {}) }}
                      disabled={formLoading}
                    />
                    {erroresForm.titulo && <div style={styles.msjError}>{erroresForm.titulo}</div>}
                  </div>

                  <div style={{ ...styles.fila3, ...styles.campo }} className="evt-fila3">
                    <div>
                      <label style={styles.label} htmlFor="evento-fecha">
                        Fecha<span style={styles.req} aria-hidden="true">*</span>
                      </label>
                      <input
                        id="evento-fecha"
                        name="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        style={{ ...styles.input, ...(erroresForm.fecha ? styles.inputError : {}) }}
                        disabled={formLoading}
                      />
                      {erroresForm.fecha && <div style={styles.msjError}>{erroresForm.fecha}</div>}
                    </div>
                    <div>
                      <label style={styles.label} htmlFor="evento-hora-inicio">
                        Hora inicio<span style={styles.opc}>opcional</span>
                      </label>
                      <input
                        id="evento-hora-inicio"
                        name="horaInicio"
                        type="time"
                        value={formData.horaInicio}
                        onChange={handleInputChange}
                        style={styles.input}
                        disabled={formLoading}
                      />
                    </div>
                    <div>
                      <label style={styles.label} htmlFor="evento-hora-fin">
                        Hora fin<span style={styles.opc}>opcional</span>
                      </label>
                      <input
                        id="evento-hora-fin"
                        name="horaFin"
                        type="time"
                        value={formData.horaFin}
                        onChange={handleInputChange}
                        style={styles.input}
                        disabled={formLoading}
                      />
                    </div>
                  </div>

                  <div style={styles.campo}>
                    <label style={styles.label} htmlFor="evento-ubicacion">
                      Ubicación<span style={styles.opc}>opcional</span>
                    </label>
                    <input
                      id="evento-ubicacion"
                      name="ubicacion"
                      value={formData.ubicacion}
                      onChange={handleInputChange}
                      placeholder="Ej. Centro Cultural, Sala 2"
                      style={styles.input}
                      disabled={formLoading}
                    />
                  </div>

                  <div style={{ ...styles.campo, marginBottom: stylesGlobal.spacing.scale[2] }}>
                    <label style={styles.label} htmlFor="evento-descripcion">
                      Descripción<span style={styles.opc}>opcional</span>
                    </label>
                    <textarea
                      id="evento-descripcion"
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleInputChange}
                      placeholder="¿De qué trata el evento? Puedes completarla después."
                      rows={3}
                      style={styles.textarea}
                      disabled={formLoading}
                    />
                    <div style={styles.pista}>
                      Solo el título y la fecha son obligatorios. Todo lo demás se puede editar después.
                    </div>
                  </div>
                </div>

                <div style={styles.pie} className="evt-pie">
                  <button
                    type="button"
                    style={{ ...styles.btnSecundario, ...(formLoading ? styles.btnDeshabilitado : {}) }}
                    onClick={cerrarWizard}
                    disabled={formLoading}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    style={{ ...styles.btnPrimario, ...(formLoading ? styles.btnDeshabilitado : {}) }}
                    disabled={formLoading}
                  >
                    {formLoading ? (
                      <>
                        <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                        Guardando...
                      </>
                    ) : (
                      "Guardar y continuar →"
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Paso 2: galería */}
            {paso === 2 && (
              <>
                <div style={{ ...styles.modalCuerpo, paddingTop: soloGaleria ? stylesGlobal.spacing.scale[4] : 0 }}>
                  <p style={styles.subGaleria}>
                    Sube las fotos y videos de <strong>“{eventoActual?.titulo || "el evento"}”</strong>. Se
                    mostrarán en <strong>Destacados → “Revive nuestros eventos”</strong>. Este paso es
                    opcional: puedes cerrarlo y volver cuando quieras.
                  </p>

                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={onDrop}
                    style={styles.zonaSoltar(dragOver)}
                  >
                    <FaCloudUploadAlt size={30} style={{ color: stylesGlobal.colors.primary[400], marginBottom: 8 }} />
                    <div style={{ fontWeight: 600, color: stylesGlobal.colors.text.secondary, marginBottom: 4 }}>
                      Arrastra fotos y videos aquí
                    </div>
                    <div style={{ fontSize: stylesGlobal.typography.scale.sm, color: stylesGlobal.colors.text.tertiary, marginBottom: 12 }}>
                      o
                    </div>
                    <label style={styles.btnArchivos} className="evt-btn-archivos">
                      Seleccionar archivos
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={(e) => { agregarArchivos(e.target.files); e.target.value = ""; }}
                        style={{ display: "none" }}
                      />
                    </label>
                  </div>

                  {/* Cola de subida (los archivos se suben solos al agregarlos) */}
                  {cola.length > 0 && (
                    <div style={{ marginBottom: stylesGlobal.spacing.scale[5], display: "flex", flexDirection: "column", gap: stylesGlobal.spacing.scale[2] }}>
                      {cola.map((it) => (
                        <div key={it.id} style={styles.colaItem}>
                          <div style={styles.colaThumb}>
                            {it.previewUrl ? (
                              <img src={it.previewUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            ) : (
                              <FaVideo color={stylesGlobal.colors.text.tertiary} />
                            )}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: stylesGlobal.colors.text.primary, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {it.titulo}
                            </div>
                            {it.status === "subiendo" && (
                              <div style={styles.barraProgreso}>
                                <div style={{ height: "100%", width: `${it.progress}%`, background: stylesGlobal.colors.primary[500], transition: "width .2s" }} />
                              </div>
                            )}
                            {it.status === "pendiente" && (
                              <span style={{ fontSize: 12, color: stylesGlobal.colors.text.tertiary }}>
                                {it.tipo === "foto" ? "Foto" : "Video"} · en espera
                              </span>
                            )}
                            {it.status === "error" && (
                              <span style={{ fontSize: 12, color: stylesGlobal.colors.semantic.error.main }}>
                                ⚠ {it.error}
                              </span>
                            )}
                          </div>
                          {(it.status === "pendiente" || it.status === "error") && (
                            <button
                              onClick={() => quitarDeCola(it.id)}
                              title="Quitar de la cola"
                              style={{ width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", background: stylesGlobal.colors.neutral[100], color: stylesGlobal.colors.text.secondary, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                            >
                              <FaTrash size={11} />
                            </button>
                          )}
                        </div>
                      ))}
                      {erroresEnCola > 0 && !subiendo && (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button style={styles.btnSecundario} onClick={reintentarErrores}>
                            Reintentar {erroresEnCola} con error
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Media ya subida */}
                  {galeriaLoading ? (
                    <div style={{ textAlign: "center", padding: stylesGlobal.spacing.scale[6], color: stylesGlobal.colors.text.tertiary }}>
                      <FaSpinner style={{ animation: "spin 1s linear infinite", marginRight: 8 }} />
                      Cargando galería…
                    </div>
                  ) : galeriaFotos.length + galeriaVideos.length === 0 && cola.length === 0 ? (
                    <div style={{ textAlign: "center", padding: stylesGlobal.spacing.scale[6], backgroundColor: stylesGlobal.colors.surface.secondary, borderRadius: stylesGlobal.borders.radius.md, color: stylesGlobal.colors.text.tertiary, fontSize: stylesGlobal.typography.scale.sm }}>
                      Aún no hay fotos ni videos. Puedes agregarlos ahora o después desde la lista.
                    </div>
                  ) : (
                    <div style={styles.mediaGrid}>
                      {galeriaFotos.map((f) => (
                        <div key={f._id} style={styles.celdaMedia} className="evt-celda-media">
                          <img
                            src={f.url || "/placeholder.svg"}
                            alt={f.titulo || "Foto"}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <button
                            onClick={() => setConfirmacion({ tipo: "foto", id: f._id, titulo: f.titulo })}
                            title="Quitar foto"
                            className="evt-quitar"
                            style={styles.quitarMedia}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                      {galeriaVideos.map((v) => (
                        <div key={v._id} style={styles.celdaMedia} className="evt-celda-media">
                          <img
                            src={v.miniatura || "/placeholder.svg"}
                            alt={v.titulo || "Video"}
                            loading="lazy"
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          <div style={{ position: "absolute", bottom: 6, left: 6, background: stylesGlobal.colors.primary[500], color: "#fff", borderRadius: stylesGlobal.borders.radius.base, padding: "2px 6px", display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 600 }}>
                            <FaVideo size={10} /> Video
                          </div>
                          <button
                            onClick={() => setConfirmacion({ tipo: "video", id: v._id, titulo: v.titulo })}
                            title="Quitar video"
                            className="evt-quitar"
                            style={styles.quitarMedia}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={styles.pie} className="evt-pie">
                  {soloGaleria ? <span /> : (
                    <button
                      type="button"
                      style={{ ...styles.btnSecundario, ...(subiendo ? styles.btnDeshabilitado : {}) }}
                      onClick={volverADatos}
                      disabled={subiendo}
                    >
                      ← Volver a los datos
                    </button>
                  )}
                  <button
                    type="button"
                    style={{ ...styles.btnPrimario, ...(subiendo ? styles.btnDeshabilitado : {}) }}
                    onClick={cerrarWizard}
                    disabled={subiendo}
                    title={subiendo ? "Espera a que termine la subida" : undefined}
                  >
                    {subiendo ? (
                      <>
                        <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                        Subiendo…
                      </>
                    ) : (
                      "Listo"
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============== Confirmación de eliminación (evento / foto / video) ============== */}
      {confirmacion && (
        <div
          style={{ ...styles.overlay, zIndex: 1400 }}
          className="evt-overlay"
          onClick={(e) => e.target === e.currentTarget && !confirmLoading && setConfirmacion(null)}
        >
          <div style={styles.modalDelete} className="evt-modal">
            <div style={{ padding: stylesGlobal.spacing.scale[6] }}>
              <FaTrash size={42} style={{ color: stylesGlobal.colors.semantic.error.main, marginBottom: stylesGlobal.spacing.scale[4] }} />
              <h2 style={styles.modalTitulo}>{textosConfirmacion[confirmacion.tipo].titulo}</h2>
              {confirmacion.titulo && (
                <p style={{ ...stylesGlobal.typography.body.base, color: stylesGlobal.colors.text.secondary, marginTop: stylesGlobal.spacing.scale[3] }}>
                  <strong>{confirmacion.titulo}</strong>
                </p>
              )}
              <p style={{ ...stylesGlobal.typography.body.caption, color: stylesGlobal.colors.text.muted, fontStyle: "italic", marginTop: stylesGlobal.spacing.scale[2], marginBottom: stylesGlobal.spacing.scale[6] }}>
                {textosConfirmacion[confirmacion.tipo].detalle}
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: stylesGlobal.spacing.scale[3] }}>
                <button
                  style={{ ...styles.btnSecundario, ...(confirmLoading ? styles.btnDeshabilitado : {}) }}
                  onClick={() => setConfirmacion(null)}
                  disabled={confirmLoading}
                >
                  Cancelar
                </button>
                <button
                  style={{
                    ...styles.btnPrimario,
                    backgroundColor: stylesGlobal.colors.semantic.error.main,
                    borderColor: stylesGlobal.colors.semantic.error.main,
                    ...(confirmLoading ? styles.btnDeshabilitado : {}),
                  }}
                  onClick={ejecutarConfirmacion}
                  disabled={confirmLoading}
                >
                  {confirmLoading ? (
                    <>
                      <FaSpinner style={{ animation: "spin 1s linear infinite" }} />
                      Eliminando...
                    </>
                  ) : (
                    "Eliminar"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sistema de notificaciones centralizado */}
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />
    </div>
  );
};

export default GestionEventos;
