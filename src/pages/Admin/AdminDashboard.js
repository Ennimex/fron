import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FaUsers, FaBoxOpen, FaChartLine, 
  FaCalendarAlt, FaEye, FaTag, FaMapMarkerAlt, FaUserPlus, 
  FaArrowUp
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estilos mejorados - movidos arriba para resolver advertencia de "use-before-define"
  const styles = {
    dashboardContainer: {
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
    },
    dashboardHeader: {
      marginBottom: '2rem',
    },
    dashboardTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#2d3748',
      margin: '0 0 0.5rem 0',
    },
    dashboardSubtitle: {
      fontSize: '1rem',
      color: '#718096',
      margin: 0,
    },
    statsCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer',
      border: '1px solid #edf2f7',
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
    },
    statIcon: {
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: 'white',
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      margin: '0.5rem 0',
      color: '#2d3748',
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#718096',
      margin: 0,
    },
    statChange: {
      display: 'flex',
      alignItems: 'center',
      fontSize: '0.8rem',
      marginTop: '0.5rem',
    },
    iconUsers: {
      backgroundColor: '#4299e1',
    },
    iconOrders: {
      backgroundColor: '#9f7aea',
    },
    iconProducts: {
      backgroundColor: '#48bb78',
    },
    iconSales: {
      backgroundColor: '#ed8936',
    },
    iconCategories: {
      backgroundColor: '#667eea',
    },
    iconLocations: {
      backgroundColor: '#f687b3',
    },
    positive: {
      color: '#48bb78',
    },
    negative: {
      color: '#f56565',
    },
    gridLayoutFull: {
      gridColumn: '1 / -1',
    },
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      border: '1px solid #edf2f7',
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.5rem',
    },
    chartTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#2d3748',
      margin: 0,
    },
    chartControls: {
      display: 'flex',
      gap: '0.5rem',
    },
    chartControlButton: {
      padding: '0.4rem 0.8rem',
      backgroundColor: '#f7fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '6px',
      fontSize: '0.8rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
    },
    chartControlButtonActive: {
      backgroundColor: '#ebf4ff',
      borderColor: '#4299e1',
      color: '#3182ce',
    },
    section: {
      backgroundColor: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      marginBottom: '1.5rem',
      border: '1px solid #edf2f7',
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1.2rem',
    },
    sectionTitle: {
      fontSize: '1.2rem',
      fontWeight: '600',
      color: '#2d3748',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    viewAllButton: {
      display: 'flex',
      alignItems: 'center',
      color: '#4299e1',
      fontSize: '0.9rem',
      textDecoration: 'none',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      padding: '0.3rem 0.6rem',
      borderRadius: '4px',
      transition: 'background-color 0.2s ease',
    },
    usersGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      gap: '1rem',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#4299e1',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '1rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      margin: 0,
      fontWeight: 'bold',
      color: '#2d3748',
      fontSize: '0.95rem',
    },
    userEmail: {
      margin: '0.2rem 0 0 0',
      fontSize: '0.85rem',
      color: '#718096',
    },
    userRole: {
      fontSize: '0.75rem',
      padding: '0.2rem 0.5rem',
      borderRadius: '4px',
      backgroundColor: '#ebf8ff',
      color: '#3182ce',
      display: 'inline-block',
      marginTop: '0.3rem',
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    activityItem: {
      padding: '1rem',
      backgroundColor: '#f8fafc',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
    },
    activityContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '1rem',
    },
    activityIcon: {
      width: '36px',
      height: '36px',
      borderRadius: '50%',
      backgroundColor: '#ebf8ff',
      color: '#3182ce',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
    },
    activityDetails: {
      flex: 1,
    },
    activityText: {
      margin: 0,
      fontSize: '0.9rem',
      color: '#4a5568',
    },
    activityHighlight: {
      fontWeight: '600',
      color: '#2d3748',
    },
    activityTime: {
      margin: '0.3rem 0 0 0',
      fontSize: '0.8rem',
      color: '#a0aec0',
    },
    dashboardColumns: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '1.5rem',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: '#718096',
    },
    errorContainer: {
      backgroundColor: '#fff5f5',
      color: '#c53030',
      padding: '1.5rem',
      borderRadius: '10px',
      margin: '2rem',
      textAlign: 'center',
    },
  };

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    locations: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

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

        // Obtener actividad reciente (hipotéticamente podría ser comentarios, etc.)
        const activityResponse = await fetch('http://localhost:5000/api/admin/activity', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }).catch(() => ({ ok: true, json: () => Promise.resolve([]) })); // Fallback si el endpoint no existe

        if (!dashboardResponse.ok || !usersResponse.ok) {
          throw new Error('Error al cargar los datos');
        }

        const dashboardData = await dashboardResponse.json();
        const usersData = await usersResponse.json();
        const activityData = activityResponse.ok ? await activityResponse.json() : [];

        // Datos para el gráfico de usuarios registrados
        const usersChartData = dashboardData.usersChart || generateMockUserChartData(timeRange);

        setStats({
          users: dashboardData.stats.totalUsers || 0,
          products: dashboardData.stats.totalProducts || 0,
          categories: dashboardData.stats.totalCategories || 0,
          locations: dashboardData.stats.totalLocations || 0
        });

        // Obtener solo los 5 usuarios más recientes
        setRecentUsers(usersData.slice(0, 5));
        
        // Actividad reciente
        setRecentActivity(activityData.slice(0, 5));

        // Configurar datos del gráfico
        setChartData({
          labels: usersChartData.labels,
          datasets: [
            {
              label: 'Usuarios Registrados',
              data: usersChartData.data,
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.2)',
              tension: 0.4,
              fill: true,
            },
          ],
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.token, timeRange]);

  // Función para generar datos de prueba para el gráfico de usuarios
  const generateMockUserChartData = (range) => {
    let labels = [];
    let data = [];
    
    if (range === 'week') {
      labels = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
      data = [5, 3, 7, 2, 4, 8, 6];
    } else if (range === 'month') {
      labels = ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'];
      data = [12, 19, 15, 22];
    } else {
      labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      data = [25, 30, 28, 42, 50, 55, 48, 60, 70, 75, 82, 90];
    }
    
    return { labels, data };
  };

  const handleViewAllUsers = () => {
    navigate('/admin/usuarios');
  };

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Cargando datos del panel...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>Error: {error}</div>;
  }

  // Opciones para el gráfico
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Tendencia de Usuarios Registrados',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Generar contenido de actividad reciente
  const getActivityContent = (activity) => {
    if (!activity || !activity.type) return null;
    
    switch (activity.type) {
      case 'product':
        return (
          <div style={styles.activityContent}>
            <div style={styles.activityIcon}><FaBoxOpen /></div>
            <div style={styles.activityDetails}>
              <p style={styles.activityText}>
                Nuevo producto añadido: <span style={styles.activityHighlight}>{activity.productName}</span>
              </p>
              <p style={styles.activityTime}>{formatActivityTime(activity.timestamp)}</p>
            </div>
          </div>
        );
      case 'user':
        return (
          <div style={styles.activityContent}>
            <div style={styles.activityIcon}><FaUserPlus /></div>
            <div style={styles.activityDetails}>
              <p style={styles.activityText}>
                Nuevo usuario registrado: <span style={styles.activityHighlight}>{activity.user}</span>
              </p>
              <p style={styles.activityTime}>{formatActivityTime(activity.timestamp)}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Formatear tiempo para actividad
  const formatActivityTime = (timestamp) => {
    if (!timestamp) return 'Fecha desconocida';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 60) {
      return `Hace ${diffMins} minutos`;
    } else if (diffHours < 24) {
      return `Hace ${diffHours} horas`;
    } else if (diffDays < 7) {
      return `Hace ${diffDays} días`;
    } else {
      return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  };

  return (
    <div style={styles.dashboardContainer}>
      <div style={styles.dashboardHeader}>
        <h1 style={styles.dashboardTitle}>Panel de Administración</h1>
        <p style={styles.dashboardSubtitle}>Resumen general de la plataforma</p>
      </div>

      {/* Estadísticas principales */}
      <div style={styles.dashboardGrid}>
        <div style={styles.statsCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconUsers}}>
              <FaUsers />
            </div>
          </div>
          <p style={styles.statLabel}>Usuarios Registrados</p>
          <h3 style={styles.statValue}>{stats.users.toLocaleString()}</h3>
          <div style={styles.statChange}>
            <FaArrowUp style={styles.positive} />
            <span style={styles.positive}> 12% este mes</span>
          </div>
        </div>

        <div style={styles.statsCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconProducts}}>
              <FaBoxOpen />
            </div>
          </div>
          <p style={styles.statLabel}>Productos</p>
          <h3 style={styles.statValue}>{stats.products.toLocaleString()}</h3>
          <div style={styles.statChange}>
            <FaArrowUp style={styles.positive} />
            <span style={styles.positive}> 5% este mes</span>
          </div>
        </div>

        {/* Categorías y Localidades */}
        <div style={styles.statsCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconCategories}}>
              <FaTag />
            </div>
          </div>
          <p style={styles.statLabel}>Categorías</p>
          <h3 style={styles.statValue}>{stats.categories.toLocaleString()}</h3>
        </div>

        <div style={styles.statsCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconLocations}}>
              <FaMapMarkerAlt />
            </div>
          </div>
          <p style={styles.statLabel}>Localidades</p>
          <h3 style={styles.statValue}>{stats.locations.toLocaleString()}</h3>
        </div>
      </div>

      <div style={styles.dashboardColumns}>
        <div>
          {/* Gráfico de usuarios registrados */}
          <div style={{...styles.chartContainer, marginBottom: '1.5rem'}}>
            <div style={styles.chartHeader}>
              <h3 style={styles.chartTitle}>
                <FaChartLine style={{marginRight: '0.5rem'}} /> Tendencia de Usuarios Registrados
              </h3>
              <div style={styles.chartControls}>
                <button 
                  style={{
                    ...styles.chartControlButton, 
                    ...(timeRange === 'week' ? styles.chartControlButtonActive : {})
                  }}
                  onClick={() => handleTimeRangeChange('week')}
                >
                  Semana
                </button>
                <button 
                  style={{
                    ...styles.chartControlButton, 
                    ...(timeRange === 'month' ? styles.chartControlButtonActive : {})
                  }}
                  onClick={() => handleTimeRangeChange('month')}
                >
                  Mes
                </button>
                <button 
                  style={{
                    ...styles.chartControlButton, 
                    ...(timeRange === 'year' ? styles.chartControlButtonActive : {})
                  }}
                  onClick={() => handleTimeRangeChange('year')}
                >
                  Año
                </button>
              </div>
            </div>
            
            {chartData && (
              <div style={{height: '250px'}}>
                <Line options={chartOptions} data={chartData} />
              </div>
            )}
          </div>

          {/* Actividad reciente */}
          <div style={styles.section}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FaCalendarAlt /> Actividad Reciente
              </h2>
            </div>
            
            <div style={styles.activityList}>
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} style={styles.activityItem}>
                    {getActivityContent(activity)}
                  </div>
                ))
              ) : (
                <div style={styles.activityItem}>
                  <p style={{textAlign: 'center', color: '#718096'}}>No hay actividad reciente</p>
                </div>
              )}
              
              {/* Generar algunos ejemplos de actividad si no hay datos reales */}
              {(!recentActivity || recentActivity.length === 0) && (
                <>
                  <div style={styles.activityItem}>
                    <div style={styles.activityContent}>
                      <div style={styles.activityIcon}><FaUserPlus /></div>
                      <div style={styles.activityDetails}>
                        <p style={styles.activityText}>
                          Nuevo usuario registrado: <span style={styles.activityHighlight}>Carlos Mendoza</span>
                        </p>
                        <p style={styles.activityTime}>Hace 2 horas</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.activityItem}>
                    <div style={styles.activityContent}>
                      <div style={styles.activityIcon}><FaBoxOpen /></div>
                      <div style={styles.activityDetails}>
                        <p style={styles.activityText}>
                          Nuevo producto añadido: <span style={styles.activityHighlight}>Vestido de Verano</span>
                        </p>
                        <p style={styles.activityTime}>Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Usuarios recientes */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <FaUsers /> Usuarios Recientes
            </h2>
            <button 
              onClick={handleViewAllUsers}
              style={styles.viewAllButton}
            >
              Ver todos <FaEye style={{marginLeft: '5px'}} />
            </button>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}}>
            {recentUsers.map((user) => (
              <div key={user._id} style={styles.userCard}>
                <div style={styles.userAvatar}>
                  {user.email[0].toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <p style={styles.userName}>{user.name || user.email.split('@')[0]}</p>
                  <p style={styles.userEmail}>{user.email}</p>
                  <span style={styles.userRole}>{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;