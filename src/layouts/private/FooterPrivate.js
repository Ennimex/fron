import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { colors } from "../../styles/styles";

const Footer = () => {
    const textStyle = {
        color: "#Dark", // Cambiando a blanco puro para mejor visibilidad
        fontWeight: "500" // Agregando un poco más de peso a la fuente
    };

    return (
        <footer style={{ backgroundColor: colors.primaryDark, padding: "20px 0" }}>
        <Container>
            <Row className="align-items-center">
            <Col md={6}>
                <p style={textStyle}>&copy; {new Date().getFullYear()} JADA Company. Todos los derechos reservados.</p>
            </Col>
            <Col md={6} className="text-md-end">
                <p style={textStyle}>Síguenos en:</p>
                {["Facebook", "Twitter", "Instagram"].map((network, index) => (
                <a key={index} href="hola" style={{ ...textStyle, marginRight: index < 2 ? "10px" : "0" }}>{network}</a>
                ))}
            </Col>
            </Row>
        </Container>
        </footer>
    );
};

export default Footer;
