import InitialModal from '@/components/modals/initial-modal';
import { db } from '@/lib/db';
import { initialProfile } from '@/lib/initial-profile';
import { Profile } from '@prisma/client';
import { redirect } from 'next/navigation';

export default async function Page() {
  const profile: Profile = await initialProfile();

  const server = await db.server.findFirst({
    where: {
      Member: {
        some: {
          profileId: profile?.id,
        },
      },
    },
  });

  if (server) {
    return redirect(`/servers/${server.id}`);
  }

  return (
    <div>
      <InitialModal
        title='Custom your server'
        open
        description='Give your server a personality with a name and an image. You can
        alway change it later'
      />
    </div>
  );
}
