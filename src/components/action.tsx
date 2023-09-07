'use client';

import { Plus } from 'lucide-react';
import ActionTooltip from './action-tooltip';
import { Fragment } from 'react';
import { useAppDispatch } from '@/stores/app';
import { onOpen } from '@/stores/features/Modal';
import { CONTENT } from '@/enums/enums';

const Action = () => {
  const dispatch = useAppDispatch();

  const handleOpen = () => {
    dispatch(onOpen({ type: 'createServer' }));
  };

  return (
    <Fragment>
      <ActionTooltip label='Add a server' align='center' side='right'>
        <button className='group' onClick={handleOpen}>
          <div className='flex items-center justify-center border border-gray-200 dark:border-0 mx-3 h-12 w-12 rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden bg-background dark:bg-neutral-700 group-hover:bg-emerald-500'>
            <Plus
              className=' group-hover:text-white transition text-emerald-500'
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </Fragment>
  );
};

export default Action;
