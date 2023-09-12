import { currentProfilePage } from '@/lib/current-profile-page';
import { db } from '@/lib/db';
import { NextApiResponseServerIo } from '@/types/type';
import { NextApiRequest } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await currentProfilePage(req);
    const { content, fileUrl, serverId, channelId } = req.body;

    if (!profile) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!content || !channelId || !serverId) {
      return res.status(400).json({ message: 'Value can not messing' });
    }
    const server = await db.server.findFirst({
      where: {
        id: serverId,
        Member: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        Member: true,
      },
    });

    if (!server) {
      return res.status(404).json({ message: 'Server not found' });
    }

    const channel = await db.channel.findFirst({
      where: {
        id: channelId,
        serverId: serverId,
      },
    });

    if (!channel) {
      return res.status(404).json({ message: 'Channel not found' });
    }

    const member = server.Member.find((mem) => mem.profileId === profile.id);

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const message = await db.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(201).json(message);
  } catch (error) {
    console.log('errors', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
