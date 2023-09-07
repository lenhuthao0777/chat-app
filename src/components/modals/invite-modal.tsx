'use client';
import React, { FC, Fragment, useState } from 'react';
import { Check, Copy, RefreshCw } from 'lucide-react';

// Components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { ModalStore, onClose, onOpen } from '@/stores/features/Modal';
import { RootState } from '@/stores/store';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import UseOrigin from '@/hooks/use-origin';
import { cn } from '@/lib/utils';
import { useServerUpdateMutation } from '@/stores/RtkQuery/Server';

const InviteModal: FC = () => {
  const modalState: ModalStore | any = useAppSelector(
    (state: RootState) => state.ModalFeature
  );

  const [copied, setCopied] = useState(false);

  const origin = UseOrigin();

  const dispatch = useAppDispatch();

  const isModalOpen = modalState?.isOpen && modalState?.type === 'invite';

  const inviteUrl = `${origin}/invite/${modalState?.data?.inviteCode}`;

  const [serverUpdate, { isLoading }] = useServerUpdateMutation();

  const onCopy = () => {
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNew = async () => {
    try {
      const res: any = await serverUpdate({ id: modalState?.data?.id });

      await dispatch(onOpen({ type: 'invite', data: res?.data?.data }));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Fragment>
      <Dialog open={isModalOpen} onOpenChange={() => dispatch(onClose())}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>
              Invite friends
            </DialogTitle>
          </DialogHeader>
          <div className='p-6'>
            <Label className='text-xs uppercase  font-bold text-zinc-500 dark:text-secondary/70'>
              Server invite link
            </Label>
            <div className='flex items-center mt-2 gap-x-2'>
              <Input
                className='bg-zinc-300/50 border-0 text-black focus-visible:ring-0 focus-visible:ring-offset-0'
                value={inviteUrl}
                onChange={() => {}}
                disabled={isLoading}
                type='text'
                name='link'
              />

              <Button size='icon' onClick={onCopy}>
                {copied ? (
                  <Check className='h-4 w-4' />
                ) : (
                  <Copy className='w-4 h-4' />
                )}
              </Button>
            </div>
            <Button
              variant='link'
              size='sm'
              className='text-xs text-zinc-500 mt-4'
              onClick={onNew}
            >
              Generate a new link
              <RefreshCw
                className={cn('w-4 h-4 ml-2', isLoading && 'animate-spin')}
              />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default InviteModal;
