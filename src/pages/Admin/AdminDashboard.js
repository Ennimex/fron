import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    sales: 0,
    orders: 0
  });
  const [recentUsers, setRecentUsers] = useState([]); // Cambio de recentActivity a recentUsers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Obtener datos del dashboard
        const dashboardResponse = await fetch('http://localhost:5000/api/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        // Obtener lista de usuarios recientes
        const usersResponse = await fetch('http://localhost:5000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!dashboardResponse.ok || !usersResponse.ok) {
          throw new Error('Error al cargar los datos');
        }

        const dashboardData = await dashboardResponse.json();
        const usersData = await usersResponse.json();

        setStats({
          users: dashboardData.stats.totalUsers || 0,
          sales: dashboardData.stats.totalSales || 0,
          orders: dashboardData.stats.totalOrders || 0
        });

        // Obtener solo los 5 usuarios más recientes
        setRecentUsers(usersData.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token]);

  const handleViewAllUsers = () => {
    navigate('/admin/usuarios');
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const styles = {
    dashboardContainer: {
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
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
    headerSection: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '20px',
    },
    viewAllLink: {
      color: '#3498db',
      textDecoration: 'none',
      fontSize: '0.9rem',
      ':hover': {
        textDecoration: 'underline',
      },
    },
    usersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
    },
    headerUserAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3498db',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
    },
    headerUserInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
    },
    headerUserName: {
      fontSize: '1rem',
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#3498db',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '15px',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      margin: 0,
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#2c3e50',
    },
    userEmail: {
      margin: '5px 0',
      fontSize: '0.85rem',
      color: '#6c757d',
    },
    userRole: {
      fontSize: '0.8rem',
      padding: '3px 8px',
      borderRadius: '12px',
      backgroundColor: '#e9ecef',
      color: '#495057',
      display: 'inline-block',
    },
  };

  return (
    <div style={styles.dashboardContainer}>
      <main style={styles.mainContent}>
        <div style={styles.statsContainer}>
          <div style={styles.statCard}>
            <h3 style={styles.statTitle}>Usuarios Registrados</h3>
            <p style={styles.statValue}>{stats.users.toLocaleString()}</p>
          </div>
        </div>
        
        <div style={styles.recentActivity}>
          <div style={styles.headerSection}>
            <h2 style={styles.sectionTitle}>Usuarios Recientes</h2>
            <button 
              onClick={handleViewAllUsers}
              style={{
                ...styles.viewAllLink,
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Ver todos los usuarios
              <i className="bi bi-arrow-right"></i>
            </button>
          </div>
          
          <div style={styles.usersGrid}>
            {recentUsers.map((user) => (
              <div key={user._id} style={styles.userCard}>
                <div style={styles.userAvatar}>
                  {user.email[0].toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <p style={styles.userEmail}>{user.email}</p>
                  <span style={styles.userRole}>{user.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;