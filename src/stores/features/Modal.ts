import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Server } from '@prisma/client';

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'memberManage';

export interface ModalStore {
  type: ModalType | null;
  content:
    | {
        title: string;
        description: string;
      }
    | {};
  isOpen: boolean;
  data: Server | {};
}

const initialState: ModalStore = {
  type: null,
  data: {},
  content: {},
  isOpen: false,
};

const modal: any = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    onOpen: (
      state,
      action: PayloadAction<{
        type: ModalType;
        data: Server;
      }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.data = action.payload.data;
    },
    onClose: (state) => {
      state.isOpen = false;
      state.type = null;
    },
  },
});

export const { onOpen, onClose } = modal.actions;

export const selectModal = (state: RootState) => state;

export default modal.reducer;
