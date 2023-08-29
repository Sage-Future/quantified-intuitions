//api route for creating a pastcast

import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { Prisma } from "../../../lib/prisma";
import { binaryScore } from "../../../lib/services/scoring";
import { isValidBinaryProbability } from "../../../lib/services/validation";

interface Request extends NextApiRequest {
  body: {
    questionId: string;
    binaryProbability: number;
    skipped: boolean;
    timeSpent: number;
    comment: string | undefined;
  };
}

const createBinaryPastcast = async (req: Request, res: NextApiResponse) => {
  const { questionId, binaryProbability, skipped, timeSpent, comment } =
    req.body;
  if (
    typeof questionId !== "string" ||
    typeof binaryProbability !== "number" ||
    !isValidBinaryProbability(binaryProbability) ||
    typeof skipped !== "boolean" ||
    typeof timeSpent !== "number" ||
    (typeof comment !== "string" && typeof comment !== "undefined")
  ) {
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
  const question = await Prisma.question.findUnique({
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
  const score = binaryScore(
    binaryProbability,
    question.crowdForecast || /* default to 0.5 */ 0.5,
    question.binaryResolution
  );
  const pastcast = await Prisma.pastcast.create({
    data: {
      userId: session.user.id,
      questionId,
      binaryProbability,
      score,
      skipped,
      timeSpent,
      comment,
    },
  });
  res.status(201).json({
    pastcast,
    resolution: question.binaryResolution,
  });
};
export default createBinaryPastcast;
