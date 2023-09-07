import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType } from '@prisma/client';
import { redirect } from 'next/navigation';
import React, { FC } from 'react';
import ServerHeader from './server-header';

interface ServerSidebarProps {
  id: string;
}

const ServerSidebar: FC<ServerSidebarProps> = async ({ id }) => {
  const profile = await currentProfile();

  if (!profile) return redirect('/');

  const server = await db.server.findUnique({
    where: { id },
    include: {
      Channel: {
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

  const textChannels = server?.Channel.filter(
    (channel) => channel.type === ChannelType.TEXT
  );

  const audioChannels = server?.Channel.filter(
    (channel) => channel.type === ChannelType.AUDIO
  );

  const videoChannels = server?.Channel.filter(
    (channel) => channel.type === ChannelType.VIDEO
  );

  const member = server?.Member.filter((mem) => mem.profileId !== profile.id);

  const role = server.Member.find((mem) => mem.profileId === profile.id)?.role;

  return (
    <div className='flex flex-col h-full w-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]'>
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSidebar;
