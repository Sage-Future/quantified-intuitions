import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ChallengeWithTeamsWithUsers } from "../types/additional";
import { ChallengeCountdown } from "./ChallengeCountdown";
import { Errors } from "./Errors";
import { LoadingButton } from "./LoadingButton";
import { MailingListSignup } from "./MailingListSignup";
import { Success } from "./Success";


export const JoinChallenge = ({
  user,
  activeAndUpcomingChallenges,
  setCurrentChallenge,
}: {
  user: User;
  activeAndUpcomingChallenges: ChallengeWithTeamsWithUsers[];
  setCurrentChallenge: (challenge: { challengeId: string, teamId: string }) => void;
}) => {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const createTeam = async (data: any, challengeId: string) => {
    console.log(data);
    setErrors([]);
    setSuccess("");
    //team name must only contain letters, numbers, and spaces and cannot only be spaces
    if (
      data.teamName.length < 2 ||
      data.teamName.length > 50 ||
      !/^[a-zA-Z0-9 ]*$/.test(data.teamName)
    ) {
      setErrors([
        "Team name must be between 2 and 50 characters and only contain letters, numbers, and spaces.",
      ]);
      return;
    }
    setIsLoading(true);
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
        const teamId = await res.json();
        router.replace(router.asPath);
      } else {
        setErrors(["There was an error creating your team"]);
      }
    });
  };

  return (
    <div className="py-10 bg-gray-100 grow">
      <main>
        {activeAndUpcomingChallenges.length == 0 && (<div
          className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg"
        >
          <p>Check back soon for the next game</p>
        </div>)
        }
        {activeAndUpcomingChallenges
          .filter(challenge => challenge.startDate <= new Date())
          .map((challenge) => (
            <div
              className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg"
              key={challenge.id}
            >
              {challenge.teams.some((team) => team.users.some((u) => u.id === user.id)) ?
                <div className="text-gray-500">
                  Resuming game...
                </div>
                :
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
                        <LoadingButton
                          isLoading={isLoading}
                          buttonText="Join challenge"
                          loadingText="Joining challenge..."
                          submit={true}
                          onClick={() => { }}
                        />
                      </div>
                    </div>
                  </div>
                </form>
              }
            </div>
          ))}
        <div
          className="max-w-3xl mx-auto my-4"
          key="upcoming"
        >
          <h3 className="text-lg font-medium text-gray-900 text-center p-2">
            Upcoming
          </h3>
          <div className="flex gap-2">
            {
              activeAndUpcomingChallenges
                .filter(challenge => challenge.startDate > new Date())
                .map((challenge) => (
                  <div key={challenge.id} className="max-w-sm mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg">
                    <p className="font-semibold">{challenge.name}</p>
                    <p className="mb-2 text-gray-600">{challenge.startDate.toLocaleDateString()} - {challenge.endDate.toLocaleDateString()}</p>

                    <MailingListSignup
                      buttonText="Remind me when it starts"
                      tags={["estimation-game-reminder", `estimation-game-reminder: ${challenge.name}`]}
                    />
                  </div>
                ))
            }
          </div>
        </div>
      </main>
    </div>
  );
};
