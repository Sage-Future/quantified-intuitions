import { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "superjson"

import { AboveBelowQuestion, CalibrationQuestion, Team } from "@prisma/client"
import { Prisma } from "../../../lib/prisma"
import { ChallengeWithTeamsAndQuestions } from "../../../types/additional"

interface Request extends NextApiRequest {
  query: {
    challengeId: string
    latestQuestionIndexWithinType?: string
    latestQuestionType?: "fermi" | "aboveBelow"
  }
}

const getChallengeLeaderboard = async (req: Request, res: NextApiResponse) => {
  const { challengeId, latestQuestionIndexWithinType, latestQuestionType } =
    req.query
  if (typeof challengeId !== "string") {
    res.status(400).json({
      error: "invalid request",
    })
    return
  }

  if (
    latestQuestionIndexWithinType &&
    (typeof latestQuestionIndexWithinType !== "string" ||
      isNaN(parseInt(latestQuestionIndexWithinType)))
  ) {
    res.status(400).json({
      error: "invalid latestQuestionIndexWithinType",
    })
    return
  }

  const challenge = await Prisma.challenge.findUnique({
    where: {
      id: challengeId,
    },
    include: {
      teams: {
        where: {
          NOT: {
            users: {
              some: {
                challengeLeaderboardBanned: true,
              },
            },
          },
        },
      },
      fermiQuestions: {
        include: {
          teamAnswers: true,
        },
      },
      aboveBelowQuestions: {
        include: {
          teamAnswers: true,
        },
      },
    },
  })

  if (!challenge) {
    res.status(404).json({
      error: "challenge not found",
    })
    return
  }

  const formattedTeams = getFormattedTeams(
    challenge,
    latestQuestionIndexWithinType && latestQuestionType
      ? {
          indexWithinType: parseInt(latestQuestionIndexWithinType),
          type: latestQuestionType as "fermi" | "aboveBelow",
        }
      : null
  )
  res.status(200).json(serialize(formattedTeams))
}

export default getChallengeLeaderboard

function getFormattedTeams(
  challenge: ChallengeWithTeamsAndQuestions,
  latestQuestion: {
    indexWithinType: number
    type: "fermi" | "aboveBelow"
  } | null
) {
  const getAnswer = (
    questionIndex: number,
    teamId: string,
    type: "fermi" | "aboveBelow"
  ) => {
    const questions =
      type === "fermi"
        ? challenge.fermiQuestions
        : challenge.aboveBelowQuestions
    const answers = questions[questionIndex].teamAnswers
    return (
      answers &&
      // @ts-ignore
      answers.find((answer: { teamId: string }) => answer.teamId === teamId)
    )
  }

  const countPointsSoFar = (
    team: Team,
    questions: (CalibrationQuestion | AboveBelowQuestion)[],
    type: "fermi" | "aboveBelow"
  ) =>
    questions.reduce(
      (
        acc: number,
        question: CalibrationQuestion | AboveBelowQuestion,
        index: number
      ) => {
        if (
          latestQuestion &&
          latestQuestion?.type === type &&
          latestQuestion?.indexWithinType < index
        ) {
          return acc
        }

        const answer = getAnswer(index, team.id, type)
        return acc + (answer?.score || 0)
      },
      0
    )

  const formattedTeams = challenge.teams
    .filter(
      (team) =>
        !(
          team.name === "sherlock" &&
          ["health-and-poverty", "open-sourcery"].includes(challenge.id)
        )
    )
    .map((team) => {
      const fermiPointsSoFar = countPointsSoFar(
        team,
        challenge.fermiQuestions,
        "fermi"
      )
      // NB: assumes that aboveBelowQuestions are always after fermiQuestions
      const aboveBelowPointsSoFar =
        latestQuestion?.type === "fermi"
          ? 0
          : countPointsSoFar(team, challenge.aboveBelowQuestions, "aboveBelow")
      const latestAnswer =
        latestQuestion &&
        getAnswer(latestQuestion.indexWithinType, team.id, latestQuestion.type)
      return {
        id: team.id,
        name: team.name,
        questionPoints: latestAnswer ? latestAnswer.score : "",
        correct: latestAnswer && latestAnswer.score > 0,
        fermiPointsSoFar,
        aboveBelowPointsSoFar,
        totalPoints: fermiPointsSoFar + aboveBelowPointsSoFar,
      }
    })
    .sort((a, b) => {
      // sort descending
      return b.totalPoints - a.totalPoints
    })
  return formattedTeams
}
export type getChallengeLeaderboardReturnType = ReturnType<
  typeof getFormattedTeams
>
