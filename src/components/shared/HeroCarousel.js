import { useNavigate } from "react-router-dom"
import Carousel from "react-bootstrap/Carousel"
import "./HeroCarousel.css"

/**
 * Carrusel del hero del inicio. Recibe fotos de la galería ({ _id, url, titulo, descripcion }).
 * Cada diapositiva lleva a la galería completa.
 */
const HeroCarousel = ({ fotos = [], intervalo = 5000, style }) => {
  const navigate = useNavigate()

  if (!fotos.length) return null

  const variasFotos = fotos.length > 1

  return (
    <Carousel
      className="hero-carousel"
      style={style}
      fade
      interval={intervalo}
      pause="hover"
      controls={variasFotos}
      indicators={variasFotos}
      prevLabel="Anterior"
      nextLabel="Siguiente"
    >
      {fotos.map((foto, index) => (
        <Carousel.Item key={foto._id || foto.url}>
          <button
            type="button"
            className="hero-carousel__slide"
            onClick={() => navigate("/catalogofotos")}
            aria-label={foto.titulo ? `Ver ${foto.titulo} en la galería` : "Ver la galería completa"}
          >
            <img
              className="hero-carousel__img"
              src={foto.url}
              alt={foto.titulo || "Foto de la galería"}
              loading={index === 0 ? "eager" : "lazy"}
            />
          </button>
          {(foto.titulo || foto.descripcion) && (
            <Carousel.Caption className="hero-carousel__caption">
              {foto.titulo && <h3>{foto.titulo}</h3>}
              {foto.descripcion && <p>{foto.descripcion}</p>}
            </Carousel.Caption>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default HeroCarousel
