import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { Comment, Pastcast, Question, Room, User } from "@prisma/client";

import { Prisma } from "../../lib/prisma";

export type RoomProps = {
  room: Room & {
    members: User[];
    questions: (Question & {
      comments: Comment[];
    })[];
    pastcasts: Pastcast[];
    currentQuestion: Question | null;
  };
  session: Session;
};

export const getServerSideProps: GetServerSideProps<RoomProps | {}> = async (
  ctx
) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const roomId = ctx.query.roomId as string;
  const room = await Prisma.room.findUnique({
    where: { id: roomId },
    include: {
      members: true,
      questions: {
        include: {
          comments: true,
        },
      },
      pastcasts: true,
      currentQuestion: true,
    },
  });
  return {
    props: {
      session,
      room,
    },
  };
};

const RoomPage: NextPage<RoomProps> = ({ room }) => {
  if (room !== null) {
    // TODO:
    //ask user if they want to leave oldRoom and join room
    //if yes, change user.currentRoom to room
    //if no, redirect to oldRoom
  }

  return <></>;
};
export default RoomPage;
