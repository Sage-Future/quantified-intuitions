import { NextPage } from "next"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { ChallengeLeaderboardAllTime } from "../../components/ChallengeLeaderboardAllTime"
import { Footer } from "../../components/Footer"
import { NavbarChallenge } from "../../components/NavbarChallenge"

const Leaderboard: NextPage<{}> = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
      <div className="px-4 py-6 grow mx-auto">
      <div className="py-8 mx-auto">
        <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
          {"All-time leaderboard"}
        </h2>
        <h3 className="text-gray-600 prose">
          <Link href={`/estimation-game`}>The Estimation Game</Link>
        </h3>
        <ChallengeLeaderboardAllTime userId={user?.id} />
      </div>
    </div>

      <Footer />
    </div>
  )
}
export default Leaderboard
