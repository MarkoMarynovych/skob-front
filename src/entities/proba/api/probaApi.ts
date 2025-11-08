import { apiSlice } from '~shared/api/apiSlice';
import { Proba } from '../model/types';

interface SignProbaItemRequest {
  userId: string;
  itemId: string;
  foremanId: string;
  status: boolean;
}

interface UpdateProbaNoteRequest {
  progressId: string;
  content: string;
}

export const probaApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUserProbas: builder.query<Proba[], string>({
      query: (userId) => `/probas/${userId}`,
      transformResponse: (response: any) => {
        console.log('[probaApi] Raw response from backend:', response);

        if (!response || typeof response !== 'object') {
          return [];
        }

        if (Array.isArray(response)) {
          return response;
        }

        const probas: Proba[] = [];

        // Helper function to convert object structure to array
        const convertProbaObject = (probaData: Record<string, any[]>, probaName: string, probaId: string) => {
          const sections = Object.entries(probaData).map(([sectionName, items]) => ({
            id: `${probaId}-${sectionName.toLowerCase().replace(/\s+/g, '-')}`,
            name: sectionName,
            items: items.filter(Boolean).map((item: any) => ({
              id: item.proba_item?.id || Math.random().toString(),
              progressId: item.progress_id,
              text: item.proba_item?.text || 'No description',
              isCompleted: item.is_completed || false,
              completedAt: item.completed_at,
              completedBy: item.signed_by ? {
                id: item.signed_by.id,
                name: item.signed_by.name,
                email: item.signed_by.email,
              } : undefined,
              notes: item.notes || [],
            })),
          }));

          return {
            id: probaId,
            name: probaName,
            sections,
          };
        };

        if (response.zeroProba && typeof response.zeroProba === 'object' && Object.keys(response.zeroProba).length > 0) {
          probas.push(convertProbaObject(response.zeroProba, 'Прихильник (Zero Proba)', 'zero-proba'));
        }

        if (response.firstProba && typeof response.firstProba === 'object' && Object.keys(response.firstProba).length > 0) {
          probas.push(convertProbaObject(response.firstProba, 'Перша Проба (First Proba)', 'first-proba'));
        }

        if (response.secondProba && typeof response.secondProba === 'object' && Object.keys(response.secondProba).length > 0) {
          probas.push(convertProbaObject(response.secondProba, 'Друга Проба (Second Proba)', 'second-proba'));
        }

        console.log('[probaApi] Transformed probas:', probas);
        return probas;
      },
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Proba' as const, id })),
              { type: 'Proba', id: 'LIST' },
            ]
          : [{ type: 'Proba', id: 'LIST' }],
    }),

    signProbaItem: builder.mutation<void, SignProbaItemRequest>({
      query: ({ userId, itemId, foremanId, status }) => ({
        url: '/probas/item',
        method: 'PATCH',
        body: { userId, itemId, foremanId, status },
      }),
      invalidatesTags: [{ type: 'Proba', id: 'LIST' }],
    }),

    updateProbaNote: builder.mutation<void, UpdateProbaNoteRequest>({
      query: ({ progressId, content }) => ({
        url: `/progress/${progressId}/notes`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: [
        { type: 'Proba', id: 'LIST' },
        { type: 'Note', id: 'LIST' },
      ],
    }),

    initializeProbas: builder.mutation<void, string>({
      query: (userId) => ({
        url: `/probas/users/${userId}/initialize`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'Proba', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUserProbasQuery,
  useSignProbaItemMutation,
  useUpdateProbaNoteMutation,
  useInitializeProbasMutation,
} = probaApi;
