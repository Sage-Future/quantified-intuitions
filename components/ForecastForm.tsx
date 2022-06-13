import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { isValidBinaryForecast } from "../lib/services/validation";
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
    if (
      data.binaryProbability === undefined ||
      !isValidBinaryForecast(data.binaryProbability)
    ) {
      return;
    }

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
  const onSkip = async () => {
    await fetch("/api/v0/skipQuestion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ questionId }),
    }).then(async (res) => {
      const json = await res.json();
      if (res.status === 201) {
        finishedQuestion();
      }
    });
  };

  // TODO: change button to async button
  // TODO: error message for invalid binary forecast
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8 divide-y divide-gray-200 border sm:rounded-md"
      >
        <div className="px-4 py-5 sm:p-6">
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
              questionId !== undefined && <SubmitForm skipQuestion={onSkip} />
            )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
