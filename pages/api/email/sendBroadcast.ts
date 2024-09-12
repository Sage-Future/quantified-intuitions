import type { NextApiRequest, NextApiResponse } from "next"
import { ServerClient } from "postmark"
import { Prisma } from "../../../lib/prisma"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (process.env.MAILING_LIST_SECRET !== req.headers.authorization) {
    return res.status(401).json({ message: "Unauthorized" })
  }

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

  const response = await sendBroadcastEmail({
    templateAlias,
    templateParams,
    from,
    messageStream,
  })

  res.status(200).json({ message: "Email sent successfully", response })
}

export async function sendBroadcastEmail({
  templateAlias,
  templateParams,
  from,
  messageStream,
  toTags,
}: {
  templateAlias: string
  templateParams: object
  from: string
  messageStream: string
  toTags?: string[]
}) {
  if (!process.env.POSTMARK_API_KEY) {
    throw new Error("POSTMARK_API_KEY is not set")
  }
  const postmarkClient = new ServerClient(process.env.POSTMARK_API_KEY)

  const recipients = Array.from(new Set(await getRecipients(toTags)))

  console.log(
    "Sending email with template: ",
    templateAlias,
    "\n params: ",
    templateParams,
    `\n to ${recipients.length} recipients`
  )

  // if (process.env.NODE_ENV === "development" && recipients.length > 1) {
  //   console.log(
  //     "NOT sending email in development mode (unless single recipient)"
  //   )
  //   return
  // }

  // Postmark has a limit of 500 recipients per batch
  const batchSize = 500
  const responses = []
  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize)
    const response = await postmarkClient.sendEmailBatchWithTemplates(
      batch.map((recipient) => ({
        From: from,
        To: recipient,
        TemplateAlias: templateAlias,
        TemplateModel: templateParams,
        MessageStream: messageStream,
      }))
    )
    responses.push(response)
  }

  return responses.flat()
}

async function getRecipients(toTags?: string[]) {
  return (
    await Prisma.mailingListSubscriber.findMany({
      where: {
        ...(toTags
          ? {
              tags: {
                hasEvery: toTags, // NB: must have all tags. Used to send preview emails only internally
              },
            }
          : {}),
      },
    })
  ).map((subscriber) => subscriber.email)
}
