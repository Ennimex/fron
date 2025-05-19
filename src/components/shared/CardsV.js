import React from "react";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { colors } from "../../styles/styles";
import { useNavigate } from "react-router-dom";

const CardsV = ({ items }) => {
  const navigate = useNavigate();

  // Función para truncar texto
  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
  };

  // Función para manejar el clic en Ver Más
  const handleVerMas = (id) => {
    navigate(`/producto/${id}`);
  };

  return (
    <Container>
      <Row>
        {items.map((item, index) => (
          <Col md={4} key={index} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Img 
                variant="top" 
                src={item.image} 
                alt={item.title}
                style={{
                  height: "200px", 
                  objectFit: "cover", 
                  borderRadius: "10px 10px 0 0"
                }}
              />
              <Card.Body style={{ backgroundColor: colors.white }}>
                {/* Título truncado a 25 caracteres */}
                <Card.Title style={{ color: colors.primaryDark, fontSize: "18px" }}>
                  {truncateText(item.title, 25)}
                </Card.Title>
                
                {/* Descripción truncada a 80 caracteres */}
                <Card.Text style={{ color: colors.primaryMedium, fontSize: "14px" }}>
                  {truncateText(item.description, 80)}
                </Card.Text>
                
                <Button 
                  style={{ 
                    backgroundColor: colors.accent, 
                    borderColor: colors.accent,
                    marginTop: "auto"
                  }}
                  onClick={() => handleVerMas(item._id)}
                >
                  Ver Más
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CardsV;