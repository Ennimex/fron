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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= parseInt(stylesPublic.breakpoints.md));

  const videoRefs = useRef([]);
  const [fotos, setFotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hook para detectar cambios en el tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= parseInt(stylesPublic.breakpoints.md));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // CSS usando exclusivamente tokens del sistema refactorizado
  const cssStyles = `
    .slick-slide {
      padding: 0 ${stylesPublic.spacing.scale[2]};
    }
    .slick-track {
      display: flex;
      align-items: center;
    }
    .slick-slide > div {
      height: 100%;
    }
    .slick-dots {
      bottom: -${stylesPublic.spacing.scale[12]};
    }
    .slick-dots li button:before {
      color: ${stylesPublic.colors.primary[500]};
      font-size: ${stylesPublic.typography.scale.xs};
    }
    .slick-dots li.slick-active button:before {
      color: ${stylesPublic.colors.secondary[500]};
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale['2xl']} !important;
      }
      .hero-section p {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .hero-section {
        padding: ${stylesPublic.spacing.scale[20]} 0 !important;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.xl} !important;
      }
      .gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[4]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .hero-section {
        padding: ${stylesPublic.spacing.scale[15]} 0 !important;
      }
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.lg} !important;
      }
      .gallery-grid {
        grid-template-columns: 1fr !important;
        gap: ${stylesPublic.spacing.scale[2]} !important;
      }
      .table-cell {
        padding: ${stylesPublic.spacing.scale[2]} !important;
        font-size: ${stylesPublic.typography.scale.xs} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .hero-section h1 {
        font-size: ${stylesPublic.typography.scale.base} !important;
      }
      .tab-button {
        width: ${stylesPublic.spacing.scale[30]} !important;
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
    hero: {
      background: stylesPublic.colors.gradients.accent,
      padding: `${stylesPublic.spacing.scale[20]} 0`,
      color: stylesPublic.colors.text.inverse,
      marginBottom: stylesPublic.spacing.scale[12],
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
      background: `radial-gradient(${stylesPublic.colors.surface.primary} 1px, transparent 1px)`,
      backgroundSize: `${stylesPublic.spacing.scale[5]} ${stylesPublic.spacing.scale[5]}`,
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
    eventsSection: {
      width: '100%',
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.lg,
      padding: stylesPublic.spacing.scale[12],
      boxShadow: stylesPublic.shadows.md,
      border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.primary[300]}`,
    },
    eventsTable: {
      backgroundColor: stylesPublic.colors.surface.primary,
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.md,
      border: `${stylesPublic.borders.width[1]} solid ${stylesPublic.colors.secondary[500]}`,
      overflow: 'hidden',
      fontSize: stylesPublic.typography.scale.sm,
    },
    tableCell: {
      padding: stylesPublic.spacing.scale[4],
      borderBottom: `${stylesPublic.borders.width[1]} solid ${stylesPublic.borders.colors.default}`,
      verticalAlign: 'middle',
    },
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: stylesPublic.spacing.scale[6],
      marginTop: stylesPublic.spacing.scale[12],
      padding: `0 ${stylesPublic.spacing.scale[4]}`,
    },
    reelsCarousel: {
      marginTop: stylesPublic.spacing.scale[12],
      padding: `0 ${stylesPublic.spacing.scale[6]}`,
      position: 'relative',
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
    reelItem: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows.lg,
      cursor: 'pointer',
      aspectRatio: '9/16',
      height: stylesPublic.spacing.scale[100],
      margin: `0 ${stylesPublic.spacing.scale[4]}`,
      transition: stylesPublic.animations.transitions.base,
      background: stylesPublic.colors.surface.primary,
    },
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: stylesPublic.animations.transitions.transform
    },
    reelVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: stylesPublic.borders.radius.lg,
    },
    playIcon: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      fontSize: stylesPublic.typography.scale['4xl'],
      color: stylesPublic.colors.text.inverse,
      zIndex: stylesPublic.utils.zIndex.docked,
      transition: stylesPublic.animations.transitions.opacity,
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
      overflow: 'auto'
    },
    lightboxImageWrapper: {
      position: 'relative',
      maxWidth: '80%',
      maxHeight: '80%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    lightboxVideoWrapper: {
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      maxWidth: '85vw',
      maxHeight: '85vh',
      margin: '0 auto'
    },
    lightboxImage: {
      maxWidth: '100%',
      maxHeight: '80vh',
      objectFit: 'contain',
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.xl,
    },
    lightboxVideo: {
      width: '100%',
      maxWidth: stylesPublic.spacing.scale[200],
      height: stylesPublic.spacing.scale[113],
      borderRadius: stylesPublic.borders.radius.md,
      boxShadow: stylesPublic.shadows.xl
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
      width: '80%'
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
      position: 'absolute',
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
    tabButtons: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: stylesPublic.spacing.scale[12],
      gap: stylesPublic.spacing.scale[4],
    },
    tabButton: {
      padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[6]}`,
      borderRadius: stylesPublic.borders.radius.full,
      border: 'none',
      background: 'transparent',
      color: stylesPublic.colors.text.primary,
      fontWeight: stylesPublic.typography.weights.semibold,
      cursor: 'pointer',
      transition: stylesPublic.animations.transitions.base,
    },
    viewAllLink: {
      position: 'absolute',
      top: 0,
      right: 0,
      backgroundColor: stylesPublic.colors.primary[500],
      color: stylesPublic.colors.text.inverse,
      padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
      borderRadius: stylesPublic.borders.radius.full,
      textDecoration: 'none',
      fontSize: stylesPublic.typography.scale.sm,
      fontWeight: stylesPublic.typography.weights.semibold,
      transition: stylesPublic.animations.transitions.base,
      zIndex: stylesPublic.utils.zIndex.docked,
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
    previewSrc: video.miniatura || video.url,
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
  ];

  // Efecto para cargar las fotos destacadas desde la API
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
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    centerMode: false,
    variableWidth: false,
    responsive: [
      {
        breakpoint: parseInt(stylesPublic.breakpoints['2xl']),
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: parseInt(stylesPublic.breakpoints.md),
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: parseInt(stylesPublic.breakpoints.sm),
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: stylesPublic.spacing.scale[10]
        }
      }
    ]
  };

  return (
    <>
      <style>{cssStyles}</style>
      
      <div style={styles.pageContainer}>
        <div style={styles.pageOverlay}></div>
        <Container>
          {/* Hero Section */}
          <div style={styles.hero}>
            <div style={styles.heroPattern}></div>
            <Container>
              <h1 style={{ 
                ...stylesPublic.typography.headings.h1,
                marginBottom: stylesPublic.spacing.scale[6]
              }}>
                Contenido Destacado
              </h1>
              <p style={{ 
                ...stylesPublic.typography.body.large,
                maxWidth: "700px", 
                margin: "0 auto"
              }}>
                Descubre lo mejor de nuestras creaciones artesanales huastecas
              </p>
            </Container>
          </div>

          {/* Sección de Eventos Destacados */}
          <section style={{ marginBottom: stylesPublic.spacing.scale[16] }}>
            <h2 style={styles.sectionTitle}>Eventos Destacados</h2>
            <div style={styles.titleUnderline}></div>
            
            <div style={styles.eventsSection}>
              <Table responsive style={styles.eventsTable}>
                <thead style={styles.tableHeader}>
                  <tr>
                    <th className="table-cell" style={styles.tableCell}>Fecha</th>
                    <th className="table-cell" style={styles.tableCell}>Evento</th>
                    <th className="table-cell" style={styles.tableCell}>Lugar</th>
                    <th className="table-cell" style={styles.tableCell}>Descripción</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, index) => (
                    <tr
                      key={event.id}
                      style={{
                        opacity: animate ? 1 : 0,
                        transform: animate ? 'translateY(0)' : `translateY(${stylesPublic.spacing.scale[5]})`,
                        transition: `opacity ${stylesPublic.animations.duration.slowest} ${stylesPublic.animations.easing['ease-in-out']} ${0.6 + index * 0.1}s, transform ${stylesPublic.animations.duration.slowest} ${stylesPublic.animations.easing['ease-in-out']} ${0.6 + index * 0.1}s`,
                        backgroundColor: index % 2 === 0 ? stylesPublic.colors.surface.primary : stylesPublic.colors.surface.secondary
                      }}
                    >
                      <td className="table-cell" style={styles.tableCell}>{event.date}</td>
                      <td className="table-cell" style={{ ...styles.tableCell, fontWeight: stylesPublic.typography.weights.semibold }}>{event.name}</td>
                      <td className="table-cell" style={styles.tableCell}>{event.location}</td>
                      <td className="table-cell" style={styles.tableCell}>{event.description}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </section>

          {/* Pestañas de Contenido Destacado */}
          <section style={{ marginBottom: stylesPublic.spacing.scale[16] }}>
            <div style={styles.tabButtons}>
              <button 
                className="tab-button"
                style={{ 
                  ...styles.tabButton, 
                  ...(activeTab === 'fotos' ? { 
                    background: stylesPublic.colors.gradients.accent, 
                    color: stylesPublic.colors.text.inverse
                  } : {}) 
                }}
                onClick={() => setActiveTab('fotos')}
              >
                Fotos Destacadas
              </button>
              <button 
                className="tab-button"
                style={{ 
                  ...styles.tabButton, 
                  ...(activeTab === 'videos' ? { 
                    background: stylesPublic.colors.gradients.accent, 
                    color: stylesPublic.colors.text.inverse
                  } : {}) 
                }}
                onClick={() => setActiveTab('videos')}
              >
                Videos Destacados
              </button>
            </div>

            {activeTab === 'fotos' ? (
              <>
                <div style={{ position: 'relative', marginBottom: stylesPublic.spacing.scale[6] }}>
                  <h2 style={styles.sectionTitle}>Creaciones Destacadas</h2>
                  <Link 
                    to="/catalogofotos" 
                    style={styles.viewAllLink}
                    onMouseOver={(e) => {
                      e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary[500];
                      e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[1]})`;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.backgroundColor = stylesPublic.colors.primary[500];
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    Ver galería completa
                  </Link>
                </div>
                <div style={styles.titleUnderline}></div>
                <p style={{ 
                  ...stylesPublic.typography.body.large,
                  color: stylesPublic.colors.text.secondary, 
                  maxWidth: "800px", 
                  margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
                  textAlign: "center"
                }}>
                  Nuestras piezas más especiales seleccionadas especialmente para ti
                </p>

                <div className="gallery-grid" style={styles.galleryGrid}>
                  {loading ? (
                    <div className="text-center w-100" style={{ gridColumn: '1 / -1' }}>
                      <div className="spinner-border" role="status" style={{ color: stylesPublic.colors.primary[500] }}>
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p style={{ 
                        ...stylesPublic.typography.body.base,
                        marginTop: stylesPublic.spacing.scale[2]
                      }}>
                        Cargando contenido destacado...
                      </p>
                    </div>
                  ) : images.length > 0 ? (
                    images.slice(0, 3).map((image, index) => (
                    <div
                      key={image.id}
                      style={{
                        ...styles.galleryItem,
                        opacity: animate ? 1 : 0,
                        transform: animate ? 'translateY(0)' : `translateY(${stylesPublic.spacing.scale[5]})`,
                        transition: `all ${stylesPublic.animations.duration.slowest} ${stylesPublic.animations.easing['ease-in-out']} ${index * 0.15}s`,
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = `translateY(-${stylesPublic.spacing.scale[2]})`;
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
                  ))) : (
                    <div className="text-center w-100" style={{ gridColumn: '1 / -1' }}>
                      <p style={stylesPublic.typography.body.base}>No hay contenido destacado disponible.</p>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h2 style={styles.sectionTitle}>Videos Destacados</h2>
                <div style={styles.titleUnderline}></div>
                <p style={{ 
                  ...stylesPublic.typography.body.large,
                  color: stylesPublic.colors.text.secondary, 
                  maxWidth: "800px", 
                  margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
                  textAlign: "center"
                }}>
                  Los momentos más especiales de nuestro trabajo artesanal
                </p>

                <div style={styles.reelsCarousel}>
                  {reels.length > 0 ? (
                    <Slider {...sliderSettings}>
                      {reels.map((reel, index) => (
                      <div key={reel.id} style={{ padding: `0 ${stylesPublic.spacing.scale[2]}` }}>
                        <Card
                          style={{
                            ...styles.reelItem,
                            opacity: animate ? 1 : 0,
                            transform: animate ? 'translateY(0)' : `translateY(${stylesPublic.spacing.scale[5]})`,
                            transition: `all ${stylesPublic.animations.duration.slowest} ${stylesPublic.animations.easing['ease-in-out']} ${index * 0.1}s`,
                            padding: 0,
                            border: 'none',
                            margin: 0,
                            width: '100%'
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.03)';
                            e.currentTarget.style.boxShadow = stylesPublic.shadows.xl;
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = stylesPublic.shadows.lg;
                          }}
                          onClick={() => openVideo(reel)}
                          onMouseEnter={() => handleVideoHover(index, true)}
                          onMouseLeave={() => handleVideoHover(index, false)}
                        >
                          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                            <video
                              ref={(el) => (videoRefs.current[index] = el)}
                              src={reel.previewSrc || reel.src}
                              muted
                              loop
                              style={styles.reelVideo}
                              poster={reel.previewSrc}
                            />
                            <div style={styles.playIcon}>
                              <IonIcon icon={playCircleOutline} style={{ fontSize: stylesPublic.spacing.scale[12] }} />
                            </div>
                            <Card.Body style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              background: stylesPublic.colors.gradients.glass,
                              padding: stylesPublic.spacing.scale[4],
                              color: stylesPublic.colors.text.inverse
                            }}>
                              <Card.Title style={{ 
                                ...stylesPublic.typography.headings.h6,
                                marginBottom: stylesPublic.spacing.scale[1],
                                lineHeight: stylesPublic.typography.leading.tight
                              }}>
                                {reel.title}
                              </Card.Title>
                              <Card.Text style={{
                                ...stylesPublic.typography.body.caption,
                                opacity: '0.9',
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden'
                              }}>
                                {reel.description}
                              </Card.Text>
                            </Card.Body>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </Slider>
                  ) : (
                    <div className="text-center w-100" style={{ 
                      padding: stylesPublic.spacing.scale[12],
                      backgroundColor: stylesPublic.colors.surface.primary,
                      borderRadius: stylesPublic.borders.radius.lg,
                      margin: `0 ${stylesPublic.spacing.scale[4]}`
                    }}>
                      <p style={stylesPublic.typography.body.large}>
                        No hay videos disponibles en este momento.
                      </p>
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
              style={{ ...styles.navButton, left: stylesPublic.spacing.scale[5] }}
              onClick={() => navigateMedia('prev')}
            >
              <IonIcon icon={chevronBackOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
            </button>
            
            <div style={styles.lightboxImageWrapper}>
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
              <div style={styles.lightboxCaption}>
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

        {/* Lightbox para videos */}
        {selectedVideo && (
          <div style={styles.lightbox}>
            <button
              style={{ ...styles.navButton, left: stylesPublic.spacing.scale[5] }}
              onClick={() => navigateMedia('prev')}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary[500]}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary[500]}
            >
              <IonIcon icon={chevronBackOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
            </button>
            
            <div style={styles.lightboxVideoWrapper}>
              <button 
                style={styles.closeButton} 
                onClick={closeLightbox}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.secondary[500]}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = stylesPublic.colors.primary[500]}
              >
                <IonIcon icon={closeOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
              </button>
              <video
                controls
                autoPlay
                src={selectedVideo.src}
                style={{
                  ...styles.lightboxVideo,
                  maxWidth: isMobile ? '90vw' : stylesPublic.spacing.scale[200],
                  height: isMobile ? stylesPublic.spacing.scale[62] : stylesPublic.spacing.scale[113]
                }}
              >
                Tu navegador no soporta la reproducción de video.
              </video>
              
              <div style={{
                position: 'relative',
                marginTop: stylesPublic.spacing.scale[4],
                textAlign: 'center',
                color: stylesPublic.colors.text.inverse,
                background: stylesPublic.colors.surface.overlay,
                padding: stylesPublic.spacing.scale[4],
                borderRadius: stylesPublic.borders.radius.md,
                maxWidth: stylesPublic.spacing.scale[200],
                width: '100%'
              }}>
                <h4 style={{ 
                  ...stylesPublic.typography.headings.h5,
                  marginBottom: stylesPublic.spacing.scale[2]
                }}>
                  {selectedVideo.title}
                </h4>
                <p style={{ 
                  ...stylesPublic.typography.body.small,
                  margin: 0, 
                  opacity: 0.9
                }}>
                  {selectedVideo.description}
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

export default Destacados;