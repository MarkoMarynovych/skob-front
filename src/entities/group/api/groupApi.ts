import { apiSlice } from '~shared/api/apiSlice';
import { Group, GroupDetails, CreateGroupRequest, InviteLinkResponse } from '../model/types';

export const groupApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyGroups: builder.query<Group[], string | void>({
      query: (foremanId) => foremanId ? `/groups?foremanId=${foremanId}` : '/groups',
      providesTags: (result) =>
        result && Array.isArray(result)
          ? [
              ...result.map(({ id }) => ({ type: 'Group' as const, id })),
              { type: 'Group', id: 'LIST' },
            ]
          : [{ type: 'Group', id: 'LIST' }],
    }),

    getGroupById: builder.query<Group, string>({
      query: (id) => `/groups/${id}`,
      providesTags: (result, error, id) => [{ type: 'Group', id }],
    }),

    getGroupDetails: builder.query<GroupDetails, string>({
      query: (id) => `/groups/${id}/details`,
      providesTags: (result, error, id) => [{ type: 'Group', id }],
    }),

    createGroup: builder.mutation<Group, CreateGroupRequest>({
      query: (body) => ({
        url: '/groups',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Group', id: 'LIST' }],
    }),

    updateGroup: builder.mutation<void, { groupId: string; name: string }>({
      query: ({ groupId, name }) => ({
        url: `/groups/${groupId}`,
        method: 'PATCH',
        body: { name },
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: 'Group', id: groupId },
        { type: 'Group', id: 'LIST' },
      ],
    }),

    getGroupInviteLink: builder.query<InviteLinkResponse, string>({
      query: (groupId) => `/groups/${groupId}/invite-link`,
    }),

    removeMember: builder.mutation<{ message: string }, { groupId: string; userId: string }>({
      query: ({ groupId, userId }) => ({
        url: `/groups/${groupId}/members/${userId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, { groupId }) => [
        { type: 'Group', id: groupId },
        { type: 'Group', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useGetMyGroupsQuery,
  useGetGroupByIdQuery,
  useGetGroupDetailsQuery,
  useCreateGroupMutation,
  useUpdateGroupMutation,
  useGetGroupInviteLinkQuery,
  useLazyGetGroupInviteLinkQuery,
  useRemoveMemberMutation,
} = groupApi;
