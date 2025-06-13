import { useState, useEffect } from 'react';
import { Container, Table, Card } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline, playCircleOutline } from 'ionicons/icons';
import ReelsCarousel from '../../components/shared/ReelsCarousel';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState('fotos');

  // Colores alineados con la paleta de La Aterciopelada
  const colors = {
    deepRed: '#ff0070',
    emeraldGreen: '#1f8a80',
    warmBeige: '#F5E8C7',
    vibrantYellow: '#FFC107',
    darkGrey: '#4A4A4A',
    softPink: '#ff8090',
    darkPurple: '#23102d'
  };

  const styles = {
    pageContainer: {
      background: `linear-gradient(135deg, #fffffc 0%, #ff8090 30%, rgba(31, 138, 128, 0.25) 60%, #fffffc 100%)`,
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
      background: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="floral-pattern" patternUnits="userSpaceOnUse" width="50" height="50"><circle cx="15" cy="15" r="1.5" fill="%23ff0070" opacity="0.45"/><circle cx="35" cy="25" r="1" fill="%231f8a80" opacity="0.4"/><circle cx="25" cy="35" r="1.2" fill="%23ff1030" opacity="0.42"/></pattern></defs><rect width="100" height="100" fill="url(%23floral-pattern)"/></svg>')`,
      opacity: 0.8,
      zIndex: 1,
      pointerEvents: 'none',
    },
    hero: {
      backgroundImage: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`,
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
    sectionTitle: {
      fontFamily: "'Playfair Display', serif",
      fontSize: "clamp(2rem, 4vw, 2.8rem)",
      fontWeight: 600,
      color: colors.darkPurple,
      marginBottom: "1.5rem",
      position: "relative",
      textAlign: "center"
    },
    titleUnderline: {
      display: "block",
      width: "60px",
      height: "2px",
      background: `linear-gradient(90deg, ${colors.deepRed}, ${colors.emeraldGreen})`,
      borderRadius: "1px",
      margin: "15px auto",
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: '50px',
      padding: '0 20px',
    },
    eventsSection: {
      width: '100%',
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      border: `1px solid ${colors.softPink}`,
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
      border: `1px solid ${colors.emeraldGreen}`,
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
      marginTop: '30px'
    },
    galleryItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      boxShadow: '0 8px 16px rgba(255, 0, 112, 0.2), 0 4px 8px rgba(31, 138, 128, 0.15)',
      cursor: 'pointer',
      height: '250px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 12px 20px rgba(255, 0, 112, 0.3)'
      }
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: 'transform 0.5s ease'
    },
    captionOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
      color: 'white',
      padding: '15px',
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
      zIndex: 1000,
      padding: '20px',
    },
    lightboxImageWrapper: {
      position: 'relative',
      maxWidth: '80%',
      maxHeight: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    lightboxContent: {
      maxWidth: '90%',
      maxHeight: '90%'
    },
    lightboxImage: {
      maxWidth: '100%',
      maxHeight: '80vh',
      objectFit: 'contain',
      borderRadius: '8px',
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
    },
    lightboxVideo: {
      width: '800px',
      maxWidth: '90vw',
      height: '450px',
      maxHeight: '90vh',
      borderRadius: '8px'
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
      left: '50%',
      transform: 'translateX(-50%)',
      width: '80%'
    },
    closeButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
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
      zIndex: 1001,
      '&:hover': {
        backgroundColor: colors.emeraldGreen
      }
    },
    navButton: {
      position: 'fixed',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: colors.deepRed,
      color: colors.warmBeige,
      border: 'none',
      borderRadius: '50%',
      width: '50px',
      height: '50px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      zIndex: 1001,
      '&:hover': {
        backgroundColor: colors.emeraldGreen
      }
    },
    tabButtons: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '30px',
      gap: '15px'
    },
    tabButton: {
      padding: '10px 25px',
      borderRadius: '30px',
      border: 'none',
      background: 'transparent',
      color: colors.darkPurple,
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      '&.active': {
        background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`,
        color: 'white'
      }
    }
  };

  // Datos de ejemplo - imágenes de productos y eventos
  const images = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2787',
      alt: 'Vestido tradicional huasteco',
      caption: 'Vestido tradicional con bordados artesanales'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2787',
      alt: 'Bordados huastecos',
      caption: 'Detalle de bordados tradicionales'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=2942',
      alt: 'Accesorios artesanales',
      caption: 'Collares y accesorios hechos a mano'
    },
    {
      id: 4,
      src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2874',
      alt: 'Tejidos tradicionales',
      caption: 'Tejidos con técnicas ancestrales'
    },
    {
      id: 5,
      src: 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?q=80&w=2942',
      alt: 'Modelo con vestido huasteco',
      caption: 'Nuestra colección primavera-verano'
    },
    {
      id: 6,
      src: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2787',
      alt: 'Detalle de bordado',
      caption: 'Cada puntada cuenta una historia'
    }
  ];

  const reels = [
    {
      id: 1,
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      videoId: 'dQw4w9WgXcQ',
      title: 'Proceso de bordado tradicional',
      description: 'Conoce cómo nuestras artesanas crean cada pieza única con técnicas ancestrales transmitidas de generación en generación.'
    },
    {
      id: 2,
      src: 'https://www.youtube.com/embed/9bZkp7q19f0',
      videoId: '9bZkp7q19f0',
      title: 'Desfile de moda huasteca',
      description: 'Nuestra colección en la pasarela internacional, fusionando tradición y modernidad en cada diseño.'
    },
    {
      id: 3,
      src: 'https://www.youtube.com/embed/ScMzIvxBSi4',
      videoId: 'ScMzIvxBSi4',
      title: 'Entrevista con artesanas',
      description: 'Historias detrás de cada creación contadas por las maestras que dan vida a nuestras piezas.'
    },
    {
      id: 4,
      src: 'https://www.youtube.com/embed/kJQP7kiw5Fk',
      videoId: 'kJQP7kiw5Fk',
      title: 'Tutorial: Cuidado de prendas',
      description: 'Aprende cómo mantener tus prendas artesanales en perfecto estado para que duren toda la vida.'
    },
    {
      id: 5,
      src: 'https://www.youtube.com/embed/L_jWHffIx5E',
      videoId: 'L_jWHffIx5E',
      title: 'Colores de la Huasteca',
      description: 'Descubre la paleta cromática que inspira nuestros diseños, extraída directamente de la naturaleza huasteca.'
    },
    {
      id: 6,
      src: 'https://www.youtube.com/embed/fJ9rUzIMcZQ',
      videoId: 'fJ9rUzIMcZQ',
      title: 'Técnicas ancestrales',
      description: 'Un viaje por las técnicas milenarias que preservamos y adaptamos para el mundo contemporáneo.'
    }
  ];

  const events = [
    {
      id: 1,
      date: '15/07/2024',
      name: 'Exposición de Arte Textil',
      location: 'Galería Municipal, Huejutla',
      description: 'Muestra de las mejores piezas artesanales de la región'
    },
    {
      id: 2,
      date: '22/08/2024',
      name: 'Taller de Bordado Huasteco',
      location: 'Casa de Cultura, San Luis Potosí',
      description: 'Aprende las técnicas tradicionales con maestras artesanas'
    },
    {
      id: 3,
      date: '10/09/2024',
      name: 'Feria Artesanal Anual',
      location: 'Plaza Principal, Tampico',
      description: 'Evento con más de 100 expositores de arte popular'
    },
    {
      id: 4,
      date: '05/10/2024',
      name: 'Pasarela "Raíces Huastecas"',
      location: 'Centro de Convenciones, CDMX',
      description: 'Moda contemporánea inspirada en tradiciones'
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
    setSelectedVideo(null);
    document.body.style.overflow = 'hidden';
  };

  const openVideo = (video) => {
    setSelectedVideo(video);
    setSelectedImage(null);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
  };

  const navigateMedia = (direction) => {
    if (selectedImage) {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      setSelectedImage(images[newIndex]);
    } else if (selectedVideo) {
      const currentIndex = reels.findIndex((vid) => vid.id === selectedVideo.id);
      let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
      if (newIndex < 0) newIndex = reels.length - 1;
      if (newIndex >= reels.length) newIndex = 0;
      setSelectedVideo(reels[newIndex]);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.pageOverlay}></div>
      <Container>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroPattern}></div>
          <Container>
            <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Galería Artesanal
            </h1>
            <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px", fontFamily: "'Playfair Display', serif" }}>
              Descubre la belleza y tradición de nuestras creaciones huastecas
            </p>
          </Container>
        </div>

        {/* Sección de Eventos */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={styles.sectionTitle}>Próximos Eventos</h2>
          <div style={styles.titleUnderline}></div>
          
          <div style={styles.eventsSection}>
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
                      backgroundColor: index % 2 === 0 ? 'white' : colors.warmBeige
                    }}
                  >
                    <td style={styles.tableCell}>{event.date}</td>
                    <td style={{ ...styles.tableCell, fontWeight: '600' }}>{event.name}</td>
                    <td style={styles.tableCell}>{event.location}</td>
                    <td style={styles.tableCell}>{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>

        {/* Pestañas de Galería y Reels */}
        <section style={{ marginBottom: '60px' }}>
          <div style={styles.tabButtons}>
            <button 
              style={{ ...styles.tabButton, ...(activeTab === 'fotos' ? { background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`, color: 'white' } : {}) }}
              onClick={() => setActiveTab('fotos')}
            >
              Galería
            </button>
            <button 
              style={{ ...styles.tabButton, ...(activeTab === 'videos' ? { background: `linear-gradient(135deg, ${colors.deepRed} 0%, ${colors.emeraldGreen} 100%)`, color: 'white' } : {}) }}
              onClick={() => setActiveTab('videos')}
            >
              Reels
            </button>
          </div>

          {activeTab === 'fotos' ? (
            <>
              <h2 style={styles.sectionTitle}>Nuestros Productos</h2>
              <div style={styles.titleUnderline}></div>
              <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: colors.darkGrey, maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
                Cada pieza cuenta una historia de tradición y artesanía
              </p>
              
              <div style={styles.galleryGrid}>
                {images.map((image, index) => (
                  <div
                    key={image.id}
                    style={{
                      ...styles.galleryItem,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all 0.8s ease ${index * 0.1}s`
                    }}
                    onClick={() => openLightbox(image)}
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      style={styles.galleryImage}
                    />
                    <div style={styles.captionOverlay}>
                      <p style={{ margin: 0, fontWeight: '500' }}>{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.sectionTitle}>Reels Artesanales</h2>
              <div style={styles.titleUnderline}></div>
              <p className="text-center" style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", fontWeight: 300, color: colors.darkGrey, maxWidth: "800px", margin: "0 auto 3rem", letterSpacing: "0.5px" }}>
                Descubre el proceso detrás de cada creación
              </p>
              
              <ReelsCarousel 
                reels={reels} 
                autoplay={true} 
                autoplayInterval={6000}
              />
            </>
          )}
        </section>
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
            <button style={styles.closeButton} onClick={closeLightbox}>
              <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
            </button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              style={styles.lightboxImage}
            />
            <div style={styles.lightboxCaption}>{selectedImage.caption}</div>
          </div>
          
          <button
            style={{ ...styles.navButton, right: '20px' }}
            onClick={() => navigateMedia('next')}
          >
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: '24px' }} />
          </button>
        </div>
      )}

      {/* Lightbox para videos */}
      {selectedVideo && (
        <div style={styles.lightbox}>
          <button
            style={{ ...styles.navButton, left: '20px' }}
            onClick={() => navigateMedia('prev')}
          >
            <IonIcon icon={chevronBackOutline} style={{ fontSize: '24px' }} />
          </button>
          
          <div style={styles.lightboxImageWrapper}>
            <button style={styles.closeButton} onClick={closeLightbox}>
              <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
            </button>
            <div style={styles.lightboxContent}>
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo.src}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={styles.lightboxVideo}
              ></iframe>
            </div>
            <div style={styles.lightboxCaption}>
              <h4>{selectedVideo.title}</h4>
              <p>{selectedVideo.description}</p>
            </div>
          </div>
          
          <button
            style={{ ...styles.navButton, right: '20px' }}
            onClick={() => navigateMedia('next')}
          >
            <IonIcon icon={chevronForwardOutline} style={{ fontSize: '24px' }} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Galeria;