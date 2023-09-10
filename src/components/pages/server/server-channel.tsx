'use client';
import ActionTooltip from '@/components/action-tooltip';
import { cn } from '@/lib/utils';
import { useAppDispatch } from '@/stores/app';
import { onOpen } from '@/stores/features/Modal';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC } from 'react';

interface ServerChannelProps {
  channel: Channel;
  server: Server;
  role?: MemberRole;
}

const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.AUDIO]: Mic,
  [ChannelType.VIDEO]: Video,
};
const ServerChannel: FC<ServerChannelProps> = ({ channel, server, role }) => {
  const router = useRouter();

  const params = useParams();

  const dispatch = useAppDispatch();

  const Icon = iconMap[channel.type];

  const handelMoveChannel = () => {
    router.push(`/servers/${params.id}/${channel.id}`);
  };

  return (
    <div>
      <button
        onClick={handelMoveChannel}
        className={cn(
          'group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition mb-1',
          params?.id === channel.id && 'bg-zinc-700/20 dark:bg-zinc-700'
        )}
      >
        <Icon className='flex-shrink-0 w-5 h-5 text-zinc-500' />
        <p
          className={cn(
            'line-clamp-1 font-semibold text-sm text-zinc-500 group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300 transition',
            params.id === channel.id &&
              'text-primary dark:text-zinc-200 dark:group-hover:text-white'
          )}
        >
          {channel.name}
        </p>
        {channel.name !== 'general' && role !== MemberRole.GUEST && (
          <div className='ml-auto flex items-center gap-x-2'>
            <ActionTooltip label='Edit'>
              <Edit
                onClick={() =>
                  dispatch(
                    onOpen({
                      type: 'editChannel',
                      channel: channel?.type,
                      channelData: channel,
                      data: server,
                    })
                  )
                }
                className='h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
              />
            </ActionTooltip>

            <ActionTooltip label='Delete'>
              <Trash
                onClick={() =>
                  dispatch(
                    onOpen({
                      type: 'deleteChannel',
                      channelData: channel,
                      data: server,
                    })
                  )
                }
                className='h-4 w-4 hidden group-hover:block text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === 'general' && (
          <Lock className='ml-auto w-4 h-4 text-zinc-500' />
        )}
      </button>
    </div>
  );
};

export default ServerChannel;
