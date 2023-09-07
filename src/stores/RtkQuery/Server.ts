import { api } from '../api';

export const ServerApi = api.injectEndpoints({
  endpoints: (build) => ({
    serverCreate: build.mutation({
      query: (credentials) => ({
        url: 'servers',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    serverUpdate: build.mutation({
      query: (credentials) => ({
        url: `servers/${credentials?.id}/invite-code`,
        method: 'PUT',
      }),
    }),
    serverUpdateById: build.mutation({
      query: (credentials) => ({
        url: `servers/${credentials?.id}`,
        method: 'PUT',
        body: { name: credentials.name, imageUrl: credentials.imageUrl },
      }),
    }),
  }),
});

export const {
  useServerCreateMutation,
  useServerUpdateMutation,
  useServerUpdateByIdMutation,
} = ServerApi;
