import { api } from '../api';

export const ChannelApi = api.injectEndpoints({
  endpoints: (build) => ({
    createChannel: build.mutation({
      query: (credentials) => ({
        url: 'channels',
        method: 'POST',
        body: { ...credentials },
      }),
    }),
    editChannel: build.mutation({
      query: (credentials) => ({
        url: 'channels',
        method: 'PUT',
        body: { ...credentials },
      }),
    }),
    deleteChannel: build.mutation({
      query: (credentials) => ({
        url: `channels/${credentials?.channelId}`,
        method: 'DELETE',
        body: { serverId: credentials?.serverId },
      }),
    }),
  }),
});

export const {
  useCreateChannelMutation,
  useEditChannelMutation,
  useDeleteChannelMutation,
} = ChannelApi;
