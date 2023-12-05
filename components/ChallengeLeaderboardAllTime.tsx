
import { ChevronDownIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import { useState } from "react";
import { deserialize } from "superjson";
import { SuperJSONValue } from "superjson/dist/types";
import useSWR from "swr";
import { fetcher } from "../lib/services/data";
import { getChallengeLeaderboardAllTimeReturnType } from "../pages/api/v0/getChallengeLeaderboardAllTime";

export const ChallengeLeaderboardAllTime = ({
  userId,
}: {
  userId: string | undefined
}) => {
  const { data } = useSWR<SuperJSONValue>(`/api/v0/getChallengeLeaderboardAllTime`,
    fetcher,
    { revalidateOnMount: true }
  );
  const userScores = deserialize({
    json: data?.json,
    meta: data?.meta
  }) as getChallengeLeaderboardAllTimeReturnType;

  const [sortByAvg, setSortByAvg] = useState(false)

  const userScoresSorted = userScores?.sort((a, b) => {
    if (sortByAvg) {
      return b.avgScore - a.avgScore
    } else {
      return b.totalScore - a.totalScore
    }
  })

  if (!userScores) {
    return <div className="pt-2">Drumroll please...</div>
  }

  const columns = [
    " ",
    "  ",
    "Total score",
    "Average score",
    "Challenges",
  ]
  return (
    <div className="my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((header) => (
                    //header is valid sort type
                    <th
                      key={header}
                      onClick={() => {
                        if (header === "Total score") {
                          setSortByAvg(false)
                        } else if (header === "Average score") {
                          setSortByAvg(true)
                        }
                      }}
                      scope="col"
                      className={clsx(
                        "px-3 py-3.5 pt-3.5 first:pl-4 first:pr-3 text-right text-sm font-semibold text-gray-500 first:sm:pl-6",
                        (header === "Total score" && sortByAvg) || (header === "Average score" && !sortByAvg) ? "cursor-pointer" : ""
                      )}
                    >
                      {header}
                      {
                        header === "Total score" && !sortByAvg &&
                           <ChevronDownIcon className="inline" height={16} />
                      }
                      {
                        header === "Average score" && sortByAvg &&
                           <ChevronDownIcon className="inline" height={16} />
                      }
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {userScoresSorted.map((userScore, userScoreIndex) => (
                  <tr key={userScore.user.id} className={clsx((userId && userScore.user.id === userId) && "bg-indigo-200")}>
                    <td
                      key={"place"}
                      className="whitespace-nowrap px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                    >
                      <div className={clsx((userScoreIndex + 1) <= 3 && ["bg-amber-200", "bg-slate-200", "bg-orange-200"][userScoreIndex],
                        "w-5 h-5 text-xs flex items-center justify-center rounded-full")}>
                        {userScoreIndex + 1}
                      </div>
                    </td>
                    <td
                      key={"team"}
                      className="whitespace-nowrap overflow-x-auto max-w-[12rem] px-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                    >
                      {userScore.user.name}
                    </td>
                    {[
                      {key: "totalScore", value: userScore.totalScore}, 
                      {key: "avgScore", value: userScore.avgScore},
                      {key: "challengesParticipated", value: userScore.challengesParticipated}, 
                    ].map((kv) => (
                      <td
                        key={kv.key}
                        className="whitespace-nowrap text-right px-3 mr-3 py-4 first:pl-4 first:pr-3 text-sm font-medium text-gray-900 first:sm:pl-6"
                      >
                        {kv.key === "challengesParticipated" ? kv.value : kv.value.toFixed(2).toString()}
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
