import { useState, useEffect, useRef } from 'react';
import { Container, Table, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { IonIcon } from '@ionic/react';
import { closeOutline, chevronBackOutline, chevronForwardOutline, playCircleOutline } from 'ionicons/icons';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import stylesPublic from '../../styles/stylesPublic';
import api from '../../services/api';

const Destacados = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState('fotos');
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);  const videoRefs = useRef([]);
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook para detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    },    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: stylesPublic.spacing.lg,
      marginTop: stylesPublic.spacing.xl,
      padding: `0 ${stylesPublic.spacing.md}`
    },reelsCarousel: {
      marginTop: stylesPublic.spacing.xl,
      padding: `0 ${stylesPublic.spacing.lg}`,
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
    },    reelItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: stylesPublic.borders.radius.card,
      boxShadow: stylesPublic.shadows.card,
      cursor: 'pointer',
      aspectRatio: '9/16',
      height: '400px',
      margin: `0 ${stylesPublic.spacing.md}`,
      transition: stylesPublic.transitions.preset.bounce,
      background: stylesPublic.colors.background.main,
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
    },    lightbox: {
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
      overflow: 'auto'
    },lightboxImageWrapper: {
      position: 'relative',
      maxWidth: '80%',
      maxHeight: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },    lightboxVideoWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '85vw',
      maxHeight: '85vh',
      margin: '0 auto'
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
    },    lightboxVideo: {
      width: '100%',
      maxWidth: '800px',
      height: '450px',
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: `0 4px 20px rgba(0, 0, 0, 0.3)`
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
    },    navButton: {
      position: 'absolute',
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
    },
    sectionHeader: {
      position: 'relative',
      marginBottom: stylesPublic.spacing.lg,
    },
    viewAllLink: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: stylesPublic.colors.primary.main,
      color: stylesPublic.colors.background.alt,
      padding: `${stylesPublic.spacing.sm} ${stylesPublic.spacing.md}`,
      borderRadius: stylesPublic.borders.radius.button,
      textDecoration: 'none',
      fontSize: stylesPublic.typography.fontSize.sm,
      fontWeight: stylesPublic.typography.fontWeight.semiBold,
      transition: stylesPublic.transitions.preset.buttonHover,
      zIndex: stylesPublic.utils.zIndex.raised,
    }
  };

  // Transformar los datos de fotos de la API para usarlos en la galería
  const images = fotos.map(foto => ({
    id: foto._id,
    src: foto.url,
    alt: foto.titulo,
    caption: foto.descripcion
  }));
  // Transformar los datos de videos de la API para usarlos en el carousel
  const reels = videos.map(video => ({
    id: video._id,
    src: video.url,
    previewSrc: video.miniatura || video.url, // Usar miniatura si está disponible
    title: video.titulo || 'Video sin título',
    description: video.descripcion || 'Sin descripción'
  }));

  // Datos de eventos destacados
  const events = [
    {
      id: 1,
      date: '15/07/2024',
      name: 'Exposición Premium "Arte Textil"',
      location: 'Galería Nacional, CDMX',
      description: 'Exhibición exclusiva de nuestras piezas más destacadas'
    },
    {
      id: 2,
      date: '22/08/2024',
      name: 'Taller Maestro de Bordado Huasteco',
      location: 'Centro Cultural, San Luis Potosí',
      description: 'Experiencia premium con nuestras mejores artesanas'
    },
    {
      id: 3,
      date: '10/09/2024',
      name: 'Presentación Colección Especial',
      location: 'Fashion Week, Tampico',
      description: 'Lanzamiento de nuestra línea más exclusiva'
    },
    {
      id: 4,
      date: '05/10/2024',
      name: 'Gala "Raíces Huastecas Premium"',
      location: 'Palacio de Bellas Artes, CDMX',
      description: 'Evento de gala con nuestras creaciones destacadas'
    }
  ];  // Efecto para cargar las fotos destacadas desde la API
  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true);
        const data = await api.get('/public/galeria/fotos');
        setFotos(data);
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar las fotos destacadas:', error);
        setLoading(false);
      }
    };

    fetchFotos();
  }, []);

  // Efecto para cargar los videos desde la API
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await api.get('/videos');
        setVideos(data);
      } catch (error) {
        console.error('Error al cargar los videos:', error);
      }
    };

    fetchVideos();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Agregar estilos CSS personalizados para el carousel
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .slick-slide {
        padding: 0 8px;
      }
      .slick-track {
        display: flex;
        align-items: center;
      }
      .slick-slide > div {
        height: 100%;
      }
      .slick-dots {
        bottom: -50px;
      }
      .slick-dots li button:before {
        color: ${stylesPublic.colors.primary.main};
        font-size: 12px;
      }
      .slick-dots li.slick-active button:before {
        color: ${stylesPublic.colors.secondary.main};
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
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
  };  const closeLightbox = () => {
    setSelectedImage(null);
    setSelectedVideo(null);
    document.body.style.overflow = 'auto';
    
    // Pause all videos when closing lightbox
    videoRefs.current.forEach((video) => {
      if (video) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch (error) {
          console.warn('Error pausing video:', error);
        }
      }
    });

    // También pausar el video del lightbox si existe
    const lightboxVideo = document.querySelector('video[controls]');
    if (lightboxVideo) {
      lightboxVideo.pause();
    }
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
      try {
        if (play) {
          video.play().catch(() => {
            // Silently handle autoplay restrictions
          });
        } else {
          video.pause();
          video.currentTime = 0;
        }
      } catch (error) {
        console.warn('Error handling video hover:', error);
      }
    }
  };
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false, // Sin flechas
    autoplay: true, // Avance automático
    autoplaySpeed: 3500, // Tiempo en ms entre slides (3.5 segundos)
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: '40px'
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
              Contenido Destacado
            </h1>
            <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px", fontFamily: stylesPublic.typography.fontFamily.heading }}>
              Descubre lo mejor de nuestras creaciones artesanales huastecas
            </p>
          </Container>
        </div>        {/* Sección de Eventos Destacados */}
        <section style={{ marginBottom: stylesPublic.spacing['4xl'] }}>
          <h2 style={styles.sectionTitle}>Eventos Destacados</h2>
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
        </section>        {/* Pestañas de Contenido Destacado */}
        <section style={{ marginBottom: stylesPublic.spacing['4xl'] }}>
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
              Fotos Destacadas
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
              Videos Destacados
            </button>
          </div>

          {activeTab === 'fotos' ? (
            <>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Creaciones Destacadas</h2>
                <Link 
                  to="/catalogofotos" 
                  style={styles.viewAllLink}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary.main;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = stylesPublic.colors.primary.main;
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  Ver galería completa
                </Link>
              </div>
              <div style={styles.titleUnderline}></div>
              <p className="text-center" style={{ 
                fontSize: stylesPublic.typography.fontSize.lg, 
                fontWeight: stylesPublic.typography.fontWeight.light, 
                color: stylesPublic.colors.text.secondary, 
                maxWidth: "800px", 
                margin: `0 auto ${stylesPublic.spacing.xl}`, 
                letterSpacing: stylesPublic.typography.letterSpacing.wide 
              }}>
                Nuestras piezas más especiales seleccionadas especialmente para ti
              </p>              <div style={{
                ...styles.galleryGrid,
                gap: stylesPublic.spacing.lg,
                marginTop: stylesPublic.spacing['2xl']
              }}>
                {loading ? (
                  <div className="text-center w-100" style={{ gridColumn: '1 / -1' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando contenido destacado...</p>
                  </div>
                ) : images.length > 0 ? (
                  images.slice(0, 3).map((image, index) => (
                  <div
                    key={image.id}
                    style={{
                      ...styles.galleryItem,
                      opacity: animate ? 1 : 0,
                      transform: animate ? 'translateY(0)' : 'translateY(20px)',
                      transition: `all ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${index * 0.15}s`,
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-8px)';
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
                    />                    <div style={styles.captionOverlay}>
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
                ))) : (
                  <div className="text-center w-100" style={{ gridColumn: '1 / -1' }}>
                    <p>No hay contenido destacado disponible.</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <h2 style={styles.sectionTitle}>Videos Destacados</h2>
              <div style={styles.titleUnderline}></div>
              <p className="text-center" style={{ 
                fontSize: stylesPublic.typography.fontSize.lg, 
                fontWeight: stylesPublic.typography.fontWeight.light, 
                color: stylesPublic.colors.text.secondary, 
                maxWidth: "800px", 
                margin: `0 auto ${stylesPublic.spacing.xl}`, 
                letterSpacing: stylesPublic.typography.letterSpacing.wide 
              }}>
                Los momentos más especiales de nuestro trabajo artesanal
              </p>              <div style={{
                ...styles.reelsCarousel,
                marginTop: stylesPublic.spacing['2xl'],
                marginBottom: stylesPublic.spacing['2xl']
              }}>
                {reels.length > 0 ? (
                  <Slider {...sliderSettings}>
                    {reels.map((reel, index) => (
                    <div key={reel.id} style={{ padding: `0 ${stylesPublic.spacing.sm}` }}>
                      <Card
                        style={{
                          ...styles.reelItem,
                          opacity: animate ? 1 : 0,
                          transform: animate ? 'translateY(0)' : 'translateY(20px)',
                          transition: `all ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${index * 0.1}s`,
                          padding: 0,
                          border: 'none',
                          margin: 0,
                          width: '100%'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'scale(1.03)';
                          e.currentTarget.style.boxShadow = stylesPublic.shadows.hover;
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = stylesPublic.shadows.card;
                        }}
                        onClick={() => openVideo(reel)}
                        onMouseEnter={() => handleVideoHover(index, true)}
                        onMouseLeave={() => handleVideoHover(index, false)}
                      >
                        <div style={{ position: 'relative', width: '100%', height: '100%' }}>                          <video
                            ref={(el) => (videoRefs.current[index] = el)}
                            src={reel.previewSrc || reel.src}
                            muted
                            loop
                            style={styles.reelVideo}
                            poster={reel.previewSrc}
                          />
                          <div style={styles.playIcon}>
                            <IonIcon icon={playCircleOutline} style={{ fontSize: '50px' }} />
                          </div>
                          <Card.Body style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent)',
                            padding: stylesPublic.spacing.md,
                            color: 'white'
                          }}>
                            <Card.Title style={{ 
                              fontSize: stylesPublic.typography.fontSize.md,
                              fontWeight: stylesPublic.typography.fontWeight.semiBold,
                              marginBottom: stylesPublic.spacing.xs,
                              lineHeight: '1.2'
                            }}>{reel.title}</Card.Title>
                            <Card.Text style={{
                              fontSize: stylesPublic.typography.fontSize.xs,
                              opacity: '0.9',
                              lineHeight: '1.3',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}>{reel.description}</Card.Text>
                          </Card.Body>
                        </div>
                      </Card>                    </div>
                  ))}
                </Slider>
                ) : (
                  <div className="text-center w-100" style={{ 
                    padding: stylesPublic.spacing.xl,
                    backgroundColor: stylesPublic.colors.background.main,
                    borderRadius: stylesPublic.borders.radius.lg,
                    margin: `0 ${stylesPublic.spacing.md}`
                  }}>
                    <p style={{ 
                      fontSize: stylesPublic.typography.fontSize.lg,
                      color: stylesPublic.colors.text.secondary
                    }}>No hay videos disponibles en este momento.</p>
                  </div>
                )}
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
      )}      {/* Lightbox para videos */}
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
          
          <div style={styles.lightboxVideoWrapper}>
            <button 
              style={styles.closeButton} 
              onClick={closeLightbox}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary.main}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary.main}
            >
              <IonIcon icon={closeOutline} style={{ fontSize: '24px' }} />
            </button>            <video
              controls
              autoPlay
              src={selectedVideo.src}
              style={{
                ...styles.lightboxVideo,
                maxWidth: isMobile ? '90vw' : '800px',
                height: isMobile ? '250px' : '450px'
              }}
            >
              Tu navegador no soporta la reproducción de video.
            </video>
            
            <div style={{
              position: 'relative',
              marginTop: stylesPublic.spacing.md,
              textAlign: 'center',
              color: stylesPublic.colors.background.alt,
              background: 'rgba(0, 0, 0, 0.7)',
              padding: stylesPublic.spacing.md,
              borderRadius: stylesPublic.borders.radius.md,
              maxWidth: '800px',
              width: '100%'
            }}>
              <h4 style={{ 
                marginBottom: stylesPublic.spacing.sm, 
                fontWeight: stylesPublic.typography.fontWeight.semiBold,
                fontSize: stylesPublic.typography.fontSize.lg
              }}>{selectedVideo.title}</h4>
              <p style={{ 
                margin: 0, 
                fontSize: stylesPublic.typography.fontSize.sm,
                opacity: 0.9
              }}>{selectedVideo.description}</p>
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

export default Destacados;
