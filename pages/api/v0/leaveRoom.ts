import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../lib/auth";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    roomId: string;
  };
}
const leaveRoom = async (req: Request, res: NextApiResponse) => {
  const { roomId } = req.body;
  if (typeof roomId !== "string") {
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
  const room = await Prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      members: {
        disconnect: [
          {
            id: session.user.id,
          },
        ],
      },
    },
  });
  if (!room) {
    res.status(404).json({
      error: "room not found",
    });
    return;
  }
  res.status(200).json({ room });
};

export default leaveRoom;
