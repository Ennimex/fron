import React, { useState } from "react";
import { Navbar, Container, Nav, Button, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../styles/styles";
import { useAuth } from "../../context/AuthContext"; // Añadir useAuth

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { user, logout } = useAuth(); // Añadir useAuth

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Navbar
      bg="light"
      expand="lg"
      expanded={expanded}
      className="py-2 border-bottom shadow-sm"
      sticky="top"
    >
      <Container fluid className="px-4">
        {/* Logo de la empresa */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold text-dark fs-4"
          onClick={() => setExpanded(false)}
          style={{ color: colors.primaryDark }}
        >
          La Aterciopelada
        </Navbar.Brand>

        {/* Botón de toggle para móviles */}
        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          onClick={() => setExpanded(!expanded)} 
        />

        {/* Contenido del navbar colapsable */}
        <Navbar.Collapse id="navbar-nav">
          {/* Enlaces principales - centrados */}
          <Nav className="mx-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Inicio
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/productos" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Productos
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/servicios" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Servicios
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/nosotros" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Nosotros
            </Nav.Link>

            <Nav.Link 
              as={Link} 
              to="/galeria" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Galería
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/contacto" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Contacto
            </Nav.Link>
          </Nav>

          {/* Botón de inicio de sesión o dropdown de usuario */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {user?.isAuthenticated ? (
              <NavDropdown 
                title={user.name}
                className="ms-2"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/perfil">Mi Perfil</NavDropdown.Item>
                {user.role === 'ADMIN' && (
                  <NavDropdown.Item as={Link} to="/admin">Dashboard Admin</NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar Sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button 
                as={Link} 
                to="/login" 
                style={{ 
                  backgroundColor: colors.primaryDark, 
                  borderColor: colors.primaryDark,
                  whiteSpace: "nowrap",
                  borderRadius: "20px"
                }} 
                className="ms-2 px-3"
                onClick={() => setExpanded(false)}
              >
                Iniciar Sesión
              </Button>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;