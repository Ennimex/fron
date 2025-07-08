// GitHub Pages router fix
// Este archivo debe ser incluido antes de React Router

(function() {
  const redirect = sessionStorage.redirect;
  delete sessionStorage.redirect;
  if (redirect && redirect !== location.href) {
    window.history.replaceState(null, null, redirect);
  }
})();

// Detectar si estamos en GitHub Pages
window.isGitHubPages = window.location.hostname.includes('github.io');

// Función global para manejar logout en GitHub Pages
window.handleGitHubPagesLogout = function() {
  try {
    // Limpiar storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    
    // Redirigir
    if (window.isGitHubPages) {
      const basePath = window.location.pathname.split('/')[1];
      const homePath = basePath ? `/${basePath}/` : '/';
      window.location.replace(window.location.origin + homePath);
    } else {
      window.location.replace('/');
    }
  } catch (error) {
    console.error('Error durante logout:', error);
    window.location.reload();
  }
};
