import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Hook personalizado para manejar navegación en GitHub Pages
 * Resuelve el problema de 404 al hacer redirecciones
 */
export const useGitHubPagesNavigation = () => {
  const navigate = useNavigate();

  const isGitHubPages = useCallback(() => {
    return typeof window !== 'undefined' && window.location.hostname.includes('github.io');
  }, []);

  const getBasePath = useCallback(() => {
    if (typeof window === 'undefined') return '';
    const pathParts = window.location.pathname.split('/');
    return pathParts[1] ? `/${pathParts[1]}` : '';
  }, []);

  const navigateWithGitHubPages = useCallback((path, options = {}) => {
    if (isGitHubPages()) {
      const basePath = getBasePath();
      const fullPath = path.startsWith('/') ? `${basePath}${path}` : `${basePath}/${path}`;
      
      if (options.replace || options.external) {
        window.location.href = window.location.origin + fullPath;
      } else {
        navigate(fullPath, options);
      }
    } else {
      if (options.external) {
        window.location.href = path;
      } else {
        navigate(path, options);
      }
    }
  }, [navigate, isGitHubPages, getBasePath]);

  const redirectToHome = useCallback(() => {
    if (isGitHubPages()) {
      const basePath = getBasePath();
      const homePath = basePath || '/';
      // Para GitHub Pages, usar window.location.href para asegurar redirección completa
      window.location.href = window.location.origin + homePath;
    } else {
      // En desarrollo local, usar navigate
      navigate('/', { replace: true });
    }
  }, [navigate, isGitHubPages, getBasePath]);

  const redirectToLogin = useCallback(() => {
    if (isGitHubPages()) {
      const basePath = getBasePath();
      const loginPath = basePath ? `${basePath}/login` : '/login';
      window.location.href = window.location.origin + loginPath;
    } else {
      navigate('/login', { replace: true });
    }
  }, [navigate, isGitHubPages, getBasePath]);

  const handleLogoutRedirect = useCallback(() => {
    if (isGitHubPages()) {
      const basePath = getBasePath();
      const homePath = basePath || '/';
      // Limpiar el localStorage antes de redirigir
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } catch (error) {
        console.warn('Error limpiando localStorage:', error);
      }
      // Forzar redirección completa para evitar 404
      window.location.replace(window.location.origin + homePath);
    } else {
      navigate('/', { replace: true });
    }
  }, [navigate, isGitHubPages, getBasePath]);

  return {
    navigateWithGitHubPages,
    redirectToHome,
    redirectToLogin,
    handleLogoutRedirect,
    isGitHubPages: isGitHubPages(),
    basePath: getBasePath()
  };
};

export default useGitHubPagesNavigation;
