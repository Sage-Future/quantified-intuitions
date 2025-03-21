import { GetServerSideProps, NextPage } from "next";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { deserialize } from "superjson";
import { SuperJSONValue } from "superjson/dist/types";
import useSWR from "swr";
import { auth } from "../../../lib/auth";

import { Room, User } from "@prisma/client";

import { Footer } from "../../../components/Footer";
import { ForecastForm } from "../../../components/ForecastForm";
import { NavbarPastcasting } from "../../../components/NavbarPastcasting";
import { RoomLeaderboard } from "../../../components/RoomLeaderboard";
import { RoomLobby } from "../../../components/RoomLobby";
import { ThreeColumnLayout } from "../../../components/ThreeColumnLayout";
import { Prisma } from "../../../lib/prisma";
import { QuestionWithCommentsAndPastcasts } from "../../../types/additional";

export type RoomProps = {
  room: Room & {
    members: User[];
    questions: QuestionWithCommentsAndPastcasts[];
  };
  session: Session;
};

export const getServerSideProps: GetServerSideProps<RoomProps | {}> = async (
  ctx
) => {
  const session = await auth(ctx.req, ctx.res);
  if (!session) {
    return { props: {} };
  }
  const roomId = ctx.query.id as string;
  const updatedRoom = await Prisma.room.update({
    where: { id: roomId },
    data: {
      members: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });
  const room = await Prisma.room.findUnique({
    where: { id: roomId },
    include: {
      members: true,
      questions: {
        include: {
          comments: true,
          pastcasts: true,
        },
      },
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
  const loadNewQuestion = async () => {
    await fetch("/api/v0/pickQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roomId: room.id,
      }),
    });
  };
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const isHost = userId === room.hostId;
  const { currentQuestionId } = room;
  const currentQuestion = room.questions.find(
    (question) => question.id === currentQuestionId
  );

  const [shouldFetch, setShouldFetch] = useState(true);
  const fetcher = (arg: string) => fetch(arg).then((res) => res.json());

  const { data } = useSWR<SuperJSONValue>(
    shouldFetch ? `/api/v0/getQuestion?roomId=${room.id}` : null,
    fetcher,
    {
      refreshInterval: 5000,
    }
  );
  const deserializedRoom = deserialize({
    json: data?.json,
    meta: data?.meta,
  }) as
    | (Room & {
        questions: QuestionWithCommentsAndPastcasts[];
        members: User[];
      })
    | undefined;
  const deserializedQuestion =
    deserializedRoom !== undefined
      ? deserializedRoom.questions.find(
          (question) => question.id === deserializedRoom.currentQuestionId
        )
      : undefined;
  const realRoom = deserializedRoom || room;
  const realQuestion = deserializedQuestion || currentQuestion;
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarPastcasting />
      <div className="py-0 grow ">
        <main>
          {/*
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <RoomHeading room={room} />
          </div>
            */}
          {realRoom.isFinshed ? (
            <div className="py-10 min-h-screen bg-gray-100">
              <h1 className="text-center text-xl font-semibold text-gray-900">
                Leaderboard for {room.name}
              </h1>
              <RoomLeaderboard room={realRoom} />
            </div>
          ) : realQuestion !== undefined ? (
            <ThreeColumnLayout
              question={realQuestion as QuestionWithCommentsAndPastcasts}
              room={realRoom}
              right={
                <ForecastForm
                  key={realQuestion.id}
                  startTime={realRoom.currentStartTime}
                  maxTime={realRoom.maxSecondsPerQuestion}
                  question={realQuestion as QuestionWithCommentsAndPastcasts}
                  nextQuestion={isHost ? () => loadNewQuestion() : () => {}}
                  isHost={isHost}
                />
              }
              isHost={isHost}
            />
          ) : (
            <RoomLobby
              room={realRoom}
              loadNewQuestion={isHost ? () => loadNewQuestion() : () => {}}
            />
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
};
export default RoomPage;
