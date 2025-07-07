import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaSave, FaLock, FaLightbulb, FaEye, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { Navigate } from 'react-router-dom';
import stylesGlobal from '../../styles/stylesGlobal';

const GestionMision = () => {
  const { user, isAuthenticated, checkTokenExpiration } = useAuth();

  // Mapeo de estilos globales
  const styles = {
    pageContainer: {
      ...stylesGlobal.utils.container,
      padding: stylesGlobal.spacing.sections.md,
      backgroundColor: stylesGlobal.colors.surface.primary,
    },
    mainContainer: {
      maxWidth: stylesGlobal.utils.container.maxWidth.lg,
      margin: stylesGlobal.spacing.margins.auto,
      padding: stylesGlobal.spacing.scale[4],
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[8],
      flexWrap: 'wrap',
      gap: stylesGlobal.spacing.gaps.md,
    },
    title: stylesGlobal.typography.headings.h1,
    subtitle: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.secondary,
    },
    content: {
      padding: stylesGlobal.spacing.scale[4],
      backgroundColor: stylesGlobal.colors.surface.secondary,
      borderRadius: stylesGlobal.borders.radius.md,
    },
    error: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.semantic.error.main,
      backgroundColor: stylesGlobal.colors.semantic.error.light,
      padding: stylesGlobal.spacing.scale[3],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    success: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.semantic.success.main,
      backgroundColor: stylesGlobal.colors.semantic.success.light,
      padding: stylesGlobal.spacing.scale[3],
      borderRadius: stylesGlobal.borders.radius.sm,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    sectionCard: {
      padding: stylesGlobal.spacing.scale[6],
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRadius: stylesGlobal.borders.radius.md,
      backgroundColor: stylesGlobal.colors.surface.secondary,
      boxShadow: stylesGlobal.shadows.sm,
      marginBottom: stylesGlobal.spacing.scale[6],
    },
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: stylesGlobal.spacing.scale[4],
      paddingBottom: stylesGlobal.spacing.scale[3],
      borderBottom: `2px solid ${stylesGlobal.colors.primary[500]}`,
    },
    sectionIcon: {
      marginRight: stylesGlobal.spacing.scale[3],
      color: stylesGlobal.colors.primary[500],
    },
    sectionTitle: {
      ...stylesGlobal.typography.headings.h2,
      color: stylesGlobal.colors.primary[500],
      margin: 0,
    },
    formContainer: {
      width: '100%',
    },
    formGroup: {
      marginBottom: stylesGlobal.spacing.scale[6],
      width: '100%',
    },
    label: {
      ...stylesGlobal.typography.body.base,
      fontWeight: stylesGlobal.typography.weights.medium,
      color: stylesGlobal.colors.text.primary,
      marginBottom: stylesGlobal.spacing.scale[2],
      display: 'block',
    },
    textarea: {
      ...stylesGlobal.components.input.base,
      minHeight: '150px',
      resize: 'vertical',
      lineHeight: stylesGlobal.typography.leading.normal,
      whiteSpace: 'pre-wrap',
    },
    helpText: {
      ...stylesGlobal.typography.body.caption,
      marginTop: stylesGlobal.spacing.scale[2],
      fontStyle: 'italic',
      color: stylesGlobal.colors.text.muted,
    },
    primaryButton: {
      ...stylesGlobal.components.button.variants.primary,
      ...stylesGlobal.components.button.sizes.base,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
    },
    editButton: {
      ...stylesGlobal.components.button.variants.secondary,
      ...stylesGlobal.components.button.sizes.base,
      display: 'flex',
      alignItems: 'center',
      gap: stylesGlobal.spacing.gaps.xs,
      marginBottom: stylesGlobal.spacing.scale[4],
    },
    buttonIcon: {
      marginRight: stylesGlobal.spacing.scale[2],
    },
    previewContainer: {
      backgroundColor: stylesGlobal.colors.surface.tertiary,
      border: `1px solid ${stylesGlobal.borders.colors.default}`,
      borderRadius: stylesGlobal.borders.radius.sm,
      padding: stylesGlobal.spacing.scale[4],
      marginTop: stylesGlobal.spacing.scale[3],
    },
    previewText: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.primary,
      margin: 0,
      whiteSpace: 'pre-wrap',
    },
    emptyText: {
      ...stylesGlobal.typography.body.base,
      color: stylesGlobal.colors.text.muted,
      fontStyle: 'italic',
    },
    loadingContainer: {
      padding: stylesGlobal.spacing.scale[8],
      textAlign: 'center',
    },
    textCenter: {
      textAlign: 'center',
    },
    flexCenter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    disabledButton: {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  };

  // Estados del componente
  const [nosotrosData, setNosotrosData] = useState({ mision: '', vision: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [editingMode, setEditingMode] = useState(false);
  const [tempData, setTempData] = useState({ mision: '', vision: '' });

  // Fetch información de nosotros
  const fetchNosotrosData = useCallback(async () => {
    if (!isAuthenticated || !checkTokenExpiration()) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }
    try {
      setLoading(true);
      const data = await adminAPI.getNosotros();
      const formattedData = {
        mision: data.mision || '',
        vision: data.vision || '',
      };
      setNosotrosData(formattedData);
      setTempData(formattedData);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message || 'Error al cargar la información');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, checkTokenExpiration]);

  // Cargar datos al montar el componente
  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchNosotrosData();
    }
  }, [isAuthenticated, user, fetchNosotrosData]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Validar formulario
  const validateForm = () => {
    if (tempData.mision.length > 1000) {
      setError('La misión no puede exceder los 1000 caracteres');
      return false;
    }
    if (tempData.vision.length > 1000) {
      setError('La visión no puede exceder los 1000 caracteres');
      return false;
    }
    setError(null);
    return true;
  };

  // Activar modo de edición
  const handleEditMode = () => {
    setEditingMode(true);
    setError(null);
    setSuccess(null);
  };

  // Cancelar edición
  const handleCancelEdit = () => {
    setEditingMode(false);
    setTempData({
      mision: nosotrosData.mision,
      vision: nosotrosData.vision,
    });
    setError(null);
    setSuccess(null);
  };

  // Guardar cambios
  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !checkTokenExpiration()) {
      setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      return;
    }
    if (!validateForm()) return;

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const nosotrosData = {
        mision: tempData.mision.trim(),
        vision: tempData.vision.trim(),
      };

      await adminAPI.updateNosotros(nosotrosData);

      setNosotrosData(nosotrosData);
      setEditingMode(false);
      setSuccess('Información actualizada correctamente');

      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Sesión expirada. Por favor, inicia sesión nuevamente.');
      } else {
        setError(err.message || 'Error al guardar la información');
      }
    } finally {
      setSaving(false);
    }
  };

  // Verificar autenticación y rol de admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return (
      <div style={{
        ...styles.pageContainer,
        ...styles.flexCenter,
        height: '80vh',
        textAlign: 'center',
      }}>
        <FaLock size={50} style={{ color: stylesGlobal.colors.semantic.error.main }} />
        <h2 style={styles.title}>Acceso Denegado</h2>
        <p style={styles.subtitle}>
          No tienes permisos para acceder a esta sección. Esta área está reservada para administradores.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.textCenter}>
          <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
          <h3 style={stylesGlobal.typography.headings.h3}>Cargando información de la empresa...</h3>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.mainContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <FaLightbulb style={{ marginRight: stylesGlobal.spacing.scale[2] }} />
              Gestión de Misión y Visión
            </h1>
            <p style={styles.subtitle}>
              Administra la filosofía empresarial, misión y visión de la organización
            </p>
          </div>
          {!editingMode && (
            <button
              style={styles.editButton}
              onClick={handleEditMode}
              aria-label="Editar información"
              disabled={saving}
            >
              <FaEdit size={14} style={styles.buttonIcon} />
              Editar Información
            </button>
          )}
        </div>

        {/* Mensajes de error y éxito */}
        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}
        
        {success && (
          <div style={styles.success}>
            {success}
          </div>
        )}

        {editingMode ? (
          /* Modo de edición */
          <form onSubmit={handleSave} style={styles.formContainer}>
            {/* Sección Misión */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <FaLightbulb size={24} style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Misión Empresarial</h2>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="mision">
                  Misión de la Empresa
                  <span style={{ ...stylesGlobal.typography.body.caption, marginLeft: stylesGlobal.spacing.scale[2] }}>
                    ({tempData.mision.length}/1000)
                  </span>
                </label>
                <textarea
                  id="mision"
                  name="mision"
                  value={tempData.mision}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Describe la misión de la empresa, su propósito fundamental y razón de ser..."
                  rows={6}
                  maxLength={1000}
                  disabled={saving}
                />
                <small style={styles.helpText}>
                  Máximo 1000 caracteres. La misión define el propósito fundamental de la empresa, lo que hace y para quién lo hace.
                </small>
              </div>
            </div>

            {/* Sección Visión */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <FaEye size={24} style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Visión Empresarial</h2>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="vision">
                  Visión de la Empresa
                  <span style={{ ...stylesGlobal.typography.body.caption, marginLeft: stylesGlobal.spacing.scale[2] }}>
                    ({tempData.vision.length}/1000)
                  </span>
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  value={tempData.vision}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Describe la visión de la empresa, hacia dónde se dirige y qué aspira a lograr..."
                  rows={6}
                  maxLength={1000}
                  disabled={saving}
                />
                <small style={styles.helpText}>
                  Máximo 1000 caracteres. La visión describe el futuro deseado de la empresa, sus aspiraciones y metas a largo plazo.
                </small>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ 
              display: 'flex', 
              gap: stylesGlobal.spacing.gaps.md, 
              justifyContent: 'flex-end',
              marginTop: stylesGlobal.spacing.scale[6],
            }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  ...styles.editButton,
                  ...(saving ? styles.disabledButton : {}),
                }}
                disabled={saving}
                aria-label="Cancelar edición"
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{
                  ...styles.primaryButton,
                  ...(saving ? styles.disabledButton : {}),
                }}
                disabled={saving}
                aria-label="Guardar cambios"
              >
                {saving ? (
                  <>
                    <FaSpinner style={{ animation: 'spin 1s linear infinite', marginRight: stylesGlobal.spacing.scale[2] }} />
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave size={14} style={styles.buttonIcon} />
                    Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          /* Modo de vista */
          <>
            {/* Sección Misión - Vista */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <FaLightbulb size={24} style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Misión Empresarial</h2>
              </div>
              
              <div style={styles.previewContainer}>
                <p style={styles.previewText}>
                  {nosotrosData.mision || (
                    <span style={styles.emptyText}>
                      No se ha definido la misión de la empresa. Haz clic en "Editar Información" para agregarla.
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Sección Visión - Vista */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <FaEye size={24} style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Visión Empresarial</h2>
              </div>
              
              <div style={styles.previewContainer}>
                <p style={styles.previewText}>
                  {nosotrosData.vision || (
                    <span style={styles.emptyText}>
                      No se ha definido la visión de la empresa. Haz clic en "Editar Información" para agregarla.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GestionMision;