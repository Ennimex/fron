import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import { colors, textStyles } from "../../styles/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import productos from "../../services/base";

const Productos = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [filtros, setFiltros] = useState({
    ordenar: "",
    talla: "",
    categoria: "",
    color: "",
    material: "",
    precio: "",
    busqueda: "",
  });

  const [showNotification, setShowNotification] = useState(false);
  const [filtrosExpandidos, setFiltrosExpandidos] = useState(false);
  const [productosFiltrados, setProductosFiltrados] = useState([]);
  const [filtrosActivos, setFiltrosActivos] = useState(0);
  const [vistaGrilla, setVistaGrilla] = useState(true);
  const [productosState, setProductosState] = useState([]);

  // Cargar productos desde la base de datos simulada
  useEffect(() => {
    setProductosState(productos);
    setProductosFiltrados(productos);
  }, []);

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const limpiarFiltros = () => {
    setFiltros({
      ordenar: "",
      talla: "",
      categoria: "",
      color: "",
      material: "",
      precio: "",
      busqueda: "",
    });
    document.querySelectorAll(".form-select").forEach((select) => (select.value = ""));
    document.querySelector("input[name='busqueda']").value = "";
  };

  const toggleFiltros = () => {
    setFiltrosExpandidos(!filtrosExpandidos);
  };

  const toggleVistaGrilla = () => {
    setVistaGrilla(!vistaGrilla);
  };

  const handleProductClick = (productoId, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    navigate(`/producto/${productoId}`);
  };

  const handleAddToCart = (producto, event) => {
    event.stopPropagation();
    addToCart(producto);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 2000);
  };

  const handleRent = (producto, event) => {
    event.stopPropagation();
    // Aquí puedes agregar la lógica para manejar la renta
    console.log('Rentar:', producto);
  };

  const filtrarProductos = React.useCallback((productos, filtros) => {
    let resultado = [...productos];
    let contadorFiltros = 0;

    if (filtros.busqueda) {
      const searchTerm = filtros.busqueda.toLowerCase();
      resultado = resultado.filter(
        (producto) =>
          producto.title.toLowerCase().includes(searchTerm) ||
          producto.description.toLowerCase().includes(searchTerm) ||
          producto.category.toLowerCase().includes(searchTerm)
      );
      contadorFiltros++;
    }

    if (filtros.categoria) {
      resultado = resultado.filter(
        (producto) => producto.category.toLowerCase() === filtros.categoria.toLowerCase()
      );
      contadorFiltros++;
    }

    if (filtros.color) {
      resultado = resultado.filter(
        (producto) => producto.color.toLowerCase() === filtros.color.toLowerCase()
      );
      contadorFiltros++;
    }

    if (filtros.material) {
      resultado = resultado.filter(
        (producto) => producto.material.toLowerCase().includes(filtros.material.toLowerCase())
      );
      contadorFiltros++;
    }

    if (filtros.talla) {
      resultado = resultado.filter((producto) =>
        producto.talla.includes(filtros.talla)
      );
      contadorFiltros++;
    }

    if (filtros.precio) {
      switch (filtros.precio) {
        case "low":
          resultado = resultado.filter((producto) => producto.price < 50);
          break;
        case "medium":
          resultado = resultado.filter(
            (producto) => producto.price >= 50 && producto.price <= 100
          );
          break;
        case "high":
          resultado = resultado.filter((producto) => producto.price > 100);
          break;
        default:
          break;
      }
      contadorFiltros++;
    }

    if (filtros.ordenar) {
      if (filtros.ordenar === "asc") {
        resultado.sort((a, b) => a.price - b.price);
      } else if (filtros.ordenar === "desc") {
        resultado.sort((a, b) => b.price - a.price);
      } else if (filtros.ordenar === "rating") {
        resultado.sort((a, b) => b.rating - a.rating);
      } else if (filtros.ordenar === "newest") {
        resultado.sort((a, b) => b._id.localeCompare(a._id));
      }
      contadorFiltros++;
    }

    return { resultado, contadorFiltros };
  }, []);

  useEffect(() => {
    const { resultado, contadorFiltros } = filtrarProductos(productosState, filtros);
    setProductosFiltrados(resultado);
    setFiltrosActivos(contadorFiltros);
  }, [filtros, productosState, filtrarProductos]);

  const styles = {
    pageContainer: {
      backgroundColor: "#f8f9fa",
      minHeight: "calc(100vh - 76px)",
      paddingTop: "30px",
      paddingBottom: "60px",
    },
    header: {
      marginBottom: "30px",
    },
    title: {
      ...textStyles.title,
      marginBottom: "10px",
      color: colors.pinkBerry,
    },
    subtitle: {
      ...textStyles.paragraph,
      color: colors.darkGrey,
      marginBottom: "20px",
    },
    filterBar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.warmWhite,
      padding: "15px 20px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      marginBottom: "20px",
    },
    searchContainer: {
      position: "relative",
      flex: "1 1 auto",
      maxWidth: "400px",
    },
    searchInput: {
      width: "100%",
      padding: "10px 15px 10px 40px",
      borderRadius: "8px",
      border: `1px solid ${colors.pinkLight}`,
      fontSize: "15px",
      transition: "all 0.3s",
    },
    searchIcon: {
      position: "absolute",
      left: "15px",
      top: "50%",
      transform: "translateY(-50%)",
      color: colors.pinkBerry,
    },
    filterActions: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    filterButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      padding: "10px 15px",
      backgroundColor: filtrosExpandidos ? colors.pinkBerry : colors.warmWhite,
      color: filtrosExpandidos ? colors.warmWhite : colors.pinkBerry,
      border: `1px solid ${colors.pinkLight}`,
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      fontWeight: "500",
    },
    filterCount: {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      minWidth: "20px",
      height: "20px",
      borderRadius: "10px",
      backgroundColor: filtrosActivos > 0 ? "#ffe607" : colors.pinkLight,
      color: filtrosActivos > 0 ? colors.pinkBerry : colors.warmWhite,
      fontSize: "12px",
      fontWeight: "bold",
      padding: "0 6px",
    },
    viewToggle: {
      display: "flex",
      alignItems: "center",
    },
    viewButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "40px",
      height: "40px",
      borderRadius: "8px",
      cursor: "pointer",
      transition: "all 0.2s",
      marginLeft: "8px",
    },
    activeViewButton: {
      backgroundColor: colors.pinkBerry,
      color: colors.warmWhite,
    },
    inactiveViewButton: {
      backgroundColor: "#e9ecef",
      color: colors.pinkBerry,
    },
    filterPanel: {
      backgroundColor: colors.warmWhite,
      padding: "20px",
      borderRadius: "12px",
      marginBottom: "25px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      display: filtrosExpandidos ? "block" : "none",
    },
    filterGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "15px",
    },
    filterGroup: {
      marginBottom: "15px",
    },
    filterLabel: {
      display: "block",
      fontSize: "14px",
      fontWeight: "600",
      color: colors.pinkBerry,
      marginBottom: "8px",
    },
    filterSelect: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: `1px solid ${colors.pinkLight}`,
      backgroundColor: colors.warmWhite,
      fontSize: "14px",
    },
    clearButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 15px",
      color: "#dc3545",
      backgroundColor: "rgba(220, 53, 69, 0.1)",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s",
    },
    applyButton: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      color: colors.warmWhite,
      backgroundColor: colors.pinkBerry,
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      transition: "all 0.2s",
    },
    resultsInfo: {
      fontSize: "15px",
      color: colors.pinkBerry,
      marginBottom: "20px",
    },
    productGrid: {
      display: "grid",
      gridTemplateColumns: vistaGrilla
        ? "repeat(auto-fill, minmax(250px, 1fr))"
        : "1fr",
      gap: "20px",
    },
    productCard: {
      backgroundColor: colors.warmWhite,
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "pointer",
      display: vistaGrilla ? "block" : "flex",
      height: vistaGrilla ? "400px" : "180px",
    },
    noResults: {
      textAlign: "center",
      padding: "40px 20px",
      backgroundColor: colors.warmWhite,
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    noResultsIcon: {
      fontSize: "48px",
      color: colors.pinkBerry,
      marginBottom: "20px",
    },
    noResultsText: {
      fontSize: "18px",
      color: colors.pinkBerry,
      marginBottom: "10px",
    },
    noResultsSubtext: {
      fontSize: "15px",
      color: colors.darkGrey,
    },
    notification: {
      position: "fixed",
      right: "20px",
      top: "70px",
      backgroundColor: "rgba(232, 30, 99, 0.95)", // Cambiado de colors.pinkBerry a un rgba más opaco
      color: colors.warmWhite,
      padding: "15px 25px",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.25)", // Aumentado la opacidad de la sombra
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      gap: "10px",
      animation: "slideInRight 0.3s ease-out",
      backdropFilter: "blur(5px)", // Agregado efecto de desenfoque
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>Productos de Danza</h1>
          <p style={styles.subtitle}>
            Explora nuestra selección de ropa, calzado y accesorios para danza, disponibles para venta y renta.
          </p>
        </div>

        <div style={styles.filterBar}>
          <div style={styles.searchContainer}>
            <i className="bi bi-search" style={styles.searchIcon}></i>
            <input
              name="busqueda"
              type="text"
              placeholder="Buscar productos de danza..."
              style={styles.searchInput}
              onChange={handleChange}
              value={filtros.busqueda}
            />
          </div>

          <div style={styles.filterActions}>
            <button style={styles.filterButton} onClick={toggleFiltros}>
              <i className="bi bi-funnel"></i>
              Filtros
              {filtrosActivos > 0 && <span style={styles.filterCount}>{filtrosActivos}</span>}
            </button>

            <div style={styles.viewToggle}>
              <div
                style={{
                  ...styles.viewButton,
                  ...(vistaGrilla ? styles.activeViewButton : styles.inactiveViewButton),
                }}
                onClick={() => vistaGrilla || toggleVistaGrilla()}
              >
                <i className="bi bi-grid-3x3-gap-fill"></i>
              </div>
              <div
                style={{
                  ...styles.viewButton,
                  ...(!vistaGrilla ? styles.activeViewButton : styles.inactiveViewButton),
                }}
                onClick={() => !vistaGrilla || toggleVistaGrilla()}
              >
                <i className="bi bi-list-ul"></i>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.filterPanel}>
          <div style={styles.filterGrid}>
            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Ordenar por</label>
              <select
                name="ordenar"
                className="form-select"
                style={styles.filterSelect}
                onChange={handleChange}
                value={filtros.ordenar}
              >
                <option value="">Relevancia</option>
                <option value="asc">Precio: Menor a Mayor</option>
                <option value="desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor valorados</option>
                <option value="newest">Más recientes</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Talla</label>
              <select
                name="talla"
                className="form-select"
                style={styles.filterSelect}
                onChange={handleChange}
                value={filtros.talla}
              >
                <option value="">Todas las tallas</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="EU 34">EU 34</option>
                <option value="EU 35">EU 35</option>
                <option value="EU 36">EU 36</option>
                <option value="EU 37">EU 37</option>
                <option value="EU 38">EU 38</option>
                <option value="EU 39">EU 39</option>
                <option value="Única">Única</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Categoría</label>
              <select
                name="categoria"
                className="form-select"
                style={styles.filterSelect}
                onChange={handleChange}
                value={filtros.categoria}
              >
                <option value="">Todas las categorías</option>
                <option value="Ballet">Ballet</option>
                <option value="Salsa">Salsa</option>
                <option value="Flamenco">Flamenco</option>
                <option value="Jazz">Jazz</option>
                <option value="Tap">Tap</option>
                <option value="Accesorios">Accesorios</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Color</label>
              <select
                name="color"
                className="form-select"
                style={styles.filterSelect}
                onChange={handleChange}
                value={filtros.color}
              >
                <option value="">Todos los colores</option>
                <option value="Rosa">Rosa</option>
                <option value="Negro">Negro</option>
                <option value="Rojo">Rojo</option>
                <option value="Gris">Gris</option>
                <option value="Azul">Azul</option>
                <option value="Rosa pálido">Rosa pálido</option>
                <option value="Blanco">Blanco</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Material</label>
              <select
                name="material"
                className="form-select"
                style={styles.filterSelect}
                onChange={handleChange}
                value={filtros.material}
              >
                <option value="">Todos los materiales</option>
                <option value="Cuero">Cuero</option>
                <option value="Lycra">Lycra</option>
                <option value="Poliéster">Poliéster</option>
                <option value="Algodón">Algodón</option>
                <option value="Satén">Satén</option>
                <option value="Nailon">Nailon</option>
                <option value="Chifón">Chifón</option>
              </select>
            </div>

            <div style={styles.filterGroup}>
              <label style={styles.filterLabel}>Precio</label>
              <select
                name="precio"
                className="form-select"
                style={styles.filterSelect}
                onChange={handleChange}
                value={filtros.precio}
              >
                <option value="">Cualquier precio</option>
                <option value="low">Menos de $50</option>
                <option value="medium">$50 - $100</option>
                <option value="high">Más de $100</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "15px", marginTop: "20px" }}>
            <button style={styles.clearButton} onClick={limpiarFiltros}>
              <i className="bi bi-trash3"></i>
              Limpiar filtros
            </button>
            <button style={styles.applyButton} onClick={toggleFiltros}>
              <i className="bi bi-check2"></i>
              Aplicar filtros
            </button>
          </div>
        </div>

        <div style={styles.resultsInfo}>
          Mostrando {productosFiltrados.length} productos {filtrosActivos > 0 ? "filtrados" : ""}
        </div>

        {productosFiltrados.length > 0 ? (
          <div className="productResults">
            <div style={styles.productGrid}>
              {productosFiltrados.map((producto) => (
                <div
                  key={producto._id}
                  style={styles.productCard}
                  onClick={(e) => handleProductClick(producto._id, e)}
                >
                  <div
                    style={{
                      padding: vistaGrilla ? "0" : "15px",
                      display: "flex",
                      flexDirection: vistaGrilla ? "column" : "row",
                      height: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: vistaGrilla ? "100%" : "180px",
                        height: vistaGrilla ? "220px" : "170px",
                        overflow: "hidden",
                        borderRadius: vistaGrilla ? "12px 12px 0 0" : "8px",
                      }}
                    >
                      <img
                        src={producto.image}
                        alt={producto.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div
                      style={{
                        padding: vistaGrilla ? "15px" : "0 0 0 20px",
                        flex: 1,
                      }}
                    >
                      <h3
                        style={{
                          fontSize: vistaGrilla ? "18px" : "20px",
                          fontWeight: "600",
                          marginBottom: "8px",
                          color: colors.pinkBerry,
                        }}
                      >
                        {producto.title}
                      </h3>

                      <p
                        style={{
                          fontSize: "14px",
                          marginBottom: "10px",
                          color: colors.darkGrey,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {producto.description}
                      </p>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          fontSize: "14px",
                          marginBottom: "8px",
                          gap: "3px",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", color: "#ffc107" }}>
                          <i className="bi bi-star-fill"></i>
                          <span style={{ color: colors.pinkBerry, fontWeight: "600", marginLeft: "3px" }}>
                            {producto.rating}
                          </span>
                          <span style={{ color: colors.darkGrey, fontSize: "12px", marginLeft: "3px" }}>
                            ({producto.reviews})
                          </span>
                        </div>
                        {producto.discount > 0 && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              fontSize: "14px",
                              color: colors.darkGrey,
                              marginLeft: "15px",
                            }}
                          >
                            ${producto.price.toFixed(2)}
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          marginTop: "8px",
                        }}
                      >
                        <div>
                          <span
                            style={{
                              fontSize: vistaGrilla ? "18px" : "22px",
                              fontWeight: "bold",
                              color: colors.pinkBerry,
                            }}
                          >
                            ${(producto.price * (1 - producto.discount / 100)).toFixed(2)}
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            gap: "10px",
                          }}
                        >
                          <button
                            style={{
                              backgroundColor: "#f8b195",
                              color: colors.warmWhite,
                              border: "none",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              width: "70px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => handleRent(producto, e)}
                          >
                            Renta
                          </button>
                          <button
                            style={{
                              backgroundColor: "#28a745",
                              color: colors.warmWhite,
                              border: "none",
                              borderRadius: "4px",
                              padding: "6px 12px",
                              fontSize: "12px",
                              fontWeight: "600",
                              cursor: "pointer",
                              transition: "all 0.2s",
                              width: "70px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={(e) => handleAddToCart(producto, e)}
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={styles.noResults}>
            <div style={styles.noResultsIcon}>
              <i className="bi bi-search"></i>
            </div>
            <h3 style={styles.noResultsText}>No se encontraron productos</h3>
            <p style={styles.noResultsSubtext}>
              Prueba con diferentes criterios de búsqueda o elimina algunos filtros.
            </p>
            <button
              style={{
                ...styles.clearButton,
                margin: "20px auto 0",
                display: "inline-flex",
              }}
              onClick={limpiarFiltros}
            >
              <i className="bi bi-arrow-repeat"></i>
              Restablecer filtros
            </button>
          </div>
        )}

        {showNotification && (
          <div style={styles.notification}>
            <i className="bi bi-check-circle-fill"></i>
            Producto agregado al carrito
          </div>
        )}
      </div>
    </div>
  );
};

// Agregar los keyframes para la animación
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);

export default Productos;