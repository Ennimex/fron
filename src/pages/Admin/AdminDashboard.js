import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { localidadService } from '../../services/localidadService';
import { categoriaService } from '../../services/categoriaService';
import { productService } from '../../services/productService';
import {
  FaUsers, FaBoxOpen, FaChartLine,
  FaCalendarAlt, FaEye, FaTag, FaMapMarkerAlt, FaUserPlus, FaClipboardList
} from 'react-icons/fa';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import stylesGlobal from '../../styles/stylesGlobal';

// Registrar componentes de ChartJS
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Estilos CSS responsivos para AdminDashboard
const responsiveStyles = `
  @media (max-width: 1024px) {
    .admin-dashboard-container { padding: 1.5rem !important; }
    .admin-dashboard-grid { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)) !important; gap: 1.25rem !important; }
    .admin-dashboard-columns { grid-template-columns: 1fr !important; gap: 1.25rem !important; }
  }

  @media (max-width: 768px) {
    .admin-dashboard-container { padding: 1rem !important; }
    .admin-dashboard-grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)) !important; gap: 1rem !important; margin-bottom: 1.5rem !important; }
    .admin-dashboard-header { margin-bottom: 1.5rem !important; }
    .admin-dashboard-title { font-size: 1.5rem !important; }
    .admin-stats-card { padding: 1.25rem !important; }
    .admin-dashboard-columns { grid-template-columns: 1fr !important; gap: 1rem !important; }
    .admin-section { padding: 1.25rem !important; margin-bottom: 1rem !important; }
    .admin-chart-container { padding: 1.25rem !important; }
    .admin-chart-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
    .admin-chart-controls { display: flex !important; gap: 0.5rem !important; flex-wrap: wrap !important; }
  }

  @media (max-width: 480px) {
    .admin-dashboard-container { padding: 0.5rem !important; }
    .admin-dashboard-grid { grid-template-columns: 1fr !important; gap: 0.75rem !important; margin-bottom: 1rem !important; }
    .admin-dashboard-title { font-size: 1.25rem !important; }
    .admin-dashboard-subtitle { font-size: 0.875rem !important; }
    .admin-stats-card { padding: 1rem !important; }
    .admin-stat-value { font-size: 1.25rem !important; }
    .admin-stat-label { font-size: 0.8rem !important; }
    .admin-section { padding: 1rem !important; margin-bottom: 0.75rem !important; }
    .admin-chart-container { padding: 1rem !important; }
  }

  .admin-stats-card:hover {
    transform: translateY(-3px);
    box-shadow: ${stylesGlobal.shadows.md};
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

  // Estilos alineados con la paleta de marca (stylesGlobal)
  const styles = {
    dashboardContainer: {
      backgroundColor: stylesGlobal.colors.surface.secondary,
      minHeight: '100vh',
      padding: stylesGlobal.spacing.scale[8],
      fontFamily: stylesGlobal.typography.families.body,
    },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
      gap: stylesGlobal.spacing.scale[6],
      marginBottom: stylesGlobal.spacing.scale[8],
    },
    dashboardHeader: {
      marginBottom: stylesGlobal.spacing.scale[8],
    },
    dashboardTitle: {
      ...stylesGlobal.typography.headings.h2,
      margin: `0 0 ${stylesGlobal.spacing.scale[2]} 0`,
    },
    dashboardSubtitle: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
      margin: 0,
    },
    statsCard: {
      ...stylesGlobal.components.card.base,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[6],
      display: 'flex',
      flexDirection: 'column',
      cursor: 'pointer',
    },
    statHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    statIcon: {
      width: '44px',
      height: '44px',
      borderRadius: stylesGlobal.borders.radius.lg,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.2rem',
      color: stylesGlobal.colors.text.inverse,
    },
    statValue: {
      fontSize: '1.8rem',
      fontWeight: stylesGlobal.typography.weights.bold,
      margin: `${stylesGlobal.spacing.scale[1]} 0 0 0`,
      color: stylesGlobal.colors.text.primary,
    },
    statLabel: {
      fontSize: stylesGlobal.typography.scale.sm,
      color: stylesGlobal.colors.text.secondary,
      margin: 0,
    },
    statBadge: {
      fontSize: stylesGlobal.typography.scale.xs,
      fontWeight: stylesGlobal.typography.weights.semibold,
      padding: `${stylesGlobal.spacing.scale[1]} ${stylesGlobal.spacing.scale[2]}`,
      borderRadius: stylesGlobal.borders.radius.full,
      backgroundColor: stylesGlobal.colors.semantic.warning.light,
      color: stylesGlobal.colors.semantic.warning.dark,
    },
    chartContainer: {
      ...stylesGlobal.components.card.base,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[6],
    },
    chartHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    chartTitle: {
      ...stylesGlobal.typography.headings.h5,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.scale[2],
    },
    chartControls: {
      display: 'flex',
      gap: stylesGlobal.spacing.scale[2],
    },
    chartControlButton: {
      padding: `${stylesGlobal.spacing.scale[2]} ${stylesGlobal.spacing.scale[3]}`,
      backgroundColor: stylesGlobal.colors.surface.primary,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRadius: stylesGlobal.borders.radius.base,
      fontSize: stylesGlobal.typography.scale.sm,
      color: stylesGlobal.colors.text.secondary,
      cursor: 'pointer',
      transition: stylesGlobal.animations.transitions.base,
    },
    chartControlButtonActive: {
      backgroundColor: stylesGlobal.colors.primary[50],
      borderColor: stylesGlobal.colors.primary[500],
      color: stylesGlobal.colors.primary[600],
      fontWeight: stylesGlobal.typography.weights.semibold,
    },
    section: {
      ...stylesGlobal.components.card.base,
      borderRadius: stylesGlobal.borders.radius.lg,
      padding: stylesGlobal.spacing.scale[6],
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    sectionHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[5],
    },
    sectionTitle: {
      ...stylesGlobal.typography.headings.h5,
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.scale[2],
    },
    viewAllButton: {
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.scale[1],
      color: stylesGlobal.colors.primary[500],
      fontSize: stylesGlobal.typography.scale.sm,
      fontWeight: stylesGlobal.typography.weights.medium,
      border: 'none',
      background: 'none',
      cursor: 'pointer',
    },
    userCard: {
      display: 'flex',
      alignItems: 'center',
      padding: stylesGlobal.spacing.scale[3],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    userAvatar: {
      width: '40px',
      height: '40px',
      borderRadius: stylesGlobal.borders.radius.full,
      backgroundColor: stylesGlobal.colors.primary[50],
      color: stylesGlobal.colors.primary[500],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: stylesGlobal.spacing.scale[3],
      fontSize: '1.1rem',
      fontWeight: stylesGlobal.typography.weights.bold,
      flexShrink: 0,
    },
    userName: {
      margin: 0,
      fontWeight: stylesGlobal.typography.weights.semibold,
      color: stylesGlobal.colors.text.primary,
      fontSize: stylesGlobal.typography.scale.sm,
    },
    userEmail: {
      margin: `${stylesGlobal.spacing.scale[1]} 0 0 0`,
      fontSize: stylesGlobal.typography.scale.xs,
      color: stylesGlobal.colors.text.secondary,
    },
    userRole: {
      fontSize: stylesGlobal.typography.scale.xs,
      padding: `${stylesGlobal.spacing.scale[1]} ${stylesGlobal.spacing.scale[2]}`,
      borderRadius: stylesGlobal.borders.radius.sm,
      backgroundColor: stylesGlobal.colors.secondary[50],
      color: stylesGlobal.colors.secondary[600],
      display: 'inline-block',
      marginTop: stylesGlobal.spacing.scale[1],
    },
    activityList: {
      display: 'flex',
      flexDirection: 'column',
      gap: stylesGlobal.spacing.scale[3],
    },
    activityItem: {
      padding: stylesGlobal.spacing.scale[3],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
    },
    activityContent: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: stylesGlobal.spacing.scale[3],
    },
    activityIcon: {
      width: '36px',
      height: '36px',
      borderRadius: stylesGlobal.borders.radius.full,
      backgroundColor: stylesGlobal.colors.primary[50],
      color: stylesGlobal.colors.primary[500],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1rem',
      flexShrink: 0,
    },
    activityDetails: { flex: 1 },
    activityText: {
      margin: 0,
      fontSize: stylesGlobal.typography.scale.sm,
      color: stylesGlobal.colors.text.primary,
    },
    activityTime: {
      margin: `${stylesGlobal.spacing.scale[1]} 0 0 0`,
      fontSize: stylesGlobal.typography.scale.xs,
      color: stylesGlobal.colors.text.tertiary,
    },
    dashboardColumns: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: stylesGlobal.spacing.scale[6],
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.2rem',
      color: stylesGlobal.colors.text.secondary,
    },
    errorContainer: {
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      color: stylesGlobal.colors.semantic.error.dark,
      padding: stylesGlobal.spacing.scale[6],
      borderRadius: stylesGlobal.borders.radius.lg,
      margin: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
    },
  };

  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0,
    locations: 0,
    eventos: 0,
    fotos: 0,
    solicitudesPendientes: 0,
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
        // Datos reales del dashboard (conteos + tendencia de registros)
        const dashboard = await adminAPI.getDashboard();

        // Obtener lista de usuarios recientes usando adminAPI
        const usersData = await adminAPI.getUsers();

        // Obtener productos
        const productsData = await productService.getAll();

        // Obtener categorías
        const categoriasData = await categoriaService.getAll();

        // Obtener localidades
        const localidadesData = await localidadService.getAll();

        // Crear array de actividades recientes combinando datos de diferentes servicios
        const productosRecientes = Array.isArray(productsData) ?
          productsData
            .slice(0, 3)
            .map(p => ({
              tipo: 'producto',
              accion: 'Nuevo',
              fecha: p.createdAt || new Date(),
              detalles: { nombre: p.nombre }
            })) : [];

        const usuariosRecientes = usersData
          .slice(0, 3)
          .map(u => ({
            tipo: 'usuario',
            accion: 'Nuevo',
            fecha: u.createdAt || new Date(),
            detalles: { email: u.email }
          }));

        const categoriasRecientes = Array.isArray(categoriasData) ?
          categoriasData
            .slice(0, 2)
            .map(c => ({
              tipo: 'categoria',
              accion: 'Nueva',
              fecha: c.createdAt || new Date(),
              detalles: { nombre: c.nombre }
            })) : [];

        const activityData = [...productosRecientes, ...usuariosRecientes, ...categoriasRecientes]
          .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        // Conteos reales (del endpoint del dashboard, con respaldo a los servicios)
        const counts = dashboard?.counts || {};
        setStats({
          users: counts.usuarios ?? (usersData.length || 0),
          products: counts.productos ?? (Array.isArray(productsData) ? productsData.length : 0),
          categories: counts.categorias ?? (Array.isArray(categoriasData) ? categoriasData.length : 0),
          locations: counts.localidades ?? (Array.isArray(localidadesData) ? localidadesData.length : 0),
          eventos: counts.eventos ?? 0,
          fotos: counts.fotos ?? 0,
          solicitudesPendientes: counts.solicitudesPendientes ?? 0,
        });

        // Procesar usuarios recientes (tomar los últimos 5)
        const sortedUsers = usersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setRecentUsers(sortedUsers.slice(0, 5));

        // Procesar actividad reciente
        setRecentActivity(activityData.slice(0, 5));

        // Datos reales para el gráfico de usuarios registrados
        const usersChartData = dashboard?.usersTrend?.[timeRange] || { labels: [], data: [] };

        setChartData({
          labels: usersChartData.labels,
          datasets: [
            {
              label: 'Usuarios Registrados',
              data: usersChartData.data,
              borderColor: stylesGlobal.colors.primary[500],
              backgroundColor: 'rgba(214, 51, 132, 0.15)',
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

  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
  };

  if (loading) {
    return <div style={styles.loadingContainer}>Cargando datos del panel...</div>;
  }

  if (error) {
    return <div style={styles.errorContainer}>Error: {error}</div>;
  }

  // Tarjetas de estadística (clicables → navegan a la sección correspondiente)
  const statCards = [
    { label: 'Usuarios Registrados', value: stats.users, icon: <FaUsers />, color: stylesGlobal.colors.primary[500], to: '/admin/usuarios' },
    { label: 'Productos', value: stats.products, icon: <FaBoxOpen />, color: stylesGlobal.colors.secondary[500], to: '/admin/productos/nuevo' },
    { label: 'Categorías', value: stats.categories, icon: <FaTag />, color: stylesGlobal.colors.accent[500], to: '/admin/productos/categorias' },
    { label: 'Localidades', value: stats.locations, icon: <FaMapMarkerAlt />, color: stylesGlobal.colors.semantic.info.main, to: '/admin/localidades' },
    { label: 'Eventos', value: stats.eventos, icon: <FaCalendarAlt />, color: stylesGlobal.colors.secondary[600], to: '/admin/eventos' },
    { label: 'Fotos en galería', value: stats.fotos, icon: <FaEye />, color: stylesGlobal.colors.primary[400], to: '/admin/galeria/fotos' },
    {
      label: 'Solicitudes pendientes',
      value: stats.solicitudesPendientes,
      icon: <FaClipboardList />,
      color: stylesGlobal.colors.semantic.warning.main,
      to: '/admin/solicitudes',
      badge: stats.solicitudesPendientes > 0 ? 'Por atender' : null,
    },
  ];

  // Opciones para el gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tendencia de Usuarios Registrados' },
    },
    scales: { y: { beginAtZero: true } },
  };

  // Generar contenido de actividad reciente
  const getActivityContent = (activity) => {
    if (!activity) return null;

    const getIconForActivity = (a) => {
      switch (a.tipo) {
        case 'producto': return <FaBoxOpen />;
        case 'usuario': return <FaUserPlus />;
        case 'categoria': return <FaTag />;
        case 'localidad': return <FaMapMarkerAlt />;
        default: return <FaCalendarAlt />;
      }
    };

    const getMessageForActivity = (a) => {
      switch (a.tipo) {
        case 'producto': return `${a.accion} producto: ${a.detalles?.nombre || 'Sin nombre'}`;
        case 'usuario': return `${a.accion} usuario: ${a.detalles?.email || 'Usuario'}`;
        case 'categoria': return `${a.accion} categoría: ${a.detalles?.nombre || 'Sin nombre'}`;
        case 'localidad': return `${a.accion} localidad: ${a.detalles?.nombre || 'Sin nombre'}`;
        default: return a.descripcion || 'Actividad realizada';
      }
    };

    return (
      <div style={styles.activityContent}>
        <div style={styles.activityIcon}>
          {getIconForActivity(activity)}
        </div>
        <div style={styles.activityDetails}>
          <p style={styles.activityText}>{getMessageForActivity(activity)}</p>
          <p style={styles.activityTime}>{formatActivityTime(activity.fecha)}</p>
        </div>
      </div>
    );
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

    if (diffMins < 60) return `Hace ${diffMins} minutos`;
    if (diffHours < 24) return `Hace ${diffHours} horas`;
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div style={styles.dashboardContainer} className="admin-dashboard-container">
      <div style={styles.dashboardHeader} className="admin-dashboard-header">
        <h1 style={styles.dashboardTitle} className="admin-dashboard-title">Panel de Administración</h1>
        <p style={styles.dashboardSubtitle} className="admin-dashboard-subtitle">Resumen general de la plataforma</p>
      </div>

      {/* Estadísticas principales */}
      <div style={styles.dashboardGrid} className="admin-dashboard-grid">
        {statCards.map((card) => (
          <div
            key={card.label}
            style={styles.statsCard}
            className="admin-stats-card"
            onClick={() => navigate(card.to)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(card.to)}
          >
            <div style={styles.statHeader}>
              <div style={{ ...styles.statIcon, backgroundColor: card.color }}>
                {card.icon}
              </div>
              {card.badge && <span style={styles.statBadge}>{card.badge}</span>}
            </div>
            <p style={styles.statLabel} className="admin-stat-label">{card.label}</p>
            <h3 style={styles.statValue} className="admin-stat-value">{Number(card.value).toLocaleString()}</h3>
          </div>
        ))}
      </div>

      <div style={styles.dashboardColumns} className="admin-dashboard-columns">
        <div>
          {/* Gráfico de usuarios registrados */}
          <div style={{ ...styles.chartContainer, marginBottom: stylesGlobal.spacing.scale[6] }} className="admin-chart-container">
            <div style={styles.chartHeader} className="admin-chart-header">
              <h3 style={styles.chartTitle} className="admin-chart-title">
                <FaChartLine style={{ color: stylesGlobal.colors.primary[500] }} /> Tendencia de Usuarios Registrados
              </h3>
              <div style={styles.chartControls} className="admin-chart-controls">
                {[
                  { key: 'week', label: 'Semana' },
                  { key: 'month', label: 'Mes' },
                  { key: 'year', label: 'Año' },
                ].map((rango) => (
                  <button
                    key={rango.key}
                    style={{
                      ...styles.chartControlButton,
                      ...(timeRange === rango.key ? styles.chartControlButtonActive : {}),
                    }}
                    onClick={() => handleTimeRangeChange(rango.key)}
                  >
                    {rango.label}
                  </button>
                ))}
              </div>
            </div>

            {chartData && (
              <div style={{ height: '250px' }}>
                <Line options={chartOptions} data={chartData} />
              </div>
            )}
          </div>

          {/* Actividad reciente */}
          <div style={styles.section} className="admin-section">
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>
                <FaCalendarAlt style={{ color: stylesGlobal.colors.secondary[500] }} /> Actividad Reciente
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
                  <p style={{ textAlign: 'center', color: stylesGlobal.colors.text.secondary, margin: 0 }}>No hay actividad reciente</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Usuarios recientes */}
        <div style={styles.section} className="admin-section">
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>
              <FaUsers style={{ color: stylesGlobal.colors.primary[500] }} /> Usuarios Recientes
            </h2>
            <button onClick={() => navigate('/admin/usuarios')} style={styles.viewAllButton}>
              Ver todos <FaEye />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: stylesGlobal.spacing.scale[3] }}>
            {recentUsers.map((u) => (
              <div key={u._id} style={styles.userCard}>
                <div style={styles.userAvatar}>
                  {u.email[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={styles.userName}>{u.name || u.email.split('@')[0]}</p>
                  <p style={styles.userEmail}>{u.email}</p>
                  <span style={styles.userRole}>{u.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
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
