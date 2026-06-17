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

// GET /api/categorias
export async function fetchCategorias() {
  return apiFetch('/api/categorias');
}

// GET /api/marcas
export async function fetchMarcas() {
  return apiFetch('/api/marcas');
}

// GET /api/generos
export async function fetchGeneros() {
  return apiFetch('/api/generos');
}

// GET /api/tipos-producto
export async function fetchTiposProducto() {
  return apiFetch('/api/tipos-producto');
}

// POST /api/productos (crear, requiere JWT)
export async function createProduct(producto, token) {
  return apiFetch('/api/productos', {
    method: 'POST',
    body: producto,
    token,
  });
}

// PUT /api/productos/:id (actualizar, requiere JWT)
export async function updateProduct(id, producto, token) {
  return apiFetch(`/api/productos/${id}`, {
    method: 'PUT',
    body: producto,
    token,
  });
}
