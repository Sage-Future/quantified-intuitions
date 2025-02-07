import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../lib/auth";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    name: string;
    maxSecondsPerQuestion: number;
    totalQuestions: number;
  };
}

const createRoom = async (req: Request, res: NextApiResponse) => {
  const { name, maxSecondsPerQuestion, totalQuestions } = req.body;
  if (
    typeof name !== "string" ||
    typeof maxSecondsPerQuestion !== "number" ||
    typeof totalQuestions !== "number"
  ) {
    res.status(400).json({
      error: "invalid request",
    });
    return;
  }
  const session = await auth(req, res);
  if (!session) {
    res.status(401).json({
      error: "unauthorized",
    });
    return;
  }
  const room = await Prisma.room.create({
    data: {
      hostId: session.user.id,
      name,
      maxSecondsPerQuestion,
      totalQuestions,
      members: {
        connect: {
          id: session.user.id,
        },
      },
    },
  });
  res.status(200).json(room.id);
};
export default createRoom;
