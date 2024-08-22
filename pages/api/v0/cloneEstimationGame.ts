import { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "../../../lib/prisma"

interface Request extends NextApiRequest {
  body: {
    challengeToCloneId: string
    newChallengeId: string
    newChallengeName: string
  }
}

const cloneEstimationGame = async (req: Request, res: NextApiResponse) => {
  const { challengeToCloneId, newChallengeId, newChallengeName } = req.body

  if (typeof challengeToCloneId !== "string") {
    res.status(400).json({
      error: "Invalid challengeToCloneId: must be a string",
    })
    return
  }
  if (typeof newChallengeId !== "string") {
    res.status(400).json({
      error: "Invalid newChallengeId: must be a string",
    })
    return
  }
  if (typeof newChallengeName !== "string") {
    res.status(400).json({
      error: "Invalid newChallengeName: must be a string",
    })
    return
  }
  if (!challengeToCloneId || !newChallengeId || !newChallengeName) {
    res.status(400).json({
      error:
        "Missing required fields: challengeToCloneId, newChallengeId, and newChallengeName are all required",
    })
    return
  }

  const existingChallenge = await Prisma.challenge.findUnique({
    where: { id: newChallengeId },
  })
  if (existingChallenge) {
    res.status(400).json({ error: "Challenge with that id already exists" })
    return
  }

  const oldChallenge = await Prisma.challenge.findUnique({
    where: { id: challengeToCloneId },
    include: { fermiQuestions: true, aboveBelowQuestions: true },
  })
  if (!oldChallenge) {
    res.status(404).json({ error: "Challenge not found" })
    return
  }

  const newChallenge = await Prisma.challenge.create({
    data: {
      id: newChallengeId,
      name: newChallengeName,
      startDate: new Date(),
      endDate: new Date(),
      fermiQuestions: {
        connect: oldChallenge.fermiQuestions.map((q) => ({ id: q.id })),
      },
      aboveBelowQuestions: {
        connect: oldChallenge.aboveBelowQuestions.map((q) => ({ id: q.id })),
      },
      unlisted: true,
    },
  })

  res.status(200).json(newChallenge)
}

export default cloneEstimationGame
