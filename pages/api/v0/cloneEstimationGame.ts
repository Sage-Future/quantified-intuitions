import { Prisma } from "../../../lib/prisma";
import { NextApiRequest, NextApiResponse } from 'next'

interface Request extends NextApiRequest {
  body: {
    challengeToCloneId: string,
    newChallengeId: string,
    newChallengeName: string
  }
}

const cloneEstimationGame = async (req: Request, res: NextApiResponse) => {
  const { challengeToCloneId, newChallengeId, newChallengeName } = req.query

  if (
    typeof challengeToCloneId !== 'string' ||
    typeof newChallengeId !== 'string' ||
    typeof newChallengeName !== 'string'
  ) {
    res.status(400).json({
      error: 'invalid request'
    })
    return
  }

  const existingChallenge = await Prisma.challenge.findUnique({
    where: { id: newChallengeId }
  })
  if (existingChallenge) {
    res.status(400).json({ error: 'Challenge with that id already exists' })
    return
  }

  const oldChallenge = await Prisma.challenge.findUnique({
    where: { id: challengeToCloneId },
    include: { fermiQuestions: true, aboveBelowQuestions: true }
  })
  if (!oldChallenge) {
    res.status(404).json({ error: 'Challenge not found' })
    return
  }

  const newChallenge = await Prisma.challenge.create({
    data: {
      id: newChallengeId,
      name: newChallengeName,
      startDate: new Date(),
      endDate: new Date(),
      fermiQuestions: {
        connect: oldChallenge.fermiQuestions.map((q) => ({ id: q.id }))
      },
      aboveBelowQuestions: {
        connect: oldChallenge.aboveBelowQuestions.map((q) => ({ id: q.id }))
      },
      unlisted: true,
    }
  })

  res.status(200).json(newChallenge)
}

export default cloneEstimationGame
