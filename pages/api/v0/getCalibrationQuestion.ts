import { NextApiRequest, NextApiResponse } from "next"
import { unstable_getServerSession } from "next-auth"
import { serialize } from "superjson"

import { Prisma } from "../../../lib/prisma"
import { authOptions } from "../auth/[...nextauth]"

interface Request extends NextApiRequest {
  query: {
    tags: string[]
  }
}

const getCalibrationQuestion = async (req: Request, res: NextApiResponse) => {
  const { tags } = req.query

  const session = await unstable_getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({
      error: "unauthorized",
    })
    return
  }

  const uniqueCalibrationQuestions = await Prisma.calibrationQuestion.findMany({
    where: {
      isDeleted: false,
      challengeOnly: false,
      tags: {
        some: {
          id: {
            in: tags,
          }
        }
      },
      calibrationAnswers: {
        none: {
          userId: {
            equals: session.user.id,
          }
        },
      },
    },
  });
  if (uniqueCalibrationQuestions.length === 0) {
    return res.status(200).json(serialize({allQuestionsAnswered: true}))
  }
  const randomQuestion =
    uniqueCalibrationQuestions[Math.floor(Math.random() * uniqueCalibrationQuestions.length)];
  
  console.log({randomQuestion})
  res.status(200).json(serialize({calibrationQuestion: randomQuestion}))
}
export default getCalibrationQuestion
