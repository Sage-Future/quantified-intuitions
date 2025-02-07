import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../lib/auth";

import { Prisma } from "../../../lib/prisma";
import { logBinaryScore } from "../../../lib/services/scoring";

interface Request extends NextApiRequest {
  body: {
    questionId: string;
    above: boolean;
    confidenceLevel: number;
    teamId: string;
  };
}
const createTeamAnswer = async (req: Request, res: NextApiResponse) => {
  const { questionId, above, confidenceLevel, teamId } = req.body;
  if (
    typeof questionId !== "string" ||
    typeof above !== "boolean" ||
    typeof confidenceLevel !== "number" ||
    typeof teamId !== "string"
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
  const question = await Prisma.aboveBelowQuestion.findUnique({
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
  
  const estimate = above ? confidenceLevel / 100 : 1 - confidenceLevel / 100;
  const score = logBinaryScore(estimate, question.answerIsAbove);
  console.log({score, estimate, question, above, confidenceLevel});
  
  const teamAboveBelowAnswer = await Prisma.teamAboveBelowAnswer.create({
    data: {
      teamId,
      questionId,
      confidence: confidenceLevel,
      score: score,
      correct:
        question.answerIsAbove === above,
    },
  });
  res.status(201).json({
    ...teamAboveBelowAnswer
  });
};

export default createTeamAnswer;
