import React from "react";
import { Row, Col } from "react-bootstrap";
import stylesGlobal from "../../styles/stylesGlobal";

const Footer = () => {
    const footerStyles = {
        footer: {
            ...stylesGlobal.components.footer.base,
            ...stylesGlobal.components.footer.variants.luxury,
            padding: stylesGlobal.spacing.sections.md,
        },
        container: {
            maxWidth: stylesGlobal.utils.container.maxWidth.xl,
            margin: stylesGlobal.spacing.margins.auto,
            padding: "0 2rem",
        },
        brand: {
            ...stylesGlobal.components.footer.brand,
        },
        logo: {
            ...stylesGlobal.components.footer.logo,
        },
        logoIcon: {
            ...stylesGlobal.components.footer.logoIcon,
        },
        logoText: {
            ...stylesGlobal.components.footer.logoText,
        },
        description: {
            ...stylesGlobal.components.footer.description,
            marginTop: "1rem",
        },
        social: {
            ...stylesGlobal.components.footer.social,
        },
        socialLink: {
            ...stylesGlobal.components.footer.socialLink,
        },
        copyright: {
            ...stylesGlobal.components.footer.copyright,
            textAlign: "center",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: `1px solid ${stylesGlobal.colors.neutral[700]}`,
        }
    };

    const socialLinks = [
        { name: "Facebook", url: "https://facebook.com/laaterciopelada", icon: "📘" },
        { name: "Twitter", url: "https://twitter.com/laaterciopelada", icon: "🐦" },
        { name: "Instagram", url: "https://instagram.com/laaterciopelada", icon: "📷" }
    ];

    return (
        <footer style={footerStyles.footer}>
            <div style={footerStyles.container}>
                <Row className="align-items-start">
                    <Col md={6} lg={4}>
                        <div style={footerStyles.brand}>
                            <div style={footerStyles.logo}>
                                <div style={footerStyles.logoIcon}>
                                    LA
                                </div>
                                <span style={footerStyles.logoText}>La Aterciopelada</span>
                            </div>
                            <p style={footerStyles.description}>
                                Descubre la elegancia y calidad en cada prenda. 
                                Somos tu destino para la moda que refleja tu estilo único.
                            </p>
                        </div>
                    </Col>
                    
                    <Col md={6} lg={4} className="mt-4 mt-md-0">
                        <h5 style={{
                            ...stylesGlobal.components.footer.title,
                            marginBottom: "1rem"
                        }}>
                            Síguenos
                        </h5>
                        <div style={footerStyles.social}>
                            {socialLinks.map((network, index) => (
                                <a 
                                    key={index} 
                                    href={network.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={footerStyles.socialLink}
                                    title={network.name}
                                >
                                    {network.icon}
                                </a>
                            ))}
                        </div>
                    </Col>
                    
                    <Col lg={4} className="mt-4 mt-lg-0">
                        <h5 style={{
                            ...stylesGlobal.components.footer.title,
                            marginBottom: "1rem"
                        }}>
                            Contacto
                        </h5>
                        <div style={stylesGlobal.components.footer.contact}>
                            <div style={stylesGlobal.components.footer.contactItem}>
                                <span style={stylesGlobal.components.footer.contactIcon}>📍</span>
                                <span>México</span>
                            </div>
                            <div style={stylesGlobal.components.footer.contactItem}>
                                <span style={stylesGlobal.components.footer.contactIcon}>📧</span>
                                <span>info@laaterciopelada.com</span>
                            </div>
                        </div>
                    </Col>
                </Row>
                
                <div style={footerStyles.copyright}>
                    &copy; {new Date().getFullYear()} La Aterciopelada. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
