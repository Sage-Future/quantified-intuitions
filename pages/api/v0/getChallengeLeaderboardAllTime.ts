import { NextApiRequest, NextApiResponse } from "next"
import { serialize } from "superjson"

import { flatten } from "lodash"
import { Prisma } from "../../../lib/prisma"

interface Request extends NextApiRequest {
  query: {
  }
}

const getChallengeLeaderboardAllTime = async (req: Request, res: NextApiResponse) => {
  const challenges = await Prisma.challenge.findMany({
    where: {
      unlisted: false,
      startDate: {
        lte: new Date(),
      }
    },
    include: {
      teams: {
        include: {
          users: true,
        }
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
      }
    },
  })
  
  const challengeScores = challenges.map(challenge => {
    return challenge.teams.map(team => {
      if (team.users.length > 1) {
        console.error("team has more than one user, need to fix this function")
      }

      if (team.users.length === 0) {
        console.warn("no users in team!")
        return undefined
      }
      const totalScore = challenge.fermiQuestions.reduce((acc, question) => {
        const teamAnswer = question.teamAnswers.find(teamAnswer => teamAnswer.teamId === team.id)
        if (!teamAnswer) {
          return acc
        }
        return acc + teamAnswer.score
      }, 0)
      +
      challenge.aboveBelowQuestions.reduce((acc, question) => {
        const teamAnswer = question.teamAnswers.find(teamAnswer => teamAnswer.teamId === team.id)
        if (!teamAnswer) {
          return acc
        }
        return acc + teamAnswer.score
      }, 0)
      return {
        user: team.users[0],
        challenge: challenge,
        totalScore,
      }
    })
  })
  const allUserIds = new Set(flatten(challengeScores).map(score => score?.user.id))
  
  const userScores: getChallengeLeaderboardAllTimeReturnType = Array.from(allUserIds).flatMap(userId => {
    const userScores = flatten(challengeScores).filter(score => score?.user.id === userId)
    const challengesParticipated = userScores.length
    const totalScore = userScores.reduce((acc, score) => acc + (score?.totalScore || 0), 0)
    const avgScore = totalScore / challengesParticipated
    const user = userScores[0]?.user

    if (!user) {
      return []
    }

    return [{
      user: {
        id: user.id,
        name: user.name,
      },
      totalScore,
      avgScore,
      challengesParticipated,
    }]
  })

  const sortedUserScores = userScores.sort((a, b) => b.totalScore - a.totalScore)

  res.status(200).json(serialize(sortedUserScores))
}
export default getChallengeLeaderboardAllTime

export type getChallengeLeaderboardAllTimeReturnType = {
  user: {
      id: string;
      name: string | null;
  };
  totalScore: number;
  avgScore: number;
  challengesParticipated: number;
}[]