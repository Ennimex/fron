import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    sales: 0,
    orders: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar los datos del dashboard');
        }

        const data = await response.json();
        setStats({
          users: data.stats.totalUsers || 0,
          sales: data.stats.totalSales || 0,
          orders: data.stats.totalOrders || 0
        });
        setRecentActivity(data.recentActivity || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={styles.dashboardContainer}>
      <header style={styles.header}>
        <h1 style={styles.title}>Panel de Administración</h1>
        <div style={styles.userInfo}>
          <span style={styles.userName}>{user.name || 'Admin'}</span>
          <div style={styles.userAvatar}>
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </div>
        </div>
      </header>
      
      <div style={styles.content}>
        <aside style={styles.sidebar}>
          <nav style={styles.nav}>
            <ul style={styles.navList}>
              <li style={styles.navItem}><Link to="/admin" style={styles.navLink}>Inicio</Link></li>
              <li style={styles.navItem}><Link to="/admin/usuarios" style={styles.navLink}>Usuarios</Link></li>
              <li style={styles.navItem}><Link to="/admin/productos" style={styles.navLink}>Productos</Link></li>
              <li style={styles.navItem}><Link to="/admin/pedidos" style={styles.navLink}>Pedidos</Link></li>
              <li style={styles.navItem}><Link to="/admin/configuracion" style={styles.navLink}>Configuración</Link></li>
            </ul>
          </nav>
        </aside>
        
        <main style={styles.mainContent}>
          <div style={styles.statsContainer}>
            <div style={styles.statCard}>
              <h3 style={styles.statTitle}>Usuarios</h3>
              <p style={styles.statValue}>{stats.users.toLocaleString()}</p>
            </div>
            <div style={styles.statCard}>
              <h3 style={styles.statTitle}>Ventas</h3>
              <p style={styles.statValue}>${stats.sales.toLocaleString()}</p>
            </div>
            <div style={styles.statCard}>
              <h3 style={styles.statTitle}>Pedidos</h3>
              <p style={styles.statValue}>{stats.orders.toLocaleString()}</p>
            </div>
          </div>
          
          <div style={styles.recentActivity}>
            <h2 style={styles.sectionTitle}>Actividad Reciente</h2>
            <ul style={styles.activityList}>
              {recentActivity.map((activity, index) => (
                <li key={index} style={styles.activityItem}>
                  {activity.description}
                </li>
              ))}
              {recentActivity.length === 0 && (
                <li style={styles.activityItem}>No hay actividad reciente</li>
              )}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

// Estilos inyectados directamente como objeto JavaScript
const styles = {
  dashboardContainer: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f5f5',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#2c3e50',
    color: 'white',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
  },
  title: {
    margin: 0,
    fontSize: '1.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  userName: {
    fontSize: '1rem',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#3498db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
  },
  content: {
    display: 'flex',
    flex: 1,
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#34495e',
    color: 'white',
    padding: '1.5rem 0',
  },
  nav: {},
  navList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  navItem: {
    padding: '0.75rem 1.5rem',
    transition: 'background-color 0.2s',
    ':hover': {
      backgroundColor: '#2c3e50',
    },
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    display: 'block',
  },
  mainContent: {
    flex: 1,
    padding: '2rem',
  },
  statsContainer: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  statTitle: {
    margin: '0 0 0.5rem 0',
    color: '#7f8c8d',
    fontSize: '1rem',
  },
  statValue: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  recentActivity: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1.5rem',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    marginTop: 0,
    color: '#2c3e50',
    fontSize: '1.3rem',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #ecf0f1',
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    padding: '0.75rem 0',
    borderBottom: '1px solid #ecf0f1',
    ':last-child': {
      borderBottom: 'none',
    },
  },
};

export default AdminDashboard;