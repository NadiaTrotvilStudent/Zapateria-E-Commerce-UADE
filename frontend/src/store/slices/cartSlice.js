import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action) => {
      const item = action.payload;
      const existingItem = state.items.find(
        (cartItem) => cartItem.varianteProductoId === item.varianteProductoId,
      );

      if (existingItem) {
        existingItem.cantidad += item.cantidad;
        return;
      }

      state.items.push(item);
    },
    incrementItem: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.varianteProductoId === action.payload);
      if (item) item.cantidad += 1;
    },
    decrementItem: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.varianteProductoId === action.payload);
      if (item && item.cantidad > 1) item.cantidad -= 1;
    },
    setItemQuantity: (state, action) => {
      const { varianteProductoId, cantidad } = action.payload;
      const item = state.items.find((cartItem) => cartItem.varianteProductoId === varianteProductoId);
      if (item) item.cantidad = Math.max(1, cantidad);
    },
    removeItem: (state, action) => {
      state.items = state.items.filter((item) => item.varianteProductoId !== action.payload);
    },
    clearCart: () => initialState,
  },
});

export const {
  addItem,
  incrementItem,
  decrementItem,
  setItemQuantity,
  removeItem,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
