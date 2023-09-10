'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch } from '@/stores/app';
import { onOpen } from '@/stores/features/Modal';
import { MemberRole, Server } from '@prisma/client';
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react';
import { FC, useEffect, useState } from 'react';

interface ServerHeaderProps {
  server: Server;
  role?: MemberRole;
}
const ServerHeader: FC<ServerHeaderProps> = ({ server, role }) => {
  const [isMounted, setIsMounted] = useState<boolean>(false);

  const isAdmin = role === MemberRole.ADMIN;

  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const dispatch = useAppDispatch();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className='focus:outline-none'>
          <button className='w-full line-clamp-1 text-md font-semibold px-3 flex items-center h-12 border-neutral-200 dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50'>
            {server.name}
            <ChevronDown className='h-5 w-5 ml-auto hidden md:block' />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56 text-xs font-medium text-black dark:text-neutral-400 space-y-1'>
          {isModerator && (
            <DropdownMenuItem
              onClick={() => dispatch(onOpen({ type: 'invite', data: server }))}
              className='text-indigo-600 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer'
            >
              Invite people
              <UserPlus className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
          )}

          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  dispatch(
                    onOpen({
                      type: 'editServer',
                      data: server,
                    })
                  )
                }
                className='px-3 py-2 text-sm cursor-pointer'
              >
                Server Settings
                <Settings className='w-4 h-4 ml-auto' />
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  dispatch(onOpen({ type: 'memberManage', data: server }))
                }
                className='px-3 py-2 text-sm cursor-pointer'
              >
                Manages Members
                <Users className='w-4 h-4 ml-auto' />
              </DropdownMenuItem>
            </>
          )}

          {isModerator && (
            <DropdownMenuItem
              onClick={() =>
                dispatch(onOpen({ type: 'createChannel', data: server }))
              }
              className='px-3 py-2 text-sm cursor-pointer'
            >
              Create Channel
              <PlusCircle className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
          )}

          {isModerator && <DropdownMenuSeparator />}

          {isAdmin && (
            <DropdownMenuItem
              onClick={() =>
                dispatch(onOpen({ type: 'deleteServer', data: server }))
              }
              className='px-3 py-2 text-sm cursor-pointer text-rose-500'
            >
              Delete Server
              <Trash className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
          )}

          {!isAdmin && (
            <DropdownMenuItem
              onClick={() =>
                dispatch(onOpen({ type: 'leaveServer', data: server }))
              }
              className='px-3 py-2 text-sm cursor-pointer text-rose-500'
            >
              Leave Server
              <LogOut className='w-4 h-4 ml-auto' />
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default ServerHeader;
