"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { Star, Calendar, MapPin, Play, X, ChevronLeft, ChevronRight, Image, Video } from "lucide-react"
import stylesPublic from "../../styles/stylesGlobal"
import { publicAPI } from "../../services/api"

const Destacados = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [activeTab, setActiveTab] = useState("fotos")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [videoCarouselIndex, setVideoCarouselIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [autoPlayTimeout, setAutoPlayTimeout] = useState(null)
  const [touchDebounceTimeout, setTouchDebounceTimeout] = useState(null)

  const [fotos, setFotos] = useState([])
  const [videos, setVideos] = useState([])
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)

  // Refs para evitar problemas de dependencias en useEffect
  const autoPlayTimeoutRef = useRef(null)
  const isUserInteractingRef = useRef(false)

  // Sincronizar refs con estado
  useEffect(() => {
    autoPlayTimeoutRef.current = autoPlayTimeout
  }, [autoPlayTimeout])

  useEffect(() => {
    isUserInteractingRef.current = isUserInteracting
  }, [isUserInteracting])

  // Detectar dispositivo móvil y breakpoints
  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth
      setIsMobile(width <= 768)
      setIsTablet(width > 768 && width <= 1024)
    }
    
    checkDeviceType()
    window.addEventListener('resize', checkDeviceType)
    
    return () => window.removeEventListener('resize', checkDeviceType)
  }, [])

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        const [fotosResponse, videosResponse, eventosResponse] = await Promise.all([
          publicAPI.getFotos(),
          publicAPI.getVideos(),
          publicAPI.getEventos(),
        ])

        setFotos(fotosResponse.slice(0, 6))
        setVideos(videosResponse.slice(0, 4))
        setEventos(eventosResponse.slice(0, 3))
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar datos:", error)
        setLoading(false)
      }
    }

    cargarDatos()
  }, [])

  const openLightbox = (item, index, type = "image") => {
    if (type === "video") {
      setSelectedVideo(item)
    } else {
      setSelectedImage(item)
      setCurrentIndex(index)
    }
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setSelectedVideo(null)
    document.body.style.overflow = "auto"
  }

  const navigateImage = (direction) => {
    const items = activeTab === "fotos" ? fotos : videos
    if (items.length === 0) return
    
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    if (newIndex < 0) newIndex = items.length - 1
    if (newIndex >= items.length) newIndex = 0
    
    setCurrentIndex(newIndex)
    if (activeTab === "fotos") {
      setSelectedImage(items[newIndex])
    }
  }

  const navigateVideoCarousel = (direction) => {
    if (videos.length === 0) return
    
    // Limpiar timeout anterior
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout)
      setAutoPlayTimeout(null)
    }
    
    // Detener auto-play temporalmente
    setIsAutoPlaying(false)
    setIsUserInteracting(true)
    
    let newIndex = direction === "next" ? videoCarouselIndex + 1 : videoCarouselIndex - 1
    if (newIndex < 0) newIndex = videos.length - 1
    if (newIndex >= videos.length) newIndex = 0
    
    setVideoCarouselIndex(newIndex)
    
    // Reanudar auto-play después de 4 segundos
    const timeout = setTimeout(() => {
      setIsUserInteracting(false)
      setIsAutoPlaying(true)
      setAutoPlayTimeout(null)
    }, 4000)
    
    setAutoPlayTimeout(timeout)
  }

  const handleIndicatorClick = (index) => {
    // Limpiar timeout anterior
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout)
      setAutoPlayTimeout(null)
    }
    
    setVideoCarouselIndex(index)
    setIsAutoPlaying(false)
    setIsUserInteracting(true)
    
    // Reanudar auto-play después de 3 segundos
    const timeout = setTimeout(() => {
      setIsUserInteracting(false)
      setIsAutoPlaying(true)
      setAutoPlayTimeout(null)
    }, 3000)
    
    setAutoPlayTimeout(timeout)
  }

  // Función helper para manejar eventos touch con debounce
  const handleTouchStart = () => {
    if (touchDebounceTimeout) {
      clearTimeout(touchDebounceTimeout)
    }
    setIsUserInteracting(true)
  }

  const handleTouchEnd = () => {
    // Limpiar timeout anterior
    if (touchDebounceTimeout) {
      clearTimeout(touchDebounceTimeout)
    }
    
    // Reanudar después de un delay en touch
    const timeout = setTimeout(() => {
      setIsUserInteracting(false)
      setTouchDebounceTimeout(null)
    }, 2000)
    
    setTouchDebounceTimeout(timeout)
  }

  // Auto-play del carrusel de videos
  useEffect(() => {
    let interval = null
    
    if (activeTab === "videos" && videos.length > 1 && isAutoPlaying && !isUserInteracting) {
      interval = setInterval(() => {
        setVideoCarouselIndex(prev => {
          const newIndex = (prev + 1) % videos.length
          return newIndex
        })
      }, 4000) // Reducido a 4 segundos para mejor UX
    }
    
    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [activeTab, videos.length, isAutoPlaying, isUserInteracting])

  // Reset del carrusel cuando cambia la pestaña
  useEffect(() => {
    if (activeTab === "videos") {
      setVideoCarouselIndex(0)
      
      // Solo activar auto-play si no hay interacción del usuario usando ref
      if (!isUserInteractingRef.current) {
        setIsAutoPlaying(true)
      }
      
      // Limpiar timeout si existe usando ref
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
        setAutoPlayTimeout(null)
      }
    } else {
      // Si cambiamos de pestaña, limpiar el auto-play
      setIsAutoPlaying(false)
      setIsUserInteracting(false)
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
        setAutoPlayTimeout(null)
      }
    }
  }, [activeTab]) // Solo activeTab como dependencia

  // Cleanup al desmontar el componente y control de visibilidad
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pausar auto-play cuando la pestaña no es visible
        setIsAutoPlaying(false)
        // Usar ref para acceder al estado actual sin dependencias
        if (autoPlayTimeoutRef.current) {
          clearTimeout(autoPlayTimeoutRef.current)
          setAutoPlayTimeout(null)
        }
      } else if (activeTab === "videos") {
        // Reanudar auto-play cuando la pestaña vuelve a ser visible
        // Solo si no hay interacción activa del usuario usando ref
        if (!isUserInteractingRef.current) {
          setIsAutoPlaying(true)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      // Limpiar timeouts al desmontar usando refs
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current)
      }
      // No necesitamos limpiar touchDebounceTimeout aquí ya que 
      // se maneja en las funciones helper
    }
  }, [activeTab]) // Solo activeTab como dependencia

  const containerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: `0 ${isMobile ? stylesPublic.spacing.scale[3] : 
              isTablet ? stylesPublic.spacing.scale[4] : 
              stylesPublic.spacing.scale[6]}`,
  }

  const cardStyle = {
    backgroundColor: stylesPublic.colors.surface.primary,
    borderRadius: stylesPublic.borders.radius.xl,
    border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    boxShadow: stylesPublic.shadows.base,
    transition: stylesPublic.animations.transitions.elegant,
    overflow: "hidden",
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: stylesPublic.colors.gradients.hero,
          fontFamily: stylesPublic.typography.families.body,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: stylesPublic.spacing.scale[20],
            color: stylesPublic.colors.text.secondary,
          }}
        >
          <div
            style={{
              width: stylesPublic.spacing.scale[8],
              height: stylesPublic.spacing.scale[8],
              border: `2px solid ${stylesPublic.colors.primary[200]}`,
              borderTop: `2px solid ${stylesPublic.colors.primary[500]}`,
              borderRadius: stylesPublic.borders.radius.full,
              animation: "spin 1s linear infinite",
              marginBottom: stylesPublic.spacing.scale[4],
            }}
          />
          <p>Cargando contenido destacado...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: stylesPublic.colors.gradients.hero,
        fontFamily: stylesPublic.typography.families.body,
      }}
    >
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
        `}
      </style>

      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: stylesPublic.colors.gradients.sunset,
            opacity: 0.4,
          }}
        />
        <div style={{ ...containerStyle, position: "relative", zIndex: 2 }}>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: stylesPublic.spacing.scale[2],
                background: stylesPublic.colors.gradients.luxury,
                padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
                borderRadius: stylesPublic.borders.radius.full,
                marginBottom: stylesPublic.spacing.scale[4],
              }}
            >
              <Star
                style={{
                  width: stylesPublic.spacing.scale[4],
                  height: stylesPublic.spacing.scale[4],
                  color: stylesPublic.colors.primary[600],
                }}
              />
              <span
                style={{
                  fontSize: stylesPublic.typography.scale.sm,
                  fontWeight: 500,
                  color: stylesPublic.colors.primary[800],
                }}
              >
                Contenido Destacado
              </span>
            </div>
            <h1
              style={{
                ...stylesPublic.typography.headings.h1,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                color: stylesPublic.colors.text.primary,
                textAlign: "center",
              }}
            >
              Lo Mejor de
              <span
                style={{
                  display: "block",
                  background: stylesPublic.colors.gradients.elegant,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                La Aterciopelada
              </span>
            </h1>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                maxWidth: "600px",
                margin: "0 auto",
                color: stylesPublic.colors.text.secondary,
              }}
            >
              Explora nuestra galería de momentos especiales, eventos únicos y las creaciones que nos definen como
              artesanos de la cultura huasteca.
            </p>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div style={containerStyle}>
        {/* Eventos Destacados */}
        <section
          style={{
            padding: `${stylesPublic.spacing.scale[16]} 0`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: stylesPublic.spacing.scale[12] }}>
            <h2
              style={{
                ...stylesPublic.typography.headings.h2,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
              }}
            >
              Próximos Eventos
            </h2>
            <p
              style={{
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.secondary,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Únete a nosotros en estos eventos especiales donde celebramos la artesanía huasteca
            </p>
          </div>

          {eventos.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile 
                  ? "1fr"
                  : isTablet 
                  ? "repeat(auto-fit, minmax(300px, 1fr))"
                  : "repeat(auto-fit, minmax(300px, 1fr))",
                gap: isMobile ? stylesPublic.spacing.scale[4] : 
                     isTablet ? stylesPublic.spacing.scale[5] : 
                     stylesPublic.spacing.scale[6],
              }}
            >
              {eventos.map((evento, index) => (
                <div
                  key={evento._id || index}
                  style={{
                    ...cardStyle,
                    padding: stylesPublic.spacing.scale[6],
                    cursor: "pointer",
                    animation: "fadeInUp 0.5s ease-out forwards",
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                    e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                    e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[2],
                      marginBottom: stylesPublic.spacing.scale[3],
                    }}
                  >
                    <Calendar
                      style={{
                        width: stylesPublic.spacing.scale[4],
                        height: stylesPublic.spacing.scale[4],
                        color: stylesPublic.colors.primary[500],
                      }}
                    />
                    <span
                      style={{
                        fontSize: stylesPublic.typography.scale.sm,
                        color: stylesPublic.colors.primary[500],
                        fontWeight: stylesPublic.typography.weights.medium,
                      }}
                    >
                      {evento.fecha
                        ? new Date(evento.fecha).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Fecha por confirmar"}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.lg,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.text.primary,
                      margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                      lineHeight: stylesPublic.typography.leading.tight,
                    }}
                  >
                    {evento.titulo || evento.nombre || "Evento Especial"}
                  </h3>

                  {evento.ubicacion && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: stylesPublic.spacing.scale[2],
                        marginBottom: stylesPublic.spacing.scale[3],
                      }}
                    >
                      <MapPin
                        style={{
                          width: stylesPublic.spacing.scale[4],
                          height: stylesPublic.spacing.scale[4],
                          color: stylesPublic.colors.text.secondary,
                        }}
                      />
                      <span
                        style={{
                          fontSize: stylesPublic.typography.scale.sm,
                          color: stylesPublic.colors.text.secondary,
                        }}
                      >
                        {evento.ubicacion}
                      </span>
                    </div>
                  )}

                  <p
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.secondary,
                      lineHeight: stylesPublic.typography.leading.relaxed,
                      margin: 0,
                    }}
                  >
                    {evento.descripcion || "Un evento especial para celebrar la artesanía huasteca."}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: stylesPublic.spacing.scale[16],
                color: stylesPublic.colors.text.secondary,
              }}
            >
              <Calendar
                style={{
                  width: stylesPublic.spacing.scale[16],
                  height: stylesPublic.spacing.scale[16],
                  margin: `0 auto ${stylesPublic.spacing.scale[4]}`,
                  opacity: 0.5,
                }}
              />
              <h3
                style={{
                  ...stylesPublic.typography.headings.h3,
                  color: stylesPublic.colors.text.primary,
                  margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                }}
              >
                Próximamente
              </h3>
              <p>Estamos preparando eventos especiales. ¡Mantente atento!</p>
            </div>
          )}
        </section>

        {/* Galería Multimedia */}
        <section
          style={{
            padding: `${stylesPublic.spacing.scale[16]} 0`,
          }}
        >
          <div style={{ textAlign: "center", marginBottom: stylesPublic.spacing.scale[12] }}>
            <h2
              style={{
                ...stylesPublic.typography.headings.h2,
                color: stylesPublic.colors.text.primary,
                margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
              }}
              >
              Galería Multimedia
            </h2>
            <p
              style={{
                ...stylesPublic.typography.body.base,
                color: stylesPublic.colors.text.secondary,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              Descubre nuestras mejores fotos y videos destacados
            </p>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginBottom: stylesPublic.spacing.scale[10],
              borderBottom: `1px solid ${stylesPublic.colors.neutral[200]}`,
              flexWrap: "wrap",
              gap: isMobile ? stylesPublic.spacing.scale[2] : 0,
            }}
          >
            <button
              style={{
                background: "transparent",
                border: "none",
                padding: isMobile 
                  ? `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`
                  : `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]}`,
                fontSize: isMobile ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.base,
                fontWeight: stylesPublic.typography.weights.medium,
                color: activeTab === "fotos" ? stylesPublic.colors.primary[500] : stylesPublic.colors.text.secondary,
                cursor: "pointer",
                position: "relative",
                borderBottom: activeTab === "fotos" ? `2px solid ${stylesPublic.colors.primary[500]}` : "2px solid transparent",
                transition: stylesPublic.animations.transitions.elegant,
                display: "flex",
                alignItems: "center",
                gap: stylesPublic.spacing.scale[2],
              }}
              onClick={() => setActiveTab("fotos")}
            >
              <Image size={isMobile ? 14 : 16} />
              {isMobile ? "Fotos" : "Fotos Destacadas"}
            </button>
            <button
              style={{
                background: "transparent",
                border: "none",
                padding: isMobile 
                  ? `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`
                  : `${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]}`,
                fontSize: isMobile ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.base,
                fontWeight: stylesPublic.typography.weights.medium,
                color: activeTab === "videos" ? stylesPublic.colors.primary[500] : stylesPublic.colors.text.secondary,
                cursor: "pointer",
                position: "relative",
                borderBottom: activeTab === "videos" ? `2px solid ${stylesPublic.colors.primary[500]}` : "2px solid transparent",
                transition: stylesPublic.animations.transitions.elegant,
                display: "flex",
                alignItems: "center",
                gap: stylesPublic.spacing.scale[2],
              }}
              onClick={() => setActiveTab("videos")}
            >
              <Video size={isMobile ? 14 : 16} />
              {isMobile ? "Videos" : "Videos Destacados"}
            </button>
          </div>

          {/* Content */}
          {activeTab === "fotos" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: stylesPublic.spacing.scale[8],
                  flexWrap: "wrap",
                  gap: isMobile ? stylesPublic.spacing.scale[4] : 0,
                  position: "relative",
                  zIndex: 1,
                }}
              >
                <h3
                  style={{
                    ...stylesPublic.typography.headings.h3,
                    color: stylesPublic.colors.text.primary,
                    margin: 0,
                  }}
                >
                  Nuestras Mejores Fotos
                </h3>
                <Link
                  to="/catalogofotos"
                  style={{
                    background: "transparent",
                    color: stylesPublic.colors.primary[500],
                    border: `1px solid ${stylesPublic.colors.primary[500]}`,
                    padding: isMobile
                      ? `${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]}`
                      : `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
                    borderRadius: stylesPublic.borders.radius.full,
                    fontSize: isMobile ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.sm,
                    fontWeight: stylesPublic.typography.weights.medium,
                    cursor: "pointer",
                    transition: stylesPublic.animations.transitions.elegant,
                    pointerEvents: "auto",
                    position: "relative",
                    zIndex: 1,
                    minWidth: "fit-content",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={(e) => {
                    console.log("Clic en Link Ver Todas")
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = stylesPublic.colors.primary[500]
                    e.currentTarget.style.color = stylesPublic.colors.surface.primary
                    e.currentTarget.style.transform = "translateY(-1px)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.color = stylesPublic.colors.primary[500]
                    e.currentTarget.style.transform = "translateY(0)"
                  }}
                >
                  Ver Todas
                </Link>
              </div>

              {fotos.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: isMobile 
                      ? "1fr"
                      : isTablet 
                      ? "repeat(auto-fill, minmax(280px, 1fr))"
                      : "repeat(auto-fill, minmax(300px, 1fr))",
                    gap: isMobile ? stylesPublic.spacing.scale[3] : 
                         isTablet ? stylesPublic.spacing.scale[4] : 
                         stylesPublic.spacing.scale[6],
                    padding: isMobile ? `0 ${stylesPublic.spacing.scale[2]}` : "0",
                  }}
                >
                  {fotos.map((foto, index) => (
                    <div
                      key={foto._id || index}
                      style={{
                        ...cardStyle,
                        cursor: "pointer",
                        height: isMobile ? "200px" : isTablet ? "220px" : "250px",
                        animation: "fadeInUp 0.5s ease-out forwards",
                        animationDelay: `${index * 0.1}s`,
                        opacity: 0,
                      }}
                      onClick={() => openLightbox(foto, index, "image")}
                      onMouseEnter={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = "translateY(-4px)"
                          e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                          e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
                          const img = e.currentTarget.querySelector("img")
                          if (img) img.style.transform = "scale(1.05)"
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isMobile) {
                          e.currentTarget.style.transform = "translateY(0)"
                          e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                          e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
                          const img = e.currentTarget.querySelector("img")
                          if (img) img.style.transform = "scale(1)"
                        }
                      }}
                    >
                      <img
                        src={foto.url || "/placeholder.svg?height=250&width=300"}
                        alt={foto.titulo || "Foto destacada"}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          transition: "transform 0.4s ease",
                        }}
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = "/placeholder.svg?height=250&width=300"
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: stylesPublic.spacing.scale[16],
                    color: stylesPublic.colors.text.secondary,
                  }}
                >
                  <Image
                    style={{
                      width: stylesPublic.spacing.scale[16],
                      height: stylesPublic.spacing.scale[16],
                      margin: `0 auto ${stylesPublic.spacing.scale[4]}`,
                      opacity: 0.5,
                    }}
                  />
                  <h3
                    style={{
                      ...stylesPublic.typography.headings.h3,
                      color: stylesPublic.colors.text.primary,
                      margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                    }}
                  >
                    Próximamente
                  </h3>
                  <p>Estamos preparando una galería increíble para ti.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: stylesPublic.spacing.scale[8],
                  flexWrap: "wrap",
                  gap: isMobile ? stylesPublic.spacing.scale[4] : 0,
                }}
              >
                <h3
                  style={{
                    ...stylesPublic.typography.headings.h3,
                    color: stylesPublic.colors.text.primary,
                    margin: 0,
                  }}
                >
                  Videos Destacados
                </h3>
              </div>

              {videos.length > 0 ? (
                <div 
                  className="video-carousel"
                  style={{
                    position: "relative",
                    maxWidth: isMobile ? "100%" : isTablet ? "500px" : "600px",
                    margin: "0 auto",
                    padding: isMobile ? `0 ${stylesPublic.spacing.scale[3]}` : "0",
                    overflow: "hidden",
                  }}
                  onMouseEnter={() => {
                    if (!isMobile) {
                      setIsAutoPlaying(false)
                      setIsUserInteracting(true)
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      setIsUserInteracting(false)
                      setIsAutoPlaying(true)
                    }
                  }}
                >
                  <div 
                    className="video-carousel-inner"
                    style={{
                      display: "flex",
                      transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      transform: `translateX(-${videoCarouselIndex * 100}%)`,
                    }}
                  >
                    {videos.map((video, index) => (
                      <div 
                        key={video._id || index}
                        className="video-carousel-item"
                        style={{
                          flex: "0 0 100%",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          padding: isMobile ? "0" : isTablet ? "0 1rem" : "0 2rem",
                        }}
                      >
                        <div
                          style={{
                            ...cardStyle,
                            cursor: "pointer",
                            height: isMobile ? "400px" : isTablet ? "500px" : "600px",
                            position: "relative",
                            overflow: "hidden",
                            width: isMobile ? "280px" : isTablet ? "320px" : "400px",
                            maxWidth: "100%",
                            margin: "0 auto",
                            flexShrink: 0,
                          }}
                          onClick={() => openLightbox(video, index, "video")}
                          onMouseEnter={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.transform = "translateY(-4px)"
                              e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                              e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
                            }
                            const overlay = e.currentTarget.querySelector(".play-overlay")
                            if (overlay) overlay.style.opacity = "1"
                          }}
                          onMouseLeave={(e) => {
                            if (!isMobile) {
                              e.currentTarget.style.transform = "translateY(0)"
                              e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                              e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
                            }
                            const overlay = e.currentTarget.querySelector(".play-overlay")
                            if (overlay) overlay.style.opacity = "0.8"
                          }}
                        >
                          <img
                            src={video.miniatura || "/placeholder.svg?height=600&width=400"}
                            alt={video.titulo || "Video destacado"}
                            style={{
                              width: "100%",
                              height: "80%",
                              objectFit: "cover",
                            }}
                            loading="lazy"
                            onError={(e) => {
                              e.target.src = "/placeholder.svg?height=600&width=400"
                            }}
                          />
                          
                          {/* Play Overlay */}
                          <div
                            className="play-overlay"
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              height: "80%",
                              background: "rgba(0, 0, 0, 0.4)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0.8,
                              transition: "opacity 0.3s ease",
                            }}
                          >
                            <Play
                              style={{
                                width: isMobile ? stylesPublic.spacing.scale[8] : 
                                       isTablet ? stylesPublic.spacing.scale[10] : 
                                       stylesPublic.spacing.scale[12],
                                height: isMobile ? stylesPublic.spacing.scale[8] : 
                                        isTablet ? stylesPublic.spacing.scale[10] : 
                                        stylesPublic.spacing.scale[12],
                                color: stylesPublic.colors.surface.primary,
                                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                              }}
                            />
                          </div>

                          {/* Video Info */}
                          <div                          style={{
                            padding: isMobile ? stylesPublic.spacing.scale[2] : 
                                     isTablet ? stylesPublic.spacing.scale[3] : 
                                     stylesPublic.spacing.scale[4],
                            height: "20%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                          }}
                          >
                            <h4
                              style={{
                                fontSize: isMobile ? stylesPublic.typography.scale.sm : stylesPublic.typography.scale.base,
                                fontWeight: stylesPublic.typography.weights.medium,
                                color: stylesPublic.colors.text.primary,
                                margin: 0,
                                lineHeight: stylesPublic.typography.leading.tight,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {video.titulo || "Video destacado"}
                            </h4>
                            {video.descripcion && (
                              <p
                                style={{
                                  fontSize: isMobile ? stylesPublic.typography.scale.xs : stylesPublic.typography.scale.sm,
                                  color: stylesPublic.colors.text.secondary,
                                  margin: `${stylesPublic.spacing.scale[1]} 0 0 0`,
                                  lineHeight: stylesPublic.typography.leading.relaxed,
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                }}
                              >
                                {video.descripcion}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  {videos.length > 1 && (
                    <>
                      <button
                        style={{
                          position: "absolute",
                          left: isMobile ? stylesPublic.spacing.scale[1] : 
                                isTablet ? stylesPublic.spacing.scale[2] : 
                                stylesPublic.spacing.scale[4],
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: stylesPublic.colors.surface.primary,
                          border: `2px solid ${stylesPublic.colors.primary[500]}`,
                          borderRadius: stylesPublic.borders.radius.full,
                          width: isMobile ? stylesPublic.spacing.scale[8] : 
                                 isTablet ? stylesPublic.spacing.scale[10] : 
                                 stylesPublic.spacing.scale[12],
                          height: isMobile ? stylesPublic.spacing.scale[8] : 
                                  isTablet ? stylesPublic.spacing.scale[10] : 
                                  stylesPublic.spacing.scale[12],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: stylesPublic.colors.primary[500],
                          cursor: "pointer",
                          transition: stylesPublic.animations.transitions.elegant,
                          boxShadow: stylesPublic.shadows.lg,
                          zIndex: 10,
                        }}
                        onClick={() => navigateVideoCarousel("prev")}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            // Pausar auto-play al hacer hover
                            setIsUserInteracting(true)
                            e.currentTarget.style.background = stylesPublic.colors.primary[500]
                            e.currentTarget.style.color = stylesPublic.colors.surface.primary
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            // Reanudar auto-play al salir del hover
                            setIsUserInteracting(false)
                            e.currentTarget.style.background = stylesPublic.colors.surface.primary
                            e.currentTarget.style.color = stylesPublic.colors.primary[500]
                            e.currentTarget.style.transform = "translateY(-50%) scale(1)"
                          }
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        <ChevronLeft size={isMobile ? 14 : isTablet ? 16 : 20} />
                      </button>

                      <button
                        style={{
                          position: "absolute",
                          right: isMobile ? stylesPublic.spacing.scale[1] : 
                                 isTablet ? stylesPublic.spacing.scale[2] : 
                                 stylesPublic.spacing.scale[4],
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: stylesPublic.colors.surface.primary,
                          border: `2px solid ${stylesPublic.colors.primary[500]}`,
                          borderRadius: stylesPublic.borders.radius.full,
                          width: isMobile ? stylesPublic.spacing.scale[8] : 
                                 isTablet ? stylesPublic.spacing.scale[10] : 
                                 stylesPublic.spacing.scale[12],
                          height: isMobile ? stylesPublic.spacing.scale[8] : 
                                  isTablet ? stylesPublic.spacing.scale[10] : 
                                  stylesPublic.spacing.scale[12],
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: stylesPublic.colors.primary[500],
                          cursor: "pointer",
                          transition: stylesPublic.animations.transitions.elegant,
                          boxShadow: stylesPublic.shadows.lg,
                          zIndex: 10,
                        }}
                        onClick={() => navigateVideoCarousel("next")}
                        onMouseEnter={(e) => {
                          if (!isMobile) {
                            // Pausar auto-play al hacer hover
                            setIsUserInteracting(true)
                            e.currentTarget.style.background = stylesPublic.colors.primary[500]
                            e.currentTarget.style.color = stylesPublic.colors.surface.primary
                            e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isMobile) {
                            // Reanudar auto-play al salir del hover
                            setIsUserInteracting(false)
                            e.currentTarget.style.background = stylesPublic.colors.surface.primary
                            e.currentTarget.style.color = stylesPublic.colors.primary[500]
                            e.currentTarget.style.transform = "translateY(-50%) scale(1)"
                          }
                        }}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                      >
                        <ChevronRight size={isMobile ? 14 : isTablet ? 16 : 20} />
                      </button>
                    </>
                  )}

                  {/* Indicators */}
                  {videos.length > 1 && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: isMobile ? stylesPublic.spacing.scale[1] : stylesPublic.spacing.scale[2],
                        marginTop: isMobile ? stylesPublic.spacing.scale[4] : stylesPublic.spacing.scale[6],
                        padding: isMobile ? stylesPublic.spacing.scale[2] : 0,
                      }}
                    >
                      {videos.map((_, index) => (
                        <button
                          key={index}
                          style={{
                            width: isMobile ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[3],
                            height: isMobile ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[3],
                            borderRadius: stylesPublic.borders.radius.full,
                            border: "none",
                            background: index === videoCarouselIndex 
                              ? stylesPublic.colors.primary[500] 
                              : stylesPublic.colors.neutral[300],
                            cursor: "pointer",
                            transition: stylesPublic.animations.transitions.elegant,
                            minWidth: isMobile ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[3],
                            minHeight: isMobile ? stylesPublic.spacing.scale[2] : stylesPublic.spacing.scale[3],
                          }}
                          onClick={() => handleIndicatorClick(index)}
                          onMouseEnter={(e) => {
                            if (!isMobile && index !== videoCarouselIndex) {
                              e.currentTarget.style.background = stylesPublic.colors.primary[300]
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isMobile && index !== videoCarouselIndex) {
                              e.currentTarget.style.background = stylesPublic.colors.neutral[300]
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: stylesPublic.spacing.scale[16],
                    color: stylesPublic.colors.text.secondary,
                  }}
                >
                  <Video
                    style={{
                      width: stylesPublic.spacing.scale[16],
                      height: stylesPublic.spacing.scale[16],
                      margin: `0 auto ${stylesPublic.spacing.scale[4]}`,
                      opacity: 0.5,
                    }}
                  />
                  <h3
                    style={{
                      ...stylesPublic.typography.headings.h3,
                      color: stylesPublic.colors.text.primary,
                      margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                    }}
                  >
                    Próximamente
                  </h3>
                  <p>Estamos preparando videos increíbles para compartir contigo.</p>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Image Lightbox */}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: stylesPublic.spacing.scale[4],
            animation: "lightboxFadeIn 0.3s ease-out",
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            style={{
              position: "absolute",
              top: stylesPublic.spacing.scale[4],
              right: stylesPublic.spacing.scale[4],
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: stylesPublic.borders.radius.full,
              width: stylesPublic.spacing.scale[12],
              height: stylesPublic.spacing.scale[12],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: stylesPublic.colors.surface.primary,
              cursor: "pointer",
              transition: stylesPublic.animations.transitions.elegant,
              backdropFilter: "blur(10px)",
            }}
            onClick={closeLightbox}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <X size={20} />
          </button>

          {/* Navigation Buttons */}
          {fotos.length > 1 && (
            <>
              <button
                style={{
                  position: "absolute",
                  left: stylesPublic.spacing.scale[4],
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: stylesPublic.borders.radius.full,
                  width: stylesPublic.spacing.scale[16],
                  height: stylesPublic.spacing.scale[16],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stylesPublic.colors.surface.primary,
                  cursor: "pointer",
                  transition: stylesPublic.animations.transitions.elegant,
                  backdropFilter: "blur(10px)",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("prev")
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)"
                }}
              >
                <ChevronLeft size={24} />
              </button>

              <button
                style={{
                  position: "absolute",
                  right: stylesPublic.spacing.scale[4],
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: stylesPublic.borders.radius.full,
                  width: stylesPublic.spacing.scale[16],
                  height: stylesPublic.spacing.scale[16],
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: stylesPublic.colors.surface.primary,
                  cursor: "pointer",
                  transition: stylesPublic.animations.transitions.elegant,
                  backdropFilter: "blur(10px)",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage("next")
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1.1)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
                  e.currentTarget.style.transform = "translateY(-50%) scale(1)"
                }}
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Container */}
          <div
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: stylesPublic.spacing.scale[4],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage.url || "/placeholder.svg"}
              alt={selectedImage.titulo || "Imagen destacada"}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: stylesPublic.borders.radius.lg,
                boxShadow: stylesPublic.shadows["2xl"],
              }}
            />
            {selectedImage.titulo && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  borderRadius: stylesPublic.borders.radius.xl,
                  padding: stylesPublic.spacing.scale[6],
                  maxWidth: "600px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.surface.primary,
                    margin: 0,
                  }}
                >
                  {selectedImage.titulo}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Video Lightbox */}
      {selectedVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0, 0, 0, 0.95)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            padding: stylesPublic.spacing.scale[4],
            animation: "lightboxFadeIn 0.3s ease-out",
          }}
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            style={{
              position: "absolute",
              top: stylesPublic.spacing.scale[4],
              right: stylesPublic.spacing.scale[4],
              background: "rgba(255, 255, 255, 0.1)",
              border: "none",
              borderRadius: stylesPublic.borders.radius.full,
              width: stylesPublic.spacing.scale[12],
              height: stylesPublic.spacing.scale[12],
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: stylesPublic.colors.surface.primary,
              cursor: "pointer",
              transition: stylesPublic.animations.transitions.elegant,
              backdropFilter: "blur(10px)",
            }}
            onClick={closeLightbox}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)"
              e.currentTarget.style.transform = "scale(1.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)"
              e.currentTarget.style.transform = "scale(1)"
            }}
          >
            <X size={20} />
          </button>

          {/* Video Container */}
          <div
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: stylesPublic.spacing.scale[4],
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={selectedVideo.url}
              controls
              autoPlay
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                borderRadius: stylesPublic.borders.radius.lg,
                boxShadow: stylesPublic.shadows["2xl"],
              }}
            />
            {selectedVideo.titulo && (
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(20px)",
                  border: `1px solid rgba(255, 255, 255, 0.2)`,
                  borderRadius: stylesPublic.borders.radius.xl,
                  padding: stylesPublic.spacing.scale[6],
                  maxWidth: "600px",
                  textAlign: "center",
                }}
              >
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.surface.primary,
                    margin: 0,
                  }}
                >
                  {selectedVideo.titulo}
                </h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Destacados