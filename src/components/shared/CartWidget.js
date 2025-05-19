import React from 'react';
import { useCart } from '../../context/CartContext';
import { colors } from '../../styles/styles';

const CartWidget = () => {
  const { cart } = useCart();

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const styles = {
    widget: {
      position: 'fixed',
      right: '20px',
      bottom: '20px',
      backgroundColor: colors.pinkBerry,
      color: colors.warmWhite,
      padding: '12px',
      borderRadius: '50%',
      cursor: 'pointer',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      zIndex: 1000,
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#ffe607',
      color: colors.pinkBerry,
      borderRadius: '50%',
      padding: '4px 8px',
      fontSize: '12px',
      fontWeight: 'bold',
    }
  };

  return (
    <div style={styles.widget}>
      <i className="bi bi-cart3" style={{ fontSize: '24px' }}></i>
      {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
    </div>
  );
};

export default CartWidget;
