import { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import { Prisma } from "../../../lib/prisma"

const getPlayedChallenges = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const session = await getSession({ req })

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
