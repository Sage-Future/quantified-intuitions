import { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    email: string;
    tags: string[];
  };
}

const joinMailingList = async (req: Request, res: NextApiResponse) => {
  const { email, tags } = req.body;
  if (
    typeof email !== "string" ||
    !Array.isArray(tags)
  ) {
    res.status(400).json({
      error: `invalid request`,
    });
    return;
  }
  
  // NB: we do not check if authorised

  const subscriber = await Prisma.mailingListSubscriber.create({
    data: {
      email,
      tags,
    },
  });
  res.status(200).json(subscriber.id);
};
export default joinMailingList;
