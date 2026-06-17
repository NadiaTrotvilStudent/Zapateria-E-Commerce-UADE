import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setItems,
  addItem,
  decrementItem,
  incrementItem,
  removeItem,
  clearCart,
} from '@/store/slices/cartSlice.js';
import { apiFetch } from '@/services/apiClient.js';

// la data del carrito sigue viviendo en Redux (cartSlice) para no perder
// la persistencia en localStorage. el Provider expone los helpers
// envueltos para que el resto de la pagina no tenga que tocar Redux.
// ademas, sincroniza con el backend cuando el usuario esta autenticado.
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  // sincroniza el carrito con el backend al iniciar sesion o montar
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    let ignore = false;
    apiFetch('/api/carrito', { token: accessToken })
      .then((response) => {
        if (ignore) return;
        const items = (response.items || []).map((item) => ({
          varianteProductoId: item.varianteProductoId,
          productoId: item.productoId,
          nombre: item.productoNombre,
          talle: item.talle,
          color: item.color,
          precioUnitario: Number(item.precioUnitario),
          cantidad: item.cantidad,
          imagen: null,
        }));
        dispatch(setItems(items));
      })
      .catch(() => {
        // si falla, dejamos lo que haya en localStorage
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, accessToken, dispatch]);

  const value = {
    cartItems,
    addToCart: async (product) => {
      dispatch(addItem(product));
      if (isAuthenticated && accessToken) {
        try {
          await apiFetch('/api/carrito', {
            method: 'POST',
            token: accessToken,
            body: {
              varianteProductoId: product.varianteProductoId,
              cantidad: product.cantidad,
            },
          });
        } catch {
          // si falla el backend, el item ya quedo en localStorage
        }
      }
    },
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
