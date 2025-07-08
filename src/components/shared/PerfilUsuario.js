/**
 * Componente PerfilUsuario - La Aterciopelada
 * Componente compartido para la gestión de perfil de usuario
 * Funciona tanto para clientes registrados como para administradores
 * 
 * Características:
 * - Detección automática del contexto (admin/cliente)
 * - Sistema de estilos adaptable según el layout
 * - Funcionalidades comunes: editar información, cambiar contraseña
 * - Diseño responsivo y elegante
 * 
 * @version 3.0
 * @fecha 2025-01-08
 */

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle, FaUser, FaLock, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import stylesGlobal from "../../styles/stylesGlobal";
import { useLocation } from "react-router-dom";

const PerfilUsuario = ({ variant = "auto" }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  // Detectar automáticamente si estamos en admin o cliente
  const isAdminContext = variant === "admin" || location.pathname.startsWith("/admin");
  
  // State for user information
  const [userInfo, setUserInfo] = useState({
    nombre: user?.name || "Usuario",
    correo: user?.email || "usuario@example.com",
    telefono: user?.phone || "",
  });

  // State for form editing
  const [editInfo, setEditInfo] = useState({ ...userInfo });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // "info" or "password"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    form: false,
    cta: false,
  });

  // Animation trigger on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible({ hero: true, form: true, cta: true });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Función para obtener las iniciales del usuario
  const getUserInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  // Load user profile data from API
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const profileData = await profileService.getProfile();
        if (profileData) {
          const updatedInfo = {
            nombre: profileData.name || user?.name || "Usuario",
            correo: profileData.email || user?.email || "usuario@example.com",
            telefono: profileData.phone || user?.phone || "",
          };
          setUserInfo(updatedInfo);
          setEditInfo(updatedInfo);
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        setError("Error al cargar la información del perfil");
      } finally {
        setIsLoadingProfile(false);
      }
    };

    if (user) {
      loadUserProfile();
    } else {
      setIsLoadingProfile(false);
    }
  }, [user]);

  // Handle changes in personal info form
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setEditInfo({ ...editInfo, [name]: value });
    setError("");
  };

  // Handle changes in password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword({ ...password, [name]: value });
    setError("");
  };

  // Save personal info changes
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await profileService.updateProfile(editInfo);
      if (response.success) {
        setUserInfo(editInfo);
        setEditMode(false);
        setSuccess("Información actualizada correctamente");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(response.message || "Error al actualizar la información");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Error al actualizar la información. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save password changes
  const handleSavePassword = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (password.new !== password.confirm) {
      setError("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    if (password.new.length < 6) {
      setError("La nueva contraseña debe tener al menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const response = await profileService.changePassword(password.current, password.new);
      if (response.success) {
        setPassword({ current: "", new: "", confirm: "" });
        setActiveTab("info");
        setSuccess("Contraseña actualizada correctamente");
        setTimeout(() => setSuccess(""), 5000);
      } else {
        setError(response.message || "Error al actualizar la contraseña");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setError("Error al cambiar la contraseña. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditInfo({ ...userInfo });
    setEditMode(false);
    setError("");
  };

  // Estilos adaptativos según el contexto
  const getContextStyles = () => {
    if (isAdminContext) {
      return {
        background: stylesGlobal.colors.surface.secondary,
        containerPadding: stylesGlobal.spacing.scale[8],
        heroSection: false, // Sin hero section en admin
        cardBackground: stylesGlobal.colors.surface.primary,
      };
    } else {
      return {
        background: stylesGlobal.colors.gradients.warm,
        containerPadding: stylesGlobal.spacing.scale[4],
        heroSection: true, // Con hero section en cliente
        cardBackground: stylesGlobal.colors.surface.primary,
      };
    }
  };

  const contextStyles = getContextStyles();

  // Styles following stylesGlobal pattern
  const styles = {
    pageContainer: {
      background: contextStyles.background,
      minHeight: isAdminContext ? "auto" : "100vh",
      fontFamily: stylesGlobal.typography.families.body,
      padding: isAdminContext ? stylesGlobal.spacing.scale[6] : "0",
    },
    heroSection: {
      background: stylesGlobal.colors.gradients.secondary,
      padding: `${stylesGlobal.spacing.scale[20]} 0 ${stylesGlobal.spacing.scale[16]}`,
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: stylesGlobal.animations.transitions.elegant,
      overflow: "hidden",
      display: contextStyles.heroSection ? "block" : "none",
    },
    title: {
      ...stylesGlobal.typography.headings.h1,
      color: isAdminContext ? stylesGlobal.colors.text.primary : stylesGlobal.colors.text.inverse,
      marginBottom: stylesGlobal.spacing.scale[8],
      textShadow: isAdminContext ? "none" : "0 2px 4px rgba(0,0,0,0.1)",
      fontSize: isAdminContext ? stylesGlobal.typography.scale["2xl"] : stylesGlobal.typography.scale["4xl"],
    },
    profileContainer: {
      maxWidth: isAdminContext ? "100%" : "1200px",
      margin: isAdminContext ? "0" : `${stylesGlobal.spacing.scale[16]} auto 0`,
      padding: stylesGlobal.spacing.scale[12],
      backgroundColor: contextStyles.cardBackground,
      borderRadius: stylesGlobal.borders.radius.xl,
      boxShadow: isAdminContext ? stylesGlobal.shadows.base : stylesGlobal.shadows.xl,
      opacity: isVisible.form ? 1 : 0,
      transform: isVisible.form ? "translateY(0)" : "translateY(20px)",
      transition: stylesGlobal.animations.transitions.elegant,
      position: "relative",
      zIndex: 2,
      marginTop: isAdminContext ? "0" : `-${stylesGlobal.spacing.scale[16]}`,
    },
    sidebarContainer: {
      backgroundColor: stylesGlobal.colors.surface.secondary,
      padding: stylesGlobal.spacing.scale[12],
      borderRadius: stylesGlobal.borders.radius.lg,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      height: "fit-content",
    },
    avatarContainer: {
      width: "120px",
      height: "120px",
      margin: "0 auto",
      borderRadius: "50%",
      background: stylesGlobal.colors.gradients.secondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: stylesGlobal.colors.text.inverse,
      fontSize: stylesGlobal.typography.scale["3xl"],
      fontWeight: stylesGlobal.typography.weights.bold,
      fontFamily: stylesGlobal.typography.families.body,
      boxShadow: stylesGlobal.shadows.brand.secondary,
      marginBottom: stylesGlobal.spacing.scale[8],
      lineHeight: 1,
      letterSpacing: "0.1em",
    },
    userInfo: {
      textAlign: "center",
      marginBottom: stylesGlobal.spacing.scale[12],
    },
    userName: {
      ...stylesGlobal.typography.headings.h5,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[1],
    },
    userEmail: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.text.tertiary,
      marginBottom: 0,
    },
    userRole: {
      ...stylesGlobal.typography.body.small,
      color: stylesGlobal.colors.primary[500],
      fontWeight: stylesGlobal.typography.weights.semibold,
      textTransform: "uppercase",
      letterSpacing: "0.5px",
      marginTop: stylesGlobal.spacing.scale[1],
    },
    navTabs: {
      display: "flex",
      flexDirection: "column",
      gap: stylesGlobal.spacing.scale[2],
    },
    navTab: {
      ...stylesGlobal.components.button.sizes.base,
      ...stylesGlobal.components.button.variants.ghost,
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[2],
      justifyContent: "flex-start",
    },
    navTabActive: {
      ...stylesGlobal.components.button.variants.primary,
      transform: "translateX(4px)",
    },
    formContainer: {
      backgroundColor: stylesGlobal.colors.surface.primary,
      padding: stylesGlobal.spacing.scale[12],
      borderRadius: stylesGlobal.borders.radius.lg,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[8],
    },
    formLabel: {
      ...stylesGlobal.typography.body.small,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.secondary[600],
      marginBottom: stylesGlobal.spacing.scale[2],
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    formControl: {
      ...stylesGlobal.components.input.base,
    },
    buttonPrimary: {
      ...stylesGlobal.components.button.sizes.base,
      ...stylesGlobal.components.button.variants.primary,
    },
    buttonSecondary: {
      ...stylesGlobal.components.button.sizes.base,
      ...stylesGlobal.components.button.variants.secondary,
    },
    buttonActions: {
      display: "flex",
      gap: stylesGlobal.spacing.scale[4],
      justifyContent: "flex-end",
      marginTop: stylesGlobal.spacing.scale[8],
    },
    alert: {
      padding: stylesGlobal.spacing.scale[6],
      marginBottom: stylesGlobal.spacing.scale[6],
      display: "flex",
      alignItems: "center",
      gap: stylesGlobal.spacing.scale[2],
      fontSize: stylesGlobal.typography.scale.base,
      fontFamily: stylesGlobal.typography.families.body,
      borderRadius: stylesGlobal.borders.radius.lg,
    },
    alertSuccess: {
      backgroundColor: stylesGlobal.colors.semantic.success.light,
      color: stylesGlobal.colors.semantic.success.dark,
      border: `1px solid ${stylesGlobal.colors.semantic.success.main}`,
    },
    alertError: {
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      color: stylesGlobal.colors.semantic.error.dark,
      border: `1px solid ${stylesGlobal.colors.semantic.error.main}`,
    },
  };

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (isLoadingProfile) {
    return (
      <div style={styles.pageContainer}>
        <Container>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            gap: stylesGlobal.spacing.scale[6],
          }}>
            <div style={{
              width: "48px",
              height: "48px",
              border: `4px solid ${stylesGlobal.colors.neutral[300]}`,
              borderTop: `4px solid ${stylesGlobal.colors.primary[500]}`,
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }} />
            <p style={{
              ...stylesGlobal.typography.body.large,
              color: stylesGlobal.colors.text.tertiary,
            }}>
              Cargando perfil...
            </p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer} className="perfil-page-container">
      {/* Hero Section - Solo para clientes */}
      {contextStyles.heroSection && (
        <section style={styles.heroSection} className="perfil-hero-section">
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255, 255, 255, 0.1)",
            opacity: 0.15,
            zIndex: 1,
          }} />
          <Container>
            <div style={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
            }}>
              <h1 style={styles.title} className="perfil-hero-title">Mi Perfil</h1>
              <p style={{
                ...stylesGlobal.typography.body.large,
                color: stylesGlobal.colors.text.inverse,
                maxWidth: "800px",
                margin: "0 auto",
                opacity: 0.95,
              }} className="perfil-hero-subtitle">
                Gestiona tu información personal y configuraciones de cuenta
              </p>
            </div>
          </Container>
        </section>
      )}

      {/* Profile Content */}
      <Container style={{ position: "relative", zIndex: 2 }}>
        <div style={styles.profileContainer} className="perfil-container">
          {/* Título para contexto admin */}
          {isAdminContext && (
            <h1 style={styles.title} className="perfil-hero-title">Mi Perfil</h1>
          )}

          {/* Alerts */}
          {success && (
            <div style={{ ...styles.alert, ...styles.alertSuccess }}>
              <FaCheckCircle />
              {success}
            </div>
          )}
          {error && (
            <div style={{ ...styles.alert, ...styles.alertError }}>
              <FaExclamationTriangle />
              {error}
            </div>
          )}

          <Row>
            {/* Sidebar */}
            <Col lg={4} className="mb-4">
              <div style={styles.sidebarContainer} className="perfil-sidebar">
                {/* Avatar */}
                <div style={styles.avatarContainer} className="perfil-avatar">
                  {getUserInitials(userInfo.nombre)}
                </div>

                {/* User Info */}
                <div style={styles.userInfo} className="perfil-user-info">
                  <h3 style={styles.userName}>{userInfo.nombre}</h3>
                  <p style={styles.userEmail}>{userInfo.correo}</p>
                  {user?.role && (
                    <p style={styles.userRole}>
                      {user.role === 'admin' ? 'Administrador' : 'Cliente'}
                    </p>
                  )}
                </div>

                {/* Navigation Tabs */}
                <div style={styles.navTabs} className="perfil-nav-tabs">
                  <button
                    style={{
                      ...styles.navTab,
                      ...(activeTab === "info" ? styles.navTabActive : {}),
                    }}
                    className="perfil-nav-tab"
                    onClick={() => setActiveTab("info")}
                  >
                    <FaUser />
                    Información Personal
                  </button>
                  <button
                    style={{
                      ...styles.navTab,
                      ...(activeTab === "password" ? styles.navTabActive : {}),
                    }}
                    className="perfil-nav-tab"
                    onClick={() => setActiveTab("password")}
                  >
                    <FaLock />
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </Col>

            {/* Main Content */}
            <Col lg={8}>
              <div style={styles.formContainer} className="perfil-form-container">
                {activeTab === "info" && (
                  <form onSubmit={handleSaveInfo}>
                    <h4 style={{
                      ...stylesGlobal.typography.headings.h4,
                      marginBottom: stylesGlobal.spacing.scale[8],
                      color: stylesGlobal.colors.text.primary,
                    }} className="perfil-form-title">
                      Información Personal
                    </h4>

                    <div style={styles.formGroup} className="perfil-form-group">
                      <label style={styles.formLabel}>Nombre Completo</label>
                      <input
                        type="text"
                        name="nombre"
                        value={editInfo.nombre}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={styles.formControl}
                        className="perfil-form-input"
                      />
                    </div>

                    <div style={styles.formGroup} className="perfil-form-group">
                      <label style={styles.formLabel}>Correo Electrónico</label>
                      <input
                        type="email"
                        name="correo"
                        value={editInfo.correo}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={styles.formControl}
                        className="perfil-form-input"
                      />
                    </div>

                    <div style={styles.formGroup} className="perfil-form-group">
                      <label style={styles.formLabel}>Teléfono</label>
                      <input
                        type="tel"
                        name="telefono"
                        value={editInfo.telefono}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={styles.formControl}
                        className="perfil-form-input"
                      />
                    </div>

                    <div style={styles.buttonActions} className="perfil-button-actions">
                      {!editMode ? (
                        <button
                          type="button"
                          style={styles.buttonPrimary}
                          className="perfil-button"
                          onClick={() => setEditMode(true)}
                        >
                          <FaEdit style={{ marginRight: "8px" }} />
                          Editar
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            style={styles.buttonSecondary}
                            className="perfil-button"
                            onClick={handleCancel}
                            disabled={isLoading}
                          >
                            <FaTimes style={{ marginRight: "8px" }} />
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            style={styles.buttonPrimary}
                            className="perfil-button"
                            disabled={isLoading}
                          >
                            <FaSave style={{ marginRight: "8px" }} />
                            {isLoading ? "Guardando..." : "Guardar"}
                          </button>
                        </>
                      )}
                    </div>
                  </form>
                )}

                {activeTab === "password" && (
                  <form onSubmit={handleSavePassword}>
                    <h4 style={{
                      ...stylesGlobal.typography.headings.h4,
                      marginBottom: stylesGlobal.spacing.scale[8],
                      color: stylesGlobal.colors.text.primary,
                    }} className="perfil-form-title">
                      Cambiar Contraseña
                    </h4>

                    <div style={styles.formGroup} className="perfil-form-group">
                      <label style={styles.formLabel}>Contraseña Actual</label>
                      <input
                        type="password"
                        name="current"
                        value={password.current}
                        onChange={handlePasswordChange}
                        style={styles.formControl}
                        className="perfil-form-input"
                        required
                      />
                    </div>

                    <div style={styles.formGroup} className="perfil-form-group">
                      <label style={styles.formLabel}>Nueva Contraseña</label>
                      <input
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        style={styles.formControl}
                        className="perfil-form-input"
                        required
                      />
                    </div>

                    <div style={styles.formGroup} className="perfil-form-group">
                      <label style={styles.formLabel}>Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        style={styles.formControl}
                        className="perfil-form-input"
                        required
                      />
                    </div>

                    <div style={styles.buttonActions} className="perfil-button-actions">
                      <button
                        type="submit"
                        style={styles.buttonPrimary}
                        className="perfil-button"
                        disabled={isLoading}
                      >
                        <FaSave style={{ marginRight: "8px" }} />
                        {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          /* ===== RESPONSIVE STYLES MEJORADOS ===== */
          
          /* Transiciones suaves para todos los elementos responsivos */
          .perfil-container,
          .perfil-sidebar,
          .perfil-form-container,
          .perfil-nav-tabs,
          .perfil-avatar,
          .perfil-button-actions {
            transition: all 0.3s ease !important;
          }

          /* ===== MOBILE FIRST - Extra Small devices (< 576px) ===== */
          @media (max-width: 575.98px) {
            .perfil-page-container {
              padding: 0 !important;
              margin: 0 !important;
            }
            
            .perfil-container {
              margin: ${stylesGlobal.spacing.scale[2]} auto !important;
              padding: ${stylesGlobal.spacing.scale[3]} !important;
              border-radius: ${stylesGlobal.borders.radius.lg} !important;
            }
            
            .perfil-hero-section {
              padding: ${stylesGlobal.spacing.scale[8]} 0 ${stylesGlobal.spacing.scale[6]} !important;
            }
            
            .perfil-hero-title {
              font-size: ${stylesGlobal.typography.scale.lg} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[3]} !important;
              line-height: 1.2 !important;
              text-align: center !important;
            }
            
            .perfil-hero-subtitle {
              font-size: ${stylesGlobal.typography.scale.sm} !important;
              padding: 0 ${stylesGlobal.spacing.scale[4]} !important;
              line-height: 1.4 !important;
            }
            
            .perfil-sidebar {
              padding: ${stylesGlobal.spacing.scale[4]} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[4]} !important;
              text-align: center !important;
            }
            
            .perfil-form-container {
              padding: ${stylesGlobal.spacing.scale[4]} !important;
            }
            
            .perfil-avatar {
              width: 70px !important;
              height: 70px !important;
              font-size: ${stylesGlobal.typography.scale.lg} !important;
              margin: 0 auto ${stylesGlobal.spacing.scale[3]} auto !important;
            }
            
            .perfil-user-info h3 {
              font-size: ${stylesGlobal.typography.scale.base} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[1]} !important;
            }
            
            .perfil-user-info p {
              font-size: ${stylesGlobal.typography.scale.xs} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[1]} !important;
            }
            
            .perfil-nav-tabs {
              flex-direction: row !important;
              gap: ${stylesGlobal.spacing.scale[1]} !important;
              overflow-x: auto !important;
              padding: 0 ${stylesGlobal.spacing.scale[1]} ${stylesGlobal.spacing.scale[2]} ${stylesGlobal.spacing.scale[1]} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[4]} !important;
              -webkit-overflow-scrolling: touch !important;
              scrollbar-width: thin !important;
            }
            
            .perfil-nav-tab {
              white-space: nowrap !important;
              min-width: 120px !important;
              flex: 0 0 auto !important;
              font-size: ${stylesGlobal.typography.scale.xs} !important;
              padding: ${stylesGlobal.spacing.scale[2]} ${stylesGlobal.spacing.scale[3]} !important;
              gap: ${stylesGlobal.spacing.scale[1]} !important;
              min-height: 44px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .perfil-nav-tab svg {
              width: 12px !important;
              height: 12px !important;
              margin-right: ${stylesGlobal.spacing.scale[1]} !important;
            }
            
            .perfil-form-title {
              font-size: ${stylesGlobal.typography.scale.base} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[4]} !important;
              text-align: center !important;
            }
            
            .perfil-form-group {
              margin-bottom: ${stylesGlobal.spacing.scale[4]} !important;
            }
            
            .perfil-form-group label {
              font-size: ${stylesGlobal.typography.scale.xs} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[1]} !important;
              display: block !important;
            }
            
            .perfil-form-input {
              font-size: ${stylesGlobal.typography.scale.sm} !important;
              padding: ${stylesGlobal.spacing.scale[3]} !important;
              width: 100% !important;
            }
            
            .perfil-button-actions {
              display: flex !important;
              flex-direction: column !important;
              gap: ${stylesGlobal.spacing.scale[2]} !important;
              margin-top: ${stylesGlobal.spacing.scale[6]} !important;
            }
            
            .perfil-button-actions button {
              width: 100% !important;
              margin-bottom: 0 !important;
              min-height: 48px !important;
            }
          }

          /* ===== SMALL DEVICES (576px - 767.98px) ===== */
          @media (min-width: 576px) and (max-width: 767.98px) {
            .perfil-container {
              padding: ${stylesGlobal.spacing.scale[4]} !important;
              margin: ${stylesGlobal.spacing.scale[3]} auto !important;
            }
            
            .perfil-hero-title {
              font-size: ${stylesGlobal.typography.scale.xl} !important;
            }
            
            .perfil-sidebar {
              padding: ${stylesGlobal.spacing.scale[5]} !important;
              margin-bottom: ${stylesGlobal.spacing.scale[5]} !important;
              text-align: center !important;
            }
            
            .perfil-form-container {
              padding: ${stylesGlobal.spacing.scale[5]} !important;
            }
            
            .perfil-avatar {
              width: 90px !important;
              height: 90px !important;
              font-size: ${stylesGlobal.typography.scale.xl} !important;
              margin: 0 auto ${stylesGlobal.spacing.scale[4]} auto !important;
            }
            
            .perfil-nav-tabs {
              flex-direction: row !important;
              justify-content: center !important;
              gap: ${stylesGlobal.spacing.scale[2]} !important;
              flex-wrap: wrap !important;
              padding-bottom: 0 !important;
            }
            
            .perfil-nav-tab {
              flex: 1 !important;
              min-width: 140px !important;
              max-width: 180px !important;
            }
            
            .perfil-button-actions {
              display: flex !important;
              justify-content: center !important;
              gap: ${stylesGlobal.spacing.scale[3]} !important;
              flex-wrap: wrap !important;
            }
          }

          /* ===== MEDIUM DEVICES (768px - 991.98px) ===== */
          @media (min-width: 768px) and (max-width: 991.98px) {
            .perfil-container {
              margin-top: 0 !important;
              padding: ${stylesGlobal.spacing.scale[6]} !important;
            }
            
            .perfil-hero-section {
              padding: ${stylesGlobal.spacing.scale[12]} 0 ${stylesGlobal.spacing.scale[8]} !important;
            }
            
            .perfil-hero-title {
              font-size: ${stylesGlobal.typography.scale["2xl"]} !important;
            }
            
            .perfil-sidebar {
              margin-bottom: ${stylesGlobal.spacing.scale[6]} !important;
              padding: ${stylesGlobal.spacing.scale[6]} !important;
            }
            
            .perfil-form-container {
              padding: ${stylesGlobal.spacing.scale[6]} !important;
            }
            
            .perfil-avatar {
              width: 100px !important;
              height: 100px !important;
              font-size: ${stylesGlobal.typography.scale["2xl"]} !important;
            }
            
            .perfil-nav-tabs {
              flex-direction: column !important;
              gap: ${stylesGlobal.spacing.scale[2]} !important;
            }
            
            .perfil-form-group {
              margin-bottom: ${stylesGlobal.spacing.scale[6]} !important;
            }
            
            .perfil-button-actions {
              display: flex !important;
              justify-content: flex-end !important;
              gap: ${stylesGlobal.spacing.scale[3]} !important;
            }
          }

          /* ===== LARGE DEVICES (992px - 1199.98px) ===== */
          @media (min-width: 992px) and (max-width: 1199.98px) {
            .perfil-nav-tabs {
              flex-direction: column !important;
              gap: ${stylesGlobal.spacing.scale[2]} !important;
            }
          }

          /* ===== EXTRA LARGE DEVICES (1200px and up) ===== */
          @media (min-width: 1200px) {
            .perfil-container {
              max-width: 1200px !important;
              margin: 0 auto !important;
            }
          }

          /* ===== LANDSCAPE ORIENTATION EN MÓVILES ===== */
          @media (max-width: 767.98px) and (orientation: landscape) {
            .perfil-hero-section {
              padding: ${stylesGlobal.spacing.scale[6]} 0 ${stylesGlobal.spacing.scale[4]} !important;
            }
            
            .perfil-avatar {
              width: 60px !important;
              height: 60px !important;
            }
            
            .perfil-sidebar {
              padding: ${stylesGlobal.spacing.scale[3]} !important;
            }
          }

          /* ===== SCROLL Y ACCESIBILIDAD ===== */
          
          /* Scroll horizontal suave para nav tabs */
          .perfil-nav-tabs::-webkit-scrollbar {
            height: 4px;
          }
          
          .perfil-nav-tabs::-webkit-scrollbar-track {
            background: ${stylesGlobal.colors.neutral[200]};
            border-radius: ${stylesGlobal.borders.radius.full};
          }
          
          .perfil-nav-tabs::-webkit-scrollbar-thumb {
            background: ${stylesGlobal.colors.primary[300]};
            border-radius: ${stylesGlobal.borders.radius.full};
          }
          
          .perfil-nav-tabs::-webkit-scrollbar-thumb:hover {
            background: ${stylesGlobal.colors.primary[400]};
          }

          /* Touch-friendly tap targets para móviles */
          @media (hover: none) and (pointer: coarse) {
            .perfil-nav-tab,
            .perfil-button-actions button {
              min-height: 44px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
            }
          }

          /* Focus states para accesibilidad */
          .perfil-nav-tab:focus,
          .perfil-form-input:focus,
          .perfil-button-actions button:focus {
            outline: 2px solid ${stylesGlobal.colors.primary[500]} !important;
            outline-offset: 2px !important;
            z-index: 10 !important;
          }

          /* Mejoras para pantallas muy pequeñas (< 320px) */
          @media (max-width: 319.98px) {
            .perfil-container {
              margin: ${stylesGlobal.spacing.scale[1]} !important;
              padding: ${stylesGlobal.spacing.scale[2]} !important;
            }
            
            .perfil-sidebar,
            .perfil-form-container {
              padding: ${stylesGlobal.spacing.scale[3]} !important;
            }
            
            .perfil-nav-tab {
              min-width: 100px !important;
              font-size: ${stylesGlobal.typography.scale.xs} !important;
              padding: ${stylesGlobal.spacing.scale[1]} ${stylesGlobal.spacing.scale[2]} !important;
            }
            
            .perfil-avatar {
              width: 50px !important;
              height: 50px !important;
            }
          }

          /* Mejoras para tablets en orientación vertical */
          @media (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
            .perfil-sidebar {
              text-align: center !important;
            }
            
            .perfil-nav-tabs {
              justify-content: center !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default PerfilUsuario;
