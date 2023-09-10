import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';
import { RootState } from './store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_SOMETHING_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // const token = (getState() as RootState).AuthFeature?.user?.token;
    const session: any = Cookies.get('userInfo');

    if (session?.accessToken) {
      headers.set('authorization', `Bearer ${session?.accessToken}`);
    }
    return headers;
  },
});

const baseQueryWithAuth = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // api.dispatch(logout());
  }

  return result;
};

export const api = createApi({
  baseQuery: baseQueryWithAuth,
  endpoints: (builder) => ({}),
});
