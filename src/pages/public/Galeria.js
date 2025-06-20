import { useState, useEffect, useRef } from 'react';
import { Container, Table, Card } from 'react-bootstrap';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline, playCircleOutline } from 'ionicons/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import stylesPublic from '../../styles/stylesPublic';

const Galeria = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState('fotos');
  const videoRefs = useRef([]);

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
    },
    hero: {
      backgroundImage: stylesPublic.colors.background.gradient.accent,
      padding: '80px 0',
      color: stylesPublic.colors.background.alt,
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
      parliamentary: `radial-gradient(${stylesPublic.colors.background.alt} 1px, transparent 1px)`,
      backgroundSize: '20px 20px',
      opacity: 0.1,
    },
    sectionTitle: {
      fontFamily: stylesPublic.typography.fontFamily.heading,
      fontSize: stylesPublic.typography.fontSize.h2,
      fontWeight: stylesPublic.typography.fontWeight.semiBold,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.md,
      position: "relative",
      textAlign: "center"
    },
    titleUnderline: {
      ...stylesPublic.elements.decorative.underline,
    },
    contentGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: stylesPublic.spacing['2xl'],
      padding: `0 ${stylesPublic.spacing.md}`,
    },
    eventsSection: {
      width: '100%',
      backgroundColor: stylesPublic.colors.background.main,
      borderRadius: stylesPublic.borders.radius.lg,
      padding: stylesPublic.spacing.xl,
      boxShadow: stylesPublic.shadows.md,
      border: `1px solid ${stylesPublic.colors.primary.light}`,
    },
    eventsTitle: {
      fontSize: stylesPublic.typography.fontSize['2xl'],
      fontWeight: stylesPublic.typography.fontWeight.bold,
      color: stylesPublic.colors.primary.main,
      textAlign: 'center',
      marginBottom: stylesPublic.spacing.md,
    },
    eventsTable: {
      backgroundColor: stylesPublic.colors.background.main,
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.md,
      border: `1px solid ${stylesPublic.colors.secondary.main}`,
      overflow: 'hidden',
      fontSize: stylesPublic.typography.fontSize.sm,
    },
    tableHeader: {
      background: stylesPublic.colors.background.gradient.accent,
      color: stylesPublic.colors.background.alt,
      fontWeight: stylesPublic.typography.fontWeight.semiBold,
      padding: stylesPublic.spacing.md,
    },
    tableCell: {
      padding: stylesPublic.spacing.md,
      borderBottom: `1px solid ${stylesPublic.colors.background.alt}`,
      verticalAlign: 'middle',
    },
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: stylesPublic.spacing.md,
      marginTop: stylesPublic.spacing.xl
    },
    reelsCarousel: {
      marginTop: stylesPublic.spacing.xl,
      padding: `0 ${stylesPublic.spacing.md}`,
      position: 'relative',
    },
    galleryItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: stylesPublic.borders.radius.card,
      boxShadow: stylesPublic.shadows.card,
      cursor: 'pointer',
      height: '350px',
      transition: stylesPublic.transitions.preset.bounce,
    },
    reelItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: stylesPublic.borders.radius.card,
      boxShadow: stylesPublic.shadows.card,
      cursor: 'pointer',
      aspectRatio: '9/16',
      height: '450px',
      margin: `0 ${stylesPublic.spacing.sm}`,
      transition: stylesPublic.transitions.preset.bounce,
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `transform ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut}`
    },
    reelVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: stylesPublic.borders.radius.card,
    },
    reelThumbnail: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: stylesPublic.borders.radius.card,
    },
    playIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: '60px',
      color: 'rgba(255, 255, 255, 0.9)',
      zIndex: stylesPublic.utils.zIndex.raised,
      transition: `opacity ${stylesPublic.transitions.duration.normal} ${stylesPublic.transitions.easing.easeInOut}`,
    },
    captionOverlay: {
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
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`,
    },
    lightboxVideo: {
      width: '800px',
      maxWidth: '90vw',
      height: '450px',
      maxHeight: '90vh',
      borderRadius: stylesPublic.borders.radius.md
    },
    lightboxCaption: {
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
      width: '80%'
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
    tabButtons: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: stylesPublic.spacing.xl,
      gap: stylesPublic.spacing.md
    },
    tabButton: {
      padding: `${stylesPublic.spacing.sm} ${stylesPublic.spacing.lg}`,
      borderRadius: stylesPublic.borders.radius.button,
      border: 'none',
      background: 'transparent',
      color: stylesPublic.colors.text.primary,
      fontWeight: stylesPublic.typography.fontWeight.semiBold,
      cursor: 'pointer',
      transition: stylesPublic.transitions.preset.buttonHover,
    },
    carouselArrow: {
      backgroundColor: stylesPublic.colors.primary.main,
      color: stylesPublic.colors.background.alt,
      borderRadius: '50%',
      width: '40px',
      height: '40px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: stylesPublic.utils.zIndex.dropdown,
      transition: `background ${stylesPublic.transitions.duration.normal} ${stylesPublic.transitions.easing.easeInOut}`,
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
      previewSrc: 'https://assets.mixkit.co/videos/preview/mixkit-artisan-weaving-a-fabric-on-a-traditional-loom-51794-large.mp4',
      title: 'Proceso de bordado tradicional',
      description: 'Conoce cómo nuestras artesanas crean cada pieza'
    },
    {
      id: 2,
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      previewSrc: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-a-photoshoot-51798-large.mp4',
      title: 'Desfile de moda huasteca',
      description: 'Nuestra colección en la pasarela internacional'
    },
    {
      id: 3,
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      previewSrc: 'https://assets.mixkit.co/videos/preview/mixkit-woman-weaving-on-a-loom-51795-large.mp4',
      title: 'Entrevista con artesanas',
      description: 'Historias detrás de cada creación'
    },
    {
      id: 4,
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      previewSrc: 'https://assets.mixkit.co/videos/preview/mixkit-model-in-traditional-clothing-posing-51799-large.mp4',
      title: 'Tutorial: Cuidado de prendas',
      description: 'Cómo mantener tus prendas artesanales'
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
    videoRefs.current.forEach((video) => {
      if (video) video.pause();
    });
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

  const handleVideoHover = (index, play) => {
    const video = videoRefs.current[index];
    if (video) {
      if (play) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    nextArrow: (
      <div>
        <div style={styles.carouselArrow}>
          <IonIcon icon={chevronForwardOutline} style={{ fontSize: '24px' }} />
        </div>
      </div>
    ),
    prevArrow: (
      <div>
        <div style={styles.carouselArrow}>
          <IonIcon icon={chevronBackOutline} style={{ fontSize: '24px' }} />
        </div>
      </div>
    ),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          vertical: true,
          verticalSwiping: true,
        }
      }
    ]
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.pageOverlay}></div>
      <Container>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.heroPattern}></div>
          <Container>
            <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: stylesPublic.typography.fontFamily.heading }}>
              Galería Artesanal
            </h1>
            <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px", fontFamily: stylesPublic.typography.fontFamily.heading }}>
              Descubre la belleza y tradición de nuestras creaciones huastecas
            </p>
          </Container>
        </div>

        {/* Sección de Eventos */}
        <section style={{ marginBottom: stylesPublic.spacing['3xl'] }}>
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
                      transition: `opacity ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${0.6 + index * 0.1}s, transform ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${0.6 + index * 0.1}s`,
                      backgroundColor: index % 2 === 0 ? stylesPublic.colors.background.main : stylesPublic.colors.background.alt
                    }}
                  >
                    <td style={styles.tableCell}>{event.date}</td>
                    <td style={{ ...styles.tableCell, fontWeight: stylesPublic.typography.fontWeight.semiBold }}>{event.name}</td>
                    <td style={styles.tableCell}>{event.location}</td>
                    <td style={styles.tableCell}>{event.description}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>

        {/* Pestañas de Galería y Reels */}
        <section style={{ marginBottom: stylesPublic.spacing['3xl'] }}>
          <div style={styles.tabButtons}>
            <button 
              style={{ 
                ...styles.tabButton, 
                ...(activeTab === 'fotos' ? { 
                  background: stylesPublic.colors.background.gradient.accent, 
                  color: 'white' 
                } : {}) 
              }}
              onClick={() => setActiveTab('fotos')}
            >
              Galería
            </button>
            <button 
              style={{ 
                ...styles.tabButton, 
                ...(activeTab === 'videos' ? { 
                  background: stylesPublic.colors.background.gradient.accent, 
                  color: 'white' 
                } : {}) 
              }}
              onClick={() => setActiveTab('videos')}
            >
              Reels
            </button>
          </div>

          {activeTab === 'fotos' ? (
            <>
              <h2 style={styles.sectionTitle}>Nuestros Productos</h2>
              <div style={styles.titleUnderline}></div>
              <p className="text-center" style={{ 
                fontSize: stylesPublic.typography.fontSize.lg, 
                fontWeight: stylesPublic.typography.fontWeight.light, 
                color: stylesPublic.colors.text.secondary, 
                maxWidth: "800px", 
                margin: `0 auto ${stylesPublic.spacing.xl}`, 
                letterSpacing: stylesPublic.typography.letterSpacing.wide 
              }}>
                Cada pieza cuenta una historia de tradición y artesanía
              </p>
                <div style={styles.galleryGrid}>
                {images.map((image, index) => (                  <div
                    key={image.id}
                    style={{
                      ...styles.galleryItem,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${index * 0.1}s`,
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
                      <p style={{ 
                        margin: 0, 
                        fontWeight: stylesPublic.typography.fontWeight.medium 
                      }}>{image.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.sectionTitle}>Reels Artesanales</h2>
              <div style={styles.titleUnderline}></div>
              <p className="text-center" style={{ 
                fontSize: stylesPublic.typography.fontSize.lg, 
                fontWeight: stylesPublic.typography.fontWeight.light, 
                color: stylesPublic.colors.text.secondary, 
                maxWidth: "800px", 
                margin: `0 auto ${stylesPublic.spacing.xl}`, 
                letterSpacing: stylesPublic.typography.letterSpacing.wide 
              }}>
                Descubre el proceso detrás de cada creación
              </p>
              
              <div style={styles.reelsCarousel}>
                <Slider {...sliderSettings}>
                  {reels.map((reel, index) => (
                    <div key={reel.id}>                      <Card
                        style={{
                          ...styles.reelItem,
                          opacity: animate ? 1 : 0,
                          transform: animate ? 'translateY(0)' : 'translateY(20px)',
                          transition: `all ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${index * 0.1}s`,
                          padding: 0,
                          border: 'none'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.05)';
                          e.currentTarget.style.boxShadow = stylesPublic.shadows.hover;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = stylesPublic.shadows.card;
                        }}
                        onClick={() => openVideo(reel)}
                        onMouseEnter={() => handleVideoHover(index, true)}
                        onMouseLeave={() => handleVideoHover(index, false)}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                          <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={reel.previewSrc}
                            muted
                            loop
                            style={styles.reelVideo}
                            poster={`https://img.youtube.com/vi/${reel.src.split('/').pop()}/maxresdefault.jpg`}
                          />
                          <div style={styles.playIcon}>
                            <IonIcon icon={playCircleOutline} style={{ fontSize: '60px' }} />
                          </div>
                          <Card.Body style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3), transparent)',
                            padding: stylesPublic.spacing.md,
                            color: 'white'
                          }}>
                            <Card.Title style={{ 
                              fontSize: stylesPublic.typography.fontSize.lg,
                              fontWeight: stylesPublic.typography.fontWeight.semiBold,
                              marginBottom: stylesPublic.spacing.xs
                            }}>{reel.title}</Card.Title>
                            <Card.Text style={{
                              fontSize: stylesPublic.typography.fontSize.sm,
                              opacity: '0.9'
                            }}>{reel.description}</Card.Text>
                          </Card.Body>
                        </div>
                      </Card>
                    </div>
                  ))}
                </Slider>
              </div>
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
            <div style={styles.lightboxCaption}>{selectedImage.caption}</div>
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

      {/* Lightbox para videos */}
      {selectedVideo && (
        <div style={styles.lightbox}>
          <button
            style={{ ...styles.navButton, left: '20px' }}
            onClick={() => navigateMedia('prev')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary.main}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary.main}
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

export default Galeria;