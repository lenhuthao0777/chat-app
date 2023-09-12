import { currentProfilePage } from '@/lib/current-profile-page';
import { db } from '@/lib/db';
import { NextApiResponseServerIo } from '@/types/type';
import { MemberRole } from '@prisma/client';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'DELETE' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const profile = await currentProfilePage(req);

    const { messageId, serverId, channelId } = req.query;

    const { content } = req.body;

    if (!profile) {
      return res.status(401).json({
        error: 'Unauthorized',
      });
    }

    const server = await db.server.findFirst({
      where: {
        id: serverId as string,
        Member: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: { Member: true },
    });

    if (!server) return res.status(404).json({ message: 'Server not found' });

    const channel = await db.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });

    if (!channel) return res.status(404).json({ message: 'Channel not found' });

    const member = server.Member.find((mem) => mem.profileId === profile.id);

    if (!member) return res.status(404).json({ message: 'Member not found' });

    let messages = await db.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!messages || messages.delete) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const isMessageOwner = messages.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'DELETE') {
      messages = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          fileUrl: null,
          content: 'This message has been deleted.',
          delete: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === 'PATCH') {
      if (!isMessageOwner) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      messages = await db.message.update({
        where: {
          id: messageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    const updateKey = `chat:${channelId}:messages:update`;

    res?.socket?.server?.io?.emit(updateKey, messages);

    return res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
