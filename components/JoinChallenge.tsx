import {
  GlobeAsiaAustraliaIcon,
  TrophyIcon,
  UsersIcon,
  WifiIcon,
} from "@heroicons/react/24/solid"
import { Challenge } from "@prisma/client"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import useSWR from "swr"
import { fetcher } from "../lib/services/data"
import { Countdown } from "./Countdown"
import { Errors } from "./Errors"
import { LoadingButton } from "./LoadingButton"
import { Success } from "./Success"

export const JoinChallenge = ({
  challenge,
  user,
  onJoin,
}: {
  challenge: Challenge
  user: User | undefined
  onJoin: (teamId: string | undefined) => void
}) => {
  const { data: session } = useSession()
  const { data: existingTeamId } = useSWR(
    session?.user
      ? `/api/v0/getChallengeTeamId?challengeId=${challenge.id}`
      : null,
    fetcher
  )
  const { register, handleSubmit } = useForm()
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const createTeam = async (data: any, challengeId: string) => {
    setErrors([])
    setSuccess("")
    if (data.teamName.length < 2 || data.teamName.length > 50) {
      setErrors(["Team name must be between 2 and 50 characters"])
      return
    }
    if (!data.numPlayers || data.numPlayers < 1) {
      setErrors(["Number of players must be at least 1"])
      return
    }

    console.log({ num: data.numPlayers })

    setIsLoading(true)
    await fetch("/api/v0/createTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.teamName,
        numPlayers: parseInt(data.numPlayers, 10),
        challengeId,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        const teamId = await res.json()
        onJoin(teamId)
      } else {
        setErrors(["There was an error creating your team"])
      }
    })
  }

  return (
    <div className="py-10 bg-gray-100 grow">
      <div
        className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg"
        key={challenge.id}
      >
        <form onSubmit={handleSubmit((data) => createTeam(data, challenge.id))}>
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {challenge.name}
                  {challenge.subtitle ? (
                    <span className="hidden md:inline">: </span>
                  ) : (
                    ""
                  )}
                  <span className="block md:inline text-md md:text-lg text-gray-500 md:text-gray-900">
                    {challenge?.subtitle}
                  </span>
                </h3>
                <Countdown
                  countdownToDate={challenge.endDate}
                  completeText={null}
                  tickdownSuffix={"remaining"}
                />

                <div className="mt-4 text-sm">
                  <ul className="list-none space-y-4 pl-0">
                    <li className="flex items-center space-x-3">
                      <GlobeAsiaAustraliaIcon className="flex-shrink-0 mr-1 w-5 h-5 text-indigo-500 inline-block" />
                      <span>{`Answer ${
                        challenge.id === "nontrivial-april" ? 8 : 10 // dumb hack
                      } questions to train your estimation skills`}</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <UsersIcon className="flex-shrink-0 mr-1 w-5 h-5 text-indigo-500 inline-block" />{" "}
                      <span>{"Play solo or team up with friends"}</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <TrophyIcon className="flex-shrink-0 mr-1 w-5 h-5 text-indigo-500 inline-block" />
                      <span>
                        {"See how your scores compare on the "}
                        <Link
                          href={`/estimation-game/${challenge.id}/leaderboard`}
                        >
                          <a className="underline">leaderboard</a>
                        </Link>
                      </span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <WifiIcon className="flex-shrink-0 mr-1 w-5 h-5 text-indigo-500 inline-block" />
                      <span>
                        {
                          "Estimate based on your knowledge - don't look things up online"
                        }
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
              {!existingTeamId && user && (
                <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="teamName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Team name
                    </label>
                    <div className="mt-1">
                      <input
                        type="text"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register("teamName")}
                        defaultValue={""}
                        autoFocus
                      />
                    </div>
                    <label
                      htmlFor="numPlayers"
                      className="block text-sm font-medium text-gray-700 mt-4"
                    >
                      Number of players
                    </label>
                    <div className="mt-1">
                      <input
                        type="number"
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        {...register("numPlayers")}
                        defaultValue={1}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div>
            {errors.length > 0 && (
              <div className="pt-5">
                <Errors errors={errors} />
              </div>
            )}
            {success !== "" && (
              <div className="pt-5">
                <Success message={success} onClose={() => setSuccess("")} />
              </div>
            )}
            <div className="pt-5">
              <div className="flex justify-end">
                {existingTeamId || !user ? (
                  <LoadingButton
                    isLoading={false}
                    buttonText={existingTeamId ? "Resume game" : "Join game"}
                    loadingText={
                      existingTeamId ? "Resuming game..." : "Joining game..."
                    }
                    submit={false}
                    onClick={() => onJoin(existingTeamId)}
                  />
                ) : (
                  <LoadingButton
                    isLoading={isLoading}
                    buttonText="Join game"
                    loadingText="Joining game..."
                    submit={true}
                    onClick={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
