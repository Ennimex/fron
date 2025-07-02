"use client"

// React imports
import { useState, useEffect } from "react"

// External library imports
import { Container } from "react-bootstrap"
import { IonIcon } from "@ionic/react"
import { closeOutline, chevronBackOutline, chevronForwardOutline } from "ionicons/icons"

// Internal imports
import stylesPublic from "../../styles/stylesPublic"
import { publicAPI } from "../../services/api"

const GaleriaCompleta = () => {
  // State management
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [isVisible, setIsVisible] = useState(false)

  // Enhanced CSS with sophisticated animations and effects
  const cssStyles = `
    @keyframes slideInScale {
      from { 
        opacity: 0; 
        transform: translateY(${stylesPublic.spacing.scale[8]}) scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0) scale(1); 
      }
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes lightboxFadeIn {
      from { 
        opacity: 0; 
        backdrop-filter: blur(0px);
      }
      to { 
        opacity: 1; 
        backdrop-filter: blur(20px);
      }
    }

    @keyframes imageSlideIn {
      from { 
        opacity: 0; 
        transform: scale(0.9) translateY(${stylesPublic.spacing.scale[4]}); 
      }
      to { 
        opacity: 1; 
        transform: scale(1) translateY(0); 
      }
    }

    .animate-in {
      animation: slideInScale 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .gallery-item {
      position: relative;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .gallery-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
      z-index: 2;
      pointer-events: none;
    }

    .gallery-item:hover::before {
      left: 100%;
    }

    .gallery-item:hover {
      transform: translateY(-${stylesPublic.spacing.scale[2]}) scale(1.02);
      box-shadow: ${stylesPublic.shadows.xl};
    }

    .gallery-item:hover .gallery-image {
      transform: scale(1.05);
    }

    .gallery-item:hover .caption-overlay {
      transform: translateY(0);
      opacity: 1;
    }

    .gallery-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .caption-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(
        to top,
        rgba(28, 25, 23, 0.9) 0%,
        rgba(28, 25, 23, 0.7) 50%,
        transparent 100%
      );
      backdrop-filter: blur(10px);
      color: ${stylesPublic.colors.text.inverse};
      padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[4]};
      transform: translateY(100%);
      opacity: 0;
      transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .loading-skeleton {
      background: linear-gradient(
        90deg,
        ${stylesPublic.colors.neutral[200]} 25%,
        ${stylesPublic.colors.neutral[100]} 50%,
        ${stylesPublic.colors.neutral[200]} 75%
      );
      background-size: 200% 100%;
      animation: shimmer 2s infinite;
      border-radius: ${stylesPublic.borders.radius.xl};
    }

    .lightbox {
      animation: lightboxFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      backdrop-filter: blur(20px);
    }

    .lightbox-image {
      animation: imageSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .glass-button {
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .glass-button:hover {
      background: rgba(255, 255, 255, 0.25);
      transform: scale(1.05);
      box-shadow: ${stylesPublic.shadows.brand.glow};
    }

    /* Estilos específicos para botones de navegación */
    .nav-button {
      opacity: 0.8;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .nav-button:hover {
      opacity: 1;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .close-button:hover {
      background: rgba(220, 38, 38, 0.2);
      color: #ef4444;
    }

    /* Responsive Design */
    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[5]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[80]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[4]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[75]} !important;
      }
      .lightbox-wrapper {
        max-width: 95% !important;
        max-height: 85% !important;
      }
      /* Ajustar botones de navegación en tablet */
      .nav-button {
        width: ${stylesPublic.spacing.scale[14]} !important;
        height: ${stylesPublic.spacing.scale[14]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .gallery-grid {
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)) !important;
        gap: ${stylesPublic.spacing.scale[3]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[70]} !important;
      }
      .caption-overlay {
        transform: translateY(0) !important;
        opacity: 1 !important;
        background: linear-gradient(
          to top,
          rgba(28, 25, 23, 0.95) 0%,
          rgba(28, 25, 23, 0.8) 70%,
          transparent 100%
        ) !important;
      }
      /* Botones más pequeños en móviles */
      .nav-button {
        width: ${stylesPublic.spacing.scale[12]} !important;
        height: ${stylesPublic.spacing.scale[12]} !important;
      }
      .close-button {
        width: ${stylesPublic.spacing.scale[10]} !important;
        height: ${stylesPublic.spacing.scale[10]} !important;
        top: ${stylesPublic.spacing.scale[2]} !important;
        right: ${stylesPublic.spacing.scale[2]} !important;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.xs}) {
      .gallery-grid {
        grid-template-columns: 1fr !important;
        gap: ${stylesPublic.spacing.scale[2]} !important;
      }
      .gallery-item {
        height: ${stylesPublic.spacing.scale[64]} !important;
      }
      .lightbox-caption {
        width: 95% !important;
        bottom: ${stylesPublic.spacing.scale[3]} !important;
        font-size: ${stylesPublic.typography.scale.sm} !important;
      }
    }
  `

  const styles = {
    pageContainer: {
      background: `
        radial-gradient(circle at 20% 80%, rgba(224, 0, 80, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(0, 152, 133, 0.1) 0%, transparent 50%),
        ${stylesPublic.colors.surface.primary}
      `,
      minHeight: "100vh",
      paddingTop: stylesPublic.spacing.scale[12],
      paddingBottom: stylesPublic.spacing.scale[20],
      position: "relative",
    },
    pageOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)",
      opacity: 0.3,
      pointerEvents: "none",
      zIndex: 1,
    },
    heroSection: {
      textAlign: "center",
      marginBottom: stylesPublic.spacing.scale[16],
      position: "relative",
      zIndex: 2,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "translateY(0)" : `translateY(${stylesPublic.spacing.scale[8]})`,
      transition: "all 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
    },
    sectionTitle: {
      fontSize: "clamp(2.5rem, 5vw + 1rem, 4rem)",
      fontFamily: stylesPublic.typography.families.display,
      fontWeight: stylesPublic.typography.weights.light,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[6],
      letterSpacing: "-0.02em",
      lineHeight: 1.1,
    },
    titleUnderline: {
      display: "block",
      width: stylesPublic.spacing.scale[24],
      height: stylesPublic.spacing.scale[1],
      background: stylesPublic.colors.gradients.accent,
      borderRadius: stylesPublic.borders.radius.full,
      margin: `${stylesPublic.spacing.scale[6]} auto`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? "scaleX(1)" : "scaleX(0)",
      transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s",
    },
    subtitle: {
      fontSize: stylesPublic.typography.scale.xl,
      fontFamily: stylesPublic.typography.families.body,
      fontWeight: stylesPublic.typography.weights.light,
      color: stylesPublic.colors.text.secondary,
      maxWidth: "600px",
      margin: `0 auto ${stylesPublic.spacing.scale[12]}`,
      lineHeight: 1.6,
      letterSpacing: "-0.01em",
    },
    galleryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: stylesPublic.spacing.scale[6],
      position: "relative",
      zIndex: 2,
    },
    galleryItem: {
      borderRadius: stylesPublic.borders.radius.xl,
      boxShadow: stylesPublic.shadows.lg,
      height: stylesPublic.spacing.scale[100],
      backgroundColor: stylesPublic.colors.surface.primary,
      border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    },
    loadingGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
      gap: stylesPublic.spacing.scale[6],
      position: "relative",
      zIndex: 2,
    },
    loadingSkeleton: {
      height: stylesPublic.spacing.scale[100],
      borderRadius: stylesPublic.borders.radius.xl,
    },
    emptyState: {
      textAlign: "center",
      padding: stylesPublic.spacing.scale[20],
      position: "relative",
      zIndex: 2,
    },
    emptyIcon: {
      fontSize: stylesPublic.typography.scale["6xl"],
      color: stylesPublic.colors.neutral[400],
      marginBottom: stylesPublic.spacing.scale[6],
      opacity: 0.7,
    },
    emptyTitle: {
      fontSize: stylesPublic.typography.scale["2xl"],
      fontFamily: stylesPublic.typography.families.display,
      fontWeight: stylesPublic.typography.weights.light,
      color: stylesPublic.colors.text.primary,
      marginBottom: stylesPublic.spacing.scale[4],
      letterSpacing: "-0.01em",
    },
    emptyDescription: {
      fontSize: stylesPublic.typography.scale.lg,
      color: stylesPublic.colors.text.secondary,
      maxWidth: "400px",
      margin: "0 auto",
      lineHeight: 1.6,
    },
    lightbox: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(28, 25, 23, 0.95)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: stylesPublic.utils.zIndex.modal,
      padding: stylesPublic.spacing.scale[4],
    },
    lightboxImageWrapper: {
      position: "relative",
      maxWidth: "85%",
      maxHeight: "85%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    lightboxImage: {
      maxWidth: "100%",
      maxHeight: "70vh",
      objectFit: "contain",
      borderRadius: stylesPublic.borders.radius.lg,
      boxShadow: stylesPublic.shadows["2xl"],
      marginBottom: stylesPublic.spacing.scale[4],
    },
    lightboxCaption: {
      width: "100%",
      maxWidth: "600px",
      color: stylesPublic.colors.text.inverse,
      textAlign: "center",
      background: "rgba(28, 25, 23, 0.9)",
      backdropFilter: "blur(20px)",
      padding: stylesPublic.spacing.scale[6],
      borderRadius: stylesPublic.borders.radius.xl,
      border: `1px solid rgba(255, 255, 255, 0.1)`,
    },
    lightboxTitle: {
      fontSize: stylesPublic.typography.scale.xl,
      fontFamily: stylesPublic.typography.families.display,
      fontWeight: stylesPublic.typography.weights.light,
      marginBottom: stylesPublic.spacing.scale[3],
      letterSpacing: "-0.01em",
    },
    lightboxDescription: {
      fontSize: stylesPublic.typography.scale.base,
      opacity: 0.9,
      lineHeight: 1.6,
      margin: 0,
    },
    // Botón de cerrar en la esquina superior derecha
    closeButton: {
      position: "absolute",
      top: stylesPublic.spacing.scale[4],
      right: stylesPublic.spacing.scale[4],
      width: stylesPublic.spacing.scale[12],
      height: stylesPublic.spacing.scale[12],
      borderRadius: stylesPublic.borders.radius.full,
      border: "none",
      color: stylesPublic.colors.text.inverse,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: stylesPublic.utils.zIndex.popover,
    },
    // Botón de navegación anterior (izquierda)
    prevButton: {
      position: "absolute",
      left: stylesPublic.spacing.scale[4],
      top: "50%",
      transform: "translateY(-50%)",
      width: stylesPublic.spacing.scale[16],
      height: stylesPublic.spacing.scale[16],
      borderRadius: stylesPublic.borders.radius.full,
      border: "none",
      color: stylesPublic.colors.text.inverse,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: stylesPublic.utils.zIndex.popover,
    },
    // Botón de navegación siguiente (derecha)
    nextButton: {
      position: "absolute",
      right: stylesPublic.spacing.scale[4],
      top: "50%",
      transform: "translateY(-50%)",
      width: stylesPublic.spacing.scale[16],
      height: stylesPublic.spacing.scale[16],
      borderRadius: stylesPublic.borders.radius.full,
      border: "none",
      color: stylesPublic.colors.text.inverse,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: "pointer",
      zIndex: stylesPublic.utils.zIndex.popover,
    },
  }

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true)
        const data = await publicAPI.getFotos()
        setFotos(data)

        // Trigger entrance animation
        setTimeout(() => setIsVisible(true), 100)

        setLoading(false)
      } catch (error) {
        console.error("Error al cargar las fotos:", error)
        setLoading(false)
        setTimeout(() => setIsVisible(true), 100)
      }
    }

    fetchFotos()
  }, [])

  const images = fotos.map((foto) => ({
    id: foto._id,
    src: foto.url,
    alt: foto.titulo,
    caption: foto.descripcion,
  }))

  const openLightbox = (image) => {
    setSelectedImage(image)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const navigateMedia = (direction) => {
    if (selectedImage) {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id)
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
      if (newIndex < 0) newIndex = images.length - 1
      if (newIndex >= images.length) newIndex = 0
      setSelectedImage(images[newIndex])
    }
  }

  const renderLoadingSkeletons = () => (
    <div style={styles.loadingGrid}>
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="loading-skeleton"
          style={{
            ...styles.loadingSkeleton,
            animationDelay: `${index * 0.1}s`,
          }}
        />
      ))}
    </div>
  )

  const renderEmptyState = () => (
    <div style={styles.emptyState}>
      <div style={styles.emptyIcon}>🖼️</div>
      <h3 style={styles.emptyTitle}>Galería en Construcción</h3>
      <p style={styles.emptyDescription}>
        Estamos preparando una experiencia visual extraordinaria. Pronto podrás explorar nuestra colección de arte
        textil huasteco.
      </p>
    </div>
  )

  return (
    <>
      <style>{cssStyles}</style>

      <div style={styles.pageContainer}>
        <div style={styles.pageOverlay}></div>

        <Container>
          {/* Hero Section */}
          <div style={styles.heroSection}>
            <h1 style={styles.sectionTitle}>Galería Artesanal</h1>
            <div style={styles.titleUnderline}></div>
            <p style={styles.subtitle}>
              Descubre la belleza de cada puntada, la historia detrás de cada bordado, y la pasión que da vida a
              nuestras creaciones huastecas.
            </p>
          </div>

          {/* Gallery Content */}
          {loading ? (
            renderLoadingSkeletons()
          ) : images.length > 0 ? (
            <div className="gallery-grid" style={styles.galleryGrid}>
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className="gallery-item animate-in"
                  style={{
                    ...styles.galleryItem,
                    animationDelay: `${index * 0.1}s`,
                  }}
                  onClick={() => openLightbox(image)}
                >
                  <img src={image.src || "/placeholder.svg"} alt={image.alt} className="gallery-image" loading="lazy" />
                  <div className="caption-overlay">
                    <h5
                      style={{
                        fontSize: stylesPublic.typography.scale.lg,
                        fontFamily: stylesPublic.typography.families.display,
                        fontWeight: stylesPublic.typography.weights.light,
                        margin: 0,
                        marginBottom: stylesPublic.spacing.scale[2],
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {image.alt}
                    </h5>
                    <p
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        margin: 0,
                        opacity: 0.9,
                        lineHeight: 1.5,
                      }}
                    >
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            renderEmptyState()
          )}
        </Container>

        {/* Enhanced Lightbox */}
        {selectedImage && (
          <div className="lightbox" style={styles.lightbox}>
            {/* Botón de cerrar */}
            <button
              className="glass-button close-button"
              style={styles.closeButton}
              onClick={closeLightbox}
              aria-label="Cerrar galería"
            >
              <IonIcon icon={closeOutline} style={{ fontSize: stylesPublic.typography.scale.xl }} />
            </button>

            {/* Botón anterior - lado izquierdo */}
            <button
              className="glass-button nav-button"
              style={styles.prevButton}
              onClick={() => navigateMedia("prev")}
              aria-label="Imagen anterior"
            >
              <IonIcon icon={chevronBackOutline} style={{ fontSize: stylesPublic.typography.scale["2xl"] }} />
            </button>

            {/* Botón siguiente - lado derecho */}
            <button
              className="glass-button nav-button"
              style={styles.nextButton}
              onClick={() => navigateMedia("next")}
              aria-label="Siguiente imagen"
            >
              <IonIcon icon={chevronForwardOutline} style={{ fontSize: stylesPublic.typography.scale["2xl"] }} />
            </button>

            {/* Image Container */}
            <div className="lightbox-wrapper" style={styles.lightboxImageWrapper}>
              {/* Main Image */}
              <img
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                className="lightbox-image"
                style={styles.lightboxImage}
              />

              {/* Caption */}
              <div style={styles.lightboxCaption}>
                <h4 style={styles.lightboxTitle}>{selectedImage.alt}</h4>
                <p style={styles.lightboxDescription}>{selectedImage.caption}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default GaleriaCompleta
