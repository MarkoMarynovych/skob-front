import { apiSlice } from '~shared/api/apiSlice';
import {
  AcceptInviteResponse,
  InviteDetailsResponse,
  Invite,
  JoinGroupResponse,
  GenerateInviteRequest,
  GenerateInviteResponse,
} from '../model/types';

export const inviteApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateInvite: builder.mutation<GenerateInviteResponse, GenerateInviteRequest>({
      query: (body) => ({
        url: '/invites/generate',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Invite'],
    }),

    acceptInviteByToken: builder.mutation<AcceptInviteResponse, string>({
      query: (token) => ({
        url: `/invites/accept/${token}`,
        method: 'POST',
      }),
      invalidatesTags: ['Invite', 'Group', 'User', 'Kurin', 'Me'],
    }),

    joinGroup: builder.mutation<JoinGroupResponse, string>({
      query: (inviteToken) => ({
        url: `/invites/join/${inviteToken}`,
        method: 'POST',
      }),
      invalidatesTags: ['Group', 'User', 'Me'],
    }),
  }),
});

export const {
  useGenerateInviteMutation,
  useAcceptInviteByTokenMutation,
  useJoinGroupMutation,
} = inviteApi;
