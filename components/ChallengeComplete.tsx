import Link from "next/link";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";
import { apps } from "../pages";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";
import { AppCard } from "./AppCard";
import { ChallengeLeaderboard } from "./ChallengeLeaderboard";
import { MailingListSignup } from "./MailingListSignup";
import { OpenEndedQuestions } from "./OpenEndedQuestions";
import {TrophyIcon} from '@heroicons/react/24/solid';

export function ChallengeComplete({
  challenge,
  teamId,
}: {
  challenge: ChallengeWithTeamsWithUsersAndQuestions;
  teamId: string
}) {
  const [showConfetti, setShowConfetti] = useState<boolean>(false)
  useEffect(() => {
    setShowConfetti(true)
  })

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <h3 className="text-lg text-center font-semibold mt-12" > Challenge complete!</h3>
        <div className="mx-auto">
          <Confetti
            active={showConfetti}
            config={{
              colors: [
                "#4338ca", "#818cf8"
              ]
            }}
          />
        </div>

        <OpenEndedQuestions />
      </div>

      <div className="max-h-[405px] overflow-y-auto">
        <ChallengeLeaderboard
          challengeId={challenge.id}
          teamId={teamId}
          latestQuestion={null}
        />
      </div>

      <div>
        <div className="text-center my-12 mx-auto text-gray-500 hover:underline">
          <Link href="https://forms.gle/792QQAfqTrutAH9e6">Suggest a question for a future Estimation Game</Link>
        </div>

        <div className="max-w-sm my-12 mx-auto">
          <MailingListSignup
            buttonText="Email me when the next Estimation Game starts"
            tags={["estimation-game-reminder", `end-game-${challenge.name}`]}
          />
        </div>

        <div className="text-center">
          <Link href={`/estimation-game/leaderboard`} passHref className="mx-auto">
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

        <h3 className="text-lg font-semibold mt-12">More tools from Quantified Intuitions</h3>
        <div className="flex flex-wrap gap-2 py-4">
          {apps.filter(app => app.name !== "The Estimation Game").map(app => <AppCard key={app.name} app={app} />)}
        </div>
      </div>
    </>
  )
}