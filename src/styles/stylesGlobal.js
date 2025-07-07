/**
 * Sistema de Estilos Globales - La Aterciopelada
 * Versión mejorada con paleta de colores elegante y profesional
 * Paleta inspirada en tonos suaves, elegantes y sofisticados
 * Autor: Equipo de Desarrollo Frontend
 * Fecha: 2025-01-02
 */

const stylesGlobal = {
  // ===============================
  // TOKENS DE DISEÑO - COLORES MEJORADOS
  // ===============================
  colors: {
    // Paleta primaria - Rosa elegante y sofisticado (dusty rose)
    primary: {
      50: "#fdf2f4",
      100: "#fce7eb",
      200: "#f9d0d9",
      300: "#f4a6b7",
      400: "#ed7590",
      500: "#d63384", // Color principal - rosa elegante
      600: "#c02a74",
      700: "#a02464",
      800: "#85205a",
      900: "#6f1e52",
      contrast: "#ffffff",
    },

    // Paleta secundaria - Verde salvia elegante (sage green)
    secondary: {
      50: "#f6f8f6",
      100: "#e8f0e8",
      200: "#d3e2d3",
      300: "#b0ccb0",
      400: "#85b085",
      500: "#6b9b6b", // Verde salvia principal
      600: "#5a8a5a",
      700: "#4a734a",
      800: "#3d5e3d",
      900: "#344f34",
      contrast: "#ffffff",
    },

    // Paleta de acento - Dorado champagne para elegancia
    accent: {
      50: "#fefcf3",
      100: "#fef7e0",
      200: "#fdecc0",
      300: "#fbdb95",
      400: "#f7c668",
      500: "#e6a756", // Dorado champagne
      600: "#d4924a",
      700: "#b17c3e",
      800: "#8f6538",
      900: "#755432",
      contrast: "#000000",
    },

    // Paleta neutra - Tonos cálidos y elegantes
    neutral: {
      0: "#ffffff",
      50: "#fafaf9",
      100: "#f7f6f4",
      200: "#ede9e6",
      300: "#ddd6d1",
      400: "#b8aca4",
      500: "#8b7d74",
      600: "#6b5d54",
      700: "#524842",
      800: "#3a332e",
      900: "#2a241f",
      950: "#1a1612",
    },

    // Colores semánticos mejorados
    semantic: {
      error: {
        light: "#fef2f2",
        main: "#e11d48", // Rosa-rojo elegante
        dark: "#be123c",
        contrast: "#ffffff",
      },
      warning: {
        light: "#fffbeb",
        main: "#f59e0b", // Ámbar cálido
        dark: "#d97706",
        contrast: "#000000",
      },
      success: {
        light: "#f0fdf4",
        main: "#22c55e", // Verde fresco
        dark: "#16a34a",
        contrast: "#ffffff",
      },
      info: {
        light: "#f0f9ff",
        main: "#0ea5e9", // Azul cielo
        dark: "#0284c7",
        contrast: "#ffffff",
      },
    },

    // Colores de fondo y superficies mejorados
    surface: {
      primary: "#ffffff",
      secondary: "#fafaf9",
      tertiary: "#f7f6f4",
      elevated: "#ffffff",
      overlay: "rgba(42, 36, 31, 0.75)",
      glass: "rgba(247, 246, 244, 0.9)",
      accent: "#fefcf3", // Fondo con toque dorado
    },

    // Colores de texto con mejor jerarquía
    text: {
      primary: "#2a241f", // neutral-900 para máxima legibilidad
      secondary: "#524842", // neutral-700 para texto secundario
      tertiary: "#8b7d74", // neutral-500 para texto auxiliar
      inverse: "#ffffff", // Texto sobre fondos oscuros
      accent: "#d63384", // primary-500
      muted: "#b8aca4", // Para texto deshabilitado
      luxury: "#e6a756", // Para acentos dorados
    },

    // Gradientes elegantes y sofisticados
    gradients: {
      primary: "linear-gradient(135deg, #d63384 0%, #ed7590 100%)",
      secondary: "linear-gradient(135deg, #6b9b6b 0%, #85b085 100%)",
      luxury: "linear-gradient(135deg, #e6a756 0%, #f7c668 100%)",
      hero: "linear-gradient(135deg, #fafaf9 0%, #fdf2f4 30%, #f6f8f6 60%, #fefcf3 100%)",
      warm: "linear-gradient(to bottom, #fafaf9 0%, #f7f6f4 50%, #fefcf3 100%)",
      elegant: "linear-gradient(135deg, #d63384 0%, #6b9b6b 50%, #e6a756 100%)",
      glass: "linear-gradient(135deg, rgba(247, 246, 244, 0.95) 0%, rgba(254, 252, 243, 0.8) 100%)",
      sunset: "linear-gradient(135deg, #fdf2f4 0%, #fef7e0 50%, #f6f8f6 100%)",
    },
  },

  // ===============================
  // SISTEMA TIPOGRÁFICO MODERNO 2025
  // ===============================
  typography: {
    // Fuentes tipográficas elegantes y modernas
    families: {
      // Para títulos - Fuente elegante con personalidad
      display: "'Playfair Display', 'Crimson Text', 'Times New Roman', serif",
      // Para texto general - Fuente limpia y legible
      body: "'Inter', 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif",
      // Para elementos especiales - Fuente script elegante
      script: "'Dancing Script', 'Brush Script MT', cursive",
      // Para código - Fuente monospace moderna
      mono: "'JetBrains Mono', 'SF Mono', 'Cascadia Code', 'Fira Code', Consolas, monospace",
    },

    // Escala tipográfica modular basada en ratio 1.25 (cuarta mayor)
    scale: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px - Tamaño base
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
      "6xl": "3.75rem", // 60px
      "7xl": "4.5rem", // 72px
      "8xl": "6rem", // 96px
    },

    // Jerarquía de encabezados con fuentes elegantes
    headings: {
      h1: {
        fontSize: "clamp(2.25rem, 4vw + 1rem, 4.5rem)", // 36px - 72px
        fontFamily: "'Playfair Display', 'Crimson Text', serif",
        fontWeight: 700,
        lineHeight: 1.1,
        letterSpacing: "-0.025em",
        color: "#2a241f",
      },
      h2: {
        fontSize: "clamp(1.875rem, 3vw + 1rem, 3rem)", // 30px - 48px
        fontFamily: "'Playfair Display', 'Crimson Text', serif",
        fontWeight: 600,
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        color: "#2a241f",
      },
      h3: {
        fontSize: "clamp(1.5rem, 2.5vw + 0.5rem, 2.25rem)", // 24px - 36px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 600,
        lineHeight: 1.3,
        letterSpacing: "-0.01em",
        color: "#524842",
      },
      h4: {
        fontSize: "clamp(1.25rem, 2vw + 0.25rem, 1.875rem)", // 20px - 30px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 600,
        lineHeight: 1.4,
        color: "#524842",
      },
      h5: {
        fontSize: "clamp(1.125rem, 1.5vw + 0.25rem, 1.5rem)", // 18px - 24px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 500,
        lineHeight: 1.4,
        color: "#524842",
      },
      h6: {
        fontSize: "clamp(1rem, 1vw + 0.25rem, 1.25rem)", // 16px - 20px
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 500,
        lineHeight: 1.5,
        color: "#8b7d74",
      },
    },

    // Variantes de texto para cuerpo
    body: {
      large: {
        fontSize: "1.125rem",
        lineHeight: 1.7,
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        color: "#524842",
      },
      base: {
        fontSize: "1rem",
        lineHeight: 1.6,
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        color: "#2a241f",
      },
      small: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        color: "#8b7d74",
      },
      caption: {
        fontSize: "0.75rem",
        lineHeight: 1.4,
        fontFamily: "'Inter', 'SF Pro Text', sans-serif",
        fontWeight: 500,
        color: "#b8aca4",
      },
    },

    // Pesos disponibles
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },

    // Alturas de línea semánticas
    leading: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },

    // Espaciado de letras
    tracking: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },

  // ===============================
  // SISTEMA DE ESPACIADO MODULAR
  // ===============================
  spacing: {
    // Unidad base (8px) para consistencia
    unit: 8,
    // Escala de espaciado basada en múltiplos de 4px
    scale: {
      0: "0px",
      1: "4px", // 0.25rem
      2: "8px", // 0.5rem - unidad base
      3: "12px", // 0.75rem
      4: "16px", // 1rem
      5: "20px", // 1.25rem
      6: "24px", // 1.5rem
      7: "28px", // 1.75rem
      8: "32px", // 2rem
      9: "36px", // 2.25rem
      10: "40px", // 2.5rem
      11: "44px", // 2.75rem
      12: "48px", // 3rem
      14: "56px", // 3.5rem
      15: "60px", // 3.75rem
      16: "64px", // 4rem
      18: "72px", // 4.5rem
      19: "76px", // 4.75rem
      20: "80px", // 5rem
      24: "96px", // 6rem
      28: "112px", // 7rem
      30: "120px", // 7.5rem
      32: "128px", // 8rem
      36: "144px", // 9rem
      40: "160px", // 10rem
      42: "168px", // 10.5rem
      44: "176px", // 11rem
      45: "180px", // 11.25rem
      48: "192px", // 12rem
      50: "200px", // 12.5rem
      52: "208px", // 13rem
      55: "220px", // 13.75rem
      56: "224px", // 14rem
      60: "240px", // 15rem
      62: "248px", // 15.5rem
      64: "256px", // 16rem
      70: "280px", // 17.5rem
      72: "288px", // 18rem
      75: "300px", // 18.75rem
      80: "320px", // 20rem
      88: "352px", // 22rem
      96: "384px", // 24rem
      100: "400px", // 25rem
      113: "452px", // 28.25rem
      200: "800px", // 50rem
    },

    // Espaciado semántico para secciones
    sections: {
      xs: "2rem 1rem",
      sm: "3rem 1.5rem",
      md: "4rem 2rem",
      lg: "6rem 2rem",
      xl: "8rem 2rem",
      xxl: "12rem 2rem",
    },

    // Márgenes comunes
    margins: {
      auto: "0 auto",
      section: "0 0 4rem 0",
      element: "0 0 1.5rem 0",
    },

    // Gaps para layouts
    gaps: {
      xs: "0.5rem",
      sm: "1rem",
      md: "1.5rem",
      lg: "2rem",
      xl: "3rem",
    },
  },

  // ===============================
  // BORDES Y RADIOS OPTIMIZADOS
  // ===============================
  borders: {
    // Radios consistentes
    radius: {
      none: "0px",
      xs: "2px",
      sm: "4px",
      base: "6px",
      md: "8px",
      lg: "12px",
      xl: "16px",
      "2xl": "24px",
      "3xl": "32px",
      full: "9999px",
    },

    // Anchos estándar
    width: {
      0: "0px",
      1: "1px",
      2: "2px",
      4: "4px",
      8: "8px",
    },

    // Colores de borde mejorados
    colors: {
      default: "#ede9e6", // neutral-200
      muted: "#ddd6d1", // neutral-300
      strong: "#8b7d74", // neutral-500
      accent: "#d63384", // primary-500
      luxury: "#e6a756", // accent-500
      success: "#22c55e", // success
      error: "#e11d48", // error
      warning: "#f59e0b", // warning
    },
  },

  // ===============================
  // SISTEMA DE SOMBRAS ELEGANTE
  // ===============================
  shadows: {
    // Sombras base
    none: "none",
    xs: "0 1px 2px 0 rgba(42, 36, 31, 0.05)",
    sm: "0 1px 3px 0 rgba(42, 36, 31, 0.1), 0 1px 2px -1px rgba(42, 36, 31, 0.1)",
    base: "0 4px 6px -1px rgba(42, 36, 31, 0.1), 0 2px 4px -2px rgba(42, 36, 31, 0.1)",
    md: "0 10px 15px -3px rgba(42, 36, 31, 0.1), 0 4px 6px -4px rgba(42, 36, 31, 0.1)",
    lg: "0 20px 25px -5px rgba(42, 36, 31, 0.1), 0 8px 10px -6px rgba(42, 36, 31, 0.1)",
    xl: "0 25px 50px -12px rgba(42, 36, 31, 0.25)",
    "2xl": "0 50px 100px -20px rgba(42, 36, 31, 0.25)",

    // Sombras de marca con colores elegantes
    brand: {
      primary: "0 8px 32px -8px rgba(214, 51, 132, 0.25)",
      secondary: "0 8px 32px -8px rgba(107, 155, 107, 0.25)",
      luxury: "0 8px 32px -8px rgba(230, 167, 86, 0.3)",
      glow: "0 0 32px rgba(214, 51, 132, 0.4)",
      elegant: "0 12px 40px -8px rgba(214, 51, 132, 0.2), 0 4px 16px -4px rgba(230, 167, 86, 0.15)",
    },

    // Sombras internas
    inner: "inset 0 2px 4px 0 rgba(42, 36, 31, 0.05)",
  },

  // ===============================
  // BREAKPOINTS RESPONSIVOS
  // ===============================
  breakpoints: {
    xs: "320px", // Móviles pequeños
    sm: "640px", // Móviles grandes
    md: "768px", // Tablets
    lg: "1024px", // Laptops
    xl: "1280px", // Desktops
    "2xl": "1536px", // Pantallas grandes
  },

  // ===============================
  // SISTEMA DE ANIMACIONES ELEGANTE
  // ===============================
  animations: {
    // Duraciones estándar
    duration: {
      instant: "0ms",
      fast: "150ms",
      base: "200ms",
      slow: "300ms",
      slower: "500ms",
      slowest: "1000ms",
      elegant: "400ms", // Para transiciones elegantes
    },

    // Curvas de animación elegantes
    easing: {
      linear: "linear",
      ease: "ease",
      "ease-in": "cubic-bezier(0.4, 0, 1, 1)",
      "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
      "ease-in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
      bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
      elegant: "cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Curva elegante
    },

    // Transiciones predefinidas
    transitions: {
      base: "all 200ms cubic-bezier(0, 0, 0.2, 1)",
      fast: "all 150ms cubic-bezier(0, 0, 0.2, 1)",
      slow: "all 300ms cubic-bezier(0, 0, 0.2, 1)",
      elegant: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      colors: "color 200ms cubic-bezier(0, 0, 0.2, 1), background-color 200ms cubic-bezier(0, 0, 0.2, 1)",
      opacity: "opacity 200ms cubic-bezier(0, 0, 0.2, 1)",
      transform: "transform 200ms cubic-bezier(0, 0, 0.2, 1)",
    },
  },

  // ===============================
  // COMPONENTES BASE MEJORADOS
  // ===============================
  components: {
    // ===============================
    // COMPONENTES DE NAVEGACIÓN ELEGANTES
    // ===============================
    
    // Sistema de Navbar/Header elegante
    navbar: {
      // Configuración base
      base: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "72px",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #ede9e6",
        boxShadow: "0 1px 3px 0 rgba(42, 36, 31, 0.1), 0 1px 2px -1px rgba(42, 36, 31, 0.1)",
        zIndex: 1100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 2rem",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },

      // Variantes
      variants: {
        transparent: {
          backgroundColor: "transparent",
          backdropFilter: "none",
          borderBottom: "1px solid transparent",
          boxShadow: "none",
        },
        solid: {
          backgroundColor: "#ffffff",
          backdropFilter: "none",
        },
        luxury: {
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(254, 252, 243, 0.95) 100%)",
          borderBottom: "1px solid #e6a756",
          boxShadow: "0 1px 3px 0 rgba(230, 167, 86, 0.1)",
        },
        dark: {
          backgroundColor: "rgba(42, 36, 31, 0.95)",
          borderBottom: "1px solid #524842",
          color: "#ffffff",
        },
      },

      // Estados de scroll
      scrolled: {
        height: "64px",
        boxShadow: "0 4px 6px -1px rgba(42, 36, 31, 0.1), 0 2px 4px -2px rgba(42, 36, 31, 0.1)",
        backgroundColor: "#ffffff",
      },

      // Elementos internos
      brand: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "#d63384",
        textDecoration: "none",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          color: "#c02a74",
          transform: "translateY(-1px)",
        },
      },

      nav: {
        display: "flex",
        alignItems: "center",
        gap: "2rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
      },

      navItem: {
        position: "relative",
      },

      navLink: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        fontSize: "1rem",
        fontWeight: 500,
        color: "#524842",
        textDecoration: "none",
        borderRadius: "10px",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          color: "#d63384",
          backgroundColor: "#fdf2f4",
          transform: "translateY(-1px)",
        },
        "&.active": {
          color: "#d63384",
          backgroundColor: "#fdf2f4",
          fontWeight: 600,
        },
      },

      actions: {
        display: "flex",
        alignItems: "center",
        gap: "1rem",
      },

      // Responsive
      mobile: {
        padding: "0 1rem",
        height: "60px",
      },

      mobileMenu: {
        position: "fixed",
        top: "72px",
        left: 0,
        right: 0,
        backgroundColor: "rgba(255, 255, 255, 0.98)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #ede9e6",
        boxShadow: "0 10px 15px -3px rgba(42, 36, 31, 0.1)",
        padding: "1rem",
        transform: "translateY(-100%)",
        opacity: 0,
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        zIndex: 1050,
        "&.open": {
          transform: "translateY(0)",
          opacity: 1,
        },
      },

      hamburger: {
        display: "none",
        flexDirection: "column",
        gap: "4px",
        width: "24px",
        height: "18px",
        cursor: "pointer",
        "@media (max-width: 768px)": {
          display: "flex",
        },
      },

      hamburgerLine: {
        width: "100%",
        height: "2px",
        backgroundColor: "#524842",
        borderRadius: "2px",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
    },

    // Sistema de Sidebar elegante
    sidebar: {
      // Configuración base
      base: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "280px",
        height: "100vh",
        backgroundColor: "#ffffff",
        borderRight: "1px solid #ede9e6",
        boxShadow: "4px 0 6px -1px rgba(42, 36, 31, 0.1)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        overflow: "hidden",
      },

      // Variantes
      variants: {
        luxury: {
          background: "linear-gradient(180deg, #ffffff 0%, #fefcf3 100%)",
          borderRight: "1px solid #e6a756",
        },
        dark: {
          backgroundColor: "#2a241f",
          borderRight: "1px solid #524842",
          color: "#ffffff",
        },
        glass: {
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(12px)",
        },
        minimal: {
          width: "64px",
          borderRight: "1px solid #ede9e6",
        },
      },

      // Estados
      collapsed: {
        width: "64px",
        ".sidebar-text": {
          opacity: 0,
          transform: "translateX(-10px)",
        },
        ".sidebar-logo-text": {
          display: "none",
        },
      },

      // Elementos internos
      header: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "1.5rem 1.5rem 1rem 1.5rem",
        borderBottom: "1px solid #ede9e6",
        minHeight: "72px",
      },

      logo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        textDecoration: "none",
      },

      logoIcon: {
        width: "32px",
        height: "32px",
        borderRadius: "8px",
        backgroundColor: "#d63384",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "1.2rem",
        fontWeight: 700,
      },

      logoText: {
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#2a241f",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },

      content: {
        flex: 1,
        padding: "1rem",
        overflow: "auto",
      },

      nav: {
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        listStyle: "none",
        margin: 0,
        padding: 0,
      },

      navItem: {
        position: "relative",
      },

      navLink: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        fontSize: "0.95rem",
        fontWeight: 500,
        color: "#524842",
        textDecoration: "none",
        borderRadius: "10px",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          color: "#d63384",
          backgroundColor: "#fdf2f4",
          transform: "translateX(4px)",
        },
        "&.active": {
          color: "#d63384",
          backgroundColor: "#fdf2f4",
          fontWeight: 600,
          "&::before": {
            content: '""',
            position: "absolute",
            left: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: "3px",
            height: "24px",
            backgroundColor: "#d63384",
            borderRadius: "0 2px 2px 0",
          },
        },
      },

      navIcon: {
        width: "20px",
        height: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },

      navText: {
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },

      section: {
        marginTop: "2rem",
        "&:first-child": {
          marginTop: 0,
        },
      },

      sectionTitle: {
        fontSize: "0.75rem",
        fontWeight: 600,
        color: "#8b7d74",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
        padding: "0 16px 8px 16px",
        marginBottom: "8px",
      },

      footer: {
        padding: "1rem 1.5rem",
        borderTop: "1px solid #ede9e6",
        marginTop: "auto",
      },

      // Toggle button
      toggle: {
        position: "absolute",
        top: "50%",
        right: "-12px",
        transform: "translateY(-50%)",
        width: "24px",
        height: "24px",
        backgroundColor: "#ffffff",
        border: "1px solid #ede9e6",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        boxShadow: "0 2px 4px rgba(42, 36, 31, 0.1)",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          backgroundColor: "#fdf2f4",
          borderColor: "#d63384",
          transform: "translateY(-50%) scale(1.1)",
        },
      },

      // Responsive
      mobile: {
        transform: "translateX(-100%)",
        "&.open": {
          transform: "translateX(0)",
        },
      },

      overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(42, 36, 31, 0.5)",
        zIndex: 999,
        opacity: 0,
        visibility: "hidden",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&.active": {
          opacity: 1,
          visibility: "visible",
        },
      },
    },

    // Sistema de Footer elegante
    footer: {
      // Configuración base
      base: {
        backgroundColor: "#2a241f",
        color: "#ffffff",
        marginTop: "auto",
      },

      // Variantes
      variants: {
        simple: {
          padding: "2rem 0",
          textAlign: "center",
          borderTop: "1px solid #524842",
        },
        complex: {
          padding: "4rem 0 2rem 0",
        },
        luxury: {
          background: "linear-gradient(135deg, #2a241f 0%, #3a332e 100%)",
          borderTop: "1px solid #e6a756",
        },
        minimal: {
          backgroundColor: "#fafaf9",
          color: "#524842",
          borderTop: "1px solid #ede9e6",
          padding: "1.5rem 0",
        },
      },

      // Secciones del footer
      main: {
        padding: "4rem 0 2rem 0",
      },

      grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "2rem",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 2rem",
      },

      section: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      },

      brand: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "300px",
      },

      logo: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "1rem",
      },

      logoIcon: {
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        backgroundColor: "#d63384",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#ffffff",
        fontSize: "1.5rem",
        fontWeight: 700,
      },

      logoText: {
        fontFamily: "'Playfair Display', serif",
        fontSize: "1.5rem",
        fontWeight: 700,
        color: "#ffffff",
      },

      description: {
        fontSize: "0.95rem",
        lineHeight: 1.6,
        color: "#b8aca4",
      },

      title: {
        fontSize: "1.125rem",
        fontWeight: 600,
        color: "#ffffff",
        marginBottom: "1rem",
      },

      nav: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        listStyle: "none",
        margin: 0,
        padding: 0,
      },

      navLink: {
        color: "#b8aca4",
        textDecoration: "none",
        fontSize: "0.95rem",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          color: "#d63384",
          transform: "translateX(4px)",
        },
      },

      // Sección de contacto
      contact: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      },

      contactItem: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#b8aca4",
        fontSize: "0.95rem",
      },

      contactIcon: {
        width: "20px",
        height: "20px",
        color: "#d63384",
      },

      // Redes sociales
      social: {
        display: "flex",
        gap: "1rem",
        marginTop: "1rem",
      },

      socialLink: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "40px",
        height: "40px",
        backgroundColor: "#524842",
        color: "#ffffff",
        borderRadius: "10px",
        textDecoration: "none",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          backgroundColor: "#d63384",
          transform: "translateY(-2px)",
          boxShadow: "0 8px 16px rgba(214, 51, 132, 0.3)",
        },
      },

      // Newsletter
      newsletter: {
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        maxWidth: "300px",
      },

      newsletterForm: {
        display: "flex",
        gap: "8px",
      },

      newsletterInput: {
        flex: 1,
        padding: "10px 14px",
        fontSize: "0.95rem",
        backgroundColor: "#524842",
        border: "1px solid #6b5d54",
        borderRadius: "8px",
        color: "#ffffff",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:focus": {
          outline: "none",
          borderColor: "#d63384",
          boxShadow: "0 0 0 2px rgba(214, 51, 132, 0.2)",
        },
        "&::placeholder": {
          color: "#b8aca4",
        },
      },

      newsletterButton: {
        padding: "10px 16px",
        backgroundColor: "#d63384",
        color: "#ffffff",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "0.95rem",
        fontWeight: 500,
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          backgroundColor: "#c02a74",
          transform: "translateY(-1px)",
        },
      },

      // Sección inferior
      bottom: {
        borderTop: "1px solid #524842",
        padding: "1.5rem 0",
        marginTop: "2rem",
      },

      bottomContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 2rem",
        gap: "1rem",
        "@media (max-width: 768px)": {
          flexDirection: "column",
          textAlign: "center",
        },
      },

      copyright: {
        fontSize: "0.875rem",
        color: "#8b7d74",
      },

      bottomNav: {
        display: "flex",
        gap: "2rem",
        listStyle: "none",
        margin: 0,
        padding: 0,
        "@media (max-width: 768px)": {
          flexDirection: "column",
          gap: "1rem",
        },
      },

      bottomNavLink: {
        color: "#8b7d74",
        textDecoration: "none",
        fontSize: "0.875rem",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:hover": {
          color: "#d63384",
        },
      },

      // Responsive
      mobile: {
        padding: "2rem 0 1rem 0",
        ".footer-grid": {
          gridTemplateColumns: "1fr",
          gap: "2rem",
        },
        ".footer-brand": {
          maxWidth: "none",
        },
        ".footer-newsletter": {
          maxWidth: "none",
        },
      },
    },

    // Sistema de botones elegante
    button: {
      // Tamaños
      sizes: {
        xs: {
          padding: "6px 12px",
          fontSize: "0.75rem",
          borderRadius: "6px",
        },
        sm: {
          padding: "8px 16px",
          fontSize: "0.875rem",
          borderRadius: "8px",
        },
        base: {
          padding: "12px 24px",
          fontSize: "1rem",
          borderRadius: "10px",
        },
        lg: {
          padding: "16px 32px",
          fontSize: "1.125rem",
          borderRadius: "12px",
        },
        xl: {
          padding: "20px 40px",
          fontSize: "1.25rem",
          borderRadius: "16px",
        },
      },

      // Variantes elegantes
      variants: {
        primary: {
          backgroundColor: "#d63384",
          color: "#ffffff",
          border: "1px solid #d63384",
          boxShadow: "0 8px 32px -8px rgba(214, 51, 132, 0.25)",
          transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          "&:hover": {
            backgroundColor: "#c02a74",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px -8px rgba(214, 51, 132, 0.35)",
          },
        },
        secondary: {
          backgroundColor: "transparent",
          color: "#6b9b6b",
          border: "1px solid #6b9b6b",
          transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          "&:hover": {
            backgroundColor: "#6b9b6b",
            color: "#ffffff",
            transform: "translateY(-1px)",
          },
        },
        luxury: {
          backgroundColor: "#e6a756",
          color: "#2a241f",
          border: "1px solid #e6a756",
          boxShadow: "0 8px 32px -8px rgba(230, 167, 86, 0.3)",
          transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          "&:hover": {
            backgroundColor: "#d4924a",
            transform: "translateY(-2px)",
            boxShadow: "0 12px 40px -8px rgba(230, 167, 86, 0.4)",
          },
        },
        ghost: {
          backgroundColor: "transparent",
          color: "#524842",
          border: "1px solid transparent",
          transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          "&:hover": {
            backgroundColor: "#f7f6f4",
            color: "#2a241f",
            transform: "translateY(-1px)",
          },
        },
      },
    },

    // Sistema de tarjetas elegante
    card: {
      base: {
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #ede9e6",
        boxShadow: "0 4px 6px -1px rgba(42, 36, 31, 0.1), 0 2px 4px -2px rgba(42, 36, 31, 0.1)",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      },
      elevated: {
        boxShadow: "0 10px 15px -3px rgba(42, 36, 31, 0.1), 0 4px 6px -4px rgba(42, 36, 31, 0.1)",
      },
      luxury: {
        background: "linear-gradient(135deg, #ffffff 0%, #fefcf3 100%)",
        border: "1px solid #e6a756",
        boxShadow: "0 8px 32px -8px rgba(230, 167, 86, 0.2)",
      },
      interactive: {
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 20px 25px -5px rgba(42, 36, 31, 0.1), 0 8px 10px -6px rgba(42, 36, 31, 0.1)",
        },
      },
    },

    // Sistema de inputs elegante
    input: {
      base: {
        width: "100%",
        padding: "12px 16px",
        fontSize: "1rem",
        lineHeight: "1.5",
        color: "#2a241f",
        backgroundColor: "#ffffff",
        border: "1px solid #ddd6d1",
        borderRadius: "10px",
        transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "&:focus": {
          outline: "none",
          borderColor: "#6b9b6b",
          boxShadow: "0 0 0 3px rgba(107, 155, 107, 0.1)",
          backgroundColor: "#fafaf9",
        },
      },
      luxury: {
        border: "1px solid #e6a756",
        "&:focus": {
          borderColor: "#d4924a",
          boxShadow: "0 0 0 3px rgba(230, 167, 86, 0.1)",
        },
      },
      error: {
        borderColor: "#e11d48",
        "&:focus": {
          borderColor: "#e11d48",
          boxShadow: "0 0 0 3px rgba(225, 29, 72, 0.1)",
        },
      },
    },

    // ===============================
    // CSS GLOBALES PARA COMPONENTES
    // ===============================
    cssGlobals: {
      // Animaciones para fadeIn
      fadeInUp: `
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `,
          // Estilos para el carrusel de videos
    videoCarousel: `
      .video-carousel {
        position: relative;
        width: 100%;
        overflow: hidden;
        border-radius: 16px;
        max-width: 600px;
        margin: 0 auto;
      }
      
      .video-carousel-inner {
        display: flex;
        transition: transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        will-change: transform;
      }
      
      .video-carousel-item {
        flex: 0 0 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 600px;
        padding: 0 2rem;
      }
      
      /* Media queries para móvil */
      @media (max-width: 768px) {
        .video-carousel {
          max-width: 100%;
          margin: 0 auto;
        }
        
        .video-carousel-item {
          min-height: 500px;
          padding: 0 1rem;
        }
      }
      
      /* Media queries para tablets */
      @media (min-width: 769px) and (max-width: 1024px) {
        .video-carousel {
          max-width: 500px;
        }
        
        .video-carousel-item {
          min-height: 550px;
        }
      }
      
      /* Media queries para desktop */
      @media (min-width: 1025px) {
        .video-carousel {
          max-width: 600px;
        }
        
        .video-carousel-item {
          min-height: 600px;
        }
      }
    `,
      
      // Estilos para el overlay del botón play
      playOverlay: `
        .play-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: rgba(0, 0, 0, 0.7);
          border-radius: 50%;
          width: 80px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0.8;
          transition: opacity 0.3s ease;
          z-index: 5;
        }
        
        .play-overlay:hover {
          opacity: 1;
          background: rgba(0, 0, 0, 0.8);
        }
        
        @media (max-width: 768px) {
          .play-overlay {
            width: 60px;
            height: 60px;
          }
        }
      `,
      
      // Estilos para lightbox
      lightbox: `
        .lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `,
    },
  },

  // ===============================
  // UTILIDADES Y HELPERS
  // ===============================
  utils: {
    // Contenedores
    container: {
      center: "true",
      padding: "1rem",
      maxWidth: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1400px",
      },
    },

    // Z-index scale
    zIndex: {
      hide: -1,
      auto: "auto",
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
      tooltip: 1800,
    },

    // Overlay helpers mejorados
    overlay: {
      base: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(42, 36, 31, 0.75)",
        zIndex: 1300,
      },
      elegant: {
        background: "linear-gradient(135deg, rgba(42, 36, 31, 0.8) 0%, rgba(82, 72, 66, 0.6) 100%)",
        backdropFilter: "blur(12px)",
      },
      blur: {
        backdropFilter: "blur(8px)",
      },
    },

    // Sistema de migración desde estilos antiguos
    migration: {
      // Mapeo de colores antiguos a nuevos
      colorMapping: {
        // Colores del sistema antiguo (styles.js)
        "#0D1B2A": "#2a241f", // primary -> neutral-900 (más elegante)
        "#1B263B": "#524842", // secondary -> neutral-700
        "#3498db": "#6b9b6b", // accent -> secondary-500 (verde salvia)
        "#2c3e50": "#8b7d74", // primaryLight -> neutral-500
        "#090E15": "#1a1612", // primaryDark -> neutral-950
        "#233044": "#3a332e", // primaryMedium -> neutral-800
        "#FFFFFF": "#ffffff", // white -> mantener
        "#F8F9FA": "#fafaf9", // offWhite -> neutral-50
        "#F5F6F8": "#f7f6f4", // background -> neutral-100
        "#E2E8F0": "#ede9e6", // gray -> neutral-200
        "#F1F5F9": "#ddd6d1", // grayLight -> neutral-300
        "#64748B": "#b8aca4", // grayDark -> neutral-400
      },

      // Mapeo de componentes antiguos a nuevos
      componentMapping: {
        // Para NavbarAdmin
        oldNavbarAdmin: "stylesGlobal.components.navbar.variants.dark",
        oldNavbarColors: "stylesGlobal.colors.surface.elevated",
        
        // Para SidebarAdmin  
        oldSidebarAdmin: "stylesGlobal.components.sidebar.variants.dark",
        oldSidebarColors: "stylesGlobal.colors.neutral[900]",
        
        // Para Footer
        oldFooter: "stylesGlobal.components.footer.variants.luxury",
        oldFooterColors: "stylesGlobal.colors.neutral[900]",
        
        // Para NavbarBase/Public/Private
        oldNavbarBase: "stylesGlobal.components.navbar.base",
        oldNavbarPublic: "stylesGlobal.components.navbar.variants.solid",
      },

      // Guías de transición
      transitionGuide: {
        step1: "Reemplazar imports de colors antiguos con stylesGlobal",
        step2: "Migrar estilos inline a sistema de componentes global",
        step3: "Actualizar animaciones a cubic-bezier elegante",
        step4: "Implementar variantes glass y luxury donde corresponda",
        step5: "Unificar sistema de espaciado con spacing.scale",
      },
    },

    // Helpers para componentes existentes
    legacy: {
      // Wrapper para mantener compatibilidad durante migración
      getOldColor: (oldColor) => {
        const mapping = {
          "#0D1B2A": stylesGlobal.colors.neutral[900],
          "#1B263B": stylesGlobal.colors.neutral[700],
          "#3498db": stylesGlobal.colors.secondary[500],
          // ... más mapeos según necesidad
        }
        return mapping[oldColor] || oldColor
      },
      
      // Convertir estilos antiguos a nuevos
      convertStyle: (oldStyleObject) => {
        // Función helper para migración gradual
        const newStyle = { ...oldStyleObject }
        
        // Reemplazar colores conocidos
        Object.keys(newStyle).forEach(key => {
          if (typeof newStyle[key] === 'string' && newStyle[key].startsWith('#')) {
            const newColor = stylesGlobal.utils.legacy.getOldColor(newStyle[key])
            if (newColor !== newStyle[key]) {
              newStyle[key] = newColor
            }
          }
        })
        
        return newStyle
      },
    },
  },
};

export default stylesGlobal;