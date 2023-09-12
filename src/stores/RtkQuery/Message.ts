import { api } from '../api';

export const MessageApi = api.injectEndpoints({
  endpoints: (build) => ({
    createMessage: build.mutation({
      query: (credentials: any) => {
        const { url, ...params } = credentials;
        return {
          url: `${url}`,
          method: 'POST',
          body: {
            ...params,
          },
        };
      },
    }),
  }),
});

export const { useCreateMessageMutation } = MessageApi;
