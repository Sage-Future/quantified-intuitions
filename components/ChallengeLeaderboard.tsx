
import { valueToString } from "../lib/services/format";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";

export const ChallengeLeaderboard = ({
  challenge,
  teamId,
  latestQuestionIndex,
}: {
  challenge: ChallengeWithTeamsWithUsersAndQuestions;
  teamId: string;
  latestQuestionIndex: number | undefined;
}) => {
  const { fermiQuestions, teams } = challenge;
  const upToQuestionIndex = latestQuestionIndex === undefined ? fermiQuestions.length - 1 : latestQuestionIndex;
  const getScore = (questionIndex: number, teamId: string) => 
    fermiQuestions[questionIndex].teamAnswers.find(answer => answer.teamId === teamId)?.score;
  const formattedTeams = teams
    .map((team) => {
      const questionPoints = getScore(upToQuestionIndex, team.id);
      return {
        id: team.id,
        name: team.name,
        questionPoints: questionPoints !== undefined ? questionPoints : "Still estimating...",
        pointsSoFar: fermiQuestions.reduce((acc, question, index) => (
          upToQuestionIndex <= index ? 
              acc + ((console.log(index, team.id, getScore(index, team.id)) !== undefined) && getScore(index, team.id) || 0)
              : acc)
          , 0),
      }
    })
    .sort((a, b) => {
      return b.pointsSoFar - a.pointsSoFar;
    });
  
  const columns = {
    "Team": "name",
    ...(latestQuestionIndex === undefined ? {} : {"Points on this question": "questionPoints"}),
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
                  {Object.keys(columns).map((header) => (
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
                {formattedTeams.map((team) => (
                  <tr key={team.id}>
                    {Object.values(columns).map((key) => (
                      <td
                        key={key}
                        className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                      >
                        {
                          //@ts-ignore
                          valueToString(team[key], ["pointsSoFar", "questionPoints"].includes(key))
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
