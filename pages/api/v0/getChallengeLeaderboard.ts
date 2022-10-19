import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "superjson";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  query: {
    challengeId: string;
  };
}

const getChallengeLeaderboard = async (req: Request, res: NextApiResponse) => {
  const { challengeId } = req.query;
  if (typeof challengeId !== "string") {
    res.status(400).json({
      error: "invalid request",
    });
    return;
  }
  const challenge = await Prisma.challenge.findUnique({
    where: {
      id: challengeId,
    },
    include: {
      teams: true,
      fermiQuestions: {
        include: {
            teamAnswers: true,
        },
      }
    },
  });
  if (!challenge) {
    res.status(404).json({
      error: "challenge not found",
    });
    return;
  }
  res.status(200).json(serialize(challenge));
};
export default getChallengeLeaderboard;
