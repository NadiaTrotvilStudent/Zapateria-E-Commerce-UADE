const STORAGE_KEY = 'zapateria-redux-state';

export function loadPersistedState() {
  if (typeof window === 'undefined') return undefined;

  try {
    const serializedState = window.localStorage.getItem(STORAGE_KEY);
    return serializedState ? JSON.parse(serializedState) : undefined;
  } catch {
    return undefined;
  }
}

export function savePersistedState(state) {
  if (typeof window === 'undefined') return;

  try {
    const stateToPersist = {
      auth: state.auth,
      cart: state.cart,
      favorites: state.favorites,
      orders: state.orders,
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
  } catch {
    // Si el navegador bloquea localStorage, Redux sigue funcionando en memoria.
  }
}
