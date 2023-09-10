import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PUT = async (req: Request) => {
  try {
    const { serverId } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: {
          not: profile.id,
        },
        Member: {
          some: {
            profileId: profile.id,
          },
        },
      },
      data: {
        Member: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: server,
      message: 'Leaved server',
    });
  } catch (error) {
    console.log('server leave api', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
};
