import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '~entities/user/model/types';

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}

const initialState: SessionState = {
  user: null,
  isAuthenticated: false,
  token: null,
};

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User; token?: string }>) => {
      state.user = action.payload.user;
      state.token = action.payload.token || null;
      state.isAuthenticated = true;
    },
    clearSession: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
