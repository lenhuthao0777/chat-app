import ServerSidebar from '@/components/pages/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = async ({
  children,
  params: { id },
}: {
  children: ReactNode;
  params: { id: string };
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id,
      Member: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (!server) return redirect('/');

  return (
    <div className='h-full'>
      <div className='hidden md:flex flex-col h-full w-60 z-20 inset-y-0 fixed top-0'>
        <ServerSidebar id={id} />
      </div>
      <main className='h-full md:pl-60'>{children}</main>
    </div>
  );
};

export default Layout;
