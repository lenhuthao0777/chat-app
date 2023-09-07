'use client';

import ServerModal from '@/components/modals/server-modal';
import InviteModal from '@/components/modals/invite-modal';
import { useEffect, useState } from 'react';
import MemberModal from '@/components/modals/member-modal';

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
    </>
  );
};

export default ModalProvider;
