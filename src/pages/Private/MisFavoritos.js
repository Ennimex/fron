"use client"

import React from "react"
import { useNavigate } from "react-router-dom"
import { Heart } from "lucide-react"
import { useFavoritos } from "../../context/FavoritosContext"
import stylesPublic from "../../styles/stylesGlobal"

const MisFavoritos = () => {
  const navigate = useNavigate()
  const { favoritos, toggleFavorito, loading } = useFavoritos()

  const contenedor = {
    maxWidth: "1280px",
    margin: "0 auto",
    padding: `0 ${stylesPublic.spacing.scale[4]}`,
  }

  const cardStyle = {
    backgroundColor: stylesPublic.colors.surface.primary,
    borderRadius: stylesPublic.borders.radius.xl,
    border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    boxShadow: stylesPublic.shadows.base,
    overflow: "hidden",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    transition: stylesPublic.animations.transitions.elegant,
  }

  if (loading) {
    return (
      <section style={contenedor}>
        <p
          style={{
            textAlign: "center",
            padding: stylesPublic.spacing.scale[16],
            color: stylesPublic.colors.text.secondary,
          }}
        >
          Cargando tus favoritos...
        </p>
      </section>
    )
  }

  return (
    <section style={contenedor}>
      <div style={{ marginBottom: stylesPublic.spacing.scale[8] }}>
        <h1
          style={{
            fontSize: stylesPublic.typography.scale["3xl"],
            fontWeight: stylesPublic.typography.weights.semibold,
            color: stylesPublic.colors.text.primary,
            margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
          }}
        >
          Mis Favoritos
        </h1>
        <p
          style={{
            fontSize: stylesPublic.typography.scale.base,
            color: stylesPublic.colors.text.secondary,
            margin: 0,
          }}
        >
          {favoritos.length > 0
            ? `Tienes ${favoritos.length} ${favoritos.length === 1 ? "prenda guardada" : "prendas guardadas"}.`
            : "Aquí se guardan las prendas que marques con el corazón."}
        </p>
      </div>

      {favoritos.length > 0 ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: stylesPublic.spacing.scale[8],
            marginBottom: stylesPublic.spacing.scale[20],
          }}
        >
          {favoritos.map((producto) => (
            <div
              key={producto._id}
              style={cardStyle}
              onClick={() => navigate(`/producto/${producto._id}`)}
            >
              <div
                style={{
                  position: "relative",
                  height: "220px",
                  background: stylesPublic.colors.surface.secondary,
                }}
              >
                <img
                  src={producto.imagenURL || "/placeholder.svg?height=220&width=280"}
                  alt={producto.nombre}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/placeholder.svg?height=220&width=280"
                  }}
                />
                <button
                  type="button"
                  aria-label="Quitar de favoritos"
                  title="Quitar de favoritos"
                  onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    toggleFavorito(producto)
                  }}
                  style={{
                    position: "absolute",
                    top: stylesPublic.spacing.scale[3],
                    right: stylesPublic.spacing.scale[3],
                    width: stylesPublic.spacing.scale[8],
                    height: stylesPublic.spacing.scale[8],
                    background: stylesPublic.colors.surface.primary,
                    borderRadius: stylesPublic.borders.radius.full,
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    color: "#e0245e",
                    boxShadow: stylesPublic.shadows.base,
                  }}
                >
                  <Heart size={16} fill="currentColor" />
                </button>
              </div>
              <div style={{ padding: stylesPublic.spacing.scale[5] }}>
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.lg,
                    fontWeight: stylesPublic.typography.weights.medium,
                    color: stylesPublic.colors.text.primary,
                    margin: `0 0 ${stylesPublic.spacing.scale[1]} 0`,
                  }}
                >
                  {producto.nombre}
                </h3>
                {producto.localidadId?.nombre && (
                  <span
                    style={{
                      fontSize: stylesPublic.typography.scale.xs,
                      color: stylesPublic.colors.text.tertiary,
                      textTransform: "uppercase",
                      letterSpacing: stylesPublic.typography.tracking.wide,
                    }}
                  >
                    {producto.localidadId.nombre}
                  </span>
                )}
                <p
                  style={{
                    fontSize: stylesPublic.typography.scale.sm,
                    color: stylesPublic.colors.text.secondary,
                    margin: `${stylesPublic.spacing.scale[2]} 0 0 0`,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {producto.descripcion}
                </p>
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
          <div style={{ marginBottom: stylesPublic.spacing.scale[4], color: "#e0245e" }}>
            <Heart size={48} />
          </div>
          <h3
            style={{
              fontSize: stylesPublic.typography.scale.xl,
              fontWeight: stylesPublic.typography.weights.medium,
              color: stylesPublic.colors.text.primary,
              margin: `0 0 ${stylesPublic.spacing.scale[2]} 0`,
            }}
          >
            Aún no tienes favoritos
          </h3>
          <p
            style={{
              fontSize: stylesPublic.typography.scale.base,
              color: stylesPublic.colors.text.secondary,
              marginBottom: stylesPublic.spacing.scale[6],
            }}
          >
            Explora el catálogo y marca con el corazón las prendas que más te gusten.
          </p>
          <button
            type="button"
            onClick={() => navigate("/productos")}
            style={{
              fontFamily: stylesPublic.typography.families.body,
              fontSize: stylesPublic.typography.scale.sm,
              fontWeight: 500,
              padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`,
              borderRadius: stylesPublic.borders.radius.md,
              backgroundColor: stylesPublic.colors.primary[500],
              color: stylesPublic.colors.primary.contrast,
              border: "none",
              cursor: "pointer",
            }}
          >
            Explorar productos
          </button>
        </div>
      )}
    </section>
  )
}

export default MisFavoritos
