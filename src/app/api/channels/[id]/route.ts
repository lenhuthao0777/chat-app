import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { serverId, name } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (name === 'general') {
      return new NextResponse('Name cannot be general', { status: 400 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
        Member: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.id,
            name: {
              not: 'general',
            },
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: server,
      message: 'Deleted',
    });
  } catch (error) {
    console.log('channel api', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
};
