'use client';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { ModalStore, onClose } from '@/stores/features/Modal';
import { RootState } from '@/stores/store';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Fragment, useState } from 'react';
import { useDeleteChannelMutation } from '@/stores/RtkQuery/Channel';
import { useRouter } from 'next/navigation';
import qs from 'query-string';
import axios from 'axios';

const DeleteMessageModal = () => {
  const modalState: ModalStore | any = useAppSelector(
    (state: RootState) => state.ModalFeature
  );

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const isModalOpen =
    modalState?.isOpen && modalState?.type === 'deleteMessage';

  const [deleteChannel] = useDeleteChannelMutation();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const url = qs.stringifyUrl({
        url: modalState?.apiUrl,
        query: modalState?.query,
      });

      await axios.delete(url);
    } catch (error) {
      return error;
    } finally {
      router.refresh();
      setIsLoading(false);
      dispatch(onClose());
    }
  };

  return (
    <Fragment>
      <Dialog open={isModalOpen} onOpenChange={() => dispatch(onClose())}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>
              Delete Message
            </DialogTitle>
          </DialogHeader>
          <div className='p-6 text-center'>
            <Label className='text-xs uppercase  font-bold text-zinc-500 dark:text-secondary/70'>
              Are you sure you want to do this?{' '}
              {/* <span className='text-base text-indigo-500'>
                #{modalState?.channelData?.name}
              </span>{' '}
              will be permanently deleted. */}
            </Label>
          </div>

          <DialogFooter className='w-full py-5'>
            <div className='w-full flex items-center justify-between'>
              <Button
                variant='secondary'
                disabled={isLoading}
                onClick={() => dispatch(onClose())}
              >
                Cancel
              </Button>
              <Button
                variant='danger'
                disabled={isLoading}
                onClick={handleDelete}
              >
                Confirm
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default DeleteMessageModal;
