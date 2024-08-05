import {
  CheckCircleIcon,
  PlayIcon,
  TrophyIcon,
} from "@heroicons/react/24/solid"
import { User } from "@prisma/client"
import clsx from "clsx"
import { getSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Countdown } from "../../components/Countdown"

import { Footer } from "../../components/Footer"
import { JoinChallenge } from "../../components/JoinChallenge"
import { MailingListSignup } from "../../components/MailingListSignup"
import { NavbarChallenge } from "../../components/NavbarChallenge"
import { QuickFeedback } from "../../components/QuickFeedback"
import { Prisma } from "../../lib/prisma"
import { ChallengeWithTeamsWithUsers } from "../../types/additional"

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx)

  const activeChallenges = await Prisma.challenge.findMany({
    where: {
      isDeleted: false,
      unlisted: false,
    },
    include: {
      teams: {
        include: {
          users: true,
        },
        where: {
          AND: [
            session?.user?.id
              ? {
                  users: {
                    some: {
                      id: session?.user?.id,
                    },
                  },
                }
              : {},
          ],
        },
      },
    },
  })

  return {
    props: {
      session,
      activeChallenges: activeChallenges.map((challenge) => ({
        ...challenge,
        teams: challenge.teams.filter((team) =>
          team.users.some((user) => user.id == session?.user?.id)
        ),
      })),
      user: session?.user,
    },
  }
}

const ChallengePage = ({
  activeChallenges,
  user,
}: {
  activeChallenges: ChallengeWithTeamsWithUsers[]
  user: User
}) => {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
      <div className="py-10 bg-gray-100 grow">
        <main>
          {activeChallenges?.length == 0 && (
            <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg">
              <p>Check back soon for the next game</p>
            </div>
          )}
          {activeChallenges
            ?.filter(
              (challenge) =>
                challenge.startDate <= new Date() &&
                challenge.endDate > new Date()
            )
            .map((challenge) => (
              <JoinChallenge
                challenge={challenge}
                key={challenge.id}
                user={user}
                onJoin={() => router.replace(`estimation-game/${challenge.id}`)}
              />
            ))}
          <div className="max-w-3xl mx-auto my-4">
            <h3 className="text-lg font-medium text-gray-900 text-center p-4">
              Upcoming
            </h3>
            <div className="flex flex-wrap gap-2">
              {activeChallenges
                ?.filter((challenge) => challenge.startDate > new Date())
                .sort((a, b) => a.startDate.getTime() - b.startDate.getTime())
                .map((challenge) => (
                  <div
                    key={challenge.id}
                    className="flex flex-col max-w-sm mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg"
                  >
                    <p className="font-semibold">{challenge.name}</p>
                    <p
                      className={clsx(
                        "text-gray-600 pb-2 text-sm",
                        !challenge.subtitle && "text-transparent"
                      )}
                    >
                      {challenge?.subtitle || "."}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {challenge.startDate.toDateString()} -{" "}
                      {challenge.endDate.toDateString()}
                    </p>
                    <div className="mb-2">
                      <Countdown
                        countdownToDate={challenge.startDate}
                        completeText={
                          "The game begins! Refresh this page to join"
                        }
                        tickdownPrefix={"Starts in"}
                        tickdownSuffix={""}
                      />
                    </div>

                    <MailingListSignup
                      buttonText="Remind me when it starts"
                      tags={[
                        "estimation-game-reminder",
                        `estimation-game-reminder: ${challenge.name}`,
                      ]}
                    />
                  </div>
                ))}
            </div>

            <h3 className="text-lg font-medium text-gray-900 text-center p-4 pt-12">
              Archives
            </h3>
            <div className="flex flex-wrap gap-2 gap-y-4">
              {activeChallenges
                ?.filter((challenge) => challenge.endDate < new Date())
                .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
                .map((challenge) => {
                  const challengeComplete =
                    user &&
                    challenge.teams.some((team) =>
                      team.users.some((u) => u.id == user.id)
                    )

                  return (
                    <div
                      key={challenge.id}
                      className="flex flex-col w-[19 rem] mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg"
                    >
                      <p className="font-semibold">{challenge.name}</p>
                      <p className="text-gray-500 text-sm pb-2">
                        {challenge?.subtitle || "General knowledge"}
                      </p>

                      <div className="flex-shrink flex gap-2 py-2">
                        <Link
                          href={`/estimation-game/${challenge.id}`}
                          passHref
                        >
                          <a
                            type="button"
                            className={clsx(
                              "relative inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                              challengeComplete
                                ? "bg-gray-400"
                                : "bg-indigo-600"
                            )}
                          >
                            {challengeComplete ? (
                              <>
                                <CheckCircleIcon
                                  className="-ml-1 mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span>Played</span>
                              </>
                            ) : (
                              <>
                                <PlayIcon
                                  className="-ml-1 mr-2 h-5 w-5"
                                  aria-hidden="true"
                                />
                                <span className="mr-3">Play</span>
                              </>
                            )}
                          </a>
                        </Link>
                        <Link
                          href={`/estimation-game/${challenge.id}/leaderboard`}
                          passHref
                        >
                          <a
                            type="button"
                            className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                          >
                            <TrophyIcon
                              className="-ml-1 mr-2 h-5 w-5"
                              aria-hidden="true"
                            />
                            <span>Leaderboard</span>
                          </a>
                        </Link>
                      </div>
                    </div>
                  )
                })}
            </div>

            <div className="text-center py-16">
              <Link
                href={`/estimation-game/leaderboard`}
                passHref
                className="mx-auto"
              >
                <a
                  type="button"
                  className="text-lg inline-flex mx-auto items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  <TrophyIcon
                    className="-ml-1 mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                  <span>All-time leaderboard</span>
                </a>
              </Link>
            </div>

            <div className="mx-auto text-center">
              <QuickFeedback
                placeholder="Suggest a question for a future Estimation Game..."
                type="TEG suggest question"
                style="textarea"
              />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default ChallengePage
