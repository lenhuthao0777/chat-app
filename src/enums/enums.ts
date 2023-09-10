export enum ModalAction {
  CREATE = 'createServer',
  EDIT = 'editServer',
  INVITE = 'invite',
}

export const CONTENT = {
  createServer: {
    title: 'Customize your server',
    description:
      'Give your server a personality with a name and an image. You can always change it later.',
  },
  editServer: {
    title: 'Edit your server',
    description:
      'Give your server a personality with a name and an image. You can always change it later.',
  },
  deleteServer: {
    title: 'Delete server',
    description: 'Are you sure you want to delete server',
  },
  leaveServer: {
    title: 'Leave server',
    description: 'Are you sure you want to leave',
  },
  createChannel: {
    title: 'Create Channel',
    description: '',
  },
  editChannel: {
    title: 'Edit Channel',
    description: '',
  },
};
