import { useState } from "react";

import { Question } from "@prisma/client";

import { ForecastForm } from "./ForecastForm";
import { ThreeColumnLayout } from "./ThreeColumnLayout";

export const QuestionRoulette = ({ questions }: { questions: Question[] }) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const nextQuestion = () => {
    setQuestionIndex((questionIndex) => questionIndex + 1);
  };
  const question = questions[questionIndex];
  return (
    <ThreeColumnLayout
      question={question}
      right={
        <ForecastForm questionId={question?.id} nextQuestion={nextQuestion} />
      }
    />
  );
};
