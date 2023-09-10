'use client';
import ActionTooltip from '@/components/action-tooltip';
import { useAppDispatch, useAppSelector } from '@/stores/app';
import { onOpen } from '@/stores/features/Modal';
import { ServerWithMembersWithProfiles } from '@/types/type';
import { Channel, ChannelType, MemberRole, Server } from '@prisma/client';
import { Plus, Settings } from 'lucide-react';
import { FC } from 'react';

interface ServerSectionProps {
  label: string;
  role?: MemberRole;
  sectionType: 'channels' | 'members';
  channelType?: ChannelType;
  server?: Server;
}
const ServerSection: FC<ServerSectionProps> = ({
  label,
  role,
  server,
  sectionType,
  channelType,
}) => {
  const modalState = useAppSelector((state) => state.ModalFeature);

  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center justify-between px-2 mb-2'>
      <p className='text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400'>
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label='Create Channel' side='top'>
          <button
            onClick={() =>
              dispatch(
                onOpen({
                  type: 'createChannel',
                  data: server,
                  channel: channelType,
                })
              )
            }
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Plus className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}

      {role == MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label='Manage members' side='top'>
          <button
            onClick={() =>
              dispatch(onOpen({ type: 'memberManage', data: server }))
            }
            className='text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition'
          >
            <Settings className='h-4 w-4' />
          </button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
