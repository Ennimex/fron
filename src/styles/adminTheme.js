import stylesGlobal from "./stylesGlobal";

/**
 * Tokens del panel admin.
 *
 * Usa la MISMA paleta de marca que el resto del sitio (stylesGlobal), pero
 * define la "cáscara" visual del back-office: una base crema cálida, tipografía
 * serif para los títulos y el rosa de marca solo como acento. Es la única fuente
 * de estos valores; la importan el sidebar, la barra superior y las páginas admin.
 */
const adminTheme = {
  bg: "#faf6ee", // fondo crema cálido del panel (base neutra)
  surface: stylesGlobal.colors.surface.primary, // tarjetas, sidebar y barra superior
  border: stylesGlobal.colors.neutral[200],
  hover: stylesGlobal.colors.neutral[50],

  serif: stylesGlobal.typography.families.display, // Playfair Display
  body: stylesGlobal.typography.families.body,

  primary: stylesGlobal.colors.primary[500],
  primarySoft: stylesGlobal.colors.primary[50],

  text: stylesGlobal.colors.text.primary,
  text2: stylesGlobal.colors.text.secondary,
  text3: stylesGlobal.colors.text.tertiary,
};

export default adminTheme;
