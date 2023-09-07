'use client';

import { FC } from 'react';
import ActionTooltip from './action-tooltip';
import { cn } from '@/lib/utils';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavItemProps {
  id: string;
  imageUrl: string;
  name: string;
}
const NavItem: FC<NavItemProps> = ({ id, imageUrl, name }) => {
  const param = useParams();

  const router = useRouter();

  const handleServer = () => {
    router.push(`/servers/${id}`);
  };

  return (
    <ActionTooltip side='right' align='center' label={name}>
      <button
        className='group relative flex items-center'
        onClick={handleServer}
      >
        <div
          className={cn(
            `absolute left-0 bg-primary rounded-r-full transition-all w-1`,
            param?.id !== id && `group-hover:h-5`,
            param?.id === id ? `h-9` : 'h-2'
          )}
        />
        <div
          className={cn(
            'relative group flex mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden',
            param?.id === id && 'bg-primary/10 text-primary rounded-2xl'
          )}
        >
          <Image fill src={imageUrl} alt='image' className='object-cover' />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavItem;
