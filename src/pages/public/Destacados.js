"use client"

import React, { useState, useEffect } from "react"
import { Star, Calendar, MapPin, Play, X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react"
import stylesPublic from "../../styles/stylesGlobal"
import { publicAPI } from "../../services/api"
import { useConfig } from "../../context/ConfigContext"

const Destacados = () => {
  const { config } = useConfig()

  const [eventos, setEventos] = useState([])
  const [fotos, setFotos] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  // Lightbox
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentFotos, setCurrentFotos] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true)
        const [ev, fo, vi] = await Promise.all([
          publicAPI.getEventos(),
          publicAPI.getFotos(),
          publicAPI.getVideos(),
        ])
        setEventos(Array.isArray(ev) ? ev : [])
        setFotos(Array.isArray(fo) ? fo : [])
        setVideos(Array.isArray(vi) ? vi : [])
      } catch (error) {
        console.error("Error al cargar destacados:", error)
        setEventos([]); setFotos([]); setVideos([])
      } finally {
        setLoading(false)
      }
    }
    cargar()
  }, [])

  // --- WhatsApp ---
  const waRaw = config?.redesSociales?.whatsapp?.trim()
  const waUrl = waRaw
    ? (waRaw.startsWith("http") ? waRaw : `https://wa.me/${waRaw.replace(/\D/g, "")}`)
    : "https://wa.me/527715563522"

  // --- Helpers ---
  const idDe = (ref) => (ref && typeof ref === "object" ? ref._id : ref) || null
  const mediaDeEvento = (eventoId) => {
    const f = fotos
      .filter((x) => idDe(x.eventoId) === eventoId)
      .map((x) => ({ ...x, tipo: "foto" }))
    const v = videos
      .filter((x) => idDe(x.eventoId) === eventoId)
      .map((x) => ({ ...x, tipo: "video" }))
    return [...f, ...v]
  }

  const hoy = new Date()
  hoy.setHours(0, 0, 0, 0)
  const esFuturo = (e) => e.fecha && new Date(e.fecha) >= hoy
  const proximos = eventos
    .filter(esFuturo)
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
  const pasados = eventos
    .filter((e) => !esFuturo(e))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))

  const formatFecha = (f) =>
    f ? new Date(f).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" }) : "Fecha por confirmar"

  // --- Lightbox handlers ---
  const openImage = (fotosEvento, index) => {
    setCurrentFotos(fotosEvento)
    setCurrentIndex(index)
    setSelectedImage(fotosEvento[index])
    document.body.style.overflow = "hidden"
  }
  const openVideo = (video) => {
    setSelectedVideo(video)
    document.body.style.overflow = "hidden"
  }
  const closeLightbox = () => {
    setSelectedImage(null)
    setSelectedVideo(null)
    document.body.style.overflow = "auto"
  }
  const navImage = (dir) => {
    if (!currentFotos.length) return
    let i = dir === "next" ? currentIndex + 1 : currentIndex - 1
    if (i < 0) i = currentFotos.length - 1
    if (i >= currentFotos.length) i = 0
    setCurrentIndex(i)
    setSelectedImage(currentFotos[i])
  }

  // --- Estilos ---
  const container = { maxWidth: "1180px", margin: "0 auto", padding: `0 ${stylesPublic.spacing.scale[6]}` }
  const btn = {
    display: "inline-flex", alignItems: "center", gap: stylesPublic.spacing.scale[2],
    borderRadius: stylesPublic.borders.radius.full, padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`,
    fontSize: stylesPublic.typography.scale.sm, fontWeight: 600, cursor: "pointer", textDecoration: "none",
    border: "1px solid transparent", transition: stylesPublic.animations.transitions.elegant,
  }
  const cardBase = {
    backgroundColor: stylesPublic.colors.surface.primary, borderRadius: stylesPublic.borders.radius.xl,
    border: `1px solid ${stylesPublic.colors.neutral[200]}`, boxShadow: stylesPublic.shadows.base,
    transition: stylesPublic.animations.transitions.elegant,
  }
  const secHead = { textAlign: "center", marginBottom: stylesPublic.spacing.scale[10] }

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: stylesPublic.colors.gradients.hero, fontFamily: stylesPublic.typography.families.body }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: stylesPublic.spacing.scale[20], color: stylesPublic.colors.text.secondary }}>
          <div style={{ width: stylesPublic.spacing.scale[8], height: stylesPublic.spacing.scale[8], border: `2px solid ${stylesPublic.colors.primary[200]}`, borderTop: `2px solid ${stylesPublic.colors.primary[500]}`, borderRadius: stylesPublic.borders.radius.full, animation: "spin 1s linear infinite", marginBottom: stylesPublic.spacing.scale[4] }} />
          <p>Cargando eventos...</p>
        </div>
        <style>{`@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}`}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: "100vh", background: stylesPublic.colors.gradients.hero, fontFamily: stylesPublic.typography.families.body }}>
      <style>{`
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}
        @keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
        @keyframes lightboxFadeIn{from{opacity:0}to{opacity:1}}
        @media(max-width:900px){.dest-past-card{grid-template-columns:1fr !important}}
      `}</style>

      {/* HERO */}
      <section style={{ position: "relative", padding: `${stylesPublic.spacing.scale[20]} 0`, overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, background: stylesPublic.colors.gradients.sunset, opacity: 0.4 }} />
        <div style={{ ...container, position: "relative", zIndex: 2 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: stylesPublic.spacing.scale[2], background: stylesPublic.colors.gradients.luxury, padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`, borderRadius: stylesPublic.borders.radius.full, marginBottom: stylesPublic.spacing.scale[4] }}>
            <Star style={{ width: stylesPublic.spacing.scale[4], height: stylesPublic.spacing.scale[4], color: stylesPublic.colors.primary[600] }} />
            <span style={{ fontSize: stylesPublic.typography.scale.sm, fontWeight: 500, color: stylesPublic.colors.primary[800] }}>Eventos y Cultura Huasteca</span>
          </div>
          <h1 style={{ ...stylesPublic.typography.headings.h1, margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`, color: stylesPublic.colors.text.primary }}>
            Vivimos la tradición
            <span style={{ display: "block", background: stylesPublic.colors.gradients.elegant, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              evento a evento
            </span>
          </h1>
          <p style={{ ...stylesPublic.typography.body.large, maxWidth: "600px", margin: "0 auto", color: stylesPublic.colors.text.secondary }}>
            Ferias, celebraciones y talleres donde mostramos nuestra artesanía. Revive cada momento o súmate al próximo.
          </p>
        </div>
      </section>

      <div style={container}>
        {/* PRÓXIMOS EVENTOS */}
        <section style={{ padding: `${stylesPublic.spacing.scale[16]} 0` }}>
          <div style={secHead}>
            <h2 style={{ ...stylesPublic.typography.headings.h2, color: stylesPublic.colors.text.primary, margin: `0 0 ${stylesPublic.spacing.scale[2]} 0` }}>Próximos Eventos</h2>
            <p style={{ ...stylesPublic.typography.body.base, color: stylesPublic.colors.text.secondary, maxWidth: "520px", margin: "0 auto" }}>
              Encuéntranos en estas fechas para celebrar la tradición y la artesanía
            </p>
          </div>

          {proximos.length > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: stylesPublic.spacing.scale[6] }}>
              {proximos.map((evento, index) => (
                <div key={evento._id || index} style={{ ...cardBase, padding: stylesPublic.spacing.scale[6], animation: "fadeInUp 0.5s ease-out forwards", animationDelay: `${index * 0.08}s`, opacity: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: stylesPublic.spacing.scale[2], marginBottom: stylesPublic.spacing.scale[3] }}>
                    <Calendar style={{ width: stylesPublic.spacing.scale[4], height: stylesPublic.spacing.scale[4], color: stylesPublic.colors.primary[500] }} />
                    <span style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.primary[500], fontWeight: stylesPublic.typography.weights.medium }}>{formatFecha(evento.fecha)}</span>
                  </div>
                  <h3 style={{ fontSize: stylesPublic.typography.scale.lg, fontWeight: stylesPublic.typography.weights.medium, color: stylesPublic.colors.text.primary, margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`, lineHeight: stylesPublic.typography.leading.tight }}>
                    {evento.titulo || "Evento especial"}
                  </h3>
                  {evento.ubicacion && (
                    <div style={{ display: "flex", alignItems: "center", gap: stylesPublic.spacing.scale[2], marginBottom: stylesPublic.spacing.scale[3] }}>
                      <MapPin style={{ width: stylesPublic.spacing.scale[4], height: stylesPublic.spacing.scale[4], color: stylesPublic.colors.text.secondary }} />
                      <span style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.text.secondary }}>{evento.ubicacion}</span>
                    </div>
                  )}
                  <p style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.text.secondary, lineHeight: stylesPublic.typography.leading.relaxed, margin: `0 0 ${stylesPublic.spacing.scale[4]} 0` }}>
                    {evento.descripcion || "Un evento especial para celebrar la artesanía huasteca."}
                  </p>
                  <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ color: stylesPublic.colors.primary[500], fontSize: stylesPublic.typography.scale.sm, fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: stylesPublic.spacing.scale[1] }}>
                    Escríbenos para asistir →
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: stylesPublic.spacing.scale[16], color: stylesPublic.colors.text.secondary }}>
              <Calendar style={{ width: stylesPublic.spacing.scale[16], height: stylesPublic.spacing.scale[16], margin: `0 auto ${stylesPublic.spacing.scale[4]}`, opacity: 0.5 }} />
              <h3 style={{ ...stylesPublic.typography.headings.h3, color: stylesPublic.colors.text.primary, margin: `0 0 ${stylesPublic.spacing.scale[2]} 0` }}>Próximamente</h3>
              <p>Estamos preparando nuevos eventos. ¡Mantente atento!</p>
            </div>
          )}
        </section>

        {/* REVIVE NUESTROS EVENTOS (pasados con galería) */}
        {pasados.length > 0 && (
          <section style={{ padding: `${stylesPublic.spacing.scale[16]} 0` }}>
            <div style={secHead}>
              <h2 style={{ ...stylesPublic.typography.headings.h2, color: stylesPublic.colors.text.primary, margin: `0 0 ${stylesPublic.spacing.scale[2]} 0` }}>Revive Nuestros Eventos</h2>
              <p style={{ ...stylesPublic.typography.body.base, color: stylesPublic.colors.text.secondary, maxWidth: "520px", margin: "0 auto" }}>
                Fotos y videos de cada celebración. Toca cualquiera para verla en grande.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[8] }}>
              {pasados.map((evento) => {
                const media = mediaDeEvento(evento._id)
                const fotosEvento = media.filter((m) => m.tipo === "foto")
                return (
                  <div
                    key={evento._id}
                    className="dest-past-card"
                    style={{ ...cardBase, display: "grid", gridTemplateColumns: "0.85fr 1.15fr", overflow: "hidden" }}
                  >
                    {/* Info */}
                    <div style={{ padding: stylesPublic.spacing.scale[8], display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: stylesPublic.spacing.scale[1], background: stylesPublic.colors.secondary[100], color: stylesPublic.colors.secondary[600], borderRadius: stylesPublic.borders.radius.full, padding: `${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[3]}`, fontSize: stylesPublic.typography.scale.xs, fontWeight: 600, marginBottom: stylesPublic.spacing.scale[3] }}>
                        ✓ Evento realizado
                      </span>
                      <div style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.text.tertiary, fontWeight: 600, marginBottom: stylesPublic.spacing.scale[1] }}>{formatFecha(evento.fecha)}</div>
                      <h3 style={{ ...stylesPublic.typography.headings.h3, color: stylesPublic.colors.text.primary, margin: `0 0 ${stylesPublic.spacing.scale[2]} 0` }}>{evento.titulo || "Evento"}</h3>
                      {evento.ubicacion && (
                        <div style={{ display: "flex", alignItems: "center", gap: stylesPublic.spacing.scale[2], marginBottom: stylesPublic.spacing.scale[3], color: stylesPublic.colors.text.tertiary, fontSize: stylesPublic.typography.scale.sm }}>
                          <MapPin size={14} /> {evento.ubicacion}
                        </div>
                      )}
                      <p style={{ fontSize: stylesPublic.typography.scale.sm, color: stylesPublic.colors.text.secondary, lineHeight: stylesPublic.typography.leading.relaxed, margin: 0 }}>
                        {evento.descripcion || ""}
                      </p>
                      {media.length > 0 && (
                        <div style={{ marginTop: stylesPublic.spacing.scale[4], color: stylesPublic.colors.primary[500], fontSize: stylesPublic.typography.scale.sm, fontWeight: 700 }}>
                          {media.length} fotos y videos
                        </div>
                      )}
                    </div>

                    {/* Galería del evento */}
                    {media.length > 0 ? (
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: stylesPublic.spacing.scale[2], padding: stylesPublic.spacing.scale[3], background: stylesPublic.colors.surface.secondary }}>
                        {media.slice(0, 6).map((m, i) => {
                          const last = i === 5 && media.length > 6
                          if (m.tipo === "video") {
                            return (
                              <div key={m._id} onClick={() => openVideo(m)} style={{ position: "relative", borderRadius: stylesPublic.borders.radius.md, overflow: "hidden", cursor: "pointer", aspectRatio: "1", background: stylesPublic.colors.neutral[200] }}>
                                <img src={m.miniatura || "/placeholder.svg"} alt={m.titulo || "Video"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.32)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: stylesPublic.colors.primary[500], display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Play size={18} color="#fff" style={{ marginLeft: 2 }} />
                                  </div>
                                </div>
                                {last && <div style={{ position: "absolute", inset: 0, background: "rgba(42,36,31,0.62)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+{media.length - 6}</div>}
                              </div>
                            )
                          }
                          const fi = fotosEvento.findIndex((f) => f._id === m._id)
                          return (
                            <div key={m._id} onClick={() => openImage(fotosEvento, fi)} style={{ position: "relative", borderRadius: stylesPublic.borders.radius.md, overflow: "hidden", cursor: "pointer", aspectRatio: "1", background: stylesPublic.colors.neutral[200] }}>
                              <img src={m.url || "/placeholder.svg"} alt={m.titulo || "Foto"} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              {last && <div style={{ position: "absolute", inset: 0, background: "rgba(42,36,31,0.62)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>+{media.length - 6}</div>}
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: stylesPublic.spacing.scale[8], background: stylesPublic.colors.surface.secondary, color: stylesPublic.colors.text.tertiary, fontSize: stylesPublic.typography.scale.sm, fontStyle: "italic" }}>
                        Galería próximamente
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA FINAL */}
        <section style={{ padding: `0 0 ${stylesPublic.spacing.scale[20]}` }}>
          <div style={{ background: stylesPublic.colors.gradients.primary, color: "#fff", borderRadius: stylesPublic.borders.radius["2xl"], padding: stylesPublic.spacing.scale[12], textAlign: "center", boxShadow: stylesPublic.shadows.lg }}>
            <h2 style={{ ...stylesPublic.typography.headings.h2, color: "#fff", margin: `0 0 ${stylesPublic.spacing.scale[2]} 0` }}>¿Quieres que estemos en tu evento?</h2>
            <p style={{ ...stylesPublic.typography.body.base, color: "rgba(255,255,255,0.92)", maxWidth: "520px", margin: `0 auto ${stylesPublic.spacing.scale[6]}` }}>
              Llevamos nuestra artesanía a ferias, festivales y celebraciones. Escríbenos y lo organizamos.
            </p>
            <a href={waUrl} target="_blank" rel="noopener noreferrer" style={{ ...btn, background: "#fff", color: stylesPublic.colors.primary[600] }}>
              <MessageCircle size={16} /> Escríbenos por WhatsApp
            </a>
          </div>
        </section>
      </div>

      {/* IMAGE LIGHTBOX */}
      {selectedImage && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: stylesPublic.spacing.scale[4], animation: "lightboxFadeIn 0.3s ease-out" }} onClick={closeLightbox}>
          <button onClick={closeLightbox} style={{ position: "absolute", top: stylesPublic.spacing.scale[4], right: stylesPublic.spacing.scale[4], background: "rgba(255,255,255,0.12)", border: "none", borderRadius: stylesPublic.borders.radius.full, width: stylesPublic.spacing.scale[12], height: stylesPublic.spacing.scale[12], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", backdropFilter: "blur(10px)" }}>
            <X size={20} />
          </button>
          {currentFotos.length > 1 && (
            <>
              <button onClick={(e) => { e.stopPropagation(); navImage("prev") }} style={{ position: "absolute", left: stylesPublic.spacing.scale[4], top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: stylesPublic.borders.radius.full, width: stylesPublic.spacing.scale[14], height: stylesPublic.spacing.scale[14], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", backdropFilter: "blur(10px)" }}>
                <ChevronLeft size={24} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); navImage("next") }} style={{ position: "absolute", right: stylesPublic.spacing.scale[4], top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.12)", border: "none", borderRadius: stylesPublic.borders.radius.full, width: stylesPublic.spacing.scale[14], height: stylesPublic.spacing.scale[14], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", backdropFilter: "blur(10px)" }}>
                <ChevronRight size={24} />
              </button>
            </>
          )}
          <div style={{ maxWidth: "90%", maxHeight: "90%", display: "flex", flexDirection: "column", alignItems: "center", gap: stylesPublic.spacing.scale[4] }} onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage.url || "/placeholder.svg"} alt={selectedImage.titulo || "Imagen"} style={{ maxWidth: "100%", maxHeight: "80vh", objectFit: "contain", borderRadius: stylesPublic.borders.radius.lg, boxShadow: stylesPublic.shadows["2xl"] }} />
            {selectedImage.titulo && (
              <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: stylesPublic.borders.radius.xl, padding: stylesPublic.spacing.scale[5], maxWidth: "600px", textAlign: "center" }}>
                <h3 style={{ fontSize: stylesPublic.typography.scale.lg, fontWeight: stylesPublic.typography.weights.medium, color: "#fff", margin: 0 }}>{selectedImage.titulo}</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIDEO LIGHTBOX */}
      {selectedVideo && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: stylesPublic.spacing.scale[4], animation: "lightboxFadeIn 0.3s ease-out" }} onClick={closeLightbox}>
          <button onClick={closeLightbox} style={{ position: "absolute", top: stylesPublic.spacing.scale[4], right: stylesPublic.spacing.scale[4], background: "rgba(255,255,255,0.12)", border: "none", borderRadius: stylesPublic.borders.radius.full, width: stylesPublic.spacing.scale[12], height: stylesPublic.spacing.scale[12], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer", backdropFilter: "blur(10px)" }}>
            <X size={20} />
          </button>
          <div style={{ maxWidth: "90%", maxHeight: "90%", display: "flex", flexDirection: "column", alignItems: "center", gap: stylesPublic.spacing.scale[4] }} onClick={(e) => e.stopPropagation()}>
            <video src={selectedVideo.url} controls autoPlay style={{ maxWidth: "100%", maxHeight: "80vh", borderRadius: stylesPublic.borders.radius.lg, boxShadow: stylesPublic.shadows["2xl"] }} />
            {selectedVideo.titulo && (
              <div style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: stylesPublic.borders.radius.xl, padding: stylesPublic.spacing.scale[5], maxWidth: "600px", textAlign: "center" }}>
                <h3 style={{ fontSize: stylesPublic.typography.scale.lg, fontWeight: stylesPublic.typography.weights.medium, color: "#fff", margin: 0 }}>{selectedVideo.titulo}</h3>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Destacados
