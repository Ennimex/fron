/**
 * Estilos centralizados para La Aterciopelada
 * Este archivo contiene todos los estilos comunes para mantener
 * consistencia visual a través de la aplicación.
 */

const stylesPublic = {
  // ===============================
  // PALETA DE COLORES
  // ===============================
  colors: {
    // Colores primarios
    primary: {
      main: '#ff0070',    // Rosa intenso - Color principal de la marca
      light: '#ff8090',   // Rosa suave
      dark: '#c5005c',    // Rosa oscuro
    },
    
    // Colores secundarios
    secondary: {
      main: '#1f8a80',    // Verde esmeralda
      light: '#4bbcb2',   // Verde esmeralda claro
      dark: '#005a52',    // Verde esmeralda oscuro
    },
    
    // Colores de fondo
    background: {
      main: '#fffffc',    // Blanco puro con tinte cálido
      alt: '#F5E8C7',     // Beige cálido
      gradient: {
        primary: 'linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)',
        secondary: 'linear-gradient(to bottom, #F5E8C7, #FFF8E1)',
        accent: 'linear-gradient(135deg, #ff8090 0%, #1f8a80 100%)',
        cta: 'linear-gradient(135deg, #ff0070 0%, #1f8a80 100%)',
      },
    },
    
    // Colores de texto
    text: {
      primary: '#23102d',   // Morado oscuro casi negro
      secondary: '#403a3c', // Gris oscuro
      light: '#757575',     // Gris medio
      accent: '#ff0070',    // Acento rosa para textos destacados
    },
    
    // Estados y mensajes
    state: {
      error: '#d32f2f',     // Rojo error
      success: '#2e7d32',   // Verde éxito
      warning: '#f57c00',   // Naranja advertencia
      info: '#0288d1',      // Azul información
      disabled: '#bdbdbd',  // Gris deshabilitado
    },
    
    // Colores complementarios
    accent: {
      yellow: '#FFC107',    // Amarillo vibrante
      purple: '#673AB7',    // Púrpura
      orange: '#FF9800',    // Naranja
      teal: '#009688',      // Verde azulado
    },
  },

  // ===============================
  // TIPOGRAFÍA
  // ===============================
  typography: {
    // Familias tipográficas
    fontFamily: {
      heading: "'Playfair Display', serif",  // Títulos elegantes
      body: "'Roboto', sans-serif",          // Texto general
      accent: "'Dancing Script', cursive",   // Textos decorativos
    },
    
    // Tamaños de fuente
    fontSize: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      md: '1rem',        // 16px (base)
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '4rem',     // 64px
      
      // Tamaños responsivos con clamp
      h1: 'clamp(2.5rem, 5vw, 4rem)',      // 40px - 64px
      h2: 'clamp(2rem, 4vw, 2.8rem)',      // 32px - 45px
      h3: 'clamp(1.5rem, 3vw, 2rem)',      // 24px - 32px
      h4: 'clamp(1.25rem, 2vw, 1.5rem)',   // 20px - 24px
      h5: 'clamp(1.125rem, 1.5vw, 1.25rem)', // 18px - 20px
      h6: 'clamp(1rem, 1vw, 1.125rem)',    // 16px - 18px
      p: '1.1rem',                          // 17.6px
      small: '0.875rem',                    // 14px
    },
    
    // Pesos de fuente
    fontWeight: {
      thin: 100,
      extraLight: 200,
      light: 300,
      regular: 400,
      medium: 500,
      semiBold: 600,
      bold: 700,
      extraBold: 800,
      black: 900,
    },
    
    // Altura de línea
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
      paragraph: 1.7,  // Específico para párrafos largos
    },
    
    // Espaciado entre letras
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },

  // ===============================
  // ESPACIADOS
  // ===============================
  spacing: {
    // Unidades base de espaciado
    unit: '8px', // Unidad base de espaciado
    
    // Espaciados predefinidos
    xs: '4px',     // Extra pequeño
    sm: '8px',     // Pequeño
    md: '16px',    // Medio
    lg: '24px',    // Grande
    xl: '32px',    // Extra grande
    '2xl': '48px', // 2x extra grande
    '3xl': '64px', // 3x extra grande
    '4xl': '80px', // 4x extra grande
    '5xl': '96px', // 5x extra grande
    
    // Padding estándar para secciones
    section: {
      xSmall: '2rem 1rem',
      small: '3rem 1.5rem',
      medium: '4rem 2rem',
      large: '6rem 2rem',
      xLarge: '8rem 2rem',
    },
    
    // Margins
    margin: {
      auto: '0 auto',
      pageTop: '80px 0 0', // Margen superior para páginas (debajo del navbar)
    },
    
    // Gaps para grids y flexbox
    gap: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px',
    },
  },

  // ===============================
  // BORDES Y SOMBRAS
  // ===============================
  borders: {
    // Radios de bordes
    radius: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '32px',
      full: '9999px', // Para círculos perfectos
      button: '30px', // Específico para botones
      card: '12px',   // Específico para tarjetas
    },
    
    // Anchos de borde
    width: {
      none: '0',
      thin: '1px',
      thick: '2px',
      thicker: '3px',
      thickest: '4px',
    },
    
    // Estilos de borde predefinidos
    style: {
      solid: 'solid',
      dashed: 'dashed',
      dotted: 'dotted',
      accent: '1px solid rgba(232, 180, 184, 0.15)', // Borde estándar de tarjetas
      active: `3px solid #ff0070`, // Borde para elementos activos
    },
  },

  // Sombras
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15), 0 10px 10px rgba(0, 0, 0, 0.1)',
    
    // Sombras con colores de la marca
    card: '0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)',
    button: '0 8px 24px rgba(232, 180, 184, 0.45)',
    hover: '0 20px 40px rgba(255, 0, 112, 0.35), 0 10px 20px rgba(31, 138, 128, 0.25), 0 6px 12px rgba(44, 35, 41, 0.18)',
    inset: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
  },

  // ===============================
  // DISEÑO RESPONSIVO
  // ===============================
  breakpoints: {
    xs: '320px',   // Extra pequeño (teléfonos pequeños)
    sm: '576px',   // Pequeño (teléfonos)
    md: '768px',   // Medio (tablets)
    lg: '992px',   // Grande (desktop pequeño)
    xl: '1200px',  // Extra grande (desktop)
    '2xl': '1400px', // Doble extra grande (desktop wide)
  },

  // ===============================
  // TRANSICIONES Y ANIMACIONES
  // ===============================
  transitions: {
    // Duraciones
    duration: {
      fastest: '0.1s',
      fast: '0.2s',
      normal: '0.3s',
      slow: '0.5s',
      slowest: '0.8s',
      pageTransition: '1.2s',
    },
    
    // Curvas de aceleración
    easing: {
      easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
      sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
      bounce: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
    
    // Transiciones predefinidas
    preset: {
      default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
      fast: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      pageIn: 'all 1.2s ease-out',
      buttonHover: 'all 0.3s ease',
    },
  },

  // ===============================
  // ELEMENTOS DE DISEÑO COMUNES
  // ===============================
  elements: {
    // Estilos de botones
    buttons: {
      primary: {
        backgroundColor: '#ff4060',
        borderColor: '#ff4060',
        color: '#ffffff',
        borderRadius: '30px',
        padding: '12px 30px',
        fontWeight: 500,
        fontSize: '1.1rem',
        boxShadow: '0 8px 24px rgba(232, 180, 184, 0.45)',
        transition: 'all 0.3s ease',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: '#1f8a80',
        color: '#1f8a80',
        borderRadius: '30px',
        padding: '10px 25px',
        fontWeight: 500,
        fontSize: '1rem',
        boxShadow: 'none',
        transition: 'all 0.3s ease',
      },
      small: {
        padding: '8px 20px',
        fontSize: '0.9rem',
      },
    },
    
    // Estilos de tarjetas
    cards: {
      default: {
        background: '#ffffff',
        borderRadius: '12px',
        padding: '2.5rem 2rem',
        boxShadow: '0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)',
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        border: '1px solid rgba(232, 180, 184, 0.15)',
      },
      hover: {
        transform: 'translateY(-10px)',
        boxShadow: '0 20px 40px rgba(255, 0, 112, 0.35), 0 10px 20px rgba(31, 138, 128, 0.25), 0 6px 12px rgba(44, 35, 41, 0.18)',
      },
      flat: {
        boxShadow: 'none',
        border: '1px solid rgba(232, 180, 184, 0.3)',
      },
    },
    
    // Estilos de inputs
    inputs: {
      default: {
        width: '100%',
        padding: '16px 20px',
        border: '2px solid #E0E0E0',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        fontSize: '16px',
        transition: 'all 0.3s ease',
      },
      focus: {
        borderColor: '#1f8a80',
        boxShadow: '0 4px 20px rgba(31, 138, 128, 0.15)',
        outline: 'none',
      },
      error: {
        borderColor: '#d32f2f',
      },
    },
    
    // Separadores y decoraciones
    decorative: {
      underline: {
        display: 'block',
        width: '60px',
        height: '2px',
        background: 'linear-gradient(90deg, #ff0070, #1f8a80)',
        borderRadius: '1px',
        margin: '15px auto',
      },
      circle: {
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 24px rgba(232, 180, 184, 0.45)',
        margin: '0 auto 1.5rem',
      },
    },
    
    // Fondos decorativos (patrones SVG)
    backgroundPatterns: {
      floral: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="floral-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="15" cy="15" r="1.5" fill="%23ff0070" opacity="0.45"/><circle cx="35" cy="25" r="1" fill="%231f8a80" opacity="0.4"/><circle cx="25" cy="35" r="1.2" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23floral-pattern)"/></svg>')`,
      geometric: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="huasteca-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><polygon points="15,15 20,25 10,25" fill="%23ff0070" opacity="0.45"/><polygon points="35,25 40,35 30,35" fill="%231f8a80" opacity="0.4"/><rect x="25" y="10" width="10" height="10" transform="rotate(45 30 15)" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23huasteca-pattern)"/></svg>')`,
    },
  },

  // ===============================
  // UTILIDADES
  // ===============================
  utils: {
    // Contenedores
    container: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '0 2rem',
      sm: '540px',
      md: '720px',
      lg: '960px',
      xl: '1140px',
      xxl: '1320px',
    },
    
    // Overlay de fondo
    overlay: {
      standard: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1,
      },
      gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(255, 0, 112, 0.2) 0%, rgba(31, 138, 128, 0.2) 100%)',
        zIndex: 1,
      },
      radial: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 30% 40%, #FFF8E1 0%, rgba(245,232,199,0) 50%)',
        zIndex: 1,
      },
    },
    
    // Z-index
    zIndex: {
      background: -1,
      base: 0,
      raised: 1,
      dropdown: 1000,
      sticky: 1100,
      fixed: 1200,
      modal: 1300,
      popover: 1400,
      toast: 1500,
      tooltip: 1600,
    },
  },
};

export default stylesPublic;
