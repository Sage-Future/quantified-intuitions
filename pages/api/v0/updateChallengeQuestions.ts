import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../lib/auth"
import { Prisma } from "../../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

interface FermiQuestionUpdate {
  id: string
  content: string
  answer: number
  prefix: string
  postfix: string
  source: string
  useLogScoring: boolean
  C: number
}

interface AboveBelowQuestionUpdate {
  id: string
  content: string
  quantity: string
  answerIsAbove: boolean
  preciseAnswer: string
  source: string
}

interface ChallengeUpdate {
  id: string
  name: string
  subtitle: string | null
  startDate: string
  endDate: string
  unlisted: boolean
}

interface RequestBody {
  challengeId: string
  challenge?: ChallengeUpdate
  fermiQuestions: FermiQuestionUpdate[]
  aboveBelowQuestions: AboveBelowQuestionUpdate[]
  deletedFermiQuestionIds?: string[]
  deletedAboveBelowQuestionIds?: string[]
  isNewChallenge?: boolean
}

const updateChallengeQuestions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const session = await auth(req, res)
  const userEmail = session?.user?.email

  if (!userEmail || !adminEmails.includes(userEmail)) {
    res.status(403).json({ error: "Unauthorized" })
    return
  }

  const {
    challengeId,
    challenge: challengeUpdate,
    fermiQuestions,
    aboveBelowQuestions,
    deletedFermiQuestionIds,
    deletedAboveBelowQuestionIds,
    isNewChallenge,
  } = req.body as RequestBody

  if (!challengeId) {
    res.status(400).json({ error: "Missing challengeId" })
    return
  }

  // Handle creating a new challenge
  if (isNewChallenge && challengeUpdate) {
    // Check if challenge ID already exists
    const existingChallenge = await Prisma.challenge.findUnique({
      where: { id: challengeId },
    })
    if (existingChallenge) {
      res.status(400).json({ error: "Challenge with this ID already exists" })
      return
    }

    // Create new challenge
    await Prisma.challenge.create({
      data: {
        id: challengeId,
        name: challengeUpdate.name,
        subtitle: challengeUpdate.subtitle,
        startDate: new Date(challengeUpdate.startDate),
        endDate: new Date(challengeUpdate.endDate),
        unlisted: challengeUpdate.unlisted,
      },
    })
  }

  // Verify the challenge exists (for both new and existing)
  const challenge = await Prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
      fermiQuestions: true,
      aboveBelowQuestions: true,
    },
  })

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" })
    return
  }

  // Update challenge metadata if provided (for existing challenges)
  if (challengeUpdate && !isNewChallenge) {
    await Prisma.challenge.update({
      where: { id: challengeId },
      data: {
        name: challengeUpdate.name,
        subtitle: challengeUpdate.subtitle,
        startDate: new Date(challengeUpdate.startDate),
        endDate: new Date(challengeUpdate.endDate),
        unlisted: challengeUpdate.unlisted,
      },
    })
  }

  // Delete fermi questions
  if (deletedFermiQuestionIds && deletedFermiQuestionIds.length > 0) {
    for (const id of deletedFermiQuestionIds) {
      // Disconnect from challenge and soft delete
      await Prisma.calibrationQuestion.update({
        where: { id },
        data: {
          isDeleted: true,
          challenges: {
            disconnect: { id: challengeId },
          },
        },
      })
    }
  }

  // Delete above/below questions
  if (deletedAboveBelowQuestionIds && deletedAboveBelowQuestionIds.length > 0) {
    for (const id of deletedAboveBelowQuestionIds) {
      // Disconnect from challenge and soft delete
      await Prisma.aboveBelowQuestion.update({
        where: { id },
        data: {
          isDeleted: true,
          challenges: {
            disconnect: { id: challengeId },
          },
        },
      })
    }
  }

  // Update or create fermi questions
  if (fermiQuestions && fermiQuestions.length > 0) {
    for (const q of fermiQuestions) {
      if (q.id.startsWith("new-")) {
        // Create new question and connect to challenge
        await Prisma.calibrationQuestion.create({
          data: {
            content: q.content,
            answer: q.answer,
            prefix: q.prefix,
            postfix: q.postfix,
            source: q.source,
            useLogScoring: q.useLogScoring,
            C: q.C,
            challengeOnly: true,
            challenges: {
              connect: { id: challengeId },
            },
          },
        })
      } else {
        // Update existing question
        await Prisma.calibrationQuestion.update({
          where: { id: q.id },
          data: {
            content: q.content,
            answer: q.answer,
            prefix: q.prefix,
            postfix: q.postfix,
            source: q.source,
            useLogScoring: q.useLogScoring,
            C: q.C,
            challengeOnly: true,
          },
        })
      }
    }
  }

  // Update or create above/below questions
  if (aboveBelowQuestions && aboveBelowQuestions.length > 0) {
    for (const q of aboveBelowQuestions) {
      if (q.id.startsWith("new-")) {
        // Create new question and connect to challenge
        await Prisma.aboveBelowQuestion.create({
          data: {
            content: q.content,
            quantity: q.quantity,
            answerIsAbove: q.answerIsAbove,
            preciseAnswer: q.preciseAnswer,
            source: q.source,
            challenges: {
              connect: { id: challengeId },
            },
          },
        })
      } else {
        // Update existing question
        await Prisma.aboveBelowQuestion.update({
          where: { id: q.id },
          data: {
            content: q.content,
            quantity: q.quantity,
            answerIsAbove: q.answerIsAbove,
            preciseAnswer: q.preciseAnswer,
            source: q.source,
          },
        })
      }
    }
  }

  res.status(200).json({ success: true })
}

export default updateChallengeQuestions
