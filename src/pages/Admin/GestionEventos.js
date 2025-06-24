import React, { useEffect, useState, useCallback } from "react";
import { FaCalendarAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import api from "../../services/api";
import { colors, typography } from "../../styles/styles";
import { useAuth } from "../../context/AuthContext";

const styles = {
  container: {
    padding: "2rem",
    backgroundColor: colors.background,
    minHeight: "100vh",
    fontFamily: typography.fontSecondary,
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    color: colors.primary,
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  button: {
    backgroundColor: colors.primary,
    color: colors.white,
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1.2rem",
    fontSize: "1rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: 500,
  },
  table: {
    width: "100%",
    backgroundColor: colors.white,
    borderRadius: "8px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
    borderCollapse: "collapse",
    marginTop: "1rem",
  },
  th: {
    backgroundColor: colors.primary,
    color: colors.white,
    padding: "1rem",
    textAlign: "left",
    fontWeight: 600,
    fontSize: "1rem",
  },
  td: {
    padding: "1rem",
    borderBottom: `1px solid ${colors.gray}`,
    fontSize: "0.98rem",
    color: colors.textPrimary,
  },
  actions: {
    display: "flex",
    gap: "0.5rem",
  },
  iconBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: colors.primary,
    fontSize: "1.1rem",
    padding: "0.3rem",
    borderRadius: "4px",
    transition: "background 0.2s",
  },
  empty: {
    textAlign: "center",
    color: colors.textLight,
    padding: "2rem 0",
  },
};

// Modal simple reutilizable
const Modal = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ background: colors.white, borderRadius: 10, minWidth: 350, maxWidth: 500, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.18)', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 12, right: 16, background: 'none', border: 'none', fontSize: 22, color: colors.grayDark, cursor: 'pointer' }}>&times;</button>
        {children}
      </div>
    </div>
  );
};

