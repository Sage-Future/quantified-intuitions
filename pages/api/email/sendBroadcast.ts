import type { NextApiRequest, NextApiResponse } from "next"
import { ServerClient } from "postmark"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  const { templateAlias, templateParams, from, messageStream } = req.body

  if (!templateAlias) {
    return res.status(400).json({ message: "Template alias is required" })
  }
  if (!from) {
    return res.status(400).json({ message: "From address is required" })
  }
  if (!templateParams) {
    return res.status(400).json({ message: "Template params are required" })
  }
  if (!messageStream) {
    return res.status(400).json({ message: "Message stream is required" })
  }

  const response = await sendBroadcastEmail(
    templateAlias,
    templateParams,
    from,
    messageStream
  )

  res.status(200).json({ message: "Email sent successfully", response })
}

export async function sendBroadcastEmail(
  templateAlias: string,
  templateParams: object,
  from: string,
  messageStream: string
) {
  if (!process.env.POSTMARK_API_KEY) {
    throw new Error("POSTMARK_API_KEY is not set")
  }
  const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY)

  const recipients = ["jellyberg@gmail.com"]

  console.log(
    "Sending email with template: ",
    templateAlias,
    "\n params: ",
    templateParams,
    `\n to ${recipients.length} recipients`
  )

  const response = await postmarkClient.sendEmailBatchWithTemplates(
    recipients.map((recipient) => ({
      From: from,
      To: recipient,
      TemplateAlias: templateAlias,
      TemplateModel: templateParams,
      MessageStream: messageStream,
    }))
  )

  return response
}
