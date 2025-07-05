/**
 * stylesAdmin.js - Sistema de estilos unificado para componentes de administración
 * Consolida todos los estilos de: AdminDashboard, AdminUsersView, GestionCategorias,
 * GestionEventos, GestionFotos, GestionProductos, GestionTallas, GestionVideos, GestorLocalidades
 */

// =============================================
// SISTEMA DE COLORES
// =============================================
const colors = {
  // Colores primarios
  primary: '#0D1B2A',
  primaryLight: '#1a2a44',
  primaryHover: '#2c3e50',
  
  // Colores secundarios
  secondary: '#3498db',
  secondaryLight: '#4299e1',
  secondaryHover: '#2980b9',
  
  // Estados
  success: '#2ecc71',
  successLight: '#48bb78',
  successHover: '#27ae60',
  successBg: '#d1fae5',
  successBorder: '#bbf7d0',
  
  warning: '#f39c12',
  warningLight: '#ed8936',
  warningHover: '#e67e22',
  warningBg: '#fef3c7',
  
  danger: '#e74c3c',
  dangerLight: '#f56565',
  dangerHover: '#c0392b',
  dangerBg: '#fee2e2',
  dangerBorder: '#fecaca',
  
  error: '#dc2626',
  errorText: '#991b1b',
  errorBg: '#fef2f2',
  
  // Grises y neutrales
  white: '#ffffff',
  black: '#000000',
  
  // Backgrounds
  background: '#f8fafc',
  backgroundSecondary: '#f5f7fa',
  backgroundTertiary: '#f0f4f8',
  backgroundGray: '#f9fafb',
  
  // Grises
  gray: '#e2e8f0',
  grayLight: '#f8f9fa',
  grayMedium: '#64748b',
  grayDark: '#475569',
  grayDarker: '#374151',
  
  // Textos
  textPrimary: '#1a202c',
  textSecondary: '#4a5568',
  textTertiary: '#2d3748',
  textLight: '#718096',
  textMuted: '#9ca3af',
  textPlaceholder: '#a0aec0',
  
  // Bordes
  border: '#e2e8f0',
  borderLight: '#f1f3f4',
  borderMedium: '#e5e7eb',
  borderDark: '#d1d5db',
  
  // Overlays
  overlay: 'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.25)',
  overlayDark: 'rgba(0,0,0,0.7)',
  
  // Colores específicos para dashboard
  chartBlue: '#4299e1',
  chartPurple: '#9f7aea',
  chartGreen: '#48bb78',
  chartOrange: '#ed8936',
  chartIndigo: '#667eea',
  chartPink: '#f687b3',
  
  // Roles y badges
  roleAdmin: '#dbeafe',
  roleAdminText: '#1e40af',
  roleUser: '#e0f2fe',
  roleUserText: '#0369a1',
  
  // Estados de hover para tablas
  tableHover: '#f9fafb',
};

// =============================================
// TIPOGRAFÍA
// =============================================
const typography = {
  fontPrimary: "'Inter', sans-serif",
  textXs: '0.7rem',    // 11.2px
  textSm: '0.8rem',    // 12.8px
  textBase: '0.95rem', // 13.6px
  textMd: '0.9rem',    // 14.4px
  textLg: '1rem',      // 16px
  textXl: '1.2rem',    // 19.2px
  text2xl: '1.5rem',   // 24px
  text3xl: '1.8rem',   // 28.8px
  text4xl: '2rem',     // 32px
  text5xl: '1.8rem',   // 28.8px
  
  // Pesos de fuente
  weightLight: '300',
  weightNormal: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
  weightExtrabold: '800',
  
  // Alturas de línea
  lineHeight: '1.5',
  lineHeightTight: '1.3',
  lineHeightRelaxed: '1.6',
};

// =============================================
// ESPACIADO
// =============================================
const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
  '5xl': '5rem',   // 80px
};

// =============================================
// BORDES Y RADIOS
// =============================================
const borders = {
  radius: '8px',
  radiusSm: '4px',
  radiusMd: '10px',
  radiusLg: '12px',
  radiusFull: '50%',
  
  width: '1px',
  widthMedium: '2px',
  widthThick: '3px',
};

// =============================================
// SOMBRAS
// =============================================
const shadows = {
  none: 'none',
  xs: '0 1px 2px rgba(0,0,0,0.05)',
  sm: '0 1px 3px rgba(0,0,0,0.05)',
  base: '0 2px 4px rgba(0,0,0,0.08)',
  md: '0 4px 6px rgba(0,0,0,0.1)',
  lg: '0 10px 15px rgba(0,0,0,0.1)',
  xl: '0 20px 25px rgba(0,0,0,0.1)',
  '2xl': '0 25px 50px rgba(0,0,0,0.15)',
  inner: 'inset 0 2px 4px rgba(0,0,0,0.06)',
};

