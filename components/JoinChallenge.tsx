import { User } from "next-auth"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ChallengeWithTeamsWithUsers } from "../types/additional"
import { ChallengeCountdown } from "./ChallengeCountdown"
import { Errors } from "./Errors"
import { LoadingButton } from "./LoadingButton"
import { Success } from "./Success"


export const JoinChallenge = ({
  challenge,
  user,
  onJoin,
}: {
  challenge: ChallengeWithTeamsWithUsers
  user: User
  onJoin: (teamId: string) => void
}) => {
  const { register, handleSubmit } = useForm()
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const createTeam = async (data: any, challengeId: string) => {
    console.log(data)
    setErrors([])
    setSuccess("")
    //team name must only contain letters, numbers, and spaces and cannot only be spaces
    if (
      data.teamName.length < 2 ||
      data.teamName.length > 50 ||
      !/^[a-zA-Z0-9 ]*$/.test(data.teamName)
    ) {
      setErrors([
        "Team name must be between 2 and 50 characters and only contain letters, numbers, and spaces.",
      ])
      return
    }
    setIsLoading(true)
    await fetch("/api/v0/createTeam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.teamName,
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

  const existingTeam = challenge.teams.find((team) =>
    team.users.some((u) => u.id === user.id)
  )

  return (
    <div className="py-10 bg-gray-100 grow">
      <div
        className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg"
        key={challenge.id}
      >
        <form
          className="space-y-8 divide-y divide-gray-200"
          onSubmit={handleSubmit((data) => createTeam(data, challenge.id))}
        >
          <div className="space-y-8 divide-y divide-gray-200">
            <div>
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {challenge.name}
                </h3>
                <ChallengeCountdown challenge={challenge} />
                <p className="pt-4 text-sm text-gray-500">
                  Assemble your friends to train your estimation skills!
                </p>
              </div>
              <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {!existingTeam &&
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
                      />
                    </div>
                  </div>
                }
              </div>
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
                {existingTeam ?
                    <LoadingButton
                      isLoading={false}
                      buttonText="Resume game"
                      loadingText="Resuming game..."
                      submit={false}
                      onClick={() => onJoin(existingTeam.id)}
                    />
                  :
                    <LoadingButton
                      isLoading={isLoading}
                      buttonText="Join game"
                      loadingText="Joining game..."
                      submit={true}
                      onClick={() => { }}
                    />
                }
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
