import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { colors, textStyles } from "../../styles/styles";
import productos from "../../services/base";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    const productoEncontrado = productos.find(p => p._id === id);
    if (productoEncontrado) {
      setProducto(productoEncontrado);
    } else {
      navigate('/productos'); // Redirige si no encuentra el producto
    }
  }, [id, navigate]);

  if (!producto) {
    return <div>Cargando...</div>;
  }

  const precioFinal = producto.price * (1 - producto.discount / 100);

  const styles = {
    container: {
      padding: "40px 20px",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    productGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "40px",
      backgroundColor: colors.warmWhite,
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    },
    imageContainer: {
      borderRadius: "8px",
      overflow: "hidden",
    },
    image: {
      width: "100%",
      height: "500px",
      objectFit: "cover",
    },
    details: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    title: {
      ...textStyles.title,
      color: colors.pinkBerry,
      marginBottom: "10px",
    },
    description: {
      ...textStyles.paragraph,
      color: colors.darkGrey,
    },
    price: {
      fontSize: "28px",
      fontWeight: "bold",
      color: colors.pinkBerry,
    },
    oldPrice: {
      textDecoration: "line-through",
      color: colors.darkGrey,
      marginRight: "10px",
    },
    discount: {
      backgroundColor: "#ffe607",
      color: colors.pinkBerry,
      padding: "4px 8px",
      borderRadius: "4px",
      fontSize: "14px",
      fontWeight: "bold",
    },
    infoGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "15px",
    },
    infoItem: {
      backgroundColor: "rgba(232, 30, 99, 0.1)",
      padding: "10px 15px",
      borderRadius: "8px",
    },
    backButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      color: colors.pinkBerry,
      border: "none",
      background: "none",
      fontSize: "16px",
      cursor: "pointer",
      marginBottom: "20px",
    }
  };

  return (
    <div style={styles.container}>
      <button style={styles.backButton} onClick={() => navigate('/productos')}>
        <i className="bi bi-arrow-left"></i>
        Volver a Productos
      </button>

      <div style={styles.productGrid}>
        <div style={styles.imageContainer}>
          <img src={producto.image} alt={producto.title} style={styles.image} />
        </div>

        <div style={styles.details}>
          <h1 style={styles.title}>{producto.title}</h1>
          
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {producto.discount > 0 && (
              <span style={styles.oldPrice}>${producto.price.toFixed(2)}</span>
            )}
            <span style={styles.price}>${precioFinal.toFixed(2)}</span>
            {producto.discount > 0 && (
              <span style={styles.discount}>-{producto.discount}%</span>
            )}
          </div>

          <p style={styles.description}>{producto.description}</p>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <strong>Categoría:</strong> {producto.category}
            </div>
            <div style={styles.infoItem}>
              <strong>Material:</strong> {producto.material}
            </div>
            <div style={styles.infoItem}>
              <strong>Color:</strong> {producto.color}
            </div>
            <div style={styles.infoItem}>
              <strong>Tallas disponibles:</strong> {producto.talla.join(", ")}
            </div>
            <div style={styles.infoItem}>
              <strong>Stock:</strong> {producto.stock} unidades
            </div>
            <div style={styles.infoItem}>
              <strong>Valoración:</strong> {producto.rating}/5 ({producto.reviews} reseñas)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;