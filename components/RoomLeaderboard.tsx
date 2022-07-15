import { Room, User } from "@prisma/client";

import { valueToString } from "../lib/services/format";
import { QuestionWithCommentsAndPastcasts } from "../types/additional";

export const RoomLeaderboard = ({
  room,
}: {
  room: Room & {
    members: User[];
    questions: QuestionWithCommentsAndPastcasts[];
  };
}) => {
  const { questions, members } = room;
  const formattedUsers = members
    .map((member) => ({
      id: member.id,
      name: member.name,
      points: questions.reduce((acc, question) => {
        return (
          acc +
          question.pastcasts
            .filter((pastcast) => pastcast.userId === member.id)
            .reduce((acc2, pastcast) => {
              return acc2 + (pastcast.skipped ? 0 : pastcast.score);
            }, 0)
        );
      }, 0),
      skippedCorrectly: questions.reduce((acc, question) => {
        return (
          acc +
          question.pastcasts
            .filter((pastcast) => pastcast.userId === member.id)
            .reduce((acc2, pastcast) => {
              return (
                acc2 + (pastcast.skipped ? (pastcast.score > 0 ? 1 : 0) : 0)
              );
            }, 0)
        );
      }, 0),
    }))
    .sort((a, b) => {
      return b.points - a.points;
    });
  return (
    <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {["Name", "Points", "Skipped Correctly"].map((header) => (
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
                    {["name", "points", "skippedCorrectly"].map((key) => (
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
