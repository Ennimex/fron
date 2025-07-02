import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import stylesPublic from "../../styles/stylesPublic";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const Perfil = () => {
  const { user } = useAuth();
  
  // Helper function to safely access style properties
  const getStyleValue = (path, fallback) => {
    try {
      return path.split('.').reduce((obj, key) => obj?.[key], stylesPublic) || fallback;
    } catch {
      return fallback;
    }
  };
  
  // State for user information - initialized with user data
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
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, form: true })), 300);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, cta: true })), 600);
  }, []);

  // Función para obtener las iniciales del usuario
  const getUserInitials = (name) => {
    if (!name || name === "Usuario") return "U";
    const names = name.trim().split(" ").filter(Boolean);
    if (names.length === 0) return "U";
    if (names.length === 1) {
      // Solo un nombre, tomar las primeras 2 letras si es muy corto
      return names[0].length === 1 ? names[0][0].toUpperCase() : names[0].substring(0, 2).toUpperCase();
    }
    // Múltiples nombres, tomar primera letra del primer y último nombre
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  };

  // Load user profile data from API
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoadingProfile(true);
        const response = await profileService.getProfile();
        if (response.success && response.data) {
          const userData = {
            nombre: response.data.name || "Usuario",
            correo: response.data.email || "usuario@example.com",
            telefono: response.data.phone || "",
          };
          setUserInfo(userData);
          setEditInfo(userData);
        }
      } catch (error) {
        console.error('Error al cargar perfil:', error);
        setError('Error al cargar los datos del perfil');
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
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle changes in password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };
  // Save personal info changes
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    
    // Limpiar espacios en blanco de los campos
    const trimmedInfo = {
      nombre: editInfo.nombre.trim(),
      correo: editInfo.correo.trim(),
      telefono: editInfo.telefono.trim(),
    };

    if (!trimmedInfo.nombre || !trimmedInfo.correo) {
      setError("Por favor, completa al menos el nombre y correo.");
      return;
    }

    // Validar formato de email
    const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
    if (!emailRegex.test(trimmedInfo.correo)) {
      setError("Por favor, ingresa un correo electrónico válido.");
      return;
    }

    // Validar que el nombre tenga al menos 2 caracteres
    if (trimmedInfo.nombre.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await profileService.updateProfile(trimmedInfo);
      
      if (response.success) {
        setUserInfo({ ...trimmedInfo });
        setEditInfo({ ...trimmedInfo });
        setEditMode(false);
        setSuccess(response.message || "Información actualizada correctamente.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Error al actualizar la información.");
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      setError(error.message || "Error al actualizar la información. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  // Save password changes
  const handleSavePassword = async (e) => {
    e.preventDefault();
    
    // Limpiar espacios en blanco
    const trimmedPasswords = {
      current: password.current.trim(),
      new: password.new.trim(),
      confirm: password.confirm.trim(),
    };

    if (!trimmedPasswords.current || !trimmedPasswords.new || !trimmedPasswords.confirm) {
      setError("Por favor, completa todos los campos de contraseña.");
      return;
    }

    if (trimmedPasswords.new !== trimmedPasswords.confirm) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    if (trimmedPasswords.new.length < 8) {
      setError("La nueva contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Validar fortaleza de contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(trimmedPasswords.new)) {
      setError("La nueva contraseña debe contener al menos una mayúscula, una minúscula y un número.");
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await profileService.updatePassword(trimmedPasswords);
      
      if (response.success) {
        setPassword({ current: "", new: "", confirm: "" });
        setSuccess(response.message || "Contraseña actualizada correctamente.");
        setTimeout(() => setSuccess(""), 3000);
      } else {
        setError(response.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      setError(error.message || "Error al actualizar la contraseña. Verifica tu contraseña actual.");
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

  // Styles inspired by ProductoDetalle.js
  const styles = {
    pageContainer: {
      background: getStyleValue('colors.gradients.warm', 'linear-gradient(to bottom, #fafaf9 0%, #f5f5f4 50%, #fafaf9 100%)'),
      minHeight: "100vh",
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
    },
    heroSection: {
      background: getStyleValue('colors.gradients.secondary', 'linear-gradient(135deg, #007a6b 0%, #2dd4bf 100%)'),
      padding: `${getStyleValue('spacing.scale.20', '80px')} 0 ${getStyleValue('spacing.scale.16', '64px')}`,
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: "all 1.2s ease-out",
      overflow: "hidden",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(255, 255, 255, 0.1)",
      opacity: 0.15,
      zIndex: 1,
    },
    heroContent: {
      position: "relative",
      zIndex: 2,
      textAlign: "center",
    },
    title: {
      fontSize: getStyleValue('typography.scale.4xl', '2.25rem'),
      fontWeight: getStyleValue('typography.weights.bold', 700),
      color: getStyleValue('colors.text.light', '#ffffff'),
      marginBottom: getStyleValue('spacing.scale.8', '32px'),
      fontFamily: getStyleValue('typography.families.display', "'Manrope', sans-serif"),
      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    subtitle: {
      fontSize: getStyleValue('typography.scale.lg', '1.125rem'),
      color: getStyleValue('colors.text.light', '#ffffff'),
      lineHeight: getStyleValue('typography.leading.relaxed', 1.625),
      marginBottom: getStyleValue('spacing.scale.4', '16px'),
      maxWidth: "800px",
      margin: "0 auto",
      opacity: 0.95,
      padding: `0 ${getStyleValue('spacing.scale.4', '16px')}`,
      textAlign: "center",
      wordWrap: "break-word",
      whiteSpace: "normal",
      overflow: "visible",
      display: "block",
      width: "100%",
      boxSizing: "border-box",
    },
    profileContainer: {
      maxWidth: "1200px",
      margin: `${getStyleValue('spacing.scale.16', '64px')} auto 0`,
      padding: getStyleValue('spacing.scale.12', '48px'),
      backgroundColor: getStyleValue('colors.background.white', '#ffffff'),
      borderRadius: getStyleValue('borders.radius.xl', '16px'),
      boxShadow: getStyleValue('shadows.xl', '0 25px 50px -12px rgba(0, 0, 0, 0.25)'),
      opacity: isVisible.form ? 1 : 0,
      transform: isVisible.form ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      zIndex: 2,
      marginTop: `-${getStyleValue('spacing.scale.16', '64px')}`,
    },
    sidebarContainer: {
      backgroundColor: getStyleValue('colors.surface.secondary', '#fafaf9'),
      padding: getStyleValue('spacing.scale.12', '48px'),
      borderRadius: getStyleValue('borders.radius.lg', '12px'),
      border: `1px solid ${getStyleValue('colors.neutral.200', '#e7e5e4')}`,
      height: "fit-content",
    },
    avatarContainer: {
      width: "120px",
      height: "120px",
      margin: "0 auto",
      borderRadius: "50%",
      background: getStyleValue('colors.gradients.secondary', 'linear-gradient(135deg, #007a6b 0%, #2dd4bf 100%)'),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: getStyleValue('colors.text.inverse', '#ffffff'),
      fontSize: "2.5rem", // Reducido de 3xl para mejor ajuste
      fontWeight: getStyleValue('typography.weights.bold', 700),
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
      boxShadow: getStyleValue('shadows.md', '0 10px 15px -3px rgba(0, 122, 107, 0.2)'),
      marginBottom: getStyleValue('spacing.scale.8', '32px'),
      lineHeight: 1, // Asegurar que no haya espacio extra
      letterSpacing: "0.1em", // Espaciado entre letras
    },
    userInfo: {
      textAlign: "center",
      marginBottom: getStyleValue('spacing.scale.12', '48px'),
    },
    userName: {
      fontSize: getStyleValue('typography.scale.xl', '1.25rem'),
      fontWeight: getStyleValue('typography.weights.semibold', 600),
      color: getStyleValue('colors.text.primary', '#1c1917'),
      marginBottom: getStyleValue('spacing.scale.1', '4px'),
      fontFamily: getStyleValue('typography.families.display', "'Manrope', sans-serif"),
    },
    userEmail: {
      fontSize: getStyleValue('typography.scale.sm', '0.875rem'),
      color: getStyleValue('colors.text.tertiary', '#78716c'),
      marginBottom: 0,
    },
    navTabs: {
      display: "flex",
      flexDirection: "column",
      gap: getStyleValue('spacing.scale.2', '8px'),
    },
    navTab: {
      padding: `${getStyleValue('spacing.scale.4', '16px')} ${getStyleValue('spacing.scale.6', '24px')}`,
      borderRadius: getStyleValue('borders.radius.md', '8px'),
      border: "none",
      background: "transparent",
      color: getStyleValue('colors.text.secondary', '#44403c'),
      fontSize: getStyleValue('typography.scale.base', '1rem'),
      fontWeight: getStyleValue('typography.weights.medium', 500),
      cursor: "pointer",
      transition: getStyleValue('transitions.default', 'all 200ms ease'),
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: getStyleValue('spacing.scale.2', '8px'),
    },
    navTabActive: {
      background: getStyleValue('colors.semantic.info.main', '#2563eb'),
      color: getStyleValue('colors.text.inverse', '#ffffff'),
      transform: "translateX(4px)",
      boxShadow: getStyleValue('shadows.sm', '0 1px 3px 0 rgba(37, 99, 235, 0.3)'),
    },
    formContainer: {
      backgroundColor: getStyleValue('colors.surface.primary', '#ffffff'),
      padding: getStyleValue('spacing.scale.12', '48px'),
      borderRadius: getStyleValue('borders.radius.lg', '12px'),
      border: `1px solid ${getStyleValue('colors.neutral.200', '#e7e5e4')}`,
    },
    formGroup: {
      marginBottom: getStyleValue('spacing.scale.8', '32px'),
    },
    formLabel: {
      fontSize: getStyleValue('typography.scale.sm', '0.875rem'),
      fontWeight: getStyleValue('typography.weights.semibold', 600),
      color: getStyleValue('colors.secondary.600', '#006d60'),
      marginBottom: getStyleValue('spacing.scale.2', '8px'),
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    formControl: {
      padding: getStyleValue('spacing.scale.4', '16px'),
      borderRadius: getStyleValue('borders.radius.md', '8px'),
      border: `2px solid ${getStyleValue('colors.neutral.300', '#d6d3d1')}`,
      backgroundColor: getStyleValue('colors.surface.secondary', '#fafaf9'),
      fontSize: getStyleValue('typography.scale.base', '1rem'),
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
      color: getStyleValue('colors.text.primary', '#1c1917'),
      transition: getStyleValue('transitions.default', 'all 200ms ease'),
      width: "100%",
    },
    formControlFocus: {
      borderColor: getStyleValue('colors.semantic.info.main', '#2563eb'),
      boxShadow: `0 0 0 3px ${getStyleValue('colors.semantic.info.light', '#eff6ff')}`,
      backgroundColor: getStyleValue('colors.surface.primary', '#ffffff'),
    },
    buttonPrimary: {
      background: getStyleValue('colors.semantic.info.main', '#2563eb'),
      border: "none",
      borderRadius: getStyleValue('borders.radius.full', '9999px'),
      padding: `${getStyleValue('spacing.scale.4', '16px')} ${getStyleValue('spacing.scale.8', '32px')}`,
      fontSize: getStyleValue('typography.scale.base', '1rem'),
      fontWeight: getStyleValue('typography.weights.semibold', 600),
      color: getStyleValue('colors.text.inverse', '#ffffff'),
      cursor: "pointer",
      transition: getStyleValue('transitions.default', 'all 200ms ease'),
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
      boxShadow: getStyleValue('shadows.sm', '0 1px 3px 0 rgba(37, 99, 235, 0.3)'),
    },
    buttonSecondary: {
      background: "transparent",
      border: `2px solid ${getStyleValue('colors.secondary.500', '#007a6b')}`,
      borderRadius: getStyleValue('borders.radius.full', '9999px'),
      padding: `${getStyleValue('spacing.scale.4', '16px')} ${getStyleValue('spacing.scale.8', '32px')}`,
      fontSize: getStyleValue('typography.scale.base', '1rem'),
      fontWeight: getStyleValue('typography.weights.semibold', 600),
      color: getStyleValue('colors.secondary.600', '#006d60'),
      cursor: "pointer",
      transition: getStyleValue('transitions.default', 'all 200ms ease'),
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
    },
    buttonActions: {
      display: "flex",
      gap: getStyleValue('spacing.scale.4', '16px'),
      justifyContent: "flex-end",
      marginTop: getStyleValue('spacing.scale.8', '32px'),
    },
    alert: {
      padding: getStyleValue('spacing.scale.6', '24px'),
      borderRadius: getStyleValue('borders.radius.md', '8px'),
      marginBottom: getStyleValue('spacing.scale.6', '24px'),
      display: "flex",
      alignItems: "center",
      gap: getStyleValue('spacing.scale.2', '8px'),
      fontSize: getStyleValue('typography.scale.base', '1rem'),
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
    },
    alertSuccess: {
      backgroundColor: getStyleValue('colors.semantic.success.light', '#dcfce7'),
      color: getStyleValue('colors.semantic.success.dark', '#166534'),
      border: `1px solid ${getStyleValue('colors.semantic.success.main', '#22c55e')}`,
    },
    alertError: {
      backgroundColor: getStyleValue('colors.semantic.error.light', '#fef2f2'),
      color: getStyleValue('colors.semantic.error.dark', '#991b1b'),
      border: `1px solid ${getStyleValue('colors.semantic.error.main', '#ef4444')}`,
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: getStyleValue('spacing.scale.6', '24px'),
    },
    loadingSpinner: {
      width: "48px",
      height: "48px",
      border: `4px solid ${getStyleValue('colors.neutral.300', '#d6d3d1')}`,
      borderTop: `4px solid ${getStyleValue('colors.semantic.info.main', '#2563eb')}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      fontSize: getStyleValue('typography.scale.lg', '1.125rem'),
      color: getStyleValue('colors.text.tertiary', '#78716c'),
      fontFamily: getStyleValue('typography.families.body', "'Inter', sans-serif"),
    },
  };

  // Mostrar pantalla de carga mientras se obtienen los datos
  if (isLoadingProfile) {
    return (
      <div style={styles.pageContainer}>
        <Container>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p style={styles.loadingText}>Cargando datos del perfil...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}></div>
        <Container>
          <div style={styles.heroContent}>
            <h1 style={styles.title}>Mi Perfil</h1>
            <p style={styles.subtitle}>
              Administra tu información personal y configuración de seguridad con facilidad.
            </p>
          </div>
        </Container>
      </section>

      {/* Profile Content */}
      <Container>
        <div style={styles.profileContainer}>
          {success && (
            <div style={{...styles.alert, ...styles.alertSuccess}}>
              <FaCheckCircle /> {success}
            </div>
          )}
          {error && (
            <div style={{...styles.alert, ...styles.alertError}}>
              <FaExclamationTriangle /> {error}
            </div>
          )}

          <Row>
            {/* Sidebar Navigation */}
            <Col lg={4} className="mb-4">
              <div style={styles.sidebarContainer}>
                <div style={styles.avatarContainer}>
                  {getUserInitials(userInfo.nombre)}
                </div>
                
                <div style={styles.userInfo}>
                  <h3 style={styles.userName}>{userInfo.nombre}</h3>
                  <p style={styles.userEmail}>{userInfo.correo}</p>
                </div>

                <div style={styles.navTabs}>
                  <button
                    className="nav-tab"
                    style={{
                      ...styles.navTab,
                      ...(activeTab === "info" ? styles.navTabActive : {}),
                    }}
                    onClick={() => setActiveTab("info")}
                  >
                    <i className="bi bi-person"></i>
                    Información Personal
                  </button>
                  <button
                    className="nav-tab"
                    style={{
                      ...styles.navTab,
                      ...(activeTab === "password" ? styles.navTabActive : {}),
                    }}
                    onClick={() => setActiveTab("password")}
                  >
                    <i className="bi bi-lock"></i>
                    Cambiar Contraseña
                  </button>
                </div>
              </div>
            </Col>

            {/* Main Content */}
            <Col lg={8}>
              <div style={styles.formContainer}>
                {activeTab === "info" && (
                  <form onSubmit={handleSaveInfo}>
                    <Row>
                      <Col md={6}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Nombre Completo</label>
                          <input
                            type="text"
                            name="nombre"
                            value={editInfo.nombre}
                            onChange={handleInfoChange}
                            disabled={!editMode || isLoading}
                            style={styles.formControl}
                            required={editMode}
                          />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Correo Electrónico</label>
                          <input
                            type="email"
                            name="correo"
                            value={editInfo.correo}
                            onChange={handleInfoChange}
                            disabled={!editMode || isLoading}
                            style={styles.formControl}
                            required={editMode}
                          />
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12}>
                        <div style={styles.formGroup}>
                          <label style={styles.formLabel}>Teléfono</label>
                          <input
                            type="tel"
                            name="telefono"
                            value={editInfo.telefono}
                            onChange={handleInfoChange}
                            disabled={!editMode || isLoading}
                            style={styles.formControl}
                            placeholder="Ej: +52 55 1234 5678"
                            pattern="[+]?[0-9\s-()]+"
                            title="Solo números, espacios, guiones, paréntesis y el símbolo +"
                          />
                        </div>
                      </Col>
                    </Row>
                    
                    <div style={styles.buttonActions}>
                      {editMode ? (
                        <>
                          <button
                            type="button"
                            style={styles.buttonSecondary}
                            onClick={handleCancel}
                            disabled={isLoading}
                          >
                            Cancelar
                          </button>
                          <button
                            type="submit"
                            style={styles.buttonPrimary}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <i className="bi bi-arrow-clockwise me-2"></i>
                                Guardando...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-save me-2"></i>
                                Guardar Cambios
                              </>
                            )}
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          style={styles.buttonPrimary}
                          onClick={() => setEditMode(true)}
                        >
                          <i className="bi bi-pencil me-2"></i>
                          Editar Información
                        </button>
                      )}
                    </div>
                  </form>
                )}

                {activeTab === "password" && (
                  <form onSubmit={handleSavePassword}>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Contraseña Actual</label>
                      <input
                        type="password"
                        name="current"
                        value={password.current}
                        onChange={handlePasswordChange}
                        style={styles.formControl}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Nueva Contraseña</label>
                      <input
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        style={styles.formControl}
                        required
                        minLength={8}
                        title="Mínimo 8 caracteres, debe incluir mayúscula, minúscula y número"
                      />
                      <small style={{
                        color: getStyleValue('colors.text.tertiary', '#78716c'),
                        fontSize: getStyleValue('typography.scale.xs', '0.75rem'),
                        display: 'block',
                        marginTop: getStyleValue('spacing.scale.1', '4px')
                      }}>
                        Mínimo 8 caracteres, debe incluir mayúscula, minúscula y número
                      </small>
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.formLabel}>Confirmar Nueva Contraseña</label>
                      <input
                        type="password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        style={styles.formControl}
                        required
                      />
                    </div>
                    
                    <div style={styles.buttonActions}>
                      <button
                        type="submit"
                        style={styles.buttonPrimary}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <i className="bi bi-arrow-clockwise me-2"></i>
                            Actualizando...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-lock me-2"></i>
                            Actualizar Contraseña
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Container>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: ${getStyleValue('breakpoints.md', '768px')}) {
          .container {
            padding-left: ${getStyleValue('spacing.scale.4', '16px')};
            padding-right: ${getStyleValue('spacing.scale.4', '16px')};
          }
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: ${getStyleValue('shadows.lg', '0 20px 25px -5px rgba(37, 99, 235, 0.2)')};
        }
        
        button:hover[style*="background: transparent"] {
          background-color: ${getStyleValue('colors.secondary.50', '#f0fdfc')} !important;
        }
        
        button:hover[style*="${getStyleValue('colors.semantic.info.main', '#2563eb')}"] {
          background-color: ${getStyleValue('colors.semantic.info.dark', '#1d4ed8')} !important;
        }
        
        input:focus {
          outline: none;
          border-color: ${getStyleValue('colors.semantic.info.main', '#2563eb')} !important;
          box-shadow: 0 0 0 3px ${getStyleValue('colors.semantic.info.light', '#eff6ff')} !important;
        }
        
        .nav-tab:hover {
          background-color: ${getStyleValue('colors.neutral.100', '#f5f5f4')} !important;
        }
      `}</style>
    </div>
  );
};

export default Perfil;