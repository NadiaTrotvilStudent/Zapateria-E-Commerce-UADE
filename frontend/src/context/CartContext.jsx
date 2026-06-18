import { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setItems,
  decrementItem,
  incrementItem,
  removeItem as removeItemAction,
  clearCart as clearCartAction,
} from '@/store/slices/cartSlice.js';
import { apiFetch } from '@/services/apiClient.js';

const CartContext = createContext(null);

function mapBackendCart(response, previousItems = []) {
  return (response?.items || []).map((item) => {
    const previous = previousItems.find(
      (storedItem) => Number(storedItem.varianteProductoId) === Number(item.varianteProductoId),
    );

    return {
      itemId: item.id,
      varianteProductoId: item.varianteProductoId,
      productoId: item.productoId,
      nombre: item.productoNombre,
      talle: item.talle,
      color: item.color,
      precioUnitario: Number(item.precioUnitario),
      cantidad: item.cantidad,
      subtotal: Number(item.subtotal ?? Number(item.precioUnitario) * item.cantidad),
      stockDisponible: previous?.stockDisponible,
      imagen: previous?.imagen ?? null,
    };
  });
}

export function CartProvider({ children }) {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);
  const accessToken = useSelector((state) => state.auth.accessToken);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      dispatch(clearCartAction());
      return;
    }

    let ignore = false;
    apiFetch('/api/carrito', { token: accessToken })
      .then((response) => {
        if (!ignore) dispatch(setItems(mapBackendCart(response)));
      })
      .catch(() => {
        // Si el backend falla, dejamos lo que haya persistido localmente.
      });

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, accessToken, dispatch]);

  const syncCartFromBackend = async (request) => {
    const response = await request();
    dispatch(setItems(mapBackendCart(response, cartItems)));
  };

  const findCartItem = (varianteProductoId) => cartItems.find(
    (item) => item.varianteProductoId === varianteProductoId,
  );

  const value = {
    cartItems,
    addToCart: async (product) => {
      if (isAuthenticated && accessToken) {
        const response = await apiFetch('/api/carrito', {
          method: 'POST',
          token: accessToken,
          body: {
            varianteProductoId: product.varianteProductoId,
            cantidad: product.cantidad,
          },
        });
        dispatch(setItems(mapBackendCart(response, [...cartItems, product])));
        return;
      }
      throw new Error('Para agregar productos al carrito tenes que iniciar sesion.');
    },
    increment: async (id) => {
      const item = findCartItem(id);
      if (item?.stockDisponible && item.cantidad >= item.stockDisponible) return;

      if (isAuthenticated && accessToken && item?.itemId) {
        await syncCartFromBackend(() => apiFetch(`/api/carrito/items/${item.itemId}`, {
          method: 'PATCH',
          token: accessToken,
          body: { cantidad: item.cantidad + 1 },
        }));
        return;
      }

      dispatch(incrementItem(id));
    },
    decrement: async (id) => {
      const item = findCartItem(id);
      if (!item || item.cantidad <= 1) return;

      if (isAuthenticated && accessToken && item.itemId) {
        await syncCartFromBackend(() => apiFetch(`/api/carrito/items/${item.itemId}`, {
          method: 'PATCH',
          token: accessToken,
          body: { cantidad: item.cantidad - 1 },
        }));
        return;
      }

      dispatch(decrementItem(id));
    },
    removeItem: async (id) => {
      const item = findCartItem(id);

      if (isAuthenticated && accessToken && item?.itemId) {
        await syncCartFromBackend(() => apiFetch(`/api/carrito/items/${item.itemId}`, {
          method: 'DELETE',
          token: accessToken,
        }));
        return;
      }

      dispatch(removeItemAction(id));
    },
    clearCart: async () => {
      if (isAuthenticated && accessToken) {
        await syncCartFromBackend(() => apiFetch('/api/carrito', {
          method: 'DELETE',
          token: accessToken,
        }));
        return;
      }

      dispatch(clearCartAction());
    },
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
