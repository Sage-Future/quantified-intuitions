import Link from "next/link";
import { apps } from "../pages";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";
import { AppCard } from "./AppCard";
import { ChallengeLeaderboard } from "./ChallengeLeaderboard";
import { MailingListSignup } from "./MailingListSignup";

export function ChallengeComplete({
  challenge,
  teamId,
}: {
  challenge: ChallengeWithTeamsWithUsersAndQuestions;
  teamId: string
}) {
  return (
    <div>
      <h3 className="text-lg font-semibold mt-12">Challenge complete!</h3>

      <ChallengeLeaderboard
        challengeId={challenge.id}
        teamId={teamId}
        latestQuestion={null}
      />

      <div className="text-center my-12 mx-auto text-gray-500 hover:underline">
        <Link href="https://forms.gle/792QQAfqTrutAH9e6">Suggest a question for a future Estimation Game</Link>
      </div>

      <div className="max-w-sm my-12 mx-auto">
        <MailingListSignup
          buttonText="Email me when the next Estimation Game starts"
          tags={["estimation-game-reminder", `end-game-${challenge.name}`]}
        />
      </div>

      <h3 className="text-lg font-semibold mt-12">More tools</h3>
      <div className="flex flex-wrap gap-2 py-4">
        {apps.filter(app => app.name !== "The Estimation Game").map(app => <AppCard key={app.name} app={app} />)}
      </div>
    </div>
  )
}