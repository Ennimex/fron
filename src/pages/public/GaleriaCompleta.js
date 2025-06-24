import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';
import stylesPublic from '../../styles/stylesPublic';
import api from '../../services/api';

const GaleriaCompleta = () => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  const styles = {
    pageContainer: {
      background: stylesPublic.colors.background.gradient.primary,
      minHeight: '100vh',
      paddingTop: '30px',
      paddingBottom: '60px',
      position: 'relative',
    },
    pageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: stylesPublic.elements.backgroundPatterns.floral,
      opacity: 0.8,
      zIndex: 1,
      pointerEvents: 'none',
    },    sectionTitle: {
      fontFamily: stylesPublic.typography.fontFamily.heading,
      fontSize: stylesPublic.typography.fontSize.h2,
      fontWeight: stylesPublic.typography.fontWeight.semiBold,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.md,
      position: "relative",
      textAlign: "center",
      '@media (max-width: 768px)': {
        fontSize: stylesPublic.typography.fontSize.xl,
      },
      '@media (max-width: 480px)': {
        fontSize: stylesPublic.typography.fontSize.lg,
        marginBottom: stylesPublic.spacing.sm,
      },
    },
    titleUnderline: {
      ...stylesPublic.elements.decorative.underline,
    },    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: stylesPublic.spacing.md,
      marginTop: stylesPublic.spacing.xl,
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: stylesPublic.spacing.sm,
      },
      '@media (max-width: 576px)': {
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: stylesPublic.spacing.sm,
      },
      '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: stylesPublic.spacing.xs,
      },
    },    galleryItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: stylesPublic.borders.radius.card,
      boxShadow: stylesPublic.shadows.card,
      cursor: 'pointer',
      height: '350px',
      transition: stylesPublic.transitions.preset.bounce,
      '@media (max-width: 768px)': {
        height: '300px',
      },
      '@media (max-width: 480px)': {
        height: '250px',
      },
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `transform ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut}`
    },    captionOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
      color: 'white',
      padding: stylesPublic.spacing.md,
      textAlign: 'center'
    },
    lightbox: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.9)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: stylesPublic.utils.zIndex.modal,
      padding: stylesPublic.spacing.md,
    },    lightboxImageWrapper: {
      position: 'relative',
      maxWidth: '80%',
      maxHeight: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      '@media (max-width: 768px)': {
        maxWidth: '95%',
        maxHeight: '85%',
      },
    },
    lightboxImage: {
      maxWidth: '100%',
      maxHeight: '80vh',
      objectFit: 'contain',
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
    },    lightboxCaption: {
      position: 'absolute',
      bottom: '30px',
      color: stylesPublic.colors.background.alt,
      fontSize: stylesPublic.typography.fontSize.lg,
      textAlign: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: `${stylesPublic.spacing.sm} ${stylesPublic.spacing.md}`,
      borderRadius: stylesPublic.borders.radius.md,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
      '@media (max-width: 768px)': {
        fontSize: stylesPublic.typography.fontSize.md,
        width: '90%',
        bottom: '20px',
        padding: `${stylesPublic.spacing.xs} ${stylesPublic.spacing.sm}`,
      },
      '@media (max-width: 480px)': {
        fontSize: stylesPublic.typography.fontSize.sm,
        width: '95%',
        bottom: '10px',
      },
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      backgroundColor: stylesPublic.colors.primary.main,
      color: stylesPublic.colors.background.alt,
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: `background ${stylesPublic.transitions.duration.normal} ${stylesPublic.transitions.easing.easeInOut}`,
      zIndex: stylesPublic.utils.zIndex.popover,
    },
    navButton: {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: stylesPublic.colors.primary.main,
      color: stylesPublic.colors.background.alt,
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: `background ${stylesPublic.transitions.duration.normal} ${stylesPublic.transitions.easing.easeInOut}`,
      zIndex: stylesPublic.utils.zIndex.popover,
    },
  };

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true);
        const data = await api.get('/public/galeria/fotos');
        setFotos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las fotos:', error);
        setLoading(false);
      }
    };

    fetchFotos();
  }, []);
  const images = fotos.map(foto => ({
    id: foto._id,
    src: foto.url,
    alt: foto.titulo,
    caption: foto.descripcion
  }));

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateMedia = (direction) => {
    if (selectedImage) {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      setSelectedImage(images[newIndex]);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.pageOverlay}></div>
      <Container>
        <h1 style={styles.sectionTitle}>Galería Completa</h1>
        <div style={styles.titleUnderline}></div>
        <p className="text-center" style={{
          fontSize: stylesPublic.typography.fontSize.lg,
          fontWeight: stylesPublic.typography.fontWeight.light,
          color: stylesPublic.colors.text.secondary,
          maxWidth: "800px",
          margin: `0 auto ${stylesPublic.spacing.xl}`,
          letterSpacing: stylesPublic.typography.letterSpacing.wide
        }}>
          Aquí puedes explorar toda nuestra colección de fotos artesanales. ¡Disfruta la galería!
        </p>
        <div style={styles.galleryGrid}>
          {loading ? (
            <div className="text-center w-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
              <p className="mt-2">Cargando imágenes...</p>
            </div>
          ) : images.length > 0 ? (            images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  ...styles.galleryItem,
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `all ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${index * 0.05}s`,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = stylesPublic.shadows.hover;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = stylesPublic.shadows.card;
                }}
                onClick={() => openLightbox(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={styles.galleryImage}
                />
                <div style={styles.captionOverlay}>
                  <h5 style={{ 
                    margin: 0,
                    marginBottom: stylesPublic.spacing.xs,
                    fontWeight: stylesPublic.typography.fontWeight.semiBold,
                    fontSize: stylesPublic.typography.fontSize.lg
                  }}>{image.alt}</h5>
                  <p style={{
                    margin: 0,
                    fontWeight: stylesPublic.typography.fontWeight.light,
                    fontSize: stylesPublic.typography.fontSize.sm,
                    opacity: 0.9
                  }}>{image.caption}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center w-100">
              <p>No hay imágenes disponibles.</p>
            </div>
          )}        </div>
      </Container>

      {/* Lightbox para imágenes */}
      {selectedImage && (
        <div style={styles.lightbox}>
          <button
            style={{ ...styles.navButton, left: '20px' }}
            onClick={() => navigateMedia('prev')}
          >
            <IonIcon icon={chevronBackOutline} style={{ fontSize: '24px' }} />
          </button>
          
          <div style={styles.lightboxImageWrapper}>
            <button 
              style={styles.closeButton} 
              onClick={closeLightbox}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary.main}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary.main}
            >
              <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={styles.lightboxImage}
            />
            <div style={styles.lightboxCaption}>
              <h4 style={{ marginBottom: stylesPublic.spacing.sm }}>{selectedImage.alt}</h4>
              <p style={{ margin: 0 }}>{selectedImage.caption}</p>
            </div>
          </div>
          
          <button
            style={{ ...styles.navButton, right: '20px' }}
            onClick={() => navigateMedia('next')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary.main}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary.main}
          >
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: '24px' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default GaleriaCompleta;