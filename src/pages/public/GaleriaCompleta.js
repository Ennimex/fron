"use client"

import React, { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react"
import stylesPublic from "../../styles/stylesGlobal"
import { publicAPI } from "../../services/api"

const GaleriaCompleta = () => {
  console.log("GaleriaCompleta component loaded")
  const [fotos, setFotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const cargarFotos = async () => {
      try {
        setLoading(true)
        const data = await publicAPI.getFotos()
        setFotos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar las fotos:", error)
        setLoading(false)
      }
    }

    cargarFotos()
  }, [])

  const images = fotos.map((foto) => ({
    id: foto._id,
    src: foto.url,
    alt: foto.titulo || "Imagen de galería",
    caption: foto.descripcion || "",
  }))

  const openLightbox = (image, index) => {
    setSelectedImage(image)
    setCurrentIndex(index)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    document.body.style.overflow = "auto"
  }

  const navigateImage = (direction) => {
    if (images.length === 0) return
    
    let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
    if (newIndex < 0) newIndex = images.length - 1
    if (newIndex >= images.length) newIndex = 0
    
    setCurrentIndex(newIndex)
    setSelectedImage(images[newIndex])
  }

  const containerStyle = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: `0 ${stylesPublic.spacing.scale[4]}`,
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
          <p>Cargando galería...</p>
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
            opacity: 0.3,
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
              <Camera
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
                Galería Visual
              </span>
            </div>
            <h1
              style={{
                ...stylesPublic.typography.headings.h1,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
              }}
            >
              Galería
              <span
                style={{
                  display: "block",
                  background: stylesPublic.colors.gradients.elegant,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Artesanal
              </span>
            </h1>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Descubre la belleza de cada puntada, la historia detrás de cada bordado, y la pasión que da vida a
              nuestras creaciones huastecas.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
        }}
      >
        <div style={containerStyle}>
          {images.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: stylesPublic.spacing.scale[6],
              }}
            >
              {images.map((image, index) => (
                <div
                  key={image.id}
                  style={{
                    backgroundColor: stylesPublic.colors.surface.primary,
                    borderRadius: stylesPublic.borders.radius.xl,
                    border: `1px solid ${stylesPublic.colors.neutral[200]}`,
                    boxShadow: stylesPublic.shadows.base,
                    transition: stylesPublic.animations.transitions.elegant,
                    cursor: "pointer",
                    overflow: "hidden",
                    height: "400px",
                    animation: "fadeInUp 0.5s ease-out forwards",
                    animationDelay: `${index * 0.1}s`,
                    opacity: 0,
                  }}
                  onClick={() => openLightbox(image, index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.xl
                    e.currentTarget.style.borderColor = stylesPublic.colors.primary[200]
                    const img = e.currentTarget.querySelector("img")
                    if (img) img.style.transform = "scale(1.05)"
                    const overlay = e.currentTarget.querySelector(".image-overlay")
                    if (overlay) overlay.style.opacity = "1"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                    e.currentTarget.style.borderColor = stylesPublic.colors.neutral[200]
                    const img = e.currentTarget.querySelector("img")
                    if (img) img.style.transform = "scale(1)"
                    const overlay = e.currentTarget.querySelector(".image-overlay")
                    if (overlay) overlay.style.opacity = "0"
                  }}
                >
                  <div style={{ position: "relative", height: "70%", overflow: "hidden" }}>
                    <img
                      src={image.src || "/placeholder.svg?height=300&width=300"}
                      alt={image.alt}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.4s ease",
                      }}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg?height=300&width=300"
                      }}
                    />
                    <div
                      className="image-overlay"
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))",
                        display: "flex",
                        alignItems: "flex-end",
                        padding: stylesPublic.spacing.scale[4],
                        opacity: 0,
                        transition: "opacity 0.3s ease",
                      }}
                    >
                      <Camera
                        style={{
                          width: stylesPublic.spacing.scale[6],
                          height: stylesPublic.spacing.scale[6],
                          color: stylesPublic.colors.surface.primary,
                        }}
                      />
                    </div>
                  </div>
                  <div style={{ padding: stylesPublic.spacing.scale[5], height: "30%" }}>
                    <h3
                      style={{
                        fontSize: stylesPublic.typography.scale.lg,
                        fontWeight: stylesPublic.typography.weights.medium,
                        color: stylesPublic.colors.text.primary,
                        margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                        lineHeight: stylesPublic.typography.leading.tight,
                      }}
                    >
                      {image.alt}
                    </h3>
                    {image.caption && (
                      <p
                        style={{
                          fontSize: stylesPublic.typography.scale.sm,
                          color: stylesPublic.colors.text.secondary,
                          lineHeight: stylesPublic.typography.leading.relaxed,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {image.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: `${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[8]}`,
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  fontSize: stylesPublic.typography.scale["4xl"],
                  marginBottom: stylesPublic.spacing.scale[4],
                  opacity: 0.5,
                }}
              >
                🖼️
              </div>
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  fontWeight: stylesPublic.typography.weights.medium,
                  color: stylesPublic.colors.text.primary,
                  margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                }}
              >
                Galería en Construcción
              </h3>
              <p
                style={{
                  fontSize: stylesPublic.typography.scale.base,
                  color: stylesPublic.colors.text.secondary,
                  margin: 0,
                }}
              >
                Estamos preparando una experiencia visual extraordinaria. Pronto podrás explorar nuestra colección de
                arte textil huasteco.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
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

          {/* Previous Button */}
          {images.length > 1 && (
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
          )}

          {/* Next Button */}
          {images.length > 1 && (
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
              src={selectedImage.src || "/placeholder.svg"}
              alt={selectedImage.alt}
              style={{
                maxWidth: "100%",
                maxHeight: "80vh",
                objectFit: "contain",
                borderRadius: stylesPublic.borders.radius.lg,
                boxShadow: stylesPublic.shadows["2xl"],
              }}
            />
            {(selectedImage.alt || selectedImage.caption) && (
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
                {selectedImage.alt && (
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.xl,
                      fontWeight: stylesPublic.typography.weights.medium,
                      color: stylesPublic.colors.surface.primary,
                      margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
                    }}
                  >
                    {selectedImage.alt}
                  </h3>
                )}
                {selectedImage.caption && (
                  <p
                    style={{
                      fontSize: stylesPublic.typography.scale.base,
                      color: stylesPublic.colors.surface.primary,
                      margin: 0,
                      opacity: 0.9,
                      lineHeight: stylesPublic.typography.leading.relaxed,
                    }}
                  >
                    {selectedImage.caption}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GaleriaCompleta
