import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "../../../lib/prisma"
import { isCronJob, mailingListPreviewTag } from "../../../lib/utils"
import { sendBroadcastEmail } from "./sendBroadcast"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!isCronJob(req)) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  const today = new Date()

  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )

  const getChallenges = async (start: Date, end: Date) => {
    return await Prisma.challenge.findMany({
      where: {
        startDate: { gte: start, lt: end },
        unlisted: false,
        isDeleted: false,
      },
    })
  }

  const thisMonthChallenges = await getChallenges(
    startOfThisMonth,
    startOfNextMonth
  )

  if (thisMonthChallenges.length !== 1) {
    return res.status(400).json({
      message: `Expected 1 challenge each month, found ${thisMonthChallenges.length} this month`,
    })
  }

  const challenge = thisMonthChallenges[0]

  const daysUntilChallenge = Math.ceil(
    (challenge.startDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  )

  const templateParams = {
    product_url: "https://quantifiedintuitions.org",
    product_name: "Quantified Intuitions",
    game_date: challenge.startDate.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    }),
    game_month: today.toLocaleString("default", { month: "long" }),
    game_theme: challenge.name,
    days_until: daysUntilChallenge,
  }
  const response = await sendBroadcastEmail({
    templateAlias: "estimation-game-organisers",
    templateParams,
    from: "estimation.game@quantifiedintuitions.org",
    messageStream: "estimation-game-organiser-upda", // yes, this is the full ID, see https://account.postmarkapp.com/servers/10869808/streams/estimation-game-organiser-upda/settings
    toTags: ["estimation-game-organiser", ...mailingListPreviewTag(req)],
  })

  res.status(200).json({ message: "success", response })
}
