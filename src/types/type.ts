import { NextApiResponse } from 'next';
import { Member, Server, Profile } from '@prisma/client';
import { Server as NetServer, Socket } from 'net';
import { Server as SocketIOServer } from 'socket.io';

export type ServerWithMembersWithProfiles = Server & {
  Member: Member & { profile: Profile }[];
};

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
};
