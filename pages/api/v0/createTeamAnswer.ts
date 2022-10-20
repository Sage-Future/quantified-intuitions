import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { Prisma } from "../../../lib/prisma";
import { estimathonScore } from "../../../lib/services/scoring";

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
  // get the lower bound, upper bound and answer for other calibrationQuestions answered by the team
  const answers = await Prisma.teamFermiAnswer.findMany({
    where: {
      teamId: teamId,
    },
    select: {
      lowerBound: true,
      upperBound: true,
      question: {
        select: {
          answer: true,
        }
      }
    },
  });

  const prevAnswers = answers
    .filter(answer => answer.lowerBound !== null && answer.upperBound !== null)
    .map((answer) => ({
      lowerBound: answer.lowerBound as number,
      upperBound: answer.upperBound as number,
      answer: answer.question.answer,
    }));
  const score = estimathonScore(
    [
      {
        lowerBound,
        upperBound,
        answer: calibrationQuestion.answer,
      },
      ...prevAnswers
    ]
  );
  const prevScore = estimathonScore(prevAnswers);
  
  const teamFermiAnswer = await Prisma.teamFermiAnswer.create({
    data: {
      teamId,
      questionId,
      lowerBound,
      upperBound,
      score: score - prevScore,
      correct:
        calibrationQuestion.answer >= lowerBound &&
        calibrationQuestion.answer <= upperBound,
    },
  });
  res.status(201).json({
    ...teamFermiAnswer,
    changeInScore: score - prevScore,
    score,
  });
};

export default createTeamAnswer;
