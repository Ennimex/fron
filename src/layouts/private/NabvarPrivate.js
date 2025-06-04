import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../styles/styles";

const NavbarPrivate = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    // Add logout logic here (e.g., clear session, redirect to login)
    navigate("/login");
    setExpanded(false);
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
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold text-dark fs-4"
          onClick={() => setExpanded(false)}
          style={{ color: colors.primaryDark }}
        >
          JADA Company
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="navbar-nav" 
          onClick={() => setExpanded(!expanded)} 
        />

        <Navbar.Collapse id="navbar-nav">
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
              to="/contacto" 
              onClick={() => setExpanded(false)}
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              Contacto
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
          </Nav>

          <div className="d-flex align-items-center mt-3 mt-lg-0">
            <Button 
              as={Link} 
              to="/profile" 
              style={{ 
                backgroundColor: colors.primaryDark, 
                borderColor: colors.primaryDark,
                whiteSpace: "nowrap",
                borderRadius: "20px",
                marginLeft: "10px"
              }} 
              className="ms-2 px-3"
              onClick={() => setExpanded(false)}
            >
              Profile
            </Button>

            <Button 
              onClick={handleLogout}
              style={{ 
                backgroundColor: colors.primaryDark, 
                borderColor: colors.primaryDark,
                whiteSpace: "nowrap",
                borderRadius: "20px",
                marginLeft: "10px"
              }} 
              className="ms-2 px-3"
            >
              Logout
            </Button>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarPrivate;