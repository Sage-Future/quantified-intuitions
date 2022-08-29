import clsx from "clsx";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { CalibrationQuestion } from "@prisma/client";

import { Errors } from "../components/Errors";
import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";
import { NextQuestion } from "../components/NextQuestion";
import { Result } from "../components/Result";
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
  const [confidenceInterval, setConfidenceInterval] = useState<string>("50%");
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const watchAllFields = watch();
  const router = useRouter();
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
    if (Number(lowerBound) > Number(upperBound)) {
      setErrors(["Lower bound must be less than upper bound"]);
      console.log(lowerBound, upperBound);
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
        lowerBound: Number(lowerBound),
        upperBound: Number(upperBound),
        confidenceInterval: parseFloat(confidenceInterval.replace("%", "")),
      }),
    }).then(async (res) => {
      if (res.status === 201) {
        const json = await res.json();
        console.log(json);
        setPointsEarned(json.score);
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
  }, [calibrationQuestion]);

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <div className="py-6 grow">
        <div className="flex justify-center">
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
        </div>
        <div className="pt-8 max-w-prose mx-auto">
          <div className="prose break-words">
            <h2 className="text-center my-0">{calibrationQuestion.content}</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} key={calibrationQuestion.id}>
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
                    <input
                      type="number"
                      className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                      {...register("lowerBound")}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      {calibrationQuestion.unit || "units"}
                    </span>
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
                    <input
                      type="number"
                      className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 rounded-none rounded-l-md sm:text-sm border-gray-300"
                      {...register("upperBound")}
                    />
                    <span className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                      {calibrationQuestion.unit || "units"}
                    </span>
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
      </div>
      <Footer />
    </div>
  );
};

export default EaCalibration;
