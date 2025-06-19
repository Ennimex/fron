import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const GestorLocalidades = () => {
  const { user } = useAuth();
  const [localidades, setLocalidades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLocalidad, setCurrentLocalidad] = useState({ nombre: '', descripcion: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formError, setFormError] = useState('');

  // Cargar localidades al iniciar
  useEffect(() => {
    fetchLocalidades();
  }, []);

  // Obtener todas las localidades
  const fetchLocalidades = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/localidades');
      
      if (!response.ok) {
        throw new Error('Error al cargar localidades');
      }
      
      const data = await response.json();
      setLocalidades(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Abrir modal para crear nueva localidad
  const handleOpenCreateModal = () => {
    setCurrentLocalidad({ nombre: '', descripcion: '' });
    setIsEditing(false);
    setFormError('');
    setModalOpen(true);
  };

  // Abrir modal para editar localidad
  const handleOpenEditModal = (localidad) => {
    setCurrentLocalidad(localidad);
    setIsEditing(true);
    setFormError('');
    setModalOpen(true);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLocalidad(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Guardar localidad (crear o actualizar)
  const handleSaveLocalidad = async (e) => {
    e.preventDefault();
    
    if (!currentLocalidad.nombre.trim()) {
      setFormError('El nombre de la localidad es obligatorio');
      return;
    }

    try {
      const url = isEditing 
        ? `http://localhost:5000/api/localidades/${currentLocalidad._id}`
        : 'http://localhost:5000/api/localidades';
      
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          nombre: currentLocalidad.nombre,
          descripcion: currentLocalidad.descripcion
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar la localidad');
      }

      // Actualizar lista de localidades
      fetchLocalidades();
      setModalOpen(false);
    } catch (err) {
      setFormError(err.message);
    }
  };

  // Eliminar localidad
  const handleDeleteLocalidad = async (id) => {
    if (window.confirm('¿Está seguro que desea eliminar esta localidad?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/localidades/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Error al eliminar la localidad');
        }

        // Actualizar lista después de eliminar
        fetchLocalidades();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const styles = {
    container: {
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      margin: 0,
      fontSize: '1.8rem',
      color: '#2c3e50',
    },
    addButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    },
    th: {
      textAlign: 'left',
      padding: '1rem',
      backgroundColor: '#f8f9fa',
      borderBottom: '2px solid #e9ecef',
      color: '#495057',
      fontWeight: 'bold',
    },
    td: {
      padding: '1rem',
      borderBottom: '1px solid #e9ecef',
      color: '#2c3e50',
    },
    actionButton: {
      padding: '0.3rem 0.7rem',
      margin: '0 0.3rem',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem',
    },
    editButton: {
      backgroundColor: '#f39c12',
      color: 'white',
    },
    deleteButton: {
      backgroundColor: '#e74c3c',
      color: 'white',
    },
    modal: {
      display: modalOpen ? 'block' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
    },
    modalContent: {
      position: 'relative',
      backgroundColor: 'white',
      margin: '10% auto',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      maxWidth: '500px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '15px',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontWeight: 'bold',
      fontSize: '0.9rem',
      color: '#495057',
    },
    input: {
      padding: '0.8rem',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      fontSize: '1rem',
    },
    textarea: {
      padding: '0.8rem',
      borderRadius: '4px',
      border: '1px solid #ced4da',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
    },
    saveButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '0.8rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontWeight: 'bold',
      fontSize: '1rem',
    },
    errorMessage: {
      color: '#e74c3c',
      backgroundColor: '#fadbd8',
      padding: '0.8rem',
      borderRadius: '4px',
      marginBottom: '1rem',
    },
    loadingMessage: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#7f8c8d',
    },
    errorContainer: {
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: '#fadbd8',
      borderRadius: '8px',
      color: '#e74c3c',
    },
    emptyMessage: {
      textAlign: 'center',
      padding: '2rem',
      color: '#7f8c8d',
    }
  };

  if (loading) {
    return <div style={styles.loadingMessage}>Cargando localidades...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Localidades</h1>
        <button 
          style={styles.addButton}
          onClick={handleOpenCreateModal}
        >
          <i className="bi bi-plus"></i>
          Agregar Localidad
        </button>
      </div>

      {error && (
        <div style={styles.errorContainer}>
          <p>Error: {error}</p>
        </div>
      )}

      {!error && localidades.length === 0 ? (
        <div style={styles.emptyMessage}>
          <p>No hay localidades registradas. Agregue una nueva localidad para comenzar.</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {localidades.map((localidad) => (
              <tr key={localidad._id}>
                <td style={styles.td}>{localidad.nombre}</td>
                <td style={styles.td}>{localidad.descripcion || '—'}</td>
                <td style={styles.td}>
                  <button
                    style={{...styles.actionButton, ...styles.editButton}}
                    onClick={() => handleOpenEditModal(localidad)}
                  >
                    Editar
                  </button>
                  <button
                    style={{...styles.actionButton, ...styles.deleteButton}}
                    onClick={() => handleDeleteLocalidad(localidad._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal para crear/editar localidad */}
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <button 
            style={styles.closeButton}
            onClick={() => setModalOpen(false)}
          >
            ×
          </button>
          <h2>{isEditing ? 'Editar Localidad' : 'Agregar Nueva Localidad'}</h2>
          
          {formError && (
            <div style={styles.errorMessage}>
              {formError}
            </div>
          )}
          
          <form style={styles.form} onSubmit={handleSaveLocalidad}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="nombre">Nombre:</label>
              <input
                id="nombre"
                type="text"
                name="nombre"
                value={currentLocalidad.nombre}
                onChange={handleInputChange}
                style={styles.input}
                placeholder="Nombre de la localidad"
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="descripcion">Descripción:</label>
              <textarea
                id="descripcion"
                name="descripcion"
                value={currentLocalidad.descripcion || ''}
                onChange={handleInputChange}
                style={styles.textarea}
                placeholder="Descripción de la localidad (opcional)"
              />
            </div>
            
            <button 
              type="submit"
              style={styles.saveButton}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GestorLocalidades;
