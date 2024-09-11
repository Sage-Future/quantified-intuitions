import type { NextApiRequest } from "next"

export function round(value: number, decimals: number) {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals)
}

export function getYYYYMMDD(date: Date) {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const day = date.getDate().toString().padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function sum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0)
}

export function mean(arr: number[]) {
  return sum(arr) / arr.length
}

export function isCronJob(req: NextApiRequest) {
  if (process.env.NODE_ENV === "development") {
    console.log("allowing non-cron job in development environment")
    return true
  }

  const authHeader = req.headers.authorization
  if (!process.env.CRON_SECRET) {
    throw new Error("CRON_SECRET is not set")
  }
  return (
    !!process.env.CRON_SECRET &&
    authHeader === `Bearer ${process.env.CRON_SECRET}`
  )
}

export function mailingListPreviewTag(req: NextApiRequest) {
  if (req.query.preview) {
    return ["preview"]
  }
  return []
}
