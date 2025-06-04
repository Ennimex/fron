import React from 'react';
import { Container, Card } from 'react-bootstrap';

const InicioPrivate = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Card className="text-center p-4 shadow" style={{ maxWidth: '400px' }}>
        <Card.Body>
          <Card.Title>Inicio Privado</Card.Title>
          <Card.Text>Este es InicioPrivate</Card.Text>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default InicioPrivate;
