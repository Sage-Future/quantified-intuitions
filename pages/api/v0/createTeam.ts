import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    name: string;
    challengeId: string;
    numPlayers: number;
  };
}

const createTeam = async (req: Request, res: NextApiResponse) => {
  const { name, challengeId, numPlayers } = req.body;
  if (
    typeof name !== "string" ||
    typeof challengeId !== "string" ||
    typeof numPlayers !== "number"
  ) {
    res.status(400).json({
      error: `invalid request`,
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
  const team = await Prisma.team.create({
    data: {
      name,
      challengeId,
      numPlayers,
      users: {
        connect: {
          id: session.user.id,
        }
      }
    },
  });
  res.status(200).json(team.id);
};
export default createTeam;