const GestionEventos = () => {
  const { user, isAuthenticated, checkTokenExpiration } = useAuth();
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({ 
    titulo: '', 
    descripcion: '', 
    fecha: '', 
    ubicacion: '', 
    horaInicio: '', 
    horaFin: '' 
  });
  const [editId, setEditId] = useState(null);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [eventoToDelete, setEventoToDelete] = useState(null);

  // Verificar autenticación y permisos de administrador
  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'admin') {
      setError('No tienes permisos para acceder a esta página');
      setLoading(false);
      return;
    }
    
    // Verificar que el token no haya expirado
    if (!checkTokenExpiration()) {
      return; // El checkTokenExpiration ya maneja la redirección
    }  }, [isAuthenticated, user, checkTokenExpiration]);
  
  const fetchEventos = useCallback(async () => {
    // Verificar autenticación antes de hacer la petición
    if (!isAuthenticated || !checkTokenExpiration()) {
      return;
    }

    setLoading(true);
    try {
      const data = await api.get("/eventos");
      setEventos(data);    } catch (err) {
      if (err.response?.status === 401) {
        setError("Sesión expirada. Por favor, inicia sesión nuevamente.");
      } else {
        setError("Error al cargar los eventos");
      }
      console.error('Error fetching eventos:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, checkTokenExpiration]);

  useEffect(() => {
    // Solo cargar eventos si el usuario está autenticado y es admin
    if (isAuthenticated && user?.role === 'admin') {
      fetchEventos();
    }
  }, [isAuthenticated, user, fetchEventos]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleAddClick = () => {
    setFormData({ 
      titulo: '', 
      descripcion: '', 
      fecha: '', 
      ubicacion: '', 
      horaInicio: '', 
      horaFin: '' 
    });
    setEditId(null);
    setModalType('add');
    setFormError('');
  };
  const handleEditClick = (evento) => {
    setFormData({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha ? evento.fecha.substring(0, 10) : '',
      ubicacion: evento.ubicacion,
      horaInicio: evento.horaInicio || '',
      horaFin: evento.horaFin || '',
    });
    setEditId(evento._id);
    setModalType('edit');
    setFormError('');
  };

  const handleDeleteClick = (evento) => {
    setEventoToDelete(evento);
    setModalType('delete');
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar autenticación antes de enviar el formulario
    if (!isAuthenticated || !checkTokenExpiration()) {
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      if (editId) {
        // Editar evento
        const updated = await api.put(`/eventos/${editId}`, formData);
        setEventos(eventos.map((e) => (e._id === editId ? updated : e)));
      } else {
        // Crear evento
        const created = await api.post('/eventos', formData);
        setEventos([created, ...eventos]);
      }
      setModalType(null);    } catch (err) {
      if (err.response?.status === 401) {
        setFormError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setFormError(err?.error || err?.message || 'Error al guardar el evento');
      }
      console.error('Error saving evento:', err);
    } finally {
      setFormLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!eventoToDelete) return;
    
    // Verificar autenticación antes de eliminar
    if (!isAuthenticated || !checkTokenExpiration()) {
      return;
    }

    try {
      await api.delete(`/eventos/${eventoToDelete._id}`);
      setEventos(eventos.filter((e) => e._id !== eventoToDelete._id));
      setModalType(null);
      setEventoToDelete(null);    } catch (err) {
      if (err.response?.status === 401) {
        alert('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        alert('Error al eliminar el evento');
      }
      console.error('Error deleting evento:', err);
    }
  };
  return (
    <div style={styles.container}>
      {/* Verificar permisos antes de mostrar el contenido */}
      {!isAuthenticated || user?.role !== 'admin' ? (
        <div style={styles.empty}>
          {!isAuthenticated ? 'Debes iniciar sesión para acceder a esta página' : 'No tienes permisos de administrador'}
        </div>
      ) : (
        <>
          <div style={styles.header}>
            <span style={styles.title}>
              <FaCalendarAlt /> Gestión de Eventos
            </span>
            <button style={styles.button} onClick={handleAddClick}>
              <FaPlus /> Nuevo Evento
            </button>
          </div>
      {/* Modal para agregar/editar */}
      <Modal open={modalType === 'add' || modalType === 'edit'} onClose={() => setModalType(null)}>        <form onSubmit={handleFormSubmit}>
          <h2 style={{ marginBottom: 16 }}>{modalType === 'edit' ? 'Editar Evento' : 'Nuevo Evento'}</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <input 
              name="titulo" 
              value={formData.titulo} 
              onChange={handleInputChange} 
              placeholder="Título" 
              required 
              style={{ flex: 1, minWidth: '200px', padding: 8, borderRadius: 4, border: `1px solid ${colors.gray}` }} 
            />
            <input 
              name="ubicacion" 
              value={formData.ubicacion} 
              onChange={handleInputChange} 
              placeholder="Ubicación" 
              required 
              style={{ flex: 1, minWidth: '200px', padding: 8, borderRadius: 4, border: `1px solid ${colors.gray}` }} 
            />
          </div>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginTop: 12 }}>
            <input 
              name="fecha" 
              type="date" 
              value={formData.fecha} 
              onChange={handleInputChange} 
              required 
              style={{ flex: 1, minWidth: '150px', padding: 8, borderRadius: 4, border: `1px solid ${colors.gray}` }} 
            />
            <input 
              name="horaInicio" 
              type="time" 
              value={formData.horaInicio} 
              onChange={handleInputChange} 
              placeholder="Hora inicio"
              required 
              style={{ flex: 1, minWidth: '120px', padding: 8, borderRadius: 4, border: `1px solid ${colors.gray}` }} 
            />
            <input 
              name="horaFin" 
              type="time" 
              value={formData.horaFin} 
              onChange={handleInputChange} 
              placeholder="Hora fin"
              required 
              style={{ flex: 1, minWidth: '120px', padding: 8, borderRadius: 4, border: `1px solid ${colors.gray}` }} 
            />
          </div>
          <textarea 
            name="descripcion" 
            value={formData.descripcion} 
            onChange={handleInputChange} 
            placeholder="Descripción" 
            required 
            rows={3} 
            style={{ width: '100%', marginTop: 12, padding: 8, borderRadius: 4, border: `1px solid ${colors.gray}` }} 
          />
          {formError && <div style={{ color: colors.error, marginTop: 8 }}>{formError}</div>}
          <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
            <button type="submit" style={{ ...styles.button, minWidth: 120 }} disabled={formLoading}>
              {editId ? 'Actualizar' : 'Crear'}
            </button>
            <button type="button" style={{ ...styles.button, backgroundColor: colors.grayDark }} onClick={() => setModalType(null)} disabled={formLoading}>
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
      {/* Modal para eliminar */}
      <Modal open={modalType === 'delete'} onClose={() => setModalType(null)}>
        <h2 style={{ marginBottom: 16 }}>Eliminar Evento</h2>
        <p>¿Seguro que deseas eliminar el evento <b>{eventoToDelete?.titulo}</b>?</p>
        <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
          <button style={{ ...styles.button, backgroundColor: colors.error }} onClick={confirmDelete}>Eliminar</button>
          <button style={{ ...styles.button, backgroundColor: colors.grayDark }} onClick={() => setModalType(null)}>Cancelar</button>
        </div>
      </Modal>
      {loading ? (
        <div style={styles.empty}>Cargando eventos...</div>
      ) : error ? (
        <div style={styles.empty}>{error}</div>
      ) : eventos.length === 0 ? (
        <div style={styles.empty}>No hay eventos registrados.</div>
      ) : (        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Título</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Fecha</th>
              <th style={styles.th}>Horario</th>
              <th style={styles.th}>Ubicación</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.map((evento) => (
              <tr key={evento._id}>
                <td style={styles.td}>{evento.titulo}</td>
                <td style={styles.td}>{evento.descripcion}</td>
                <td style={styles.td}>
                  {evento.fecha ? new Date(evento.fecha).toLocaleDateString() : ""}
                </td>
                <td style={styles.td}>
                  {evento.horaInicio && evento.horaFin 
                    ? `${evento.horaInicio} - ${evento.horaFin}` 
                    : evento.horaInicio || evento.horaFin || "No especificado"
                  }
                </td>
                <td style={styles.td}>{evento.ubicacion}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button style={styles.iconBtn} title="Editar" onClick={() => handleEditClick(evento)}>
                      <FaEdit />
                    </button>
                    <button style={{ ...styles.iconBtn, color: colors.error }} title="Eliminar" onClick={() => handleDeleteClick(evento)}>
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </>
      )}
    </div>
  );
};

export default GestionEventos;
