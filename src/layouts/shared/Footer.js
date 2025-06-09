import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { colors } from "../../styles/styles";

const Footer = () => {
    const styles = {
        footer: {
            backgroundColor: colors.primaryDark,
            padding: "20px 0",
            color: colors.white
        },
        text: {
            color: colors.white,
            fontWeight: "500"
        },
        socialLink: {
            color: colors.white,
            marginRight: "10px",
            textDecoration: "none",
            transition: "opacity 0.3s ease",
            "&:hover": {
                opacity: 0.8
            }
        }
    };

    const socialLinks = [
        { name: "Facebook", url: "https://facebook.com/laaterciopelada" },
        { name: "Twitter", url: "https://twitter.com/laaterciopelada" },
        { name: "Instagram", url: "https://instagram.com/laaterciopelada" }
    ];

    return (
        <footer style={styles.footer}>
            <Container>
                <Row className="align-items-center">
                    <Col md={6}>
                        <p style={styles.text}>&copy; {new Date().getFullYear()} La Aterciopelada. Todos los derechos reservados.</p>
                    </Col>
                    <Col md={6} className="text-md-end">
                        <p style={styles.text}>Síguenos en:</p>
                        {socialLinks.map((network, index) => (
                            <a 
                                key={index} 
                                href={network.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    ...styles.socialLink,
                                    marginRight: index < socialLinks.length - 1 ? "10px" : "0"
                                }}
                            >
                                {network.name}
                            </a>
                        ))}
                    </Col>
                </Row>
            </Container>
        </footer>
    );
};

export default Footer;
