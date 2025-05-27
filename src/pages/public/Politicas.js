import { useState, useEffect } from "react";
import { Container, Tabs, Tab, Card, Row, Col } from "react-bootstrap";

const Politicas = () => {
  const [isVisible, setIsVisible] = useState({
    hero: false,
    politicas: false,
  });

  useEffect(() => {
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, politicas: true })), 500);
  }, []);

  const customStyles = {
    heroSection: {
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.85), rgba(44, 107, 62, 0.9)), url('https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
    },
    politicasSection: {
      background: "#FFFDF7",
      opacity: isVisible.politicas ? 1 : 0,
      transform: isVisible.politicas ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
    },
    titleUnderline: {
      width: "80px",
      height: "4px",
      backgroundColor: '#A91B0D',
      borderRadius: "2px",
      margin: "15px auto",
    },
  };

  const politicasEmpresa = (
    <div>
      <h3 className="fw-bold" style={{ color: '#A91B0D' }}>Políticas de la Empresa</h3>
      <p className="text-muted">
        En <strong>HuastecaArte</strong>, promovemos la identidad cultural mediante productos que reflejan tradición y autenticidad.
      </p>
      <ul>
        <li><strong>Productos auténticos:</strong> Cada prenda y accesorio es artesanal y refleja la cultura huasteca.</li>
        <li><strong>Compromiso ético:</strong> Trabajamos en conjunto con comunidades originarias bajo principios de comercio justo.</li>
        <li><strong>Innovación cultural:</strong> Modernizamos el acceso a la tradición sin perder su esencia.</li>
        <li><strong>Sustentabilidad:</strong> Utilizamos empaques ecológicos y procesos que respetan el ambiente.</li>
      </ul>
    </div>
  );

  const politicasPrivacidad = (
    <div>
      <h3 className="fw-bold" style={{ color: '#A91B0D' }}>Políticas de Privacidad</h3>
      <p className="text-muted">Tu información está segura con nosotros. Protegemos tus datos con responsabilidad.</p>
      <ul>
        <li><strong>Datos mínimos:</strong> Solo pedimos lo necesario para completar tu compra y mejorar tu experiencia.</li>
        <li><strong>Protección avanzada:</strong> Aplicamos cifrado SSL en todo momento.</li>
        <li><strong>Transparencia:</strong> Siempre podrás saber qué datos tenemos y cómo los usamos.</li>
        <li><strong>Derecho al olvido:</strong> Podés solicitarnos eliminar tu cuenta y datos cuando quieras.</li>
      </ul>
    </div>
  );

  const politicasCliente = (
    <div>
      <h3 className="fw-bold" style={{ color: '#A91B0D' }}>Políticas del Cliente</h3>
      <p className="text-muted">Queremos que tu experiencia sea única. Estas son nuestras reglas para cuidar tu satisfacción:</p>
      <ul>
        <li><strong>Entrega eficaz:</strong> Enviamos en un máximo de 5 días hábiles dentro del país y 10 días al extranjero.</li>
        <li><strong>Garantía de devolución:</strong> Podés devolver cualquier producto dentro de los 30 días posteriores si no cumple tus expectativas.</li>
        <li><strong>Atención personalizada:</strong> Nuestro equipo de soporte está disponible 24/7.</li>
        <li><strong>Garantía extendida:</strong> Nuestros productos tienen garantía de hasta 12 meses contra fallas de fábrica.</li>
        <li><strong>Comunicación clara:</strong> Te notificamos sobre el estado de tu pedido en cada paso.</li>
      </ul>
    </div>
  );

  return (
    <>
      <section className="py-5 text-white text-center" style={customStyles.heroSection}>
        <Container style={{ zIndex: 2, position: "relative" }}>
          <h1 className="display-4 fw-bold mb-3">Políticas de HuastecaArte</h1>
          <p className="fs-5 mb-4">Comprometidos con la cultura, la privacidad y tu experiencia.</p>
        </Container>
      </section>

      <section className="py-5" style={customStyles.politicasSection}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="fw-bold">Conocé nuestras políticas</h2>
            <div style={customStyles.titleUnderline}></div>
            <p className="text-muted mx-auto" style={{ maxWidth: "700px" }}>
              Nos tomamos en serio nuestro compromiso contigo y con nuestra cultura. Leé nuestras políticas y conocé cómo trabajamos.
            </p>
          </div>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="border-0 shadow-sm p-4">
                <Card.Body>
                  <Tabs defaultActiveKey="empresa" id="tabs-politicas" justify>
                    <Tab eventKey="empresa" title="Empresa">{politicasEmpresa}</Tab>
                    <Tab eventKey="privacidad" title="Privacidad">{politicasPrivacidad}</Tab>
                    <Tab eventKey="cliente" title="Cliente">{politicasCliente}</Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Politicas;
