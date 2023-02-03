import { GetServerSideProps, NextPage } from "next"
import { Session } from "next-auth"
import { getSession, useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { Challenge } from "../../components/Challenge"
import { Footer } from "../../components/Footer"
import { JoinChallenge } from "../../components/JoinChallenge"
import { NavbarChallenge } from "../../components/NavbarChallenge"
import { Prisma } from "../../lib/prisma"
import { ChallengeWithTeamsWithUsersAndQuestions } from "../../types/additional"

export type ChallengeProps = {
  challenge: ChallengeWithTeamsWithUsersAndQuestions
  session: Session
}

export const getServerSideProps: GetServerSideProps<ChallengeProps | {}> = async (
  ctx
) => {
  const session = await getSession(ctx)
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" })
    ctx.res.end()
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

const RoomPage: NextPage<ChallengeProps> = ({ challenge }) => {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  const usersTeam = challenge?.teams.find((team) =>
    team.users.some((theUser) => theUser.id === user?.id)
  )

  console.log(challenge)

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />

      {
        challenge ?
          (
            usersTeam ?
              <Challenge teamId={usersTeam.id} challenge={challenge} />
              :
              user && <JoinChallenge challenge={challenge} user={user} onJoin={() => {router.replace(router.asPath)}} />
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
export default RoomPage
