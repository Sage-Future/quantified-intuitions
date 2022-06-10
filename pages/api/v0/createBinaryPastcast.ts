//api route for creating a pastcast

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { prisma } from "../../../lib/prisma";
import { binaryScore } from "../../../lib/services/scoring";

interface Request extends NextApiRequest {
  body: {
    questionId: string;
    binaryProbability: number;
  };
}

const createBinaryPastcast = async (req: Request, res: NextApiResponse) => {
  const { questionId, binaryProbability } = req.body;
  console.log(JSON.stringify(req.body));
  if (typeof questionId !== "string" || typeof binaryProbability !== "number") {
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
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
  });
  if (!question) {
    res.status(404).json({
      error: "question not found",
    });
    return;
  }
  const score = binaryScore(binaryProbability, question.binaryResolution);
  const pastcast = await prisma.pastcast.create({
    data: {
      userId: session.user.id,
      questionId,
      binaryProbability,
      score,
    },
  });
  res.status(201).json({
    pastcast,
  });
};
export default createBinaryPastcast;
