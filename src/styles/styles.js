// styles.js

// Paleta de colores con estética rosa (monocromática con neutros)
export const colors = {
    pinkBerry: "#880E4F",   // Un rosa oscuro e intenso (Frambuesa)
    pinkDeep: "#C2185B",    // Un rosa profundo y vibrante
    pinkMedium: "#E91E63",  // Un rosa medio brillante
    pinkLight: "#F48FB1",   // Un rosa claro y suave
    pinkBlush: "#F8BBD0",   // Un rosa muy pálido (Rubor)
    warmWhite: "#FCE4EC",   // Un blanco cálido con un toque rosado
    darkGrey: "#212121",    // Un gris muy oscuro casi negro
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
        backgroundColor: colors.pinkBerry, // Usando el color de la paleta rosa
        color: colors.warmWhite, // Usando el color de la paleta rosa
        padding: "10px 20px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        fontFamily: typography.fontPrimary,
        fontSize: "16px",
        fontWeight: "bold",
    },
    secondary: {
        backgroundColor: colors.pinkMedium, // Usando el color de la paleta rosa
        color: colors.warmWhite, // Usando el color de la paleta rosa
        padding: "8px 16px",
        borderRadius: "5px",
        border: "none",
        cursor: "pointer",
        fontFamily: typography.fontSecondary,
        fontSize: "14px",
    },
};

export const textStyles = {
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        fontFamily: typography.fontPrimary,
        color: colors.pinkBerry, // Usando el color de la paleta rosa
    },
    subtitle: {
        fontSize: "24px",
        fontWeight: "600",
        fontFamily: typography.fontSecondary,
        color: colors.pinkDeep, // Usando el color de la paleta rosa
    },
    paragraph: {
        fontSize: "16px",
        fontFamily: typography.fontSecondary,
        color: colors.darkGrey, // Usando el color de la paleta rosa
        lineHeight: "1.5",
    },
};

// Estilos para componentes relacionados con productos de belleza
export const productStyles = {
    productCard: { // Estilo para una tarjeta de producto individual
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        },
        textAlign: "center", // Mantenido del original
    },
    productDetailCard: { // Estilo para una tarjeta de detalle de producto o característica
        padding: '1rem',
        backgroundColor: colors.pinkBlush, // Usando el color de la paleta rosa con transparencia
        borderRadius: '0.25rem',
        textAlign: 'center'
    },
    iconCircle: { // Estilo para un círculo de icono (quizás para categorías o características)
        padding: '1rem',
        backgroundColor: colors.warmWhite, // Usando el color de la paleta rosa
        borderRadius: '50%',
        display: 'inline-block'
    },
    // Se eliminó 'verticalSlider' ya que era específico de IoT y no parece relevante para productos de belleza.
    addItemContainer: { // Estilo para un contenedor para añadir un nuevo producto
        textAlign: 'center',
        padding: '3rem 0', // Mantenido del original
    },
    addItemIcon: { // Estilo para el icono de añadir producto
        fontSize: '3rem',
        color: colors.pinkBerry // Usando el color de la paleta rosa
    },
    // Se eliminó la repetición de deviceCard y addDeviceContainer
};
