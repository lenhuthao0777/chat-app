import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const limit = 10;

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);

    const profile = await currentProfile();

    const cursor = searchParams.get('cursor');

    const channelId = searchParams.get('channelId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!channelId) return new NextResponse('Missing channel id');

    let messages: Message[] = [];

    if (cursor) {
      messages = await db.message.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createAt: 'desc',
        },
      });
    } else {
      messages = await db.message.findMany({
        take: limit,
        where: {
          channelId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createAt: 'desc',
        },
      });
    }

    let nextCursor = null;

    if (messages.length === limit) {
      nextCursor = messages[limit - 1].id;
    }

    return NextResponse.json({
      items: messages,
      nextCursor,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse('Internal error', { status: 500 });
  }
};
