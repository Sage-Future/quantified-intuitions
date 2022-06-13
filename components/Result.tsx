import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/solid";

import { valueToString } from "../lib/services/format";

export const Result = ({
  answer,
  pointsEarned,
}: {
  answer: string;
  pointsEarned: number;
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
                You earned {valueToString(pointsEarned)} points!
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
                You lost {valueToString(-1 * pointsEarned)} points
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
