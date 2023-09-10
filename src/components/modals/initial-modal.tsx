'use client';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { X } from 'lucide-react';
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
import { InputCustom } from '@/components/ui/InputCustom';
import FileUploader from '@/components/file-upload';
import { useServerCreateMutation } from '@/stores/RtkQuery/Server';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';

type ModalProps = {
  open?: boolean;
  title: string;
  description: string;
  isLoading?: boolean;
  children?: React.ReactNode;
};

const InitialModal: FC<ModalProps> = ({ open = true, title, description }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const [isMounted, setIsMounted] = useState<boolean>(false);

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

  const [serverCreate, { isLoading }] = useServerCreateMutation();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onOk = async (values: z.infer<typeof formSchema>) => {
    await serverCreate(values);
    await form.reset();
    await router.refresh();
    await window.location.reload();
  };

  if (!isMounted) {
    return null;
  }

  return (
    <Fragment>
      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className='bg-white text-black overflow-hidden'>
          <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-bold'>
              {title}
            </DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
              {description}
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

              <Button
                disabled={isLoading}
                variant='primary'
                className='w-full'
                type='submit'
              >
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};

export default InitialModal;
