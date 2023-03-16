
import { CheckCircleIcon, EllipsisHorizontalCircleIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { AboveBelowQuestion, CalibrationQuestion, Team } from "@prisma/client";
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
  latestQuestion,
}: {
  challengeId: string;
  teamId: string | undefined;
  latestQuestion: {
    indexWithinType: number;
    type: "fermi" | "aboveBelow";
  } | null;
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
    return <div>Loading...</div>
  }

  const getAnswer = (questionIndex: number, teamId: string, type: "fermi" | "aboveBelow") => {
    const questions = type === "fermi" ? challenge.fermiQuestions : challenge.aboveBelowQuestions;
    const answers = questions[questionIndex].teamAnswers;
    // @ts-ignore
    return answers && answers.find((answer: { teamId: string }) => answer.teamId === teamId);
  }

  const countPointsSoFar = (team: Team, questions: (CalibrationQuestion | AboveBelowQuestion)[], type: "fermi" | "aboveBelow") => (
    questions.reduce((acc: number, question: CalibrationQuestion | AboveBelowQuestion, index: number) => {
      if (latestQuestion && latestQuestion?.type === type && latestQuestion?.indexWithinType < index) {
        return acc;
      }

      const answer = getAnswer(index, team.id, type);
      return acc + (answer?.score || 0);
    }, 0)
  );

  const formattedTeams = challenge.teams
    .map((team) => {
      const fermiPointsSoFar = countPointsSoFar(team, challenge.fermiQuestions, "fermi");
      // NB: assumes that aboveBelowQuestions are always after fermiQuestions
      const aboveBelowPointsSoFar = latestQuestion?.type === "fermi" ? 0 : countPointsSoFar(team, challenge.aboveBelowQuestions, "aboveBelow");
      const latestAnswer = latestQuestion && getAnswer(latestQuestion.indexWithinType, team.id, latestQuestion.type);
      return ({
        id: team.id,
        name: team.name,
        questionPoints: latestAnswer ? latestAnswer.score : "",
        correct: latestAnswer && latestAnswer.score > 0,
        fermiPointsSoFar,
        aboveBelowPointsSoFar,
        totalPoints: fermiPointsSoFar + aboveBelowPointsSoFar,
      });
    })
    .sort((a, b) => {
      // sort descending
      return b.totalPoints - a.totalPoints;
    });

  const columns = {
    ...(latestQuestion === null ? {} : { "This question": "questionPoints" }),
    "Round 1": "fermiPointsSoFar",
    ...((latestQuestion && latestQuestion?.type === "fermi") ? {} : { "Round 2": "aboveBelowPointsSoFar" }),
    ...((latestQuestion && latestQuestion?.type === "fermi") ? {} : { "Total": "totalPoints" }),
  }
  return (
    <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    key={"team"}
                    scope="col"
                    rowSpan={2}
                    colSpan={2}
                    className="
            px-3 pt-3.5 first:pl-4 first:pr-3 text-left text-sm font-semibold text-gray-900 first:sm:pl-6"
                  >
                  </th>

                  <th
                    key={"points"}
                    scope="col"
                    colSpan={Object.keys(columns).length}
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 border-b-2 border-gray-200"
                  >
                    Points so far
                  </th>
                </tr>
                <tr>
                  {Object.keys(columns).map((header) => (
                    //header is valid sort type
                    <th
                      key={header}
                      scope="col"
                      className="
            px-3 py-3.5 pt-3.5 first:pl-4 first:pr-3 text-right text-sm font-semibold text-gray-500 first:sm:pl-6"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {formattedTeams.map((team, teamIndex) => (
                  <tr key={team.id} className={clsx((teamId && team.id === teamId) && "bg-indigo-200")}>
                    <td
                      key={"place"}
                      className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                    >
                      <div className={clsx((teamIndex + 1) <= 3 && ["bg-amber-200", "bg-slate-200", "bg-orange-200"][teamIndex],
                        "w-5 h-5 text-xs flex items-center justify-center rounded-full")}>
                        {teamIndex + 1}
                      </div>
                    </td>
                    <td
                      key={"team"}
                      className="whitespace-nowrap overflow-x-scroll max-w-[12rem] px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                    >
                      {team.name}
                    </td>
                    {Object.values(columns).map((key) => (
                      <td
                        key={key}
                        className="whitespace-nowrap text-right px-3 mr-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                      >
                        {
                          key === "questionPoints" && (
                            team[key] === "" ?
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
                          team[key] && valueToString(team[key], key.includes("Points"), true)
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
