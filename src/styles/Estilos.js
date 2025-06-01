// src/styles/theme.js

const colores = {
  principal: "#ff4060",
  secundario: "#1f8a80",
  acento: "#ff0070",
  fondoClaro: "#FFF8E1",
  fondoSuave: "#F5E8C7",
  textoOscuro: "#23102d",
  textoGris: "#403a3c",
  blanco: "#ffffff",
  sombra: "rgba(255, 0, 112, 0.2)",
};

const fuentes = {
  titulo: "'Playfair Display', serif",
  texto: "system-ui, sans-serif",
};

const botones = {
  principal: {
    backgroundColor: colores.principal,
    borderColor: colores.principal,
    color: colores.blanco,
    borderRadius: "30px",
    padding: "12px 30px",
    fontWeight: "500",
    fontSize: "1.1rem",
  },
};

const sombras = {
  suave: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)",
};

const animaciones = {
  fadeInUp: `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `,
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
      50% { transform: translateY(-20px) scale(1.2); opacity: 0.8; }
    }
  `,
};

const tarjetas = {
  base: {
    background: colores.blanco,
    borderRadius: "12px",
    padding: "2.5rem 2rem",
    textAlign: "center",
    boxShadow: sombras.suave,
  },
  bordeLateral: (idx) => {
    const bordes = [colores.acento, colores.secundario, "#ff1030", "#8840b8"];
    return {
      borderLeft: `3px solid ${bordes[idx % bordes.length]}`
    };
  }
};

const secciones = {
  espaciamiento: {
    padding: "6rem 2rem",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  titulo: {
    fontFamily: fuentes.titulo,
    fontSize: "clamp(2rem, 4vw, 2.8rem)",
    fontWeight: 600,
    color: colores.textoOscuro,
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  subtitulo: {
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    fontWeight: 300,
    color: colores.textoGris,
    maxWidth: "800px",
    margin: "0 auto 3rem",
    letterSpacing: "0.5px",
    textAlign: "center",
  },
  lineaDecorativa: {
    width: "60px",
    height: "2px",
    background: `linear-gradient(90deg, ${colores.acento}, ${colores.secundario})`,
    borderRadius: "1px",
    margin: "15px auto",
  }
};

export default {
  colores,
  fuentes,
  botones,
  sombras,
  animaciones,
  tarjetas,
  secciones,
};
