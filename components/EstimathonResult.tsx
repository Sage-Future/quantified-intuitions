import { CheckCircleIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { valueToString } from "../lib/services/format";

export const EstimathonResult = ({
  pointsGained,
  correct,
  skipped,
  answer,
  stringAnswer,
  showScoringHint,
}: {
  pointsGained: number;
  correct: boolean;
  skipped: boolean;
  answer: boolean;
  stringAnswer: string | undefined;
  showScoringHint: boolean;
}) => {
  return (
    <div className="sm:col-span-6">
      {correct ? (
        <>
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircleIcon
                  className="h-5 w-5 text-green-400"
                  aria-hidden="true"
                />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {skipped ? (
                    "Your memory is fantastic!"
                  ) : (
                    <>
                      Answer:{" "}
                      {stringAnswer === undefined
                        ? answer
                          ? "Yes"
                          : "No"
                        : stringAnswer}
                      <br />
                      Your score went up by{" "}
                      {valueToString(
                        pointsGained,
                        true,
                        stringAnswer !== undefined
                      )}.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon
                className="h-5 w-5 text-red-400"
                aria-hidden="true"
              />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800">
                {skipped ? (
                  "Not quite! But that's okay!"
                ) : (
                  <>
                    Answer:{" "}
                    {stringAnswer === undefined
                      ? answer
                        ? "Yes"
                        : "No"
                      : stringAnswer}
                    <br />
                    Your score was doubled - it went up by{" "}
                    {valueToString(
                      pointsGained,
                      true,
                      stringAnswer !== undefined
                    )}!
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
      {showScoringHint && <div className="rounded-md bg-yellow-50 p-4 mt-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon
              className="h-5 w-5 text-yellow-400"
              aria-hidden="true"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-yellow-800">
              Estimating a narrower interval keeps your score lower - as long as you get it right. Lowest score wins!
            </p>
          </div>
        </div>
      </div>}
    </div>
  );
};
