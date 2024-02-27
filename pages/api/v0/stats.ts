import { NextApiResponse } from "next"
import { serialize } from "superjson"

import { Prisma } from "../../../lib/prisma"

const getStats = async (req: Request, res: NextApiResponse) => {
  const stats = {
    calibration: await Prisma.calibrationAnswer.findMany({
      where: {
        question: {
          challengeOnly: false,
        },
      },
    }),
    pastcasts: await Prisma.pastcast.findMany(),
    estimationGame: await Prisma.calibrationAnswer.findMany({
      where: {
        question: {
          challengeOnly: false,
        },
      },
    }),
  }

  res.status(200).json(serialize(stats))
}
export default getStats
