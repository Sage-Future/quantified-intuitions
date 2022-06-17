import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    username: string;
  };
}

const updateSettings = async (req: Request, res: NextApiResponse) => {
  const { username } = req.body;
  if (typeof username !== "string") {
    res.status(400).json({
      error: "invalid request",
    });
    return;
  }
  if (
    username.length < 3 ||
    username.length > 20 ||
    !/^[a-zA-Z0-9 ]*$/.test(username)
  ) {
    res.status(400).json({
      error: "invalid username",
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
  const user = await Prisma.user.update({
    where: {
      id: session.user.id,
    },
    data: {
      name: username,
    },
  });
  res.status(200).json({
    user,
  });
};

export default updateSettings;
