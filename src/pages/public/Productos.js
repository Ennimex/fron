import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from '../../context/CartContext';
import productos from "../../services/base";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

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

  const cssStyles = `
    :root {
      --huasteca-red: #A91B0D;
      --huasteca-green: #2E7D32;
      --huasteca-beige: #F5E8C7;
      --huasteca-yellow: #FFF8E1;
      --huasteca-dark: #4A4A4A;
    }

    .productos-container {
      background-color: var(--huasteca-yellow);
      min-height: calc(100vh - 76px);
      padding-top: 30px;
      padding-bottom: 60px;
      font-family: 'Playfair Display', serif;
    }

    .productos-header {
      margin-bottom: 30px;
      text-align: center;
    }

    .productos-title {
      font-size: 2.625rem;
      font-weight: 800;
      color: var(--huasteca-red);
      margin-bottom: 10px;
      position: relative;
      display: inline-block;
    }

    .productos-title::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 100%;
      height: 3px;
      background: linear-gradient(90deg, var(--huasteca-red), var(--huasteca-green));
    }

    .productos-subtitle {
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--huasteca-dark);
      margin-bottom: 20px;
    }

    .productos-filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: var(--huasteca-beige);
      padding: 15px 20px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      margin-bottom: 20px;
      position: relative;
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVFOEM3Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMDAgODRMMjggMTAwTDU2IDg0TDU2IDUwTDI4IDM0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8L3N2Zz4=');
      background-size: 56px 100px;
      background-repeat: repeat;
      background-opacity: 0.1;
    }

    .productos-search-container {
      position: relative;
      flex: 1 1 auto;
      max-width: 400px;
    }

    .productos-search-input {
      width: 100%;
      padding: 10px 15px 10px 40px;
      border-radius: 8px;
      border: 1px solid var(--huasteca-red);
      font-size: 0.9375rem;
      transition: all 0.3s;
      background-color: var(--huasteca-yellow);
      font-family: 'Playfair Display', serif;
    }

    .productos-search-input:focus {
      outline: none;
      border-color: var(--huasteca-green);
      box-shadow: 0 0 5px rgba(46, 125, 50, 0.5);
    }

    .productos-search-icon {
      position: absolute;
      left: 15px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--huasteca-red);
    }

    .productos-filter-actions {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .productos-filter-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 10px 15px;
      border: 1px solid var(--huasteca-red);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      font-weight: 500;
      font-size: 0.875rem;
      font-family: 'Playfair Display', serif;
    }

    .productos-filter-button.expanded {
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-filter-button:not(.expanded) {
      background-color: var(--huasteca-beige);
      color: var(--huasteca-red);
    }

    .productos-filter-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      font-size: 0.75rem;
      font-weight: bold;
      padding: 0 6px;
      font-family: 'Playfair Display', serif;
    }

    .productos-filter-count.active {
      background-color: #ffe607;
      color: var(--huasteca-red);
    }

    .productos-filter-count:not(.active) {
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-view-toggle {
      display: flex;
      align-items: center;
    }

    .productos-view-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      margin-left: 8px;
    }

    .productos-view-button.active {
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-view-button:not(.active) {
      background-color: #e9ecef;
      color: var(--huasteca-red);
    }

    .productos-filter-panel {
      background-color: var(--huasteca-beige);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 25px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      display: none;
    }

    .productos-filter-panel.expanded {
      display: block;
    }

    .productos-filter-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
    }

    .productos-filter-group {
      margin-bottom: 15px;
    }

    .productos-filter-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--huasteca-red);
      margin-bottom: 8px;
      font-family: 'Playfair Display', serif;
    }

    .productos-filter-select.form-select {
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: 1px solid var(--huasteca-red);
      background-color: var(--huasteca-yellow);
      font-size: 0.875rem;
      font-family: 'Playfair Display', serif;
    }

    .productos-clear-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      color: var(--huasteca-red);
      background-color: rgba(169, 27, 13, 0.1);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s;
      font-family: 'Playfair Display', serif;
    }

    .productos-clear-button:hover {
      background-color: rgba(169, 27, 13, 0.2);
    }

    .productos-apply-button {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      color: var(--huasteca-beige);
      background-color: var(--huasteca-red);
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      font-size: 0.875rem;
      transition: all 0.2s;
      font-family: 'Playfair Display', serif;
    }

    .productos-apply-button:hover {
      background-color: var(--huasteca-green);
    }

    .productos-results-info {
      font-size: 0.9375rem;
      color: var(--huasteca-red);
      margin-bottom: 20px;
      font-family: 'Playfair Display', serif;
    }

    .productos-product-grid {
      display: grid;
      gap: 20px;
    }

    .productos-product-grid.grid-view {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    .productos-product-grid.list-view {
      grid-template-columns: 1fr;
    }

    .productos-product-card {
      background-color: var(--huasteca-beige);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s, box-shadow 0.3s;
      cursor: pointer;
      animation: fadeInUp 0.5s ease-out;
    }

    .productos-product-card.grid-view {
      display: block;
      height: 400px;
    }

    .productos-product-card.list-view {
      display: flex;
      height: 180px;
    }

    .productos-product-card:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    .productos-product-content {
      display: flex;
      height: 100%;
    }

    .productos-product-content.grid-view {
      flex-direction: column;
      padding: 0;
    }

    .productos-product-content.list-view {
      flex-direction: row;
      padding: 15px;
    }

    .productos-product-image-container {
      overflow: hidden;
    }

    .productos-product-image-container.grid-view {
      width: 100%;
      height: 220px;
      border-radius: 12px 12px 0 0;
    }

    .productos-product-image-container.list-view {
      width: 180px;
      height: 170px;
      border-radius: 8px;
    }

    .productos-product-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .productos-product-details {
      flex: 1;
    }

    .productos-product-details.grid-view {
      padding: 15px;
    }

    .productos-product-details.list-view {
      padding: 0 0 0 20px;
    }

    .productos-product-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: var(--huasteca-red);
      font-family: 'Playfair Display', serif;
    }

    .productos-product-title.list-view {
      font-size: 1.25rem;
    }

    .productos-product-description {
      font-size: 0.875rem;
      font-weight: 400;
      margin-bottom: 10px;
      color: var(--huasteca-dark);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-family: 'Playfair Display', serif;
    }

    .productos-product-rating {
      display: flex;
      align-items: center;
      font-size: 0.875rem;
      margin-bottom: 8px;
      gap: 3px;
      color: #ffc107;
      font-family: 'Playfair Display', serif;
    }

    .productos-product-rating-score {
      color: var(--huasteca-red);
      font-weight: 600;
      margin-left: 3px;
    }

    .productos-product-rating-reviews {
      color: var(--huasteca-dark);
      font-size: 0.75rem;
      margin-left: 3px;
    }

    .productos-product-original-price {
      text-decoration: line-through;
      font-size: 0.875rem;
      color: var(--huasteca-dark);
      margin-left: 15px;
      font-family: 'Playfair Display', serif;
    }

    .productos-product-price-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .productos-product-price {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--huasteca-red);
      font-family: 'Playfair Display', serif;
    }

    .productos-product-price.list-view {
      font-size: 1.375rem;
    }

    .productos-product-actions {
      display: flex;
      gap: 10px;
    }

    .productos-rent-button,
    .productos-add-button {
      border: none;
      border-radius: 4px;
      padding: 6px 12px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      width: 70px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Playfair Display', serif;
    }

    .productos-rent-button {
      background-color: var(--huasteca-red);
      color: var(--huasteca-beige);
    }

    .productos-rent-button:hover {
      background-color: var(--huasteca-green);
    }

    .productos-add-button {
      background-color: var(--huasteca-green);
      color: var(--huasteca-beige);
    }

    .productos-add-button:hover {
      background-color: var(--huasteca-red);
    }

    .productos-no-results {
      text-align: center;
      padding: 40px 20px;
      background-color: var(--huasteca-beige);
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1NiIgaGVpZ2h0PSIxMDAiPgo8cmVjdCB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVFOEM3Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0yOCA2NkwwIDUwTDAgMTZMMjggMEw1NiAxNkw1NiA1MEwyOCA2NkwyOCAxMDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIyIj48L3BhdGg+CjxwYXRoIGQ9Ik0yOCAwTDI4IDM0TDAgNTBMMDAgODRMMjggMTAwTDU2IDg0TDU2IDUwTDI4IDM0IiBmaWxsPSJub25lIiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPgo8L3N2Zz4=');
      background-size: 56px 100px;
      background-repeat: repeat;
      background-opacity: 0.1;
    }

    .productos-no-results-icon {
      font-size: 3rem;
      color: var(--huasteca-red);
      margin-bottom: 20px;
    }

    .productos-no-results-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--huasteca-red);
      margin-bottom: 10px;
      font-family: 'Playfair Display', serif;
    }

    .productos-no-results-subtext {
      font-size: 1.125rem;
      font-weight: 400;
      color: var(--huasteca-dark);
      font-family: 'Playfair Display', serif;
    }

    .productos-no-results-button {
      margin: 20px auto 0;
      display: inline-flex;
    }

    .productos-notification {
      position: fixed;
      right: 20px;
      top: 70px;
      background-color: rgba(169, 27, 13, 0.95);
      color: var(--huasteca-beige);
      padding: 15px 25px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
      z-index: 1000;
      display: flex;
      align-items: center;
      gap: 10px;
      animation: slideInRight 0.3s ease-out;
      backdrop-filter: blur(5px);
      font-family: 'Playfair Display', serif;
    }

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

    @media (max-width: 768px) {
      .productos-title {
        font-size: 2rem;
      }

      .productos-subtitle {
        font-size: 1rem;
      }

      .productos-filter-bar {
        flex-direction: column;
        gap: 15px;
      }

      .productos-search-container {
        max-width: 100%;
      }

      .productos-filter-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 576px) {
      .productos-product-grid.grid-view {
        grid-template-columns: 1fr;
      }

      .productos-product-card.grid-view {
        height: auto;
      }

      .productos-product-title {
        font-size: 1rem;
      }

      .productos-product-price {
        font-size: 1rem;
      }
    }
  `;

  return (
    <>
      <style>{cssStyles}</style>
      <div className="productos-container">
        <div className="container">
          <div className="productos-header">
            <h1 className="productos-title">Productos de Danza</h1>
            <p className="productos-subtitle">
              Explora nuestra selección de ropa, calzado y accesorios para danza huasteca, disponibles para venta y renta.
            </p>
          </div>

          <div className="productos-filter-bar">
            <div className="productos-search-container">
              <i className="bi bi-search productos-search-icon"></i>
              <input
                name="busqueda"
                type="text"
                placeholder="Buscar productos de danza..."
                className="productos-search-input"
                onChange={handleChange}
                value={filtros.busqueda}
              />
            </div>

            <div className="productos-filter-actions">
              <button
                className={`productos-filter-button ${filtrosExpandidos ? 'expanded' : ''}`}
                onClick={toggleFiltros}
              >
                <i className="bi bi-funnel"></i>
                Filtros
                {filtrosActivos > 0 && (
                  <span className={`productos-filter-count ${filtrosActivos > 0 ? 'active' : ''}`}>
                    {filtrosActivos}
                  </span>
                )}
              </button>

              <div className="productos-view-toggle">
                <div
                  className={`productos-view-button ${vistaGrilla ? 'active' : ''}`}
                  onClick={() => vistaGrilla || toggleVistaGrilla()}
                >
                  <i className="bi bi-grid-3x3-gap-fill"></i>
                </div>
                <div
                  className={`productos-view-button ${!vistaGrilla ? 'active' : ''}`}
                  onClick={() => !vistaGrilla || toggleVistaGrilla()}
                >
                  <i className="bi bi-list-ul"></i>
                </div>
              </div>
            </div>
          </div>

          <div className={`productos-filter-panel ${filtrosExpandidos ? 'expanded' : ''}`}>
            <div className="productos-filter-grid">
              <div className="productos-filter-group">
                <label className="productos-filter-label">Ordenar por</label>
                <select
                  name="ordenar"
                  className="form-select productos-filter-select"
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

              <div className="productos-filter-group">
                <label className="productos-filter-label">Talla</label>
                <select
                  name="talla"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.talla}
                >
                  <option value="">Todas las tallas</option>
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="Única">Única</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Categoría</label>
                <select
                  name="categoria"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.categoria}
                >
                  <option value="">Todas las categorías</option>
                  <option value="Huasteca">Huasteca</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Color</label>
                <select
                  name="color"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.color}
                >
                  <option value="">Todos los colores</option>
                  <option value="Rojo">Rojo</option>
                  <option value="Verde">Verde</option>
                  <option value="Blanco">Blanco</option>
                  <option value="Negro">Negro</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Material</label>
                <select
                  name="material"
                  className="form-select productos-filter-select"
                  onChange={handleChange}
                  value={filtros.material}
                >
                  <option value="">Todos los materiales</option>
                  <option value="Algodón">Algodón</option>
                  <option value="Seda">Seda</option>
                  <option value="Lino">Lino</option>
                </select>
              </div>

              <div className="productos-filter-group">
                <label className="productos-filter-label">Precio</label>
                <select
                  name="precio"
                  className="form-select productos-filter-select"
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
              <button className="productos-clear-button" onClick={limpiarFiltros}>
                <i className="bi bi-trash3"></i>
                Limpiar filtros
              </button>
              <button className="productos-apply-button" onClick={toggleFiltros}>
                <i className="bi bi-check2"></i>
                Aplicar filtros
              </button>
            </div>
          </div>

          <div className="productos-results-info">
            Mostrando {productosFiltrados.length} productos {filtrosActivos > 0 ? "filtrados" : ""}
          </div>

          {productosFiltrados.length > 0 ? (
            <div className="productResults">
              <div className={`productos-product-grid ${vistaGrilla ? 'grid-view' : 'list-view'}`}>
                {productosFiltrados.map((producto) => (
                  <div
                    key={producto._id}
                    className={`productos-product-card ${vistaGrilla ? 'grid-view' : 'list-view'}`}
                    onClick={(e) => handleProductClick(producto._id, e)}
                  >
                    <div className={`productos-product-content ${vistaGrilla ? 'grid-view' : 'list-view'}`}>
                      <div className={`productos-product-image-container ${vistaGrilla ? 'grid-view' : 'list-view'}`}>
                        <img
                          src={producto.image}
                          alt={producto.title}
                          className="productos-product-image"
                        />
                      </div>
                      <div className={`productos-product-details ${vistaGrilla ? 'grid-view' : 'list-view'}`}>
                        <h3 className={`productos-product-title ${vistaGrilla ? '' : 'list-view'}`}>
                          {producto.title}
                        </h3>
                        <p className="productos-product-description">
                          {producto.description}
                        </p>
                        <div className="productos-product-rating">
                          <i className="bi bi-star-fill"></i>
                          <span className="productos-product-rating-score">{producto.rating}</span>
                          <span className="productos-product-rating-reviews">({producto.reviews})</span>
                          {producto.discount > 0 && (
                            <span className="productos-product-original-price">
                              ${producto.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="productos-product-price-container">
                          <div>
                            <span className={`productos-product-price ${vistaGrilla ? '' : 'list-view'}`}>
                              ${(producto.price * (1 - producto.discount / 100)).toFixed(2)}
                            </span>
                          </div>
                          <div className="productos-product-actions">
                            <button
                              className="productos-rent-button"
                              onClick={(e) => handleRent(producto, e)}
                            >
                              Renta
                            </button>
                            <button
                              className="productos-add-button"
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
            <div className="productos-no-results">
              <div className="productos-no-results-icon">
                <i className="bi bi-search"></i>
              </div>
              <h3 className="productos-no-results-text">No se encontraron productos</h3>
              <p className="productos-no-results-subtext">
                Prueba con diferentes criterios de búsqueda o elimina algunos filtros.
              </p>
              <button
                className="productos-clear-button productos-no-results-button"
                onClick={limpiarFiltros}
              >
                <i className="bi bi-arrow-repeat"></i>
                Restablecer filtros
              </button>
            </div>
          )}

          {showNotification && (
            <div className="productos-notification">
              <i className="bi bi-check-circle-fill"></i>
              Producto agregado al carrito
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Productos;