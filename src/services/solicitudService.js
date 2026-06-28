import api from "./api";

// Servicio de solicitudes de cotización. Requiere usuario autenticado;
// el token se adjunta automáticamente en el interceptor de api.js.
const solicitudService = {
  // Lista las solicitudes del usuario actual
  getAll: () => api.get("/solicitudes"),
  // Crea una solicitud: { productos: [{productoId, nombre, imagenURL}], mensaje }
  create: (payload) => api.post("/solicitudes", payload),
};

export default solicitudService;
