'use client';
import React, { Fragment, useState } from 'react';

// Components
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { ModalStore, onClose, onOpen } from '@/stores/features/Modal';
import { RootState } from '@/stores/store';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { CONTENT } from '@/enums/enums';
import {
  useDeleteServerMutation,
  useLeaveServerMutation,
} from '@/stores/RtkQuery/Server';

const LeaveAndDeleteServerModal = () => {
  const modalState: ModalStore | any = useAppSelector(
    (state: RootState) => state.ModalFeature
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const modalAction = ['leaveServer', 'deleteServer'];

  const isModalOpen =
    modalState?.isOpen && modalAction.includes(modalState?.type);

  const [leaveServer] = useLeaveServerMutation();

  const [deleteServer] = useDeleteServerMutation();

  const onHandelLeaveAndDelete = async () => {
    setIsLoading(true);
    try {
      if (modalState?.type === 'leaveServer') {
        await leaveServer({ serverId: modalState?.data?.id });
      } else {
        await deleteServer({ id: modalState?.data?.id });
      }
      await dispatch(onClose());
      await router.push('/');
      await router.refresh();
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Fragment>
      <Dialog open={isModalOpen} onOpenChange={() => dispatch(onClose())}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>
              {CONTENT[modalState?.type as keyof typeof CONTENT]?.title}
            </DialogTitle>
          </DialogHeader>
          <div className='p-6 text-center'>
            <Label className='text-xs uppercase  font-bold text-zinc-500 dark:text-secondary/70'>
              {CONTENT[modalState?.type as keyof typeof CONTENT]?.description}{' '}
              <span className='text-base text-indigo-500'>
                {modalState?.data?.name}?
              </span>
            </Label>
          </div>

          <DialogFooter className='w-full py-5'>
            <div className='w-full flex items-center justify-between'>
              <Button variant='secondary' onClick={() => dispatch(onClose())}>
                Cancel
              </Button>
              <Button variant='danger' onClick={onHandelLeaveAndDelete}>
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default LeaveAndDeleteServerModal;
