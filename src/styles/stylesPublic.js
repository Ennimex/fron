/**
 * Sistema de Estilos Globales - La Aterciopelada
 * Versión refactorizada con mejores prácticas y consistencia profesional
 * Autor: Equipo de Desarrollo Frontend
 * Fecha: 2025-06-28
 */

const stylesPublic = {
  // ===============================
  // TOKENS DE DISEÑO - COLORES
  // ===============================
  colors: {
    // Paleta primaria - Rosa vibrante (color principal de la marca)
    primary: {
      50: '#fef7f7',
      100: '#fdeaec',
      200: '#fbd5d9',
      300: '#f7b3bb',
      400: '#f18a98',
      500: '#e00050', // Color principal
      600: '#d1004a',
      700: '#b8003e',
      800: '#9c0035',
      900: '#4a001a',
      contrast: '#ffffff'
    },

    // Paleta secundaria - Verde esmeralda (armonía complementaria)
    secondary: {
      50: '#f0fdfc',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#007a6b', // Ajustado para mejor contraste
      600: '#006d60',
      700: '#005f54',
      800: '#005149',
      900: '#00433e',
      contrast: '#ffffff'
    },

    // Paleta neutra - Tonos de grises y tierras
    neutral: {
      0: '#ffffff',
      50: '#fafaf9',
      100: '#f5f5f4',
      200: '#e7e5e4',
      300: '#d6d3d1',
      400: '#a8a29e',
      500: '#78716c',
      600: '#57534e',
      700: '#44403c',
      800: '#292524',
      900: '#1c1917',
      950: '#0c0a09'
    },

    // Colores semánticos para estados
    semantic: {
      error: {
        light: '#fef2f2',
        main: '#dc2626',
        dark: '#991b1b',
        contrast: '#ffffff'
      },
      warning: {
        light: '#fffbeb',
        main: '#e68a00', // Ajustado para mejor contraste
        dark: '#c27600',
        contrast: '#000000'
      },
      success: {
        light: '#f0fdf4',
        main: '#13843a', // Ajustado para mejor contraste
        dark: '#11682e',
        contrast: '#ffffff'
      },
      info: {
        light: '#eff6ff',
        main: '#2563eb',
        dark: '#1d4ed8',
        contrast: '#ffffff'
      }
    },

    // Colores de fondo y superficies
    surface: {
      primary: '#ffffff',
      secondary: '#fafaf9',
      tertiary: '#f5f5f4',
      elevated: '#ffffff',
      overlay: 'rgba(28, 25, 23, 0.75)',
      glass: 'rgba(245, 245, 244, 0.9)' // Ajustado para mejor compatibilidad
    },

    // Colores de texto con jerarquía clara
    text: {
      primary: '#1c1917', // neutral-900 para máxima legibilidad
      secondary: '#44403c', // neutral-700 para texto secundario
      tertiary: '#78716c', // neutral-500 para texto auxiliar
      inverse: '#ffffff', // Texto sobre fondos oscuros
      accent: '#e00050', // primary-500
      disabled: '#8c8783' // Ajustado para mejor contraste
    },

    // Gradientes de marca optimizados
    gradients: {
      primary: 'linear-gradient(135deg, #e00050 0%, #f18a98 100%)',
      secondary: 'linear-gradient(135deg, #007a6b 0%, #2dd4bf 100%)',
      hero: 'linear-gradient(135deg, #fafaf9 0%, #f7b3bb 30%, #5eead4 60%, #fafaf9 100%)',
      warm: 'linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)',
      accent: 'linear-gradient(135deg, #e00050 0%, #007a6b 50%, #e00050 100%)',
      glass: 'linear-gradient(135deg, rgba(245, 245, 244, 0.9) 0%, rgba(245, 245, 244, 0.6) 100%)'
    }
  },

  // ===============================
  // SISTEMA TIPOGRÁFICO MODERNO 2025
  // ===============================
  typography: {
    // 🔥 Fuentes tipográficas ultra-modernas y actuales
    families: {
      // Para títulos - Fuente display moderna con personalidad
      display: "'Manrope', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
      // Para texto general - Fuente geométrica legible y contemporánea
      body: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      // Para código - Fuente monospace con ligaduras modernas
      mono: "'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace"
    },

    // Escala tipográfica modular basada en ratio 1.25 (cuarta mayor)
    scale: {
      xs: '0.75rem', // 12px
      sm: '0.875rem', // 14px
      base: '1rem', // 16px - Tamaño base
      lg: '1.125rem', // 18px
      xl: '1.25rem', // 20px
      '2xl': '1.5rem', // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem', // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem', // 72px
      '8xl': '6rem', // 96px
    },

    // Jerarquía de encabezados responsivos con fuentes modernas
    headings: {
      h1: {
        fontSize: 'clamp(2.25rem, 4vw + 1rem, 4.5rem)', // 36px - 72px
        fontFamily: "'Manrope', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 800,
        lineHeight: 1.1,
        letterSpacing: '-0.025em'
      },
      h2: {
        fontSize: 'clamp(1.875rem, 3vw + 1rem, 3rem)', // 30px - 48px
        fontFamily: "'Manrope', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: '-0.02em'
      },
      h3: {
        fontSize: 'clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)', // 24px - 36px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: '-0.01em'
      },
      h4: {
        fontSize: 'clamp(1.25rem, 2vw + 0.25rem, 1.875rem)', // 20px - 30px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 600,
        lineHeight: 1.4
      },
      h5: {
        fontSize: 'clamp(1.125rem, 1.5vw + 0.25rem, 1.5rem)', // 18px - 24px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 500,
        lineHeight: 1.4
      },
      h6: {
        fontSize: 'clamp(1rem, 1vw + 0.25rem, 1.25rem)', // 16px - 20px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 500,
        lineHeight: 1.5
      }
    },

    // Variantes de texto para cuerpo con fuente moderna
    body: {
      large: {
        fontSize: '1.125rem',
        lineHeight: 1.7,
        fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
      },
      base: {
        fontSize: '1rem',
        lineHeight: 1.6,
        fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
      },
      small: {
        fontSize: '0.875rem',
        lineHeight: 1.5,
        fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif"
      },
      caption: {
        fontSize: '0.75rem',
        lineHeight: 1.4,
        fontFamily: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
        fontWeight: 500
      }
    },

    // Pesos disponibles
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800
    },

    // Alturas de línea semánticas
    leading: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2
    },

    // Espaciado de letras
    tracking: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em'
    }
  },

  // ===============================
  // SISTEMA DE ESPACIADO MODULAR
  // ===============================
  spacing: {
    // Unidad base (8px) para consistencia
    unit: 8,

    // Escala de espaciado basada en múltiplos de 4px
    scale: {
      0: '0px',
      1: '4px', // 0.25rem
      2: '8px', // 0.5rem - unidad base
      3: '12px', // 0.75rem
      4: '16px', // 1rem
      5: '20px', // 1.25rem
      6: '24px', // 1.5rem
      7: '28px', // 1.75rem
      8: '32px', // 2rem
      9: '36px', // 2.25rem
      10: '40px', // 2.5rem
      11: '44px', // 2.75rem
      12: '48px', // 3rem
      14: '56px', // 3.5rem
      15: '60px', // 3.75rem
      16: '64px', // 4rem
      18: '72px', // 4.5rem
      19: '76px', // 4.75rem
      20: '80px', // 5rem
      24: '96px', // 6rem
      28: '112px', // 7rem
      30: '120px', // 7.5rem
      32: '128px', // 8rem
      36: '144px', // 9rem
      40: '160px', // 10rem
      42: '168px', // 10.5rem
      44: '176px', // 11rem
      45: '180px', // 11.25rem
      48: '192px', // 12rem
      50: '200px', // 12.5rem
      52: '208px', // 13rem
      55: '220px', // 13.75rem
      56: '224px', // 14rem
      60: '240px', // 15rem
      62: '248px', // 15.5rem
      64: '256px', // 16rem
      70: '280px', // 17.5rem
      72: '288px', // 18rem
      75: '300px', // 18.75rem
      80: '320px', // 20rem
      88: '352px', // 22rem
      96: '384px', // 24rem
      100: '400px', // 25rem
      113: '452px', // 28.25rem
      200: '800px', // 50rem
    },

    // Espaciado semántico para secciones
    sections: {
      xs: '2rem 1rem',
      sm: '3rem 1.5rem',
      md: '4rem 2rem',
      lg: '6rem 2rem',
      xl: '8rem 2rem',
      xxl: '12rem 2rem'
    },

    // Márgenes comunes
    margins: {
      auto: '0 auto',
      section: '0 0 4rem 0',
      element: '0 0 1.5rem 0'
    },

    // Gaps para layouts
    gaps: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem'
    }
  },

  // ===============================
  // BORDES Y RADIOS OPTIMIZADOS
  // ===============================
  borders: {
    // Radios consistentes
    radius: {
      none: '0px',
      xs: '2px',
      sm: '4px',
      base: '6px',
      md: '8px',
      lg: '12px',
      xl: '16px',
      '2xl': '24px',
      '3xl': '32px',
      full: '9999px'
    },

    // Anchos estándar
    width: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px',
      8: '8px'
    },

    // Colores de borde semánticos
    colors: {
      default: '#e7e5e4', // neutral-200
      muted: '#d6d3d1', // neutral-300
      strong: '#78716c', // neutral-500
      accent: '#e00050', // primary-500
      success: '#16a34a', // success
      error: '#dc2626', // error
      warning: '#f59e0b' // warning
    }
  },

  // ===============================
  // SISTEMA DE SOMBRAS PROFESIONAL
  // ===============================
  shadows: {
    // Sombras base
    none: 'none',
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',

    // Sombras de marca con colores
    brand: {
      primary: '0 8px 32px -8px rgba(224, 0, 80, 0.3)',
      secondary: '0 8px 32px -8px rgba(0, 152, 133, 0.3)',
      glow: '0 0 32px rgba(224, 0, 80, 0.5)'
    },

    // Sombras internas
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)'
  },

  // ===============================
  // BREAKPOINTS RESPONSIVOS
  // ===============================
  breakpoints: {
    xs: '320px', // Móviles pequeños
    sm: '640px', // Móviles grandes
    md: '768px', // Tablets
    lg: '1024px', // Laptops
    xl: '1280px', // Desktops
    '2xl': '1536px' // Pantallas grandes
  },

  // ===============================
  // SISTEMA DE ANIMACIONES
  // ===============================
  animations: {
    // Duraciones estándar
    duration: {
      instant: '0ms',
      fast: '150ms',
      base: '200ms',
      slow: '300ms',
      slower: '500ms',
      slowest: '1000ms'
    },

    // Curvas de animación
    easing: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    },

    // Transiciones predefinidas
    transitions: {
      base: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
      fast: 'all 150ms cubic-bezier(0, 0, 0.2, 1)',
      slow: 'all 300ms cubic-bezier(0, 0, 0.2, 1)',
      colors: 'color 200ms cubic-bezier(0, 0, 0.2, 1), background-color 200ms cubic-bezier(0, 0, 0.2, 1)',
      opacity: 'opacity 200ms cubic-bezier(0, 0, 0.2, 1)',
      transform: 'transform 200ms cubic-bezier(0, 0, 0.2, 1)'
    }
  },

  // ===============================
  // COMPONENTES BASE
  // ===============================
  components: {
    // Sistema de botones
    button: {
      // Tamaños
      sizes: {
        xs: {
          padding: '6px 12px',
          fontSize: '0.75rem',
          borderRadius: '4px'
        },
        sm: {
          padding: '8px 16px',
          fontSize: '0.875rem',
          borderRadius: '6px'
        },
        base: {
          padding: '12px 24px',
          fontSize: '1rem',
          borderRadius: '8px'
        },
        lg: {
          padding: '16px 32px',
          fontSize: '1.125rem',
          borderRadius: '12px'
        },
        xl: {
          padding: '20px 40px',
          fontSize: '1.25rem',
          borderRadius: '16px'
        }
      },

      // Variantes
      variants: {
        primary: {
          backgroundColor: '#e00050',
          color: '#ffffff',
          border: '1px solid #e00050',
          boxShadow: '0 8px 32px -8px rgba(224, 0, 80, 0.3)',
          transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#d1004a',
            transform: 'translateY(-2px)',
            boxShadow: '0 12px 40px -8px rgba(224, 0, 80, 0.4)'
          }
        },
        secondary: {
          backgroundColor: 'transparent',
          color: '#007a6b',
          border: '1px solid #007a6b',
          transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#007a6b',
            color: '#ffffff'
          }
        },
        ghost: {
          backgroundColor: 'transparent',
          color: '#44403c',
          border: '1px solid transparent',
          transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: '#f5f5f4',
            color: '#1c1917'
          }
        }
      }
    },

    // Sistema de tarjetas
    card: {
      base: {
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e7e5e4',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)'
      },
      elevated: {
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)'
      },
      interactive: {
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)'
        }
      }
    },

    // Sistema de inputs
    input: {
      base: {
        width: '100%',
        padding: '12px 16px',
        fontSize: '1rem',
        lineHeight: '1.5',
        color: '#1c1917',
        backgroundColor: '#ffffff',
        border: '1px solid #d6d3d1',
        borderRadius: '8px',
        transition: 'all 200ms cubic-bezier(0, 0, 0.2, 1)',
        '&:focus': {
          outline: 'none',
          borderColor: '#007a6b',
          boxShadow: '0 0 0 3px rgba(0, 122, 107, 0.1)'
        }
      },
      error: {
        borderColor: '#dc2626',
        '&:focus': {
          borderColor: '#dc2626',
          boxShadow: '0 0 0 3px rgba(220, 38, 38, 0.1)'
        }
      }
    }
  },

  // ===============================
  // UTILIDADES Y HELPERS
  // ===============================
  utils: {
    // Contenedores
    container: {
      center: 'true',
      padding: '1rem',
      maxWidth: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px'
      }
    },

    // Z-index scale
    zIndex: {
      hide: -1,
      auto: 'auto',
      base: 0,
      docked: 10,
      dropdown: 1000,
      sticky: 1100,
      banner: 1200,
      overlay: 1300,
      modal: 1400,
      popover: 1500,
      skipLink: 1600,
      toast: 1700,
      tooltip: 1800
    },

    // Overlay helpers
    overlay: {
      base: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(28, 25, 23, 0.75)',
        zIndex: 1300
      },
      blur: {
        backdropFilter: 'blur(8px)'
      }
    },

    // Screen reader utilities
    sr: {
      only: {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0'
      }
    }
  }
};

export default stylesPublic;