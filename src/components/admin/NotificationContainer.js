import React from 'react';

// Componente de notificación individual
const NotificationItem = ({ notification, onRemove }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'warning':
        return '⚠';
      case 'info':
      default:
        return 'ℹ';
    }
  };

  const getNotificationStyle = () => {
    const baseStyle = {
      display: 'flex',
      alignItems: 'flex-start',
      padding: '12px 16px',
      marginBottom: '8px',
      borderRadius: '6px',
      border: '1px solid',
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative',
      minWidth: '300px',
      maxWidth: '400px'
    };

    switch (notification.type) {
      case 'success':
        return {
          ...baseStyle,
          borderColor: '#10b981',
          backgroundColor: '#f0fdf4'
        };
      case 'error':
        return {
          ...baseStyle,
          borderColor: '#ef4444',
          backgroundColor: '#fef2f2'
        };
      case 'warning':
        return {
          ...baseStyle,
          borderColor: '#f59e0b',
          backgroundColor: '#fffbeb'
        };
      case 'info':
      default:
        return {
          ...baseStyle,
          borderColor: '#3b82f6',
          backgroundColor: '#eff6ff'
        };
    }
  };

  const getIconStyle = () => {
    const baseStyle = {
      marginRight: '12px',
      marginTop: '2px',
      fontSize: '16px',
      fontWeight: 'bold'
    };

    switch (notification.type) {
      case 'success':
        return { ...baseStyle, color: '#10b981' };
      case 'error':
        return { ...baseStyle, color: '#ef4444' };
      case 'warning':
        return { ...baseStyle, color: '#f59e0b' };
      case 'info':
      default:
        return { ...baseStyle, color: '#3b82f6' };
    }
  };

  return (
    <div style={getNotificationStyle()}>
      <div style={getIconStyle()}>
        {getIcon()}
      </div>
      
      <div style={{ flex: 1 }}>
        {notification.title && (
          <div style={{
            fontWeight: '600',
            fontSize: '14px',
            marginBottom: '4px',
            color: '#1f2937'
          }}>
            {notification.title}
          </div>
        )}
        
        <div style={{
          fontSize: '14px',
          color: '#4b5563',
          lineHeight: '1.4'
        }}>
          {notification.message}
        </div>
        
        {notification.timestamp && (
          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '4px'
          }}>
            {new Date(notification.timestamp).toLocaleTimeString()}
          </div>
        )}
      </div>
      
      <button
        onClick={() => onRemove(notification.id)}
        style={{
          border: 'none',
          background: 'transparent',
          color: '#6b7280',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: '8px',
          fontSize: '12px'
        }}
        aria-label="Cerrar notificación"
      >
        ×
      </button>
    </div>
  );
};

// Componente contenedor de notificaciones
const NotificationContainer = ({ notifications, onRemoveNotification, onClearAll }) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  const containerStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 9999,
    display: 'flex',
    flexDirection: 'column'
  };

  return (
    <div style={containerStyle}>
      {notifications.length > 1 && (
        <div style={{ marginBottom: '12px', textAlign: 'right' }}>
          <button
            onClick={onClearAll}
            style={{
              background: '#6b7280',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Limpiar todas
          </button>
        </div>
      )}
      
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={onRemoveNotification}
        />
      ))}
    </div>
  );
};

export default NotificationContainer;
