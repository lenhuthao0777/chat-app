import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
  res: Response
) => {
  try {
    const { role, serverId } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const resData = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        Member: {
          update: {
            where: {
              id: params.id,
              profileId: {
                not: profile.id,
              },
            },
            data: {
              role,
            },
          },
        },
      },
      include: {
        Member: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: resData,
      message: 'Updated',
    });
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { serverId } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        Member: {
          delete: {
            id: params.id,
            profileId: { not: profile.id },
          },
        },
      },
      include: {
        Member: {
          include: {
            profile: true,
          },
          orderBy: {
            role: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      status: 200,
      data: server,
      message: 'Remove member',
    });
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
};
