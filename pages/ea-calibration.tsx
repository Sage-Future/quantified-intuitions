import clsx from "clsx";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { CalibrationQuestion } from "@prisma/client";

import { Errors } from "../components/Errors";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { NextQuestion } from "../components/NextQuestion";
import { Result } from "../components/Result";
import { Sorry } from "../components/Sorry";
import { SubmitForm } from "../components/SubmitForm";
import { Prisma } from "../lib/prisma";

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const userId = session?.user?.id || "";
  const calibrationQuestions = await Prisma.calibrationQuestion.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      calibrationAnswers: true,
    },
  });
  const uniqueQuestions = calibrationQuestions.filter(
    (question) =>
      !question.calibrationAnswers.some((answer) => answer.userId === userId)
  );
  const randomQuestion =
    uniqueQuestions[Math.floor(Math.random() * uniqueQuestions.length)];
  return {
    props: {
      session,
      calibrationQuestion: randomQuestion,
    },
  };
};

const EaCalibration = ({
  calibrationQuestion,
}: {
  calibrationQuestion: CalibrationQuestion;
}) => {
  const { register, watch, handleSubmit, setValue } = useForm();
  const [confidenceInterval, setConfidenceInterval] = useState<string>("80%");
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const watchAllFields = watch();
  const router = useRouter();
  const [sessionScore, setSessionScore] = useState<number>(0);
  //60s countdown timer
  const [countdown, setCountdown] = useState<number>(60);
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((countdown) => countdown - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const nextQuestion = () => {
    router.replace(router.asPath);
  };
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const { lowerBound, upperBound } = data;
    setErrors([]);
    if (lowerBound === "" || upperBound === "") {
      setErrors(["Please fill in both fields"]);
      setIsLoading(false);
      return;
    }
    const lowerBoundNumber = Number(lowerBound.replace(/,/g, ""));
    const upperBoundNumber = Number(upperBound.replace(/,/g, ""));
    if (isNaN(lowerBoundNumber) || isNaN(upperBoundNumber)) {
      setErrors(["Please enter a number"]);
      setIsLoading(false);
      return;
    }
    if (lowerBoundNumber > upperBoundNumber) {
      setErrors(["Lower bound must be less than upper bound"]);
      setIsLoading(false);
      return;
    }
    if (lowerBoundNumber < 0 && calibrationQuestion.useLogScoring) {
      setErrors(["Lower bound must be greater than 0"]);
      setIsLoading(false);
      return;
    }

    await fetch("/api/v0/createCalibrationAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        questionId: calibrationQuestion.id,
        lowerBound: lowerBoundNumber,
        upperBound: upperBoundNumber,
        confidenceInterval: parseFloat(confidenceInterval.replace("%", "")),
      }),
    }).then(async (res) => {
      if (res.status === 201) {
        const json = await res.json();
        setPointsEarned(json.score);
        setSessionScore(sessionScore + json.score);
      }
    });
    setIsLoading(false);
  };
  useEffect(() => {
    setValue("lowerBound", "");
    setValue("upperBound", "");
    setIsLoading(false);
    setErrors([]);
    setPointsEarned(null);
    setCountdown(60);
  }, [calibrationQuestion]);
  useEffect(() => {
    let links = document.links;
    for (let i = 0; i < links.length; i++) {
      if (!links[i].href.startsWith(`${window.location.origin}`)) {
        links[i].target = "_blank";
      }
    }
  }, [calibrationQuestion, pointsEarned]);

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <div className="py-6 grow">
        <div className="max-w-prose mx-auto flex justify-between ">
          <div className="prose">
            <h4 className="my-0 text-gray-500">Time remaining:</h4>
            <h2 className="my-0">
              {countdown > 0 ? countdown : "Time's up!"}
              {countdown > 0 && (
                <span className="text-gray-500 text-[16px]"> seconds</span>
              )}
            </h2>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confidence Interval
            </label>
            <span className="mt-1 relative z-0 inline-flex shadow-sm rounded-md">
              <button
                type="button"
                onClick={() => setConfidenceInterval("50%")}
                className={clsx(
                  "relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "50%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                50%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("60%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium   focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "60%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                60%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("70%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "70%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                70%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("80%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300  text-sm font-medium  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "80%"
                    ? "text-white bg-indigo-700 "
                    : "text-gray-700 bg-white hover:bg-gray-50"
                )}
              >
                80%
              </button>
              <button
                type="button"
                onClick={() => setConfidenceInterval("90%")}
                className={clsx(
                  "-ml-px relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300  text-sm font-medium  focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500",
                  confidenceInterval === "90%"
                    ? "text-white bg-indigo-700"
                    : "text-gray-700 bg-white"
                )}
              >
                90%
              </button>
            </span>
          </div>
          <div className="prose">
            <h4 className="my-0 text-gray-500">Score:</h4>
            <h2 className="my-0">
              {sessionScore.toFixed(2)}
              <span className="text-gray-500 text-[16px]"> points</span>
            </h2>
          </div>
        </div>
        {calibrationQuestion === undefined ? (
          <div className="mt-10">
            <Sorry />
          </div>
        ) : (
          <div className="pt-8 max-w-prose mx-auto">
            <div className="prose break-words text-2xl">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {calibrationQuestion.content}
              </ReactMarkdown>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              key={calibrationQuestion.id}
            >
              <div className="pt-10">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {confidenceInterval} Confidence Interval
                </h3>
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
                          calibrationQuestion.prefix.length === 0 &&
                            "rounded-l-md",
                          calibrationQuestion.postfix.length === 0 &&
                            "rounded-r-md"
                        )}
                        disabled={pointsEarned !== null || isLoading}
                        {...register("lowerBound", {
                          onChange: (e) => {
                            const value = e.target.value;
                            const number = Number(value.replace(/,/g, ""));
                            if (isNaN(number)) {
                              e.target.value = "";
                            } else {
                              if (number >= 10000) {
                                e.target.value = number.toLocaleString();
                              }
                            }
                          },
                        })}
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
                          calibrationQuestion.prefix.length === 0 &&
                            "rounded-l-md",
                          calibrationQuestion.postfix.length === 0 &&
                            "rounded-r-md"
                        )}
                        disabled={pointsEarned !== null || isLoading}
                        {...register("upperBound", {
                          onChange: (e) => {
                            const value = e.target.value;
                            const number = Number(value.replace(/,/g, ""));
                            if (isNaN(number)) {
                              e.target.value = "";
                            } else {
                              if (number >= 10000) {
                                e.target.value = number.toLocaleString();
                              }
                            }
                          },
                        })}
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
                  </div>
                  {errors.length > 0 && (
                    <div className="sm:col-span-6">
                      <Errors errors={errors} />
                    </div>
                  )}
                </div>
              </div>
              <div className="pt-6">
                {pointsEarned === null ? (
                  <SubmitForm disabled={isLoading} isLoading={isLoading} />
                ) : (
                  <div className="grid gap-y-6">
                    <Result
                      pointsEarned={pointsEarned}
                      skipped={false}
                      answer={false}
                      numericalAnswer={calibrationQuestion.answer}
                    />
                    <div className="sm:col-span-6 block text-sm font-medium text-gray-500 text-center prose">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {"Source: " + calibrationQuestion.source}
                      </ReactMarkdown>
                    </div>
                    <NextQuestion
                      nextQuestion={nextQuestion}
                      nextText="Next Question"
                      isLoading={isLoading}
                      loadingText="Loading next question"
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default EaCalibration;
