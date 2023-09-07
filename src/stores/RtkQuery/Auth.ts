import { api } from '../api'

export const AuthApi = api.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: { ...credentials }
      })
    }),

    getUser: build.query<any, string>({
      query: (email: any) => ({
        url: `/auth/me/${email}`,
        method: 'GET'
      })
    })
  })
})

export const { useGetUserQuery, useLoginMutation } = AuthApi
