// components/common/NavbarBase.js
import React, { useState } from "react";
import { Navbar, Container, Nav, Button, Dropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { colors } from "../../styles/styles";
import { PersonCircle, BoxArrowRight, Gear } from "react-bootstrap-icons";

const NavbarBase = ({ 
  isAuthenticated, 
  user, 
  onLogout, 
  brandName = "App",
  navLinks = [] 
}) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate("/login");
    setExpanded(false);
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { showLogin: true } });
    setExpanded(false);
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? colors.primaryDark : colors.primaryMedium,
    fontWeight: isActive ? "600" : "400",
    margin: "0 0.75rem",
    textDecoration: "none",
    transition: "color 0.2s ease",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  });

  return (
    <Navbar
      bg="light"
      expand="lg"
      expanded={expanded}
      className="py-2 border-bottom shadow-sm"
      sticky="top"
      style={{ backgroundColor: colors.lightBackground || "#f8f9fa" }}
    >
      <Container fluid className="px-3 px-md-4">
        <Navbar.Brand
          as={Link}
          to="/"
          className="fw-bold fs-4"
          onClick={() => setExpanded(false)}
          style={{ color: colors.primaryDark }}
        >
          {brandName}
        </Navbar.Brand>

        <div className="d-flex align-items-center order-lg-2 ms-auto">
          {isAuthenticated ? (
            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                id="dropdown-user"
                className="d-flex align-items-center gap-2 bg-transparent border-0"
                style={{
                  color: colors.primaryDark,
                  fontWeight: "500",
                  whiteSpace: "nowrap",
                }}
              >
                <PersonCircle size={20} />
                <span>{user?.name || "Usuario"}</span>
              </Dropdown.Toggle>

              <Dropdown.Menu className="shadow-sm border">
                <Dropdown.Item
                  as={NavLink}
                  to="/perfil"
                  onClick={() => setExpanded(false)}
                  className="d-flex align-items-center gap-2"
                >
                  <PersonCircle /> Mi perfil
                </Dropdown.Item>
                {user?.role === "admin" && (
                  <Dropdown.Item
                    as={NavLink}
                    to="/admin"
                    onClick={() => setExpanded(false)}
                    className="d-flex align-items-center gap-2"
                  >
                    <Gear /> Panel de administración
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item
                  onClick={handleLogout}
                  className="d-flex align-items-center gap-2 text-danger"
                >
                  <BoxArrowRight /> Cerrar sesión
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button
              onClick={handleLoginClick}
              style={{
                backgroundColor: colors.primaryDark,
                borderColor: colors.primaryDark,
                borderRadius: "20px",
                padding: "0.5rem 1.25rem",
                fontSize: "0.9rem",
                whiteSpace: "nowrap",
              }}
            >
              Iniciar Sesión
            </Button>
          )}

          <Navbar.Toggle
            aria-controls="navbar-nav"
            onClick={() => setExpanded(!expanded)}
            className="ms-2"
          />
        </div>

        <Navbar.Collapse id="navbar-nav" className="order-lg-1">
          <Nav className="me-auto">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={navLinkStyle}
                onClick={() => setExpanded(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarBase;