// styles.js

// Paleta de colores actualizada con tonos de la Huasteca Hidalguense
export const colors = {
  // --- Colores Principales ---
  primary: "#2E7D32",      // Verde profundo de la vegetación Huasteca
  secondary: "#1B5E20",    // Verde oscuro para contraste
  accent: "#FFA000",       // Naranja cempasúchil

  // --- Colores de la Naturaleza ---
  forestGreen: "#33691E",  // Verde bosque para elementos principales
  leafGreen: "#558B2F",    // Verde hoja para variaciones
  riverBlue: "#0277BD",    // Azul de los ríos
  skyBlue: "#039BE5",      // Azul cielo huasteco
  sunsetOrange: "#FB8C00", // Naranja atardecer
  
  // --- Colores Festivos ---
  cempasuchil: "#FFB300",  // Amarillo-naranja de la flor
  xantolo: "#FF6F00",      // Naranja intenso de celebración
  artesania: "#D84315",    // Terracota de artesanías

  // --- Neutros Naturales ---
  earth: "#5D4037",        // Café tierra
  stone: "#795548",        // Café piedra
  sand: "#D7CCC8",         // Beige arena
  cloud: "#ECEFF1",        // Blanco nube
  night: "#263238",        // Gris oscuro casi negro
  shadow: "#546E7A",       // Gris medio

  // --- Blancos y Fondos ---
  white: "#FFFFFF",
  offWhite: "#F5F5F5",
  background: "#FAFAFA"
};

export const typography = {
  fontPrimary: "'Montserrat', sans-serif", // Para títulos y encabezados
  fontSecondary: "'Open Sans', sans-serif", // Para textos largos y párrafos
};

export const layout = {
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  sectionPadding: {
    padding: "50px 20px",
  },
};

export const buttons = {
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontFamily: typography.fontPrimary,
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    ':hover': {
      backgroundColor: colors.secondary,
    }
  },
  secondary: {
    backgroundColor: colors.accent,
    color: colors.night,
    padding: "8px 16px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontFamily: typography.fontSecondary,
    fontSize: "14px",
    transition: "background-color 0.3s ease",
    ':hover': {
      backgroundColor: colors.xantolo,
    }
  },
  nature: {
    backgroundColor: colors.forestGreen,
    color: colors.white,
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontFamily: typography.fontPrimary,
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    ':hover': {
      backgroundColor: colors.leafGreen,
    }
  },
  festive: {
    backgroundColor: colors.cempasuchil,
    color: colors.night,
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    fontFamily: typography.fontPrimary,
    fontSize: "16px",
    fontWeight: "bold",
    transition: "background-color 0.3s ease",
    ':hover': {
      backgroundColor: colors.xantolo,
    }
  },
};

export const textStyles = {
  title: {
    fontSize: "32px",
    fontWeight: "bold",
    fontFamily: typography.fontPrimary,
    color: colors.primary,
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "600",
    fontFamily: typography.fontSecondary,
    color: colors.secondary,
  },
  paragraph: {
    fontSize: "16px",
    fontFamily: typography.fontSecondary,
    color: colors.night,
    lineHeight: "1.5",
  },
  accentText: {
    fontFamily: typography.fontSecondary,
    color: colors.accent,
    fontWeight: "bold",
  }
};

export const componentStyles = {
  infoCard: {
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    backgroundColor: colors.white,
    padding: '1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.05)',
    textAlign: "center",
    border: `1px solid ${colors.sand}`,
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
    },
  },
  featureCard: {
    padding: '1.5rem',
    backgroundColor: colors.sand,
    borderRadius: '0.25rem',
    textAlign: 'center',
    color: colors.night,
  },
  featureCardHuasteca: {
    padding: '1.5rem',
    backgroundColor: colors.offWhite,
    borderRadius: '0.25rem',
    textAlign: 'center',
    color: colors.primary,
    border: `2px solid ${colors.secondary}`,
  },
  iconCircle: {
    padding: '1rem',
    backgroundColor: colors.secondary,
    color: colors.white,
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  callToActionSection: {
    textAlign: 'center',
    padding: '3rem 1rem',
    backgroundColor: colors.offWhite,
    borderRadius: '8px',
  },
  callToActionIcon: {
    fontSize: '3rem',
    color: colors.accent,
    marginBottom: '1rem',
  },
  sectionTitle: {
    fontFamily: typography.fontPrimary,
    fontSize: "28px",
    fontWeight: "bold",
    color: colors.primary,
    textAlign: 'center',
    marginBottom: '2rem',
    paddingBottom: '0.5rem',
    borderBottom: `3px solid ${colors.accent}`
  }
};