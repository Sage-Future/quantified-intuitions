import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../lib/auth"
import { Prisma } from "../../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

const deleteChallenge = async (
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

  const { challengeId } = req.body

  if (!challengeId) {
    res.status(400).json({ error: "Missing challengeId" })
    return
  }

  const challenge = await Prisma.challenge.findUnique({
    where: { id: challengeId },
  })

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" })
    return
  }

  await Prisma.challenge.update({
    where: { id: challengeId },
    data: { isDeleted: true },
  })

  res.status(200).json({ success: true })
}

export default deleteChallenge
