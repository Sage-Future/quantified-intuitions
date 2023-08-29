import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";

import { valueToString } from "../lib/services/format";
import { InfoButton } from "./InfoButton";

export const Result = ({
  pointsEarned,
  skipped,
  answer,
  stringAnswer,
  otherPlayersPointsEarned,
  helpText,
}: {
  pointsEarned: number;
  skipped: boolean;
  answer: boolean;
  stringAnswer: string | undefined;
  otherPlayersPointsEarned?: number[];
  helpText?: string;
}) => {
  const higherThanPercentage = (otherPlayersPointsEarned && otherPlayersPointsEarned.length > 2) ? 
    otherPlayersPointsEarned.reduce((acc, curr) => {
      if (curr < pointsEarned) {
        return acc + 1;
      }
      return acc;
    }, 0) / otherPlayersPointsEarned.length * 100
    :
    undefined

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
              {!skipped && higherThanPercentage && 
                <p className="text-sm font-medium text-green-800 pt-4">
                  You scored higher than {higherThanPercentage.toFixed(1)}% of players
                </p>
              }
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
                    {helpText && <span className="ml-1">
                      <InfoButton tooltip={helpText} className="tooltip-left" />
                    </span>}
                  </>
                )}
              </p>

              {(!skipped && higherThanPercentage != undefined) && 
                <p className="text-sm font-medium text-red-800 pt-4">
                  You scored higher than {higherThanPercentage.toFixed(0)}% of players
                </p>
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
