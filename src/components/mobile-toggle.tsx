import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import Sidebar from '@/components/sidebar';
import ServerSidebar from '@/components/pages/server/server-sidebar';

const MobileToggle = ({ serverId }: { serverId: string }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className='md:hidden' variant='ghost' size='icon'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side='left' className='p-0 flex gap-0'>
        <div className='w-[72px]'>
          <Sidebar />
        </div>
        <ServerSidebar id={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
