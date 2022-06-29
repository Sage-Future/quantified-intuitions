import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "superjson";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  query: {
    roomId: string;
  };
}

const getQuestion = async (req: Request, res: NextApiResponse) => {
  const { roomId } = req.query;
  if (typeof roomId !== "string") {
    res.status(400).json({
      error: "invalid request",
    });
    return;
  }
  const room = await Prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      questions: {
        include: {
          pastcasts: true,
          comments: true,
        },
      },
      members: true,
    },
  });
  if (!room) {
    res.status(404).json({
      error: "room not found",
    });
    return;
  }
  res.status(200).json(serialize(room));
};
export default getQuestion;
