'use client';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Components
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import FileUploader from '@/components/file-upload';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { onClose } from '@/stores/features/Modal';
import { useCreateMessageMutation } from '@/stores/RtkQuery/Message';

type MessageModal = {};

const MessageModal: FC<MessageModal> = () => {
  const modalState: any = useAppSelector((state) => state.ModalFeature);

  const dispatch = useAppDispatch();

  const [isMounted, setIsMounted] = useState<boolean>(false);

  const router = useRouter();

  const isModalOpen = modalState?.isOpen && modalState?.type === 'messageFile';

  const formSchema = z.object({
    fileUrl: z.string().min(1, { message: 'File name is required!' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [createMessageFile, {isLoading}] = useCreateMessageMutation();

  const onOk = async (values: z.infer<typeof formSchema>) => {
    try {
      await createMessageFile({
        serverId: modalState?.query?.serverId,
        channelId: modalState?.query?.channelId,
        fileUrl: values?.fileUrl,
        content: values?.fileUrl,
        url: modalState?.query?.url,
      });
    } catch (error) {
      return error;
    } finally {
      form.reset();
      router.refresh();
      dispatch(onClose());
    }
  };

  const handleClose = () => {
    dispatch(onClose());
    form.reset();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Fragment>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>
              Add an attachment
            </DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              Send a file as a message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onOk)} className='space-y-4'>
              <div>
                <FormField
                  control={form.control}
                  name='fileUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-zinc-900/90 text-xs font-bold uppercase'>
                        Upload File
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          endpoint='messageFile'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                disabled={isLoading}
                variant='primary'
                className='w-full'
                type='submit'
              >
                Send
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default MessageModal;
