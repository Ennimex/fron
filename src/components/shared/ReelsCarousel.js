import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IonIcon } from '@ionic/react';
import { 
  chevronBackOutline, 
  chevronForwardOutline, 
  playOutline, 
  pauseOutline,
  volumeHighOutline,
  volumeMuteOutline
} from 'ionicons/icons';

const ReelsCarousel = ({ reels = [], autoplay = false, autoplayInterval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [loadedVideos, setLoadedVideos] = useState(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  const carouselRef = useRef(null);
  const autoplayRef = useRef(null);
  const videoRefs = useRef({});

  // Responsive breakpoints
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  const [itemsToShow, setItemsToShow] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (viewportWidth >= 1200) {
      setItemsToShow(3);
    } else if (viewportWidth >= 768) {
      setItemsToShow(2);
    } else {
      setItemsToShow(1);
    }
  }, [viewportWidth]);

  // Autoplay functionality
  useEffect(() => {
    if (isPlaying && autoplay) {
      autoplayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % Math.max(1, reels.length - itemsToShow + 1));
      }, autoplayInterval);
    } else {
      clearInterval(autoplayRef.current);
    }

    return () => clearInterval(autoplayRef.current);
  }, [isPlaying, autoplay, autoplayInterval, reels.length, itemsToShow]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch handlers
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNext();
    } else if (isRightSwipe) {
      goToPrevious();
    }
  };

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => 
      prev >= reels.length - itemsToShow ? 0 : prev + 1
    );
  }, [reels.length, itemsToShow]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(prev => 
      prev <= 0 ? Math.max(0, reels.length - itemsToShow) : prev - 1
    );
  }, [reels.length, itemsToShow]);

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  // Video loading handler
  const handleVideoLoad = (index) => {
    setLoadedVideos(prev => new Set([...prev, index]));
    if (index === 0) setIsLoading(false);
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="reel-skeleton">
      <div className="skeleton-content">
        <div className="skeleton-play-button"></div>
      </div>
    </div>
  );

  // Preview component
  const ReelPreview = ({ reel, index, isVisible }) => (
    <div className={`reel-preview ${isVisible ? 'visible' : ''}`}>
      <img 
        src={`https://img.youtube.com/vi/${reel.videoId}/mqdefault.jpg`}
        alt={reel.title}
        loading="lazy"
      />
    </div>
  );

  const maxIndex = Math.max(0, reels.length - itemsToShow);
  const dots = Array.from({ length: maxIndex + 1 }, (_, i) => i);

  const styles = {
    carousel: {
      position: 'relative',
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px 0',
    },
    carouselContainer: {
      position: 'relative',
      overflow: 'hidden',
      borderRadius: '12px',
      height: viewportWidth >= 1200 ? '480px' : viewportWidth >= 768 ? '400px' : '320px',
    },
    carouselTrack: {
      display: 'flex',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
      height: '100%',
    },
    reelItem: {
      flex: `0 0 ${100 / itemsToShow}%`,
      padding: '0 8px',
      position: 'relative',
      cursor: 'pointer',
    },
    reelContent: {
      position: 'relative',
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      overflow: 'hidden',
      backgroundColor: '#000',
      transition: 'all 0.3s ease',
      aspectRatio: '16/9',
    },
    reelVideo: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
    },
    reelOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.7) 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '20px',
      opacity: 0,
      transition: 'opacity 0.2s ease',
    },
    reelTitle: {
      color: 'white',
      fontSize: '1.1rem',
      fontWeight: '600',
      marginBottom: '0.5rem',
      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
    },
    reelDescription: {
      color: 'rgba(255,255,255,0.9)',
      fontSize: '0.9rem',
      lineHeight: '1.4',
    },
    playButton: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: 'rgba(255,255,255,0.9)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      zIndex: 2,
    },
    controls: {
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.5)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 3,
    },
    prevButton: {
      left: '10px',
    },
    nextButton: {
      right: '10px',
    },
    dots: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      marginTop: '20px',
    },
    dot: {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: 'rgba(0,0,0,0.3)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    dotActive: {
      backgroundColor: '#ff4060',
      transform: 'scale(1.2)',
    },
    volumeControl: {
      position: 'absolute',
      top: '15px',
      right: '15px',
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: 'rgba(0,0,0,0.5)',
      border: 'none',
      color: 'white',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      zIndex: 2,
    },
  };

  const cssStyles = `
    .reel-skeleton {
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: loading 1.5s infinite;
      border-radius: 8px;
      position: relative;
    }

    .skeleton-content {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .skeleton-play-button {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background-color: rgba(255,255,255,0.3);
    }

    .reel-preview {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 200px;
      height: 112px;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.3);
      opacity: 0;
      transition: opacity 0.2s ease;
      z-index: 10;
      pointer-events: none;
    }

    .reel-preview.visible {
      opacity: 1;
    }

    .reel-preview img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    @keyframes loading {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .reel-item:hover .reel-content {
      transform: scale(1.05);
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    }

    .reel-item:hover .reel-overlay {
      opacity: 1;
    }

    .controls:hover {
      background: rgba(0,0,0,0.7);
      transform: translateY(-50%) scale(1.1);
    }

    .play-button:hover {
      background-color: white;
      transform: translate(-50%, -50%) scale(1.1);
    }

    .volume-control:hover {
      background: rgba(0,0,0,0.7);
      transform: scale(1.1);
    }

    @media (max-width: 768px) {
      .controls {
        width: 40px;
        height: 40px;
      }
      
      .play-button {
        width: 50px;
        height: 50px;
      }
      
      .reel-preview {
        display: none;
      }
    }
  `;

  if (!reels || reels.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
        <p>No hay reels disponibles</p>
      </div>
    );
  }

  return (
    <>
      <style>{cssStyles}</style>
      <div style={styles.carousel}>
        <div 
          style={styles.carouselContainer}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={carouselRef}
        >
          <div style={styles.carouselTrack}>
            {reels.map((reel, index) => (
              <div 
                key={reel.id || index} 
                style={styles.reelItem}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div style={styles.reelContent}>
                  {!loadedVideos.has(index) && <LoadingSkeleton />}
                  
                  <iframe
                    ref={el => videoRefs.current[index] = el}
                    src={`${reel.src}?autoplay=0&mute=${isMuted ? 1 : 0}&controls=0&modestbranding=1&rel=0`}
                    title={reel.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={styles.reelVideo}
                    onLoad={() => handleVideoLoad(index)}
                    loading="lazy"
                  />

                  <div style={styles.reelOverlay}>
                    <div>
                      <h3 style={styles.reelTitle}>{reel.title}</h3>
                      <p style={styles.reelDescription}>{reel.description}</p>
                    </div>
                  </div>

                  <button 
                    style={styles.playButton}
                    className="play-button"
                    onClick={() => {
                      // Aquí puedes implementar la lógica de play/pause
                      console.log('Play/Pause reel:', reel.title);
                    }}
                  >
                    <IonIcon icon={playOutline} size="large" />
                  </button>

                  <button 
                    style={styles.volumeControl}
                    className="volume-control"
                    onClick={() => setIsMuted(!isMuted)}
                  >
                    <IonIcon icon={isMuted ? volumeMuteOutline : volumeHighOutline} />
                  </button>

                  <ReelPreview 
                    reel={reel} 
                    index={index} 
                    isVisible={hoveredIndex === index} 
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Controls */}
          {currentIndex > 0 && (
            <button 
              style={{...styles.controls, ...styles.prevButton}}
              className="controls"
              onClick={goToPrevious}
              aria-label="Reel anterior"
            >
              <IonIcon icon={chevronBackOutline} size="large" />
            </button>
          )}

          {currentIndex < maxIndex && (
            <button 
              style={{...styles.controls, ...styles.nextButton}}
              className="controls"
              onClick={goToNext}
              aria-label="Siguiente reel"
            >
              <IonIcon icon={chevronForwardOutline} size="large" />
            </button>
          )}
        </div>

        {/* Dots Indicator */}
        {dots.length > 1 && (
          <div style={styles.dots}>
            {dots.map((_, index) => (
              <button
                key={index}
                style={{
                  ...styles.dot,
                  ...(index === currentIndex ? styles.dotActive : {})
                }}
                onClick={() => goToSlide(index)}
                aria-label={`Ir al grupo ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Autoplay Control */}
        {autoplay && (
          <div style={{ textAlign: 'center', marginTop: '10px' }}>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'none',
                border: '1px solid #ff4060',
                color: '#ff4060',
                padding: '8px 16px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
              }}
            >
              <IonIcon icon={isPlaying ? pauseOutline : playOutline} style={{ marginRight: '5px' }} />
              {isPlaying ? 'Pausar' : 'Reproducir'} autoplay
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ReelsCarousel;