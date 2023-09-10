import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    const { name, type, serverId } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
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
          create: {
            profileId: profile.id,
            name,
            type,
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: server,
      message: 'Created',
    });
  } catch (error) {
    console.log('channel api', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
};

export const PUT = async (req: Request) => {
  try {
    const { name, type, channelId, serverId } = await req.json();
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (name === ' general') {
      return new NextResponse('Name cannot be general', { status: 400 });
    }
    const server = await db.server.update({
      where: {
        id: serverId,
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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name,
              type,
            },
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: server,
      message: 'Edited',
    });
  } catch (error) {
    console.log('channel api', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
};
