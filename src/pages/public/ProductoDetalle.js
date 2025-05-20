import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
      backgroundColor: '#F5E8C7', // Warm Beige
      minHeight: '100vh',
      padding: '40px 20px',
    },
    innerContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
    },
    productGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '40px',
      backgroundColor: '#FFFFFF',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    imageContainer: {
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    },
    image: {
      width: '100%',
      height: '500px',
      objectFit: 'cover',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
    },
    details: {
      display: 'flex',
      flexDirection: 'column',
      gap: '25px',
    },
    title: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#A91B0D', // Deep Red
      marginBottom: '15px',
    },
    description: {
      fontSize: '1.1rem',
      color: '#4A4A4A', // Dark Grey
      lineHeight: '1.6',
    },
    priceContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      marginBottom: '20px',
    },
    price: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#2E7D32', // Emerald Green
    },
    oldPrice: {
      textDecoration: 'line-through',
      color: '#4A4A4A',
      fontSize: '24px',
    },
    discount: {
      backgroundColor: '#A91B0D',
      color: '#F5E8C7',
      padding: '8px 15px',
      borderRadius: '20px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
    },
    infoItem: {
      backgroundColor: '#FFF8E1',
      padding: '15px 20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-3px)',
      },
    },
    infoLabel: {
      color: '#2E7D32',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    infoValue: {
      color: '#4A4A4A',
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '10px',
      color: '#A91B0D',
      backgroundColor: 'transparent',
      border: '2px solid #A91B0D',
      borderRadius: '8px',
      padding: '10px 20px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '30px',
      '&:hover': {
        backgroundColor: '#A91B0D',
        color: '#F5E8C7',
        transform: 'translateY(-2px)',
      },
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: '#FFC107', // Vibrant Yellow
      fontSize: '18px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.innerContainer}>
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
            
            <div style={styles.priceContainer}>
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
                <div style={styles.infoLabel}>Categoría</div>
                <div style={styles.infoValue}>{producto.category}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Material</div>
                <div style={styles.infoValue}>{producto.material}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Color</div>
                <div style={styles.infoValue}>{producto.color}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Tallas disponibles</div>
                <div style={styles.infoValue}>{producto.talla.join(", ")}</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Stock</div>
                <div style={styles.infoValue}>{producto.stock} unidades</div>
              </div>
              <div style={styles.infoItem}>
                <div style={styles.infoLabel}>Valoración</div>
                <div style={styles.rating}>
                  {'★'.repeat(Math.floor(producto.rating))}
                  {'☆'.repeat(5 - Math.floor(producto.rating))}
                  <span style={{ color: '#4A4A4A', marginLeft: '5px' }}>
                    ({producto.reviews} reseñas)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductoDetalle;