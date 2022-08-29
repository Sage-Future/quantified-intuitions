import { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "../../../lib/prisma";

type calibrationQuestionJSON = {
  Id: string;
  Question: string;
  "Answer number": number;
  Units: string;
  Source: string;
};

const importCalibrationQuestions = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const scrapedData =
    require("./eaCalibration_questions.json") as calibrationQuestionJSON[];
  scrapedData.reduce(async (acc, data) => {
    await acc;
    await Prisma.calibrationQuestion.upsert({
      where: {
        id: data.Id.toString(),
      },
      create: {
        content: data.Question,
        answer: data["Answer number"],
        unit: data.Units,
        source: data.Source,
      },
      update: {
        content: data.Question,
        answer: data["Answer number"],
        unit: data.Units,
        source: data.Source,
      },
    });
  }, Promise.resolve());

  res.json(scrapedData);
};

export default importCalibrationQuestions;