// =============================================
// ANIMACIONES CSS
// =============================================
const animations = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slideDown {
    from { transform: translateY(-50px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideIn {
    from { transform: translateY(-20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes slideUp {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
    40%, 43% { transform: translateY(-30px); }
    70% { transform: translateY(-15px); }
    90% { transform: translateY(-4px); }
  }
  
  /* Clases de animación */
  .fade-in { animation: fadeIn 0.3s ease-in-out; }
  .slide-down { animation: slideDown 0.3s ease-in-out; }
  .slide-in { animation: slideIn 0.3s ease-in-out; }
  .slide-up { animation: slideUp 0.3s ease-in-out; }
  .spin { animation: spin 1s linear infinite; }
  .pulse { animation: pulse 1.5s ease-in-out infinite; }
  .bounce { animation: bounce 1s infinite; }
  
  /* Transiciones de hover */
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: ${shadows.md};
    transition: all 0.2s ease;
  }
  
  .hover-scale:hover {
    transform: scale(1.02);
    transition: transform 0.2s ease;
  }
  
  .hover-grow:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
  }
`;

// =============================================
// ESTILOS BASE PARA CONTENEDORES
// =============================================
const containers = {
  // Contenedor principal de página
  page: {
    minHeight: '100vh',
    backgroundColor: colors.background,
    padding: spacing.xl,
    fontFamily: typography.fontPrimary,
  },
  
  // Contenedor principal con card
  main: {
    maxWidth: '1400px',
    margin: '0 auto',
    backgroundColor: colors.white,
    borderRadius: borders.radius,
    boxShadow: shadows.md,
    overflow: 'hidden',
  },
  
  // Contenedor para dashboard
  dashboard: {
    backgroundColor: colors.backgroundSecondary,
    minHeight: '100vh',
    padding: spacing['2xl'],
    fontFamily: typography.fontPrimary,
  },
  
  // Contenedor con padding estándar
  content: {
    padding: spacing['2xl'],
  },
  
  // Contenedor para estados vacíos
  emptyState: {
    textAlign: 'center',
    padding: `${spacing['3xl']} ${spacing['2xl']}`,
    color: colors.textLight,
  },
  
  emptyStateText: {
    fontSize: typography.textXl,
    fontWeight: typography.weightSemibold,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  
  emptyStateSubtext: {
    fontSize: typography.textBase,
    color: colors.textLight,
  },
  
  // Contenedor de loading
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  
  // Contenedor de error
  errorContainer: {
    maxWidth: '500px',
    margin: `${spacing['2xl']} auto`,
    padding: spacing['2xl'],
    textAlign: 'center',
    backgroundColor: colors.errorBg,
    borderRadius: borders.radius,
    border: `1px solid ${colors.dangerBorder}`,
    color: colors.errorText,
  },
};

// =============================================
// ESTILOS DE HEADER/ENCABEZADOS
// =============================================
const headerStyles = {
  // Header principal
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.xl} ${spacing['2xl']}`,
    backgroundColor: colors.primary,
    color: colors.white,
    borderBottom: `1px solid ${colors.border}`,
  },
  
  // Header simple sin background
  headerSimple: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
  },
  
  // Contenido del header
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  
  // Títulos
  title: {
    fontSize: typography.text5xl,
    fontWeight: typography.weightBold,
    margin: '0',
    color: colors.white,
  },
  
  titleDark: {
    fontSize: typography.text5xl,
    fontWeight: typography.weightBold,
    margin: '0',
    color: colors.textPrimary,
  },
  
  subtitle: {
    fontSize: typography.textLg,
    opacity: '0.8',
    margin: `${spacing.sm} 0 0 0`,
    color: colors.grayLight,
  },
  
  subtitleDark: {
    fontSize: typography.textLg,
    margin: `${spacing.sm} 0 ${spacing.xl} 0`,
    color: colors.textSecondary,
  },
  
  // Títulos de sección
  sectionTitle: {
    fontSize: typography.text3xl,
    fontWeight: typography.weightSemibold,
    color: colors.textPrimary,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  },
};

// =============================================
// ESTILOS DE BOTONES
// =============================================
const buttons = {
  // Base para todos los botones
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.md} ${spacing.xl}`,
    borderRadius: borders.radius,
    border: 'none',
    fontWeight: typography.weightMedium,
    fontSize: typography.textBase,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    textDecoration: 'none',
    lineHeight: 1,
    fontFamily: 'inherit',
  },
  
  // Variantes de color
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  
  primaryHover: {
    backgroundColor: colors.primaryLight,
  },
  
  secondary: {
    backgroundColor: colors.secondary,
    color: colors.white,
  },
  
  secondaryHover: {
    backgroundColor: colors.secondaryHover,
  },
  
  success: {
    backgroundColor: colors.success,
    color: colors.white,
  },
  
  successHover: {
    backgroundColor: colors.successHover,
  },
  
  warning: {
    backgroundColor: colors.warning,
    color: colors.white,
  },
  
  warningHover: {
    backgroundColor: colors.warningHover,
  },
  
  danger: {
    backgroundColor: colors.danger,
    color: colors.white,
  },
  
  dangerHover: {
    backgroundColor: colors.dangerHover,
  },
  
  // Botones outline
  outline: {
    backgroundColor: 'transparent',
    color: colors.primary,
    border: `1px solid ${colors.primary}`,
  },
  
  outlineSecondary: {
    backgroundColor: 'transparent',
    color: colors.secondary,
    border: `1px solid ${colors.secondary}`,
  },
  
  // Botones ghost
  ghost: {
    backgroundColor: 'transparent',
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
  },
  
  ghostHover: {
    backgroundColor: colors.grayLight,
  },
  
  // Tamaños
  small: {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: typography.textSm,
  },
  
  large: {
    padding: `${spacing.lg} ${spacing['2xl']}`,
    fontSize: typography.textLg,
  },
  
  // Estados
  disabled: {
    backgroundColor: colors.grayMedium,
    cursor: 'not-allowed',
    opacity: 0.6,
  },
  
  loading: {
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  
  // Botones de acción específicos
  actionButton: {
    width: '32px',
    height: '32px',
    borderRadius: borders.radiusMd,
    border: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    padding: 0,
  },
  
  editAction: {
    backgroundColor: colors.warningBg,
    color: colors.warning,
  },
  
  deleteAction: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
  },
  
  viewAction: {
    backgroundColor: '#e0f2fe',
    color: colors.secondary,
  },
  
  // Botones específicos del dashboard
  chartControlButton: {
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.grayLight,
    border: `1px solid ${colors.border}`,
    borderRadius: borders.radiusMd,
    fontSize: typography.textSm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  chartControlButtonActive: {
    backgroundColor: '#ebf4ff',
    borderColor: colors.secondaryLight,
    color: colors.secondary,
  },
};

// =============================================
// ESTILOS DE FORMULARIOS
// =============================================
const forms = {
  // Grupos de formulario
  formGroup: {
    marginBottom: spacing.lg,
  },
  
  formGroupRow: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
  
  // Labels
  label: {
    fontSize: typography.textSm,
    color: colors.textSecondary,
    fontWeight: typography.weightMedium,
    marginBottom: spacing.xs,
    display: 'block',
  },
  
  requiredField: {
    color: colors.danger,
    marginLeft: '4px',
  },
  
  // Inputs
  input: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borders.radiusSm,
    border: `1px solid ${colors.borderMedium}`,
    fontSize: typography.textBase,
    outline: 'none',
    marginBottom: spacing.md,
  },
  
  inputFocus: {
    outline: 'none',
    border: `1px solid ${colors.primary}`,
    boxShadow: `0 0 0 3px rgba(13, 27, 42, 0.1)`,
  },
  
  inputError: {
    border: `1px solid ${colors.danger}`,
    boxShadow: `0 0 0 3px rgba(220, 38, 38, 0.1)`,
  },
  
  // Textarea
  textarea: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    border: `1px solid ${colors.border}`,
    borderRadius: borders.radius,
    minHeight: '100px',
    fontSize: typography.textBase,
    resize: 'vertical',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: colors.white,
    fontFamily: 'inherit',
    boxSizing: 'border-box',
  },
  
  // Select
  select: {
    width: '100%',
    padding: spacing.md,
    borderRadius: borders.radiusSm,
    border: `1px solid ${colors.borderMedium}`,
    fontSize: typography.textBase,
    outline: 'none',
    marginBottom: spacing.md,
  },
  
  // File inputs
  fileInput: {
    display: 'none',
  },
  
  fileInputVisible: {
    width: '100%',
    padding: `${spacing.sm} 0`,
    fontSize: typography.textSm,
  },
  
  // Área de carga de archivos
  uploadArea: {
    border: `1px dashed ${colors.border}`,
    borderRadius: borders.radius,
    padding: spacing.xl,
    textAlign: 'center',
    transition: 'all 0.2s ease-in-out',
    backgroundColor: colors.backgroundTertiary,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100px',
  },
  
  uploadAreaHover: {
    borderColor: colors.primary,
    backgroundColor: colors.background,
  },
  
  uploadText: {
    color: colors.textSecondary,
    fontSize: typography.textBase,
    marginBottom: spacing.xs,
  },
  
  uploadSubtext: {
    color: colors.textMuted,
    fontSize: typography.textSm,
  },
  
  // Vista previa de imagen
  imagePreview: {
    maxWidth: '150px',
    maxHeight: '150px',
    borderRadius: borders.radius,
    objectFit: 'cover',
    border: `1px solid ${colors.border}`,
    marginTop: spacing.md,
  },
  
  // Grids de formulario
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.lg,
  },
  
  formGrid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing.lg,
  },
    formGrid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.lg,
  },
  
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer',
    accentColor: colors.primary,
  },
  
  helpText: {
    fontSize: typography.textSm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  
  previewMedia: {
    maxWidth: '200px',
    maxHeight: '150px',
    borderRadius: borders.radius,
    objectFit: 'cover',
    border: `1px solid ${colors.border}`,
    marginTop: spacing.md,
  },
};

// =============================================
// ESTILOS DE TABLAS
// =============================================
const tables = {
  // Contenedor de tabla
  container: {
    overflowX: 'auto',
    border: `1px solid ${colors.border}`,
    borderRadius: borders.radiusLg,
    backgroundColor: colors.white,
    boxShadow: shadows.sm,
  },
  
  responsiveContainer: {
    overflowX: 'auto',
  },
  
  // Tabla
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: colors.white,
  },
  
  // Header de tabla
  header: {
    backgroundColor: colors.backgroundGray,
    fontWeight: typography.weightBold,
    color: colors.textSecondary,
    fontSize: typography.textSm,
    borderBottom: `1px solid ${colors.borderMedium}`,
  },
  
  headerEnhanced: {
    backgroundColor: colors.backgroundGray,
    borderBottom: `1px solid ${colors.borderMedium}`,
  },
  
  headerCell: {
    padding: spacing.lg,
    textAlign: 'left',
    fontWeight: typography.weightSemibold,
    color: colors.textPrimary,
    fontSize: typography.textSm,
    borderRight: `1px solid ${colors.border}`,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  
  headerCellHover: {
    backgroundColor: colors.backgroundTertiary,
  },
  
  // Filas de tabla
  row: {
    borderBottom: `1px solid ${colors.borderMedium}`,
    transition: 'background-color 0.2s ease',
  },
  
  rowHover: {
    backgroundColor: colors.tableHover,
  },
  
  rowNoBorder: {
    borderBottom: 'none',
  },
  
  // Celdas de tabla
  cell: {
    padding: spacing.lg,
    borderRight: `1px solid ${colors.borderLight}`,
    fontSize: typography.textBase,
    color: colors.textSecondary,
    whiteSpace: 'normal',
    verticalAlign: 'middle',
  },
  
  cellCompact: {
    padding: `${spacing.md} ${spacing.lg}`,
  },
  
  // Elementos específicos de tabla
  productImage: {
    width: '50px',
    height: '50px',
    objectFit: 'cover',
    borderRadius: borders.radius,
    border: `1px solid ${colors.border}`,
  },
  
  thumbnail: {
    width: '45px',
    height: '45px',
    borderRadius: borders.radiusMd,
    objectFit: 'cover',
    border: `1px solid ${colors.border}`,
  },
  
  placeholderImage: {
    width: '45px',
    height: '45px',
    color: colors.textMuted,
    padding: spacing.sm,
    backgroundColor: colors.grayLight,
    borderRadius: borders.radiusMd,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Contenedor de acciones
  actionsContainer: {
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
  },
  
  // Información de usuario en tabla
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.md,
  },
  
  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: borders.radiusFull,
    backgroundColor: colors.secondary,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.textLg,
    fontWeight: typography.weightSemibold,
  },
  
  userName: {
    fontWeight: typography.weightMedium,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  
  userEmail: {
    fontSize: typography.textSm,
    color: colors.textLight,
  },
};

// =============================================
// ESTILOS DE MODALES
// =============================================
const modalStyles = {
  // Overlay del modal
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.overlay,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    backdropFilter: 'blur(3px)',
    animation: 'fadeIn 0.3s ease-in-out',
  },
  
  overlayDark: {
    backgroundColor: colors.overlayDark,
  },
  
  // Contenido del modal
  content: {
    backgroundColor: colors.white,
    borderRadius: borders.radiusXl,
    width: '90%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: shadows.xl,
    position: 'relative',
    animation: 'slideIn 0.3s ease-in-out',
  },
  
  contentLarge: {
    maxWidth: '800px',
  },
  
  contentSmall: {
    maxWidth: '400px',
  },
  
  // Header del modal
  header: {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    color: colors.white,
    borderTopLeftRadius: borders.radiusXl,
    borderTopRightRadius: borders.radiusXl,
  },
  
  headerSimple: {
    padding: spacing.xl,
    borderBottom: `1px solid ${colors.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  // Título del modal
  title: {
    margin: 0,
    fontSize: typography.textXl,
    fontWeight: typography.weightSemibold,
  },
  
  titleLarge: {
    fontSize: typography.text2xl,
  },
  
  // Botón de cerrar
  closeButton: {
    background: 'none',
    border: 'none',
    color: colors.white,
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borders.radius,
    transition: 'background-color 0.2s',
  },
  
  closeButtonDark: {
    color: colors.textSecondary,
  },
  
  closeButtonHover: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  // Cuerpo del modal
  body: {
    padding: spacing.xl,
  },
  
  // Acciones del modal
  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: spacing.lg,
    marginTop: spacing.xl,
    paddingTop: spacing.lg,
    borderTop: `1px solid ${colors.border}`,
  },
  
  actionsStart: {
    justifyContent: 'flex-start',
  },
  
  actionsCenter: {
    justifyContent: 'center',
  },
};

