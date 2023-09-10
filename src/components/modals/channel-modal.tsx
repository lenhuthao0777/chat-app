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
import { ChannelType } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useCreateChannelMutation,
  useEditChannelMutation,
} from '@/stores/RtkQuery/Channel';
import { CONTENT } from '@/enums/enums';

const ChannelModal: FC = () => {
  const modalState: ModalStore | unknown | any = useAppSelector(
    (state: RootState) => state.ModalFeature
  );

  const [isLoading, setIsLoading] = useState(false);

  const modalAction = ['editChannel', 'createChannel'];

  const isModalOpen =
    modalState?.isOpen && modalAction.includes(modalState?.type);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const formSchema = z.object({
    name: z
      .string()
      .min(1, { message: 'Channel name is required!' })
      .refine((name) => name !== 'general', {
        message: "Channel name can not be 'general'",
      }),
    type: z.nativeEnum(ChannelType),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: modalState?.channel || 'TEXT',
    },
  });

  const [createChannel] = useCreateChannelMutation();

  const [editChannel] = useEditChannelMutation();

  const onOk = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      if (modalState?.type === 'createChannel') {
        await createChannel({ ...values, serverId: modalState?.data?.id });
      } else {
        await editChannel({
          ...values,
          channelId: modalState?.channelData?.id,
          serverId: modalState?.data?.id,
        });
      }
    } catch (error) {
      return error;
    } finally {
      setIsLoading(false);
      form.reset();
      router.refresh();
      dispatch(onClose());
    }
  };

  const handleClose = () => {
    form.reset();
    dispatch(onClose());
  };

  useEffect(() => {
    if (modalState.channel) {
      form.setValue('type', modalState.channel);
    } else {
      form.setValue('type', ChannelType.TEXT);
    }

    if (modalState?.type === 'editChannel') {
      form.setValue('name', modalState.channelData.name);
    } else {
      form.setValue('name', '');
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
              {/* {CONTENT[modalState?.type as keyof typeof CONTENT]?.description} */}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onOk)} className='space-y-4'>
              <div className='flex flex-col space-y-1'>
                <FormLabel className='text-zinc-900/90 text-xs font-bold uppercase'>
                  Channel Name
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

              <div>
                <FormField
                  name='type'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Channel type</FormLabel>
                      <FormControl>
                        <Select
                          disabled={isLoading}
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className='bg-zinc-300/50 border-0 focus:ring-0 focus:ring-offset-0 ring-offset-0 text-black capitalize outline-none'>
                            <SelectValue placeholder='Select a channel type' />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(ChannelType).map((channel) => (
                              <SelectItem
                                key={channel}
                                value={channel}
                                className='capitalize'
                              >
                                {channel.toUpperCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
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

export default ChannelModal;
