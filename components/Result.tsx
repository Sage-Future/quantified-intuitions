import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

import { valueToString } from "../lib/services/format";

export const Result = ({
  pointsEarned,
  skipped,
  answer,
  stringAnswer,
}: {
  pointsEarned: number;
  skipped: boolean;
  answer: boolean;
  stringAnswer: string | undefined;
}) => {
  return (
    <div className="sm:col-span-6">
      {pointsEarned >= 0 ? (
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
                    You earned{" "}
                    {valueToString(
                      pointsEarned,
                      true,
                      stringAnswer !== undefined
                    )}{" "}
                    points!
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
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
                    You lost{" "}
                    {valueToString(
                      -pointsEarned,
                      true,
                      stringAnswer !== undefined
                    )}{" "}
                    points!
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
