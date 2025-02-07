import { NextApiRequest, NextApiResponse } from "next";
import { auth } from "../../../lib/auth";

import { Prisma } from "../../../lib/prisma";

interface Request extends NextApiRequest {
  body: {
    roomId: string;
  };
}

const pickQuestion = async (req: Request, res: NextApiResponse) => {
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
  const room = await Prisma.room.findUnique({
    where: {
      id: roomId,
    },
    include: {
      members: true,
      questions: true,
    },
  });
  if (!room) {
    res.status(404).json({
      error: "room not found",
    });
    return;
  }
  if (room.totalQuestions === room.questions.length) {
    const updatedRoom = await Prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        currentQuestionId: null,
        currentStartTime: null,
        isFinshed: true,
      },
    });
    res.status(200).json({ room: updatedRoom });
    //revalidate leaderboard
    res.revalidate("/leaderboard");
    return;
  }

  const memberIds = room.members.map((member) => member.id);
  const questions = await Prisma.question.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      pastcasts: true,
    },
  });
  const uniqueQuestions = questions.filter((question) => {
    return !question.pastcasts.some((pastcast) => {
      return memberIds.includes(pastcast.userId);
    });
  });
  const minSkipped = uniqueQuestions.reduce(
    (acc, curr) =>
      Math.min(
        curr.pastcasts.reduce(
          (acc2, curr2) => acc2 + (curr2.skipped ? 1 : 0),
          0
        ),
        acc
      ),
    Number.MAX_VALUE
  );
  const filteredQuestions = uniqueQuestions.filter(
    (question) =>
      question.pastcasts.reduce(
        (acc, curr) => acc + (curr.skipped ? 1 : 0),
        0
      ) === minSkipped
  );
  const question =
    filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)];

  const updatedRoom = await Prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      questions: {
        connect: {
          id: question.id,
        },
      },
      currentQuestionId: question.id,
      currentStartTime: new Date(),
    },
  });

  /*
  const rows = await Prisma.$queryRaw<{ id: string }[]>`
  SELECT q.id
  FROM "Question" AS q, "Pastcast" AS p
  WHERE p."questionId" = q.id
  GROUP BY q.id
  HAVING EVERY(p."userId" NOT IN (${memberIds.join(
    ","
  )})) AND COUNT(CASE WHEN p.skipped THEN 1 END) = (
    SELECT MIN(ts) FROM (
      SELECT COUNT(CASE WHEN p.skipped THEN 1 END) AS ts
      FROM "Question" AS q, "Pastcast" AS p
      WHERE p."questionId" = q.id
      GROUP BY q.id
      HAVING EVERY(p."userId" NOT IN (${memberIds.join(",")}))
    ) AS t
  )
  ORDER BY RANDOM() LIMIT 1
  `;
  const updatedRoom = await Prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      currentQuestionId: rows[0].id,
      currentStartTime: new Date(),
      questions: {
        connect: {
          id: rows[0].id,
        },
      },
    },
  });
  */
  res.status(200).json({
    room: updatedRoom,
  });
};

export default pickQuestion;
