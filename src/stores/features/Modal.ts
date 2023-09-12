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
  | 'deleteChannel'
  | 'messageFile'
  | 'deleteMessage';

export interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  channel?: ChannelType | null;
  channelData?: Channel | {};
  data?: Server | {};
  apiUrl?: string;
  query?:
    | {
        serverId: string;
        channelId: string;
        content: string;
        url: string;
      }
    | any;
}

const initialState: ModalStore = {
  type: null,
  data: {},
  channel: null,
  channelData: {},
  isOpen: false,
  query: {},
  apiUrl: '',
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
        query: any;
        apiUrl: string;
        data: Server;
      }>
    ) => {
      state.isOpen = true;
      state.type = action.payload.type;
      state.channel = action.payload.channel;
      state.channelData = action.payload.channelData;
      state.query = action.payload.query;
      state.apiUrl = action.payload.apiUrl;
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