// =============================================
// ESTILOS DE BÚSQUEDA Y FILTROS
// =============================================
const searchStyles = {
  // Contenedor principal
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  
  // Toolbar de búsqueda
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.xl,
  },
  
  // Wrapper de búsqueda
  searchWrapper: {
    position: 'relative',
    backgroundColor: colors.white,
    borderRadius: borders.radiusLg,
    boxShadow: shadows.sm,
    minWidth: '250px',
    flex: '1',
    maxWidth: '500px',
  },
  
  // Icono de búsqueda
  searchIcon: {
    position: 'absolute',
    left: spacing.lg,
    top: '50%',
    transform: 'translateY(-50%)',
    color: colors.textMuted,
  },
  
  // Input de búsqueda
  searchInput: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg} ${spacing.md} 2.5rem`,
    border: `1px solid ${colors.border}`,
    borderRadius: borders.radiusLg,
    fontSize: typography.textBase,
    transition: 'all 0.2s ease-in-out',
    backgroundColor: colors.white,
    boxSizing: 'border-box',
    boxShadow: shadows.xs,
  },
  
  searchInputFocus: {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px rgba(13, 27, 42, 0.1)`,
  },
  
  // Select de filtro
  filterSelect: {
    padding: `${spacing.md} ${spacing.lg}`,
    border: `1px solid ${colors.border}`,
    borderRadius: borders.radius,
    fontSize: typography.textBase,
    backgroundColor: colors.white,
    minWidth: '180px',
    cursor: 'pointer',
  },
  
  // Contenedor de búsqueda
  searchContainer: {
    display: 'flex',
    gap: spacing.lg,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  
  // Grupo de botones
  buttonGroup: {
    display: 'flex',
    gap: spacing.md,
    flexWrap: 'wrap',
  },
  
  // Contenedor de filtros expandido
  filtersContainer: {
    backgroundColor: colors.white,
    borderRadius: borders.radiusLg,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    boxShadow: shadows.sm,
    border: `1px solid ${colors.borderMedium}`,
    animation: 'fadeIn 0.3s ease',
  },
  
  filtersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
    gap: spacing.xl,
    alignItems: 'end',
  },
  
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
  },
};

