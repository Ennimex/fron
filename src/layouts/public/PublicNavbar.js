import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../../styles/styles";
import { useCart } from "../../context/CartContext";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const { cart } = useCart();

  const styles = {
    cartButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "20px",
      backgroundColor: colors.pinkBerry,
      color: colors.warmWhite,
      cursor: "pointer",
      position: "relative",
      border: "none",
      marginLeft: "10px",
    },
    cartBadge: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      backgroundColor: "#ffe607",
      color: colors.pinkBerry,
      borderRadius: "50%",
      width: "20px",
      height: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "bold",
    },
  };

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

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
          JADA Company
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

          {/* Botón del carrito y botón de inicio de sesión - alineados a la derecha */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {/* Botón del carrito */}
            <button
              style={styles.cartButton}
              onClick={() => {
                setExpanded(false);
                navigate("/carrito");
              }}
            >
              <i className="bi bi-cart"></i>
              {cart.length > 0 && (
                <span style={styles.cartBadge}>
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Botón de inicio de sesión */}
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
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarComponent;