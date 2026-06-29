import React from "react";
import { FaInfoCircle } from "react-icons/fa";
import stylesGlobal from "../../../styles/stylesGlobal";

/**
 * Banner informativo reutilizable del panel admin.
 * Unifica el aviso "¿cómo funciona?" que antes se repetía inline en varias páginas.
 *
 * Props:
 * - icon: componente de icono (por defecto FaInfoCircle)
 * - children: contenido del mensaje
 * - style: overrides opcionales del contenedor
 */
const InfoBanner = ({ icon: Icon = FaInfoCircle, children, style }) => (
  <div
    style={{
      display: "flex",
      gap: stylesGlobal.spacing.scale[3],
      alignItems: "flex-start",
      backgroundColor: stylesGlobal.colors.accent[50],
      border: `1px solid ${stylesGlobal.colors.accent[200]}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[4],
      marginBottom: stylesGlobal.spacing.scale[6],
      color: stylesGlobal.colors.text.secondary,
      ...style,
    }}
  >
    <Icon size={18} style={{ color: stylesGlobal.colors.accent[600], flexShrink: 0, marginTop: 2 }} />
    <div style={{ fontSize: stylesGlobal.typography.scale.sm, lineHeight: 1.55 }}>{children}</div>
  </div>
);

export default InfoBanner;
