import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '~shared/api/apiSlice';
import sessionReducer from '~entities/session/model/sessionSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    session: sessionReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
