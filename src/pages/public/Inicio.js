"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import { publicAPI } from "../../services/api"
import {
  FaMountain,
  FaWater,
  FaLeaf,
  FaTree,
  FaUmbrellaBeach,
  FaCity,
  FaMonument,
  FaSeedling,
  FaLandmark,
  FaMapMarkedAlt,
  FaHeart,
  FaShieldAlt,
  FaAward,
  FaStar,
} from "react-icons/fa"
import stylesPublic from "../../styles/stylesGlobal"

const InicioEnhanced = () => {
  const navigate = useNavigate()
  const [categorias, setCategorias] = useState([])
  const [localidades, setLocalidades] = useState([])
  const [comentarios, setComentarios] = useState([])
  const [comentarioTexto, setComentarioTexto] = useState("")
  const { user } = useAuth()
  const isAuthenticated = user && user.isAuthenticated
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingLocalidades, setIsLoadingLocalidades] = useState(true)

  const getLocalidadIcon = (nombre) => {
    const hash = nombre.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const iconos = [
      { icon: <FaMountain size={24} />, color: stylesPublic.colors.gradients.primary },
      { icon: <FaWater size={24} />, color: stylesPublic.colors.gradients.secondary },
      { icon: <FaLeaf size={24} />, color: stylesPublic.colors.gradients.luxury },
      { icon: <FaTree size={24} />, color: stylesPublic.colors.gradients.elegant },
      { icon: <FaUmbrellaBeach size={24} />, color: stylesPublic.colors.gradients.warm },
      { icon: <FaCity size={24} />, color: stylesPublic.colors.gradients.glass },
      { icon: <FaMonument size={24} />, color: stylesPublic.colors.gradients.sunset },
      { icon: <FaLandmark size={24} />, color: stylesPublic.colors.gradients.secondary },
      { icon: <FaSeedling size={24} />, color: stylesPublic.colors.gradients.luxury },
      { icon: <FaMapMarkedAlt size={24} />, color: stylesPublic.colors.gradients.primary },
    ]
    return iconos[hash % iconos.length]
  }

  useEffect(() => {
    const regions = [
      {
        nombre: "Huasteca Potosina",
        descripcion:
          "Cuna de técnicas ancestrales donde cada puntada cuenta la historia de generaciones de maestras artesanas.",
      },
      {
        nombre: "Huasteca Veracruzana",
        descripcion: "Paleta cromática rica en matices naturales que captura la esencia tropical de la región.",
      },
      {
        nombre: "Huasteca Hidalguense",
        descripcion: "Precisión geométrica en patrones que reflejan la arquitectura cultural de pueblos originarios.",
      },
      {
        nombre: "Huasteca Tamaulipas",
        descripcion: "Convergencia de influencias que enriquecen nuestra identidad textil contemporánea.",
      },
    ]

    const cargarCategorias = async () => {
      try {
        setIsLoading(true)
        const categoriasData = await publicAPI.getCategorias()
        if (categoriasData && categoriasData.length > 0) {
          const categoriasFormatted = categoriasData.map((categoria) => ({
            nombre: categoria.nombre,
            cantidad: categoria.productos?.length || 0,
            imagen: categoria.imagenURL || "",
            descripcion:
              categoria.descripcion || `Colección de ${categoria.nombre.toLowerCase()} con detalles artesanales únicos`,
          }))
          setCategorias(categoriasFormatted)
        } else {
          setCategorias([])
        }
      } catch (error) {
        console.error("Error al cargar categorías:", error)
        setCategorias([])
      } finally {
        setIsLoading(false)
      }
    }

    const cargarLocalidades = async () => {
      try {
        setIsLoadingLocalidades(true)
        const localidadesData = await publicAPI.getLocalidades()
        if (localidadesData && localidadesData.length > 0) {
          setLocalidades(localidadesData)
        } else {
          setLocalidades(regions)
        }
      } catch (error) {
        console.error("Error al cargar localidades:", error)
        setLocalidades(regions)
      } finally {
        setIsLoadingLocalidades(false)
      }
    }

    cargarCategorias()
    cargarLocalidades()
  }, [])

  const handleSubmitComentario = (e) => {
    e.preventDefault()
    if (!comentarioTexto.trim()) return

    const nuevoComentario = {
      id: Date.now(),
      texto: comentarioTexto,
      fecha: new Date(),
      usuario: "Usuario actual",
    }

    setComentarios([nuevoComentario, ...comentarios])
    setComentarioTexto("")
  }

  const buttonStyle = {
    fontFamily: stylesPublic.typography.families.body,
    fontSize: stylesPublic.typography.scale.base,
    fontWeight: 500,
    padding: `${stylesPublic.spacing.scale[3]} ${stylesPublic.spacing.scale[6]}`,
    borderRadius: stylesPublic.borders.radius.full,
    border: "none",
    cursor: "pointer",
    transition: stylesPublic.animations.transitions.elegant,
    textDecoration: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  }

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: stylesPublic.colors.primary[500],
    color: stylesPublic.colors.primary.contrast,
    boxShadow: stylesPublic.shadows.brand.primary,
  }

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: "transparent",
    color: stylesPublic.colors.secondary[500],
    border: `2px solid ${stylesPublic.colors.secondary[500]}`,
  }

  const cardStyle = {
    backgroundColor: stylesPublic.colors.surface.primary,
    borderRadius: stylesPublic.borders.radius.xl,
    border: `1px solid ${stylesPublic.colors.neutral[200]}`,
    boxShadow: stylesPublic.shadows.base,
    transition: stylesPublic.animations.transitions.elegant,
    padding: stylesPublic.spacing.scale[6],
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: stylesPublic.colors.gradients.hero,
        fontFamily: stylesPublic.typography.families.body,
      }}
    >
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
            opacity: 0.5,
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: stylesPublic.spacing.scale[12],
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[8] }}>
              <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[4] }}>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: stylesPublic.spacing.scale[2],
                    background: stylesPublic.colors.gradients.luxury,
                    padding: `${stylesPublic.spacing.scale[2]} ${stylesPublic.spacing.scale[4]}`,
                    borderRadius: stylesPublic.borders.radius.full,
                    width: "fit-content",
                  }}
                >
                  <FaStar
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
                    Boutique Huasteca Premium
                  </span>
                </div>
                <h1
                  style={{
                    ...stylesPublic.typography.headings.h1,
                    margin: 0,
                  }}
                >
                  La Aterciopelada
                  <span
                    style={{
                      display: "block",
                      background: stylesPublic.colors.gradients.elegant,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Tradición Artesanal
                  </span>
                </h1>
                <p
                  style={{
                    ...stylesPublic.typography.body.large,
                    maxWidth: "500px",
                    margin: 0,
                  }}
                >
                  Descubre piezas únicas tejidas con la esencia de la tradición huasteca. Cada creación celebra siglos
                  de historia y artesanía refinada.
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: stylesPublic.spacing.scale[4],
                }}
              >
                <button style={primaryButtonStyle} onClick={() => navigate("/productos")}>
                  Explorar Colección
                </button>
                <button style={secondaryButtonStyle} onClick={() => navigate("/contacto")}>
                  Agendar Consulta
                </button>
              </div>

              {/* Stats */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: stylesPublic.spacing.scale[8],
                  paddingTop: stylesPublic.spacing.scale[8],
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale["2xl"],
                      fontWeight: 700,
                      color: stylesPublic.colors.text.primary,
                    }}
                  >
                    500+
                  </div>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.tertiary,
                    }}
                  >
                    Clientas Felices
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale["2xl"],
                      fontWeight: 700,
                      color: stylesPublic.colors.text.primary,
                    }}
                  >
                    100%
                  </div>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.tertiary,
                    }}
                  >
                    Artesanal
                  </div>
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale["2xl"],
                      fontWeight: 700,
                      color: stylesPublic.colors.text.primary,
                    }}
                  >
                    5★
                  </div>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.tertiary,
                    }}
                  >
                    Calificación
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "relative",
                  zIndex: 10,
                  background: stylesPublic.colors.gradients.warm,
                  borderRadius: stylesPublic.borders.radius["3xl"],
                  padding: stylesPublic.spacing.scale[8],
                  boxShadow: stylesPublic.shadows.xl,
                }}
              >
                <img
                  src={`${process.env.PUBLIC_URL}/images/logo-aterciopelada.jpeg`}
                  alt="La Aterciopelada - Boutique Huasteca"
                  style={{
                    width: "100%",
                    height: "auto",
                    borderRadius: stylesPublic.borders.radius["2xl"],
                    objectFit: "cover",
                    maxHeight: "500px",
                    minHeight: "300px",
                    boxShadow: stylesPublic.shadows.lg,
                    transition: stylesPublic.animations.transitions.base,
                  }}
                  onError={(e) => {
                    console.error("Error loading image:", e.target.src);
                    console.log("Attempting alternative paths...");
                    
                    // Intentar rutas alternativas
                    const alternativePaths = [
                      "/images/logo-aterciopelada.jpeg",
                      "./images/logo-aterciopelada.jpeg",
                      `${window.location.origin}/images/logo-aterciopelada.jpeg`
                    ];
                    
                    let currentIndex = 0;
                    const tryNextPath = () => {
                      if (currentIndex < alternativePaths.length) {
                        console.log(`Trying path: ${alternativePaths[currentIndex]}`);
                        e.target.src = alternativePaths[currentIndex];
                        currentIndex++;
                      } else {
                        // Si todas las rutas fallan, mostrar placeholder
                        e.target.style.display = "none";
                        const placeholder = document.createElement("div");
                        placeholder.style.cssText = `
                          width: 100%;
                          height: 400px;
                          border-radius: ${stylesPublic.borders.radius["2xl"]};
                          background: linear-gradient(135deg, #f9a8d4 0%, #ec4899 50%, #be185d 100%);
                          display: flex;
                          flex-direction: column;
                          align-items: center;
                          justify-content: center;
                          color: white;
                          text-align: center;
                          font-family: ${stylesPublic.typography.families.body};
                          box-shadow: ${stylesPublic.shadows.lg};
                        `;
                        placeholder.innerHTML = `
                          <div style="font-size: 4rem; margin-bottom: 1rem;">👜</div>
                          <h3 style="font-size: 1.5rem; font-weight: bold; margin: 0 0 0.5rem 0;">La Aterciopelada</h3>
                          <p style="font-size: 1rem; margin: 0;">Boutique Huasteca</p>
                          <small style="font-size: 0.8rem; opacity: 0.8; margin-top: 1rem;">Logo de la boutique</small>
                        `;
                        if (e.target.parentNode) {
                          e.target.parentNode.appendChild(placeholder);
                        }
                      }
                    };
                    
                    // Remover el evento onError temporalmente para evitar bucle infinito
                    e.target.onError = tryNextPath;
                    tryNextPath();
                  }}
                  onLoad={(e) => {
                    console.log("✅ Logo de La Aterciopelada cargado correctamente desde:", e.target.src);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Why Choose Us */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          backgroundColor: stylesPublic.colors.surface.glass,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[16],
            }}
          >
            <h2
              style={{
                ...stylesPublic.typography.headings.h2,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
              }}
            >
              ¿Por qué elegir La Aterciopelada?
            </h2>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Sumérgete en la pasión y el arte de la artesanía huasteca con productos que respetan la tradición
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: stylesPublic.spacing.scale[8],
            }}
          >
            {[
              {
                icon: (
                  <FaHeart style={{ width: stylesPublic.spacing.scale[8], height: stylesPublic.spacing.scale[8] }} />
                ),
                title: "Calidad Artesanal",
                description:
                  "Cada pieza es elaborada a mano por maestras artesanas, garantizando una calidad excepcional y atención al detalle.",
                color: "primary",
              },
              {
                icon: (
                  <FaShieldAlt style={{ width: stylesPublic.spacing.scale[8], height: stylesPublic.spacing.scale[8] }} />
                ),
                title: "Tradición Auténtica",
                description:
                  "Preservamos técnicas ancestrales transmitidas de generación en generación en la región huasteca.",
                color: "secondary",
              },
              {
                icon: (
                  <FaAward style={{ width: stylesPublic.spacing.scale[8], height: stylesPublic.spacing.scale[8] }} />
                ),
                title: "Exclusividad Premium",
                description:
                  "Diseños únicos que combinan tradición y modernidad, perfectos para quienes buscan piezas irrepetibles.",
                color: "accent",
              },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  ...cardStyle,
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)"
                  e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)"
                  e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: stylesPublic.spacing.scale[3],
                    borderRadius: stylesPublic.borders.radius["2xl"],
                    background:
                      feature.color === "primary"
                        ? stylesPublic.colors.gradients.primary
                        : feature.color === "secondary"
                          ? stylesPublic.colors.gradients.secondary
                          : stylesPublic.colors.gradients.luxury,
                    color: stylesPublic.colors.surface.primary,
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  {feature.icon}
                </div>
                <h3
                  style={{
                    fontSize: stylesPublic.typography.scale.xl,
                    fontWeight: 600,
                    color: stylesPublic.colors.text.primary,
                    margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    ...stylesPublic.typography.body.base,
                    color: stylesPublic.colors.text.tertiary,
                    margin: 0,
                  }}
                >
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regions Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          background: stylesPublic.colors.gradients.primary,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.1)",
          }}
        />
        <div
          style={{
            position: "relative",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[16],
            }}
          >
            <h2
              style={{
                ...stylesPublic.typography.headings.h2,
                color: stylesPublic.colors.primary.contrast,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
              }}
            >
              Localidades de la Huasteca
            </h2>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                color: stylesPublic.colors.primary[100],
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Descubre la riqueza cultural que inspira nuestras creaciones artesanales
            </p>
          </div>

          {isLoadingLocalidades ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: stylesPublic.spacing.scale[16],
                color: stylesPublic.colors.primary.contrast,
              }}
            >
              <div
                style={{
                  width: stylesPublic.spacing.scale[8],
                  height: stylesPublic.spacing.scale[8],
                  border: `2px solid ${stylesPublic.colors.primary[200]}`,
                  borderTop: `2px solid ${stylesPublic.colors.primary.contrast}`,
                  borderRadius: stylesPublic.borders.radius.full,
                  animation: "spin 1s linear infinite",
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              />
              <p>Cargando localidades...</p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: stylesPublic.spacing.scale[8],
              }}
            >
              {localidades.map((localidad, index) => {
                const { icon, color } = getLocalidadIcon(localidad.nombre)
                return (
                  <div
                    key={localidad._id || index}
                    style={{
                      ...cardStyle,
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-8px)"
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)"
                      e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                    }}
                    onClick={() => navigate(`/productos?localidad=${localidad.nombre}`)}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        padding: stylesPublic.spacing.scale[3],
                        borderRadius: stylesPublic.borders.radius["2xl"],
                        background: color,
                        color: stylesPublic.colors.surface.primary,
                        marginBottom: stylesPublic.spacing.scale[4],
                      }}
                    >
                      {icon}
                    </div>
                    <h3
                      style={{
                        fontSize: stylesPublic.typography.scale.xl,
                        fontWeight: 600,
                        color: stylesPublic.colors.text.primary,
                        margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                      }}
                    >
                      {localidad.nombre}
                    </h3>
                    <p
                      style={{
                        ...stylesPublic.typography.body.base,
                        color: stylesPublic.colors.text.tertiary,
                        margin: 0,
                      }}
                    >
                      {localidad.descripcion}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          backgroundColor: stylesPublic.colors.surface.secondary,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[16],
            }}
          >
            <h2
              style={{
                ...stylesPublic.typography.headings.h2,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
              }}
            >
              Categorías de Productos
            </h2>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Descubre piezas únicas tejidas con la esencia de la tradición huasteca
            </p>
          </div>

          {isLoading ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: stylesPublic.spacing.scale[16],
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
              <p>Cargando categorías...</p>
            </div>
          ) : categorias.length > 0 ? (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: stylesPublic.spacing.scale[8],
              }}
            >
              {categorias.map((categoria, index) => (
                <div
                  key={index}
                  style={{
                    ...cardStyle,
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.lg
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)"
                    e.currentTarget.style.boxShadow = stylesPublic.shadows.base
                  }}
                  onClick={() => navigate(`/productos?categoria=${categoria.nombre}`)}
                >
                  <img
                    src={categoria.imagen || "/placeholder.svg?height=200&width=300"}
                    alt={categoria.nombre}
                    style={{
                      width: "100%",
                      height: "200px",
                      objectFit: "cover",
                      borderRadius: stylesPublic.borders.radius.lg,
                      marginBottom: stylesPublic.spacing.scale[4],
                    }}
                    onError={(e) => {
                      e.target.src = "/placeholder.svg?height=200&width=300"
                    }}
                  />
                  <h3
                    style={{
                      fontSize: stylesPublic.typography.scale.xl,
                      fontWeight: 600,
                      color: stylesPublic.colors.text.primary,
                      margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                    }}
                  >
                    {categoria.nombre}
                  </h3>
                  <p
                    style={{
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.tertiary,
                      margin: 0,
                    }}
                  >
                    {categoria.descripcion}
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
              <div
                style={{
                  fontSize: stylesPublic.typography.scale["4xl"],
                  marginBottom: stylesPublic.spacing.scale[4],
                  opacity: 0.5,
                }}
              >
                🎨
              </div>
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  color: stylesPublic.colors.text.primary,
                  marginBottom: stylesPublic.spacing.scale[4],
                }}
              >
                Próximamente nuevas categorías
              </h3>
              <p>Estamos trabajando para agregar nuevas categorías pronto.</p>
            </div>
          )}
        </div>
      </section>

      {/* Comments Section */}
      <section
        style={{
          padding: `${stylesPublic.spacing.scale[20]} 0`,
          backgroundColor: stylesPublic.colors.surface.glass,
        }}
      >
        <div
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: `0 ${stylesPublic.spacing.scale[4]}`,
          }}
        >
          <div
            style={{
              textAlign: "center",
              marginBottom: stylesPublic.spacing.scale[16],
            }}
          >
            <h2
              style={{
                ...stylesPublic.typography.headings.h2,
                margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
              }}
            >
              Comentarios de la Comunidad
            </h2>
            <p
              style={{
                ...stylesPublic.typography.body.large,
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Comparte tu experiencia con nuestra comunidad artesanal
            </p>
          </div>

          {isAuthenticated ? (
            <div
              style={{
                ...cardStyle,
                marginBottom: stylesPublic.spacing.scale[12],
              }}
            >
              <form onSubmit={handleSubmitComentario}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: stylesPublic.spacing.scale[3],
                    marginBottom: stylesPublic.spacing.scale[4],
                  }}
                >
                  <div
                    style={{
                      width: stylesPublic.spacing.scale[12],
                      height: stylesPublic.spacing.scale[12],
                      borderRadius: stylesPublic.borders.radius.full,
                      background: stylesPublic.colors.primary[500],
                      color: stylesPublic.colors.primary.contrast,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    👤
                  </div>
                  <textarea
                    rows="3"
                    placeholder="¿Qué te pareció tu experiencia con nosotros?"
                    value={comentarioTexto}
                    onChange={(e) => setComentarioTexto(e.target.value)}
                    style={{
                      flex: 1,
                      padding: stylesPublic.spacing.scale[4],
                      border: `1px solid ${stylesPublic.colors.neutral[300]}`,
                      borderRadius: stylesPublic.borders.radius.lg,
                      background: stylesPublic.colors.surface.primary,
                      fontFamily: stylesPublic.typography.families.body,
                      fontSize: stylesPublic.typography.scale.base,
                      resize: "none",
                      transition: stylesPublic.animations.transitions.base,
                    }}
                  />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div
                    style={{
                      fontSize: stylesPublic.typography.scale.sm,
                      color: stylesPublic.colors.text.secondary,
                    }}
                  >
                    ℹ️ Tu comentario será visible para toda la comunidad
                  </div>
                  <button type="submit" style={primaryButtonStyle}>
                    Publicar comentario
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div
              style={{
                ...cardStyle,
                textAlign: "center",
                marginBottom: stylesPublic.spacing.scale[12],
              }}
            >
              <div style={{ marginBottom: stylesPublic.spacing.scale[6] }}>
                <div
                  style={{
                    fontSize: stylesPublic.typography.scale["4xl"],
                    color: stylesPublic.colors.primary[500],
                  }}
                >
                  💬
                </div>
              </div>
              <h3
                style={{
                  fontSize: stylesPublic.typography.scale.xl,
                  fontWeight: 600,
                  color: stylesPublic.colors.text.primary,
                  margin: `0 0 ${stylesPublic.spacing.scale[4]} 0`,
                }}
              >
                ¡Únete a la conversación!
              </h3>
              <p
                style={{
                  ...stylesPublic.typography.body.base,
                  color: stylesPublic.colors.text.secondary,
                  marginBottom: stylesPublic.spacing.scale[6],
                }}
              >
                Inicia sesión para compartir tu experiencia con la comunidad artesanal
              </p>
              <button style={primaryButtonStyle} onClick={() => navigate("/login")}>
                Iniciar Sesión
              </button>
            </div>
          )}

          {comentarios.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: stylesPublic.spacing.scale[6],
              }}
            >
              {comentarios.map((comentario) => (
                <div key={comentario.id} style={cardStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: stylesPublic.spacing.scale[3],
                      marginBottom: stylesPublic.spacing.scale[3],
                    }}
                  >
                    <div
                      style={{
                        width: stylesPublic.spacing.scale[10],
                        height: stylesPublic.spacing.scale[10],
                        borderRadius: stylesPublic.borders.radius.full,
                        background: stylesPublic.colors.primary[500],
                        color: stylesPublic.colors.primary.contrast,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      👤
                    </div>
                    <div>
                      <h6
                        style={{
                          fontSize: stylesPublic.typography.scale.base,
                          fontWeight: 600,
                          color: stylesPublic.colors.text.primary,
                          margin: 0,
                        }}
                      >
                        {comentario.usuario}
                      </h6>
                      <small
                        style={{
                          fontSize: stylesPublic.typography.scale.xs,
                          color: stylesPublic.colors.text.secondary,
                        }}
                      >
                        {new Date(comentario.fecha).toLocaleDateString("es-MX", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </small>
                    </div>
                  </div>
                  <p
                    style={{
                      ...stylesPublic.typography.body.base,
                      color: stylesPublic.colors.text.secondary,
                      margin: 0,
                    }}
                  >
                    {comentario.texto}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section - Solo se muestra si el usuario NO está autenticado */}
      {!isAuthenticated && (
        <section
          style={{
            padding: `${stylesPublic.spacing.scale[20]} 0`,
            background: stylesPublic.colors.gradients.luxury,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            }}
          />
          <div
            style={{
              position: "relative",
              maxWidth: "1024px",
              margin: "0 auto",
              textAlign: "center",
              padding: `0 ${stylesPublic.spacing.scale[4]}`,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[8] }}>
              <div style={{ display: "flex", flexDirection: "column", gap: stylesPublic.spacing.scale[4] }}>
                <h2
                  style={{
                    ...stylesPublic.typography.headings.h2,
                    color: stylesPublic.colors.primary.contrast,
                    margin: 0,
                  }}
                >
                  Celebra la Tradición Huasteca
                </h2>
                <p
                  style={{
                    ...stylesPublic.typography.body.large,
                    color: "rgba(255, 255, 255, 0.9)",
                    maxWidth: "600px",
                    margin: "0 auto",
                  }}
                >
                  Únete a nuestra comunidad y descubre piezas artesanales únicas que celebran siglos de historia
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: stylesPublic.spacing.scale[4],
                  justifyContent: "center",
                }}
              >
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: stylesPublic.colors.surface.primary,
                    color: stylesPublic.colors.primary[700],
                    boxShadow: stylesPublic.shadows.lg,
                  }}
                  onClick={() => navigate("/login?register=true")}
                >
                  Regístrate Ahora
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: "transparent",
                    color: stylesPublic.colors.primary.contrast,
                    border: `2px solid ${stylesPublic.colors.primary.contrast}`,
                  }}
                  onClick={() => navigate("/login")}
                >
                  Iniciar Sesión
                </button>
              </div>

              <p
                style={{
                  fontSize: stylesPublic.typography.scale.sm,
                  color: "rgba(255, 255, 255, 0.8)",
                }}
              >
                🛡️ Tu información está segura con nosotros
              </p>
            </div>
          </div>
        </section>
      )}

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

export default InicioEnhanced
