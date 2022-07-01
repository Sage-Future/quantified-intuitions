import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import {
    ChevronLeftIcon, ClockIcon, PlayIcon, QuestionMarkCircleIcon
} from "@heroicons/react/solid";
import { Room, User } from "@prisma/client";

import { STOCK_PHOTO } from "../lib/services/magicNumbers";
import { QuestionWithCommentsAndPastcasts } from "../types/additional";

export const RoomLobby = ({
  room,
  loadNewQuestion,
}: {
  room: Room & {
    members: User[];
    questions: QuestionWithCommentsAndPastcasts[];
  };
  loadNewQuestion: () => void;
}) => {
  const router = useRouter();
  const leaveRoom = async () => {
    await fetch(`/api/v0/leaveRoom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: room.id,
      }),
    });
    router.push("/multiplayer");
  };
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isHost = userId === room.hostId;
  const [isLoading, setIsLoading] = useState(false);
  const startGame = async () => {
    setIsLoading(true);
    await loadNewQuestion();
  };

  return (
    <div className="py-10 h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Waiting for the host to start the game...
        </h1>
        <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
              <div className="ml-4 mt-2">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {room.name}
                </h3>
                <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
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
              <div className="ml-4 mt-2 flex-shrink-0">
                {isHost && (
                  <button
                    type="button"
                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={startGame}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5 -ml-1 mr-3"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        {` Starting game...`}
                      </>
                    ) : (
                      <>
                        <PlayIcon
                          className="-ml-1 mr-2 h-5 w-5"
                          aria-hidden="true"
                        />
                        Start Game
                      </>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  className="ml-4 relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={leaveRoom}
                >
                  <ChevronLeftIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  Leave Room
                </button>
              </div>
            </div>
          </div>
          <ul role="list" className="divide-y divide-gray-200">
            {room.members.map((member) => (
              <li key={member.id} className="px-4 py-4 flex">
                <img
                  className="h-10 w-10 rounded-full"
                  src={member.image || STOCK_PHOTO}
                  alt={""}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {member.name}
                  </p>
                  {member.id === room.hostId && (
                    <p className="text-sm text-gray-500">Host</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
