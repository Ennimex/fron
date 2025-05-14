import React, { useEffect } from 'react';
import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';
import { colors, textStyles, typography, layout } from '../../styles/styles';

const Politicas = ({ data }) => {
  // Configuración predeterminada en caso de que no se proporcionen datos
  const defaultData = {
    pageTitle: "Políticas de JADA Company",
    pageIntro: "En JADA Company nos esforzamos por mantener los más altos estándares éticos y profesionales. Nuestras políticas reflejan nuestro compromiso con la transparencia, calidad y satisfacción del cliente.",
    
    clientPolicies: {
      title: "Políticas del Cliente",
      intro: "Tu satisfacción es nuestra prioridad. Estas políticas están diseñadas para garantizar una experiencia de compra segura y transparente.",
      items: [
        {
          id: "guarantee",
          icon: "🛡️",
          title: "Garantía de Calidad",
          content: [
            "Todos nuestros productos cuentan con una garantía de 2 años contra defectos de fabricación. Si encuentras algún problema con tu producto, contáctanos y resolveremos la situación de manera rápida y eficiente.",
            "Nuestro equipo de atención al cliente está disponible para asistirte y proporcionarte toda la información necesaria sobre cómo hacer válida tu garantía."
          ],
          highlights: ["garantía de 2 años"]
        },
        {
          id: "returns",
          icon: "↩️",
          title: "Devoluciones y Reembolsos",
          content: [
            "Aceptamos devoluciones dentro de los 30 días posteriores a la compra, siempre que el producto esté en su estado original y con el embalaje intacto.",
            "Los reembolsos se procesarán en un plazo máximo de 14 días hábiles después de recibir el producto devuelto. Te notificaremos por correo electrónico una vez que se haya procesado tu reembolso."
          ],
          highlights: ["30 días posteriores a la compra"]
        },
        {
          id: "service",
          icon: "🔧",
          title: "Servicio Postventa",
          content: [
            "Ofrecemos un servicio de mantenimiento y reparación para garantizar que tus productos sigan funcionando perfectamente.",
            "Si necesitas asistencia, nuestro equipo estará disponible para ayudarte de lunes a viernes de 9:00 AM a 6:00 PM. Puedes contactarnos a través de nuestro formulario en línea, por teléfono o por correo electrónico."
          ],
          highlights: ["lunes a viernes de 9:00 AM a 6:00 PM"]
        },
        {
          id: "pricing",
          icon: "💲",
          title: "Transparencia en Precios",
          content: [
            "Todos nuestros precios incluyen IVA y están claramente detallados en nuestras facturas y presupuestos. No hay cargos ocultos; te informamos de cualquier costo adicional antes de confirmar tu pedido.",
            "Nuestra política de precios está diseñada para ser justa y transparente, permitiéndote tomar decisiones informadas sobre tus compras."
          ],
          highlights: ["No hay cargos ocultos"]
        }
      ]
    },
    
    companyPolicies: {
      title: "Políticas de la Empresa",
      intro: "Nos regimos por principios éticos y profesionales que guían nuestras operaciones y relaciones con clientes, proveedores y empleados.",
      items: [
        {
          id: "quality",
          icon: "⭐",
          title: "Compromiso con la Calidad",
          content: ["Utilizamos materiales de primera calidad y seguimos rigurosos controles de calidad en cada etapa de producción. Nuestros productos cumplen con todas las normativas y estándares internacionales."]
        },
        {
          id: "sustainability",
          icon: "🌱",
          title: "Responsabilidad Social y Ambiental",
          content: ["Nos comprometemos a reducir nuestro impacto ambiental utilizando materiales reciclados y procesos sostenibles. Participamos en iniciativas comunitarias y apoyamos causas sociales que benefician a nuestra localidad."]
        },
        {
          id: "ethics",
          icon: "🤝",
          title: "Ética en los Negocios",
          content: ["Mantenemos relaciones transparentes y justas con proveedores, clientes y empleados. Rechazamos cualquier práctica corrupta o desleal en nuestras operaciones."]
        },
        {
          id: "innovation",
          icon: "💡",
          title: "Innovación y Mejora Continua",
          content: ["Invertimos en investigación y desarrollo para ofrecer productos y servicios innovadores. Escuchamos las opiniones de nuestros clientes para mejorar constantemente."]
        }
      ]
    },
    
    privacyPolicies: {
      title: "Políticas de Privacidad",
      intro: "Respetamos y protegemos tu privacidad. A continuación, te explicamos cómo recopilamos, utilizamos y protegemos tu información personal:",
      items: [
        {
          id: "data",
          icon: "📊",
          title: "Información Recopilada",
          content: [
            "<strong>Datos Personales:</strong> Nombre, dirección, correo electrónico, teléfono y detalles de pago.",
            "<strong>Datos de Navegación:</strong> Información sobre tu interacción con nuestro sitio web, como direcciones IP y cookies."
          ]
        },
        {
          id: "usage",
          icon: "📝",
          title: "Uso de la Información",
          content: ["Utilizamos tus datos para procesar pedidos, brindar soporte al cliente y mejorar nuestros servicios. Nunca compartimos tu información con terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley."]
        },
        {
          id: "security",
          icon: "🔒",
          title: "Seguridad de los Datos",
          content: ["Implementamos medidas de seguridad avanzadas para proteger tu información contra accesos no autorizados o pérdidas. Todos los datos de pago se procesan a través de plataformas seguras y encriptadas."]
        },
        {
          id: "rights",
          icon: "⚖️",
          title: "Tus Derechos",
          content: ["Puedes solicitar acceso, rectificación o eliminación de tus datos personales en cualquier momento. Si deseas dejar de recibir comunicaciones comerciales, puedes darte de baja fácilmente a través de nuestros correos electrónicos."]
        },
        {
          id: "changes",
          icon: "🔄",
          title: "Cambios en la Política",
          content: ["Nos reservamos el derecho de actualizar esta política en cualquier momento. Cualquier cambio será notificado a través de nuestro sitio web y por correo electrónico a nuestros clientes registrados."]
        }
      ]
    }
  };

  // Combinar datos proporcionados con valores predeterminados
  const policyData = data || defaultData;

  const styles = {
    pageContainer: {
      backgroundColor: colors.white,
      color: colors.primaryDark,
      paddingTop: '80px',
      paddingBottom: '80px',
      minHeight: '100vh',
    },
    headerSection: {
      marginBottom: '60px',
      position: 'relative',
      paddingBottom: '20px',
    },
    title: {
      ...textStyles.title,
      textAlign: 'center',
      marginBottom: '30px',
      position: 'relative',
      display: 'inline-block',
    },
    titleLine: {
      content: '""',
      position: 'absolute',
      bottom: '-10px',
      left: '50%',
      width: '80px',
      height: '3px',
      backgroundColor: colors.primaryLight,
      transform: 'translateX(-50%)',
    },
    subtitle: {
      ...textStyles.subtitle,
      textAlign: 'left',
      marginBottom: '25px',
      padding: '0 0 10px 0',
      borderBottom: `2px solid ${colors.primaryLight}`,
      display: 'inline-block',
    },
    sectionIntro: {
      ...textStyles.paragraph,
      fontSize: '18px',
      lineHeight: '1.8',
      marginBottom: '40px',
      maxWidth: '85%',
      margin: '0 auto 40px auto',
      textAlign: 'center',
    },
    sectionDivider: {
      margin: '50px 0',
      height: '2px',
      background: `linear-gradient(to right, ${colors.white}, ${colors.primaryLight}, ${colors.white})`,
      border: 'none',
    },
    policyCard: {
      borderRadius: '8px',
      boxShadow: '0 6px 18px rgba(0, 0, 0, 0.07)',
      border: 'none',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      overflow: 'hidden',
      marginBottom: '25px',
      borderLeft: `4px solid ${colors.primaryMedium}`,
      backgroundColor: colors.white,
    },
    cardHeader: {
      backgroundColor: colors.white,
      borderBottom: `1px solid ${colors.primaryLight}`,
      padding: '20px 25px 15px',
    },
    cardTitle: {
      fontSize: '20px',
      fontFamily: typography.fontPrimary,
      fontWeight: '600',
      color: colors.primaryDark,
      margin: 0,
      position: 'relative',
      paddingLeft: '15px',
    },
    cardTitleIcon: {
      position: 'absolute',
      left: '-5px',
      top: '50%',
      transform: 'translateY(-50%)',
      fontSize: '18px',
      color: colors.primaryLight,
    },
    cardBody: {
      padding: '25px',
    },
    paragraph: {
      ...textStyles.paragraph,
      fontSize: '16px',
      lineHeight: '1.75',
      color: colors.primaryMedium,
      marginBottom: '10px',
    },
    highlightText: {
      backgroundColor: `${colors.primaryLight}25`, // 25% opacity
      padding: '2px 5px',
      borderRadius: '3px',
      fontWeight: '600',
    },
    accordionCustom: {
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.06)',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    accordionHeader: {
      backgroundColor: colors.white,
      padding: 0,
      border: 'none',
    },
    accordionButton: {
      backgroundColor: colors.white,
      color: colors.primaryDark,
      fontFamily: typography.fontPrimary,
      fontWeight: '600',
      fontSize: '18px',
      padding: '20px 25px',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      borderBottom: `1px solid ${colors.primaryLight}25`,
      width: '100%',
      textAlign: 'left',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: `${colors.primaryLight}10`,
      }
    },
    accordionBody: {
      padding: '25px',
      backgroundColor: colors.white,
    }
  };

  // Función para aplicar resaltado al texto
  const highlightTextInContent = (text, highlights = []) => {
    if (!highlights || highlights.length === 0) return text;
    
    let result = text;
    highlights.forEach(highlight => {
      if (text.includes(highlight)) {
        result = result.replace(
          highlight, 
          `<span style="background-color: ${colors.primaryLight}25; padding: 2px 5px; border-radius: 3px; font-weight: 600;">${highlight}</span>`
        );
      }
    });
    
    return <p style={styles.paragraph} dangerouslySetInnerHTML={{ __html: result }} />;
  };
  
  // Función para manejar el desplazamiento suave al cargar la página
  useEffect(() => {
    // Comprueba si hay un hash en la URL
    if (window.location.hash) {
      const id = window.location.hash.substring(1); // Elimina el # del hash
      const element = document.getElementById(id);
      
      if (element) {
        // Añade un pequeño retraso para permitir que la página se cargue completamente
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, []);

  return (
    <div style={styles.pageContainer}>
      <Container>
        {/* Header Section */}
        <Row style={styles.headerSection}>
          <Col xs={12} className="text-center">
            <h1 style={styles.title}>
              {policyData.pageTitle}
              <div style={styles.titleLine}></div>
            </h1>
            <p style={styles.sectionIntro}>
              {policyData.pageIntro}
            </p>
          </Col>
        </Row>

        {/* Políticas del Cliente */}
        {policyData.clientPolicies && (
          <Row className="mb-5" id="cliente">
            <Col xs={12}>
              <h2 style={styles.subtitle}>{policyData.clientPolicies.title}</h2>
              <p style={{...styles.paragraph, marginBottom: '30px'}}>
                {policyData.clientPolicies.intro}
              </p>

              <Accordion defaultActiveKey="0" style={styles.accordionCustom}>
                {policyData.clientPolicies.items.map((policy, index) => (
                  <Accordion.Item eventKey={String(index)} key={policy.id}>
                    <Accordion.Header style={styles.accordionHeader}>
                      <span>{policy.icon} {policy.title}</span>
                    </Accordion.Header>
                    <Accordion.Body style={styles.accordionBody}>
                      {policy.content.map((paragraph, i) => (
                        policy.highlights ? 
                          highlightTextInContent(paragraph, policy.highlights) : 
                          <p key={i} style={styles.paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                      ))}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Col>
          </Row>
        )}

        <hr style={styles.sectionDivider} />

        {/* Políticas de la Empresa */}
        {policyData.companyPolicies && (
          <Row className="mb-5">
            <Col xs={12}>
              <h2 style={styles.subtitle}>{policyData.companyPolicies.title}</h2>
              <p style={{...styles.paragraph, marginBottom: '30px'}}>
                {policyData.companyPolicies.intro}
              </p>

              <Row>
                {policyData.companyPolicies.items.map((policy) => (
                  <Col md={6} className="mb-4" key={policy.id}>
                    <Card style={styles.policyCard}>
                      <Card.Header style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                          <span style={styles.cardTitleIcon}>{policy.icon}</span>
                          {policy.title}
                        </h3>
                      </Card.Header>
                      <Card.Body style={styles.cardBody}>
                        {policy.content.map((paragraph, i) => (
                          <p key={i} style={styles.paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}

        <hr style={styles.sectionDivider} />

        {/* Políticas de Privacidad */}
        {policyData.privacyPolicies && (
          <Row id="privacidad">
            <Col xs={12}>
              <h2 style={styles.subtitle}>{policyData.privacyPolicies.title}</h2>
              <p style={{...styles.paragraph, marginBottom: '30px'}}>
                {policyData.privacyPolicies.intro}
              </p>

              <Row>
                {policyData.privacyPolicies.items.map((policy) => (
                  <Col lg={policy.id === 'data' ? 4 : (policy.id === 'rights' || policy.id === 'changes' ? 6 : 4)} md={6} className="mb-4" key={policy.id}>
                    <Card style={styles.policyCard}>
                      <Card.Header style={styles.cardHeader}>
                        <h3 style={styles.cardTitle}>
                          <span style={styles.cardTitleIcon}>{policy.icon}</span>
                          {policy.title}
                        </h3>
                      </Card.Header>
                      <Card.Body style={styles.cardBody}>
                        {policy.content.map((paragraph, i) => (
                          <p key={i} style={styles.paragraph} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Politicas;