// =============================================
// ESTILOS DE BADGES Y ETIQUETAS
// =============================================
const badgeStyles = {
  // Base para badges
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.xs} ${spacing.md}`,
    borderRadius: borders.radius,
    fontSize: typography.textSm,
    fontWeight: typography.weightMedium,
    lineHeight: 1,
  },
  
  // Variantes de color
  primary: {
    backgroundColor: colors.primary,
    color: colors.white,
  },
  
  secondary: {
    backgroundColor: colors.gray,
    color: colors.textPrimary,
  },
  
  success: {
    backgroundColor: colors.successBg,
    color: colors.success,
    border: `1px solid ${colors.successBorder}`,
  },
  
  warning: {
    backgroundColor: colors.warningBg,
    color: colors.warning,
  },
  
  danger: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
  },
  
  // Badges específicos
  sizeBadge: {
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borders.radius,
    fontSize: typography.textXs,
    fontWeight: typography.weightMedium,
    backgroundColor: colors.secondary,
    color: colors.white,
    margin: spacing.xs,
    display: 'inline-block',
  },
  
  // Badges de rol
  roleAdmin: {
    backgroundColor: colors.roleAdmin,
    color: colors.roleAdminText,
  },
  
  roleUser: {
    backgroundColor: colors.roleUser,
    color: colors.roleUserText,
  },
  
  // Tamaños
  small: {
    padding: `${spacing.xs} ${spacing.sm}`,
    fontSize: typography.textXs,
  },
  
  large: {
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: typography.textBase,
  },
};

// =============================================
// ESTILOS DE MENSAJES Y ALERTAS
// =============================================
const messageStyles = {
  // Base para mensajes
  base: {
    padding: spacing.lg,
    borderRadius: borders.radiusLg,
    marginBottom: spacing.lg,
    fontSize: typography.textBase,
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  
  // Estados de mensaje
  error: {
    backgroundColor: colors.errorBg,
    borderLeft: `4px solid ${colors.danger}`,
    color: colors.errorText,
  },
  
  success: {
    backgroundColor: colors.successBg,
    borderLeft: `4px solid ${colors.success}`,
    color: colors.success,
  },
  
  warning: {
    backgroundColor: colors.warningBg,
    borderLeft: `4px solid ${colors.warning}`,
    color: colors.warning,
  },
  
  info: {
    backgroundColor: '#e0f2fe',
    borderLeft: `4px solid ${colors.secondary}`,
    color: colors.secondary,
  },
  
  // Mensajes pequeños
  small: {
    padding: spacing.md,
    fontSize: typography.textSm,
  },
  
  // Mensajes con icono
  withIcon: {
    paddingLeft: '3rem',
    position: 'relative',
  },
};

// =============================================
// ESTILOS DE PROGRESO
// =============================================
const progressStyles = {
  container: {
    marginTop: spacing.xl,
  },
  
  bar: {
    width: '100%',
    height: '6px',
    backgroundColor: colors.gray,
    borderRadius: borders.radius,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  
  fill: {
    height: '100%',
    borderRadius: borders.radius,
    backgroundColor: colors.primary,
    transition: 'width 0.3s ease',
  },
  
  text: {
    textAlign: 'center',
    fontSize: typography.textSm,
    color: colors.textLight,
    fontWeight: typography.weightMedium,
  },
};

// =============================================
// ESTILOS DE LOADING
// =============================================
const loadingStyles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing['2xl'],
    flexDirection: 'column',
    gap: spacing.lg,
  },
  
  spinner: {
    fontSize: typography.text3xl,
    color: colors.primary,
    animation: 'spin 1s linear infinite',
  },
  
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.overlayDark,
    zIndex: 2000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: colors.white,
  },
  
  overlayIcon: {
    fontSize: '3rem',
    marginBottom: spacing.lg,
    animation: 'spin 2s linear infinite',
  },
    overlayText: {
    fontSize: typography.text3xl,
    marginBottom: spacing.sm,
  },
  
  overlaySubtext: {
    fontSize: typography.textBase,
    opacity: 0.8,
  },
  
  text: {
    fontSize: typography.textLg,
    fontWeight: typography.weightMedium,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  
  subtext: {
    fontSize: typography.textBase,
    color: colors.white,
    opacity: 0.8,
  },
};

// =============================================
// ESTILOS ESPECÍFICOS DE DASHBOARD
// =============================================
const dashboardStyles = {
  // Grid principal
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: spacing.xl,
    marginBottom: spacing['2xl'],
  },
  
  // Cards de estadísticas
  statsCard: {
    backgroundColor: colors.white,
    borderRadius: borders.radiusXl,
    padding: spacing.xl,
    boxShadow: shadows.base,
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    cursor: 'pointer',
    border: `1px solid ${colors.borderLight}`,
  },
  
  statsCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: shadows.lg,
  },
  
  // Header de stats card
  statHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  
  // Icono de stat
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: borders.radiusXl,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.text2xl,
    color: colors.white,
  },
  
  // Valores de estadísticas
  statValue: {
    fontSize: typography.text5xl,
    fontWeight: typography.weightBold,
    margin: `${spacing.sm} 0`,
    color: colors.textPrimary,
  },
  
  statLabel: {
    fontSize: typography.textBase,
    color: colors.textLight,
    margin: 0,
  },
  
  statChange: {
    display: 'flex',
    alignItems: 'center',
    fontSize: typography.textSm,
    marginTop: spacing.sm,
  },
  
  // Colores específicos para iconos
  iconUsers: { backgroundColor: colors.chartBlue },
  iconProducts: { backgroundColor: colors.chartGreen },
  iconCategories: { backgroundColor: colors.chartIndigo },
  iconLocations: { backgroundColor: colors.chartPink },
  iconOrders: { backgroundColor: colors.chartPurple },
  iconSales: { backgroundColor: colors.chartOrange },
  
  // Estados positivos/negativos
  positive: { color: colors.chartGreen },
  negative: { color: colors.dangerLight },
  
  // Contenedor de gráficos
  chartContainer: {
    backgroundColor: colors.white,
    borderRadius: borders.radiusXl,
    padding: spacing.xl,
    boxShadow: shadows.base,
    border: `1px solid ${colors.borderLight}`,
  },
  
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  
  chartTitle: {
    fontSize: typography.text3xl,
    fontWeight: typography.weightSemibold,
    color: colors.textPrimary,
    margin: 0,
  },
  
  chartControls: {
    display: 'flex',
    gap: spacing.sm,
  },
  
  // Layout en columnas
  columnsLayout: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: spacing.xl,
  },
  
  // Sección general
  section: {
    backgroundColor: colors.white,
    borderRadius: borders.radiusXl,
    padding: spacing.xl,
    boxShadow: shadows.base,
    marginBottom: spacing.xl,
    border: `1px solid ${colors.borderLight}`,
  },
  
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  
  // Botón ver todos
  viewAllButton: {
    display: 'flex',
    alignItems: 'center',
    color: colors.secondary,
    fontSize: typography.textBase,
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borders.radius,
    transition: 'background-color 0.2s ease',
  },
  
  // Grid de usuarios
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: spacing.lg,
  },
  
  userCard: {
    display: 'flex',
    alignItems: 'center',
    padding: spacing.lg,
    backgroundColor: colors.backgroundGray,
    borderRadius: borders.radiusLg,
    border: `1px solid ${colors.border}`,
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  },
  
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: borders.radiusFull,
    backgroundColor: colors.secondary,
    color: colors.white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.lg,
    fontSize: typography.text2xl,
    fontWeight: typography.weightBold,
  },
  
  userInfoContainer: {
    flex: 1,
  },
  
  userNameDashboard: {
    margin: 0,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    fontSize: typography.textBase,
  },
  
  userEmailDashboard: {
    margin: `${spacing.xs} 0 0 0`,
    fontSize: typography.textSm,
    color: colors.textLight,
  },
  
  userRole: {
    fontSize: typography.textXs,
    padding: `${spacing.xs} ${spacing.sm}`,
    borderRadius: borders.radius,
    backgroundColor: '#ebf8ff',
    color: colors.secondary,
    display: 'inline-block',
    marginTop: spacing.xs,
  },
  
  // Lista de actividad
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  },
  
  activityItem: {
    padding: spacing.lg,
    backgroundColor: colors.backgroundGray,
    borderRadius: borders.radiusLg,
    border: `1px solid ${colors.border}`,
  },
  
  activityContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  
  activityIcon: {
    width: '36px',
    height: '36px',
    borderRadius: borders.radiusFull,
    backgroundColor: '#ebf8ff',
    color: colors.secondary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: typography.textLg,
  },
  
  activityDetails: {
    flex: 1,
  },
  
  activityText: {
    margin: 0,
    fontSize: typography.textBase,
    color: colors.textSecondary,
  },
  
  activityHighlight: {
    fontWeight: typography.weightSemibold,
    color: colors.textPrimary,
  },
  
  activityTime: {
    margin: `${spacing.xs} 0 0 0`,
    fontSize: typography.textSm,
    color: colors.textPlaceholder,
  },
};

// =============================================
// ESTILOS ESPECÍFICOS DE PAGINACIÓN
// =============================================
const paginationStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderTop: `1px solid ${colors.borderMedium}`,
    flexWrap: 'wrap',
    gap: spacing.lg,
  },
  
  info: {
    fontSize: typography.textSm,
    color: colors.textLight,
  },
  
  buttons: {
    display: 'flex',
    gap: spacing.xs,
  },
  
  button: {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: `1px solid ${colors.borderMedium}`,
    borderRadius: borders.radiusMd,
    backgroundColor: colors.white,
    color: colors.textSecondary,
    fontSize: typography.textSm,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  buttonActive: {
    backgroundColor: colors.secondary,
    borderColor: colors.secondary,
    color: colors.white,
  },
  
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

// =============================================
// ESTILOS ESPECÍFICOS DE ACCIONES MASIVAS
// =============================================
const bulkActionStyles = {
  container: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: `${spacing.md} ${spacing.lg}`,
    backgroundColor: colors.backgroundTertiary,
    borderBottom: `1px solid ${colors.borderMedium}`,
  },
  
  text: {
    fontSize: typography.textBase,
    color: colors.textSecondary,
    fontWeight: typography.weightMedium,
  },
  
  buttons: {
    display: 'flex',
    gap: spacing.sm,
  },
  
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.xs,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: borders.radiusMd,
    border: `1px solid ${colors.borderMedium}`,
    backgroundColor: colors.white,
    fontSize: typography.textSm,
    color: colors.textSecondary,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
};

// =============================================
// ESTILOS DE CARDS
// =============================================
const cards = {
  base: {
    backgroundColor: colors.white,
    borderRadius: borders.radiusLg,
    boxShadow: shadows.base,
    overflow: 'hidden',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${colors.border}`,
    cursor: 'pointer',
  },
  
  baseHover: {
    transform: 'translateY(-2px)',
    boxShadow: shadows.lg,
  },
  
  imageContainer: {
    position: 'relative',
    height: '200px',
    overflow: 'hidden',
    backgroundColor: colors.grayLight,
  },
  
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.2s ease',
  },
  
  imageHover: {
    transform: 'scale(1.05)',
  },
  
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: colors.white,
    borderRadius: borders.radiusFull,
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    paddingLeft: '3px', // Para centrar visualmente el icono de play
  },
  
  playButtonHover: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    transform: 'translate(-50%, -50%) scale(1.1)',
  },
  
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    backgroundColor: colors.grayLight,
    color: colors.textMuted,
    fontSize: typography.textBase,
  },
  
  content: {
    padding: spacing.xl,
  },
  
  title: {
    fontSize: typography.textLg,
    fontWeight: typography.weightSemibold,
    color: colors.textPrimary,
    margin: `0 0 ${spacing.sm} 0`,
    lineHeight: typography.lineHeightTight,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
  description: {
    fontSize: typography.textBase,
    color: colors.textSecondary,
    margin: `0 0 ${spacing.lg} 0`,
    lineHeight: typography.lineHeight,
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  },
  
  actions: {
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  
  badge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    padding: `${spacing.xs} ${spacing.sm}`,
    backgroundColor: colors.primary,
    color: colors.white,
    borderRadius: borders.radius,
    fontSize: typography.textXs,
    fontWeight: typography.weightMedium,
  },
  
  footer: {
    padding: `${spacing.md} ${spacing.xl}`,
    backgroundColor: colors.backgroundGray,
    borderTop: `1px solid ${colors.border}`,
    fontSize: typography.textSm,
    color: colors.textLight,
  },
};

