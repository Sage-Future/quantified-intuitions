import clsx from "clsx";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { CalibrationQuestion } from "@prisma/client";

import { CalibrationForm } from "../components/CalibrationForm";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { Sorry } from "../components/Sorry";
import { Prisma } from "../lib/prisma";

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const userId = session?.user?.id || "";
  const calibrationQuestions = await Prisma.calibrationQuestion.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      calibrationAnswers: true,
    },
  });
  const uniqueQuestions = calibrationQuestions.filter(
    (question) =>
      !question.calibrationAnswers.some((answer) => answer.userId === userId)
  );
  const randomQuestion =
    uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
  return {
    props: {
      session,
      calibrationQuestion: randomQuestion,
    },
  };
};

const EaCalibration = ({
  calibrationQuestion,
}: {
  calibrationQuestion: CalibrationQuestion;
}) => {
  const [confidenceInterval, setConfidenceInterval] = useState<string>("80%");
  const router = useRouter();
  const [sessionScore, setSessionScore] = useState<number>(0);
  const addToSessionScore = (score: number) => {
    setSessionScore(sessionScore + score);
  };
  const [countdown, setCountdown] = useState<number>(180);

  const nextQuestion = () => {
    router.replace(router.asPath);
    setCountdown(180);
  };
  const reduceCountdown = () => {
    setCountdown(countdown - 1);
    if (countdown < -10) nextQuestion();
  };

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <div className="py-6 grow">
        <div className="max-w-prose mx-auto flex justify-between ">
          <div className="prose">
            <h4 className="my-0 text-gray-500">Time remaining:</h4>
            <h2 className="my-0">
              {countdown > 0 ? countdown : "Time's up!"}
              {countdown > 0 && (
                <span className="text-gray-500 text-[16px]"> seconds</span>
              )}
            </h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confidence Interval
            </label>
            <span className="mt-1 relative z-0 inline-flex shadow-sm rounded-md">
              <button
                type="button"
                onClick={() => setConfidenceInterval("50%")}
                className={clsx(
                  "relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "50%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("60%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium   focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "60%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                60%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("70%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "70%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                70%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("80%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "80%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                80%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("90%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300  text-sm font-medium  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "90%"
                    ? "text-white bg-indigo-700"
                    : "text-gray-700 bg-white"
                )}
              >
                90%
              </button>
            </span>
          </div>
          <div className="prose">
            <h4 className="my-0 text-gray-500">Score:</h4>
            <h2 className="my-0">
              {sessionScore.toFixed(2)}
              <span className="text-gray-500 text-[16px]"> points</span>
            </h2>
          </div>
        </div>
        {calibrationQuestion === undefined ? (
          <div className="mt-10">
            <Sorry />
          </div>
        ) : (
          <CalibrationForm
            calibrationQuestion={calibrationQuestion}
            confidenceInterval={confidenceInterval}
            reduceCountdown={reduceCountdown}
            nextQuestion={nextQuestion}
            addToSessionScore={addToSessionScore}
            key={calibrationQuestion.id}
          />
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EaCalibration;
