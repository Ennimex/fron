import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button, Alert } from "react-bootstrap";

const Perfil = () => {
  // Estado inicial del usuario (simulado, en un caso real vendría de una API o contexto de autenticación)
  const [userInfo, setUserInfo] = useState({
    nombre: "Ana López",
    correo: "ana.lopez@example.com",
    direccion: "Calle Principal 123, Ciudad Danza, México",
    telefono: "555-123-4567",
  });

  // Estado para el formulario editable
  const [editInfo, setEditInfo] = useState({ ...userInfo });
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isVisible, setIsVisible] = useState({
    profile: false,
    password: false,
  });

  // Animaciones de entrada
  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, profile: true })), 100);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, password: true })), 500);
  }, []);

  // Manejar cambios en el formulario de información personal
  const handleInfoChange = (e) => {
    const { name, value } = e.target;
    setEditInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  // Guardar cambios de información personal
  const handleSaveInfo = () => {
    if (!editInfo.nombre || !editInfo.correo || !editInfo.direccion || !editInfo.telefono) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    setUserInfo({ ...editInfo });
    setEditMode(false);
    setError("");
    setSuccess("Información actualizada correctamente.");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Guardar cambios de contraseña
  const handleSavePassword = () => {
    if (!password.current || !password.new || !password.confirm) {
      setError("Por favor, completa todos los campos de contraseña.");
      return;
    }
    if (password.new !== password.confirm) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
    // Aquí iría la lógica para actualizar la contraseña en el backend
    setPassword({ current: "", new: "", confirm: "" });
    setError("");
    setSuccess("Contraseña actualizada correctamente.");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Cancelar edición
  const handleCancel = () => {
    setEditInfo({ ...userInfo });
    setEditMode(false);
    setError("");
  };

  // Estilos para animaciones (adaptados de Inicio.js)
  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-in {
      animation: fadeInUp 0.8s forwards;
    }
    .profile-card {
      transition: all 0.3s ease;
      border: none;
    }
    .profile-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    .pink-button {
      background-color: #FF6F61;
      border-color: #FF6F61;
      color: #FFF5F0;
      border-radius: 30px;
      padding: 10px 20px;
      font-weight: bold;
    }
    .pink-button:hover {
      background-color: #D83A56;
      border-color: #D83A56;
    }
  `;

  // Estilos personalizados (adaptados de Inicio.js)
  const customStyles = {
    profileSection: {
      backgroundImage: `linear-gradient(135deg, #FFE6E7 0%, #FFF5F0 100%)`,
      opacity: isVisible.profile ? 1 : 0,
      transform: isVisible.profile ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    passwordSection: {
      backgroundImage: `linear-gradient(135deg, #FFF5F0 0%, #FFE6E7 100%)`,
      opacity: isVisible.password ? 1 : 0,
      transform: isVisible.password ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    titleUnderline: {
      display: "block",
      width: "80px",
      height: "4px",
      backgroundColor: '#FF6F61',
      borderRadius: "2px",
      margin: "15px auto",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
  };

  return (
    <>
      <style>{animationStyles}</style>

      {/* Sección de Información Personal */}
      <section className="py-5" style={customStyles.profileSection}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">
              Mi Perfil
              <span style={customStyles.titleUnderline}></span>
            </h2>
            <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
              Administra tu información personal y mantén tus datos actualizados.
            </p>
          </div>

          {success && <Alert variant="success" className="animate-in">{success}</Alert>}
          {error && <Alert variant="danger" className="animate-in">{error}</Alert>}

          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="profile-card shadow animate-in">
                <Card.Body className="p-4">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre Completo</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={editInfo.nombre}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Correo Electrónico</Form.Label>
                      <Form.Control
                        type="email"
                        name="correo"
                        value={editInfo.correo}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Dirección</Form.Label>
                      <Form.Control
                        type="text"
                        name="direccion"
                        value={editInfo.direccion}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="text"
                        name="telefono"
                        value={editInfo.telefono}
                        onChange={handleInfoChange}
                        disabled={!editMode}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end gap-2 mt-4">
                      {editMode ? (
                        <>
                          <Button
                            variant="outline-secondary"
                            className="rounded-pill"
                            onClick={handleCancel}
                          >
                            Cancelar
                          </Button>
                          <Button
                            className="pink-button"
                            onClick={handleSaveInfo}
                          >
                            Guardar Cambios
                          </Button>
                        </>
                      ) : (
                        <Button
                          className="pink-button"
                          onClick={() => setEditMode(true)}
                        >
                          Editar Información
                        </Button>
                      )}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Sección de Cambio de Contraseña */}
      <section className="py-5" style={customStyles.passwordSection}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">
              Cambiar Contraseña
              <span style={customStyles.titleUnderline}></span>
            </h2>
            <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
              Actualiza tu contraseña para mantener tu cuenta segura.
            </p>
          </div>

          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="profile-card shadow animate-in">
                <Card.Body className="p-4">
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña Actual</Form.Label>
                      <Form.Control
                        type="password"
                        name="current"
                        value={password.current}
                        onChange={handlePasswordChange}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="new"
                        value={password.new}
                        onChange={handlePasswordChange}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Confirmar Nueva Contraseña</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirm"
                        value={password.confirm}
                        onChange={handlePasswordChange}
                        style={{ borderColor: '#FF6F61' }}
                      />
                    </Form.Group>

                    <div className="d-flex justify-content-end mt-4">
                      <Button
                        className="pink-button"
                        onClick={handleSavePassword}
                      >
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Perfil;