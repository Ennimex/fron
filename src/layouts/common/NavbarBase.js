// components/common/NavbarBase.js
import React, { useState, useEffect } from "react";
import { Navbar, Container, Button, Dropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import stylesGlobal from "../../styles/stylesGlobal";
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
  const [scrolled, setScrolled] = useState(false);

  // Detectar scroll para aplicar estilos
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    onLogout();
    setExpanded(false);
    // Redirigir a la página principal en lugar de login
    navigate("/", { replace: true });
  };

  const handleLoginClick = () => {
    navigate("/login", { state: { showLogin: true } });
    setExpanded(false);
  };

  // Estilos basados en stylesGlobal
  const navbarStyles = {
    navbar: {
      ...stylesGlobal.components.navbar.base,
      ...(scrolled ? stylesGlobal.components.navbar.scrolled : {}),
      borderBottom: scrolled ? 
        `1px solid ${stylesGlobal.colors.neutral[200]}` : 
        "1px solid transparent",
    },
    brand: {
      ...stylesGlobal.components.navbar.brand,
    },
    nav: {
      ...stylesGlobal.components.navbar.nav,
    },
    navItem: {
      ...stylesGlobal.components.navbar.navItem,
    },
    navLink: {
      ...stylesGlobal.components.navbar.navLink,
    },
    navLinkActive: {
      color: stylesGlobal.colors.primary[500],
      backgroundColor: stylesGlobal.colors.primary[50],
      fontWeight: 600,
    },
    actions: {
      ...stylesGlobal.components.navbar.actions,
    },
    mobileMenu: {
      ...stylesGlobal.components.navbar.mobileMenu,
      ...(expanded ? { transform: "translateY(0)", opacity: 1 } : {}),
    },
    hamburger: {
      ...stylesGlobal.components.navbar.hamburger,
    },
    hamburgerLine: {
      ...stylesGlobal.components.navbar.hamburgerLine,
    },
    loginButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.sm,
      border: "none",
      cursor: "pointer",
      whiteSpace: "nowrap",
    },
    dropdown: {
      border: "none",
      backgroundColor: "transparent",
      color: stylesGlobal.colors.text.primary,
      fontWeight: 500,
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    dropdownMenu: {
      border: `1px solid ${stylesGlobal.colors.neutral[200]}`,
      borderRadius: stylesGlobal.borders.radius.lg,
      boxShadow: stylesGlobal.shadows.lg,
      padding: "0.5rem",
    },
    dropdownItem: {
      borderRadius: stylesGlobal.borders.radius.md,
      padding: "8px 12px",
      transition: stylesGlobal.animations.transitions.base,
      "&:hover": {
        backgroundColor: stylesGlobal.colors.surface.secondary,
      },
    }
  };

  const navLinkStyle = ({ isActive }) => ({
    ...navbarStyles.navLink,
    ...(isActive ? navbarStyles.navLinkActive : {}),
  });

  return (
    <>
      <Navbar
        expanded={expanded}
        style={navbarStyles.navbar}
        className="px-0"
      >
        <Container fluid style={{ padding: "0 2rem" }}>
          {/* Brand */}
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={() => setExpanded(false)}
            style={navbarStyles.brand}
          >
            {brandName}
          </Navbar.Brand>

          {/* Desktop Navigation */}
          <div className="d-none d-lg-flex" style={navbarStyles.nav}>
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
          </div>

          {/* Actions */}
          <div style={navbarStyles.actions}>
            {isAuthenticated ? (
              <Dropdown align="end">
                <Dropdown.Toggle
                  variant="light"
                  id="dropdown-user"
                  style={navbarStyles.dropdown}
                >
                  <PersonCircle size={20} />
                  <span className="d-none d-sm-inline">
                    {user?.name || user?.email || "Usuario"}
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu style={navbarStyles.dropdownMenu}>
                  <Dropdown.Item
                    as={NavLink}
                    to="/perfil"
                    onClick={() => setExpanded(false)}
                    style={navbarStyles.dropdownItem}
                  >
                    <PersonCircle size={16} className="me-2" />
                    Mi perfil
                  </Dropdown.Item>
                  {user?.role === "admin" && (
                    <Dropdown.Item
                      as={NavLink}
                      to="/admin"
                      onClick={() => setExpanded(false)}
                      style={navbarStyles.dropdownItem}
                    >
                      <Gear size={16} className="me-2" />
                      Panel de administración
                    </Dropdown.Item>
                  )}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={handleLogout}
                    style={{
                      ...navbarStyles.dropdownItem,
                      color: stylesGlobal.colors.semantic.error.main,
                    }}
                  >
                    <BoxArrowRight size={16} className="me-2" />
                    Cerrar sesión
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <Button
                onClick={handleLoginClick}
                style={navbarStyles.loginButton}
              >
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="d-lg-none ms-2"
              style={{
                ...navbarStyles.hamburger,
                background: "none",
                border: "none",
                padding: "8px",
              }}
              onClick={() => setExpanded(!expanded)}
              aria-label="Toggle navigation"
            >
              <div style={navbarStyles.hamburgerLine}></div>
              <div style={navbarStyles.hamburgerLine}></div>
              <div style={navbarStyles.hamburgerLine}></div>
            </button>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Menu */}
      <div
        className="d-lg-none"
        style={navbarStyles.mobileMenu}
      >
        <Container>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "1rem 0",
          }}>
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  ...navbarStyles.navLink,
                  ...(isActive ? navbarStyles.navLinkActive : {}),
                  padding: "12px 16px",
                  width: "100%",
                })}
                onClick={() => setExpanded(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </Container>
      </div>
    </>
  );
};

export default NavbarBase;