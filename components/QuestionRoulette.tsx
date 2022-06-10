import { useState } from "react";

import { Question } from "@prisma/client";

import { booleanToString } from "../lib/services/format";
import { ForecastForm } from "./ForecastForm";
import { NextQuestion } from "./NextQuestion";
import { QuestionDescription } from "./QuestionDescription";
import { Result } from "./Result";

export const QuestionRoulette = ({ questions }: { questions: Question[] }) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [pointsEarned, setPointsEarned] = useState<number | undefined>(
    undefined
  );
  const incrementQuestionIndex = () => {
    setQuestionIndex((questionIndex) => (questionIndex + 1) % questions.length);
  };
  return (
    <>
      <QuestionDescription question={questions[questionIndex]} />
      {pointsEarned !== undefined ? (
        <>
          <Result
            answer={booleanToString(questions[questionIndex].binaryResolution)}
            pointsEarned={pointsEarned}
          />
          <NextQuestion
            nextQuestion={() => {
              incrementQuestionIndex();
              setPointsEarned(undefined);
            }}
          />
        </>
      ) : (
        <ForecastForm
          questionId={questions[questionIndex].id}
          setPointsEarned={setPointsEarned}
        />
      )}
    </>
  );
};
