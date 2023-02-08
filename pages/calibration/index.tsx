import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { CalibrationQuestion } from '@prisma/client';

import { event } from 'nextjs-google-analytics';
import { ButtonArray } from "../../components/ButtonArray";
import { CalibrationForm } from '../../components/CalibrationForm';
import { Footer } from '../../components/Footer';
import { NavbarCalibration } from '../../components/NavbarCalibration';
import { NavbarPastcasting } from '../../components/NavbarPastcasting';
import { Sorry } from '../../components/Sorry';
import { Prisma } from '../../lib/prisma';

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  if (!session) {
    return { props: {} };
  }
  const userId = session?.user?.id || "";
  const calibrationQuestions = await Prisma.calibrationQuestion.findMany({
    where: {
      isDeleted: false,
      challengeOnly: false,
    },
    include: {
      calibrationAnswers: true,
    },
  });
  const uniqueQuestions = calibrationQuestions.filter(
    (question) =>
      !question.calibrationAnswers.some((answer) => answer.userId === userId)
  );
  if (uniqueQuestions.length === 0) {
    return {
      props: {
        session,
        question: null,
      },
    };
  }
  const randomQuestion =
    uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
  return {
    props: {
      session,
      calibrationQuestion: randomQuestion,
    },
  };
};

const Calibration = ({
  calibrationQuestion,
}: {
  calibrationQuestion: CalibrationQuestion | null;
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
    event("calibration_next_question", {
      app: "calibration",
      question_id: calibrationQuestion?.id,
    });
  };
  const reduceCountdown = () => {
    setCountdown(countdown - 1);
    if (countdown < -10) nextQuestion();
  };

  if (!calibrationQuestion) {
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
      <NavbarCalibration />
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
          <ButtonArray 
            selected={confidenceInterval}
            setSelected={setConfidenceInterval}
            options={["50%", "60%", "70%", "80%", "90%"]}
            label={"Confidence interval"}
          />
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

export default Calibration;
