import { createSlice } from '@reduxjs/toolkit';
import { demoProducts } from '@/data/demoProducts.js';

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: demoProducts,
  },
  reducers: {},
});

export default productsSlice.reducer;
