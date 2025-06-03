import api from './api';

export const createProduct = async (productData) => {
  // Nota: Para imágenes, usamos FormData (ver ejemplo más abajo)
  return api.post('/products', productData);
};

export const getProducts = async () => {
  return api.get('/products');
};

export const deleteProduct = async (productId) => {
  return api.delete(`/products/${productId}`);
};

