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
    navigateWithGitHubPages('/', { replace: true, external: true });
  }, [navigateWithGitHubPages]);

  const redirectToLogin = useCallback(() => {
    navigateWithGitHubPages('/login', { replace: true, external: true });
  }, [navigateWithGitHubPages]);

  return {
    navigateWithGitHubPages,
    redirectToHome,
    redirectToLogin,
    isGitHubPages: isGitHubPages(),
    basePath: getBasePath()
  };
};

export default useGitHubPagesNavigation;
