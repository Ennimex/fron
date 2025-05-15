import { useState, useEffect } from 'react';
import { Container} from 'react-bootstrap';
import { colors, textStyles} from '../../styles/styles';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [animate, setAnimate] = useState(false);

  // Static dance images
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2940',
      alt: 'Ballet Clásico',
      caption: 'Elegancia en cada movimiento durante una clase de ballet.'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2940',
      alt: 'Salsa',
      caption: 'Energía y pasión en nuestra clase de salsa.'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2940',
      alt: 'Danza Contemporánea',
      caption: 'Expresión corporal en una coreografía contemporánea.'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2940',
      alt: 'Flamenco',
      caption: 'Fuerza y gracia en una presentación de flamenco.'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2940',
      alt: 'Ensayo de Ballet',
      caption: 'Preparación para un recital en nuestro estudio.'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1574169208507-84376144848b?q=80&w=2940',
      alt: 'Danza Jazz',
      caption: 'Dinamismo en una rutina de jazz.'
    }
  ];

  // Trigger animations on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Open lightbox
  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // Navigate to previous/next image
  const navigateImage = (direction) => {
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setSelectedImage(images[newIndex]);
  };

  const styles = {
    pageContainer: {
      backgroundColor: colors.warmWhite,
      minHeight: '100vh',
      paddingTop: '30px',
      paddingBottom: '60px',
    },
    hero: {
      background: `linear-gradient(135deg, ${colors.pinkBerry} 0%, ${colors.pinkDeep} 100%)`,
      padding: '80px 0',
      color: colors.warmWhite,
      marginBottom: '50px',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center',
    },
    heroPattern: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `radial-gradient(${colors.warmWhite} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.1,
    },
    title: {
      ...textStyles.title,
      color: colors.warmWhite,
      fontSize: '48px',
      marginBottom: '25px',
      fontWeight: 800,
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.8s ease, transform 0.8s ease',
    },
    subtitle: {
      ...textStyles.paragraph,
      color: colors.warmWhite,
      fontSize: '20px',
      maxWidth: '700px',
      margin: '0 auto',
      opacity: animate ? 0.9 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
    },
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
      padding: '0 20px',
    },
    galleryItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: `0 4px 15px rgba(0, 0, 0, 0.1)`,
      cursor: 'pointer',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      opacity: animate ? 1 : 0,
      transform: animate ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity 0.8s ease, transform 0.8s ease`,
    },
    galleryImage: {
      width: '100%',
      height: '250px',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
    },
    captionOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: `linear-gradient(to top, rgba(0,0,0,0.7), transparent)`,
      color: colors.warmWhite,
      padding: '15px',
      opacity: 0,
      transform: 'translateY(20px)',
      transition: 'opacity 0.3s ease, transform 0.3s ease',
    },
    captionText: {
      fontSize: '16px',
      margin: 0,
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
      zIndex: 1000,
      padding: '20px',
    },
    lightboxImage: {
      maxWidth: '90%',
      maxHeight: '80%',
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
    },
    lightboxCaption: {
      position: 'absolute',
      bottom: '30px',
      color: colors.warmWhite,
      fontSize: '18px',
      textAlign: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '10px 20px',
      borderRadius: '8px',
    },
    lightboxButton: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      background: colors.pinkBerry,
      color: colors.warmWhite,
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      '&:hover': {
        background: colors.pinkDeep,
      },
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      background: colors.pinkBerry,
      color: colors.warmWhite,
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      '&:hover': {
        background: colors.pinkDeep,
      },
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Hero Section */}
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <Container>
          <h1 style={styles.title}>Galería de Danza</h1>
          <p style={styles.subtitle}>
            Explora los momentos más memorables de nuestras clases, presentaciones y eventos en el estudio de danza.
          </p>
        </Container>
      </div>

      {/* Gallery Grid */}
      <Container>
        <div style={styles.galleryGrid}>
          {images.map((image, index) => (
            <div
              key={image.id}
              style={{
                ...styles.galleryItem,
                transitionDelay: `${index * 0.1}s`
              }}
              onClick={() => openLightbox(image)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 6px 20px rgba(0, 0, 0, 0.2)`;
                e.currentTarget.querySelector('.caption').style.opacity = 1;
                e.currentTarget.querySelector('.caption').style.transform = 'translateY(0)';
                e.currentTarget.querySelector('.image').style.transform = 'scale(1.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = `0 4px 15px rgba(0, 0, 0, 0.1)`;
                e.currentTarget.querySelector('.caption').style.opacity = 0;
                e.currentTarget.querySelector('.caption').style.transform = 'translateY(20px)';
                e.currentTarget.querySelector('.image').style.transform = 'scale(1)';
              }}
            >
              <img
                src={image.src}
                alt={image.alt}
                style={styles.galleryImage}
                className="image"
              />
              <div style={styles.captionOverlay} className="caption">
                <p style={styles.captionText}>{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div style={styles.lightbox}>
          <button style={styles.closeButton} onClick={closeLightbox}>
            <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
          </button>
          <button
            style={{ ...styles.lightboxButton, left: '20px' }}
            onClick={() => navigateImage('prev')}
          >
            <IonIcon icon={chevronBackOutline} style={{ fontSize: '24px' }} />
          </button>
          <img
            src={selectedImage.src}
            alt={selectedImage.alt}
            style={styles.lightboxImage}
          />
          <button
            style={{ ...styles.lightboxButton, right: '20px' }}
            onClick={() => navigateImage('next')}
          >
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: '24px' }} />
          </button>
          <div style={styles.lightboxCaption}>{selectedImage.caption}</div>
        </div>
      )}
    </div>
  );
};

export default Galeria;