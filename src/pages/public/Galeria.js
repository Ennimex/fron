import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [animate, setAnimate] = useState(false);

  const colors = {
    deepRed: '#A91B0D',
    emeraldGreen: '#2E7D32',
    warmBeige: '#F5E8C7',
    vibrantYellow: '#FFC107',
    darkGrey: '#4A4A4A',
  };

  const styles = {
    pageContainer: {
      backgroundColor: colors.warmBeige,
      minHeight: '100vh',
      paddingTop: '30px',
      paddingBottom: '60px',
    },
    hero: {
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.85), rgba(44, 107, 62, 0.9)), url('https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940')`,
      padding: '80px 0',
      color: colors.warmBeige,
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
      backgroundImage: `radial-gradient(${colors.warmBeige} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.1,
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '400px 1fr',
      gap: '30px',
      padding: '0 20px',
      '@media (max-width: 992px)': {
        gridTemplateColumns: '1fr',
      }
    },
    eventsSection: {
      width: '100%',
      backgroundColor: colors.warmBeige,
      borderRadius: '15px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    eventsTitle: {
      fontSize: '28px',
      fontWeight: 700,
      color: colors.deepRed,
      textAlign: 'center',
      marginBottom: '20px',
    },
    eventsTable: {
      backgroundColor: '#FFFFFF',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
      border: `2px solid ${colors.emeraldGreen}`,
      overflow: 'hidden',
      fontSize: '14px',
    },
    tableHeader: {
      background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`,
      color: colors.warmBeige,
      fontWeight: 600,
      padding: '12px',
    },
    tableCell: {
      padding: '12px',
      borderBottom: `1px solid ${colors.warmBeige}`,
      verticalAlign: 'middle',
    },
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '20px',
    },
    galleryItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      height: '250px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    },
    lightboxButton: {
      backgroundColor: colors.deepRed,
      color: colors.warmBeige,
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
        backgroundColor: colors.emeraldGreen,
      }
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
    lightboxImageWrapper: {
      position: 'relative',
      maxWidth: '70%',
      maxHeight: '70%',
    },
    lightboxImage: {
      maxWidth: '100%',
      maxHeight: '70vh',
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
    },
    lightboxCaption: {
      position: 'absolute',
      bottom: '30px',
      color: colors.warmBeige,
      fontSize: '18px',
      textAlign: 'center',
      background: 'rgba(0, 0, 0, 0.5)',
      padding: '10px 20px',
      borderRadius: '8px',
    },
    closeButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: colors.deepRed,
      color: colors.warmBeige,
      border: 'none',
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
    },
  };

  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
      alt: 'Danza Huasteca',
      caption: 'Tradición y elegancia en la danza huasteca.'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
      alt: 'Danza Huasteca',
      caption: 'Celebración cultural en la danza huasteca.'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
      alt: 'Danza Huasteca',
      caption: 'Ritmos y colores de la danza huasteca.'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
      alt: 'Danza Huasteca',
      caption: 'Expresión artística en la danza huasteca.'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
      alt: 'Danza Huasteca',
      caption: 'Tradición y cultura en la danza huasteca.'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940',
      alt: 'Danza Huasteca',
      caption: 'Arte y pasión en la danza huasteca.'
    }
  ];

  const events = [
    {
      id: 1,
      date: '20/06/24',
      name: 'Festival Huasteco',
      location: 'Plaza Huejutla',
      description: 'Presentación de danzas tradicionales huastecas con grupos locales.'
    },
    {
      id: 2,
      date: '15/07/24',
      name: 'Noche Cultural',
      location: 'Centro Cultural',
      description: 'Exhibición de música y danza huasteca con artistas invitados.'
    },
    {
      id: 3,
      date: '10/08/24',
      name: 'Tradiciones',
      location: 'Auditorio',
      description: 'Festival cultural con demostraciones de bailes tradicionales.'
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const openLightbox = (image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigateImage = (direction) => {
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    if (newIndex < 0) newIndex = images.length - 1;
    if (newIndex >= images.length) newIndex = 0;
    setSelectedImage(images[newIndex]);
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.hero}>
        <div style={styles.heroPattern}></div>
        <Container>
          <h1 className="display-3 fw-bold mb-4">
            Galería Huasteca
          </h1>
          <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px" }}>
            Explora nuestra colección de momentos mágicos en la danza huasteca.
          </p>
        </Container>
      </div>

      <Container>
        <div style={styles.contentGrid}>
          <div style={styles.eventsSection}>
            <h2 style={styles.eventsTitle}>Próximos Eventos</h2>
            <Table responsive style={styles.eventsTable}>
              <thead style={styles.tableHeader}>
                <tr>
                  <th style={styles.tableCell}>Fecha</th>
                  <th style={styles.tableCell}>Evento</th>
                  <th style={styles.tableCell}>Lugar</th>
                  <th style={styles.tableCell}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event, index) => (
                  <tr
                    key={event.id}
                    style={{
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(20px)',
                      transition: `opacity 0.8s ease ${0.6 + index * 0.1}s, transform 0.8s ease ${0.6 + index * 0.1}s`,
                    }}
                  >
                    <td style={styles.tableCell}>{event.date}</td>
                    <td style={styles.tableCell}>{event.name}</td>
                    <td style={styles.tableCell}>{event.location}</td>
                    <td style={styles.tableCell}>{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          <div style={styles.galleryGrid}>
            {images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  ...styles.galleryItem,
                  transition: `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`
                }}
                onClick={() => openLightbox(image)}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  style={styles.galleryImage}
                />
                <div style={styles.captionOverlay}>
                  <p>{image.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>

      {selectedImage && (
        <div style={styles.lightbox}>
          <button
            style={{ ...styles.lightboxButton, left: '20px' }}
            onClick={() => navigateImage('prev')}
          >
            <IonIcon icon={chevronBackOutline} style={{ fontSize: '24px' }} />
          </button>
          <div style={styles.lightboxImageWrapper}>
            <button style={styles.closeButton} onClick={closeLightbox}>
              <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={styles.lightboxImage}
            />
          </div>
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