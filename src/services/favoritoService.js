import api from "./api";

// Servicio de favoritos (lista de deseos). Requiere usuario autenticado;
// el token se adjunta automáticamente en el interceptor de api.js.
const favoritoService = {
  // Lista los productos favoritos del usuario (ya poblados)
  getAll: () => api.get("/favoritos"),
  // Agrega un producto a favoritos
  add: (productoId) => api.post(`/favoritos/${productoId}`),
  // Quita un producto de favoritos
  remove: (productoId) => api.delete(`/favoritos/${productoId}`),
};

export default favoritoService;
