const RAW_API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

// VITE_API_URL deberia ser solo el host (ej http://localhost:8080).
// Pero si alguien deja un /api al final, se lo saco aca asi no quedan
// urls feas tipo /api/api/productos.
function normalizeBase(url) {
  let base = url.replace(/\/+$/, '');
  if (base.endsWith('/api')) {
    base = base.substring(0, base.length - 4);
  }
  return base;
}

export const API_BASE_URL = normalizeBase(RAW_API_URL);

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

// wrapper de fetch: le paso el token y arma el header solo
export async function apiFetch(path, { method = 'GET', body, token, headers = {} } = {}) {
  const url = buildApiUrl(path);
  const requestHeaders = {
    Accept: 'application/json',
    ...headers,
  };

  if (body !== undefined) {
    requestHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    // intento leer el body para mostrar el mensaje que manda el backend
    let detail = '';
    try {
      const data = await response.json();
      detail = data.message || data.error || JSON.stringify(data);
    } catch {
      detail = response.statusText;
    }
    throw new Error(`Error ${response.status}: ${detail}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}
