import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    questionId: string;
  };
}

const skipQuestion = async (req: Request, res: NextApiResponse) => {
  const { questionId } = req.body;
  if (typeof questionId !== "string") {
    res.status(400).json({
      error: "invalid request",
    });
    return;
  }
  const session = await getSession({ req });
  if (session === null || session === undefined) {
    res.status(401).json({
      error: "unauthorized",
    });
    return;
  }
  const pastcast = await prisma.pastcast.create({
    data: {
      userId: session.user.id,
      questionId,
      score: 0,
      skipped: true,
    },
  });
  res.status(201).json({
    pastcast,
  });
};
export default skipQuestion;
