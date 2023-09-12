import ChatHeader from '@/components/pages/channel/chat-header';
import ChatInput from '@/components/pages/chat/chat-input';
import ChatMessage from '@/components/pages/chat/chat-message';
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
    include: {
      profile: true,
    },
  });

  if (!channel || !member) {
    redirect('/');
  }

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
      <ChatHeader serverId={id} type='channel' name={channel?.name} />

      <ChatMessage
        member={member}
        name={channel.name}
        chatId={channel.id}
        type='channel'
        apiUrl='messages'
        socketUrl='/api/socket/messages'
        socketQuery={{
          channelId,
          serverId: channel?.serverId,
        }}
        paramKey='channelId'
        paramValue={channel.id}
      />

      <ChatInput
        name={channel.name}
        type='channel'
        apiUrl='/socket/messages'
        query={{
          channelId: channel?.id,
          serverId: id,
        }}
      />
    </div>
  );
};

export default Page;
