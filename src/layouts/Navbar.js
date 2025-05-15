import React, { useState } from "react";
import { Navbar, Container, Nav, Button, Form, FormControl, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { colors } from "../styles/styles"; // Importamos estilos

const NavbarComponent = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  // Categorías de productos para el menú desplegable
  const productCategories = [
    { name: "Domótica", slug: "domotica" },
    { name: "Seguridad", slug: "seguridad" },
    { name: "Energía", slug: "energia" },
    { name: "Climatización", slug: "climatizacion" }
  ];

  // Función para manejar la selección de categorías
  const handleCategorySelect = (categorySlug) => {
    navigate(`/productos?categoria=${categorySlug}`);
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
            
            {/* Menú desplegable de productos */}
            <NavDropdown 
              title="Productos" 
              id="products-dropdown"
              className="mx-2"
              style={{ color: colors.primaryMedium }}
            >
              <NavDropdown.Item 
                as={Link} 
                to="/productos" 
                onClick={() => setExpanded(false)}
              >
                Todos los productos
              </NavDropdown.Item>
              
              <NavDropdown.Divider />
              
              {productCategories.map((category) => (
                <NavDropdown.Item 
                  key={category.slug} 
                  onClick={() => handleCategorySelect(category.slug)}
                >
                  {category.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            
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

          {/* Barra de búsqueda y botón de inicio de sesión - alineados a la derecha */}
          <div className="d-flex align-items-center mt-3 mt-lg-0">
            {/* Barra de búsqueda */}
            <Form className="d-flex me-2" onSubmit={(e) => e.preventDefault()}>
              <FormControl 
                type="search" 
                placeholder="¿Qué estás buscando?" 
                className="me-2 rounded-pill"
                aria-label="Buscar"
                style={{ borderColor: `${colors.primaryLight}50` }}
              />
              <Button 
                style={{ 
                  backgroundColor: colors.primaryDark, 
                  borderColor: colors.primaryDark,
                  borderRadius: "20px",
                }}
                type="submit"
                className="rounded-pill px-3"
              >
                Buscar
              </Button>
            </Form>

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