import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";

import { PlusIcon } from "@heroicons/react/solid";
import { Room, User } from "@prisma/client";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Rooms } from "../components/Rooms";
import { Prisma } from "../lib/prisma";

type MultiplayerProps = {
  session: Session;
  rooms: (Room & {
    members: User[];
  })[];
};

export const getServerSideProps: GetServerSideProps<
  MultiplayerProps | {}
> = async (ctx) => {
  const session = await getSession(ctx);

  const rooms = await Prisma.room.findMany({
    include: {
      members: true,
    },
  });

  return {
    props: {
      session,
      rooms,
    },
  };
};

const Multiplayer: NextPage<MultiplayerProps> = ({ rooms }) => {
  const { data: session } = useSession();
  const openRooms = rooms.filter((room) => !room.isFinshed);
  const myRooms = openRooms.filter((room) =>
    room.members.some((member) => member.id === session?.user?.id)
  );
  const publicRooms = openRooms.filter(
    (room) => !room.members.some((member) => member.id === session?.user?.id)
  );
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <div className="py-10 grow bg-gray-100">
        <main>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            {myRooms.length > 0 && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-10">
                <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    My Active Games
                  </h3>
                </div>
                <Rooms rooms={myRooms} />
              </div>
            )}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                  <div className="ml-4 mt-2">
                    {publicRooms.length > 0 ? (
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Public Games
                      </h3>
                    ) : (
                      <>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          No Public Games
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Get started by creating a new game.
                        </p>
                      </>
                    )}
                  </div>
                  <div className="ml-4 mt-2 flex-shrink-0">
                    <Link href="/multiplayer/create" passHref>
                      <a
                        type="button"
                        className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        Create a new game
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
              <Rooms rooms={publicRooms} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default Multiplayer;
