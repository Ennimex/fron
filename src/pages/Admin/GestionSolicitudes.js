"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FaClipboardList,
  FaSearch,
  FaEnvelope,
  FaWhatsapp,
  FaPhoneAlt,
  FaBoxOpen,
} from "react-icons/fa";
import adminService from "../../services/adminServices";
import { useAdminNotifications } from "../../services/adminHooks";
import NotificationContainer from "../../components/admin/NotificationContainer";
import stylesPublic from "../../styles/stylesGlobal";

// Estilos CSS responsivos para GestionSolicitudes
const responsiveStyles = `
  @media (max-width: 768px) {
    .solicitudes-container { padding: 1rem !important; }
    .solicitudes-title { font-size: 1.5rem !important; }
    .solicitudes-toolbar { flex-direction: column !important; align-items: stretch !important; }
    .solicitudes-card-head { flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; }
    .solicitudes-card-footer { flex-direction: column !important; align-items: stretch !important; }
    .solicitudes-actions { justify-content: flex-start !important; flex-wrap: wrap !important; }
  }
`;

if (typeof document !== "undefined") {
  const styleElement = document.createElement("style");
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector("style[data-solicitudes-styles]")) {
    styleElement.setAttribute("data-solicitudes-styles", "true");
    document.head.appendChild(styleElement);
  }
}

// Configuración visual de cada estado (alineado con la vista del usuario)
const ESTADOS = {
  pendiente: { bg: "#fffbeb", color: "#92400e", label: "Pendiente" },
  atendida: { bg: "#f0fdf4", color: "#065f46", label: "Atendida" },
  cerrada: { bg: stylesPublic.colors.neutral[100], color: stylesPublic.colors.text.secondary, label: "Cerrada" },
};
const ORDEN_ESTADOS = ["pendiente", "atendida", "cerrada"];

