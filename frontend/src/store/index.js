import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice.js';
import cartReducer from '@/store/slices/cartSlice.js';
import favoritesReducer from '@/store/slices/favoritesSlice.js';
import ordersReducer from '@/store/slices/ordersSlice.js';
import productsReducer from '@/store/slices/productsSlice.js';
import { loadPersistedState, savePersistedState } from '@/store/persistence.js';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    orders: ordersReducer,
    products: productsReducer,
  },
  preloadedState: loadPersistedState(),
});

store.subscribe(() => {
  savePersistedState(store.getState());
});
