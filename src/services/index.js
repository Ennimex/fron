// Archivo central que exporta todos los servicios
export { default as adminService } from './adminServices.js';
export { default as productService } from './productService.js';
export { default as categoriaService } from './categoriaService.js';
export { default as tallaService } from './tallaService.js';
export { default as localidadService } from './localidadService.js';
export { default as eventoService } from './eventoService.js';
export { default as fotoService } from './fotoService.js';
export { default as videoService } from './videoService.js';
export { servicioService } from './servicioService.js';
export { default as nosotrosService } from './nosotrosService.js';
export { default as colaboradorService } from './colaboradorService.js';
export { profileService } from './profileService.js';

// API base
export { default as api, authAPI, publicAPI, adminAPI } from './api.js';

// Re-exportar el servicio de upload para compatibilidad
export { default as uploadService } from './uploadService.js';
