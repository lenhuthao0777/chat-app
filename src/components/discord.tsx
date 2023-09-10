'use client';
import { Cat } from 'lucide-react';

import ActionTooltip from './action-tooltip';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';

const DiscordButton = () => {
  const path = usePathname();

  const router = useRouter();

  return (
    <ActionTooltip label='Direct Message' align='center' side='right'>
      <button
        className='group relative flex items-center'
        onClick={() => router.push('/')}
      >
        <div
          className={cn(
            `absolute left-0 bg-primary rounded-r-full transition-all w-1`,
            path !== '/' && `group-hover:h-5`,
            path === '/' ? `h-9` : 'h-2'
          )}
        />
        <div
          className={cn(
            'flex items-center justify-center border border-gray-200 dark:border-0 mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500',
            path === '/' && 'bg-primary/10 text-primary rounded-2xl'
          )}
        >
          <Cat
            className=' group-hover:text-white transition text-emerald-500'
            size={25}
          />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default DiscordButton;
