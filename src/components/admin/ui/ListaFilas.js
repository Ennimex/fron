import React from "react";
import stylesGlobal from "../../../styles/stylesGlobal";
import asegurarCssAdminUi from "./cssBase";

asegurarCssAdminUi();

/**
 * Lista canónica del panel: encabezado de columnas + filas-tarjeta blancas.
 * `columnas` es el gridTemplateColumns compartido por Thead y Fila
 * (p. ej. "2.4fr 1.2fr 1.1fr auto"). En móvil las filas se apilan solas.
 */

export const Thead = ({ columnas, children, style }) => (
  <div
    className="admin-thead"
    style={{
      display: "grid",
      gridTemplateColumns: columnas,
      gap: stylesGlobal.spacing.scale[4],
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[5]}`,
      color: stylesGlobal.colors.text.tertiary,
      fontSize: stylesGlobal.typography.scale.xs,
      fontWeight: stylesGlobal.typography.weights.semibold,
      textTransform: "uppercase",
      letterSpacing: stylesGlobal.typography.tracking.wide,
      ...style,
    }}
  >
    {children}
  </div>
);

export const Fila = ({ columnas, children, style, ...props }) => (
  <div
    className="admin-fila"
    {...props}
    style={{
      display: "grid",
      gridTemplateColumns: columnas,
      gap: stylesGlobal.spacing.scale[4],
      alignItems: "center",
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: `${stylesGlobal.spacing.scale[3]} ${stylesGlobal.spacing.scale[5]}`,
      marginBottom: stylesGlobal.spacing.scale[3],
      boxShadow: stylesGlobal.shadows.sm,
      ...style,
    }}
  >
    {children}
  </div>
);

// Miniatura cuadrada con degradado de marca e inicial (la de Eventos/Tallas)
export const Miniatura = ({ children, style }) => (
  <div
    style={{
      width: "48px",
      height: "48px",
      borderRadius: stylesGlobal.borders.radius.md,
      background: stylesGlobal.colors.gradients.primary,
      color: stylesGlobal.colors.text.inverse,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: stylesGlobal.typography.families.display,
      fontWeight: 700,
      fontSize: "18px",
      flexShrink: 0,
      ...style,
    }}
  >
    {children}
  </div>
);

// Texto secundario de celda, con recorte elegante
export const TextoCelda = ({ children, style }) => (
  <div
    style={{
      color: stylesGlobal.colors.text.secondary,
      fontSize: stylesGlobal.typography.scale.sm,
      minWidth: 0,
      overflow: "hidden",
      textOverflow: "ellipsis",
      ...style,
    }}
  >
    {children}
  </div>
);
