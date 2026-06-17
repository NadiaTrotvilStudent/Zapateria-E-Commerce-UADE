import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login real: el backend devuelve { accessToken, refreshToken, usuario }.
    loginSuccess: (state, action) => {
      const { accessToken, refreshToken, usuario } = action.payload;
      state.user = usuario;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
    },
    logout: () => initialState,
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
