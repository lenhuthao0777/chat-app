import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { Channel, ChannelType, Server } from '@prisma/client';

export type ModalType =
  | 'createServer'
  | 'invite'
  | 'editServer'
  | 'memberManage'
  | 'createChannel'
  | 'leaveServer'
  | 'deleteServer'
  | 'editChannel'
  | 'deleteChannel';

export interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  channel?: ChannelType | null;
  channelData?: Channel | {};
  data?: Server | {};
}

const initialState: ModalStore = {
  type: null,
  data: {},
  channel: null,
  channelData: {},
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
        channel?: ChannelType;
        channelData?: Channel;
        data: Server;
      }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.channel = action.payload.channel;
      state.channelData = action.payload.channelData;
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
