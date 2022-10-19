import { useState } from "react";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";
import { ChallengeCountdown } from "./ChallengeCountdown";
import { ChallengeLeaderboard } from "./ChallengeLeaderboard";
import { FermiForm } from "./FermiForm";

export const Challenge = ({
  challenge,
  teamId,
}: {
  challenge: ChallengeWithTeamsWithUsersAndQuestions;
  teamId: string,
}) => {
  const [questionNum, setQuestionNum] = useState(challenge.fermiQuestions.findIndex(
    question => !question.teamAnswers.some(answer => answer.teamId === teamId)
  ));
  const [score, setScore] = useState(challenge.fermiQuestions.reduce((acc, question) => {
    const teamAnswer = question.teamAnswers.find(answer => answer.teamId === teamId);
    return teamAnswer ? acc + teamAnswer.score : acc;
  }, 0));
  const [questionComplete, setQuestionComplete] = useState(false);

  const challengeComplete = questionNum === -1 || questionNum >= challenge.fermiQuestions.length
  const question = challengeComplete ? undefined : challenge.fermiQuestions[questionNum];

  return (
    <div className="px-4 py-6 grow">
      <div className="py-8 max-w-prose mx-auto">
        <div className="max-w-prose mx-auto flex justify-between ">
          <div className="prose">
            <h4 className="my-0 text-gray-600  text-md">{challenge.name}</h4>
            <ChallengeCountdown challenge={challenge} />
          </div>
          <div className="prose">
            <h4 className="my-0 text-gray-500">{challenge.teams.find(t => t.id === teamId)?.name}</h4>
            <h4 className="my-0 text-gray-400 text-sm">Score:</h4>
            <h2 className="my-0">
              {score.toFixed(2)}
              <span className="text-gray-500 text-[16px]"> points</span>
            </h2>
          </div>
        </div>
        {question ?
          <FermiForm
            calibrationQuestion={question}
            key={question.id}
            teamId={teamId}
            addToSessionScore={(newPoints) => setScore(score + newPoints)}
            nextQuestion={() => setQuestionNum(questionNum + 1)}
            reduceCountdown={() => { }}
            setQuestionComplete={setQuestionComplete}
          />
          :
          <p>Challenge complete!</p>
        }

        {questionComplete && <ChallengeLeaderboard
          challengeId={challenge.id}
          teamId={teamId}
          latestQuestionIndex={challengeComplete ? undefined : questionNum}
        />}
      </div>
    </div>
  )
}