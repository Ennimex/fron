import React from "react";
import stylesGlobal from "../../../styles/stylesGlobal";
import asegurarCssAdminUi from "./cssBase";

asegurarCssAdminUi();

/**
 * Modal canónico del panel (lenguaje del boceto aprobado):
 * tarjeta blanca de esquinas 18px, ✕ circular arriba a la derecha y
 * pie de botones en banda crema. `pie` recibe los botones del caller;
 * si un elemento del pie debe ir a la izquierda, dale marginRight: "auto".
 */
const AdminModal = ({
  abierto,
  onCerrar,
  titulo,
  children,
  pie,
  maxWidth = "620px",
  bloqueado = false, // true = no se puede cerrar (p. ej. subida en curso)
}) => {
  if (!abierto) return null;

  return (
    <div
      className="adminui-overlay"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(42, 36, 31, 0.55)",
        backdropFilter: "blur(3px)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={(e) => e.target === e.currentTarget && !bloqueado && onCerrar()}
    >
      <div
        className="adminui-modal"
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "18px",
          border: "none",
          boxShadow: "0 24px 70px rgba(45, 40, 35, 0.3)",
          width: "100%",
          maxWidth,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: stylesGlobal.spacing.scale[3],
            padding: `${stylesGlobal.spacing.scale[5]} ${stylesGlobal.spacing.scale[6]} ${stylesGlobal.spacing.scale[4]}`,
          }}
        >
          <h2 style={{ ...stylesGlobal.typography.headings.h2, fontSize: "1.45rem", margin: 0 }}>{titulo}</h2>
          <button
            type="button"
            className="adminui-cerrar"
            onClick={onCerrar}
            disabled={bloqueado}
            aria-label="Cerrar"
            title={bloqueado ? "Espera a que termine la operación" : "Cerrar"}
            style={{
              width: "34px",
              height: "34px",
              borderRadius: stylesGlobal.borders.radius.full,
              border: `1px solid ${stylesGlobal.borders.colors.default}`,
              backgroundColor: stylesGlobal.colors.surface.primary,
              color: stylesGlobal.colors.text.tertiary,
              fontSize: "17px",
              lineHeight: 1,
              cursor: bloqueado ? "not-allowed" : "pointer",
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: `0 ${stylesGlobal.spacing.scale[6]} ${stylesGlobal.spacing.scale[6]}`, overflowY: "auto" }}>
          {children}
        </div>

        {pie && (
          <div
            className="adminui-pie"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: stylesGlobal.spacing.scale[3],
              flexWrap: "wrap",
              padding: `${stylesGlobal.spacing.scale[4]} ${stylesGlobal.spacing.scale[6]}`,
              borderTop: `1px solid ${stylesGlobal.borders.colors.default}`,
              backgroundColor: stylesGlobal.colors.surface.secondary,
            }}
          >
            {pie}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminModal;
