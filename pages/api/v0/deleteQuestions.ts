import { NextApiRequest, NextApiResponse } from "next";

import { Prisma } from "../../../lib/prisma";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const deleteQuestions = async (req: NextApiRequest, res: NextApiResponse) => {
  let questions = await Prisma.question.findMany({});
  questions = questions.filter((question) => question.platform === "GJOpen");
  for (const question of questions) {
    const gjoId = question.id.substring(1);
    //replace spaces or ' in title with dashes and lowercase and remove special characters
    //replace comma with -
    //replace consecutive dashes with one dash
    const title = question.title
      .replace(/\s/g, "-")
      .replace(/'/g, "-")
      .replace(/,/g, "-")
      .replace(/\./g, "-")
      .replace(/--/g, "-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      // remove trailing dashes
      .replace(/-$/, "");
    const newUrl = "https://www.gjopen.com/questions/" + gjoId + "-" + title;
    //console.log(newUrl);
    //check if url returns ok
    /*
    let response = await fetch(newUrl);
    if (!response.ok) {
      console.log("BAD URL: " + newUrl);
      continue;
    }
    */
    await Prisma.question.update({
      where: {
        id: question.id,
      },
      data: {
        url: newUrl,
      },
    });
  }
  res.json(questions);
};
export default deleteQuestions;
