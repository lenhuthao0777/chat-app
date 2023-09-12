'use client';
import ServerModal from '@/components/modals/server-modal';
import InviteModal from '@/components/modals/invite-modal';
import { useEffect, useState } from 'react';
import MemberModal from '@/components/modals/member-modal';
import ChannelModal from '@/components/modals/channel-modal';
import LeaveAndDeleteServerModal from '@/components/modals/leave-and-delete-server-modal';
import DeleteChannelModal from '@/components/modals/delete-channel-modal';
import MessageModal from '@/components/modals/message-modal';
import DeleteMessageModal from '@/components/modals/delete-message-modal';

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <ServerModal />
      <InviteModal />
      <MemberModal />
      <ChannelModal />
      <LeaveAndDeleteServerModal />
      <DeleteChannelModal />
      <MessageModal />
      <DeleteMessageModal />
      {/* <InitialModal
        title='Custom your server'
        open
        description='Give your server a personality with a name and an image. You can
        alway change it later'
      /> */}
    </>
  );
};

export default ModalProvider;
