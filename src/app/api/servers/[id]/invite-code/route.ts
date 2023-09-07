import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
  res: Response
) => {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse('Unauthorized', { status: 401 });

    if (!params.id)
      return new NextResponse('Server id missing', { status: 400 });

    const server = await db.server.update({
      where: {
        id: params.id,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuid(),
      },
    });

    return NextResponse.json({
      status: 200,
      data: server,
      message: 'Update success!',
    });
  } catch (error) {
    return new NextResponse('Internal server error', { status: 500 });
  }
};
