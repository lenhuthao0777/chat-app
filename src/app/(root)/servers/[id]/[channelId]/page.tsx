import ChatHeader from '@/components/pages/channel/chat-header';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';

interface PageProps {
  params: {
    id: string;
    channelId: string;
  };
}

const Page: FC<PageProps> = async ({ params: { channelId, id } }) => {
  const profile = await currentProfile();

  if (!profile) {
    redirectToSignIn();
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: id,
      profileId: profile?.id,
    },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-full'>
      <ChatHeader serverId={id} type='channel' name={channel?.name} />
    </div>
  );
};

export default Page;
