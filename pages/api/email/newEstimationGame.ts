import type { NextApiRequest, NextApiResponse } from "next"
import { Prisma } from "../../../lib/prisma"
import { round } from "../../../lib/utils"
import { getChallengeLeaderboard } from "../v0/getChallengeLeaderboard"
import { sendBroadcastEmail } from "./sendBroadcast"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const today = new Date()

  const startOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1)
  const startOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  )
  const startOfLastMonth = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
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
  const lastMonthChallenges = await getChallenges(
    startOfLastMonth,
    startOfThisMonth
  )

  if (thisMonthChallenges.length !== 1 || lastMonthChallenges.length !== 1) {
    return res.status(400).json({
      message: `Expected 1 challenge each month, found ${thisMonthChallenges.length} this month and ${lastMonthChallenges.length} last month`,
    })
  }

  const challenge = thisMonthChallenges[0]
  const previousChallenge = lastMonthChallenges[0]

  const previousChallengeTeams = await getChallengeLeaderboard(
    previousChallenge.id
  )
  const previousChallengeWinners = previousChallengeTeams
    .sort((a, b) => b.totalPoints - a.totalPoints)
    .slice(0, 10)

  const templateParams = {
    product_url: "https://quantifiedintuitions.org",
    product_name: "Quantified Intuitions",
    game_month: today.toLocaleString("default", { month: "long" }),
    game_theme: challenge.name,
    winners: previousChallengeWinners.map((team, index) => ({
      rank: index + 1,
      name: team.name,
      points: round(team.totalPoints, 1),
    })),
  }
  const response = await sendBroadcastEmail(
    "new-estimation-game",
    templateParams,
    "estimation.game@quantifiedintuitions.org",
    "estimation-game-notifications"
  )

  res.status(200).json({ message: "Email sent successfully", response })
}
