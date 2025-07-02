"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { IonIcon } from "@ionic/react"
import {
  closeOutline,
  chevronBackOutline,
  chevronForwardOutline,
  playCircleOutline,
  calendarOutline,
  locationOutline,
} from "ionicons/icons"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import stylesPublic from "../../styles/stylesPublic"
import { publicAPI } from "../../services/api"

const DestacadosEnhanced = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [activeTab, setActiveTab] = useState("fotos")
  const [isMobile, setIsMobile] = useState(window.innerWidth <= Number.parseInt(stylesPublic.breakpoints.md))
  const [isVisible, setIsVisible] = useState(false)

  const videoRefs = useRef([])
  const [fotos, setFotos] = useState([])
  const [videos, setVideos] = useState([])
  const [eventos, setEventos] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingEventos, setLoadingEventos] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= Number.parseInt(stylesPublic.breakpoints.md))
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const styles = `
    .enhanced-container {
      min-height: 100vh;
      background: ${stylesPublic.colors.surface.primary};
      font-family: ${stylesPublic.typography.families.body};
    }

    .enhanced-hero {
      background: ${stylesPublic.colors.gradients.primary};
      padding: ${stylesPublic.spacing.scale[20]} ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[16]};
      text-align: center;
      position: relative;
      overflow: hidden;
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "30px"});
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .enhanced-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="dots" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="10" cy="10" r="1" fill="white" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23dots)"/></svg>');
      opacity: 0.3;
    }

    .enhanced-hero-content {
      position: relative;
      z-index: 2;
      max-width: 700px;
      margin: 0 auto;
    }

    .enhanced-hero-title {
      font-size: ${stylesPublic.typography.headings.h1.fontSize};
      font-family: ${stylesPublic.typography.headings.h1.fontFamily};
      font-weight: 300;
      line-height: ${stylesPublic.typography.headings.h1.lineHeight};
      color: ${stylesPublic.colors.text.inverse};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      position: relative;
    }

    .enhanced-hero-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[3]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[16]};
      height: 2px;
      background: ${stylesPublic.colors.text.inverse};
      opacity: 0.7;
    }

    .enhanced-hero-subtitle {
      font-size: ${stylesPublic.typography.scale.lg};
      color: rgba(255, 255, 255, 0.9);
      font-weight: 300;
      line-height: ${stylesPublic.typography.leading.relaxed};
      margin-top: ${stylesPublic.spacing.scale[6]};
    }

    .enhanced-main {
      max-width: 1200px;
      margin: 0 auto;
      padding: ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[4]};
      opacity: ${isVisible ? 1 : 0};
      transform: translateY(${isVisible ? "0" : "20px"});
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.3s;
    }

    .enhanced-section {
      margin-bottom: ${stylesPublic.spacing.scale[16]};
    }

    .enhanced-section-title {
      font-size: ${stylesPublic.typography.scale["2xl"]};
      font-weight: 300;
      color: ${stylesPublic.colors.text.primary};
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      position: relative;
    }

    .enhanced-section-title::after {
      content: '';
      position: absolute;
      bottom: -${stylesPublic.spacing.scale[2]};
      left: 50%;
      transform: translateX(-50%);
      width: ${stylesPublic.spacing.scale[12]};
      height: 1px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-section-subtitle {
      font-size: ${stylesPublic.typography.scale.base};
      color: ${stylesPublic.colors.text.secondary};
      text-align: center;
      margin-bottom: ${stylesPublic.spacing.scale[10]};
      font-weight: 300;
      max-width: 600px;
      margin-left: auto;
      margin-right: auto;
    }

    .enhanced-events-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: ${stylesPublic.spacing.scale[6]};
      margin-top: ${stylesPublic.spacing.scale[8]};
    }

    .enhanced-event-card {
      background: ${stylesPublic.colors.surface.primary};
      border: 1px solid ${stylesPublic.borders.colors.muted};
      border-radius: ${stylesPublic.borders.radius.lg};
      padding: ${stylesPublic.spacing.scale[6]};
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      opacity: 0;
      transform: translateY(20px);
      animation: fadeInUp 0.6s ease-out forwards;
    }

    .enhanced-event-card:hover {
      transform: translateY(-4px);
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[300]};
    }

    .enhanced-event-date {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.primary[500]};
      font-weight: ${stylesPublic.typography.weights.medium};
      margin-bottom: ${stylesPublic.spacing.scale[3]};
      flex-wrap: wrap;
    }

    .enhanced-event-time {
      background: ${stylesPublic.colors.primary[50]};
      color: ${stylesPublic.colors.primary[700]};
      padding: ${stylesPublic.spacing.scale[1]} ${stylesPublic.spacing.scale[2]};
      border-radius: ${stylesPublic.borders.radius.sm};
      font-size: ${stylesPublic.typography.scale.xs};
      margin-left: ${stylesPublic.spacing.scale[2]};
      font-weight: ${stylesPublic.typography.weights.medium};
    }

    .enhanced-event-title {
      font-size: ${stylesPublic.typography.scale.lg};
      font-weight: ${stylesPublic.typography.weights.medium};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      line-height: ${stylesPublic.typography.leading.tight};
    }

    .enhanced-event-location {
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      margin-bottom: ${stylesPublic.spacing.scale[3]};
    }

    .enhanced-event-description {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      line-height: ${stylesPublic.typography.leading.relaxed};
    }

    .enhanced-tabs {
      display: flex;
      justify-content: center;
      margin-bottom: ${stylesPublic.spacing.scale[10]};
      border-bottom: 1px solid ${stylesPublic.borders.colors.muted};
    }

    .enhanced-tab {
      background: transparent;
      border: none;
      padding: ${stylesPublic.spacing.scale[4]} ${stylesPublic.spacing.scale[8]};
      font-size: ${stylesPublic.typography.scale.base};
      font-weight: ${stylesPublic.typography.weights.medium};
      color: ${stylesPublic.colors.text.secondary};
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
      position: relative;
      font-family: ${stylesPublic.typography.families.body};
    }

    .enhanced-tab.active {
      color: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-tab.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: ${stylesPublic.colors.primary[500]};
    }

    .enhanced-tab:hover:not(.active) {
      color: ${stylesPublic.colors.text.primary};
    }

    .enhanced-gallery-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: ${stylesPublic.spacing.scale[8]};
    }

    .enhanced-view-all {
      background: transparent;
      color: ${stylesPublic.colors.primary[500]};
      border: 1px solid ${stylesPublic.colors.primary[500]};
      padding: ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.full};
      text-decoration: none;
      font-size: ${stylesPublic.typography.scale.sm};
      font-weight: ${stylesPublic.typography.weights.medium};
      transition: ${stylesPublic.animations.transitions.base};
      display: flex;
      align-items: center;
      gap: ${stylesPublic.spacing.scale[2]};
    }

    .enhanced-view-all:hover {
      background: ${stylesPublic.colors.primary[500]};
      color: ${stylesPublic.colors.text.inverse};
      transform: translateY(-1px);
    }

    .enhanced-gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: ${stylesPublic.spacing.scale[6]};
    }

    .enhanced-gallery-item {
      background: ${stylesPublic.colors.surface.primary};
      border-radius: ${stylesPublic.borders.radius.lg};
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid ${stylesPublic.borders.colors.muted};
      opacity: 0;
      transform: translateY(20px) scale(0.95);
    }

    .enhanced-gallery-item:hover {
      transform: translateY(-4px) scale(1.02);
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[200]};
    }

    .enhanced-gallery-image {
      width: 100%;
      height: 250px;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    .enhanced-gallery-item:hover .enhanced-gallery-image {
      transform: scale(1.05);
    }

    .enhanced-gallery-content {
      padding: ${stylesPublic.spacing.scale[5]};
    }

    .enhanced-gallery-title {
      font-size: ${stylesPublic.typography.scale.lg};
      font-weight: ${stylesPublic.typography.weights.medium};
      color: ${stylesPublic.colors.text.primary};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
      line-height: ${stylesPublic.typography.leading.tight};
    }

    .enhanced-gallery-description {
      font-size: ${stylesPublic.typography.scale.sm};
      color: ${stylesPublic.colors.text.secondary};
      line-height: ${stylesPublic.typography.leading.relaxed};
    }

    .enhanced-video-carousel {
      margin-top: ${stylesPublic.spacing.scale[8]};
    }

    .enhanced-video-item {
      background: ${stylesPublic.colors.surface.primary};
      border-radius: ${stylesPublic.borders.radius.lg};
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border: 1px solid ${stylesPublic.borders.colors.muted};
      margin: 0 ${stylesPublic.spacing.scale[2]};
      aspect-ratio: 9/16;
      height: 400px;
      position: relative;
    }

    .enhanced-video-item:hover {
      transform: scale(1.03);
      box-shadow: ${stylesPublic.shadows.lg};
      border-color: ${stylesPublic.colors.primary[200]};
    }

    .enhanced-video-preview {
      width: 100%;
      height: 70%;
      object-fit: cover;
    }

    .enhanced-video-content {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      color: ${stylesPublic.colors.text.inverse};
      padding: ${stylesPublic.spacing.scale[4]};
    }

    .enhanced-video-title {
      font-size: ${stylesPublic.typography.scale.base};
      font-weight: ${stylesPublic.typography.weights.medium};
      margin-bottom: ${stylesPublic.spacing.scale[1]};
      line-height: ${stylesPublic.typography.leading.tight};
    }

    .enhanced-video-description {
      font-size: ${stylesPublic.typography.scale.sm};
      opacity: 0.9;
      line-height: ${stylesPublic.typography.leading.relaxed};
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .enhanced-play-icon {
      position: absolute;
      top: 35%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: ${stylesPublic.typography.scale["3xl"]};
      color: ${stylesPublic.colors.text.inverse};
      opacity: 0.9;
      transition: opacity 0.3s ease;
    }

    .enhanced-video-item:hover .enhanced-play-icon {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1.1);
    }

    .enhanced-lightbox {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.95);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: ${stylesPublic.utils.zIndex.modal};
      padding: ${stylesPublic.spacing.scale[4]};
    }

    .enhanced-lightbox-content {
      position: relative;
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .enhanced-lightbox-image {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      border-radius: ${stylesPublic.borders.radius.md};
    }

    .enhanced-lightbox-video {
      width: 100%;
      max-width: ${isMobile ? "90vw" : "800px"};
      height: ${isMobile ? "250px" : "450px"};
      border-radius: ${stylesPublic.borders.radius.md};
    }

    .enhanced-lightbox-info {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: ${stylesPublic.colors.text.inverse};
      padding: ${stylesPublic.spacing.scale[4]};
      border-radius: ${stylesPublic.borders.radius.md};
      margin-top: ${stylesPublic.spacing.scale[4]};
      text-align: center;
      max-width: 600px;
    }

    .enhanced-lightbox-title {
      font-size: ${stylesPublic.typography.scale.lg};
      font-weight: ${stylesPublic.typography.weights.medium};
      margin-bottom: ${stylesPublic.spacing.scale[2]};
    }

    .enhanced-lightbox-description {
      font-size: ${stylesPublic.typography.scale.sm};
      opacity: 0.9;
      line-height: ${stylesPublic.typography.leading.relaxed};
    }

    .enhanced-close-btn {
      position: absolute;
      top: ${stylesPublic.spacing.scale[4]};
      right: ${stylesPublic.spacing.scale[4]};
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      border-radius: ${stylesPublic.borders.radius.full};
      width: ${stylesPublic.spacing.scale[10]};
      height: ${stylesPublic.spacing.scale[10]};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
    }

    .enhanced-close-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: scale(1.1);
    }

    .enhanced-nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      color: ${stylesPublic.colors.text.inverse};
      border: none;
      border-radius: ${stylesPublic.borders.radius.full};
      width: ${stylesPublic.spacing.scale[12]};
      height: ${stylesPublic.spacing.scale[12]};
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: ${stylesPublic.animations.transitions.base};
    }

    .enhanced-nav-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-50%) scale(1.1);
    }

    .enhanced-nav-btn.prev {
      left: ${stylesPublic.spacing.scale[4]};
    }

    .enhanced-nav-btn.next {
      right: ${stylesPublic.spacing.scale[4]};
    }

    .enhanced-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: ${stylesPublic.spacing.scale[16]};
      color: ${stylesPublic.colors.text.secondary};
    }

    .enhanced-loading-spinner {
      width: ${stylesPublic.spacing.scale[8]};
      height: ${stylesPublic.spacing.scale[8]};
      border: 2px solid ${stylesPublic.colors.primary[200]};
      border-top: 2px solid ${stylesPublic.colors.primary[500]};
      border-radius: ${stylesPublic.borders.radius.full};
      animation: spin 1s linear infinite;
      margin-bottom: ${stylesPublic.spacing.scale[4]};
    }

    .enhanced-empty-state {
      text-align: center;
      padding: ${stylesPublic.spacing.scale[16]};
      color: ${stylesPublic.colors.text.secondary};
    }

    .enhanced-empty-icon {
      font-size: ${stylesPublic.typography.scale["3xl"]};
      margin-bottom: ${stylesPublic.spacing.scale[4]};
      opacity: 0.5;
    }

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

    .slick-dots {
      bottom: -${stylesPublic.spacing.scale[8]};
    }

    .slick-dots li button:before {
      color: ${stylesPublic.colors.primary[500]};
      font-size: ${stylesPublic.typography.scale.xs};
      opacity: 0.5;
    }

    .slick-dots li.slick-active button:before {
      opacity: 1;
    }

    @media (max-width: ${stylesPublic.breakpoints.lg}) {
      .enhanced-hero {
        padding: ${stylesPublic.spacing.scale[16]} ${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[12]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale["2xl"]};
      }

      .enhanced-events-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: ${stylesPublic.spacing.scale[4]};
      }

      .enhanced-gallery-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: ${stylesPublic.spacing.scale[4]};
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.md}) {
      .enhanced-main {
        padding: ${stylesPublic.spacing.scale[8]} ${stylesPublic.spacing.scale[3]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale.xl};
      }

      .enhanced-tabs {
        flex-direction: column;
        align-items: center;
      }

      .enhanced-gallery-header {
        flex-direction: column;
        gap: ${stylesPublic.spacing.scale[4]};
        align-items: center;
      }

      .enhanced-events-grid {
        grid-template-columns: 1fr;
      }

      .enhanced-gallery-grid {
        grid-template-columns: 1fr;
      }

      .enhanced-video-item {
        height: 350px;
      }

      .enhanced-lightbox-video {
        height: 300px;
      }
    }

    @media (max-width: ${stylesPublic.breakpoints.sm}) {
      .enhanced-hero {
        padding: ${stylesPublic.spacing.scale[12]} ${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[8]};
      }

      .enhanced-hero-title {
        font-size: ${stylesPublic.typography.scale.lg};
      }

      .enhanced-main {
        padding: ${stylesPublic.spacing.scale[6]} ${stylesPublic.spacing.scale[2]};
      }

      .enhanced-video-item {
        height: 300px;
      }

      .enhanced-lightbox-video {
        height: 250px;
      }
    }
  `

  // Datos de eventos destacados - Ahora obtenidos dinámicamente desde la API
  // const events = [...] // Comentado: datos estáticos eliminados

  // Transformar los datos de eventos de la API
  const events = eventos.map((evento) => {
    // Formatear fecha
    const fecha = new Date(evento.fecha);
    const fechaFormateada = fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });

    return {
      id: evento._id,
      date: fechaFormateada,
      name: evento.titulo,
      location: evento.ubicacion,
      description: evento.descripcion,
      horaInicio: evento.horaInicio,
      horaFin: evento.horaFin
    };
  })

  // Transformar los datos de fotos de la API para usarlos en la galería
  const images = fotos.map((foto) => ({
    id: foto._id,
    src: foto.url,
    alt: foto.titulo,
    caption: foto.descripcion,
  }))

  // Transformar los datos de videos de la API para usarlos en el carousel
  const reels = videos.map((video) => ({
    id: video._id,
    src: video.url,
    previewSrc: video.miniatura || video.url,
    title: video.titulo || "Video sin título",
    description: video.descripcion || "Sin descripción",
  }))

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        setLoading(true)
        const data = await publicAPI.getFotos()
        setFotos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error al cargar las fotos destacadas:", error)
        setLoading(false)
      }
    }

    fetchFotos()
  }, [])

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const data = await publicAPI.getVideos()
        setVideos(data)
      } catch (error) {
        console.error("Error al cargar los videos:", error)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        setLoadingEventos(true)
        const data = await publicAPI.getEventos()
        // Filtrar solo eventos futuros y ordenar por fecha
        const eventosFuturos = data.filter(evento => {
          const fechaEvento = new Date(evento.fecha);
          const hoy = new Date();
          hoy.setHours(0, 0, 0, 0);
          return fechaEvento >= hoy;
        }).slice(0, 4); // Mostrar solo los próximos 4 eventos
        
        setEventos(eventosFuturos)
        setLoadingEventos(false)
      } catch (error) {
        console.error("Error al cargar los eventos:", error)
        setEventos([]) // En caso de error, mostrar array vacío
        setLoadingEventos(false)
      }
    }

    fetchEventos()
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  const openLightbox = (image) => {
    setSelectedImage(image)
    setSelectedVideo(null)
    document.body.style.overflow = "hidden"
  }

  const openVideo = (video) => {
    setSelectedVideo(video)
    setSelectedImage(null)
    document.body.style.overflow = "hidden"
  }

  const closeLightbox = () => {
    setSelectedImage(null)
    setSelectedVideo(null)
    document.body.style.overflow = "auto"

    videoRefs.current.forEach((video) => {
      if (video) {
        try {
          video.pause()
          video.currentTime = 0
        } catch (error) {
          console.warn("Error pausing video:", error)
        }
      }
    })

    const lightboxVideo = document.querySelector("video[controls]")
    if (lightboxVideo) {
      lightboxVideo.pause()
    }
  }

  const navigateMedia = (direction) => {
    if (selectedImage) {
      const currentIndex = images.findIndex((img) => img.id === selectedImage.id)
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
      if (newIndex < 0) newIndex = images.length - 1
      if (newIndex >= images.length) newIndex = 0
      setSelectedImage(images[newIndex])
    } else if (selectedVideo) {
      const currentIndex = reels.findIndex((vid) => vid.id === selectedVideo.id)
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1
      if (newIndex < 0) newIndex = reels.length - 1
      if (newIndex >= reels.length) newIndex = 0
      setSelectedVideo(reels[newIndex])
    }
  }

  const handleVideoHover = (index, play) => {
    const video = videoRefs.current[index]
    if (video) {
      try {
        if (play) {
          video.play().catch(() => {})
        } else {
          video.pause()
          video.currentTime = 0
        }
      } catch (error) {
        console.warn("Error handling video hover:", error)
      }
    }
  }

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: isMobile ? 1 : 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    centerMode: isMobile,
    centerPadding: isMobile ? "20px" : "0px",
    responsive: [
      {
        breakpoint: Number.parseInt(stylesPublic.breakpoints.lg),
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: Number.parseInt(stylesPublic.breakpoints.md),
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: true,
          centerPadding: "40px",
        },
      },
    ],
  }

  return (
    <>
      <style>{styles}</style>

      <div className="enhanced-container">
        {/* Hero Section */}
        <div className="enhanced-hero">
          <div className="enhanced-hero-content">
            <h1 className="enhanced-hero-title">Contenido Destacado</h1>
            <p className="enhanced-hero-subtitle">Descubre lo mejor de nuestras creaciones artesanales huastecas</p>
          </div>
        </div>

        <div className="enhanced-main">
          {/* Sección de Eventos Destacados */}
          <section className="enhanced-section">
            <h2 className="enhanced-section-title">Próximos Eventos</h2>
            <p className="enhanced-section-subtitle">
              Acompáñanos en nuestras próximas presentaciones y talleres exclusivos
            </p>

            {loadingEventos ? (
              <div className="enhanced-loading">
                <div className="enhanced-loading-spinner"></div>
                <p>Cargando eventos...</p>
              </div>
            ) : events.length > 0 ? (
              <div className="enhanced-events-grid">
                {events.map((event, index) => (
                  <div
                    key={event.id}
                    className="enhanced-event-card"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="enhanced-event-date">
                      <IonIcon icon={calendarOutline} />
                      {event.date}
                      {event.horaInicio && (
                        <span className="enhanced-event-time">
                          {event.horaInicio}
                          {event.horaFin && ` - ${event.horaFin}`}
                        </span>
                      )}
                    </div>
                    <h3 className="enhanced-event-title">{event.name}</h3>
                    <div className="enhanced-event-location">
                      <IonIcon icon={locationOutline} />
                      {event.location}
                    </div>
                    <p className="enhanced-event-description">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="enhanced-empty-state">
                <div className="enhanced-empty-icon">📅</div>
                <p>No hay eventos próximos programados</p>
                <small>¡Mantente atento a nuestras próximas actividades!</small>
              </div>
            )}
          </section>

          {/* Pestañas de Contenido */}
          <section className="enhanced-section">
            <div className="enhanced-tabs">
              <button
                className={`enhanced-tab ${activeTab === "fotos" ? "active" : ""}`}
                onClick={() => setActiveTab("fotos")}
              >
                Galería Destacada
              </button>
              <button
                className={`enhanced-tab ${activeTab === "videos" ? "active" : ""}`}
                onClick={() => setActiveTab("videos")}
              >
                Videos Destacados
              </button>
            </div>

            {activeTab === "fotos" ? (
              <>
                <div className="enhanced-gallery-header">
                  <div>
                    <h2 className="enhanced-section-title">Creaciones Destacadas</h2>
                    <p className="enhanced-section-subtitle">Nuestras piezas más especiales seleccionadas para ti</p>
                  </div>
                  <Link to="/catalogofotos" className="enhanced-view-all">
                    Ver galería completa
                    <IonIcon icon={chevronForwardOutline} />
                  </Link>
                </div>

                {loading ? (
                  <div className="enhanced-loading">
                    <div className="enhanced-loading-spinner"></div>
                    <p>Cargando contenido destacado...</p>
                  </div>
                ) : images.length > 0 ? (
                  <div className="enhanced-gallery-grid">
                    {images.slice(0, 6).map((image, index) => (
                      <div
                        key={image.id}
                        className="enhanced-gallery-item"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                          animation: "fadeInUp 0.6s ease-out forwards",
                        }}
                        onClick={() => openLightbox(image)}
                      >
                        <img src={image.src || "/placeholder.svg"} alt={image.alt} className="enhanced-gallery-image" />
                        <div className="enhanced-gallery-content">
                          <h3 className="enhanced-gallery-title">{image.alt}</h3>
                          <p className="enhanced-gallery-description">{image.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="enhanced-empty-state">
                    <div className="enhanced-empty-icon">📷</div>
                    <p>No hay contenido destacado disponible</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <h2 className="enhanced-section-title">Videos Destacados</h2>
                <p className="enhanced-section-subtitle">Los momentos más especiales de nuestro trabajo artesanal</p>

                {reels.length > 0 ? (
                  <div className="enhanced-video-carousel">
                    <Slider {...sliderSettings}>
                      {reels.map((reel, index) => (
                        <div key={reel.id}>
                          <div
                            className="enhanced-video-item"
                            onClick={() => openVideo(reel)}
                            onMouseEnter={() => handleVideoHover(index, true)}
                            onMouseLeave={() => handleVideoHover(index, false)}
                          >
                            <video
                              ref={(el) => (videoRefs.current[index] = el)}
                              src={reel.previewSrc || reel.src}
                              muted
                              loop
                              className="enhanced-video-preview"
                              poster={reel.previewSrc}
                            />
                            <div className="enhanced-play-icon">
                              <IonIcon icon={playCircleOutline} />
                            </div>
                            <div className="enhanced-video-content">
                              <h3 className="enhanced-video-title">{reel.title}</h3>
                              <p className="enhanced-video-description">{reel.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </Slider>
                  </div>
                ) : (
                  <div className="enhanced-empty-state">
                    <div className="enhanced-empty-icon">🎥</div>
                    <p>No hay videos disponibles en este momento</p>
                  </div>
                )}
              </>
            )}
          </section>
        </div>

        {/* Lightbox para imágenes */}
        {selectedImage && (
          <div className="enhanced-lightbox">
            <button className="enhanced-close-btn" onClick={closeLightbox}>
              <IonIcon icon={closeOutline} />
            </button>

            <button className="enhanced-nav-btn prev" onClick={() => navigateMedia("prev")}>
              <IonIcon icon={chevronBackOutline} />
            </button>

            <div className="enhanced-lightbox-content">
              <img
                src={selectedImage.src || "/placeholder.svg"}
                alt={selectedImage.alt}
                className="enhanced-lightbox-image"
              />
              <div className="enhanced-lightbox-info">
                <h3 className="enhanced-lightbox-title">{selectedImage.alt}</h3>
                <p className="enhanced-lightbox-description">{selectedImage.caption}</p>
              </div>
            </div>

            <button className="enhanced-nav-btn next" onClick={() => navigateMedia("next")}>
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        )}

        {/* Lightbox para videos */}
        {selectedVideo && (
          <div className="enhanced-lightbox">
            <button className="enhanced-close-btn" onClick={closeLightbox}>
              <IonIcon icon={closeOutline} />
            </button>

            <button className="enhanced-nav-btn prev" onClick={() => navigateMedia("prev")}>
              <IonIcon icon={chevronBackOutline} />
            </button>

            <div className="enhanced-lightbox-content">
              <video controls autoPlay src={selectedVideo.src} className="enhanced-lightbox-video">
                Tu navegador no soporta la reproducción de video.
              </video>
              <div className="enhanced-lightbox-info">
                <h3 className="enhanced-lightbox-title">{selectedVideo.title}</h3>
                <p className="enhanced-lightbox-description">{selectedVideo.description}</p>
              </div>
            </div>

            <button className="enhanced-nav-btn next" onClick={() => navigateMedia("next")}>
              <IonIcon icon={chevronForwardOutline} />
            </button>
          </div>
        )}
      </div>
    </>
  )
}

export default DestacadosEnhanced
