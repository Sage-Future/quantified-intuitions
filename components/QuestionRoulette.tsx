import Router, { useRouter } from "next/router";

import { QuestionWithCommentsAndPastcasts } from "../types/additional";
import { ForecastForm } from "./ForecastForm";
import { ThreeColumnLayout } from "./ThreeColumnLayout";

export const QuestionRoulette = ({
  question,
}: {
  question: QuestionWithCommentsAndPastcasts;
}) => {
  const router = useRouter();
  const nextQuestion = () => {
    router.replace(router.asPath);
  };
  return (
    <ThreeColumnLayout
      question={question}
      room={null}
      right={
        <ForecastForm
          key={question.id}
          startTime={null}
          maxTime={null}
          question={question}
          nextQuestion={nextQuestion}
          isHost={false}
        />
      }
      isHost={false}
    />
  );
};
