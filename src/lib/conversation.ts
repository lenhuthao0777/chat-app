import { db } from './db';

const findConversation = async (memberOneId: string, memberTwoId: string) => {
  const result = await db.conversation.findFirst({
    where: {
      AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
    },
    include: {
      memberOne: {
        include: {
          profile: true,
        },
      },
      memberTwo: {
        include: {
          profile: true,
        },
      },
    },
  });

  if (result) {
    return result;
  }
  return null;
};

const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  try {
    const res = await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    return res;
  } catch (error) {
    return null;
  }
};

const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let conversation =
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberOneId, memberTwoId));

  if (!conversation) {
    conversation = await createNewConversation(memberOneId, memberTwoId);
  }
  return conversation;
};

export { findConversation, createNewConversation, getOrCreateConversation };
