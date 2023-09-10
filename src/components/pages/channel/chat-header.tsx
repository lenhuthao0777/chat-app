import MobileToggle from '@/components/mobile-toggle';
import UserAvatar from '@/components/user-avatar';
import { Hash } from 'lucide-react';
import { FC } from 'react';

interface ChatHeaderProps {
  serverId: string;
  name: string;
  type: 'channel' | 'conversation';
  imageUrl?: string;
}
const ChatHeader: FC<ChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}) => {
  return (
    <div className='text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2'>
      <MobileToggle serverId={serverId} />
      {type === 'channel' && (
        <Hash className='w-4 h-4 text-zinc-500 dark:text-zinc-400 mr-2' />
      )}
      {type === 'conversation' && (
        <UserAvatar className='w-8 h-8 md:h-8 md:w-8 mr-2' src={imageUrl} />
      )}
      <p className='font-semibold text-md text-black dark:text-white'>{name}</p>
    </div>
  );
};

export default ChatHeader;
