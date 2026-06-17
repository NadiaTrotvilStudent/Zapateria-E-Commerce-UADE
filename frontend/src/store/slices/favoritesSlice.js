import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  productIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action) => {
      const productId = Number(action.payload);
      if (state.productIds.includes(productId)) {
        state.productIds = state.productIds.filter((id) => id !== productId);
        return;
      }
      state.productIds.push(productId);
    },
    clearFavorites: () => initialState,
  },
});

export const { toggleFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
