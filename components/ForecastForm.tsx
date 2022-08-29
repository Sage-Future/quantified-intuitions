import clsx from "clsx";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useSWRConfig } from "swr";

import { XIcon } from "@heroicons/react/solid";

import { secondsToTime } from "../lib/services/format";
import { isValidBinaryForecast } from "../lib/services/validation";
import { QuestionWithCommentsAndPastcasts } from "../types/additional";
import { BinaryForecast } from "./BinaryForecast";
import { CommentForm } from "./CommentForm";
import { Errors } from "./Errors";
import { NextQuestion } from "./NextQuestion";
import { OriginalPlatform } from "./OriginalPlatform";
import { Result } from "./Result";
import { SubmitForm } from "./SubmitForm";

export const ForecastForm = ({
  startTime,
  maxTime,
  question,
  nextQuestion,
  isHost,
}: {
  startTime: Date | null;
  maxTime: number | null;
  question: QuestionWithCommentsAndPastcasts;
  nextQuestion: () => void;
  isHost: boolean;
}) => {
  const { id: questionId } = question;
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const myPastcast = question.pastcasts.find(
    (pastcast) => pastcast.userId === userId
  );
  const endTime = useMemo(
    () =>
      startTime && maxTime
        ? new Date(startTime?.getTime() + maxTime * 1000)
        : null,
    [startTime, maxTime]
  );

  const waitForNextQuestion = endTime !== null;
  const methods = useForm();
  const [isLoading, setIsLoading] = useState(false);
  type FormState = "initial" | "submittedForecast" | "submittedPrior";
  const [formState, setFormState] = useState<FormState>(
    myPastcast !== undefined
      ? myPastcast.skipped
        ? "submittedPrior"
        : "submittedForecast"
      : "initial"
  );
  const [pointsEarned, setPointsEarned] = useState<number | undefined>(
    myPastcast !== undefined ? myPastcast.score : undefined
  );
  const [showPriorForm, setShowPriorForm] = useState(true);
  const [priorAnswer, setPriorAnswer] = useState<boolean | undefined>(
    myPastcast !== undefined &&
      myPastcast.skipped &&
      myPastcast.binaryProbability
      ? myPastcast.binaryProbability > 0.5
        ? true
        : false
      : undefined
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [timeStarted, setTimeStarted] = useState<number>(Date.now());
  const [secondsRemaining, setSecondsRemaining] = useState<number | undefined>(
    undefined
  );
  const { mutate } = useSWRConfig();
  const router = useRouter();
  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsRemaining(
        endTime
          ? Math.floor((endTime.getTime() - new Date().getTime()) / 1000)
          : 0
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  useEffect(() => {
    if (
      secondsRemaining !== undefined &&
      secondsRemaining < 0 &&
      formState === "initial" &&
      !isLoading
    ) {
      onSubmit({
        binaryProbability: (question.crowdForecast || 0.5) * 100,
      });
    }
  }, [secondsRemaining !== undefined && secondsRemaining < 0]);

  const loadNextQuestion = () => {
    setIsLoading(true);
    nextQuestion();
  };
  const onSubmit = async (data: any) => {
    if (session === null) {
      signIn();
      return;
    }
    setIsLoading(true);
    setErrors([]);
    if (
      data.binaryProbability === undefined ||
      !isValidBinaryForecast(data.binaryProbability)
    ) {
      setErrors(["Please enter a probability between 0.1% and 99.9%"]);
      setIsLoading(false);
      return;
    }
    data.questionId = questionId;
    data.binaryProbability = Number(data.binaryProbability) / 100.0;
    data.timeSpent = Date.now() - timeStarted;
    if (data.comment === undefined || data.comment.length === 0) {
      delete data.comment;
    }
    if (data.skipped === undefined) {
      data.skipped = false;
    }
    await fetch("/api/v0/createBinaryPastcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 201) {
        const json = await res.json();
        setFormState(data.skipped ? "submittedPrior" : "submittedForecast");
        setPointsEarned(json.pastcast.score);
        setPriorAnswer(undefined);
        const roomId = router.asPath.split("/")[2];
        mutate(`/api/v0/getQuestion?roomId=${roomId}`);
      }
    });
    setIsLoading(false);
  };
  const onSkip = async (answer: boolean) => {
    setPriorAnswer(answer);
    await onSubmit({
      binaryProbability: answer ? 99.9 : 0.1,
      skipped: true,
    });
  };
  /*
  useEffect(() => {
    setIsLoading(false);
    methods.reset();
    if (
      myPastcast !== undefined &&
      !myPastcast.skipped &&
      myPastcast.binaryProbability !== null
    ) {
      methods.setValue("binaryProbability", myPastcast.binaryProbability * 100);
    }
    setFormState(
      myPastcast !== undefined
        ? myPastcast.skipped
          ? "submittedPrior"
          : "submittedForecast"
        : "initial"
    );
    setPointsEarned(myPastcast !== undefined ? myPastcast.score : undefined);
    setShowPriorForm(true);
    setPriorAnswer(
      myPastcast !== undefined &&
        myPastcast.skipped &&
        myPastcast.binaryProbability
        ? myPastcast.binaryProbability > 0.5
          ? true
          : false
        : undefined
    );
    setErrors([]);
    setTimeStarted(Date.now());
    setSecondsRemaining(undefined);
  }, [question.id]);
  */

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className=" divide-y divide-gray-200 border sm:rounded-md"
      >
        {endTime !== null && (
          <div className="px-4 py-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {secondsRemaining !== undefined ? (
                secondsRemaining < 0 ? (
                  "Time's up!"
                ) : (
                  `${secondsToTime(secondsRemaining)} remaining`
                )
              ) : (
                <span>&nbsp;</span>
              )}
            </h3>
          </div>
        )}
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <BinaryForecast disabled={isLoading || formState !== "initial"} />
            <CommentForm disabled={isLoading || formState !== "initial"} />
            {errors.length > 0 && (
              <div className="sm:col-span-6">
                <Errors errors={errors} />
              </div>
            )}
            {formState === "submittedForecast" ? (
              <>
                {pointsEarned !== undefined && (
                  <>
                    <Result
                      pointsEarned={pointsEarned || 0}
                      skipped={false}
                      answer={question.binaryResolution}
                      numericalAnswer={undefined}
                    />
                    <OriginalPlatform question={question} />
                  </>
                )}
                <NextQuestion
                  nextQuestion={loadNextQuestion}
                  nextText={
                    isHost
                      ? "Move EVERYONE in room to next question"
                      : "Next Question"
                  }
                  isLoading={isLoading}
                  loadingText={
                    waitForNextQuestion && !isHost
                      ? "Waiting for host"
                      : "Loading next question"
                  }
                />
              </>
            ) : (
              <SubmitForm
                disabled={isLoading || formState !== "initial"}
                isLoading={
                  isLoading &&
                  formState === "initial" &&
                  priorAnswer === undefined
                }
              />
            )}
          </div>
        </div>
        {showPriorForm && (
          <div className="px-4 py-5 sm:p-6">
            <div className="grid gap-y-6">
              <div className="grid gap-y-4">
                <div>
                  {formState !== "submittedPrior" && (
                    <button
                      type="button"
                      className="float-right bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => {
                        setShowPriorForm(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                  <div className="block text-sm font-medium text-gray-700 ">
                    If you have prior knowledge on this question, what do you
                    remember as the most likely answer?
                    <span className="block text-gray-500">
                      (Answering will skip this question)
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      className={clsx(
                        "inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100",
                        (formState === "submittedForecast" ||
                          priorAnswer === false) &&
                          "disabled:opacity-50",
                        priorAnswer === true &&
                          "outline-none ring-2 ring-offset-2 ring-green-500",
                        formState === "initial" &&
                          " hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      )}
                      onClick={() => onSkip(true)}
                      disabled={formState !== "initial" || isLoading}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      className={clsx(
                        "inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100",
                        (formState === "submittedForecast" ||
                          priorAnswer === true) &&
                          "disabled:opacity-50",
                        priorAnswer === false &&
                          "outline-none ring-2 ring-offset-2 ring-red-500",
                        formState === "initial" &&
                          " hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      )}
                      onClick={() => onSkip(false)}
                      disabled={formState !== "initial" || isLoading}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
              {formState === "submittedPrior" && (
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <Result
                    pointsEarned={pointsEarned || 0}
                    skipped={true}
                    answer={priorAnswer || false}
                    numericalAnswer={undefined}
                  />
                  <OriginalPlatform question={question} />
                  <NextQuestion
                    nextQuestion={loadNextQuestion}
                    nextText={
                      isHost
                        ? "Move EVERYONE in room to next question"
                        : "Next Question"
                    }
                    isLoading={isLoading}
                    loadingText={
                      waitForNextQuestion
                        ? "Waiting for host"
                        : "Loading next question"
                    }
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </FormProvider>
  );
};
