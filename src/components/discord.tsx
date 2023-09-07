'use client';
import { Cat } from 'lucide-react';

import ActionTooltip from './action-tooltip';

const DiscordButton = () => {
  return (
    <ActionTooltip label='Direct Message' align='center' side='right'>
      <button className='group'>
        <div className='flex items-center justify-center border border-gray-200 dark:border-0 mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
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
