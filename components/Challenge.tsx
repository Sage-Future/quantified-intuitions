import { useState } from "react";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";
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

  const challengeComplete = questionNum === -1 || questionNum >= challenge.fermiQuestions.length
  const question = challengeComplete ? undefined : challenge.fermiQuestions[questionNum];

  return (
    <div className="py-6 grow">
      <div className="pt-8 max-w-prose mx-auto">
        <p className="text-gray-600  text-md">{challenge.name}</p>
        <p className="text-gray-400  text-sm">{challenge.teams.find(t => t.id === teamId)?.name}</p>
        <p className="pt-4">Score: {score}</p>
        {question ?
          <FermiForm
            calibrationQuestion={question}
            key={question.id}
            teamId={teamId}
            addToSessionScore={(newPoints) => setScore(score + newPoints)}
            nextQuestion={() => setQuestionNum(questionNum + 1)}
            reduceCountdown={() => { }}
          />
          :
          <p>Challenge complete!</p>
        }

        <ChallengeLeaderboard
          challenge={challenge}
          teamId={teamId}
          latestQuestionIndex={challengeComplete ? undefined : questionNum}
        />
      </div>
    </div>
  )
}