/**
 * Componente Perfil - La Aterciopelada
 * Página de perfil de usuario con gestión de información personal y contraseñas
 * 
 * Actualizado para usar el nuevo sistema de estilos stylesGlobal.js
 * Siguiendo el patrón de diseño establecido en Nosotros.js
 * 
 * Características:
 * - Sistema de estilos modular y elegante
 * - Diseño responsivo con animaciones fluidas
 * - Paleta de colores consistente (rosa elegante, verde salvia, dorado champagne)
 * - Tipografía mejorada con jerarquía clara
 * - Componentes reutilizables de botones, inputs y cards
 * 
 * @version 2.0
 * @fecha 2025-01-03
 */

import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { profileService } from "../../services/profileService";
import stylesPublic from "../../styles/stylesGlobal";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const Perfil = () => {
  const { user } = useAuth();
  
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

  // Styles following Nosotros.js pattern with stylesGlobal
  const containerStyle = {
    maxWidth: stylesPublic.utils.container.maxWidth.xl,
    margin: stylesPublic.spacing.margins.auto,
    padding: `0 ${stylesPublic.spacing.scale[4]}`,
  }

  const styles = {
    pageContainer: {
      background: stylesPublic.colors.gradients.warm,
      minHeight: "100vh",
      fontFamily: stylesPublic.typography.families.body,
    },
    heroSection: {
      background: stylesPublic.colors.gradients.secondary,
      padding: `${stylesPublic.spacing.scale[20]} 0 ${stylesPublic.spacing.scale[16]}`,
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: stylesPublic.animations.transitions.elegant,
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
      ...stylesPublic.typography.headings.h1,
      color: stylesPublic.colors.text.inverse,
      marginBottom: stylesPublic.spacing.scale[8],
      textShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    subtitle: {
      ...stylesPublic.typography.body.large,
      color: stylesPublic.colors.text.inverse,
      marginBottom: stylesPublic.spacing.scale[4],
      maxWidth: "800px",
      margin: "0 auto",
      opacity: 0.95,
      padding: `0 ${stylesPublic.spacing.scale[4]}`,
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
      margin: `${stylesPublic.spacing.scale[16]} auto 0`,
      padding: stylesPublic.spacing.scale[12],
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.xl,
      boxShadow: stylesPublic.shadows.xl,
      opacity: isVisible.form ? 1 : 0,
      transform: isVisible.form ? "translateY(0)" : "translateY(20px)",
      transition: stylesPublic.animations.transitions.elegant,
      position: "relative",
      zIndex: 2,
      marginTop: `-${stylesPublic.spacing.scale[16]}`,
    },
    sidebarContainer: {
      backgroundColor: stylesPublic.colors.surface.secondary,
      padding: stylesPublic.spacing.scale[12],
      borderRadius: stylesPublic.borders.radius.lg,
      border: `1px solid ${stylesPublic.borders.colors.default}`,
      height: "fit-content",
    },
    avatarContainer: {
      width: "120px",
      height: "120px",
      margin: "0 auto",
      borderRadius: "50%",
      background: stylesPublic.colors.gradients.secondary,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: stylesPublic.colors.text.inverse,
      fontSize: stylesPublic.typography.scale["3xl"],
      fontWeight: stylesPublic.typography.weights.bold,
      fontFamily: stylesPublic.typography.families.body,
      boxShadow: stylesPublic.shadows.brand.secondary,
      marginBottom: stylesPublic.spacing.scale[8],
      lineHeight: 1,
      letterSpacing: "0.1em",
    },
    userInfo: {
      textAlign: "center",
      marginBottom: stylesPublic.spacing.scale[12],
    },
    userName: {
      ...stylesPublic.typography.headings.h5,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[1],
    },
    userEmail: {
      ...stylesPublic.typography.body.small,
      color: stylesPublic.colors.text.tertiary,
      marginBottom: 0,
    },
    navTabs: {
      display: "flex",
      flexDirection: "column",
      gap: stylesPublic.spacing.scale[2],
    },
    navTab: {
      ...stylesPublic.components.button.sizes.base,
      ...stylesPublic.components.button.variants.ghost,
      textAlign: "left",
      display: "flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[2],
      justifyContent: "flex-start",
    },
    navTabActive: {
      ...stylesPublic.components.button.variants.primary,
      transform: "translateX(4px)",
    },
    formContainer: {
      backgroundColor: stylesPublic.colors.surface.primary,
      padding: stylesPublic.spacing.scale[12],
      borderRadius: stylesPublic.borders.radius.lg,
      border: `1px solid ${stylesPublic.borders.colors.default}`,
    },
    formGroup: {
      marginBottom: stylesPublic.spacing.scale[8],
    },
    formLabel: {
      ...stylesPublic.typography.body.small,
      fontWeight: stylesPublic.typography.weights.semibold,
      color: stylesPublic.colors.secondary[600],
      marginBottom: stylesPublic.spacing.scale[2],
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    },
    formControl: {
      ...stylesPublic.components.input.base,
    },
    formControlFocus: {
      ...stylesPublic.components.input.base,
      border: `1px solid ${stylesPublic.colors.primary[500]}`,
      boxShadow: `0 0 0 3px ${stylesPublic.colors.primary[100]}`,
      backgroundColor: stylesPublic.colors.surface.primary,
    },
    buttonPrimary: {
      ...stylesPublic.components.button.sizes.base,
      ...stylesPublic.components.button.variants.primary,
    },
    buttonSecondary: {
      ...stylesPublic.components.button.sizes.base,
      ...stylesPublic.components.button.variants.secondary,
    },
    buttonActions: {
      display: "flex",
      gap: stylesPublic.spacing.scale[4],
      justifyContent: "flex-end",
      marginTop: stylesPublic.spacing.scale[8],
    },
    alert: {
      ...stylesPublic.components.card.base,
      padding: stylesPublic.spacing.scale[6],
      marginBottom: stylesPublic.spacing.scale[6],
      display: "flex",
      alignItems: "center",
      gap: stylesPublic.spacing.scale[2],
      fontSize: stylesPublic.typography.scale.base,
      fontFamily: stylesPublic.typography.families.body,
    },
    alertSuccess: {
      backgroundColor: stylesPublic.colors.semantic.success.light,
      color: stylesPublic.colors.semantic.success.dark,
      border: `1px solid ${stylesPublic.colors.semantic.success.main}`,
    },
    alertError: {
      backgroundColor: stylesPublic.colors.semantic.error.light,
      color: stylesPublic.colors.semantic.error.dark,
      border: `1px solid ${stylesPublic.colors.semantic.error.main}`,
    },
    loadingContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      gap: stylesPublic.spacing.scale[6],
    },
    loadingSpinner: {
      width: "48px",
      height: "48px",
      border: `4px solid ${stylesPublic.colors.neutral[300]}`,
      borderTop: `4px solid ${stylesPublic.colors.primary[500]}`,
      borderRadius: "50%",
      animation: "spin 1s linear infinite",
    },
    loadingText: {
      ...stylesPublic.typography.body.large,
      color: stylesPublic.colors.text.tertiary,
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
      <Container style={containerStyle}>
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
                        color: stylesPublic.colors.text.tertiary,
                        fontSize: stylesPublic.typography.scale.xs,
                        display: 'block',
                        marginTop: stylesPublic.spacing.scale[1]
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
        
        @media (max-width: ${stylesPublic.breakpoints.md}) {
          .container {
            padding-left: ${stylesPublic.spacing.scale[4]};
            padding-right: ${stylesPublic.spacing.scale[4]};
          }
        }
        
        button:hover {
          transform: translateY(-2px);
          box-shadow: ${stylesPublic.shadows.lg};
        }
        
        button:hover[style*="background: transparent"] {
          background-color: ${stylesPublic.colors.surface.secondary} !important;
        }
        
        button:hover[style*="${stylesPublic.colors.primary[500]}"] {
          background-color: ${stylesPublic.colors.primary[600]} !important;
        }
        
        input:focus {
          outline: none;
          border: 1px solid ${stylesPublic.colors.primary[500]} !important;
          box-shadow: 0 0 0 3px ${stylesPublic.colors.primary[100]} !important;
        }
        
        button:hover:not([style*="${stylesPublic.colors.primary[500]}"]) {
          background-color: ${stylesPublic.colors.surface.tertiary} !important;
        }
      `}</style>
    </div>
  );
};

export default Perfil;