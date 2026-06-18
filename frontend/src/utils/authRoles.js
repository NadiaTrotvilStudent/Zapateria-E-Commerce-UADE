export function normalizeRole(role) {
  return String(role || '').replace(/^ROLE_/, '').trim().toUpperCase();
}

export function getUserRoles(user) {
  if (Array.isArray(user?.roles)) return user.roles.map(normalizeRole);
  if (user?.roles instanceof Set) return Array.from(user.roles).map(normalizeRole);
  if (typeof user?.roles === 'string') return user.roles.split(/[ ,]+/).map(normalizeRole).filter(Boolean);
  return [];
}

export function userHasRole(user, role) {
  return getUserRoles(user).includes(normalizeRole(role));
}

export function userHasAnyRole(user, allowedRoles = []) {
  if (!allowedRoles.length) return true;
  return allowedRoles.some((role) => userHasRole(user, role));
}
