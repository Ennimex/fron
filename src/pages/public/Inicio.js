import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Cards from "../../components/shared/CardsV"; // Componente de tarjetas
import productos from '../../services/base'; // Importamos la base de datos simulada

const Inicio = () => {
  const navigate = useNavigate();
  const [destacados, setDestacados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productosState, setProductos] = useState([]); // Renombrado para evitar conflicto con la importación
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

  // Usar la base de datos simulada en lugar de la API
  useEffect(() => {
    // Asignamos directamente los datos de la base simulada
    setProductos(productos);

    // Filtrar productos destacados (con rating alto o descuento)
    const productosDestacados = productos
      .filter((p) => p.rating >= 4.7 || p.discount >= 10)
      .slice(0, 4);
    setDestacados(productosDestacados);

    // Extraer categorías únicas de productos
    const categoriasUnicas = [...new Set(productos.map((p) => p.category))];
    const categoriasData = categoriasUnicas.map((categoria) => {
      const productosCategoria = productos.filter((p) => p.category === categoria);
      return {
        nombre: categoria,
        cantidad: productosCategoria.length,
        imagen: productosCategoria[0]?.image,
      };
    });
    setCategorias(categoriasData);
  }, []);

  // Crear producto estrella (adaptado al contexto de danza folclórica)
  useEffect(() => {
    const trajeFolclorico = {
      _id: "650a1f1b3e0d3a001c1a4b22",
      image: "https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940",
      title: "Traje Folclórico Huasteco",
      description: "Traje tradicional huasteco con bordados artesanales, ideal para presentaciones de danza folclórica.",
      price: 129.99,
      category: "Danza Folclórica",
      stock: 20,
      brand: "HuastecaArte",
      rating: 4.9,
      reviews: 180,
      discount: 15,
      features: [
        "Bordados artesanales únicos",
        "Tela de algodón transpirable",
        "Diseño tradicional huasteco",
        "Ajuste cómodo para danza",
        "Disponible en varias tallas",
        "Ideal para festivales y presentaciones",
      ],
      warranty: "1 año",
      availability: "En stock",
      specs: {
        material: "Algodón y bordados",
        tallas: "S-XL",
        peso: "500g",
        color: "Multicolor (rojo, amarillo, verde)",
      },
    };
    setProductoEstrella(trajeFolclorico);

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
      titulo: "Estilos Tradicionales",
      descripcion: "Trajes y accesorios para danza folclórica huasteca, llenos de color y tradición.",
    },
    {
      icono: "👗",
      titulo: "Artesanía de Calidad",
      descripcion: "Productos hechos a mano con materiales auténticos y duraderos.",
    },
    {
      icono: "🛒",
      titulo: "Compra y Renta",
      descripcion: "Adquiere o renta trajes según tus necesidades para festivales y eventos.",
    },
    {
      icono: "🎨",
      titulo: "Diseños Auténticos",
      descripcion: "Bordados y patrones inspirados en la cultura huasteca.",
    },
    {
      icono: "📏",
      titulo: "Ajuste Perfecto",
      descripcion: "Tallas para todas las edades, con guías de medidas precisas.",
    },
    {
      icono: "🚚",
      titulo: "Envío Rápido",
      descripcion: "Entregas rápidas para que estés listo para tu próxima presentación.",
    },
  ];

  // Testimonios de clientes
  const testimonios = [
    {
      nombre: "María González",
      puesto: "Bailarina folclórica",
      foto: "https://randomuser.me/api/portraits/women/22.jpg",
      comentario: "Los trajes huastecos son hermosos y cómodos, perfectos para nuestras presentaciones en festivales.",
      estrellas: 5,
    },
    {
      nombre: "Juan Pérez",
      puesto: "Profesor de danza folclórica",
      foto: "https://randomuser.me/api/portraits/men/42.jpg",
      comentario: "La calidad de los bordados es impresionante. La renta de trajes es ideal para mis alumnos.",
      estrellas: 5,
    },
    {
      nombre: "Ana López",
      puesto: "Estudiante de danza",
      foto: "https://randomuser.me/api/portraits/women/55.jpg",
      comentario: "Me encanta la variedad de colores y la comodidad de los trajes. ¡Llegaron a tiempo para mi evento!",
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
      color: #A91B0D; /* Deep Red */
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
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.85) 0%, rgba(44, 107, 62, 0.9) 100%), url('https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940')`,
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
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjQTkxQjBEIj48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMDAgODRMMjggMTAwTDU2IDg0TDU2IDUwTDI4IDM0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8L3N2Zz4=')",
      opacity: 0.1,
      zIndex: 1,
    },
    featuresSection: {
      opacity: isVisible.features ? 1 : 0,
      transform: isVisible.features ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`, // Warm Beige to light yellow
      position: "relative",
      overflow: "hidden",
    },
    categoriesSection: {
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.95) 0%, rgba(38, 166, 154, 0.9) 100%), url('https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940')`,
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
      background: `linear-gradient(to bottom, #F5E8C7, #FFF8E1)`, // Warm Beige to light yellow
    },
    starProductSection: {
      backgroundImage: `linear-gradient(135deg, #FFF8E1 0%, #F5E8C7 100%)`, // Light yellow to Warm Beige
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
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzAgMzAgTDU0IDQ0IEw0NCA1NCBMMzAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTMwIDMwIEw2IDQ0IEwxNiA1NCBMMzAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTMwIDMwIEw1NCAxNiBMNDQgNiBMMzAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTMwIDMwIEw2IDE2IEwxNiA2IEwzMCAzMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMkU3RDMyIiBzdHJva2Utd2lkdGg9IjEiIG9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')",
      opacity: 0.7,
      zIndex: 0,
    },
    testimonialsSection: {
      opacity: isVisible.testimonials ? 1 : 0,
      transform: isVisible.testimonials ? "translateY(0)" : "translateY(30px)",
      transition: "all 0.8s ease-out",
      background: `linear-gradient(to bottom, #FFF8E1, #F5E8C7)`, // Light yellow to Warm Beige
      position: "relative",
    },
    testimonialsPattern: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+CjxyZWN0IHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgZmlsbD0ibm9uZSI+PC9yZWN0Pgo8Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSIjRkZDMTA3IiBvcGFjaXR5PSIwLjA1Ij48L2NpcmNsZT4KPC9zdmc+')",
      opacity: 0.8,
      zIndex: 0,
    },
    ctaSection: {
      backgroundImage: `linear-gradient(135deg, rgba(169, 27, 13, 0.95) 0%, rgba(38, 166, 154, 0.9) 100%), url('https://images.unsplash.com/photo-1519408291194-946735bcea13?q=80&w=2940')`,
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
      backgroundImage: `radial-gradient(circle at 30% 40%, #FFF8E1 0%, rgba(245,232,199,0) 50%)`, // Light yellow
      zIndex: 1,
    },
    redButton: {
      backgroundColor: '#A91B0D', // Deep Red
      borderColor: '#A91B0D',
      color: '#F5E8C7', // Warm Beige
    },
    ctaRedButton: {
      backgroundColor: '#A91B0D', // Deep Red
      borderColor: '#A91B0D',
      color: '#F5E8C7', // Warm Beige
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
      background: `linear-gradient(to top, #A91B0D 0%, #2E7D32 50%, #FFF8E1 100%)`, // Deep Red, Emerald Green, Light yellow
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: "20px",
      transition: "all 0.3s ease",
      opacity: 0.8,
    },
    featureIcon: {
      fontSize: "2.5rem",
      background: `linear-gradient(135deg, #FFF8E1 0%, #F5E8C7 100%)`, // Light yellow to Warm Beige
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
      color: '#A91B0D', // Deep Red
      textShadow: "0 2px 10px rgba(0,0,0,0.2)",
    },
    titleUnderline: {
      display: "block",
      width: "80px",
      height: "4px",
      backgroundColor: '#A91B0D', // Deep Red
      borderRadius: "2px",
      margin: "15px auto",
      boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    whiteUnderline: {
      backgroundColor: '#F5E8C7', // Warm Beige
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    },
    testimonialQuote: {
      fontSize: "70px",
      position: "absolute",
      top: "10px",
      right: "20px",
      color: '#FFF8E1', // Light yellow
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
      color: "#FFC107", // Vibrant Yellow
      fontSize: "20px",
      filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.1))",
    },
    starProductBadge: {
      backgroundColor: '#A91B0D', // Deep Red
      color: '#F5E8C7', // Warm Beige
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
      color: '#2E7D32', // Emerald Green
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
          <h1 className="display-3 fw-bold mb-4">
            Danza Folclórica Huasteca con Pasión
          </h1>
          <p className="fs-4 fw-light mb-5 mx-auto" style={{ maxWidth: "700px" }}>
            Trajes, accesorios y calzado para danza folclórica que celebran la tradición huasteca.
          </p>
          <div className="d-flex justify-content-center flex-wrap gap-5 mt-5">
            <div className="text-center animate-in" style={{ animationDelay: "0.3s" }}>
              <div style={customStyles.statNumber}>500+</div>
              <div className="opacity-75">Productos artesanales</div>
            </div>
            <div className="text-center animate-in" style={{ animationDelay: "0.6s" }}>
              <div style={customStyles.statNumber}>98%</div>
              <div className="opacity-75">Clientes satisfechos</div>
            </div>
            <div className="text-center animate-in" style={{ animationDelay: "0.9s" }}>
              <div style={customStyles.statNumber}>24/7</div>
              <div className="opacity-75">Soporte cultural</div>
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
              Trajes y accesorios diseñados para celebrar la danza folclórica huasteca con autenticidad.
            </p>
          </div>
          <Row className="g-4">
            {features.map((feature, idx) => (
              <Col md={6} lg={4} key={idx} className="mb-4 animate-in" style={{ animationDelay: `${0.2 * idx}s` }}>
                <Card className="h-100 shadow feature-card">
                  <Card.Body className="p-4 text-center">
                    <div className="mb-3 text-center">
                      <span className="feature-icon" style={customStyles.featureIcon}>{feature.icono}</span>
                    </div>
                    <h3 className="fs-4 fw-bold mb-3" style={{ color: '#A91B0D' }}>{feature.titulo}</h3>
                    <p className="text-muted" style={{ color: '#4A4A4A' }}>{feature.descripcion}</p>
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
              Categorías de Danza Folclórica
              <span style={{ ...customStyles.titleUnderline, ...customStyles.whiteUnderline }}></span>
            </h2>
            <p className="lead opacity-75 mx-auto mb-5" style={{ maxWidth: "700px" }}>
              Descubre nuestra selección de productos para cada estilo de danza huasteca.
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
                Un traje huasteco que combina tradición y comodidad para tus presentaciones.
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
                        backgroundColor: '#2E7D32', // Emerald Green
                        color: '#F5E8C7', // Warm Beige
                        fontWeight: "bold",
                        animationDelay: "0.5s",
                        boxShadow: `0 5px 15px rgba(46, 125, 50, 0.3)`, // Adjusted for rgba
                      }}
                    >
                      -{productoEstrella.discount}%
                    </div>
                  )}
                  <div
                    className="position-absolute bottom-0 end-0 m-3 py-2 px-3 rounded-pill animate-in"
                    style={{
                      backgroundColor: `rgba(169, 27, 13, 0.8)`, // Deep Red
                      color: '#F5E8C7', // Warm Beige
                      animationDelay: "0.7s",
                      boxShadow: `0 5px 15px rgba(169, 27, 13, 0.3)`, // Adjusted for rgba
                    }}
                  >
                    <span className="me-1">★</span>
                    {productoEstrella.rating} ({productoEstrella.reviews} reseñas)
                  </div>
                </div>
              </Col>
              <Col lg={6} className="animate-in" style={{ animationDelay: "0.5s" }}>
                <div>
                  <h3 className="fs-2 fw-bold mb-4" style={{ color: '#A91B0D' }}>{productoEstrella.title}</h3>
                  <p className="fs-5 mb-4" style={{ color: '#4A4A4A' }}>
                    {productoEstrella.description}
                  </p>
                  <div className="mb-4">
                    <div className="d-flex mb-2">
                      <div className="fs-3 fw-bold me-3" style={{ color: '#A91B0D' }}>
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
                    <h4 className="fs-5 fw-bold mb-3" style={{ color: '#2E7D32' }}>
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
                    style={customStyles.redButton}
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
            <a href="/productos" className="text-decoration-none fw-bold" style={{ color: '#A91B0D' }}>
              Ver todos los productos <i className="bi bi-arrow-right ms-2"></i>
            </a>
          </div>
          <div className="animate-in" style={{ animationDelay: "0.3s" }}>
            <Cards items={destacados.length > 0 ? destacados : productosState.slice(0, 4)} />
          </div>
        </Container>
      </section>

      {/* Sección de Testimonios */}
      <section className="py-5" style={customStyles.testimonialsSection}>
        <div style={customStyles.testimonialsPattern}></div>
        <Container className="py-5" style={{ position: "relative", zIndex: 2 }}>
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold text-dark">
              Lo que dicen nuestros bailarines
              <span style={customStyles.titleUnderline}></span>
            </h2>
            <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: "700px" }}>
              La comunidad huasteca confía en nosotros para sus trajes y accesorios de danza.
            </p>
          </div>
          <Row className="g-4">
            {testimonios.map((testimonio, idx) => (
              <Col lg={4} md={6} key={idx} className="animate-in" style={{ animationDelay: `${0.3 * idx}s` }}>
                <Card className="testimonial-card shadow" style={customStyles.testimonialCard}>
                  <Card.Body className="p-4 position-relative">
                    <div style={customStyles.testimonialQuote}>"</div>
                    <p className="fs-5 mb-4" style={{ color: '#4A4A4A' }}>
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
                        <h5 className="mb-1" style={{ color: '#A91B0D' }}>
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
              style={{ borderColor: '#A91B0D', color: '#A91B0D' }}
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
            Celebra la Tradición Huasteca
          </h2>
          <p className="lead opacity-75 mb-5 mx-auto animate-in" style={{ maxWidth: "700px", animationDelay: "0.5s" }}>
            Únete a nuestra comunidad de bailarines y descubre trajes y accesorios auténticos.
          </p>
          <div className="mx-auto animate-in" style={{ maxWidth: "500px", animationDelay: "0.7s" }}>
            <Button
              style={customStyles.ctaRedButton}
              className="px-5 py-3 cta-button"
              onClick={() => navigate("/login?register=true")}
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