const formatearFecha = (iso) => {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("es-MX", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
};

// Deja solo dígitos y antepone 52 (México) si es un número local de 10 dígitos
const numeroWhatsApp = (tel) => {
  const d = (tel || "").replace(/\D/g, "");
  if (!d) return "";
  return d.length === 10 ? `52${d}` : d;
};

const GestionSolicitudes = () => {
  const { notifications, removeNotification, clearAllNotifications } = useAdminNotifications();

  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todas");
  const [actualizandoId, setActualizandoId] = useState(null);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const data = await adminService.getSolicitudes();
        if (activo) setSolicitudes(Array.isArray(data) ? data : []);
      } catch (err) {
        if (activo) setError(err?.error || err?.message || "Error al cargar las solicitudes");
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    return () => {
      activo = false;
    };
  }, []);

  // Conteo por estado para los filtros
  const conteos = useMemo(() => {
    const base = { todas: solicitudes.length, pendiente: 0, atendida: 0, cerrada: 0 };
    solicitudes.forEach((s) => {
      if (base[s.estado] !== undefined) base[s.estado] += 1;
    });
    return base;
  }, [solicitudes]);

  // Lista filtrada por estado + búsqueda
  const filtradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return solicitudes.filter((s) => {
      const coincideEstado = filtroEstado === "todas" || s.estado === filtroEstado;
      if (!coincideEstado) return false;
      if (!term) return true;
      const enProductos = (s.productos || []).some((p) =>
        (p.nombre || "").toLowerCase().includes(term)
      );
      return (
        (s.nombre || "").toLowerCase().includes(term) ||
        (s.email || "").toLowerCase().includes(term) ||
        (s.telefono || "").toLowerCase().includes(term) ||
        enProductos
      );
    });
  }, [solicitudes, filtroEstado, searchTerm]);

  const cambiarEstado = useCallback(async (id, nuevoEstado) => {
    setActualizandoId(id);
    try {
      const resp = await adminService.updateSolicitudEstado(id, nuevoEstado);
      const actualizada = resp?.data || { estado: nuevoEstado };
      setSolicitudes((prev) =>
        prev.map((s) => (s._id === id ? { ...s, estado: actualizada.estado } : s))
      );
    } catch (err) {
      // adminService ya muestra la notificación de error
    } finally {
      setActualizandoId(null);
    }
  }, []);

  const styles = {
    pageContainer: {
      minHeight: "100vh",
      backgroundColor: stylesPublic.colors.surface.secondary,
      padding: stylesPublic.spacing.scale[8],
    },
    mainContainer: {
      ...stylesPublic.components.card.base,
      maxWidth: stylesPublic.utils.container.maxWidth.xl,
      margin: stylesPublic.spacing.margins.auto,
      padding: stylesPublic.spacing.scale[8],
    },
    header: {
      marginBottom: stylesPublic.spacing.scale[6],
      borderBottom: `${stylesPublic.borders.width[1]} solid ${stylesPublic.borders.colors.default}`,
      paddingBottom: stylesPublic.spacing.scale[4],
    },
    title: {
      ...stylesPublic.typography.headings.h1,
      display: "flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[3],
    },
    subtitle: {
      ...stylesPublic.typography.body.small,
      marginTop: stylesPublic.spacing.scale[2],
    },
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: stylesPublic.spacing.gaps.md,
      flexWrap: "wrap",
      marginBottom: stylesPublic.spacing.scale[6],
    },
    searchWrap: {
      display: "flex",
      alignItems: "center",
      position: "relative",
      flex: 1,
      minWidth: "220px",
      maxWidth: "420px",
    },
    filtroGroup: {
      display: "flex",
      gap: stylesPublic.spacing.scale[2],
      flexWrap: "wrap",
    },
    card: {
      backgroundColor: stylesPublic.colors.surface.primary,
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
      borderRadius: stylesPublic.borders.radius.xl,
      boxShadow: stylesPublic.shadows.base,
      padding: stylesPublic.spacing.scale[5],
    },
    contacto: {
      display: "flex",
      flexWrap: "wrap",
      gap: stylesPublic.spacing.scale[4],
      marginTop: stylesPublic.spacing.scale[2],
    },
    contactoItem: {
      display: "flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[2],
      fontSize: stylesPublic.typography.scale.sm,
      color: stylesPublic.colors.text.secondary,
    },
    badge: {
      fontSize: stylesPublic.typography.scale.xs,
      fontWeight: stylesPublic.typography.weights.medium,
      padding: `${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]}`,
      borderRadius: stylesPublic.borders.radius.full,
      textTransform: "uppercase",
      letterSpacing: stylesPublic.typography.tracking.wide,
    },
    estadoBtn: {
      ...stylesPublic.components.button.sizes.xs,
      border: `1px solid ${stylesPublic.borders.colors.muted}`,
      backgroundColor: stylesPublic.colors.surface.primary,
      color: stylesPublic.colors.text.secondary,
      cursor: "pointer",
      fontWeight: stylesPublic.typography.weights.medium,
    },
    contactoBtn: {
      ...stylesPublic.components.button.sizes.sm,
      display: "inline-flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[2],
      textDecoration: "none",
      cursor: "pointer",
      fontWeight: stylesPublic.typography.weights.medium,
    },
  };

  if (loading) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[12] }}>
          <h3 style={stylesPublic.typography.headings.h3}>Cargando solicitudes...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.pageContainer}>
        <div
          style={{
            textAlign: "center",
            padding: stylesPublic.spacing.scale[8],
            backgroundColor: stylesPublic.colors.semantic.error.light,
            borderRadius: stylesPublic.borders.radius.md,
            maxWidth: "600px",
            margin: stylesPublic.spacing.margins.auto,
          }}
        >
          <h3 style={stylesPublic.typography.headings.h3}>Error</h3>
          <p style={stylesPublic.typography.body.base}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              ...stylesPublic.components.button.variants.primary,
              ...stylesPublic.components.button.sizes.base,
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const sinResultados = filtradas.length === 0;

  return (
    <div style={styles.pageContainer}>
      <NotificationContainer
        notifications={notifications}
        onRemoveNotification={removeNotification}
        onClearAll={clearAllNotifications}
      />

      <div style={styles.mainContainer} className="solicitudes-container">
        <div style={styles.header}>
          <h1 style={styles.title} className="solicitudes-title">
            <FaClipboardList style={{ color: stylesPublic.colors.primary[500] }} />
            Solicitudes de Cotización
          </h1>
          <p style={styles.subtitle}>
            Revisa las cotizaciones que envían los clientes, cambia su estado y respóndeles directamente.
          </p>
        </div>

        {/* Barra de herramientas: búsqueda + filtros por estado */}
        <div style={styles.toolbar} className="solicitudes-toolbar">
          <div style={styles.searchWrap}>
            <FaSearch
              style={{
                position: "absolute",
                left: stylesPublic.spacing.scale[3],
                color: stylesPublic.colors.text.secondary,
              }}
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar por cliente, correo, teléfono o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...stylesPublic.components.input.base, paddingLeft: stylesPublic.spacing.scale[10] }}
            />
          </div>

          <div style={styles.filtroGroup}>
            {["todas", ...ORDEN_ESTADOS].map((clave) => {
              const activo = filtroEstado === clave;
              const etiqueta = clave === "todas" ? "Todas" : ESTADOS[clave].label;
              return (
                <button
                  key={clave}
                  onClick={() => setFiltroEstado(clave)}
                  style={{
                    ...stylesPublic.components.button.sizes.sm,
                    cursor: "pointer",
                    fontWeight: stylesPublic.typography.weights.medium,
                    border: `1px solid ${activo ? stylesPublic.colors.primary[500] : stylesPublic.borders.colors.muted}`,
                    backgroundColor: activo ? stylesPublic.colors.primary[500] : stylesPublic.colors.surface.primary,
                    color: activo ? stylesPublic.colors.primary.contrast : stylesPublic.colors.text.secondary,
                  }}
                >
                  {etiqueta} ({conteos[clave] ?? 0})
                </button>
              );
            })}
          </div>
        </div>

        {/* Lista de solicitudes */}
        {sinResultados ? (
          <div
            style={{
              textAlign: "center",
              padding: `${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[8]}`,
              backgroundColor: stylesPublic.colors.surface.secondary,
              borderRadius: stylesPublic.borders.radius.md,
            }}
          >
            <FaClipboardList size={40} style={{ opacity: 0.3, marginBottom: stylesPublic.spacing.scale[4] }} />
            <h3 style={{ ...stylesPublic.typography.headings.h3, marginBottom: stylesPublic.spacing.scale[2] }}>
              No hay solicitudes que mostrar
            </h3>
            <p style={stylesPublic.typography.body.small}>
              {solicitudes.length === 0
                ? "Cuando un cliente solicite una cotización, aparecerá aquí."
                : "Prueba con otro filtro o término de búsqueda."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[5] }}>
            {filtradas.map((s) => {
              const estado = ESTADOS[s.estado] || ESTADOS.pendiente;
              const wa = numeroWhatsApp(s.telefono);
              const nombresProductos = (s.productos || []).map((p) => p.nombre).filter(Boolean).join(", ");
              const textoWa = encodeURIComponent(
                `Hola ${s.nombre || ""}, gracias por tu solicitud de cotización en La Aterciopelada${
                  nombresProductos ? ` sobre: ${nombresProductos}` : ""
                }.`
              );
              const asuntoMail = encodeURIComponent("Tu solicitud de cotización - La Aterciopelada");

              return (
                <div key={s._id} style={styles.card}>
                  {/* Cabecera: cliente + contacto / fecha + estado */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: stylesPublic.spacing.scale[3],
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                    className="solicitudes-card-head"
                  >
                    <div>
                      <div
                        style={{
                          fontSize: stylesPublic.typography.scale.lg,
                          fontWeight: stylesPublic.typography.weights.semibold,
                          color: stylesPublic.colors.text.primary,
                        }}
                      >
                        {s.nombre || "Cliente"}
                      </div>
                      <div style={styles.contacto}>
                        {s.email && (
                          <span style={styles.contactoItem}>
                            <FaEnvelope size={12} /> {s.email}
                          </span>
                        )}
                        {s.telefono && (
                          <span style={styles.contactoItem}>
                            <FaPhoneAlt size={12} /> {s.telefono}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <span style={{ ...styles.badge, background: estado.bg, color: estado.color }}>
                        {estado.label}
                      </span>
                      <div
                        style={{
                          fontSize: stylesPublic.typography.scale.xs,
                          color: stylesPublic.colors.text.tertiary,
                          marginTop: stylesPublic.spacing.scale[2],
                        }}
                      >
                        {formatearFecha(s.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Productos */}
                  {(s.productos || []).length > 0 && (
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: stylesPublic.spacing.scale[3],
                        marginBottom: stylesPublic.spacing.scale[4],
                      }}
                    >
                      {s.productos.map((p, idx) => (
                        <div
                          key={p.productoId || idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: stylesPublic.spacing.scale[2],
                            backgroundColor: stylesPublic.colors.surface.secondary,
                            borderRadius: stylesPublic.borders.radius.md,
                            padding: stylesPublic.spacing.scale[2],
                          }}
                        >
                          {p.imagenURL ? (
                            <img
                              src={p.imagenURL}
                              alt={p.nombre || "Producto"}
                              style={{
                                width: "44px",
                                height: "44px",
                                objectFit: "cover",
                                borderRadius: stylesPublic.borders.radius.sm,
                              }}
                              onError={(e) => {
                                e.target.style.display = "none";
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: stylesPublic.colors.text.muted,
                                backgroundColor: stylesPublic.colors.neutral[100],
                                borderRadius: stylesPublic.borders.radius.sm,
                              }}
                            >
                              <FaBoxOpen size={18} />
                            </div>
                          )}
                          <span
                            style={{
                              fontSize: stylesPublic.typography.scale.sm,
                              color: stylesPublic.colors.text.primary,
                            }}
                          >
                            {p.nombre || "Producto"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Mensaje del cliente */}
                  {s.mensaje && (
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.text.secondary,
                        background: stylesPublic.colors.surface.secondary,
                        borderRadius: stylesPublic.borders.radius.md,
                        padding: stylesPublic.spacing.scale[3],
                        margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {s.mensaje}
                    </p>
                  )}

                  {/* Pie: cambiar estado + contacto rápido */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[4],
                      flexWrap: "wrap",
                      paddingTop: stylesPublic.spacing.scale[4],
                      borderTop: `1px solid ${stylesPublic.borders.colors.default}`,
                    }}
                    className="solicitudes-card-footer"
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: stylesPublic.spacing.scale[2], flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: stylesPublic.typography.scale.xs,
                          color: stylesPublic.colors.text.tertiary,
                          marginRight: stylesPublic.spacing.scale[1],
                        }}
                      >
                        Marcar como:
                      </span>
                      {ORDEN_ESTADOS.map((clave) => {
                        const activo = s.estado === clave;
                        return (
                          <button
                            key={clave}
                            disabled={activo || actualizandoId === s._id}
                            onClick={() => cambiarEstado(s._id, clave)}
                            style={{
                              ...styles.estadoBtn,
                              ...(activo
                                ? {
                                    backgroundColor: ESTADOS[clave].bg,
                                    color: ESTADOS[clave].color,
                                    borderColor: ESTADOS[clave].color,
                                    cursor: "default",
                                  }
                                : {}),
                              ...(actualizandoId === s._id ? { opacity: 0.6, cursor: "wait" } : {}),
                            }}
                          >
                            {ESTADOS[clave].label}
                          </button>
                        );
                      })}
                    </div>

                    <div style={{ display: "flex", gap: stylesPublic.spacing.scale[2] }} className="solicitudes-actions">
                      {s.email && (
                        <a
                          href={`mailto:${s.email}?subject=${asuntoMail}`}
                          style={{
                            ...styles.contactoBtn,
                            ...stylesPublic.components.button.variants.secondary,
                          }}
                        >
                          <FaEnvelope size={14} /> Correo
                        </a>
                      )}
                      {wa && (
                        <a
                          href={`https://wa.me/${wa}?text=${textoWa}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            ...styles.contactoBtn,
                            backgroundColor: "#25D366",
                            color: "#ffffff",
                            border: "1px solid #25D366",
                          }}
                        >
                          <FaWhatsapp size={16} /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionSolicitudes;
