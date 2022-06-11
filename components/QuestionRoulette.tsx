import { useState } from "react";

import { Question } from "@prisma/client";

import { ForecastForm } from "./ForecastForm";
import { QuestionDescription } from "./QuestionDescription";
import { ThreeColumnLayout } from "./ThreeColumnLayout";
import { VantageSearch } from "./VantageSearch";

export const QuestionRoulette = ({ questions }: { questions: Question[] }) => {
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const nextQuestion = () => {
    setQuestionIndex((questionIndex) => questionIndex + 1);
  };
  const question = questions[questionIndex];
  return (
    <ThreeColumnLayout
      question={question}
      center={{
        QuestionDescription: (
          <QuestionDescription key="QuestionDescription" question={question} />
        ),
        VantageSearch: (
          <VantageSearch key="VantageSearch" question={question} />
        ),
      }}
      right={
        <ForecastForm questionId={question?.id} nextQuestion={nextQuestion} />
      }
    />
  );
};
