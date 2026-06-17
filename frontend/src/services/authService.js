import { apiFetch } from './apiClient.js';

// login normal contra el backend, devuelve el JWT
export async function loginUser({ email, password }) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}

// registro, mismo endpoint devuelve el usuario + token ya logueado
export async function registerUser({ username, email, password, nombre, apellido }) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    body: { username, email, password, nombre, apellido },
  });
}
