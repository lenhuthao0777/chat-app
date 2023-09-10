import InitialModal from '@/components/modals/initial-modal';
import Header from '@/components/pages/home/header';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { Profile } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function Page() {
  // const profile: Profile = await initialProfile();

  // const server = await db.server.findFirst({
  //   where: {
  //     Member: {
  //       some: {
  //         profileId: profile?.id,
  //       },
  //     },
  //   },
  // });

  // if (server) return redirect(`/servers/${server.id}`);

  return (
    <div>
      <div className='hidden md:flex flex-col h-full w-60 z-20 inset-y-0 fixed top-0'>
        <div className='flex flex-col h-full w-full text-primary dark:bg-[#2b2d31] bg-[#f2f3f5]'>
          <Header />
        </div>
      </div>
      {/* <InitialModal
        title='Custom your server'
        description='Give your server a personality with a name and an image. You can
        alway change it later'
      /> */}
    </div>
  );
}
