import clsx from "clsx";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { Question } from "@prisma/client";

import { isValidBinaryForecast } from "../lib/services/validation";
import { BinaryForecast } from "./BinaryForecast";
import { CommentForm } from "./CommentForm";
import { NextQuestion } from "./NextQuestion";
import { OriginalPlatform } from "./OriginalPlatform";
import { Result } from "./Result";
import { SubmitForm } from "./SubmitForm";

export const ForecastForm = ({
  question,
  nextQuestion,
}: {
  question: Question;
  nextQuestion: () => void;
}) => {
  const { id: questionId } = question;
  const methods = useForm();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pointsEarned, setPointsEarned] = useState<number | undefined>(
    undefined
  );
  const [answer, setAnswer] = useState<string | undefined>(undefined);
  const [skipped, setSkipped] = useState(false);
  const [myAnswer, setMyAnswer] = useState<boolean | undefined>(undefined);
  const finishedQuestion = () => {
    setPointsEarned(undefined);
    setAnswer(undefined);
    setSkipped(false);
    setMyAnswer(undefined);
    methods.reset();
    setIsFormDisabled(false);
    nextQuestion();
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (
      data.binaryProbability === undefined ||
      !isValidBinaryForecast(data.binaryProbability)
    ) {
      setIsLoading(false);
      return;
    }
    data.questionId = questionId;
    data.binaryProbability = Number(data.binaryProbability) / 100.0;
    if (data.skipped === undefined) data.skipped = false;
    setSkipped(data.skipped);
    setIsFormDisabled(true);
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
        setMyAnswer(undefined);
      } else {
        setIsFormDisabled(false);
      }
    });
    setIsLoading(false);
  };
  const onSkip = async (answer: boolean) => {
    setMyAnswer(answer);
    await onSubmit({
      binaryProbability: answer ? 99.9 : 0.1,
      skipped: true,
    });
  };

  // TODO: change button to async button
  // TODO: error message for invalid binary forecast
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className=" divide-y divide-gray-200 border sm:rounded-md"
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <BinaryForecast disabled={isFormDisabled} />
            <CommentForm disabled={isFormDisabled} />
            {isFormDisabled && !isLoading
              ? !skipped &&
                pointsEarned !== undefined &&
                answer !== undefined && (
                  <>
                    <Result
                      answer={answer}
                      pointsEarned={pointsEarned}
                      skipped={false}
                    />
                    <OriginalPlatform question={question} />
                    <NextQuestion nextQuestion={finishedQuestion} />
                  </>
                )
              : questionId !== undefined && <SubmitForm />}
          </div>
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="grid gap-y-6">
            <div className="grid gap-y-2">
              <div className="block text-sm font-medium text-gray-700 text-center">
                If you have prior knowledge on this question, what do you
                remember as the most likely answer?
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100",
                      (myAnswer === undefined || myAnswer === false) &&
                        "disabled:opacity-50",
                      !isFormDisabled &&
                        " hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    )}
                    onClick={() => onSkip(true)}
                    disabled={isFormDisabled}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={clsx(
                      "inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100",
                      (myAnswer === undefined || myAnswer === true) &&
                        "disabled:opacity-50",
                      !isFormDisabled &&
                        " hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    )}
                    onClick={() => onSkip(false)}
                    disabled={isFormDisabled}
                  >
                    No
                  </button>
                </div>
              </div>
            </div>
            {isFormDisabled &&
              !isLoading &&
              skipped &&
              answer !== undefined &&
              pointsEarned !== undefined && (
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <Result
                    answer={answer}
                    pointsEarned={pointsEarned}
                    skipped={skipped}
                  />
                  <OriginalPlatform question={question} />
                  <NextQuestion nextQuestion={finishedQuestion} />
                </div>
              )}
          </div>
        </div>
      </form>
    </FormProvider>
  );
};
