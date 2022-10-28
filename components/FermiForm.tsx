import clsx from "clsx";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CalibrationQuestion } from "@prisma/client";

import { Errors } from "../components/Errors";
import { SubmitForm } from "../components/SubmitForm";
import { convertNumber, formatInput, formatResult } from "../lib/services/format";
import { LoadingButton } from "./LoadingButton";
import { Result } from "./Result";

export const FermiForm = ({
  calibrationQuestion,
  reduceCountdown,
  nextQuestion,
  addToScore,
  teamId,
  setQuestionComplete,
  showScoringHint,
}: {
  calibrationQuestion: CalibrationQuestion;
  reduceCountdown: () => void;
  nextQuestion: () => void;
  addToScore: (score: number) => void;
  teamId: string;
  setQuestionComplete: (isComplete: boolean) => void;
  showScoringHint: boolean;
}) => {
  const { register, watch, handleSubmit, setFocus } = useForm();
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const watchAllFields = watch();

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const { lowerBound, upperBound } = data;
    setErrors([]);
    if (lowerBound === "" || upperBound === "") {
      setErrors(["Please fill in both fields"]);
      setIsLoading(false);
      return;
    }
    let lowerBoundNumber = Number(lowerBound);
    let upperBoundNumber = Number(upperBound);
    if (isNaN(lowerBoundNumber) || isNaN(upperBoundNumber)) {
      setErrors(["Please enter a number"]);
      setIsLoading(false);
      return;
    }
    lowerBoundNumber = convertNumber(
      lowerBoundNumber,
      calibrationQuestion.prefix.includes("10^")
    );
    upperBoundNumber = convertNumber(
      upperBoundNumber,
      calibrationQuestion.prefix.includes("10^")
    );
    if (lowerBoundNumber > upperBoundNumber) {
      setErrors(["Lower bound must be less than upper bound"]);
      setIsLoading(false);
      return;
    }
    if (lowerBoundNumber <= 0) {
      setErrors(["Lower bound must be greater than 0"]);
      setIsLoading(false);
      return;
    }

    await fetch("/api/v0/createTeamAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId,
        questionId: calibrationQuestion.id,
        lowerBound: lowerBoundNumber,
        upperBound: upperBoundNumber,
      }),
    }).then(async (res) => {
      if (res.status === 201) {
        const json = await res.json();
        setQuestionComplete(true);
        setPointsEarned(json.score);
        addToScore(json.score);
        setCorrect(json.correct);
      }
    });
    setIsLoading(false);
  };
  //call reduceCountdown every second
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isLoading && !pointsEarned) {
        reduceCountdown();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [reduceCountdown]);

  useEffect(() => {
    setFocus("lowerBound");
    setQuestionComplete(false);
  }, []);
  useEffect(() => {
    let links = document.links;
    for (let i = 0; i < links.length; i++) {
      if (!links[i].href.startsWith(`${window.location.origin}`)) {
        links[i].target = "_blank";
      }
    }
  }, [calibrationQuestion, pointsEarned]);

  return (
    <>
      <div className="prose break-words text-2xl pt-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {calibrationQuestion.content}
        </ReactMarkdown>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="pt-10">
          <div className="mt-1 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="lower-bound"
                className="block text-sm font-medium text-gray-700"
              >
                Lower Bound
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                {calibrationQuestion.prefix.length > 0 && (
                  <span
                    className={clsx(
                      "inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm",
                      (pointsEarned !== null || isLoading) && "opacity-50"
                    )}
                  >
                    {calibrationQuestion.prefix}
                  </span>
                )}
                <input
                  type="text"
                  className={clsx(
                    "flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none sm:text-sm border-gray-300 disabled:opacity-50",
                    calibrationQuestion.prefix.length === 0 && "rounded-l-md",
                    calibrationQuestion.postfix.length === 0 && "rounded-r-md",
                    calibrationQuestion.prefix.length > 0 &&
                      calibrationQuestion.postfix.length === 0
                      ? ""
                      : "text-right"
                  )}
                  disabled={pointsEarned !== null || isLoading}
                  {...register("lowerBound")}
                />
                {calibrationQuestion.postfix.length > 0 && (
                  <span
                    className={clsx(
                      "inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm",
                      (pointsEarned !== null || isLoading) && "opacity-50"
                    )}
                  >
                    {calibrationQuestion.postfix}
                  </span>
                )}
              </div>
              <p
                className="mt-2 text-sm text-gray-500"
                id="lowerBoundDescription"
              >
                {watchAllFields.lowerBound !== undefined &&
                  watchAllFields.lowerBound !== "" &&
                  (!isNaN(Number(watchAllFields.lowerBound))
                    ? formatInput(
                        Number(watchAllFields.lowerBound),
                        calibrationQuestion.prefix,
                        calibrationQuestion.postfix
                      )
                    : "Invalid Input")}
              </p>
            </div>
            <div className="sm:col-span-3">
              <label
                htmlFor="upper-bound"
                className="block text-sm font-medium text-gray-700"
              >
                Upper Bound
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                {calibrationQuestion.prefix.length > 0 && (
                  <span
                    className={clsx(
                      "inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm",
                      (pointsEarned !== null || isLoading) && "opacity-50"
                    )}
                  >
                    {calibrationQuestion.prefix}
                  </span>
                )}
                <input
                  type="text"
                  className={clsx(
                    "flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none sm:text-sm border-gray-300 disabled:opacity-50",
                    calibrationQuestion.prefix.length === 0 && "rounded-l-md",
                    calibrationQuestion.postfix.length === 0 && "rounded-r-md",
                    calibrationQuestion.prefix.length > 0 &&
                      calibrationQuestion.postfix.length === 0
                      ? ""
                      : "text-right"
                  )}
                  disabled={pointsEarned !== null || isLoading}
                  {...register("upperBound")}
                />
                {calibrationQuestion.postfix.length > 0 && (
                  <span
                    className={clsx(
                      "inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm",
                      (pointsEarned !== null || isLoading) && "opacity-50"
                    )}
                  >
                    {calibrationQuestion.postfix}
                  </span>
                )}
              </div>
              <p
                className="mt-2 text-sm text-gray-500"
                id="upperBoundDescription"
              >
                {watchAllFields.upperBound !== undefined &&
                  watchAllFields.upperBound !== "" &&
                  (!isNaN(Number(watchAllFields.upperBound))
                    ? formatInput(
                        Number(watchAllFields.upperBound),
                        calibrationQuestion.prefix,
                        calibrationQuestion.postfix
                      )
                    : "Invalid Input")}
              </p>
            </div>
            {errors.length > 0 && (
              <div className="sm:col-span-6">
                <Errors errors={errors} />
              </div>
            )}
          </div>
        </div>
        <div className="pt-6">
          {pointsEarned === null || correct === null ? (
            <SubmitForm disabled={isLoading} isLoading={isLoading} />
          ) : (
            <div className="grid gap-y-6">
              <Result
                pointsEarned={pointsEarned}
                skipped={false}
                answer={false}
                stringAnswer={formatResult(
                  calibrationQuestion.answer,
                  calibrationQuestion.prefix,
                  calibrationQuestion.postfix
                )}
              />
              <div className="sm:col-span-6 block text-sm font-medium text-gray-500 text-center prose">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {"Source: " + calibrationQuestion.source}
                </ReactMarkdown>
              </div>
              <LoadingButton
                onClick={nextQuestion}
                buttonText="Next Question"
                isLoading={isLoading}
                loadingText="Loading next question"
              />
            </div>
          )}
        </div>
      </form>
    </>
  );
};
