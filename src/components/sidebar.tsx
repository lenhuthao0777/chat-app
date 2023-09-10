import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';
import React from 'react';
import Action from './action';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import { Server } from '@prisma/client';
import NavItem from './navItem';
import { ModeToggle } from './mode-toggle';
import { UserButton } from '@clerk/nextjs';
import DiscordButton from './discord';

const Sidebar = async () => {
  const profile = await currentProfile();

  if (!profile) return redirect('/');

  const servers: Array<any> = await db.server.findMany({
    where: {
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: true,
    },
  });

  return (
    <div className='space-y-4 flex flex-col items-center h-full w-full text-primary dark:bg-[#1e1f22] bg-[#e3e5e8] py-4 shadow'>
      <DiscordButton />
      <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
      <ScrollArea className='flex-1 w-full'>
        <div className='space-y-2'>
          {servers.map((server) => (
            <div key={server.id}>
              <NavItem
                id={server.id}
                name={server.name}
                imageUrl={server.imageUrl}
                channel={server?.channels}
              />
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className='pb-3 mt-auto flex items-center flex-col gap-y-4'>
        <Separator className='h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md w-10 mx-auto' />
        <Action />
        <ModeToggle />
        <UserButton
          afterSignOutUrl='/'
          appearance={{
            elements: {
              avatarBox: 'h-12 w-12',
            },
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
