import { getSession } from "next-auth/react";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { QuestionRoulette } from "../components/QuestionRoulette";
import { Prisma } from "../lib/prisma";
import { QuestionWithCommentsAndPastcasts } from "../types/additional";

import type { GetServerSideProps, NextPage } from "next";
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    const question = await Prisma.question.findUnique({
      where: {
        id: "metaculus-395",
      },
      include: {
        comments: true,
        pastcasts: true,
      },
    });
    return {
      props: {
        question,
      },
    };
  }
  const userId = session?.user?.id || "";
  const questions = await Prisma.question.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      pastcasts: true,
    },
  });
  const uniqueQuestions = questions.filter(
    (question) =>
      !question.pastcasts.some((pastcast) => pastcast.userId === userId)
  );
  const minSkipped = uniqueQuestions.reduce(
    (acc, question) =>
      Math.min(
        question.pastcasts.reduce(
          (acc2, pastcast) => (pastcast.skipped ? acc2 + 1 : acc2),
          0
        ),
        acc
      ),
    Number.MAX_SAFE_INTEGER
  );
  const filteredQuestions = uniqueQuestions.filter(
    (question) =>
      question.pastcasts.reduce(
        (acc, pastcast) => (pastcast.skipped ? acc + 1 : acc),
        0
      ) === minSkipped
  );
  const questionId =
    filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)].id;
  const question = await Prisma.question.findUnique({
    where: {
      id: questionId,
    },
    include: {
      comments: true,
      pastcasts: true,
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
      question: question,
      //questions: shuffledQuestions,
    },
  };
};

const Home = ({ question }: { question: QuestionWithCommentsAndPastcasts }) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <div className="py-0 grow">
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
            <QuestionRoulette question={question} />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
