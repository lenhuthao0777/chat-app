import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
const initialState: any | null = {
  user: null,
};

const auth: any = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredential: (state, action: PayloadAction<any>) => {
      console.log(action.payload);

      state.user = {
        ...action.payload,
      };

      Cookies.set(
        'userInfo',
        JSON.stringify({
          ...action.payload,
        })
      );
    },

    logout: (state) => {
      state.user = null;
      Cookies.remove('userInfo');
    },
  },
});

export const { setCredential, logout } = auth.actions;

export default auth.reducer;
