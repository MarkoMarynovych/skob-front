import { apiSlice } from '~shared/api/apiSlice';
import { User } from '~entities/user/model/types';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/users/me',
      providesTags: ['Me'],
      keepUnusedDataFor: 0,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
      invalidatesTags: ['Me'],
    }),
  }),
});

export const { useGetMeQuery, useLogoutMutation } = authApi;
