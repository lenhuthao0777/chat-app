'use client';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

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
import { InputCustom } from '@/components/ui/InputCustom';
import FileUploader from '@/components/file-upload';
import {
  useServerCreateMutation,
  useServerUpdateByIdMutation,
} from '@/stores/RtkQuery/Server';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { ModalStore, onClose } from '@/stores/features/Modal';
import { RootState } from '@/stores/store';
import { Input } from '../ui/input';
import { CONTENT } from '@/enums/enums';

const ServerModal: FC = () => {
  const modalState: ModalStore | unknown | any = useAppSelector(
    (state: RootState) => state.ModalFeature
  );

  const modalType = ['createServer', 'editServer'];

  const [isLoading, setIsLoading] = useState(false);

  const isModalOpen =
    modalState?.isOpen && modalType.includes(modalState?.type);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const formSchema = z.object({
    name: z.string().min(1, { message: 'Server name is required!' }),
    imageUrl: z.string().min(1, { message: 'Server image is required!' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      imageUrl: '',
    },
  });

  const [serverCreate] = useServerCreateMutation();

  const [serverUpdateById] = useServerUpdateByIdMutation();

  const onOk = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (modalState.type === 'createServer') {
        await serverCreate(values);
      } else {
        await serverUpdateById({ ...values, id: modalState.data.id });
      }
      await form.reset();
      await router.refresh();
      await dispatch(onClose());
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.reset();
    dispatch(onClose());
  };

  useEffect(() => {
    if (modalState.type === 'editServer') {
      form.setValue('name', modalState.data.name);
      form.setValue('imageUrl', modalState.data.imageUrl);
    }
  }, [modalState, form]);

  return (
    <Fragment>
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>
              {CONTENT[modalState?.type as keyof typeof CONTENT]?.title}
            </DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              {CONTENT[modalState?.type as keyof typeof CONTENT]?.description}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onOk)} className='space-y-4'>
              <div>
                <FormField
                  control={form.control}
                  name='imageUrl'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-zinc-900/90 text-xs font-bold uppercase'>
                        Upload File
                      </FormLabel>
                      <FormControl>
                        <FileUploader
                          endpoint='serverImage'
                          value={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='flex flex-col space-y-1'>
                <FormLabel className='text-zinc-900/90 text-xs font-bold uppercase'>
                  Server Name
                </FormLabel>

                <InputCustom
                  className='bg-gray-300/50 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-black'
                  label='Server Name'
                  placeholder='Enter server name'
                  name='name'
                  isLoading={isLoading}
                  form={form}
                />
              </div>

              <DialogFooter className='bg-gray-100'>
                <Button
                  disabled={isLoading}
                  variant='primary'
                  className='w-full'
                  type='submit'
                >
                  Submit
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default ServerModal;
