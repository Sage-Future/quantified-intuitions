import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { Prisma } from "../../../lib/prisma";
import { calibrationScore } from "../../../lib/services/scoring";

interface Request extends NextApiRequest {
  body: {
    questionId: string;
    lowerBound: number;
    upperBound: number;
    confidenceInterval: number;
  };
}
const createCalibrationAnswer = async (req: Request, res: NextApiResponse) => {
  const { questionId, lowerBound, upperBound, confidenceInterval } = req.body;
  if (
    typeof questionId !== "string" ||
    typeof lowerBound !== "number" ||
    typeof upperBound !== "number" ||
    typeof confidenceInterval !== "number"
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
  const score = calibrationScore(
    lowerBound,
    upperBound,
    calibrationQuestion.answer,
    confidenceInterval,
    false
  );
  const calibrationAnswer = await Prisma.calibrationAnswer.create({
    data: {
      userId: session.user.id,
      questionId: questionId,
      lowerBound: lowerBound,
      upperBound: upperBound,
      score: score,
      correct:
        calibrationQuestion.answer >= lowerBound &&
        calibrationQuestion.answer <= upperBound,
    },
  });
  res.status(201).json(calibrationAnswer);
};

export default createCalibrationAnswer;
