import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseURL,
    credentials: 'include',
  }),
  tagTypes: ['Me', 'User', 'Group', 'Proba', 'Note', 'Invite', 'Kurin'],
  endpoints: () => ({}),
});