// =============================================
// ESTILOS ESPECÍFICOS DE COMPONENTES COMPLEJOS
// =============================================
const componentStyles = {
  // Gestión de tallas específica
  tallasSection: {
    gridColumn: '1 / -1',
    marginTop: spacing.sm,
  },
  
  tallasContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
    marginTop: spacing.sm,
  },
  
  genderGroup: {
    backgroundColor: colors.backgroundTertiary,
    borderRadius: borders.radius,
    padding: spacing.lg,
    border: `1px solid ${colors.border}`,
  },
  
  genderTitle: {
    marginBottom: spacing.md,
    color: colors.textPrimary,
    fontSize: typography.textBase,
    fontWeight: typography.weightSemibold,
  },
  
  sizesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: spacing.sm,
  },
  
  tallaCheckbox: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    backgroundColor: colors.white,
    borderRadius: borders.radius,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    border: `1px solid ${colors.border}`,
    fontSize: typography.textSm,
    fontWeight: typography.weightMedium,
  },
  
  tallaCheckboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    color: colors.white,
  },
  
  // Placeholders para imágenes/videos
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.grayLight,
    height: '200px',
    color: colors.textMuted,
    borderRadius: borders.radius,
  },
  
  // Play button para videos
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: colors.white,
    borderRadius: borders.radiusFull,
    width: '50px',
    height: '50px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  
  // Contenedor de imagen/video
  mediaContainer: {
    height: '200px',
    overflow: 'hidden',
    position: 'relative',
    cursor: 'pointer',
    borderRadius: borders.radius,
  },
  
  mediaImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
};

