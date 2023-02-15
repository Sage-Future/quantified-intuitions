import { GetServerSideProps, NextPage } from "next"
import { Session } from "next-auth"
import { getSession, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChallengeLeaderboard } from "../../../components/ChallengeLeaderboard"
import { Footer } from "../../../components/Footer"
import { NavbarChallenge } from "../../../components/NavbarChallenge"
import { Prisma } from "../../../lib/prisma"
import { ChallengeWithTeamsWithUsersAndQuestions } from "../../../types/additional"

export type ChallengeProps = {
  challenge: ChallengeWithTeamsWithUsersAndQuestions
  session: Session
}

export const getServerSideProps: GetServerSideProps<ChallengeProps | {}> = async (
  ctx
) => {
  const session = await getSession(ctx)
  if (!session) {
    return { props: {} }
  }
  const challengeId = ctx.query.id as string

  const challenge = await Prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      fermiQuestions: {
        include: {
          teamAnswers: true
        }
      },
      aboveBelowQuestions: {
        include: {
          teamAnswers: true
        }
      },
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
      challenge,
    },
  }
}

const Leaderboard: NextPage<ChallengeProps> = ({ challenge }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const usersTeam = challenge?.teams.find((team) =>
    team.users.some((theUser) => theUser.id === user?.id)
  )

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />

      {
        challenge ?
          (
            <div className="px-4 py-6 grow mx-auto">
              <div className="py-8 mx-auto">
                <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
                  {"Leaderboard"}
                </h2>
                <h3 className="text-gray-600 prose">
                  <Link href={`/estimation-game/${challenge.id}`}>{challenge.name}</Link>
                </h3>
                <ChallengeLeaderboard challengeId={challenge.id} latestQuestion={null} teamId={usersTeam?.id} />
              </div>
            </div>
          )
          :
          (
            <div className="py-10 bg-gray-100 grow">
              <p className="prose max-w-prose m-auto">{"That Estimation Game doesn't exist. "}
                <Link href="/estimation-game">{"See all public current and upcoming games."}</Link>
              </p>
            </div>
          )
      }

      <Footer />
    </div>
  )
}
export default Leaderboard
