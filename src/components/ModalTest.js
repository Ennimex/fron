// Archivo de prueba para verificar el funcionamiento del modal
// Este archivo se puede eliminar después de las pruebas

import React, { useState } from 'react';

const ModalTest = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const styles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    modal: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      maxWidth: '500px',
      width: '90%',
    },
    button: {
      padding: '10px 20px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      margin: '10px',
    },
  };

  return (
    <div>
      <h2>Test Modal</h2>
      <button 
        style={styles.button}
        onClick={() => setModalVisible(true)}
      >
        Abrir Modal de Prueba
      </button>

      {modalVisible && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>Modal de Prueba</h3>
            <p>Este modal debería aparecer cuando se hace clic en el botón.</p>
            <button 
              style={styles.button}
              onClick={() => setModalVisible(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalTest;
