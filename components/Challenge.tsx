import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { event } from "nextjs-google-analytics";
import { useState } from "react";
import { CHALLENGE_CONFIDENCE_INTERVAL } from "../lib/services/magicNumbers";
import { ChallengeWithTeamsWithUsersAndQuestions } from "../types/additional";
import { AboveBelowForm } from "./AboveBelowForm";
import { ChallengeLeaderboard } from "./ChallengeLeaderboard";
import { Countdown } from "./Countdown";
import { FermiForm } from "./FermiForm";

export const Challenge = ({
  challenge,
  teamId,
}: {
  challenge: ChallengeWithTeamsWithUsersAndQuestions;
  teamId: string,
}) => {
  const [fermiQuestionNum, setFermiQuestionNum] = useState(challenge.fermiQuestions && challenge.fermiQuestions.findIndex(
    question => !question.teamAnswers.some(answer => answer.teamId === teamId)
  ));
  const [aboveBelowQuestionNum, setAboveBelowQuestionNum] = useState(challenge.aboveBelowQuestions &&
    challenge.aboveBelowQuestions.findIndex(
      question => !question.teamAnswers.some(answer => answer.teamId === teamId)
    )
  );

  const accumulatePoints = (acc: number, question: { teamAnswers: { teamId: string, score: number }[] }) => {
    const teamAnswer = question.teamAnswers.find(answer => answer.teamId === teamId);
    return teamAnswer ? acc + teamAnswer.score : acc;
  };
  const [fermiScore, setFermiScore] = useState(challenge.fermiQuestions.reduce(accumulatePoints, 0));
  const [aboveBelowScore, setAboveBelowScore] = useState(challenge.aboveBelowQuestions.reduce(accumulatePoints, 0));

  const [questionComplete, setQuestionComplete] = useState(false);
  const [introsShown, setIntrosShown] = useState({ fermi: false, aboveBelow: false });

  const fermiComplete = !challenge.fermiQuestions || fermiQuestionNum === -1 || fermiQuestionNum >= challenge.fermiQuestions.length;
  const aboveBelowComplete = !challenge.aboveBelowQuestions || aboveBelowQuestionNum === -1 || aboveBelowQuestionNum >= challenge.aboveBelowQuestions.length;
  const challengeComplete = fermiComplete && aboveBelowComplete;

  const fermiQuestion = fermiComplete ? undefined : challenge.fermiQuestions[fermiQuestionNum];
  const aboveBelowQuestion = ((fermiComplete && !challengeComplete) || !challenge.aboveBelowQuestions) && challenge.aboveBelowQuestions[aboveBelowQuestionNum];

  const nextQuestionEvent = () => event("estimation_game_next_question", {
    app: "estimation_game",
    challenge_id: challenge.id,
    challenge_name: challenge.name,
    team_id: teamId,
  });

  return (
    <div className="px-4 py-6 grow">
      <div className="py-8 max-w-prose mx-auto">
        <div className="max-w-prose mx-auto flex justify-between ">
          <div className="prose">
            <h4 className="my-0 text-gray-500">{challenge.name}</h4>
            <Countdown
              countdownToDate={challenge.endDate}
              completeText={"Game finished!"}
              tickdownSuffix={"remaining"}
            />
            {!challengeComplete &&
              <h4 className="pt-8 text-gray-500">Question {
                (
                  fermiQuestionNum === -1 ?
                    Math.max(1, challenge.fermiQuestions.length || 0)
                    :
                    fermiQuestionNum + (fermiComplete ? 0 : 1)
                )
                + aboveBelowQuestionNum
                + (fermiComplete ? 1 : 0)
              }/{
                  challenge.fermiQuestions.length + challenge.aboveBelowQuestions.length
                }</h4>
            }
          </div>
          <div className="prose">
            <h4 className="my-0 text-gray-700">{challenge.teams.find(t => t.id === teamId)?.name}</h4>
            <h2 className="my-0 text-gray-500 text-[16px]">Round 1 </h2>
            <h2 className="my-0">
              {fermiScore.toFixed(2)}
              <span className="text-gray-500 text-[16px]"> points</span>
            </h2>

            {fermiComplete && <>
              <h2 className="mt-2 mb-0 text-gray-500 text-[16px]">Round 2 </h2>
              <h2 className="my-0">
                {aboveBelowScore.toFixed(2)}
                <span className="text-gray-500 text-[16px]"> points</span>
              </h2>
            </>}
          </div>
        </div>

        {!challengeComplete && (fermiQuestion || aboveBelowQuestion) ?
          (!fermiComplete && fermiQuestion ?
            <>
              {!introsShown.fermi &&
                <div className="prose bg-indigo-100 rounded-md p-4 my-6">
                  <h3 className="my-0">{"Round 1: Estimation Intervals"}</h3>
                  <p className="my-0">{"Estimate a lower and upper bound for the question below."}</p>
                  <p className="my-0">{"A narrower interval gets you more points, if you're right."}</p>
                  <p className="my-0">{"But if you're wrong, a narrower interval loses you more points!"}</p>

                  <div className="mt-4 mb-2 text-sm flex flex-row">
                    <InformationCircleIcon className="mr-2 basis-10 text-indigo-500 inline-block" />
                    <p className="my-0">
                      {`To maximise your score, enter your ${CHALLENGE_CONFIDENCE_INTERVAL}% confidence interval: a range narrow enough that you think there's a ${CHALLENGE_CONFIDENCE_INTERVAL}% chance the right answer is inside it.`}
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setIntrosShown({ ...introsShown, fermi: true })}
                    >
                      {"Got it"}
                    </button>
                  </div>
                </div>}
              <FermiForm
                calibrationQuestion={fermiQuestion}
                key={fermiQuestion.id}
                teamId={teamId}
                addToScore={(score) => setFermiScore(fermiScore + score)}
                nextQuestion={() => {
                  setFermiQuestionNum(fermiQuestionNum + 1)
                  nextQuestionEvent()
                }}
                reduceCountdown={() => { }}
                setQuestionComplete={setQuestionComplete}
                showScoringHint={fermiQuestionNum === 0}
              />
            </>
            :
            aboveBelowQuestion &&
            <>
              {!introsShown.aboveBelow &&
                <div className="prose bg-indigo-100 rounded-md p-4 my-6">
                  <h3 className="my-0">{"Round 2: Above or Below"}</h3>
                  <p className="my-0">{"Estimate if the real quantity is above or below the amount below."}</p>
                  <p className="my-0">{"In this round, the goal is to get the biggest score you can!"}</p>
                  <p className="my-0">{"Higher confidence gets you more points, if you're right."}</p>
                  <p className="my-0">{"But if you're wrong, higher confidence loses you more points!"}</p>
                  <div className="pt-2">
                    <button
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => setIntrosShown({ ...introsShown, aboveBelow: true })}
                    >
                      {"Got it"}
                    </button>
                  </div>
                </div>}
              <AboveBelowForm
                aboveBelowQuestion={aboveBelowQuestion}
                key={aboveBelowQuestion.id}
                teamId={teamId}
                addToScore={(newPoints) => setAboveBelowScore(aboveBelowScore + newPoints)}
                setQuestionComplete={setQuestionComplete}
                nextQuestion={() => {
                  setAboveBelowQuestionNum(aboveBelowQuestionNum + 1)
                  nextQuestionEvent()
                }}
                showScoringHint={false}
              />
            </>
          )
          :
          <p>Challenge complete!</p>
        }

        {(questionComplete || challengeComplete) && <ChallengeLeaderboard
          challengeId={challenge.id}
          teamId={teamId}
          latestQuestion={challengeComplete ?
            null
            :
            {
              type: fermiComplete ? "aboveBelow" : "fermi",
              indexWithinType: fermiComplete ? aboveBelowQuestionNum : fermiQuestionNum,
            }
          }
        />}
      </div>
    </div>
  )
}