import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";

const Perfil = () => {
  // Estado inicial del usuario (simulado)
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
  const [isVisible, setIsVisible] = useState(false);
  const [isProfileForm, setIsProfileForm] = useState(true); // Toggle between profile and password forms

  // Animación de entrada
  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
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
  const handleSaveInfo = (e) => {
    e.preventDefault();
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
  const handleSavePassword = (e) => {
    e.preventDefault();
    if (!password.current || !password.new || !password.confirm) {
      setError("Por favor, completa todos los campos de contraseña.");
      return;
    }
    if (password.new !== password.confirm) {
      setError("La nueva contraseña y la confirmación no coinciden.");
      return;
    }
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

  // Cambiar entre formularios
  const toggleForm = () => {
    setIsProfileForm(!isProfileForm);
    setError("");
    setSuccess("");
    setPassword({ current: "", new: "", confirm: "" });
    setEditMode(false);
  };

  // Estilos para animaciones y diseño
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
      border-radius: 16px;
      overflow: hidden;
    }
    .profile-card:hover {
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
    .form-slider {
      display: flex;
      width: 200%;
      transition: transform 0.6s ease-in-out;
      transform: ${isProfileForm ? 'translateX(0)' : 'translateX(-50%)'};
      height: 100%;
    }
    .form-panel {
      width: 50%;
      padding: 20px;
      flex-shrink: 0;
    }
    .toggle-button {
      color: #FF6F61;
      text-decoration: none;
      font-weight: 600;
      cursor: pointer;
      display: inline-block;
      margin-top: 1rem;
    }
    .toggle-button:hover {
      color: #D83A56;
      text-decoration: underline;
    }
  `;

  const customStyles = {
    profileSection: {
      backgroundImage: `linear-gradient(135deg, #FFE6E7 0%, #FFF5F0 100%)`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      minHeight: "100vh",
      padding: "40px 0",
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

      {/* Sección Combinada de Perfil y Contraseña */}
      <section style={customStyles.profileSection}>
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">
              Mi Perfil
              <span style={customStyles.titleUnderline}></span>
            </h2>
            <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
              Administra tu información personal y contraseña en un solo lugar.
            </p>
          </div>

          {success && <Alert variant="success" className="animate-in">{success}</Alert>}
          {error && <Alert variant="danger" className="animate-in">{error}</Alert>}

          <Row className="justify-content-center">
            <Col md={8} lg={6}>
              <Card className="profile-card shadow animate-in">
                <Card.Body>
                  <div className="form-slider">
                    {/* Panel de Información Personal */}
                    <div className="form-panel">
                      <h3 className="text-center mb-4">Información Personal</h3>
                      <form onSubmit={handleSaveInfo}>
                        <div className="mb-3">
                          <label className="form-label">Nombre Completo</label>
                          <input
                            type="text"
                            name="nombre"
                            value={editInfo.nombre}
                            onChange={handleInfoChange}
                            disabled={!editMode}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Correo Electrónico</label>
                          <input
                            type="email"
                            name="correo"
                            value={editInfo.correo}
                            onChange={handleInfoChange}
                            disabled={!editMode}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Dirección</label>
                          <input
                            type="text"
                            name="direccion"
                            value={editInfo.direccion}
                            onChange={handleInfoChange}
                            disabled={!editMode}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Teléfono</label>
                          <input
                            type="text"
                            name="telefono"
                            value={editInfo.telefono}
                            onChange={handleInfoChange}
                            disabled={!editMode}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

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
                                type="submit"
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
                      </form>
                      <div className="text-center mt-4">
                        <span
                          className="toggle-button"
                          onClick={toggleForm}
                        >
                          Cambiar a Contraseña
                        </span>
                      </div>
                    </div>

                    {/* Panel de Cambio de Contraseña */}
                    <div className="form-panel">
                      <h3 className="text-center mb-4">Cambiar Contraseña</h3>
                      <form onSubmit={handleSavePassword}>
                        <div className="mb-3">
                          <label className="form-label">Contraseña Actual</label>
                          <input
                            type="password"
                            name="current"
                            value={password.current}
                            onChange={handlePasswordChange}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Nueva Contraseña</label>
                          <input
                            type="password"
                            name="new"
                            value={password.new}
                            onChange={handlePasswordChange}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Confirmar Nueva Contraseña</label>
                          <input
                            type="password"
                            name="confirm"
                            value={password.confirm}
                            onChange={handlePasswordChange}
                            className="form-control"
                            style={{ borderColor: '#FF6F61' }}
                          />
                        </div>

                        <div className="d-flex justify-content-end mt-4">
                          <Button
                            className="pink-button"
                            type="submit"
                          >
                            Actualizar Contraseña
                          </Button>
                        </div>
                      </form>
                      <div className="text-center mt-4">
                        <span
                          className="toggle-button"
                          onClick={toggleForm}
                        >
                          Cambiar a Información Personal
                        </span>
                      </div>
                    </div>
                  </div> {/* Cierra .form-slider */}
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