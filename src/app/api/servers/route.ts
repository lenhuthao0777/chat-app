import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { MemberRole } from '@prisma/client';
import { NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { v4 as uuid } from 'uuid';

export const POST = async (req: Request, res: NextApiResponse) => {
  try {
    const { name, imageUrl } = await req.json();

    const profile = await currentProfile();

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const res = await db.server.create({
      data: {
        name,
        imageUrl,
        profileId: profile.id,
        inviteCode: uuid(),
        Channel: {
          create: {
            name: 'general',
            profileId: profile.id,
          },
        },
        Member: {
          create: {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        },
      },
    });

    return NextResponse.json({
      status: 201,
      message: 'Created',
    });
  } catch (error) {
    return new NextResponse('Internal Error', { status: 500 });
  }
};

