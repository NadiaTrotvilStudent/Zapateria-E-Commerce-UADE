import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    createOrder: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
      },
      prepare: ({ cartItems, user }) => {
        const total = cartItems.reduce(
          (accumulator, item) => accumulator + item.precioUnitario * item.cantidad,
          0,
        );

        return {
          payload: {
            id: Date.now(),
            usuarioId: user?.id ?? null,
            username: user?.username ?? 'cliente-demo',
            fechaCreacion: new Date().toISOString(),
            total,
            detalles: cartItems,
          },
        };
      },
    },
    clearOrders: () => initialState,
  },
});

export const { createOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
