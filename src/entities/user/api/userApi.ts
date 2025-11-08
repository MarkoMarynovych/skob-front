import { apiSlice } from '~shared/api/apiSlice';
import { User } from '../model/types';
import { Group } from '~entities/group/model/types';

interface ForemanWithStats extends User {
  groupCount: number;
  scoutCount: number;
  lastActivity?: string;
  averageProgress?: number;
}

interface ForemanDetails {
  id: string;
  name: string;
  email: string;
  picture?: string;
  role: string;
  groupCount: number;
  scoutCount: number;
  averageProgress?: number;
  groups: Group[];
}

interface LiaisonWithStats extends User {
  foremanCount: number;
  totalScouts: number;
}

interface UpdateUserRequest {
  email: string;
  data: {
    sex?: 'MALE' | 'FEMALE';
    name?: string;
  };
}

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getForemanList: builder.query<ForemanWithStats[], void>({
      query: () => '/users/foremen',
      providesTags: ['User'],
    }),
    getForemanDetail: builder.query<ForemanWithStats, string>({
      query: (foremanId) => `/users/foreman/${foremanId}`,
      providesTags: ['User'],
    }),

    getForemanDetails: builder.query<ForemanDetails, string>({
      query: (foremanId) => `/users/foremen/${foremanId}`,
      providesTags: ['User', 'Group'],
    }),
    getLiaisonList: builder.query<LiaisonWithStats[], void>({
      query: () => '/users/liaisons',
      providesTags: ['User'],
    }),
    getLiaisonDetail: builder.query<LiaisonWithStats, string>({
      query: (liaisonId) => `/users/liaison/${liaisonId}`,
      providesTags: ['User'],
    }),
    updateUser: builder.mutation<void, UpdateUserRequest>({
      query: ({ email, data }) => ({
        url: `/users/${email}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Me', 'User', 'Group'],
    }),
  }),
});

export const {
  useGetForemanListQuery,
  useGetForemanDetailQuery,
  useGetForemanDetailsQuery,
  useGetLiaisonListQuery,
  useGetLiaisonDetailQuery,
  useUpdateUserMutation,
} = userApi;
