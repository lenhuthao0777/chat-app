import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
  res: Response
) => {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const res = await db.server.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json({
      status: 200,
      data: res,
      message: 'Updated',
    });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const res = await db.server.delete({
      where: {
        id: params.id,
        profileId: profile.id,
      },
    });

    return NextResponse.json({
      status: 200,
      data: res,
      message: 'Deleted',
    });
  } catch (error) {
    console.log('server id api', error);

    return new NextResponse('Internal Error', { status: 500 });
  }
};
