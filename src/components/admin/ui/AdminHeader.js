import React from "react";
import stylesGlobal from "../../../styles/stylesGlobal";
import asegurarCssAdminUi from "./cssBase";

asegurarCssAdminUi();

/**
 * Encabezado estándar de las vistas del panel admin:
 * título serif con icono + subtítulo a la IZQUIERDA, acción a la derecha.
 * (Nada de títulos centrados: ese era uno de los quiebres de uniformidad.)
 */
const AdminHeader = ({ icon: Icon, titulo, subtitulo, accion }) => (
  <div
    className="admin-header"
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: stylesGlobal.spacing.gaps.md,
      marginBottom: stylesGlobal.spacing.scale[8],
    }}
  >
    <div>
      <h1
        style={{
          fontFamily: stylesGlobal.typography.families.display,
          fontSize: "1.9rem",
          fontWeight: 700,
          color: stylesGlobal.colors.text.primary,
          display: "flex",
          alignItems: "center",
          gap: stylesGlobal.spacing.scale[2],
          margin: 0,
        }}
      >
        {Icon && <Icon />}
        {titulo}
      </h1>
      {subtitulo && (
        <p
          style={{
            ...stylesGlobal.typography.body.base,
            color: stylesGlobal.colors.text.secondary,
            marginTop: stylesGlobal.spacing.scale[1],
            marginBottom: 0,
          }}
        >
          {subtitulo}
        </p>
      )}
    </div>
    {accion}
  </div>
);

export default AdminHeader;
