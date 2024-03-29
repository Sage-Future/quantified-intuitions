import { GetStaticProps } from "next";
import { useEffect, useState } from "react";

import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";

import { Footer } from "../../components/Footer";
import { NavbarPastcasting } from "../../components/NavbarPastcasting";
import { Prisma } from "../../lib/prisma";
import { valueToString } from "../../lib/services/format";
import { HIDDEN_USERS } from "../../lib/services/magicNumbers";
import { UserWithPastcasts } from "../../types/additional";

export const getStaticProps: GetStaticProps = async (ctx) => {
  const users = await Prisma.user.findMany({
    where: {
      email: {
        notIn: HIDDEN_USERS,
      },
    },
    include: {
      pastcasts: true,
    },
  });

  return {
    props: {
      users,
    },
    revalidate: 10,
  };
};

const Leaderboard = ({ users }: { users: UserWithPastcasts[] }) => {
  const formattedUsers = users.map((user) => ({
    id: user.id,
    name: user.name || "Anonymous",
    pastcasts: user.pastcasts.reduce(
      (acc, pastcast) => acc + (pastcast.skipped === false ? 1 : 0),
      0
    ),
    points: user.pastcasts.reduce(
      (acc, curr) => acc + (curr.skipped ? 0 : curr.score),
      0
    ),
    skippedCorrectly: user.pastcasts.reduce(
      (acc, curr) => acc + (curr.skipped ? (curr.score > 0 ? 1 : 0) : 0),
      0
    ),
  }));
  const filteredUsers = formattedUsers.filter((user) => user.pastcasts > 0);
  const validSortsArray = ["Name", "Pastcasts", "Points", "Prior Knowledge"];
  const [sortType, setSortType] = useState<string>("Points");
  const [sortDescending, setSortDescending] = useState(true);
  const sortedUsers = filteredUsers.sort((a, b) => {
    if (sortType === "Pastcasts") {
      return b.pastcasts - a.pastcasts;
    }
    if (sortType === "Points") {
      return b.points - a.points;
    }
    if (sortType === "Prior Knowledge") {
      return b.skippedCorrectly - a.skippedCorrectly;
    }
    if (sortType === "Name") {
      return b.name.localeCompare(a.name);
    }

    return 0;
  });
  const sortedUsersReversed = sortedUsers.slice().reverse();
  const sortedUsersToDisplay = sortDescending
    ? sortedUsers
    : sortedUsersReversed;
  useEffect(() => {
    setSortDescending(true);
  }, [sortType]);

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarPastcasting />
      <div className="py-10 grow bg-gray-100">
        <main>
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col ">
              <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            {[
                              "Name",
                              "Pastcasts",
                              "Points",
                              "Prior Knowledge",
                            ].map((header) => (
                              //header is valid sort type
                              <th
                                key={header}
                                scope="col"
                                className="
                              px-3 py-3.5 first:py-3.5 first:pl-4 first:pr-3 text-left text-sm font-semibold text-gray-900 first:sm:pl-6"
                              >
                                {!validSortsArray.includes(header) ? (
                                  <>{header}</>
                                ) : (
                                  <button
                                    className="group inline-flex"
                                    onClick={() => {
                                      if (header === sortType) {
                                        setSortDescending(!sortDescending);
                                      }
                                      setSortType(header);
                                    }}
                                  >
                                    {header}
                                    {sortType === header ? (
                                      <span className="ml-2 flex-none rounded bg-gray-200 text-gray-900 group-hover:bg-gray-300">
                                        {sortDescending ? (
                                          <ChevronDownIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        ) : (
                                          <ChevronUpIcon
                                            className="h-5 w-5"
                                            aria-hidden="true"
                                          />
                                        )}
                                      </span>
                                    ) : (
                                      <span className="invisible ml-2 flex-none rounded text-gray-400 group-hover:visible group-focus:visible">
                                        <ChevronDownIcon
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    )}
                                  </button>
                                )}
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
                          {sortedUsersToDisplay.map((user) => (
                            <tr key={user.id}>
                              {[
                                "name",
                                "pastcasts",
                                "points",
                                "skippedCorrectly",
                              ].map((key) => (
                                <td
                                  key={key}
                                  className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                                >
                                  {
                                    // @ts-ignore
                                    valueToString(user[key], key === "points")
                                  }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Leaderboard;