// =============================================
// UTILIDADES CSS
// =============================================
const utilities = {
  // Flexbox utilities
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  flexBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  flexStart: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  
  flexEnd: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  
  flexWrap: {
    flexWrap: 'wrap',
  },
  
  // Grid utilities
  gridAuto: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.lg,
  },
  
  grid2: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: spacing.lg,
  },
  
  grid3: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: spacing.lg,
  },
  
  grid4: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: spacing.lg,
  },
  
  // Text utilities
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  
  // Spacing utilities
  mt1: { marginTop: spacing.sm },
  mt2: { marginTop: spacing.lg },
  mt3: { marginTop: spacing.xl },
  mt4: { marginTop: spacing['2xl'] },
  
  mb1: { marginBottom: spacing.sm },
  mb2: { marginBottom: spacing.lg },
  mb3: { marginBottom: spacing.xl },
  mb4: { marginBottom: spacing['2xl'] },
  
  ml1: { marginLeft: spacing.sm },
  ml2: { marginLeft: spacing.lg },
  ml3: { marginLeft: spacing.xl },
  
  mr1: { marginRight: spacing.sm },
  mr2: { marginRight: spacing.lg },
  mr3: { marginRight: spacing.xl },
  
  // Padding utilities
  p1: { padding: spacing.sm },
  p2: { padding: spacing.lg },
  p3: { padding: spacing.xl },
  p4: { padding: spacing['2xl'] },
  
  // Visibility
  hidden: { display: 'none' },
  visible: { display: 'block' },
  
  // Positions
  relative: { position: 'relative' },
  absolute: { position: 'absolute' },
  fixed: { position: 'fixed' },
  
  // Width/Height
  fullWidth: { width: '100%' },
  fullHeight: { height: '100%' },
  
  // Overflow
  overflowHidden: { overflow: 'hidden' },
  overflowAuto: { overflow: 'auto' },
  overflowScroll: { overflow: 'scroll' },
  
  // Border radius
  rounded: { borderRadius: borders.radius },
  roundedMd: { borderRadius: borders.radiusMd },
  roundedLg: { borderRadius: borders.radiusLg },
  roundedFull: { borderRadius: borders.radiusFull },
  
  // Shadows
  shadow: { boxShadow: shadows.base },
  shadowSm: { boxShadow: shadows.sm },
  shadowMd: { boxShadow: shadows.md },
  shadowLg: { boxShadow: shadows.lg },
  shadowNone: { boxShadow: shadows.none },
};

