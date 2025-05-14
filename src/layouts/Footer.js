import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { colors } from "../styles/styles"; // Importa los colores desde la guía de estilos

const Footer = () => {
    return (
        <footer style={{ backgroundColor: colors.primaryDark, color: colors.white, padding: "20px 0" }}>
        <Container>
            <Row className="align-items-center">
            <Col md={6}>
                <p>&copy; {new Date().getFullYear()} JADA Company. Todos los derechos reservados.</p>
            </Col>
            <Col md={6} className="text-md-end">
                <p>Síguenos en:</p>
                {["Facebook", "Twitter", "Instagram"].map((network, index) => (
                <a key={index} href="hola" style={{ color: colors.white, marginRight: index < 2 ? "10px" : "0" }}>{network}</a>
                ))}
            </Col>
            </Row>
        </Container>
        </footer>
    );
};

export default Footer;
