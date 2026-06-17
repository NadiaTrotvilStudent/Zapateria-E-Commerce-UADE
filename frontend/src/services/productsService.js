import { apiFetch } from './apiClient.js';

// GET /api/productos con filtro opcional por categoria
export async function fetchProducts(categoriaId) {
  const query = categoriaId ? `?categoriaId=${categoriaId}` : '';
  return apiFetch(`/api/productos${query}`);
}

// GET /api/productos/:id
export async function fetchProductById(id) {
  return apiFetch(`/api/productos/${id}`);
}

// GET /api/categorias (para el <select> del filtro)
export async function fetchCategorias() {
  return apiFetch('/api/categorias');
}
