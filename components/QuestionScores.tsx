import { User } from "@prisma/client";

import { floatToPercent, valueToString } from "../lib/services/format";
import { QuestionWithCommentsAndPastcasts } from "../types/additional";

export const QuestionScores = ({
  question,
  members,
}: {
  question: QuestionWithCommentsAndPastcasts;
  members: User[];
}) => {
  const formattedUsers = members
    .filter((member) =>
      question.pastcasts.some((pastcast) => pastcast.userId === member.id)
    )
    .map((member) => {
      const pastcast = question.pastcasts.find(
        (pastcast) => pastcast.userId === member.id
      );
      return {
        id: member.id,
        name: member.name,
        pastcast: pastcast?.skipped
          ? "Skipped"
          : floatToPercent(pastcast?.binaryProbability ?? 0.5),
        points: pastcast?.skipped ? 0 : pastcast?.score ?? 0,
      };
    })
    .sort((a, b) => b.points - a.points);

  return (
    <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Pastcast", "Points"].map((header) => (
                    //header is valid sort type
                    <th
                      key={header}
                      scope="col"
                      className="
                px-3 py-3.5 first:py-3.5 first:pl-4 first:pr-3 text-left text-sm font-semibold text-gray-900 first:sm:pl-6"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {formattedUsers.map((user) => (
                  <tr key={user.id}>
                    {["name", "pastcast", "points"].map((key) => (
                      <td
                        key={key}
                        className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                      >
                        {
                          //@ts-ignore
                          valueToString(user[key], key === "points")
                        }
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
