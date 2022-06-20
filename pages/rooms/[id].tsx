import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { Room, User } from "@prisma/client";

import { Prisma } from "../../lib/prisma";

export type RoomProps = {
  room: Room & {
    members: User[];
  };
  oldRoom:
    | (Room & {
        members: User[];
      })
    | null;
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
  const user = await Prisma.user.findUnique({
    where: {
      id: session?.user?.id || "",
    },
    include: {
      currentRoom: {
        include: {
          members: true,
        },
      },
    },
  });
  if (user === null) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const { roomId: userRoomId } = user;
  const roomId = ctx.query.id?.toString() || "N/A";
  let pageRoom = null;
  if (userRoomId !== roomId) {
    pageRoom = await Prisma.room.findUnique({
      where: {
        id: roomId,
      },
      include: {
        members: true,
      },
    });
  } else {
    pageRoom = user.currentRoom;
  }

  return {
    props: {
      session,
      room: pageRoom,
      oldRoom: userRoomId !== roomId ? user.currentRoom : null,
    },
  };
};

const RoomPage: NextPage<RoomProps> = ({ room, oldRoom }) => {
  return <></>;
};
export default RoomPage;
