'use client';
import ActionTooltip from '@/components/action-tooltip';
import UserAvatar from '@/components/user-avatar';
import { cn, formatTimeToNow } from '@/lib/utils';
import { Member, MemberRole, Profile } from '@prisma/client';
import { Edit, FileIcon, ShieldAlert, ShieldCheck, Trash } from 'lucide-react';
import Image from 'next/image';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import qs from 'query-string';
import { useAppDispatch } from '@/stores/app';
import { onOpen } from '@/stores/features/Modal';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

interface ChatItemProps {
  id: string;
  currentMember: any;
  member: Member & { profile: Profile };
  content: string;
  fileUrl: string | null;
  deleted: boolean;
  timestamp: string | Date;
  updated: string | Date;
  socketUrl: string | any;
  socketQuery: any;
}

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className='h-4 w-4 ml-2 text-indigo-500' />,
  ADMIN: <ShieldAlert className='h-4 w-4 ml-2 text-rose-500' />,
};

const ChatItem: FC<ChatItemProps> = ({
  id,
  currentMember,
  content,
  fileUrl,
  deleted,
  timestamp,
  member,
  updated,
  socketQuery,
  socketUrl,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const fileType = fileUrl?.split('.').pop();

  const dispatch = useAppDispatch();

  const router = useRouter();

  const params = useParams();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === 'pdf' && fileUrl;
  const isImage = !isPDF && fileUrl;

  const formSchema = z.object({
    content: z.string().min(1),
  });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keyDown', handleKeyDown);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });

      await axios.patch(url, values);

      form.reset();
      setIsEditing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleMemberClick = () => {
    if (member.id === currentMember.id) {
      return;
    }

    router.push(`/servers/${params?.id}/conversation/${member?.id}`);
  };

  return (
    <div className='relative group flex items-center hover:bg-black/5 p-4 transition w-full'>
      <div className='group flex items-start gap-x-2 w-full'>
        <div
          onClick={handleMemberClick}
          className='cursor-pointer hover:drop-shadow-md transition'
        >
          <UserAvatar src={member?.profile?.imageUrl} />
        </div>
        <div className='flex flex-col w-full'>
          <div className='flex items-center gap-x-2'>
            <div className='flex items-center'>
              <p className='text-sm font-semibold'>{member?.profile?.name}</p>
              <ActionTooltip label={member.role}>
                {roleIconMap[member?.role as keyof typeof roleIconMap]}
              </ActionTooltip>
            </div>
            <span className='text-xs text-zinc-500 dark:text-zinc-400'>
              {formatTimeToNow(new Date(timestamp))}
            </span>
          </div>
          {isImage && (
            <a
              href={fileUrl}
              target='_blank'
              rel='noopener'
              className='relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48'
            >
              <Image
                src={fileUrl}
                alt={content}
                fill
                className='object-cover'
              />
            </a>
          )}

          {isPDF && (
            <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10'>
              <FileIcon className='h-10 w-10 fill-indigo-200 stroke-indigo-400' />
              <a
                href={fileUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline'
              >
                PDF File
              </a>
            </div>
          )}

          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted &&
                  'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1'
              )}
            >
              {content}
              {updated && !deleted && (
                <span className='text-[10px] mx-2 text-zinc-500 dark:text-zinc-400'>
                  (edited)
                </span>
              )}
            </p>
          )}

          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className='flex items-center w-full gap-x-2 pt-2'
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name='content'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormControl>
                        <div className='relative w-full'>
                          <Input
                            disabled={isLoading}
                            className='p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200'
                            placeholder='Edited message'
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isLoading}
                  type='submit'
                  size='sm'
                  variant='primary'
                >
                  Save
                </Button>
              </form>
              <span className='text-[10px] mt-1 text-zinc-400'>
                Press escape to cancel, enter to save
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className='hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm'>
          {canEditMessage && (
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() => setIsEditing(true)}
                className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
              />
            </ActionTooltip>
          )}
          <ActionTooltip label='Delete'>
            <Trash
              onClick={() =>
                dispatch(
                  onOpen({
                    type: 'deleteMessage',
                    apiUrl: `${socketUrl}/${id}`,
                    query: socketQuery,
                  })
                )
              }
              className='cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition'
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  );
};

export default ChatItem;
