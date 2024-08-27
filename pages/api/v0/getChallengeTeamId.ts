import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { Prisma } from "../../../lib/prisma"

const getChallengeTeamId = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req })

  if (!session || !session.user) {
    return res.status(200).json(undefined)
  }

  const { challengeId } = req.query

  if (!challengeId || typeof challengeId !== "string") {
    return res.status(400).json({ error: "Invalid challenge ID" })
  }

  const team = await Prisma.team.findFirst({
    where: {
      challengeId,
      users: {
        some: {
          id: session.user.id,
        },
      },
    },
    select: {
      id: true,
    },
  })

  if (!team) {
    return res.status(200).json(undefined)
  }

  return res.status(200).json(team.id)
}

export default getChallengeTeamId
