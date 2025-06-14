import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, Alert, Image } from "react-bootstrap";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const Perfil = () => {
  // State for user information
  const [userInfo, setUserInfo] = useState({
    nombre: "Ana López",
    correo: "ana.lopez@example.com",
    direccion: "Calle Principal 123, Ciudad Danza, México",
    telefono: "555-123-4567",
    avatar: "/default-avatar.png",
  });

  // State for form editing
  const [editInfo, setEditInfo] = useState({ ...userInfo });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("info"); // "info" or "password"
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    form: false,
    cta: false,
  });
  const [avatarPreview, setAvatarPreview] = useState(userInfo.avatar);

  // Animation trigger on mount
  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, form: true })), 300);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, cta: true })), 600);
  }, []);

  // Handle changes in personal info form
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.match("image.*")) {
      setError("Por favor, selecciona una imagen válida (PNG, JPG).");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setError("La imagen no debe exceder los 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
      setEditInfo((prev) => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle changes in password form
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Save personal info changes
  const handleSaveInfo = async (e) => {
    e.preventDefault();
    if (!editInfo.nombre || !editInfo.correo || !editInfo.direccion || !editInfo.telefono) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      setUserInfo({ ...editInfo });
      setEditMode(false);
      setSuccess("Información actualizada correctamente.");
      setIsLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  // Save password changes
  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (!password.current || !password.new || !password.confirm) {
      setError("Por favor, completa todos los campos de contraseña.");
      return;
    }

    if (password.new !== password.confirm) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }

    setIsLoading(true);
    setError("");
    // Simulate API call
    setTimeout(() => {
      setPassword({ current: "", new: "", confirm: "" });
      setSuccess("Contraseña actualizada correctamente.");
      setIsLoading(false);
      setTimeout(() => setSuccess(""), 3000);
    }, 1000);
  };

  // Cancel editing
  const handleCancel = () => {
    setEditInfo({ ...userInfo });
    setAvatarPreview(userInfo.avatar);
    setEditMode(false);
    setError("");
  };

  // Styles inspired by ProductoDetalle.js
  const customStyles = {
    pageContainer: {
      backgroundColor: "#F5E8C7",
      minHeight: "100vh",
    },
    heroSection: {
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
      padding: "80px 0 40px",
      position: "relative",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(30px)",
      transition: "all 1.2s ease-out",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="floral-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="15" cy="15" r="1.5" fill="%23ff0070" opacity="0.45"/><circle cx="35" cy="25" r="1" fill="%231f8a80" opacity="0.4"/><circle cx="25" cy="35" r="1.2" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23floral-pattern)"/></svg>')`,
      opacity: 0.8,
      zIndex: 1,
    },
    profileContainer: {
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px 20px",
      backgroundColor: "#ffffff",
      borderRadius: "15px",
      boxShadow: "0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15), 0 2px 4px rgba(44, 35, 41, 0.12)",
      opacity: isVisible.form ? 1 : 0,
      transform: isVisible.form ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      zIndex: 2,
    },
    avatarContainer: {
      position: "relative",
      width: "120px",
      height: "120px",
      margin: "0 auto",
      borderRadius: "50%",
      overflow: "hidden",
      boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
      transition: "all 0.3s ease",
    },
    avatar: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    avatarOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#ffffff",
      fontSize: "0.9rem",
      opacity: 0,
      transition: "opacity 0.3s ease",
    },
    title: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(2rem, 4vw, 2.8rem)",
      fontWeight: 600,
      color: "#23102d",
      marginBottom: "1.5rem",
      textAlign: "center",
    },
    subtitle: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1.1rem",
      color: "#403a3c",
      lineHeight: "1.7",
      marginBottom: "2rem",
      textAlign: "center",
      maxWidth: "700px",
      margin: "0 auto",
    },
    navContainer: {
      backgroundColor: "#FFF8E1",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
      borderLeft: "3px solid #ff4060",
      marginBottom: "2rem",
    },
    navLink: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1rem",
      color: "#403a3c",
      padding: "10px 15px",
      borderRadius: "8px",
      transition: "all 0.3s ease",
      cursor: "pointer",
    },
    navLinkActive: {
      backgroundColor: "#ff8090",
      color: "#ffffff",
      fontWeight: "bold",
    },
    formGroup: {
      marginBottom: "1.5rem",
    },
    formLabel: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "0.9rem",
      fontWeight: "bold",
      color: "#1f8a80",
      marginBottom: "0.5rem",
      textTransform: "uppercase",
    },
    formControl: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1rem",
      color: "#403a3c",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ff8090",
      backgroundColor: "#FFF8E1",
      transition: "all 0.3s ease",
    },
    buttonPrimary: {
      backgroundColor: "#ff4060",
      borderColor: "#ff4060",
      borderRadius: "30px",
      padding: "12px 30px",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "500",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
    },
    buttonSecondary: {
      backgroundColor: "transparent",
      borderColor: "#ff8090",
      color: "#ff4060",
      borderRadius: "30px",
      padding: "12px 30px",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: "500",
      fontSize: "1.1rem",
      transition: "all 0.3s ease",
    },
    ctaSection: {
      background: `linear-gradient(135deg, #ff8090 0%, #1f8a80 100%)`,
      padding: "40px 20px",
      borderRadius: "15px",
      marginTop: "40px",
      textAlign: "center",
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    ctaOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 30% 40%, #FFF8E1 0%, rgba(245,232,199,0) 50%)`,
      zIndex: 1,
    },
    alert: {
      fontFamily: "'Roboto', sans-serif",
      fontSize: "1rem",
      borderRadius: "12px",
      padding: "15px",
      marginBottom: "1.5rem",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
  };

  return (
    <div style={customStyles.pageContainer}>
      {/* Hero Section */}
      <section style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container>
          <h1 style={customStyles.title}>Mi Perfil</h1>
          <p style={customStyles.subtitle}>
            Administra tu información personal y configuración de seguridad con facilidad.
          </p>
        </Container>
      </section>

      {/* Profile Content */}
      <Container style={{ position: "relative", zIndex: 2 }}>
        <div style={customStyles.profileContainer}>
          {success && (
            <Alert variant="success" style={customStyles.alert}>
              <FaCheckCircle /> {success}
            </Alert>
          )}
          {error && (
            <Alert variant="danger" style={customStyles.alert}>
              <FaExclamationTriangle /> {error}
            </Alert>
          )}

          <Row>
            {/* Sidebar Navigation */}
            <Col md={4} className="mb-4">
              <div style={customStyles.navContainer}>
                <div style={customStyles.avatarContainer}>
                  <Image
                    src={avatarPreview}
                    alt="User Avatar"
                    style={customStyles.avatar}
                  />
                  {editMode && activeTab === "info" && (
                    <div style={{ ...customStyles.avatarOverlay, opacity: 1 }}>
                      Cambiar
                    </div>
                  )}
                  {editMode && activeTab === "info" && (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        opacity: 0,
                        cursor: "pointer",
                      }}
                    />
                  )}
                </div>
                <h5
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "1.2rem",
                    color: "#23102d",
                    textAlign: "center",
                    margin: "1rem 0 0.5rem",
                  }}
                >
                  {userInfo.nombre}
                </h5>
                <p
                  style={{
                    fontFamily: "'Roboto', sans-serif",
                    fontSize: "0.9rem",
                    color: "#403a3c",
                    textAlign: "center",
                    marginBottom: "2rem",
                  }}
                >
                  {userInfo.correo}
                </p>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      ...customStyles.navLink,
                      ...(activeTab === "info" ? customStyles.navLinkActive : {}),
                    }}
                    onClick={() => setActiveTab("info")}
                  >
                    <i className="bi bi-person me-2"></i> Información Personal
                  </div>
                  <div
                    style={{
                      ...customStyles.navLink,
                      ...(activeTab === "password" ? customStyles.navLinkActive : {}),
                    }}
                    onClick={() => setActiveTab("password")}
                  >
                    <i className="bi bi-lock me-2"></i> Cambiar Contraseña
                  </div>
                </div>
              </div>
            </Col>

            {/* Main Content */}
            <Col md={8}>
              {activeTab === "info" && (
                <Form onSubmit={handleSaveInfo}>
                  <Row>
                    <Col md={6}>
                      <Form.Group style={customStyles.formGroup}>
                        <Form.Label style={customStyles.formLabel}>Nombre Completo</Form.Label>
                        <Form.Control
                          type="text"
                          name="nombre"
                          value={editInfo.nombre}
                          onChange={handleInfoChange}
                          disabled={!editMode || isLoading}
                          style={customStyles.formControl}
                          isInvalid={editMode && !editInfo.nombre}
                        />
                        <Form.Control.Feedback type="invalid">
                          Este campo es requerido.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group style={customStyles.formGroup}>
                        <Form.Label style={customStyles.formLabel}>Correo Electrónico</Form.Label>
                        <Form.Control
                          type="email"
                          name="correo"
                          value={editInfo.correo}
                          onChange={handleInfoChange}
                          disabled={!editMode || isLoading}
                          style={customStyles.formControl}
                          isInvalid={editMode && !editInfo.correo}
                        />
                        <Form.Control.Feedback type="invalid">
                          Este campo es requerido.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group style={customStyles.formGroup}>
                        <Form.Label style={customStyles.formLabel}>Dirección</Form.Label>
                        <Form.Control
                          type="text"
                          name="direccion"
                          value={editInfo.direccion}
                          onChange={handleInfoChange}
                          disabled={!editMode || isLoading}
                          style={customStyles.formControl}
                          isInvalid={editMode && !editInfo.direccion}
                        />
                        <Form.Control.Feedback type="invalid">
                          Este campo es requerido.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group style={customStyles.formGroup}>
                        <Form.Label style={customStyles.formLabel}>Teléfono</Form.Label>
                        <Form.Control
                          type="text"
                          name="telefono"
                          value={editInfo.telefono}
                          onChange={handleInfoChange}
                          disabled={!editMode || isLoading}
                          style={customStyles.formControl}
                          isInvalid={editMode && !editInfo.telefono}
                        />
                        <Form.Control.Feedback type="invalid">
                          Este campo es requerido.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
                    {editMode ? (
                      <>
                        <Button
                          style={customStyles.buttonSecondary}
                          onClick={handleCancel}
                          disabled={isLoading}
                        >
                          Cancelar
                        </Button>
                        <Button
                          style={customStyles.buttonPrimary}
                          type="submit"
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
                        </Button>
                      </>
                    ) : (
                      <Button
                        style={customStyles.buttonPrimary}
                        onClick={() => setEditMode(true)}
                      >
                        <i className="bi bi-pencil me-2"></i>
                        Editar Información
                      </Button>
                    )}
                  </div>
                </Form>
              )}

              {activeTab === "password" && (
                <Form onSubmit={handleSavePassword}>
                  <Form.Group style={customStyles.formGroup}>
                    <Form.Label style={customStyles.formLabel}>Contraseña Actual</Form.Label>
                    <Form.Control
                      type="password"
                      name="current"
                      value={password.current}
                      onChange={handlePasswordChange}
                      style={customStyles.formControl}
                      isInvalid={!password.current && error}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es requerido.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group style={customStyles.formGroup}>
                    <Form.Label style={customStyles.formLabel}>Nueva Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="new"
                      value={password.new}
                      onChange={handlePasswordChange}
                      style={customStyles.formControl}
                      isInvalid={!password.new && error}
                    />
                    <Form.Control.Feedback type="invalid">
                      Este campo es requerido.
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group style={customStyles.formGroup}>
                    <Form.Label style={customStyles.formLabel}>Confirmar Nueva Contraseña</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirm"
                      value={password.confirm}
                      onChange={handlePasswordChange}
                      style={customStyles.formControl}
                      isInvalid={
                        (!password.confirm && error) ||
                        (password.new !== password.confirm && password.confirm)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {password.new !== password.confirm
                        ? "Las contraseñas no coinciden."
                        : "Este campo es requerido."}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                      style={customStyles.buttonPrimary}
                      type="submit"
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
                    </Button>
                  </div>
                </Form>
              )}
            </Col>
          </Row>
        </div>

        {/* CTA Section */}
        <div style={customStyles.ctaSection}>
          <div style={customStyles.ctaOverlay}></div>
          <Container style={{ position: "relative", zIndex: 2 }}>
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                fontWeight: 600,
                color: "#ffffff",
                marginBottom: "1rem",
              }}
            >
              Personaliza tu experiencia
            </h2>
            <p
              style={{
                fontFamily: "'Roboto', sans-serif",
                fontSize: "1.1rem",
                color: "#ffffff",
                maxWidth: "700px",
                margin: "0 auto 2rem",
                opacity: 0.9,
              }}
            >
              Configura tu perfil a tu gusto y descubre todas las opciones disponibles para ti.
            </p>
            <Button
              variant="outline-light"
              size="lg"
              style={{
                borderRadius: "30px",
                padding: "12px 30px",
                fontFamily: "'Roboto', sans-serif",
                fontWeight: "500",
                fontSize: "1.1rem",
              }}
            >
              <i className="bi bi-chat-square-text me-2"></i>
              Contáctanos para más información
            </Button>
          </Container>
        </div>
      </Container>
    </div>
  );
};

export default Perfil;