// =============================================
// BREAKPOINTS PARA RESPONSIVE DESIGN
// =============================================
const breakpoints = {
  xs: '480px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// =============================================
// FUNCIONES HELPER
// =============================================

// Función para combinar múltiples objetos de estilos
const combineStyles = (...styles) => {
  return Object.assign({}, ...styles);
};

// Función para crear estilos responsivos
const responsive = (base, breakpointStyles = {}) => {
  let mediaQueries = '';
  Object.entries(breakpointStyles).forEach(([bp, styles]) => {
    if (breakpoints[bp]) {
      mediaQueries += `
        @media (min-width: ${breakpoints[bp]}) {
          ${Object.entries(styles).map(([prop, value]) => 
            `${prop.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`
          ).join(' ')}
        }
      `;
    }
  });
  
  return { ...base, '@media': mediaQueries };
};

// Función para crear variantes de hover
const withHover = (baseStyles, hoverStyles) => {
  return {
    ...baseStyles,
    ':hover': hoverStyles,
  };
};

// Función para crear estados focus
const withFocus = (baseStyles, focusStyles) => {
  return {
    ...baseStyles,
    ':focus': {
      outline: 'none',
      ...focusStyles,
    },
  };
};

// Función para crear estados disabled
const withDisabled = (baseStyles, disabledStyles) => {
  return {
    ...baseStyles,
    ':disabled': {
      cursor: 'not-allowed',
      opacity: 0.6,
      ...disabledStyles,
    },
  };
};

// Función helper para temas
const createTheme = (customColors = {}) => {
  return {
    colors: { ...colors, ...customColors },
    typography,
    spacing,
    borders,
    shadows,
  };
};

// =============================================
// EXPORTACIÓN POR DEFECTO
// =============================================
const adminStyles = {
  // Tokens de diseño
  colors,
  typography,
  spacing,
  borders,
  shadows,
  breakpoints,
  
  // Animaciones
  animations,
  
  // Estilos de componentes
  containers,
  headerStyles,
  buttons,
  forms,
  tables,
  cards,
  modalStyles,
  searchStyles,
  badgeStyles,
  messageStyles,
  progressStyles,
  loadingStyles,
  dashboardStyles,
  paginationStyles,
  bulkActionStyles,
  componentStyles,
  
  // Utilidades
  utilities,
  
  // Funciones helper
  combineStyles,
  responsive,
  withHover,
  withFocus,
  withDisabled,
  createTheme,
};

export default adminStyles;