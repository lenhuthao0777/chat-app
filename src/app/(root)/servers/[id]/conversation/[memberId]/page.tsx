import ChatHeader from '@/components/pages/channel/chat-header';
import ChatInput from '@/components/pages/chat/chat-input';
import ChatMessage from '@/components/pages/chat/chat-message';
import { getOrCreateConversation } from '@/lib/conversation';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { redirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import { FC } from 'react';

interface PageProps {
  params: { memberId: string; id: string };
}

const Page: FC<PageProps> = async ({ params: { memberId, id } }) => {
  const profile = await currentProfile();

  if (!profile) {
    redirectToSignIn();
  }

  const currMember = await db.member.findFirst({
    where: {
      serverId: id,
      profileId: profile?.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currMember) return redirect('/');

  const conversation = await getOrCreateConversation(currMember?.id, memberId);

  if (!conversation) return redirect('/');

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile?.id ? memberTwo : memberOne;

  return (
    <div className='bg-white dark:bg-[#313338] flex flex-col h-screen'>
      <ChatHeader
        imageUrl={otherMember?.profile?.imageUrl}
        name={otherMember.profile.name}
        serverId={id}
        type='conversation'
      />

      <ChatMessage
        member={currMember}
        name={otherMember.profile.name}
        chatId={conversation?.id}
        type='conversation'
        apiUrl='direct-messages'
        socketUrl='/api/socket/direct-messages'
        socketQuery={{
          conversationId: conversation?.id,
        }}
        paramKey='conversationId'
        paramValue={conversation.id}
      />

      <ChatInput
        name={otherMember.profile.name}
        type='conversation'
        apiUrl='/socket/direct-messages'
        query={{
          conversationId: conversation.id,
        }}
      />
    </div>
  );
};

export default Page;
