import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { Navbar } from "../components/Navbar";
import { prisma } from "../lib/prisma";
import { UserWithPastcasts } from "../types/additional";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const users = await prisma.user.findMany({
    include: {
      pastcasts: true,
    },
  });
  return {
    props: {
      session,
      users,
    },
  };
};

const Leaderboard = ({ users }: { users: UserWithPastcasts[] }) => {
  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    pastcasts: user.pastcasts.length,
    points: user.pastcasts.reduce((acc, curr) => acc + curr.score, 0),
  }));
  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-10">
        <main>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col">
              <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          {["Name", "Pastcasts", "Points"].map((header) => (
                            <th
                              key={header}
                              scope="col"
                              className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                            >
                              {header}
                            </th>
                          ))}
                          {/*
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                    <span className="sr-only">Edit</span>
                  </th>
                      */}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {formattedUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                              {user.name}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.pastcasts}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                              {user.points}
                            </td>
                            {/*
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                      <a
                        href="#"
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                        */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Leaderboard;
