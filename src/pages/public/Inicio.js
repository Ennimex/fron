import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cards from "../../components/CardsV"; // Componente de tarjetas
import { colors, typography, productStyles } from "../../styles/styles"; // Importamos los estilos de la guía

const Inicio = () => {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productoEstrella, setProductoEstrella] = useState(null);
  const [isVisible, setIsVisible] = useState({
    hero: false,
    features: false,
    categories: false,
    products: false,
    testimonials: false,
    starProduct: false,
    cta: false,
  });

  // Obtener los productos desde la API (simulada para danza)
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Simulamos una API de productos de danza
        const response = await fetch("http://localhost:5000/productos-danza");
        if (!response.ok) {
          throw new Error("Error al obtener los productos");
        }
        const data = await response.json();
        setProductos(data);

        // Filtrar productos destacados (con rating alto o descuento)
        const productosDestacados = data
          .filter((p) => p.rating >= 4.7 || p.discount >= 10)
          .slice(0, 4);
        setDestacados(productosDestacados);

        // Extraer categorías únicas de productos
        const categoriasUnicas = [...new Set(data.map((p) => p.category))];
        const categoriasData = categoriasUnicas.map((categoria) => {
          const productosCategoria = data.filter((p) => p.category === categoria);
          return {
            nombre: categoria,
            cantidad: productosCategoria.length,
            imagen: productosCategoria[0]?.image,
          };
        });
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  // Crear producto estrella (zapatos de ballet)
  useEffect(() => {
    const zapatillasBallet = {
      _id: "650a1f1b3e0d3a001c1a4b22",
      image: "https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940",
      title: "Zapatillas de Ballet Premium",
      description: "Zapatillas de ballet de punta con suela de cuero y ajuste ergonómico para máxima comodidad y precisión.",
      price: 89.99,
      category: "Ballet",
      stock: 25,
      brand: "DanceElite",
      rating: 4.8,
      reviews: 210,
      discount: 10,
      features: [
        "Suela de cuero flexible",
        "Diseño ergonómico",
        "Cintas de satén ajustables",
        "Acolchado interior anti-impacto",
        "Disponible en varias tallas",
        "Ideal para profesionales y estudiantes",
      ],
      warranty: "1 año",
      availability: "En stock",
      specs: {
        material: "Cuero y satén",
        tallas: "EU 35-42",
        peso: "200g por zapatilla",
        color: "Rosa pálido",
      },
    };
    setProductoEstrella(zapatillasBallet);

    // Activar animaciones secuencialmente
    setTimeout(() => setIsVisible((prev) => ({ ...prev, hero: true })), 100);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, features: true })), 500);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, categories: true })), 900);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, products: true })), 1300);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, starProduct: true })), 1500);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, testimonials: true })), 1700);
    setTimeout(() => setIsVisible((prev) => ({ ...prev, cta: true })), 2100);
  }, []);

  // Características destacadas
  const features = [
    {
      icono: "💃",
      titulo: "Variedad de Estilos",
      descripcion: "Ropa y accesorios para ballet, danza contemporánea, salsa y más.",
    },
    {
      icono: "👟",
      titulo: "Calidad Premium",
      descripcion: "Productos diseñados para durar, con materiales cómodos y resistentes.",
    },
    {
      icono: "🛒",
      titulo: "Compra y Renta",
      descripcion: "Adquiere o renta productos según tus necesidades, con opciones flexibles.",
    },
    {
      icono: "🎨",
      titulo: "Diseños Exclusivos",
      descripcion: "Colecciones únicas que combinan estilo y funcionalidad para destacar.",
    },
    {
      icono: "📏",
      titulo: "Ajuste Perfecto",
      descripcion: "Tallas para todas las edades y cuerpos, con guías de medidas precisas.",
    },
    {
      icono: "🚚",
      titulo: "Envío Rápido",
      descripcion: "Entregas rápidas y seguras para que estés listo para tu próxima clase o evento.",
    },
  ];

  // Testimonios de clientes
  const testimonios = [
    {
      nombre: "Laura Méndez",
      puesto: "Bailarina profesional",
      foto: "https://randomuser.me/api/portraits/women/22.jpg",
      comentario: "Las zapatillas de ballet son increíbles, cómodas y con un diseño elegante. ¡La renta de vestuario para eventos es súper práctica!",
      estrellas: 5,
    },
    {
      nombre: "Diego Salazar",
      puesto: "Profesor de salsa",
      foto: "https://randomuser.me/api/portraits/men/42.jpg",
      comentario: "La ropa de danza es de gran calidad y el servicio de renta me ha salvado en varias presentaciones. ¡Recomendado!",
      estrellas: 5,
    },
    {
      nombre: "Sofía Ramírez",
      puesto: "Estudiante de danza",
      foto: "https://randomuser.me/api/portraits/women/55.jpg",
      comentario: "Me encanta la variedad de productos y lo fácil que es encontrar mi talla. El envío fue rapidísimo.",
      estrellas: 4,
    },
  ];

  const handleVerProductoEstrella = () => {
    if (productoEstrella) {
      navigate(`/producto/${productoEstrella._id}`);
    }
  };

  const handleCategoriaClick = (categoria) => {
    navigate(`/productos?categoria=${categoria}`);
  };

  // Estilos para animaciones
  const animationStyles = `
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    @keyframes float {
      0% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
      100% { transform: translateY(0px); }
    }
    @keyframes shine {
      from { background-position: -100px; }
      to { background-position: 200px; }
    }
    .feature-card {
      transition: all 0.3s ease;
      border: none;
    }
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    .feature-card:hover .feature-icon {
      animation: pulse 1s infinite;
    }
    .category-card {
      transition: all 0.3s ease;
      cursor: pointer;
      overflow: hidden;
    }
    .category-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100px;
      width: 50px;
      height: 100%;
      background: rgba(255,255,255,0.3);
      transform: skewX(-20deg);
      transition: 0.5s;
      filter: blur(5px);
    }
    .category-card:hover {
      transform: scale(1.05);
      box-shadow: 0 15px 30px rgba(0,0,0,0.2);
    }
    .category-card:hover::before {
      animation: shine 1s forwards;
    }
    .category-card:hover .category-title {
      transform: translateY(-5px);
      color: ${colors.pinkBerry};
    }
    .testimonial-card {
      transition: all 0.3s ease;
    }
    .testimonial-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 15px 30px rgba(0,0,0,0.1);
    }
    .star-product-img {
      transition: all 0.5s ease;
    }
    .star-product-img:hover {
      transform: scale(1.03);
    }
    .star-badge {
      animation: float 3s ease-in-out infinite;
    }
    .cta-button {
      position: relative;
      overflow: hidden;
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.15);
    }
    .cta-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100px;
      width: 50px;
      height: 100%;
      background: rgba(255,255,255,0.5);
      transform: skewX(-20deg);
      transition: 0.5s;
      filter: blur(5px);
    }
    .cta-button:hover::before {
      animation: shine 1s forwards;
    }
    .animate-in {
      animation: fadeInUp 0.8s forwards;
    }
    .feature-icon {
      transition: all 0.3s ease;
    }
    .category-title {
      transition: all 0.3s ease;
    }
  `;

  // Estilos personalizados
  const customStyles = {
    heroSection: {
      backgroundImage: `linear-gradient(135deg, rgba(136, 14, 79, 0.85) 0%, rgba(194, 24, 91, 0.9) 100%), url('https://images.unsplash.com/photo-1514557928579-7748b51b37ba?q=80&w=2940')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      opacity: isVisible.hero ? 1 : 0,
      transform: isVisible.hero ? "translateY(0)" : "translateY(20px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    heroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjODgwZTRmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2MyMTg1YiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMDAgODRMMjggMTAwTDU2IDg0TDU2IDUwTDI4IDM0IiBmaWxsPSJub25lIiBzdHJva2U9IiNjMjE4NWIiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8L3N2Zz4=')",
      opacity: 0.1,
      zIndex: 1,
    },
    featuresSection: {
      opacity: isVisible.features ? 1 : 0,
      transform: isVisible.features ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, ${colors.warmWhite}, ${colors.pinkBlush})`,
      position: "relative",
      overflow: "hidden",
    },
    categoriesSection: {
      backgroundImage: `linear-gradient(135deg, rgba(232, 30, 99, 0.95) 0%, rgba(194, 24, 91, 0.9) 100%), url('https://images.unsplash.com/photo-1514557928579-7748b51b37ba?q=80&w=2940')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      opacity: isVisible.categories ? 1 : 0,
      transform: isVisible.categories ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      position: "relative",
    },
    categoriesOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+CjxyZWN0IHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIzIiBjeT0iNCIgcj0iMSIgZmlsbD0iI2ZmZmZmZiIgb3BhY2l0eT0iMC4xIj48L2NpcmNsZT4KPC9zdmc+')",
      opacity: 0.6,
      zIndex: 1,
    },
    productsSection: {
      opacity: isVisible.products ? 1 : 0,
      transform: isVisible.products ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, ${colors.warmWhite}, ${colors.pinkBlush})`,
    },
    starProductSection: {
      backgroundImage: `linear-gradient(135deg, ${colors.pinkBlush} 0%, ${colors.warmWhite} 100%)`,
      opacity: isVisible.starProduct ? 1 : 0,
      transform: isVisible.starProduct ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      position: "relative",
      overflow: "hidden",
    },
    starProductPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzAgMzAgTDU0IDQ0IEw0NCA1NCBMMzAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y0OGZiMSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTMwIDMwIEw2IDQ0IEwxNiA1NCBMMzAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y0OGZiMSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTMwIDMwIEw1NCAxNiBMNDQgNiBMMzAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2Y0OGZiMSIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTMwIDMwIEw2IDE2IEwxNiA2IEwzMCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZjQ4ZmIxIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')",
      opacity: 0.7,
      zIndex: 0,
    },
    testimonialsSection: {
      opacity: isVisible.testimonials ? 1 : 0,
      transform: isVisible.testimonials ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, ${colors.pinkBlush}, ${colors.warmWhite})`,
      position: "relative",
    },
    testimonialsPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjZjhiYmQwIiBvcGFjaXR5PSIwLjA1Ij48L2NpcmNsZT4KPC9zdmc+')",
      opacity: 0.8,
      zIndex: 0,
    },
    ctaSection: {
      backgroundImage: `linear-gradient(135deg, rgba(136, 14, 79, 0.95) 0%, rgba(194, 24, 91, 0.9) 100%), url('https://images.unsplash.com/photo-1514557928579-7748b51b37ba?q=80&w=2940')`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      opacity: isVisible.cta ? 1 : 0,
      transform: isVisible.cta ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      position: "relative",
    },
    ctaOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `radial-gradient(circle at 30% 40%, ${colors.pinkLight} 0%, rgba(255,230,7,0) 50%)`,
      zIndex: 1,
    },
    pinkButton: {
      backgroundColor: colors.pinkBerry,
      borderColor: colors.pinkBerry,
      color: colors.warmWhite,
    },
    ctaPinkButton: {
      backgroundColor: colors.pinkBerry,
      borderColor: colors.pinkBerry,
      color: colors.warmWhite,
      borderRadius: "30px",
      padding: "12px 30px",
      fontWeight: "bold",
      fontSize: "1.1rem",
    },
    categoryOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `linear-gradient(to top, ${colors.pinkBerry} 0%, ${colors.pinkDeep} 50%, ${colors.pinkLight} 100%)`,
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "20px",
      transition: "all 0.3s ease",
      opacity: 0.8,
    },
    featureIcon: {
      fontSize: "2.5rem",
      background: `linear-gradient(135deg, ${colors.pinkBlush} 0%, ${colors.warmWhite} 100%)`,
      width: "80px",
      height: "80px",
      lineHeight: "80px",
      borderRadius: "50%",
      display: "inline-block",
      boxShadow: "0 5px 15px rgba(0,0,0,0.05)",
    },
    statNumber: {
      fontSize: "2.5rem",
      fontWeight: "bold",
      color: colors.pinkBerry,
      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
    },
    titleUnderline: {
      display: "block",
      width: "80px",
      height: "4px",
      backgroundColor: colors.pinkBerry,
      borderRadius: "2px",
      margin: "15px auto",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    whiteUnderline: {
      backgroundColor: colors.warmWhite,
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    testimonialQuote: {
      fontSize: "70px",
      position: "absolute",
      top: "10px",
      right: "20px",
      color: colors.pinkBlush,
      fontFamily: "serif",
    },
    testimonialCard: {
      borderRadius: "10px",
      overflow: "hidden",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      cursor: "pointer",
      height: "100%",
      border: "none",
    },
    starRating: {
      color: "#FFD700",
      fontSize: "20px",
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
    },
    starProductBadge: {
      backgroundColor: colors.pinkBerry,
      color: colors.warmWhite,
      fontWeight: "bold",
      fontSize: "1rem",
      padding: "8px 15px",
      borderRadius: "30px",
      display: "inline-block",
      boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
      position: "relative",
      zIndex: 2,
    },
    featureCheck: {
      color: colors.pinkMedium,
      marginRight: "8px",
      fontWeight: "bold",
    },
  };

  return (
    <>
      <style>{animationStyles}</style>

      {/* Hero Section */}
      <section className="py-5" style={customStyles.heroSection}>
        <div style={customStyles.heroOverlay}></div>
        <Container className="py-5 text-center text-white" style={{ position: "relative", zIndex: 2 }}>
          <h1 className="display-3 fw-bold mb-4" style={{ fontFamily: typography.fontPrimary }}>
            Eleva tu Danza con Estilo
          </h1>
          <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px" }}>
            Ropa, zapatos y accesorios para danza que combinan calidad, comodidad y elegancia.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-5 mt-5">
            <div className="text-center animate-in" style={{ animationDelay: "0.3s" }}>
              <div style={customStyles.statNumber}>1,000+</div>
              <div className="opacity-75">Productos disponibles</div>
            </div>
            <div className="text-center animate-in" style={{ animationDelay: "0.6s" }}>
              <div style={customStyles.statNumber}>95%</div>
              <div className="opacity-75">Clientes satisfechos</div>
            </div>
            <div className="text-center animate-in" style={{ animationDelay: "0.9s" }}>
              <div style={customStyles.statNumber}>24/7</div>
              <div className="opacity-75">Soporte online</div>
            </div>
          </div>
        </Container>
      </section>

      {/* Sección de Características */}
      <section className="py-5" style={customStyles.featuresSection}>
        <Container className="py-5" style={{ position: "relative", zIndex: 2 }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">
              Por Qué Elegirnos
              <span style={customStyles.titleUnderline}></span>
            </h2>
            <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
              Productos diseñados para bailarines, con opciones de compra y renta que se adaptan a ti.
            </p>
          </div>
          <Row className="g-4">
            {features.map((feature, idx) => (
              <Col md={6} lg={4} key={idx} className="mb-4 animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="h-100 shadow feature-card" style={productStyles.productCard}>
                  <Card.Body className="p-4 text-center">
                    <div className="mb-3 text-center">
                      <span className="feature-icon" style={customStyles.featureIcon}>{feature.icono}</span>
                    </div>
                    <h3 className="fs-4 fw-bold mb-3" style={{ color: colors.pinkBerry }}>{feature.titulo}</h3>
                    <p className="text-muted" style={{ color: colors.darkGrey }}>{feature.descripcion}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección de Categorías */}
      <section className="py-5 text-white" style={customStyles.categoriesSection}>
        <div style={customStyles.categoriesOverlay}></div>
        <Container className="py-5" style={{ position: "relative", zIndex: 2 }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold">
              Categorías de Danza
              <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
            </h2>
            <p className="lead opacity-75 mx-auto mb-5" style={{ maxWidth: "700px" }}>
              Explora nuestra selección de productos para cada estilo de danza.
            </p>
          </div>
          <Row className="g-4">
            {categorias.map((categoria, idx) => (
              <Col md={6} lg={3} key={idx} className="animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <div
                  className="position-relative rounded-4 overflow-hidden shadow h-100 category-card"
                  style={{ height: "200px" }}
                  onClick={() => handleCategoriaClick(categoria.nombre)}
                >
                  <img
                    src={categoria.imagen}
                    alt={categoria.nombre}
                    className="w-100 h-100"
                    style={{ objectFit: "cover" }}
                  />
                  <div style={customStyles.categoryOverlay}>
                    <h3 className="fs-4 fw-bold mb-1 category-title">{categoria.nombre}</h3>
                    <p className="small opacity-75">{categoria.cantidad} productos</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección de Producto Estrella */}
      {productoEstrella && (
        <section className="py-5" style={customStyles.starProductSection}>
          <div style={customStyles.starProductPattern}></div>
          <Container className="py-5" style={{ position: "relative", zIndex: 2 }}>
            <div className="text-center mb-5">
              <div className="mb-3">
                <span className="star-badge" style={customStyles.starProductBadge}>PRODUCTO ESTRELLA</span>
              </div>
              <h2 className="display-5 fw-bold text-dark">
                {productoEstrella.title}
                <span style={customStyles.titleUnderline}></span>
              </h2>
              <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
                Las zapatillas perfectas para brillar en el escenario con comodidad y estilo.
              </p>
            </div>
            <Row className="align-items-center g-5">
              <Col lg={6} className="animate-in" style={{ animationDelay: "0.2s" }}>
                <div className="position-relative">
                  <img
                    src={productoEstrella.image}
                    alt={productoEstrella.title}
                    className="rounded-4 shadow-lg img-fluid star-product-img"
                    style={{ objectFit: "cover" }}
                  />
                  {productoEstrella.discount > 0 && (
                    <div
                      className="position-absolute top-0 start-0 m-3 py-2 px-3 rounded-pill animate-in"
                      style={{
                        backgroundColor: colors.pinkMedium,
                        color: colors.warmWhite,
                        fontWeight: "bold",
                        animationDelay: "0.5s",
                        boxShadow: `0 5px 15px rgba(${parseInt(colors.pinkMedium.slice(1, 3), 16)},${parseInt(colors.pinkMedium.slice(3, 5), 16)},${parseInt(colors.pinkMedium.slice(5, 7), 16)},0.3)`,
                      }}
                    >
                      -{productoEstrella.discount}%
                    </div>
                  )}
                  <div
                    className="position-absolute bottom-0 end-0 m-3 py-2 px-3 rounded-pill animate-in"
                    style={{
                      backgroundColor: `rgba(${parseInt(colors.pinkBerry.slice(1, 3), 16)},${parseInt(colors.pinkBerry.slice(3, 5), 16)},${parseInt(colors.pinkBerry.slice(5, 7), 16)},0.8)`,
                      color: colors.warmWhite,
                      animationDelay: "0.7s",
                      boxShadow: `0 5px 15px rgba(${parseInt(colors.pinkBerry.slice(1, 3), 16)},${parseInt(colors.pinkBerry.slice(3, 5), 16)},${parseInt(colors.pinkBerry.slice(5, 7), 16)},0.3)`,
                    }}
                  >
                    <span className="me-1">★</span>
                    {productoEstrella.rating} ({productoEstrella.reviews} reseñas)
                  </div>
                </div>
              </Col>
              <Col lg={6} className="animate-in" style={{ animationDelay: "0.5s" }}>
                <div>
                  <h3 className="fs-2 fw-bold mb-4" style={{ color: colors.pinkBerry }}>{productoEstrella.title}</h3>
                  <p className="fs-5 mb-4" style={{ color: colors.darkGrey }}>
                    {productoEstrella.description}
                  </p>
                  <div className="mb-4">
                    <div className="d-flex mb-2">
                      <div className="fs-3 fw-bold me-3" style={{ color: colors.pinkBerry }}>
                        ${(productoEstrella.price - (productoEstrella.price * productoEstrella.discount) / 100).toFixed(2)}
                      </div>
                      {productoEstrella.discount > 0 && (
                        <div className="fs-5 text-decoration-line-through text-muted d-flex align-items-center">
                          ${productoEstrella.price.toFixed(2)}
                        </div>
                      )}
                    </div>
                    <div className="text-success">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {productoEstrella.availability}
                    </div>
                  </div>
                  <div className="mb-4">
                    <h4 className="fs-5 fw-bold mb-3" style={{ color: colors.pinkDeep }}>
                      Características principales:
                    </h4>
                    <Row className="g-3">
                      {productoEstrella.features.map((feature, idx) => (
                        <Col md={6} key={idx} className="animate-in" style={{ animationDelay: `${0.6 + idx * 0.1}s` }}>
                          <div className="d-flex align-items-center">
                            <span style={customStyles.featureCheck}>✓</span> {feature}
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                  <Button
                    size="lg"
                    className="mt-3 rounded-pill px-5 cta-button"
                    style={customStyles.pinkButton}
                    onClick={handleVerProductoEstrella}
                  >
                    Ver Detalles
                  </Button>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      )}

      {/* Sección de Productos Destacados */}
      <section className="py-5" style={customStyles.productsSection}>
        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap">
        <h2 className="display-5 fw-bold text-dark mb-3 mb-md-0">
          Productos Destacados
          <span style={customStyles.titleUnderline}></span>
        </h2>
        <a href="/productos" className="text-decoration-none fw-bold" style={{ color: colors.pinkBerry }}>
          Ver todos los productos <i className="bi bi-arrow-right ms-2"></i>
        </a>
      </div>
      <div className="animate-in" style={{ animationDelay: "0.3s" }}>
        <Cards items={destacados.length > 0 ? destacados : productos.slice(0, 4)} />
      </div>
    </Container>
  </section>

  {/* Sección de Testimonios */}
  <section className="py-5" style={customStyles.testimonialsSection}>
    <div style={customStyles.testimonialsPattern}></div>
    <Container className="py-5" style={{ position: "relative", zIndex: 2 }}>
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold text-dark">
          Lo que dicen nuestros clientes
          <span style={customStyles.titleUnderline}></span>
        </h2>
        <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
          Bailarines de todo el mundo confían en nosotros para sus necesidades de danza.
        </p>
      </div>
      <Row className="g-4">
        {testimonios.map((testimonio, idx) => (
          <Col lg={4} md={6} key={idx} className="animate-in" style={{ animationDelay: `${0.3 * idx}s` }}>
            <Card className="testimonial-card shadow" style={customStyles.testimonialCard}>
              <Card.Body className="p-4 position-relative">
                <div style={customStyles.testimonialQuote}>"</div>
                <p className="fs-5 mb-4" style={{ color: colors.darkGrey }}>
                  {testimonio.comentario}
                </p>
                <div className="d-flex align-items-center">
                  <Image
                    src={testimonio.foto}
                    alt={testimonio.nombre}
                    width={60}
                    height={60}
                    roundedCircle
                    className="me-3"
                  />
                  <div>
                    <h5 className="mb-1" style={{ color: colors.pinkBerry }}>
                      {testimonio.nombre}
                    </h5>
                    <p className="mb-2 text-muted">{testimonio.puesto}</p>
                    <div style={customStyles.starRating}>
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <span key={i}>{i < testimonio.estrellas ? "★" : "☆"}</span>
                        ))}
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <div className="text-center mt-5 animate-in" style={{ animationDelay: "0.9s" }}>
        <Button
          variant="outline"
          className="rounded-pill px-4 py-2"
          style={{ borderColor: colors.pinkBerry, color: colors.pinkBerry }}
          onClick={() => navigate("/testimonios")}
        >
          Ver más opiniones
        </Button>
      </div>
    </Container>
  </section>

  {/* Sección CTA */}
  <section className="py-5 text-white" style={customStyles.ctaSection}>
    <div style={customStyles.ctaOverlay}></div>
    <Container className="py-5 text-center" style={{ position: "relative", zIndex: 2 }}>
      <h2 className="display-4 fw-bold mb-3 animate-in" style={{ maxWidth: "800px", margin: "0 auto", animationDelay: "0.3s" }}>
        Baila con Confianza
      </h2>
      <p className="lead opacity-75 mb-5 mx-auto animate-in" style={{ maxWidth: "700px", animationDelay: "0.5s" }}>
        Únete a nuestra comunidad de bailarines y descubre productos exclusivos, consejos y más.
      </p>
      <div className="mx-auto animate-in" style={{ maxWidth: "500px", animationDelay: "0.7s" }}>
        <Button
          style={customStyles.ctaPinkButton}
          className="px-5 py-3 cta-button"
          onClick={() => navigate("/registro")}
        >
          Regístrate
        </Button>
      </div>
      <p className="mt-4 opacity-75 small animate-in" style={{ animationDelay: "0.9s" }}>
        <i className="bi bi-shield-check me-2"></i>
        Tu información está segura con nosotros.
      </p>
    </Container>
  </section>
</>
);
};

export default Inicio;