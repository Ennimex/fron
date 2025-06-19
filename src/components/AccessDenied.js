import React from 'react';
import { FaLock } from 'react-icons/fa';

const AccessDenied = ({ message }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      height: '80vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <FaLock size={50} style={{ color: '#e74c3c', marginBottom: '1rem' }} />
      <h2>Acceso Denegado</h2>
      <p>{message || 'No tienes permisos para acceder a esta sección. Esta área está reservada para administradores.'}</p>
    </div>
  );
};

export default AccessDenied;
