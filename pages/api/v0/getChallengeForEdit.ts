import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../lib/auth"
import { Prisma } from "../../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

const getChallengeForEdit = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }

  const session = await auth(req, res)
  const userEmail = session?.user?.email

  if (!userEmail || !adminEmails.includes(userEmail)) {
    res.status(403).json({ error: "Unauthorized" })
    return
  }

  const { challengeId } = req.query

  if (!challengeId || typeof challengeId !== "string") {
    res.status(400).json({ error: "Missing challengeId" })
    return
  }

  const challenge = await Prisma.challenge.findUnique({
    where: { id: challengeId },
    include: {
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
    res.status(404).json({ error: "Challenge not found" })
    return
  }

  res.status(200).json(challenge)
}

export default getChallengeForEdit
