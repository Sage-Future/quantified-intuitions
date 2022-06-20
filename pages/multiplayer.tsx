import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

import { Navbar } from "../components/Navbar";
import { Prisma } from "../lib/prisma";

type MultiplayerProps = {
  session: Session;
};

export const getServerSideProps: GetServerSideProps<
  MultiplayerProps | {}
> = async (ctx) => {
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
      currentRoom: true,
    },
  });
  if (user !== null && user.currentRoom !== null) {
    ctx.res.writeHead(302, { Location: `/rooms/${user.currentRoom.id}` });
    ctx.res.end();
    return { props: {} };
  }

  return {
    props: {
      session,
    },
  };
};

const Multiplayer: NextPage<MultiplayerProps> = () => {
  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-0">
        <header>
          <h1>Multiplayer</h1>
        </header>
        <div className="flex flex-col">
          <div className="flex flex-col">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Create Room
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Multiplayer;
