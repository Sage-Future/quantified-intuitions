import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../lib/auth"
import { Prisma } from "../../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

const deleteTeamFromChallenge = async (
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

  const { teamId } = req.body

  if (!teamId) {
    res.status(400).json({ error: "Missing teamId" })
    return
  }

  const team = await Prisma.team.findUnique({
    where: { id: teamId },
  })

  if (!team) {
    res.status(404).json({ error: "Team not found" })
    return
  }

  // Delete the team — answers cascade via onDelete: Cascade in schema
  await Prisma.team.delete({
    where: { id: teamId },
  })

  res.status(200).json({ success: true })
}

export default deleteTeamFromChallenge
