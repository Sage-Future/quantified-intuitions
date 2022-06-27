import Router, { useRouter } from "next/router";

import { QuestionWithComments } from "../types/additional";
import { ForecastForm } from "./ForecastForm";
import { ThreeColumnLayout } from "./ThreeColumnLayout";

export const QuestionRoulette = ({
  questions,
}: {
  questions: QuestionWithComments[];
}) => {
  const router = useRouter();
  const nextQuestion = () => {
    router.replace(router.asPath);
  };
  const question = questions[0];
  return (
    <ThreeColumnLayout
      question={question}
      right={<ForecastForm question={question} nextQuestion={nextQuestion} />}
    />
  );
};
