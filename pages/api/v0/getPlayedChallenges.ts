import { NextApiRequest, NextApiResponse } from "next"
import { auth } from "../../../lib/auth"
import { Prisma } from "../../../lib/prisma"

const getPlayedChallenges = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await auth(req, res)

  if (!session || !session.user) {
    return res.status(200).json([])
  }

  const playedChallenges = await Prisma.challenge.findMany({
    where: {
      unlisted: false,
      isDeleted: false,
      teams: {
        some: {
          users: {
            some: {
              id: session.user.id,
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  })

  return res.status(200).json(playedChallenges.map((challenge) => challenge.id))
}

export default getPlayedChallenges
