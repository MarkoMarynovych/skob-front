import { apiSlice } from '~shared/api/apiSlice';
import { Kurin, CreateKurinRequest, UpdateKurinRequest, KurinForeman, KurinDetails } from '../model/types';

export const kurinApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getKurins: builder.query<Kurin[], void>({
      query: () => '/kurins',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Kurin' as const, id })),
              { type: 'Kurin', id: 'LIST' },
            ]
          : [{ type: 'Kurin', id: 'LIST' }],
    }),

    getKurin: builder.query<Kurin, string>({
      query: (id) => `/kurins/${id}`,
      providesTags: (result, error, id) => [{ type: 'Kurin', id }],
    }),

    getKurinDetails: builder.query<KurinDetails, string>({
      query: (id) => `/kurins/${id}`,
      providesTags: (result, error, id) => [{ type: 'Kurin', id }],
    }),

    getKurinForemen: builder.query<KurinForeman[], string>({
      query: (kurinId) => `/kurins/${kurinId}/foremen`,
      providesTags: (result, error, kurinId) => [{ type: 'Kurin', id: kurinId }],
    }),

    createKurin: builder.mutation<Kurin, CreateKurinRequest>({
      query: (body) => ({
        url: '/kurins',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Kurin', id: 'LIST' }],
    }),

    updateKurin: builder.mutation<Kurin, { id: string; data: UpdateKurinRequest }>({
      query: ({ id, data }) => ({
        url: `/kurins/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Kurin', id },
        { type: 'Kurin', id: 'LIST' },
      ],
    }),

    deleteKurin: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/kurins/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Kurin', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetKurinsQuery,
  useGetKurinQuery,
  useGetKurinDetailsQuery,
  useGetKurinForemenQuery,
  useCreateKurinMutation,
  useUpdateKurinMutation,
  useDeleteKurinMutation,
} = kurinApi;
