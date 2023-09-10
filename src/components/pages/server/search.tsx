'use client';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Search } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { FC, Fragment, ReactNode, useEffect, useState } from 'react';

interface SearchProps {
  data: {
    label: string;
    type: 'channel' | 'member';
    data:
      | {
          icon: ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
}
const SearchServer: FC<SearchProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener('keydown', down);

    return () => document.removeEventListener('keydown', down);
  }, []);

  const onClick = (id: string, type: 'channel' | 'member') => {
    setOpen(false);

    if (type === 'member') {
      return router.push(`/servers/${params?.id}/conversations/${id}`);
    }

    if (type === 'channel') {
      return router.push(`/servers/${params?.id}/channels/${id}`);
    }
  };

  return (
    <Fragment>
      <button
        onClick={() => setOpen(true)}
        className='group px-2 py-2 rounded-md flex items-center gap-x-2 w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 transition'
      >
        <Search className='h-4 w-4 text-zinc-500 dark:text-zinc-400' />
        <p className='font-semibold text-sm text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition'>
          search
        </p>
        <kbd className='border pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded bg-muted px-1.5 font-mono text-xs font-medium text-muted-foreground ml-auto'>
          <span>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder='Search all channels and member' />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {data.map(({ label, type, data }) => {
            if (!data) return null;
            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem key={id} onSelect={() => onClick(id, type)}>
                    {icon}
                    <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </Fragment>
  );
};

export default SearchServer;
