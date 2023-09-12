'use client';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useCreateMessageMutation } from '@/stores/RtkQuery/Message';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { onOpen } from '@/stores/features/Modal';
import EmojiPicker from '@/components/emoji-picker';
import { useRouter } from 'next/navigation';

interface ChatInputProps {
  name: string;
  type: 'channel' | 'conversation';
  apiUrl: string;
  query: any;
}
const ChatInput: FC<ChatInputProps> = ({ name, type, apiUrl, query }) => {
  const modalState: any = useAppSelector((state) => state.ModalFeature);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const formSchema = z.object({
    content: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  });

  const isLoading = form.formState.isLoading;

  const [createMessage] = useCreateMessageMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const payload = {
        content: values?.content,
        fileUrl: '',
        ...query,
        url: apiUrl,
      };

      await createMessage(payload);
    } catch (error) {
      return error;
    } finally {
      form.reset();
      router.refresh();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form?.control}
          name='content'
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className='relative p-4 pb-6'>
                  <button
                    onClick={() =>
                      dispatch(
                        onOpen({
                          type: 'messageFile',
                          query: { ...query, url: apiUrl },
                        })
                      )
                    }
                    type='button'
                    className='absolute top-7 left-8 h-6 w-6 bg-zinc-500 dark:bg-zinc-400 hover:bg-zinc-600 dark:hover:bg-zinc-300 transition rounded-full p-1 flex items-center justify-center'
                  >
                    <Plus className='text-white dark:text-[#313338] w-4 h-4' />
                  </button>
                  <Input
                    disabled={isLoading}
                    placeholder={`Message ${
                      type === 'conversation' ? name : '#' + name
                    }`}
                    className='px-14 py-6 bg-zinc-200/90 dark:bg-zinc-700/75 border-none focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                    {...field}
                  />
                  <div className='absolute top-7 right-8'>
                    <EmojiPicker
                      onChange={(emoji: string) =>
                        field.onChange(`${field.value} ${emoji}`)
                      }
                    />
                  </div>
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default ChatInput;
