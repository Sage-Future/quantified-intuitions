import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { BinaryForecast } from "./BinaryForecast";
import { CommentForm } from "./CommentForm";
import { NextQuestion } from "./NextQuestion";
import { Result } from "./Result";
import { SubmitForm } from "./SubmitForm";

export const ForecastForm = ({
  questionId,
  nextQuestion,
}: {
  questionId: string;
  nextQuestion: () => void;
}) => {
  const methods = useForm();
  const [pointsEarned, setPointsEarned] = useState<number | undefined>(
    undefined
  );
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const finishedQuestion = () => {
    setPointsEarned(undefined);
    setAnswer(undefined);
    methods.reset();
    nextQuestion();
  };
  const onSubmit = async (data: any) => {
    data.questionId = questionId;
    data.binaryProbability = Number(data.binaryProbability) / 100.0;
    data.skipped = false;
    await fetch("/api/v0/createBinaryPastcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const json = await res.json();
      if (res.status === 201) {
        setPointsEarned(json.pastcast.score);
        setAnswer(json.resolution);
      }
    });
  };
  // TODO: validate binary forecast is valid
  // TODO: change button to async button
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <BinaryForecast
            disabled={questionId === undefined || answer !== undefined}
          />
          <CommentForm
            disabled={questionId === undefined || answer !== undefined}
          />
          {pointsEarned !== undefined && answer !== undefined ? (
            <>
              <Result answer={answer} pointsEarned={pointsEarned} />
              <NextQuestion nextQuestion={finishedQuestion} />
            </>
          ) : (
            questionId !== undefined && (
              <SubmitForm nextQuestion={finishedQuestion} />
            )
          )}
        </div>
      </form>
    </FormProvider>
  );
};
