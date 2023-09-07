import { api } from '../api';

export const MemberApi = api.injectEndpoints({
  endpoints: (build) => ({
    updateRole: build.mutation({
      query: (credentials) => ({
        url: `members/${credentials?.id}`,
        method: 'PUT',
        body: { ...credentials },
      }),
    }),
    deleteMember: build.mutation({
      query: (credentials) => ({
        url: `members/${credentials?.id}`,
        method: 'DELETE',
        body: { ...credentials },
      }),
    }),
  }),
});

export const { useUpdateRoleMutation, useDeleteMemberMutation } = MemberApi;
