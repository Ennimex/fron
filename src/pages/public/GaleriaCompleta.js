import { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import stylesPublic from '../../styles/stylesPublic';
import api from '../../services/api';

const GaleriaCompleta = () => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);

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
    galleryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: stylesPublic.spacing.md,
      marginTop: stylesPublic.spacing.xl
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
    galleryImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transition: `transform ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut}`
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
          ) : images.length > 0 ? (
            images.map((image, index) => (
              <div
                key={image.id}
                style={{
                  ...styles.galleryItem,
                  opacity: 1,
                  transform: 'translateY(0)',
                  transition: `all ${stylesPublic.transitions.duration.slow} ${stylesPublic.transitions.easing.easeInOut} ${index * 0.05}s`,
                }}
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
            ))
          ) : (
            <div className="text-center w-100">
              <p>No hay imágenes disponibles.</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default GaleriaCompleta;