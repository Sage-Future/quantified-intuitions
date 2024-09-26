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

  const messages = await getAllSentMessages(postmarkClient)
  const csv = convertToCSV(messages)

  res.setHeader("Content-Type", "text/csv")
  res.setHeader("Content-Disposition", "attachment; filename=sent_emails.csv")
  res.status(200).send(csv)
}

async function getAllSentMessages(client: ServerClient) {
  const pageSize = 500
  let page = 1
  let allMessages: any[] = []
  let hasMore = true

  while (hasMore) {
    const response = await client.getOutboundMessages({
      count: pageSize,
      offset: (page - 1) * pageSize,
      messageStream: "estimation-game-notifications",
      subject: "The September Estimation Game: ✈️ Travel",
    })

    allMessages = allMessages.concat(response.Messages)
    hasMore =
      parseInt(response.TotalCount) > page * pageSize || page * pageSize > 9500
    page++
  }

  return allMessages.map((message) => ({
    MessageID: message.MessageID,
    To: message.To,
    From: message.From,
    Subject: message.Subject,
    Status: message.Status,
    SentAt: message.SentAt,
    ReceivedAt: message.ReceivedAt,
    MessageStream: message.MessageStream,
  }))
}

function convertToCSV(data: any[]): string {
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(","),
    [
      ...data.map((row) =>
        headers
          .map((fieldName) =>
            JSON.stringify((row[fieldName]?.["Email"] || row[fieldName]) ?? "")
          )
          .join(",")
      ),
    ],
  ]
  return csvRows.join("\r\n")
}
