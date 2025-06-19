import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaImage, FaLock } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

const GestionFotos = () => {
  const { user, isAuthenticated } = useAuth();
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentFoto, setCurrentFoto] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagen: null,
    imagenPreview: null
  });

  // Cargar fotos al montar el componente
  useEffect(() => {
    fetchFotos();
  }, []);

  // Obtener lista de fotos
  const fetchFotos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/fotos');
      
      if (!response.ok) {
        throw new Error('Error al cargar las fotos');
      }
      
      const data = await response.json();
      setFotos(data);
    } catch (err) {
      setError(err.message);
      console.error('Error al cargar fotos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        imagen: file,
        imagenPreview: imageUrl
      });
    }
  };

  // Abrir modal para crear nueva foto
  const handleOpenCreateModal = () => {
    setCurrentFoto(null);
    setFormData({
      titulo: '',
      descripcion: '',
      imagen: null,
      imagenPreview: null
    });
    setModalOpen(true);
  };

  // Abrir modal para editar foto existente
  const handleOpenEditModal = (foto) => {
    setCurrentFoto(foto);
    setFormData({
      titulo: foto.titulo || '',
      descripcion: foto.descripcion || '',
      imagen: null,
      imagenPreview: foto.url
    });
    setModalOpen(true);
  };

  // Cerrar modal
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  // Cerrar modal al hacer clic fuera del contenido
  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      handleCloseModal();
    }
  };

  // Función para manejar la eliminación de una foto
  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro que deseas eliminar esta foto?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/fotos/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // Añadir token de autorización si es necesario
            // 'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al eliminar la foto');
        }

        // Actualizar la lista de fotos excluyendo la eliminada
        setFotos(fotos.filter(foto => foto._id !== id));
      } catch (err) {
        setError(err.message);
        console.error('Error al eliminar foto:', err);
      }
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      
      // Solo adjuntar imagen si hay una nueva
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      }

      let response;
      
      if (currentFoto) {
        // Actualizar foto existente
        response = await fetch(`http://localhost:5000/api/fotos/${currentFoto._id}`, {
          method: 'PUT',
          body: formDataToSend,
          // No incluir Content-Type para que el navegador establezca el boundary correcto para FormData
        });
      } else {
        // Crear nueva foto
        response = await fetch('http://localhost:5000/api/fotos', {
          method: 'POST',
          body: formDataToSend,
        });
      }

      if (!response.ok) {
        throw new Error(currentFoto ? 'Error al actualizar la foto' : 'Error al crear la foto');
      }

      // Cerrar modal y actualizar lista de fotos
      handleCloseModal();
      fetchFotos();
    } catch (err) {
      setError(err.message);
      console.error('Error al guardar foto:', err);
    }
  };

  // Estilos
  const styles = {
    container: {
      padding: '2rem',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.8rem',
      margin: 0,
    },
    addButton: {
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      cursor: 'pointer',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '1.5rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    imageContainer: {
      height: '200px',
      overflow: 'hidden',
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    cardContent: {
      padding: '1rem',
    },
    cardTitle: {
      margin: '0 0 0.5rem 0',
      fontSize: '1.1rem',
    },
    cardDescription: {
      margin: '0 0 1rem 0',
      fontSize: '0.9rem',
      color: '#666',
    },
    cardActions: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '0.5rem',
    },
    actionButton: {
      border: 'none',
      borderRadius: '4px',
      padding: '0.4rem 0.6rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
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
      display: modalOpen ? 'flex' : 'none',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 1000,
      justifyContent: 'center',
      alignItems: 'flex-start',
      overflow: 'auto',
      padding: '20px 0',
      animation: modalOpen ? 'fadeIn 0.3s' : '',
    },
    modalContent: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      width: '90%',
      maxWidth: '600px',
      position: 'relative',
      maxHeight: '90vh',
      overflow: 'auto',
      animation: modalOpen ? 'slideDown 0.3s' : '',
      margin: '40px 0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    },
    closeButton: {
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      background: 'none',
      border: 'none',
      fontSize: '1.5rem',
      cursor: 'pointer',
      color: '#666',
      zIndex: 1,
      transition: 'color 0.2s',
      ':hover': {
        color: '#000',
      },
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
    },
    label: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
    },
    input: {
      padding: '0.7rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
    },
    textarea: {
      padding: '0.7rem',
      borderRadius: '4px',
      border: '1px solid #ddd',
      minHeight: '100px',
      resize: 'vertical',
    },
    imagePreview: {
      width: '100%',
      maxHeight: '200px',
      objectFit: 'contain',
      marginTop: '1rem',
      borderRadius: '4px',
    },
    submitButton: {
      backgroundColor: '#2ecc71',
      color: 'white',
      border: 'none',
      padding: '0.8rem',
      borderRadius: '4px',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    placeholder: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8f9fa',
      height: '200px',
      color: '#6c757d',
    },
    noData: {
      textAlign: 'center',
      margin: '3rem 0',
      color: '#6c757d',
    },
    fileInput: {
      display: 'block',
      width: '100%',
      padding: '0.5rem 0',
      marginBottom: '0.5rem',
    },
    fileInputContainer: {
      marginBottom: '10px',
    },
  };

  // Estilos dinámicos CSS para animaciones
  const dynamicStyles = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideDown {
      from { transform: translateY(-50px); opacity: 0; }
      to { transform: translateY(0); opacity: 1; }
    }
  `;

  // Verificar si el usuario está autenticado y tiene rol de administrador
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (user?.role !== 'admin') {
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
        <p>No tienes permisos para acceder a esta sección. Esta área está reservada para administradores.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={styles.container}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      {/* Estilos dinámicos */}
      <style>{dynamicStyles}</style>
      
      {/* Encabezado */}
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Fotos</h1>
        <button style={styles.addButton} onClick={handleOpenCreateModal}>
          <FaPlus /> Agregar Foto
        </button>
      </div>

      {/* Mensaje de error */}
      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {/* Cuadrícula de fotos */}
      {fotos.length === 0 ? (
        <div style={styles.noData}>
          <FaImage size={40} />
          <p>No hay fotos disponibles. ¡Agrega una nueva!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {fotos.map((foto) => (
            <div key={foto._id} style={styles.card}>
              <div style={styles.imageContainer}>
                {foto.url ? (
                  <img src={foto.url} alt={foto.titulo} style={styles.image} />
                ) : (
                  <div style={styles.placeholder}>
                    <FaImage size={40} />
                    <p>Sin imagen</p>
                  </div>
                )}
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{foto.titulo || 'Sin título'}</h3>
                <p style={styles.cardDescription}>{foto.descripcion || 'Sin descripción'}</p>
                <div style={styles.cardActions}>
                  <button 
                    style={{...styles.actionButton, ...styles.editButton}} 
                    onClick={() => handleOpenEditModal(foto)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button 
                    style={{...styles.actionButton, ...styles.deleteButton}} 
                    onClick={() => handleDelete(foto._id)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal para crear/editar */}
      <div 
        style={styles.modal} 
        className="modal-overlay"
        onClick={handleOutsideClick}
      >
        <div style={styles.modalContent}>
          <button style={styles.closeButton} onClick={handleCloseModal}>&times;</button>
          <h2>{currentFoto ? 'Editar Foto' : 'Agregar Nueva Foto'}</h2>
          
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="titulo">Título</label>
              <input
                style={styles.input}
                type="text"
                id="titulo"
                name="titulo"
                value={formData.titulo}
                onChange={handleChange}
                required
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="descripcion">Descripción</label>
              <textarea
                style={styles.textarea}
                id="descripcion"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="imagen">Imagen</label>
              <div style={styles.fileInputContainer}>
                <input
                  style={styles.fileInput}
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImageChange}
                  {...(currentFoto ? {} : { required: true })}
                />
                <small style={{ color: '#666', marginTop: '5px' }}>
                  Formatos recomendados: JPG, PNG (Max. 10MB)
                </small>
              </div>
              
              {formData.imagenPreview && (
                <img src={formData.imagenPreview} alt="Vista previa" style={styles.imagePreview} />
              )}
            </div>
            
            <button type="submit" style={styles.submitButton}>
              {currentFoto ? 'Actualizar Foto' : 'Crear Foto'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GestionFotos;