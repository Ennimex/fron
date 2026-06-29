import React from "react";
import stylesGlobal from "../../../styles/stylesGlobal";
import adminTheme from "../../../styles/adminTheme";

/**
 * Tarjeta de estadística reutilizable (etiqueta + valor grande en serif).
 * Usada en las pantallas de gestión para los resúmenes superiores.
 */
const StatCard = ({ label, value, style }) => (
  <div
    style={{
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.xl,
      padding: `${stylesGlobal.spacing.scale[5]} ${stylesGlobal.spacing.scale[6]}`,
      boxShadow: stylesGlobal.shadows.sm,
      ...style,
    }}
  >
    <div
      style={{
        color: stylesGlobal.colors.text.tertiary,
        fontSize: stylesGlobal.typography.scale.sm,
        fontWeight: stylesGlobal.typography.weights.medium,
        marginBottom: stylesGlobal.spacing.scale[2],
      }}
    >
      {label}
    </div>
    <div style={{ fontFamily: adminTheme.serif, fontSize: "2rem", fontWeight: 700, lineHeight: 1, color: stylesGlobal.colors.text.primary }}>
      {value}
    </div>
  </div>
);

export default StatCard;
