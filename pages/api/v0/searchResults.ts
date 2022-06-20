import { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "../../../lib/prisma";

const searchResults = async (req: NextApiRequest, res: NextApiResponse) => {
  const { searchId } = req.query;
  if (typeof searchId !== "string") {
    res.status(400).json({ message: "Bad Request" });
    return;
  }
  const search = await Prisma.search.findUnique({
    where: {
      id: searchId,
    },
    include: {
      results: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  res.json(search);
};
export default searchResults;
