import React from "react";
import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";
import NavbarPrivada from "../layouts/private/NabvarPrivate";

const PrivateLayout = () => {
  const styles = {
    mainContainer: {
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    },
    pageContent: {
      flex: 1,
      backgroundColor: '#f8f9fa',
      overflow: 'auto',
      padding: '5px',
    }
  };

  return (
    <div style={styles.mainContainer}>
      <div style={styles.content}>
        <NavbarPrivada />
        
        <div style={styles.pageContent}>
          <Container fluid className="px-0">
            <Outlet />
          </Container>
        </div>
      </div>
    </div>
  );
};

export default PrivateLayout;