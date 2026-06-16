import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '@/store/slices/counterSlice.js';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});
