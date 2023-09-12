import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface SocketType {
  isConnected: boolean;
}

const initialState: SocketType = {
  isConnected: false,
};

const socket: any = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    onOpen: (
      state,
      action: PayloadAction<{
        isConnected: boolean;
      }>
    ) => {
      state.isConnected = action.payload.isConnected;
    },
  },
});

export const { onOpen, onClose } = socket.actions;

export const selectModal = (state: RootState) => state;

export default socket.reducer;
