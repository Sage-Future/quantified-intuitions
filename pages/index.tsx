import { getSession } from "next-auth/react";

import { Navbar } from "../components/Navbar";
import { QuestionRoulette } from "../components/QuestionRoulette";
import { Prisma } from "../lib/prisma";
import { QuestionWithComments } from "../types/additional";

import type { GetServerSideProps, NextPage } from "next";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const userId = session?.user?.id || "";
  const questions = await Prisma.question.findMany({
    where: {
      pastcasts: {
        none: {
          userId,
        },
      },
    },
    include: {
      pastcasts: true,
      comments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  const minSkipped = questions.reduce(
    (acc, curr) =>
      Math.min(
        curr.pastcasts.reduce(
          (acc2, pastcast) => acc2 + (pastcast.skipped ? 1 : 0),
          0
        ),
        acc
      ),
    Number.MAX_VALUE
  );
  const filteredQuestions = questions.filter(
    (question) =>
      question.pastcasts.reduce(
        (acc, curr) => acc + (curr.skipped ? 1 : 0),
        0
      ) === minSkipped
  );

  //get random question from questions
  const question =
    filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];
  //const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
  //filter comments after vantage point
  if (question.comments !== undefined) {
    question.comments = question.comments.filter(
      (comment) => comment.createdAt < question.vantageDate
    );
  }
  return {
    props: {
      session,
      questions: [question],
      //questions: shuffledQuestions,
    },
  };
};

const Home = ({ questions }: { questions: QuestionWithComments[] }) => {
  //randomize questions
  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-0">
        {/*
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
          */}
        <main>
          <div
          //className="max-w-7xl mx-auto sm:px-6 lg:px-8"
          >
            {/* Replace with your content */}
            <QuestionRoulette questions={questions} />
            {/* /End replace */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
