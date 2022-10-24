
import { CheckCircleIcon, EllipsisHorizontalCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { deserialize } from "superjson";
import { SuperJSONValue } from "superjson/dist/types";
import useSWR from "swr";
import { fetcher } from "../lib/services/data";
import { valueToString } from "../lib/services/format";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";

export const ChallengeLeaderboard = ({
  challengeId,
  teamId,
  latestQuestionIndex,
}: {
  challengeId: string;
  teamId: string;
  latestQuestionIndex: number | undefined;
}) => {
  const { data } = useSWR<SuperJSONValue>(challengeId && `/api/v0/getChallengeLeaderboard?challengeId=${challengeId}`,
    fetcher,
    { refreshInterval: 5000, revalidateOnMount: true }
  );
  const challenge = deserialize({
    json: data?.json,
    meta: data?.meta
  }) as ChallengeWithTeamsWithUsersAndQuestions;

  if (!challenge) {
    return <div>Loading...</div>;
  }

  const { fermiQuestions, teams } = challenge;
  const upToQuestionIndex = latestQuestionIndex === undefined
    ? fermiQuestions.length - 1
    :
    latestQuestionIndex;
  const getAnswer = (questionIndex: number, teamId: string) => {
    const answers = fermiQuestions[questionIndex].teamAnswers
    return answers && answers.find(answer => answer.teamId === teamId)
  }

  const formattedTeams = teams
    .map((team) => {
      const answer = getAnswer(upToQuestionIndex, team.id);
      return {
        id: team.id,
        name: team.name,
        questionPoints: answer === undefined ? "Still estimating..." : answer.score,
        correct: answer?.correct,
        pointsSoFar: fermiQuestions.reduce((acc, question, index) => (
          index <= upToQuestionIndex ?
            acc + (getAnswer(index, team.id)?.score || 0)
            : acc)
          , 0),
      }
    })
    .sort((a, b) => {
      // sort ascending, (lower scores are better with estimathon)
      return a.pointsSoFar - b.pointsSoFar;
    });

  const columns = {
    "Team": "name",
    ...(latestQuestionIndex === undefined ? {} : { "Points on this question": "questionPoints" }),
    "Points so far": "pointsSoFar",
  }
  return (
    <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {["", ...Object.keys(columns)].map((header) => (
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
                {formattedTeams.map((team, teamIndex) => (
                  <tr key={team.id} className={clsx((team.id === teamId) && "bg-indigo-200")}>
                    <td
                      key={"place"}
                      className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                    >
                      {teamIndex + 1}
                    </td>
                    {Object.values(columns).map((key) => (
                      <td
                        key={key}
                        className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                      >
                        {
                          key === "questionPoints" && (
                            team[key] === "Still estimating..." ?
                              <EllipsisHorizontalCircleIcon className="mr-2 h-5 w-5 text-gray-400 inline" aria-hidden="true" />
                              :
                              (team.correct ?
                                <CheckCircleIcon className="mr-2 w-5 h-5 text-green-500 inline" aria-hidden="true" />
                                :
                                <XCircleIcon className="mr-2 w-5 h-5 text-red-500 inline" aria-hidden="true" />
                              )
                          )
                        }
                        {
                          //@ts-ignore
                          valueToString(team[key], ["pointsSoFar", "questionPoints"].includes(key), true)
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
