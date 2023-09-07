import { Member, Server, Profile } from '@prisma/client';

export type ServerWithMembersWithProfiles = Server & {
  Member: Member & { profile: Profile }[];
};
