import clsx from "clsx";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import { Room, User } from "@prisma/client";

import { CalibrationOptions, QuestionWithCommentsAndPastcasts } from "../types/additional";
import { QuestionDescription } from "./QuestionDescription";
import { QuestionScores } from "./QuestionScores";
import { RoomLeaderboard } from "./RoomLeaderboard";
import { Sidebar } from "./Sidebar";
import { VantageSearch } from "./VantageSearch";
import { WikiSearch } from "./WikiSearch";

export const ThreeColumnLayout = ({
  question,
  room,
  right,
  isHost,
}: {
  question: QuestionWithCommentsAndPastcasts;
  room:
    | (Room & {
        members: User[];
        questions: QuestionWithCommentsAndPastcasts[];
      })
    | null;
  right: React.ReactNode;
  isHost: boolean;
}) => {
  const { data: session } = useSession();
  const { members } = room || { members: [] };
  const showScores =
    question.pastcasts.find(
      (pastcast) => pastcast.userId === session?.user?.id
    ) !== undefined;
  const [sidebarSelected, setSidebarSelected] = useState<CalibrationOptions>(
    showScores ? "Scores" : "QuestionDescription"
  );
  useEffect(() => {
    setSidebarSelected("QuestionDescription");
  }, [question.id]);
  useEffect(() => {
    if (showScores) {
      setSidebarSelected("Scores");
    }
  }, [showScores]);

  return (
    <>
      {/* 3 column wrapper */}
      <div className="flex-grow w-full max-w-max mx-auto xl:px-8 lg:flex ">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 min-w-0 bg-white xl:flex">
          <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
            <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
              {/* Start left column area */}
              <div className="sticky top-6">
                <Sidebar
                  selected={sidebarSelected}
                  setSelected={setSidebarSelected}
                  showScores={showScores}
                />
              </div>
              {/* End left column area */}
            </div>
          </div>

          <div className="bg-white lg:min-w-0 lg:flex-1 ">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="max-w-prose">
                <div className="w-[100rem]" />
                <div
                  className={clsx(
                    sidebarSelected !== "QuestionDescription" && "hidden"
                  )}
                >
                  <QuestionDescription question={question} />
                </div>
                <div
                  className={clsx(
                    sidebarSelected !== "VantageSearch" && "hidden"
                  )}
                >
                  <VantageSearch question={question} />
                </div>
                <div
                  className={clsx(sidebarSelected !== "WikiSearch" && "hidden")}
                >
                  <WikiSearch question={question} />
                </div>
                <div className={clsx(sidebarSelected !== "Scores" && "hidden")}>
                  <QuestionScores question={question} members={members} />
                </div>
                <div
                  className={clsx(
                    sidebarSelected !== "Leaderboard" && "hidden"
                  )}
                >
                  {room !== null && <RoomLeaderboard room={room} />}
                </div>
              </div>

              {/* End main area */}
            </div>
          </div>
        </div>

        <div className="bg-white pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
          <div className="h-full pl-6 py-6 lg:w-80">
            {/* Start right column area */}
            <div className="sticky top-6">{right}</div>
            {/* End right column area */}
          </div>
        </div>
      </div>
    </>
  );
};
