import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { DirectMessage, Message } from '@prisma/client';
import { NextResponse } from 'next/server';

const limit = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get('cursor');

    const conversationId = searchParams.get('conversationId');

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!conversationId) {
      return new NextResponse('Conversation ID missing', { status: 400 });
    }

    let messages: DirectMessage[] = [];

    if (cursor) {
      messages = await db.directMessage.findMany({
        take: limit,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
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
      messages = await db.directMessage.findMany({
        take: limit,
        where: {
          conversationId,
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

    // return NextResponse.json({
    //   items: [],
    //   nextCursor: null,
    // });
  } catch (error) {
    console.log('[DIRECT_MESSAGES_GET]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
