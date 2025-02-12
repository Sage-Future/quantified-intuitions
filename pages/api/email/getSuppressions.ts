import type { NextApiRequest, NextApiResponse } from "next"
import { ServerClient } from "postmark"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    process.env.MAILING_LIST_SECRET !== req.headers.authorization &&
    process.env.NODE_ENV !== "development"
  ) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  if (!process.env.POSTMARK_API_KEY) {
    return res.status(500).json({ message: "POSTMARK_API_KEY is not set" })
  }

  const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY)

  try {
    const streams = await postmarkClient.getMessageStreams()
    const streamIds = streams.MessageStreams.map((stream) => stream.ID)

    const suppressions = await Promise.all(
      streamIds.map(async (streamId) => {
        const suppressionData = await postmarkClient.getSuppressions(streamId)

        const counts = suppressionData.Suppressions.reduce(
          (acc: Record<string, number>, curr) => {
            acc[curr.SuppressionReason] = (acc[curr.SuppressionReason] || 0) + 1
            return acc
          },
          {}
        )

        return {
          streamId,
          total: suppressionData.Suppressions.length,
          byReason: {
            ManualSuppression: counts.ManualSuppression || 0,
            HardBounce: counts.HardBounce || 0,
            SpamComplaint: counts.SpamComplaint || 0,
          },
        }
      })
    )

    console.table(
      suppressions
        .sort((a, b) => b.total - a.total)
        .map((s) => ({
          Stream: s.streamId,
          Total: s.total,
          Unsubscribes: s.byReason.ManualSuppression,
          HardBounces: s.byReason.HardBounce,
          SpamComplaints: s.byReason.SpamComplaint,
        }))
    )

    res.status(200).json(suppressions)
  } catch (error) {
    console.error("Error fetching suppressions:", error)
    res.status(500).json({ message: "Failed to fetch suppressions" })
  }
}
