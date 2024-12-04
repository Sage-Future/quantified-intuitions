import { NextApiRequest, NextApiResponse } from "next"
import { mailingListPreviewTag } from "../../../lib/utils"
import { sendBroadcastEmail } from "./sendBroadcast"

const POSTS: Post[] = [
  {
    id: "2025-survey",
    list: "ai-digest",
    subject: "Announcing the AI 2025 Forecasting Survey",
    htmlContent: `
      <h1>Announcing the AI 2025 Forecasting Survey</h1>
      <p>How fast will AI capabilities advance in the next year? There are a wide range of views – some think Artificial General Intelligence is <a href="https://situational-awareness.ai">"strikingly plausible" by 2027</a>, others think that AI scaling is already <a href="https://www.bloomberg.com/news/articles/2024-11-13/openai-google-and-anthropic-are-struggling-to-build-more-advanced-ai">hitting a wall</a>.</p>
      <p>To make this discourse more concrete, we've created a <a href="https://theaidigest.org/2025-ai-forecasting-survey">forecasting survey for 2025 AI capabilities</a>, with six questions on important capability benchmarks, and two on societal impacts.</p>
      <p>This is a great way to capture a snapshot of your current expectations – as events unfold over the next year you can concretely see whether AI is progressing faster or slower than you expected.</p>
      <p>At the end of next year, we'll send you our analysis – you can see how accurate your predictions were, alongside the predictions of the crowd and public figures.</p>
      <p>If you answer the survey, you can share a Spotify Wrapped-style screenshot of your predictions with colleagues or on social media. This will help the survey reach more respondents and make the results more interesting!</p>
      <img src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1733314558/forecast-summary_o7omif.png" style="max-width: 300px; display: block; margin: 5px auto;"/>
      <p>All questions are optional. If you participate – thank you!</p>
      ${getButtonHtml({
        link: "https://theaidigest.org/2025-ai-forecasting-survey",
        text: "Take the AI 2025 Forecasting Survey",
      })}
      <p>Thanks,</p>
      <p>Adam</p>
    `,
    textContent: `
      Record your predictions: how fast will AI capabilities advance in the next year?
    `,
  },
]

function getButtonHtml({ link, text }: { link: string; text: string }) {
  return `
<p style="text-align: center;">
  <a href="${link}" class="button" style="margin: auto; display: inline-flex; align-items: center; padding: 0.5rem 1rem; border: 1px solid transparent; font-size: 0.875rem; font-weight: 500; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); color: #ffffff !important; background-color: #4f46e5; text-decoration: none;">${text}</a>
</p>`
}

type MailingList = {
  from: string
  streamId: string
}

const MAILING_LISTS: Record<string, MailingList> = {
  "ai-digest": {
    from: "newsletter@theaidigest.org",
    streamId: "ai-digest-news",
  },
  forecasting: {
    from: "newsletter@quantifiedintuitions.org",
    streamId: "todo",
  },
} as const

type Post = {
  id: string
  list: keyof typeof MAILING_LISTS
  subject: string
  htmlContent: string
  textContent: string
}

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

  const { postId } = req.query

  if (!postId || typeof postId !== "string") {
    return res.status(400).json({ message: "Post ID is required" })
  }

  const post = POSTS.find((p) => p.id === postId)
  if (!post) {
    return res.status(404).json({ message: `Post ${postId} not found` })
  }

  const list = MAILING_LISTS[post.list]

  try {
    const response = await sendBroadcastEmail({
      templateAlias: "blank-transactional",
      templateParams: {
        subject: post.subject,
        html_body: post.htmlContent,
        text_body: post.textContent,
      },
      from: list.from,
      messageStream: list.streamId,
      toTags: [...mailingListPreviewTag(req)],
    })

    res.status(200).json({
      message: "Email sent successfully",
      response,
    })
  } catch (error) {
    console.error("Error sending email:", error)
    res.status(500).json({
      message: "Error sending email",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
