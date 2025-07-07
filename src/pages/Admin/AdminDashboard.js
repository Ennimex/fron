import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import adminService from '../../services/adminServices';
import { 
  FaUsers, FaBoxOpen, FaChartLine, 
  FaCalendarAlt, FaEye, FaTag, FaMapMarkerAlt, FaUserPlus, 
  FaArrowUp
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Registrar componentes de ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Estilos CSS responsivos para AdminDashboard
const responsiveStyles = `
  @media (max-width: 1024px) {
    .admin-dashboard-container {
      padding: 1.5rem !important;
    }
    
    .admin-dashboard-grid {
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important;
      gap: 1.25rem !important;
    }
    
    .admin-dashboard-columns {
      grid-template-columns: 1fr !important;
      gap: 1.25rem !important;
    }
  }

  @media (max-width: 768px) {
    .admin-dashboard-container {
      padding: 1rem !important;
    }
    
    .admin-dashboard-grid {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important;
      gap: 1rem !important;
      margin-bottom: 1.5rem !important;
    }
    
    .admin-dashboard-header {
      margin-bottom: 1.5rem !important;
      text-align: center !important;
    }
    
    .admin-dashboard-title {
      font-size: 1.5rem !important;
    }
    
    .admin-stats-card {
      padding: 1.25rem !important;
    }
    
    .admin-dashboard-columns {
      grid-template-columns: 1fr !important;
      gap: 1rem !important;
    }
    
    .admin-section {
      padding: 1.25rem !important;
      margin-bottom: 1rem !important;
    }
    
    .admin-users-grid {
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)) !important;
      gap: 0.75rem !important;
    }
    
    .admin-chart-container {
      padding: 1.25rem !important;
    }
    
    .admin-chart-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 1rem !important;
    }
    
    .admin-chart-controls {
      display: flex !important;
      gap: 0.5rem !important;
      flex-wrap: wrap !important;
    }
    
    .admin-activity-content {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    
    .admin-activity-icon {
      margin-bottom: 0.5rem !important;
    }
  }

  @media (max-width: 480px) {
    .admin-dashboard-container {
      padding: 0.5rem !important;
    }
    
    .admin-dashboard-grid {
      grid-template-columns: 1fr !important;
      gap: 0.75rem !important;
      margin-bottom: 1rem !important;
    }
    
    .admin-dashboard-header {
      margin-bottom: 1rem !important;
    }
    
    .admin-dashboard-title {
      font-size: 1.25rem !important;
    }
    
    .admin-dashboard-subtitle {
      font-size: 0.875rem !important;
    }
    
    .admin-stats-card {
      padding: 1rem !important;
    }
    
    .admin-stat-value {
      font-size: 1.25rem !important;
    }
    
    .admin-stat-label {
      font-size: 0.8rem !important;
    }
    
    .admin-section {
      padding: 1rem !important;
      margin-bottom: 0.75rem !important;
    }
    
    .admin-users-grid {
      grid-template-columns: 1fr !important;
      gap: 0.5rem !important;
    }
    
    .admin-chart-container {
      padding: 1rem !important;
    }
    
    .admin-chart-header {
      flex-direction: column !important;
      align-items: flex-start !important;
      gap: 0.75rem !important;
    }
    
    .admin-chart-title {
      font-size: 1rem !important;
    }
    
    .admin-chart-controls {
      width: 100% !important;
      justify-content: space-between !important;
    }
    
    .admin-chart-control-button {
      font-size: 0.75rem !important;
      padding: 0.3rem 0.6rem !important;
    }
    
    .admin-user-card {
      padding: 0.75rem !important;
    }
    
    .admin-user-avatar {
      width: 32px !important;
      height: 32px !important;
      font-size: 1rem !important;
      margin-right: 0.75rem !important;
    }
    
    .admin-user-name {
      font-size: 0.875rem !important;
    }
    
    .admin-user-email {
      font-size: 0.8rem !important;
    }
    
    .admin-user-role {
      font-size: 0.7rem !important;
      padding: 0.15rem 0.4rem !important;
    }
    
    .admin-activity-item {
      padding: 0.75rem !important;
    }
    
    .admin-activity-content {
      gap: 0.5rem !important;
    }
    
    .admin-activity-icon {
      width: 28px !important;
      height: 28px !important;
      font-size: 0.875rem !important;
    }
    
    .admin-activity-text {
      font-size: 0.825rem !important;
    }
    
    .admin-activity-time {
      font-size: 0.75rem !important;
    }
  }
  
  @media (max-width: 320px) {
    .admin-dashboard-container {
      padding: 0.25rem !important;
    }
    
    .admin-dashboard-grid {
      gap: 0.5rem !important;
    }
    
    .admin-stats-card {
      padding: 0.75rem !important;
    }
    
    .admin-section {
      padding: 0.75rem !important;
      margin-bottom: 0.5rem !important;
    }
    
    .admin-dashboard-title {
      font-size: 1.125rem !important;
    }
    
    .admin-stat-value {
      font-size: 1.125rem !important;
    }
  }
`;

// Inyectar estilos CSS
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = responsiveStyles;
  if (!document.head.querySelector('style[data-admin-dashboard-styles]')) {
    styleElement.setAttribute('data-admin-dashboard-styles', 'true');
    document.head.appendChild(styleElement);
  }
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Estilos mejorados con responsividad
  const styles = {
    dashboardContainer: {
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      padding: '2rem',
      fontFamily: "'Inter', sans-serif",
      // Responsive padding
      '@media (max-width: 768px)': {
        padding: '1rem',
      },
      '@media (max-width: 480px)': {
        padding: '0.5rem',
      },
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem',
      // Responsive grid
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.5rem',
      },
      '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '0.75rem',
        marginBottom: '1rem',
      },
    },
    dashboardHeader: {
      marginBottom: '2rem',
      // Responsive header
      '@media (max-width: 768px)': {
        marginBottom: '1.5rem',
        textAlign: 'center',
      },
      '@media (max-width: 480px)': {
        marginBottom: '1rem',
      },
    },
    dashboardTitle: {
      fontSize: '1.8rem',
      fontWeight: '700',
      color: '#2d3748',
      margin: '0 0 0.5rem 0',
      // Responsive title
      '@media (max-width: 768px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.25rem',
      },
    },
    dashboardSubtitle: {
      fontSize: '1rem',
      color: '#718096',
      margin: 0,
      // Responsive subtitle
      '@media (max-width: 480px)': {
        fontSize: '0.875rem',
      },
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
      // Responsive card
      '@media (max-width: 768px)': {
        padding: '1.25rem',
      },
      '@media (max-width: 480px)': {
        padding: '1rem',
      },
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
      // Responsive value
      '@media (max-width: 768px)': {
        fontSize: '1.5rem',
      },
      '@media (max-width: 480px)': {
        fontSize: '1.25rem',
      },
    },
    statLabel: {
      fontSize: '0.9rem',
      color: '#718096',
      margin: 0,
      // Responsive label
      '@media (max-width: 480px)': {
        fontSize: '0.8rem',
      },
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
      // Responsive section
      '@media (max-width: 768px)': {
        padding: '1.25rem',
        marginBottom: '1rem',
      },
      '@media (max-width: 480px)': {
        padding: '1rem',
        marginBottom: '0.75rem',
      },
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
      // Responsive users grid
      '@media (max-width: 768px)': {
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '0.75rem',
      },
      '@media (max-width: 480px)': {
        gridTemplateColumns: '1fr',
        gap: '0.5rem',
      },
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
      // Responsive columns
      '@media (max-width: 768px)': {
        gridTemplateColumns: '1fr',
        gap: '1rem',
      },
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
        // Obtener datos del dashboard usando adminAPI
        const dashboardData = await adminAPI.getDashboard();
        
        // Obtener lista de usuarios recientes usando adminAPI
        const usersData = await adminAPI.getUsers();

        // Obtener actividad reciente usando adminService
        let activityData = [];
        try {
          activityData = await adminService.getActivity();
        } catch (err) {
          console.log('Activity endpoint not available, using fallback');
          activityData = [];
        }

        // Procesar datos del dashboard
        setStats({
          users: dashboardData.stats?.users || usersData.length || 0,
          products: dashboardData.stats?.products || 0,
          categories: dashboardData.stats?.categories || 0,
          locations: dashboardData.stats?.locations || 0
        });

        // Procesar usuarios recientes (tomar los últimos 5)
        const sortedUsers = usersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentUsers(sortedUsers.slice(0, 5));
        
        // Procesar actividad reciente
        setRecentActivity(activityData.slice(0, 5));

        // Datos para el gráfico de usuarios registrados
        const usersChartData = dashboardData.usersChart || generateMockUserChartData(timeRange);

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
          <div style={styles.activityContent} className="admin-activity-content">
            <div style={styles.activityIcon} className="admin-activity-icon"><FaBoxOpen /></div>
            <div style={styles.activityDetails}>
              <p style={styles.activityText} className="admin-activity-text">
                Nuevo producto añadido: <span style={styles.activityHighlight}>{activity.productName}</span>
              </p>
              <p style={styles.activityTime} className="admin-activity-time">{formatActivityTime(activity.timestamp)}</p>
            </div>
          </div>
        );
      case 'user':
        return (
          <div style={styles.activityContent} className="admin-activity-content">
            <div style={styles.activityIcon} className="admin-activity-icon"><FaUserPlus /></div>
            <div style={styles.activityDetails}>
              <p style={styles.activityText} className="admin-activity-text">
                Nuevo usuario registrado: <span style={styles.activityHighlight}>{activity.user}</span>
              </p>
              <p style={styles.activityTime} className="admin-activity-time">{formatActivityTime(activity.timestamp)}</p>
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
    <div style={styles.dashboardContainer} className="admin-dashboard-container">
      <div style={styles.dashboardHeader} className="admin-dashboard-header">
        <h1 style={styles.dashboardTitle} className="admin-dashboard-title">Panel de Administración</h1>
        <p style={styles.dashboardSubtitle} className="admin-dashboard-subtitle">Resumen general de la plataforma</p>
      </div>

      {/* Estadísticas principales */}
      <div style={styles.dashboardGrid} className="admin-dashboard-grid">
        <div style={styles.statsCard} className="admin-stats-card">
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconUsers}}>
              <FaUsers />
            </div>
          </div>
          <p style={styles.statLabel} className="admin-stat-label">Usuarios Registrados</p>
          <h3 style={styles.statValue} className="admin-stat-value">{stats.users.toLocaleString()}</h3>
          <div style={styles.statChange}>
            <FaArrowUp style={styles.positive} />
            <span style={styles.positive}> 12% este mes</span>
          </div>
        </div>

        <div style={styles.statsCard} className="admin-stats-card">
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconProducts}}>
              <FaBoxOpen />
            </div>
          </div>
          <p style={styles.statLabel} className="admin-stat-label">Productos</p>
          <h3 style={styles.statValue} className="admin-stat-value">{stats.products.toLocaleString()}</h3>
          <div style={styles.statChange}>
            <FaArrowUp style={styles.positive} />
            <span style={styles.positive}> 5% este mes</span>
          </div>
        </div>

        {/* Categorías y Localidades */}
        <div style={styles.statsCard} className="admin-stats-card">
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconCategories}}>
              <FaTag />
            </div>
          </div>
          <p style={styles.statLabel} className="admin-stat-label">Categorías</p>
          <h3 style={styles.statValue} className="admin-stat-value">{stats.categories.toLocaleString()}</h3>
        </div>

        <div style={styles.statsCard} className="admin-stats-card">
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, ...styles.iconLocations}}>
              <FaMapMarkerAlt />
            </div>
          </div>
          <p style={styles.statLabel}>Localidades</p>
          <h3 style={styles.statValue}>{stats.locations.toLocaleString()}</h3>
        </div>
      </div>

      <div style={styles.dashboardColumns} className="admin-dashboard-columns">
        <div>
          {/* Gráfico de usuarios registrados */}
          <div style={{...styles.chartContainer, marginBottom: '1.5rem'}} className="admin-chart-container">
            <div style={styles.chartHeader} className="admin-chart-header">
              <h3 style={styles.chartTitle} className="admin-chart-title">
                <FaChartLine style={{marginRight: '0.5rem'}} /> Tendencia de Usuarios Registrados
              </h3>
              <div style={styles.chartControls} className="admin-chart-controls">
                <button 
                  style={{
                    ...styles.chartControlButton, 
                    ...(timeRange === 'week' ? styles.chartControlButtonActive : {})
                  }}
                  className="admin-chart-control-button"
                  onClick={() => handleTimeRangeChange('week')}
                >
                  Semana
                </button>
                <button 
                  style={{
                    ...styles.chartControlButton, 
                    ...(timeRange === 'month' ? styles.chartControlButtonActive : {})
                  }}
                  className="admin-chart-control-button"
                  onClick={() => handleTimeRangeChange('month')}
                >
                  Mes
                </button>
                <button 
                  style={{
                    ...styles.chartControlButton, 
                    ...(timeRange === 'year' ? styles.chartControlButtonActive : {})
                  }}
                  className="admin-chart-control-button"
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
          <div style={styles.section} className="admin-section">
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FaCalendarAlt /> Actividad Reciente
              </h2>
            </div>
            
            <div style={styles.activityList}>
              {recentActivity && recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} style={styles.activityItem} className="admin-activity-item">
                    {getActivityContent(activity)}
                  </div>
                ))
              ) : (
                <div style={styles.activityItem} className="admin-activity-item">
                  <p style={{textAlign: 'center', color: '#718096'}}>No hay actividad reciente</p>
                </div>
              )}
              
              {/* Generar algunos ejemplos de actividad si no hay datos reales */}
              {(!recentActivity || recentActivity.length === 0) && (
                <>
                  <div style={styles.activityItem} className="admin-activity-item">
                    <div style={styles.activityContent} className="admin-activity-content">
                      <div style={styles.activityIcon} className="admin-activity-icon"><FaUserPlus /></div>
                      <div style={styles.activityDetails}>
                        <p style={styles.activityText} className="admin-activity-text">
                          Nuevo usuario registrado: <span style={styles.activityHighlight}>Carlos Mendoza</span>
                        </p>
                        <p style={styles.activityTime} className="admin-activity-time">Hace 2 horas</p>
                      </div>
                    </div>
                  </div>
                  <div style={styles.activityItem} className="admin-activity-item">
                    <div style={styles.activityContent} className="admin-activity-content">
                      <div style={styles.activityIcon} className="admin-activity-icon"><FaBoxOpen /></div>
                      <div style={styles.activityDetails}>
                        <p style={styles.activityText} className="admin-activity-text">
                          Nuevo producto añadido: <span style={styles.activityHighlight}>Vestido de Verano</span>
                        </p>
                        <p style={styles.activityTime} className="admin-activity-time">Hace 1 día</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Usuarios recientes */}
        <div style={styles.section} className="admin-section">
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
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '0.8rem'}} className="admin-users-grid">
            {recentUsers.map((user) => (
              <div key={user._id} style={styles.userCard} className="admin-user-card">
                <div style={styles.userAvatar} className="admin-user-avatar">
                  {user.email[0].toUpperCase()}
                </div>
                <div style={styles.userInfo}>
                  <p style={styles.userName} className="admin-user-name">{user.name || user.email.split('@')[0]}</p>
                  <p style={styles.userEmail} className="admin-user-email">{user.email}</p>
                  <span style={styles.userRole} className="admin-user-role">{user.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
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