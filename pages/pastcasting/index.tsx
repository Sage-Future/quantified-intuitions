import { Footer } from '../../components/Footer';
import { NavbarPastcasting } from '../../components/NavbarPastcasting';
import { QuestionRoulette } from '../../components/QuestionRoulette';
import { Prisma } from '../../lib/prisma';
import { QuestionWithCommentsAndPastcasts } from '../../types/additional';

import type { GetServerSideProps } from "next";
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
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

  const uniqueQuestions = await Prisma.question.findMany({
    where: {
      isDeleted: false,
      pastcasts: {
        none: {
          userId: {
            equals: userId,
          }
        },
      },
    },
  });
  if (uniqueQuestions.length === 0) {
    return {
      props: {
        session,
        question: null,
      },
    };
  }

  const skippedByQuestion = await Prisma.pastcast.groupBy({
    by: ["questionId"],
    where: {
      question: {
        isDeleted: false,
      },
      skipped: true,
    },
    _count: {
      skipped: true,
    }
  });
  const minSkipped = skippedByQuestion.reduce(
    (acc, question) => uniqueQuestions.some(q => q.id === question.questionId) ? 
      Math.min(question._count.skipped, acc) : acc,
    Number.MAX_SAFE_INTEGER
  );

  const filteredQuestions = uniqueQuestions.filter(question => 
    // has never been skipped
    !skippedByQuestion.some(q => q.questionId === question.id) ||
    // or has been skipped the minimum number of times
    skippedByQuestion.some(q => q.questionId === question.id && q._count.skipped === minSkipped)
  );

  // order uniqueQuestions deterministically so that same question persists across page refresh
  function hashCode(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  }
  filteredQuestions.sort((a, b) => hashCode(a.title) - hashCode(b.title));

  const questionId = uniqueQuestions.some(
    (question) => question.id === "metaculus-395"
  )
    ? "metaculus-395"
    : filteredQuestions[0].id;
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
      question,
    },
  };
};

const Home = ({
  question,
}: {
  question: QuestionWithCommentsAndPastcasts | null;
}) => {
  if (question === null) {
    return (
      <div className="flex flex-col min-h-screen justify-between">
        <NavbarPastcasting />
        <div className="py-10 grow">
          <main>
            <div>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold text-center">
                  {"You've answered all the questions!"}
                </h1>
                <p className="text-center">
                  Check back later for more questions to answer.
                </p>
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarPastcasting />
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
