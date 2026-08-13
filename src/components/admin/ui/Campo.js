import React from "react";
import stylesGlobal from "../../../styles/stylesGlobal";

/**
 * Campo de formulario canónico: etiqueta + marcador (* obligatorio /
 * "opcional") + control (children) + error o pista debajo.
 * El control (input/select/textarea) lo pone el caller, normalmente con
 * style={{ ...stylesGlobal.components.input.base, width: "100%" }}.
 */
const Campo = ({ etiqueta, htmlFor, requerido = false, opcional = false, error, pista, children, style }) => (
  <div style={{ marginBottom: stylesGlobal.spacing.scale[5], ...style }}>
    <label
      htmlFor={htmlFor}
      style={{
        display: "block",
        fontSize: "13.5px",
        fontWeight: stylesGlobal.typography.weights.semibold,
        color: stylesGlobal.colors.text.primary,
        marginBottom: stylesGlobal.spacing.scale[2],
      }}
    >
      {etiqueta}
      {requerido && (
        <span style={{ color: stylesGlobal.colors.primary[500], marginLeft: "3px" }} aria-hidden="true">
          *
        </span>
      )}
      {opcional && (
        <span style={{ color: stylesGlobal.colors.text.tertiary, fontWeight: 500, fontSize: "12px", marginLeft: "6px" }}>
          opcional
        </span>
      )}
    </label>
    {children}
    {error ? (
      <div style={{ color: stylesGlobal.colors.semantic.error.main, fontSize: "12.5px", marginTop: stylesGlobal.spacing.scale[1] }}>
        {error}
      </div>
    ) : pista ? (
      <div style={{ ...stylesGlobal.typography.body.caption, marginTop: stylesGlobal.spacing.scale[2] }}>{pista}</div>
    ) : null}
  </div>
);

export default Campo;
