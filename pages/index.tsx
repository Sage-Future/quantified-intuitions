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
  const rows = await Prisma.$queryRaw<{ id: string }[]>`
  SELECT q.id
  FROM "Question" AS q, "Pastcast" AS p
  WHERE p."questionId" = q.id
  GROUP BY q.id
  HAVING EVERY(p."userId" != ${userId}) AND COUNT(CASE WHEN p.skipped THEN 1 END) = (
    SELECT MIN(ts) FROM (
      SELECT COUNT(CASE WHEN p.skipped THEN 1 END) AS ts
      FROM "Question" AS q, "Pastcast" AS p
      WHERE p."questionId" = q.id
      GROUP BY q.id
      HAVING EVERY(p."userId" != ${userId})
    ) AS t
  )
  ORDER BY RANDOM() LIMIT 1
`;
  const question = await Prisma.question.findUnique({
    where: { id: rows[0].id },
    include: {
      comments: true,
    },
  });
  if (question !== null && question.comments !== undefined) {
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
            <QuestionRoulette questions={questions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Home;
