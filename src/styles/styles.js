// styles.js
export const colors = {
  primary: "#0D1B2A",
  secondary: "#1B263B",
  accent: "#3498db",
  primaryLight: "#2c3e50",
  primaryDark: "#090E15",
  primaryMedium: "#233044",
  white: "#FFFFFF",
  offWhite: "#F8F9FA",
  background: "#F5F6F8",
  gray: "#E2E8F0",
  grayLight: "#F1F5F9",
  grayDark: "#64748B",
  success: "#2E7D32",
  warning: "#ED6C02",
  error: "#D32F2F",
  info: "#0288D1",
  textPrimary: "#1E293B",
  textSecondary: "#475569",
  textLight: "#94A3B8",
};

export const typography = {
  fontPrimary: "'Montserrat', sans-serif",
  fontSecondary: "'Open Sans', sans-serif",
};

export const usersAdminStyles = {
  container: {
    padding: "2rem",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
    width: "100%",
    overflowX: "hidden",
    fontFamily: typography.fontSecondary,
  },
  header: {
    backgroundColor: colors.white,
    borderRadius: "12px",
    padding: "1.5rem",
    marginBottom: "1rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  title: {
    fontSize: "2.2rem",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "1rem",
    fontFamily: typography.fontPrimary,
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    marginBottom: "1.5rem",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
  },
  searchContainer: {
    position: "relative",
    flex: "1",
    maxWidth: "400px",
  },
  searchInput: {
    width: "100%",
    padding: "1rem 3rem 1rem 1.5rem",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "1rem",
    fontFamily: typography.fontSecondary,
    transition: "border-color 0.2s ease",
    backgroundColor: colors.white,
  },
  searchIcon: {
    position: "absolute",
    left: "16px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
  },
  button: {
    padding: "0.875rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontFamily: typography.fontSecondary,
  },
  primaryButton: {
    backgroundColor: "#0D1B2A",
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    color: "#374151",
    border: "2px solid #e2e8f0",
  },
  filterButton: {
    backgroundColor: "colors.white",
    color: "#374151",
    border: "2px solid #e2e8f0",
    '&:hover': {
      backgroundColor: "#0D1B2A",
      color: colors.white,
    }
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
    display: "none",
  },
  filtersGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    alignItems: "end",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    fontFamily: typography.fontSecondary,
  },
  select: {
    padding: "10px 12px",
    border: "2px solid #e2e8f0",
    borderRadius: "6px",
    fontSize: "14px",
    fontFamily: typography.fontSecondary,
    backgroundColor: colors.white,
    cursor: "pointer",
  },
  tableContainer: {
    backgroundColor: colors.white,
    borderRadius: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed", // Añadido para controlar el ancho de las columnas
  },
  tableHeader: {
    backgroundColor: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
  },
  tableHeaderCell: {
    padding: "1rem", // Reducido de 1.25rem
    textAlign: "left",
    fontSize: "0.875rem", // Reducido de 1rem
    fontWeight: "600",
    color: "#374151",
    cursor: "pointer",
    userSelect: "none",
    fontFamily: typography.fontSecondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  tableRow: {
    borderBottom: "1px solid #f1f5f9",
    transition: "background-color 0.2s ease",
  },
  tableCell: {
    padding: "1rem", // Reducido de 1.25rem
    fontSize: "0.875rem", // Reducido de 1rem
    color: "#374151",
    fontFamily: typography.fontSecondary,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  avatar: {
    width: "40px", // Reducido de 48px
    height: "40px", // Reducido de 48px
    borderRadius: "50%",
    backgroundColor: "#0D1B2A",
    color: colors.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem", // Reducido de 1.2rem
    fontWeight: "bold",
  },
  userInfo: {
    display: "flex",
    alignItems: "center",
    gap: "10px", // Reducido de 12px
  },
  userName: {
    fontWeight: "500",
    color: "#1e293b",
    fontSize: "0.875rem", // Añadido para consistencia
  },
  userEmail: {
    fontSize: "0.75rem", // Reducido de 13px
    color: "#64748b",
  },
  badge: {
    padding: "4px 8px", // Reducido de 4px 12px
    borderRadius: "20px",
    fontSize: "0.75rem", // Reducido de 12px
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    display: "inline-flex",
    alignItems: "center",
    gap: "4px",
  },
  roleAdmin: {
    backgroundColor: "#ddd6fe",
    color: "#5b21b6",
  },
  roleUser: {
    backgroundColor: "#e5e7eb",
    color: "#374151",
  },
  actionButton: {
    padding: "6px", // Reducido de 8px
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 2px",
  },
  editButton: {
    backgroundColor: "#fef3c7",
    color: "#92400e",
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
  },
  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px", // Reducido de 20px
    backgroundColor: "#f8fafc",
    borderTop: "1px solid #e2e8f0",
  },
  paginationInfo: {
    fontSize: "0.875rem", // Reducido de 14px
    color: "#64748b",
    fontFamily: typography.fontSecondary,
  },
  paginationButtons: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  paginationButton: {
    padding: "6px 10px", // Reducido de 8px 12px
    border: "1px solid #e2e8f0",
    borderRadius: "6px",
    backgroundColor: colors.white,
    color: "#374151",
    cursor: "pointer",
    fontSize: "0.875rem", // Reducido de 14px
    fontFamily: typography.fontSecondary,
    transition: "all 0.2s ease",
  },
  paginationButtonActive: {
    backgroundColor: "#0D1B2A",
    color: colors.white,
    borderColor: "#0D1B2A",
  },
  checkbox: {
    width: "16px", // Reducido de 18px
    height: "16px", // Reducido de 18px
    cursor: "pointer",
  },
  bulkActions: {
    backgroundColor: "#0D1B2A",
    color: colors.white,
    padding: "10px 16px", // Reducido de 12px 20px
    borderRadius: "8px 8px 0 0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bulkActionsText: {
    fontSize: "0.875rem", // Reducido de 14px
    fontWeight: "500",
  },
  bulkActionsButtons: {
    display: "flex",
    gap: "6px", // Reducido de 8px
  },
  bulkActionButton: {
    padding: "4px 8px", // Reducido de 6px 12px
    border: "1px solid rgba(255,255,255,0.3)",
    borderRadius: "4px",
    backgroundColor: "transparent",
    color: colors.white,
    cursor: "pointer",
    fontSize: "0.75rem", // Reducido de 12px
    transition: "all 0.2s ease",
  },
  errorContainer: {
    textAlign: "center",
    padding: "2rem",
    backgroundColor: "#fee2e2",
    borderRadius: "8px",
    color: "#991b1b",
  },
  loadingContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
  }
};