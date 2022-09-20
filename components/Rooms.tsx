import { ChevronRightIcon, ClockIcon, QuestionMarkCircleIcon } from "@heroicons/react/24/outline";
import { Room, User } from "@prisma/client";

import { STOCK_PHOTO } from "../lib/services/magicNumbers";

type RoomsProps = {
  rooms: (Room & {
    members: User[];
  })[];
};
export const Rooms = ({ rooms }: RoomsProps) => {
  return (
    <ul role="list" className="divide-y divide-gray-200">
      {rooms.map((room) => (
        <li key={room.id}>
          <a href={`multiplayer/${room.id}`} className="block hover:bg-gray-50">
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="truncate">
                  <div className="flex text-sm">
                    <p className="font-medium text-indigo-600 truncate">
                      {room.name}
                    </p>
                    {room.hostId &&
                      room.members.find(
                        (member) => member.id === room.hostId
                      ) !== undefined && (
                        <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                          by{" "}
                          {
                            room.members.find(
                              (member) => member.id === room.hostId
                            )?.name
                          }
                        </p>
                      )}
                  </div>
                  <div className="mt-2 flex">
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 ">
                      <QuestionMarkCircleIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      {room.totalQuestions} question
                      {room.totalQuestions === 1 ? "" : "s"}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <ClockIcon
                        className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      {room.maxSecondsPerQuestion} seconds per question
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                  <div className="flex overflow-hidden -space-x-1">
                    {room.members.map((member) => (
                      <img
                        key={member.id}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white"
                        src={member.image || STOCK_PHOTO}
                        alt={member.name || "User"}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="ml-5 flex-shrink-0">
                <ChevronRightIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};
