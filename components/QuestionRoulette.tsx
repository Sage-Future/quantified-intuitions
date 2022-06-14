import Router, { useRouter } from "next/router";

import { Question } from "@prisma/client";

import { ForecastForm } from "./ForecastForm";
import { ThreeColumnLayout } from "./ThreeColumnLayout";

export const QuestionRoulette = ({ questions }: { questions: Question[] }) => {
  /*
  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const nextQuestion = () => {
    setQuestionIndex((questionIndex) => questionIndex + 1);
  };
  const question = questions[questionIndex];
  */
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
