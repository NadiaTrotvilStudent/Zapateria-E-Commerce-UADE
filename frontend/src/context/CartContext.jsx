import { createContext, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addItem,
  decrementItem,
  incrementItem,
  removeItem,
  clearCart,
} from '@/store/slices/cartSlice.js';

// la data del carrito sigue viviendo en Redux (cartSlice) para no perder
// la persistencia en localStorage. el Provider expone los helpers
// envueltos para que el resto de la pagina no tenga que tocar Redux.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const value = {
    cartItems,
    addToCart: (product) => dispatch(addItem(product)),
    increment: (id) => dispatch(incrementItem(id)),
    decrement: (id) => dispatch(decrementItem(id)),
    removeItem: (id) => dispatch(removeItem(id)),
    clearCart: () => dispatch(clearCart()),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart tiene que usarse adentro de <CartProvider>');
  }
  return ctx;
}
