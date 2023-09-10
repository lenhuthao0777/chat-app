import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole, Server } from '@prisma/client';
import { redirect } from 'next/navigation';
import React, { FC } from 'react';
import ServerHeader from './server-header';
import SearchServer from './search';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Hash, Mic, ShieldAlert, ShieldCheck, User, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import ServerSection from './server-section';
import ServerChannel from './server-channel';
import { ServerWithMembersWithProfiles } from '@/types/type';
import ServerMember from './server-member';

interface ServerSidebarProps {
  id: string;
}

const iconMap = {
  [ChannelType.TEXT]: <Hash className='mr-2 h-4 w-4' />,
  [ChannelType.AUDIO]: <Mic className='mr-2 h-4 w-4' />,
  [ChannelType.VIDEO]: <Video className='mr-2 h-4 w-4' />,
};

const roleIconMap = {
  [MemberRole.ADMIN]: <ShieldAlert className='mr-2 w-4 h-4' />,
  [MemberRole.MODERATOR]: <ShieldCheck className='mr-2 w-4 h-4' />,
  [MemberRole.GUEST]: null,
};

const ServerSidebar: FC<ServerSidebarProps> = async ({ id }) => {
  const profile = await currentProfile();

  if (!profile) return redirect('/');

  const server = await db.server.findUnique({
    where: { id },
    include: {
      channels: {
        orderBy: {
          createAt: 'asc',
        },
      },
      Member: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  });

  if (!server) return redirect('/');

  const textChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const member = server?.Member.filter((mem) => mem.profileId !== profile.id);

  const role = server.Member.find((mem) => mem.profileId === profile.id)?.role;

  return (
    <div className='flex flex-col h-full w-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />
      <ScrollArea className='flex-1 px-3'>
        <div className='my-2'>
          <SearchServer
            data={[
              {
                label: 'Text Channels',
                type: 'channel',
                data: textChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Voice Channels',
                type: 'channel',
                data: audioChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Video Channels',
                type: 'channel',
                data: videoChannels?.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: 'Members',
                type: 'member',
                data: member?.map((mem) => ({
                  id: mem.id,
                  name: mem.profile.name,
                  icon: roleIconMap[mem.role],
                })),
              },
            ]}
          />
        </div>
        <Separator className='bg-zinc-200 dark:bg-zinc-700 rounded-md my-2' />
        {!!textChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.TEXT}
              role={role}
              server={server}
              label='Text channels'
            />
            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}

        {!!audioChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.AUDIO}
              role={role}
              server={server}
              label='Audio channels'
            />
            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}

        {!!videoChannels?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='channels'
              channelType={ChannelType.VIDEO}
              role={role}
              server={server}
              label='Video channels'
            />
            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={role}
                server={server}
              />
            ))}
          </div>
        )}

        {!!member?.length && (
          <div className='mb-2'>
            <ServerSection
              sectionType='members'
              role={role}
              server={server}
              label='Members'
            />
            {member.map((mem) => (
              <ServerMember key={mem.id} server={server} member={mem} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;
