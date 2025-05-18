import React from "react";
import { useCart } from "../../context/CartContext";
import { colors, textStyles } from "../../styles/styles";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";

const Carrito = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart
      .reduce((total, item) => {
        const price = item.price * (1 - (item.discount || 0) / 100);
        return total + price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  const styles = {
    pageContainer: {
      backgroundColor: "#f8f9fa",
      minHeight: "calc(100vh - 76px)",
      paddingTop: "30px",
      paddingBottom: "60px",
    },
    header: {
      marginBottom: "30px",
      textAlign: "center",
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
    cartContainer: {
      backgroundColor: colors.warmWhite,
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
      maxWidth: "800px",
      margin: "0 auto",
    },
    cartItem: {
      display: "flex",
      alignItems: "center",
      padding: "15px 0",
      borderBottom: `1px solid ${colors.pinkLight}`,
    },
    cartItemImage: {
      width: "100px",
      height: "100px",
      objectFit: "cover",
      borderRadius: "8px",
      marginRight: "20px",
      border: `1px solid ${colors.pinkLight}`,
    },
    cartItemDetails: {
      flex: 1,
    },
    cartItemTitle: {
      fontSize: "18px",
      fontWeight: "500",
      color: colors.pinkBerry,
      marginBottom: "5px",
    },
    cartItemPrice: {
      fontSize: "16px",
      color: colors.darkGrey,
      marginBottom: "10px",
    },
    cartItemQuantity: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
    },
    quantityButton: {
      width: "34px",
      height: "34px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      border: `1px solid ${colors.pinkLight}`,
      backgroundColor: colors.warmWhite,
      borderRadius: "4px",
      cursor: "pointer",
      fontSize: "16px",
      color: colors.pinkBerry,
    },
    quantityText: {
      fontSize: "16px",
      color: colors.pinkBerry,
      minWidth: "30px",
      textAlign: "center",
    },
    cartItemRemove: {
      background: "none",
      border: "none",
      color: "#dc3545",
      cursor: "pointer",
      fontSize: "16px",
    },
    cartTotal: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: "18px",
      fontWeight: "600",
      color: colors.pinkBerry,
      marginTop: "20px",
      padding: "15px 0",
      borderTop: `1px solid ${colors.pinkLight}`,
    },
    checkoutButton: {
      width: "100%",
      padding: "12px",
      backgroundColor: colors.pinkBerry,
      color: colors.warmWhite,
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "16px",
      marginTop: "20px",
      transition: "all 0.2s",
    },
    emptyCart: {
      textAlign: "center",
      padding: "40px 20px",
      color: colors.darkGrey,
      fontSize: "18px",
    },
    emptyCartIcon: {
      fontSize: "48px",
      color: colors.pinkLight,
      marginBottom: "20px",
    },
    continueShoppingButton: {
      display: "inline-flex",
      alignItems: "center",
      gap: "8px",
      padding: "10px 20px",
      color: colors.warmWhite,
      backgroundColor: colors.pinkBerry,
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500",
      marginTop: "20px",
      fontSize: "16px",
    },
  };

  return (
    <div style={styles.pageContainer}>
      <div className="container">
        <div style={styles.header}>
          <h1 style={styles.title}>Tu Carrito</h1>
          <p style={styles.subtitle}>
            Revisa los productos que has agregado a tu carrito.
          </p>
        </div>

        <div style={styles.cartContainer}>
          {cart.length === 0 ? (
            <div style={styles.emptyCart}>
              <i className="bi bi-cart-x" style={styles.emptyCartIcon}></i>
              <p>Tu carrito está vacío.</p>
              <button
                style={styles.continueShoppingButton}
                onClick={() => (window.location.href = "/productos")}
              >
                <i className="bi bi-arrow-left"></i>
                Continuar comprando
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item._id} style={styles.cartItem}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={styles.cartItemImage}
                  />
                  <div style={styles.cartItemDetails}>
                    <h3 style={styles.cartItemTitle}>{item.title}</h3>
                    <p style={styles.cartItemPrice}>
                      $
                      {(
                        item.price * (1 - (item.discount || 0) / 100)
                      ).toFixed(2)}{" "}
                      x {item.quantity}
                    </p>
                    <div style={styles.cartItemQuantity}>
                      <button
                        style={styles.quantityButton}
                        onClick={() =>
                          updateQuantity(item._id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span style={styles.quantityText}>{item.quantity}</span>
                      <button
                        style={styles.quantityButton}
                        onClick={() =>
                          updateQuantity(item._id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <button
                    style={styles.cartItemRemove}
                    onClick={() => removeFromCart(item._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              ))}
              <div style={styles.cartTotal}>
                <span>Total:</span>
                <span>${calculateTotal()}</span>
              </div>
              <button
                style={styles.checkoutButton}
                onClick={() =>
                  alert("Proceder al pago (funcionalidad no implementada)")
                }
              >
                Proceder al Pago
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Carrito;