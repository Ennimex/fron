import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaVideo, FaPlay, FaClock } from 'react-icons/fa';
import axios from 'axios';

const GestionVideos = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    video: null,
    imagen: null,
    imagenPreview: null,
    videoPreview: null
  });
  const [uploading, setUploading] = useState(false);

  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    fetchVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/videos');
      setVideos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error al cargar videos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

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

  const handleVideoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      
      setFormData({
        ...formData,
        video: file,
        videoPreview: videoUrl
      });
    }
  };

  const handleOpenCreateModal = () => {
    setCurrentVideo(null);
    setFormData({
      titulo: '',
      descripcion: '',
      video: null,
      imagen: null,
      imagenPreview: null,
      videoPreview: null
    });
    setModalOpen(true);
  };

  const handleOpenEditModal = (video) => {
    setCurrentVideo(video);
    setFormData({
      titulo: video.titulo || '',
      descripcion: video.descripcion || '',
      video: null,
      imagen: null,
      imagenPreview: video.urlImagen
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      handleCloseModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('titulo', formData.titulo);
      formDataToSend.append('descripcion', formData.descripcion);
      
      if (formData.video) {
        formDataToSend.append('video', formData.video);
      }
      
      if (formData.imagen) {
        formDataToSend.append('imagen', formData.imagen);
      } else if (!currentVideo) {
        // Si no se sube una imagen y es un video nuevo, indicamos que queremos generar miniatura automáticamente
        formDataToSend.append('generarMiniatura', 'true');
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      setUploading(true);
      
      if (currentVideo) {
        await api.put(`/videos/${currentVideo._id}`, formDataToSend, config);
      } else {
        await api.post('/videos', formDataToSend, config);
      }
      
      setUploading(false);
      setModalOpen(false);
      fetchVideos();
    } catch (err) {
      setUploading(false);
      setError(err.response?.data?.message || err.message);
      console.error('Error al guardar video:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este video?')) {
      return;
    }
    
    try {
      await api.delete(`/videos/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      fetchVideos();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      console.error('Error al eliminar video:', err);
    }
  };

  const handlePlayVideo = (url) => {
    if (url) {
      window.open(url, '_blank');
    }
  };

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
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    },
    imageContainer: {
      height: '180px',
      overflow: 'hidden',
      position: 'relative',
      cursor: 'pointer',
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0,0,0,0.6)',
      color: 'white',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      maxHeight: '60px',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
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
      height: '180px',
      color: '#6c757d',
    },
    noData: {
      textAlign: 'center',
      margin: '3rem 0',
      color: '#6c757d',
    },
    youtubeHelp: {
      fontSize: '0.8rem',
      color: '#666',
      marginTop: '0.3rem',
    },
    fileInput: {
      display: 'block',
      width: '100%',
      padding: '0.5rem 0',
      marginBottom: '0.5rem',
    },
    fileLabel: {
      display: 'inline-block',
      backgroundColor: '#f0f0f0',
      color: '#444',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      marginBottom: '0.5rem',
      border: '1px solid #ddd',
    },
    uploadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.7)',
      zIndex: 2000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
    },
    clockIcon: {
      fontSize: '3rem',
      marginBottom: '1rem',
      animation: 'spin 2s linear infinite',
    },
    uploadingText: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
    },
    dynamicStyles: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes slideDown {
        from { transform: translateY(-50px); opacity: 0; }
        to { transform: translateY(0); opacity: 1; }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `
  };

  if (loading) {
    return <div style={styles.container}>Cargando...</div>;
  }

  return (
    <div style={styles.container}>
      <style>{styles.dynamicStyles}</style>
      
      <div style={styles.header}>
        <h1 style={styles.title}>Gestión de Videos</h1>
        <button style={styles.addButton} onClick={handleOpenCreateModal}>
          <FaPlus /> Agregar Video
        </button>
      </div>

      {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

      {videos.length === 0 ? (
        <div style={styles.noData}>
          <FaVideo size={40} />
          <p>No hay videos disponibles. ¡Agrega uno nuevo!</p>
        </div>
      ) : (
        <div style={styles.grid}>
          {videos.map((video) => (
            <div key={video._id} style={styles.card}>
              <div 
                style={styles.imageContainer}
                onClick={() => handlePlayVideo(video.url)}
              >
                {video.urlImagen ? (
                  <>
                    <img src={video.urlImagen} alt={video.titulo} style={styles.image} />
                    <div style={styles.playButton}>
                      <FaPlay size={20} />
                    </div>
                  </>
                ) : (
                  <div style={styles.placeholder}>
                    <FaVideo size={40} />
                    <p>Sin miniatura</p>
                  </div>
                )}
              </div>
              <div style={styles.cardContent}>
                <h3 style={styles.cardTitle}>{video.titulo || 'Sin título'}</h3>
                <p style={styles.cardDescription}>{video.descripcion || 'Sin descripción'}</p>
                <div style={styles.cardActions}>
                  <button 
                    style={{...styles.actionButton, ...styles.editButton}} 
                    onClick={() => handleOpenEditModal(video)}
                  >
                    <FaEdit /> Editar
                  </button>
                  <button 
                    style={{...styles.actionButton, ...styles.deleteButton}} 
                    onClick={() => handleDelete(video._id)}
                  >
                    <FaTrash /> Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div 
        style={styles.modal} 
        className="modal-overlay"
        onClick={handleOutsideClick}
      >
        <div style={styles.modalContent}>
          <button style={styles.closeButton} onClick={handleCloseModal}>&times;</button>
          <h2>{currentVideo ? 'Editar Video' : 'Agregar Nuevo Video'}</h2>
          
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
              <label style={styles.label} htmlFor="video">Archivo de Video</label>
              <div>
                <input
                  style={styles.fileInput}
                  type="file"
                  id="video"
                  name="video"
                  accept="video/*"
                  onChange={handleVideoChange}
                  {...(currentVideo ? {} : { required: true })}
                />
                <small style={{ color: '#666' }}>
                  Formatos recomendados: MP4, WebM (Max. 100MB)
                </small>
              </div>
              
              {formData.videoPreview && (
                <div style={{ marginTop: '1rem' }}>
                  <p>Vista previa del video:</p>
                  <video 
                    controls 
                    src={formData.videoPreview} 
                    style={{ width: '100%', maxHeight: '200px', borderRadius: '4px' }} 
                  />
                </div>
              )}
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label} htmlFor="imagen">Miniatura personalizada (opcional)</label>
              <div>
                <input
                  style={styles.fileInput}
                  type="file"
                  id="imagen"
                  name="imagen"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <small style={{ color: '#666' }}>
                  Formatos recomendados: JPG, PNG (Max. 5MB)
                </small>
              </div>
              <p style={styles.youtubeHelp}>
                Si no subes una imagen, se generará automáticamente una miniatura a partir del video.
              </p>
              
              {formData.imagenPreview && (
                <img src={formData.imagenPreview} alt="Vista previa" style={styles.imagePreview} />
              )}
            </div>
            
            <button type="submit" style={styles.submitButton} disabled={uploading}>
              {currentVideo ? 'Actualizar Video' : 'Crear Video'}
            </button>
          </form>
        </div>
      </div>

      {uploading && (
        <div style={styles.uploadingOverlay}>
          <FaClock style={styles.clockIcon} />
          <div style={styles.uploadingText}>Espera...</div>
          <p>Estamos procesando tu video</p>
        </div>
      )}
    </div>
  );
};

export default GestionVideos;