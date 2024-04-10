import { NextApiRequest, NextApiResponse } from "next"
import SlackNotify from "slack-notify"
import { z } from "zod"
import { Prisma } from "../../../lib/prisma"

const feedbackSchema = z.object({
  type: z.string(),
  message: z.string(),
  email: z.string().email().optional(),
  userId: z.string().optional(),
})

export default async function submitFeedback(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const parsed = feedbackSchema.parse(req.body)
    const { type, message, email, userId } = parsed

    let user = null
    if (userId) {
      user = await Prisma.user.findUnique({
        where: { id: userId },
      })
    }

    await Prisma.feedback.create({
      data: {
        type,
        message,
        email: user ? user.email : email,
        userId: user ? user.id : null,
      },
    })

    if (!process.env.SAGE_SLACK_WEBHOOK_URL) {
      console.error("Set SAGE_SLACK_WEBHOOK_URL")
      return res.status(500).json({ error: "Slack webhook URL not set" })
    }

    await SlackNotify(process.env.SAGE_SLACK_WEBHOOK_URL).send({
      text: `*${type}*\n${message}\n${(user ? user.email : email) || ""}`,
      unfurl_links: 0,
    })

    res.status(200).json({ message: "Feedback submitted successfully" })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors })
    }
    console.error(error)
    res.status(500).json({ error: "Internal server error" })
  }
}
