import React, { useState, useEffect, useCallback } from 'react';
import { FaEdit, FaSave, FaLock, FaLightbulb, FaEye } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { adminAPI } from '../../services/api';
import { Navigate } from 'react-router-dom';
import adminStyles from '../../styles/stylesAdmin';

const GestionMision = () => {
  const { user, isAuthenticated } = useAuth();

  // Mapeo de estilos globales
  const styles = {
    pageContainer: adminStyles.containers.page,
    mainContainer: adminStyles.containers.main,
    header: adminStyles.headerStyles.headerSimple,
    title: adminStyles.headerStyles.titleDark,
    subtitle: adminStyles.headerStyles.subtitleDark,
    content: adminStyles.containers.content,
    error: adminStyles.messageStyles.error,
    success: adminStyles.messageStyles.success,
    
    // Estilos específicos para el formulario de misión/visión
    sectionCard: {
      ...adminStyles.containers.content,
      marginBottom: adminStyles.spacing.xl,
      padding: adminStyles.spacing.xl,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      backgroundColor: adminStyles.colors.white,
      boxShadow: adminStyles.shadows.sm,
    },
    
    sectionHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: adminStyles.spacing.lg,
      paddingBottom: adminStyles.spacing.md,
      borderBottom: `2px solid ${adminStyles.colors.primary}`,
    },
    
    sectionIcon: {
      marginRight: adminStyles.spacing.md,
      color: adminStyles.colors.primary,
    },
    
    sectionTitle: {
      ...adminStyles.headerStyles.titleDark,
      fontSize: adminStyles.typography.textXl,
      margin: 0,
      color: adminStyles.colors.primary,
    },
    
    // Estilos de formulario
    formContainer: {
      width: '100%',
    },
    formGroup: {
      marginBottom: adminStyles.spacing.xl,
      width: '100%',
    },
    label: {
      ...adminStyles.forms.label,
      display: 'block',
      marginBottom: adminStyles.spacing.md,
      fontWeight: adminStyles.typography.weightMedium,
      color: adminStyles.colors.textPrimary,
      fontSize: adminStyles.typography.textSm,
      lineHeight: '1.5',
    },
    textarea: {
      ...adminStyles.forms.textarea,
      width: '100%',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.lg}`,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      fontSize: adminStyles.typography.textBase,
      marginBottom: 0,
      boxSizing: 'border-box',
      minHeight: '150px',
      resize: 'vertical',
      fontFamily: 'inherit',
      lineHeight: '1.6',
      transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
      '&:focus': {
        borderColor: adminStyles.colors.primary,
        boxShadow: `0 0 0 3px ${adminStyles.colors.primary}20`,
        outline: 'none',
      },
    },
    helpText: {
      ...adminStyles.forms.helpText,
      display: 'block',
      marginTop: adminStyles.spacing.md,
      marginBottom: 0,
      fontSize: adminStyles.typography.textSm,
      color: adminStyles.colors.textMuted,
      lineHeight: '1.4',
      fontStyle: 'italic',
    },
    
    // Estilos de botones
    primaryButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.primary,
      display: 'flex',
      alignItems: 'center',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.xl}`,
    },
    
    editButton: {
      ...adminStyles.buttons.base,
      ...adminStyles.buttons.outline,
      display: 'flex',
      alignItems: 'center',
      padding: `${adminStyles.spacing.md} ${adminStyles.spacing.xl}`,
      marginBottom: adminStyles.spacing.lg,
    },
    
    buttonIcon: {
      marginRight: adminStyles.spacing.sm,
    },
    
    // Estilos de vista previa
    previewContainer: {
      backgroundColor: adminStyles.colors.backgroundLight,
      border: `1px solid ${adminStyles.colors.border}`,
      borderRadius: adminStyles.borders.radius,
      padding: adminStyles.spacing.lg,
      marginTop: adminStyles.spacing.md,
    },
    
    previewText: {
      fontSize: adminStyles.typography.textBase,
      lineHeight: '1.6',
      color: adminStyles.colors.textPrimary,
      margin: 0,
      whiteSpace: 'pre-wrap',
    },
    
    emptyText: {
      color: adminStyles.colors.textMuted,
      fontStyle: 'italic',
      fontSize: adminStyles.typography.textSm,
    },
    
    // Estilos de estados
    loadingContainer: adminStyles.loadingStyles.container,
    
    // Utilidades
    textCenter: adminStyles.utilities.textCenter,
    flexCenter: adminStyles.utilities.flexCenter,
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
    try {
      setLoading(true);
      const data = await adminAPI.getNosotros();
      
      setNosotrosData({
        mision: data.mision || '',
        vision: data.vision || ''
      });
      setTempData({
        mision: data.mision || '',
        vision: data.vision || ''
      });
    } catch (err) {
      setError(err.message || 'Error al cargar la información');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchNosotrosData();
  }, [fetchNosotrosData]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempData(prev => ({
      ...prev,
      [name]: value
    }));
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
      vision: nosotrosData.vision
    });
    setError(null);
  };

  // Guardar cambios
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const nosotrosData = {
        mision: tempData.mision.trim(),
        vision: tempData.vision.trim()
      };

      await adminAPI.updateNosotros(nosotrosData);

      // Actualizar datos locales
      setNosotrosData({
        mision: tempData.mision.trim(),
        vision: tempData.vision.trim()
      });
      setEditingMode(false);
      setSuccess('Información actualizada correctamente');
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (err) {
      setError(err.message || 'Error al guardar la información');
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
      <div style={adminStyles.combineStyles(
        styles.pageContainer,
        styles.flexCenter,
        { height: '80vh', textAlign: 'center' }
      )}>
        <FaLock size={50} style={adminStyles.icons.error} />
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
          <h3>Cargando información de la empresa...</h3>
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
            <h1 style={styles.title}>Gestión de Misión y Visión</h1>
            <p style={styles.subtitle}>
              Administra la filosofía empresarial, misión y visión de la organización
            </p>
          </div>
          {!editingMode && (
            <button
              style={styles.editButton}
              onClick={handleEditMode}
              aria-label="Editar información"
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
          <form onSubmit={handleSave}>
            {/* Sección Misión */}
            <div style={styles.sectionCard}>
              <div style={styles.sectionHeader}>
                <FaLightbulb size={24} style={styles.sectionIcon} />
                <h2 style={styles.sectionTitle}>Misión Empresarial</h2>
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label} htmlFor="mision">
                  Misión de la Empresa
                </label>
                <textarea
                  id="mision"
                  name="mision"
                  value={tempData.mision}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Describe la misión de la empresa, su propósito fundamental y razón de ser..."
                  rows={6}
                />
                <small style={styles.helpText}>
                  La misión define el propósito fundamental de la empresa, lo que hace y para quién lo hace.
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
                </label>
                <textarea
                  id="vision"
                  name="vision"
                  value={tempData.vision}
                  onChange={handleInputChange}
                  style={styles.textarea}
                  placeholder="Describe la visión de la empresa, hacia dónde se dirige y qué aspira a lograr..."
                  rows={6}
                />
                <small style={styles.helpText}>
                  La visión describe el futuro deseado de la empresa, sus aspiraciones y metas a largo plazo.
                </small>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ 
              display: 'flex', 
              gap: adminStyles.spacing.lg, 
              justifyContent: 'flex-end',
              marginTop: adminStyles.spacing.xl 
            }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={styles.editButton}
                disabled={saving}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={styles.primaryButton}
                disabled={saving}
                aria-label="Guardar cambios"
              >
                <FaSave size={14} style={styles.buttonIcon} />
                {saving ? 'Guardando...' : 'Guardar Cambios'}
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
