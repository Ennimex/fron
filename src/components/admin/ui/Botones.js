import React from "react";
import stylesGlobal from "../../../styles/stylesGlobal";
import asegurarCssAdminUi from "./cssBase";

asegurarCssAdminUi();

/**
 * Botones canónicos del panel admin. Usarlos (y no armar botones a mano)
 * es lo que garantiza que todas las vistas se vean iguales.
 */

// Botón rosa principal ("Nuevo X", "Guardar", etc.)
export const BotonPrimario = ({ children, icono: Icono, style, disabled, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    {...props}
    style={{
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: "inline-flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.gaps.xs,
      ...(disabled ? { opacity: 0.55, cursor: "not-allowed" } : {}),
      ...style,
    }}
  >
    {Icono && <Icono size={14} />}
    {children}
  </button>
);

// Botón neutro (Cancelar, Volver): blanco con borde suave, como el boceto
export const BotonSecundario = ({ children, icono: Icono, style, disabled, ...props }) => (
  <button
    type="button"
    disabled={disabled}
    {...props}
    style={{
      ...stylesGlobal.components.button.sizes.base,
      backgroundColor: stylesGlobal.colors.surface.primary,
      color: stylesGlobal.colors.text.secondary,
      border: `1.5px solid ${stylesGlobal.colors.neutral[200]}`,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.gaps.xs,
      ...(disabled ? { opacity: 0.55, cursor: "not-allowed" } : {}),
      ...style,
    }}
  >
    {Icono && <Icono size={14} />}
    {children}
  </button>
);

// Botón cuadrado suave de acciones por fila (editar / eliminar / galería)
const VARIANTES_ICONO = {
  editar: () => ({ backgroundColor: stylesGlobal.colors.accent[50], color: stylesGlobal.colors.accent[600] }),
  eliminar: () => ({ backgroundColor: stylesGlobal.colors.primary[50], color: stylesGlobal.colors.primary[500] }),
  galeria: () => ({ backgroundColor: stylesGlobal.colors.secondary[50], color: stylesGlobal.colors.secondary[650] }),
};

export const BotonIcono = ({ variante = "editar", children, style, ...props }) => (
  <button
    type="button"
    className="adminui-btn-icono"
    {...props}
    style={{
      width: "36px",
      height: "36px",
      borderRadius: stylesGlobal.borders.radius.md,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: "none",
      cursor: "pointer",
      ...(VARIANTES_ICONO[variante] ? VARIANTES_ICONO[variante]() : {}),
      ...style,
    }}
  >
    {children}
  </button>
);
