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

  // CSS usando exclusivamente tokens del sistema refactorizado
  const cssStyles = `
    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[4]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[75]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[2]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[62]} !important;
      }
      .lightbox-wrapper {
        max-width: 95% !important;
        max-height: 85% !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .gallery-grid {
        grid-template-columns: 1fr !important;
        gap: ${stylesPublic.spacing.scale[1]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[62]} !important;
      }
      .lightbox-caption {
        width: 95% !important;
        bottom: ${stylesPublic.spacing.scale[3]} !important;
        font-size: ${stylesPublic.typography.scale.sm} !important;
      }
    }
  `;

  const styles = {
    pageContainer: {
      background: stylesPublic.colors.gradients.hero,
      minHeight: '100vh',
      paddingTop: stylesPublic.spacing.scale[8],
      paddingBottom: stylesPublic.spacing.scale[15],
      position: 'relative',
    },
    pageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: stylesPublic.colors.gradients.glass,
      opacity: 0.1,
      pointerEvents: 'none',
      zIndex: 1,
    },
    sectionTitle: {
      ...stylesPublic.typography.headings.h2,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[6],
      textAlign: "center",
    },
    titleUnderline: {
      display: 'block',
      width: stylesPublic.spacing.scale[20],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.sm,
      margin: `${stylesPublic.spacing.scale[4]} auto`,
    },
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: stylesPublic.spacing.scale[4],
      marginTop: stylesPublic.spacing.scale[12],
    },
    galleryItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows.lg,
      cursor: 'pointer',
      height: stylesPublic.spacing.scale[88],
      transition: stylesPublic.animations.transitions.base,
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: stylesPublic.animations.transitions.transform
    },
    captionOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: stylesPublic.colors.gradients.glass,
      color: stylesPublic.colors.text.inverse,
      padding: stylesPublic.spacing.scale[4],
      textAlign: 'center'
    },
    lightbox: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: stylesPublic.colors.surface.overlay,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: stylesPublic.utils.zIndex.modal,
      padding: stylesPublic.spacing.scale[4],
    },
    lightboxImageWrapper: {
      position: 'relative',
      maxWidth: '80%',
      maxHeight: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    lightboxImage: {
      maxWidth: '100%',
      maxHeight: '80vh',
      objectFit: 'contain',
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.xl,
    },
    lightboxCaption: {
      position: 'absolute',
      bottom: stylesPublic.spacing.scale[8],
      color: stylesPublic.colors.text.inverse,
      fontSize: stylesPublic.typography.scale.lg,
      textAlign: 'center',
      background: stylesPublic.colors.surface.overlay,
      padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
      borderRadius: stylesPublic.borders.radius.md,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%',
    },
    closeButton: {
      position: 'absolute',
      top: stylesPublic.spacing.scale[5],
      right: stylesPublic.spacing.scale[5],
      backgroundColor: stylesPublic.colors.primary[500],
      color: stylesPublic.colors.text.inverse,
      border: 'none',
      borderRadius: stylesPublic.borders.radius.full,
      width: stylesPublic.spacing.scale[10],
      height: stylesPublic.spacing.scale[10],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: stylesPublic.animations.transitions.colors,
      zIndex: stylesPublic.utils.zIndex.popover,
    },
    navButton: {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: stylesPublic.colors.primary[500],
      color: stylesPublic.colors.text.inverse,
      border: 'none',
      borderRadius: stylesPublic.borders.radius.full,
      width: stylesPublic.spacing.scale[12],
      height: stylesPublic.spacing.scale[12],
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: stylesPublic.animations.transitions.colors,
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
    <>
      <style>{cssStyles}</style>
      
      <div style={styles.pageContainer}>
        <div style={styles.pageOverlay}></div>
        <Container>
          <h1 style={styles.sectionTitle}>Galería Completa</h1>
          <div style={styles.titleUnderline}></div>
          <p style={{
            ...stylesPublic.typography.body.large,
            color: stylesPublic.colors.text.secondary,
            maxWidth: "800px",
            margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
            textAlign: "center"
          }}>
            Aquí puedes explorar toda nuestra colección de fotos artesanales. ¡Disfruta la galería!
          </p>
          
          <div className="gallery-grid" style={styles.galleryGrid}>
            {loading ? (
              <div className="text-center w-100">
                <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
                  <span className="visually-hidden">Cargando...</span>
                </div>
                <p style={{ 
                  ...stylesPublic.typography.body.base,
                  marginTop: stylesPublic.spacing.scale[2]
                }}>
                  Cargando imágenes...
                </p>
              </div>
            ) : images.length > 0 ? (
              images.map((image, index) => (
                <div
                  key={image.id}
                  className="gallery-item"
                  style={{
                    ...styles.galleryItem,
                    opacity: 1,
                    transform: 'translateY(0)',
                    transition: `all ${stylesPublic.animations.duration.slowest} ${stylesPublic.animations.easing['ease-in-out']} ${index * 0.05}s`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[3]})`;
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.xl;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.lg;
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
                      ...stylesPublic.typography.headings.h6,
                      margin: 0,
                      marginBottom: stylesPublic.spacing.scale[1],
                    }}>
                      {image.alt}
                    </h5>
                    <p style={{
                      ...stylesPublic.typography.body.small,
                      margin: 0,
                      opacity: 0.9
                    }}>
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center w-100">
                <p style={stylesPublic.typography.body.base}>No hay imágenes disponibles.</p>
              </div>
            )}
          </div>
        </Container>

        {/* Lightbox para imágenes */}
        {selectedImage && (
          <div style={styles.lightbox}>
            <button
              style={{ ...styles.navButton, left: stylesPublic.spacing.scale[5] }}
              onClick={() => navigateMedia('prev')}
            >
              <IonIcon icon={chevronBackOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
            </button>
            
            <div className="lightbox-wrapper" style={styles.lightboxImageWrapper}>
              <button 
                style={styles.closeButton} 
                onClick={closeLightbox}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary[500]}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary[500]}
              >
                <IonIcon icon={closeOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                style={styles.lightboxImage}
              />
              <div className="lightbox-caption" style={styles.lightboxCaption}>
                <h4 style={{ 
                  ...stylesPublic.typography.headings.h5,
                  marginBottom: stylesPublic.spacing.scale[2] 
                }}>
                  {selectedImage.alt}
                </h4>
                <p style={{ 
                  ...stylesPublic.typography.body.base,
                  margin: 0 
                }}>
                  {selectedImage.caption}
                </p>
              </div>
            </div>
            
            <button
              style={{ ...styles.navButton, right: stylesPublic.spacing.scale[5] }}
              onClick={() => navigateMedia('next')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary[500]}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary[500]}
            >
              <IonIcon icon={chevronForwardOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default GaleriaCompleta;