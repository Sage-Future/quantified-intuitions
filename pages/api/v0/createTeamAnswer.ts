import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { Prisma } from "../../../lib/prisma";
import { challengeScore } from "../../../lib/services/scoring";

interface Request extends NextApiRequest {
  body: {
    questionId: string;
    lowerBound: number;
    upperBound: number;
    teamId: string;
  };
}
const createTeamAnswer = async (req: Request, res: NextApiResponse) => {
  const { questionId, lowerBound, upperBound, teamId } = req.body;
  if (
    typeof questionId !== "string" ||
    typeof lowerBound !== "number" ||
    typeof upperBound !== "number" ||
    typeof teamId !== "string"
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
  const calibrationQuestion = await Prisma.calibrationQuestion.findUnique({
    where: {
      id: questionId,
    },
  });
  if (!calibrationQuestion) {
    res.status(404).json({
      error: "question not found",
    });
    return;
  }
  const score = challengeScore(
    lowerBound,
    upperBound,
    calibrationQuestion.answer
  );
  console.log(score);
  const teamFermiAnswer = await Prisma.teamFermiAnswer.create({
    data: {
      teamId,
      questionId,
      lowerBound,
      upperBound,
      score,
      correct:
        calibrationQuestion.answer >= lowerBound &&
        calibrationQuestion.answer <= upperBound,
    },
  });
  res.status(201).json(teamFermiAnswer);
};

export default createTeamAnswer;
