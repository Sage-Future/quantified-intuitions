import {
  AboveBelowQuestion,
  CalibrationQuestion,
  Challenge,
} from "@prisma/client"
import { GetServerSideProps } from "next"
import { auth } from "../../lib/auth"
import { useEffect, useState } from "react"
import { Footer } from "../../components/Footer"
import { NavbarChallenge } from "../../components/NavbarChallenge"
import { Prisma } from "../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth(context.req, context.res)
  const userEmail = session?.user?.email

  if (!userEmail || !adminEmails.includes(userEmail)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  const existingChallenges = await Prisma.challenge.findMany({
    where: { isDeleted: false },
    orderBy: { startDate: "desc" },
    include: {
      fermiQuestions: true,
      aboveBelowQuestions: true,
    },
  })

  return {
    props: {
      existingChallenges: JSON.parse(JSON.stringify(existingChallenges)),
    },
  }
}

type ChallengeWithQuestions = Challenge & {
  fermiQuestions: CalibrationQuestion[]
  aboveBelowQuestions: AboveBelowQuestion[]
}
const AdminPage = ({
  existingChallenges,
}: {
  existingChallenges: ChallengeWithQuestions[]
}) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
      <div className="py-10 bg-gray-100 grow">
        <main>
          <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
            <div
              className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mb-4"
              role="alert"
            >
              <p className="font-bold">Warning</p>
              <p>
                Changes made here affect the production database and will be
                instantly visible to users.
              </p>
            </div>
            <div className="flex flex-col gap-12">
              <CloneChallengeForm existingChallenges={existingChallenges} />
              <ChallengeTable challenges={existingChallenges} />
            </div>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

const ChallengeTable = ({
  challenges,
}: {
  challenges: ChallengeWithQuestions[]
}) => {
  const handleView = (id: string) => {
    window.open(`/estimation-game/${id}`, "_blank")
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-3">Existing Challenges</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-3 py-1 text-left">Name</th>
            <th className="px-3 py-1 text-left">ID</th>
            <th className="px-3 py-1 text-left">Unlisted</th>
            <th className="px-3 py-1 text-left"></th>
          </tr>
        </thead>
        <tbody>
          {challenges.map((challenge) => (
            <tr key={challenge.id} className="border-b">
              <td className="px-3 py-1">{challenge.name}</td>
              <td className="px-3 py-1">{challenge.id}</td>
              <td className="px-3 py-1">
                {challenge.unlisted ? (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2 py-0.5 rounded">
                    Unlisted
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-1">
                <button
                  onClick={() => handleView(challenge.id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white text-xs font-bold py-1 px-2 rounded mr-2"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function CloneChallengeForm({
  existingChallenges,
}: {
  existingChallenges: ChallengeWithQuestions[]
}) {
  const [challengeToCloneId, setChallengeToCloneId] = useState("")
  const [newChallengeId, setNewChallengeId] = useState("")
  const [newChallengeName, setNewChallengeName] = useState("")
  const [selectedChallengeQuestions, setSelectedChallengeQuestions] = useState<{
    fermi: CalibrationQuestion[]
    aboveBelow: AboveBelowQuestion[]
  }>({ fermi: [], aboveBelow: [] })

  useEffect(() => {
    const selectedChallenge = existingChallenges.find(
      (challenge) => challenge.id === challengeToCloneId
    )
    if (selectedChallenge) {
      setSelectedChallengeQuestions({
        fermi: selectedChallenge.fermiQuestions,
        aboveBelow: selectedChallenge.aboveBelowQuestions,
      })
    } else {
      setSelectedChallengeQuestions({ fermi: [], aboveBelow: [] })
    }
  }, [challengeToCloneId, existingChallenges])

  const handleCloneChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    // Debug log the request body
    const requestBody = {
      challengeToCloneId,
      newChallengeId,
      newChallengeName,
    }
    console.log("Request body:", requestBody)
    const response = await fetch("/api/v0/cloneEstimationGame", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        challengeToCloneId,
        newChallengeId,
        newChallengeName,
      }),
    })
    if (response.ok) {
      alert("Challenge cloned successfully")
      setChallengeToCloneId("")
      setNewChallengeId("")
      setNewChallengeName("")
    } else {
      const error = await response.json()
      alert(`Error cloning challenge: ${error.error}`)
    }
  }

  return (
    <form onSubmit={handleCloneChallenge} className="space-y-4">
      <h2 className="text-lg font-semibold mb-3">Clone Challenge</h2>
      <div>
        <label
          htmlFor="challengeToClone"
          className="block text-sm font-medium text-gray-700"
        >
          Challenge to Clone
        </label>
        <select
          id="challengeToClone"
          value={challengeToCloneId}
          onChange={(e) => setChallengeToCloneId(e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Select a challenge</option>
          {existingChallenges.map((challenge) => (
            <option key={challenge.id} value={challenge.id}>
              {challenge.name}
            </option>
          ))}
        </select>
      </div>
      {challengeToCloneId && (
        <div className="mt-4">
          <h2 className="text-sm font-semibold mb-2">
            Questions in selected challenge:
          </h2>
          <h3 className="text-xs font-medium mt-2">Fermi Questions:</h3>
          <ul className="list-disc pl-5 text-xs">
            {selectedChallengeQuestions.fermi.map((question) => (
              <li key={question.id}>{question.content}</li>
            ))}
          </ul>
          <h3 className="text-xs font-medium mt-2">Above/Below Questions:</h3>
          <ul className="list-disc pl-5 text-xs">
            {selectedChallengeQuestions.aboveBelow.map((question) => (
              <li key={question.id}>{question.content}</li>
            ))}
          </ul>
        </div>
      )}
      <div>
        <label
          htmlFor="newChallengeId"
          className="block text-sm font-medium text-gray-700"
        >
          New Challenge ID
        </label>
        <input
          type="text"
          id="newChallengeId"
          value={newChallengeId}
          onChange={(e) => setNewChallengeId(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="newChallengeName"
          className="block text-sm font-medium text-gray-700"
        >
          New Challenge Name
        </label>
        <input
          type="text"
          id="newChallengeName"
          value={newChallengeName}
          onChange={(e) => setNewChallengeName(e.target.value)}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Clone Challenge
      </button>
    </form>
  )
}

export default AdminPage
