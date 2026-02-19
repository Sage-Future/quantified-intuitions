import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../lib/auth"
import { Prisma } from "../../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

const updateChallengeId = async (
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

  const { oldId, newId } = req.body

  if (!oldId || !newId) {
    res.status(400).json({ error: "Missing oldId or newId" })
    return
  }

  // Validate new ID format
  if (!/^[a-z0-9-]+$/.test(newId)) {
    res
      .status(400)
      .json({ error: "ID must only contain lowercase letters, numbers, and hyphens" })
    return
  }

  if (newId.length < 2 || newId.length > 100) {
    res.status(400).json({ error: "ID must be between 2 and 100 characters" })
    return
  }

  // Check new ID doesn't already exist
  const existing = await Prisma.challenge.findUnique({
    where: { id: newId },
  })
  if (existing) {
    res.status(400).json({ error: "A challenge with this ID already exists" })
    return
  }

  // With onUpdate: Cascade on Team, this directly cascades to all references
  await Prisma.challenge.update({
    where: { id: oldId },
    data: { id: newId },
  })

  res.status(200).json({ success: true, newId })
}

export default updateChallengeId
