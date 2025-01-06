import { NextApiRequest, NextApiResponse } from "next"
import SlackNotify from "slack-notify"
import { Prisma } from "../../../lib/prisma"

export default async function checkUpcomingGames(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const upcomingGames = await Prisma.challenge.findMany({
    where: {
      startDate: {
        gt: new Date(),
      },
      unlisted: false,
      isDeleted: false,
    },
  })

  if (upcomingGames.length === 0) {
    if (!process.env.SAGE_SLACK_WEBHOOK_URL) {
      console.error("Set SAGE_SLACK_WEBHOOK_URL")
      return res.status(500).json({ error: "Slack webhook URL not set" })
    }

    await SlackNotify(process.env.SAGE_SLACK_WEBHOOK_URL).send({
      text: "Warning: no upcoming estimation game",
      unfurl_links: 0,
    })
  }

  res.status(200).json({
    message: "Check completed",
    upcomingGamesCount: upcomingGames.length,
  })
}
