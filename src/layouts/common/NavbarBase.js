// components/common/NavbarBase.js
import React, { useState, useEffect } from "react";
import { Navbar, Container, Button, Dropdown } from "react-bootstrap";
import { Link, NavLink, useNavigate } from "react-router-dom";
import stylesGlobal from "../../styles/stylesGlobal";
import { PersonCircle, BoxArrowRight, Gear, List, X } from "react-bootstrap-icons";

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

  // Cerrar menú móvil cuando se hace resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) { // lg breakpoint
        setExpanded(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prevenir scroll del body cuando el menú móvil está abierto
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [expanded]);

  const handleLogout = () => {
    onLogout();
    setExpanded(false);
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
      display: "flex",
      alignItems: "center",
      gap: "8px", // Reducir el gap entre elementos
    },
    mobileActions: {
      display: "flex",
      alignItems: "center",
      gap: "4px", // Gap más pequeño en móviles
      marginLeft: "auto", // Empujar hacia la derecha
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
          <div className="d-flex align-items-center">
            {/* Desktop Actions */}
            <div className="d-none d-lg-flex" style={navbarStyles.actions}>
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
            </div>

            {/* Mobile Actions */}
            <div className="d-lg-none" style={navbarStyles.mobileActions}>
              {!isAuthenticated && (
                <Button
                  onClick={handleLoginClick}
                  style={{
                    ...navbarStyles.loginButton,
                    fontSize: "0.875rem",
                    padding: "6px 12px",
                  }}
                >
                  Iniciar Sesión
                </Button>
              )}
              
              {/* Mobile Menu Toggle */}
              <button
                style={{
                  background: "none",
                  border: "none",
                  padding: "6px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "6px",
                  transition: "all 0.3s ease",
                  color: "#524842",
                  minWidth: "40px",
                  minHeight: "40px",
                }}
                onClick={() => setExpanded(!expanded)}
                aria-label="Toggle navigation"
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(214, 51, 132, 0.1)";
                  e.target.style.color = "#d63384";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "transparent";
                  e.target.style.color = "#524842";
                }}
              >
                {expanded ? <X size={22} /> : <List size={22} />}
              </button>
            </div>
          </div>
        </Container>
      </Navbar>

      {/* Mobile Menu Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1040,
          display: expanded ? "block" : "none",
          transition: "opacity 300ms ease-in-out",
        }}
        onClick={() => setExpanded(false)}
      />

      {/* Mobile Menu */}
      <div
        className="d-lg-none"
        style={{
          position: "fixed",
          top: "72px",
          left: 0,
          right: 0,
          backgroundColor: "rgba(255, 255, 255, 0.98)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #ede9e6",
          boxShadow: "0 10px 15px -3px rgba(42, 36, 31, 0.1)",
          padding: "1rem",
          transform: expanded ? "translateY(0)" : "translateY(-100%)",
          opacity: expanded ? 1 : 0,
          transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          zIndex: 1050,
          visibility: expanded ? "visible" : "hidden",
        }}
      >
        <Container>
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            padding: "1rem 0",
          }}>
            {/* Navigation Links */}
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: isActive ? "#d63384" : "#524842",
                  backgroundColor: isActive ? "#fdf2f4" : "transparent",
                  textDecoration: "none",
                  borderRadius: "10px",
                  transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                  width: "100%",
                  "&:hover": {
                    color: "#d63384",
                    backgroundColor: "#fdf2f4",
                    transform: "translateY(-1px)",
                  },
                })}
                onClick={() => setExpanded(false)}
              >
                {link.label}
              </NavLink>
            ))}

            {/* User Actions for Mobile (when authenticated) */}
            {isAuthenticated && (
              <>
                <hr style={{ 
                  margin: "1rem 0", 
                  border: "none", 
                  borderTop: "1px solid #ede9e6" 
                }} />
                
                <div style={{ 
                  padding: "8px 16px", 
                  fontSize: "0.875rem", 
                  fontWeight: 600, 
                  color: "#6c757d",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px"
                }}>
                  {user?.name || user?.email || "Usuario"}
                </div>

                <NavLink
                  to="/perfil"
                  style={({ isActive }) => ({
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: isActive ? "#d63384" : "#524842",
                    backgroundColor: isActive ? "#fdf2f4" : "transparent",
                    textDecoration: "none",
                    borderRadius: "10px",
                    transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    width: "100%",
                  })}
                  onClick={() => setExpanded(false)}
                >
                  <PersonCircle size={16} />
                  Mi perfil
                </NavLink>

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    style={({ isActive }) => ({
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: isActive ? "#d63384" : "#524842",
                      backgroundColor: isActive ? "#fdf2f4" : "transparent",
                      textDecoration: "none",
                      borderRadius: "10px",
                      transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                      width: "100%",
                    })}
                    onClick={() => setExpanded(false)}
                  >
                    <Gear size={16} />
                    Panel de administración
                  </NavLink>
                )}

                <button
                  onClick={handleLogout}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "12px 16px",
                    fontSize: "1rem",
                    fontWeight: 500,
                    color: stylesGlobal.colors.semantic.error.main,
                    backgroundColor: "transparent",
                    border: "none",
                    textDecoration: "none",
                    borderRadius: "10px",
                    transition: "all 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  <BoxArrowRight size={16} />
                  Cerrar sesión
                </button>
              </>
            )}
          </div>
        </Container>
      </div>
    </>
  );
};

export default NavbarBase;