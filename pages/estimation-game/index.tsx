import { User } from "@prisma/client"
import { getSession } from "next-auth/react"
import { useRouter } from "next/router"

import { Footer } from "../../components/Footer"
import { JoinChallenge } from "../../components/JoinChallenge"
import { MailingListSignup } from "../../components/MailingListSignup"
import { NavbarChallenge } from "../../components/NavbarChallenge"
import { Prisma } from "../../lib/prisma"
import { ChallengeWithTeamsWithUsers } from "../../types/additional"

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx)
  if (!session) {
    return { props: {} }
  }
  const userId = session?.user?.id || ""

  const activeAndUpcomingChallenges = await Prisma.challenge.findMany({
    where: {
      isDeleted: false,
      unlisted: false,
      endDate: {
        gte: new Date()
      },
    },
    include: {
      teams: {
        include: {
          users: true
        },
      },
    },
  })

  return {
    props: {
      session,
      activeAndUpcomingChallenges,
      user: session.user,
    },
  }
}

const ChallengePage = ({
  activeAndUpcomingChallenges,
  user,
}: {
  activeAndUpcomingChallenges: ChallengeWithTeamsWithUsers[]
  user: User
}) => {
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
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
              <JoinChallenge
                challenge={challenge}
                key={challenge.id}
                user={user}
                onJoin={() => router.replace(`estimation-game/${challenge.id}`)}
              />
            ))}
          <div
            className="max-w-3xl mx-auto my-4"
            key="upcoming"
          >
            <h3 className="text-lg font-medium text-gray-900 text-center p-2">
              Upcoming
            </h3>
            <div className="flex flex-wrap gap-2">
              {
                activeAndUpcomingChallenges
                  .filter(challenge => challenge.startDate > new Date())
                  .map((challenge) => (
                    <div key={challenge.id} className="max-w-sm mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg">
                      <p className="font-semibold">{challenge.name}</p>
                      <p className="mb-2 text-gray-600">{challenge.startDate.toDateString()} - {challenge.endDate.toDateString()}</p>

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
      <Footer />
    </div>
  )
}

export default ChallengePage