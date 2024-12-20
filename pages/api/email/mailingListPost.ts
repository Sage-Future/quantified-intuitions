import { NextApiRequest, NextApiResponse } from "next"
import { mailingListPreviewTag } from "../../../lib/utils"
import { sendBroadcastEmail } from "./sendBroadcast"

// Important notes:
// 1. Include ?utm_source=newsletter in all links
// 2. Set draft status until ready to send

const POSTS: Post[] = [
  {
    id: "predict-your-year-2025",
    status: "draft",
    list: "forecasting",
    subject: "Predict your life in 2025",
    preheader: "What will the new year hold for you?",
    htmlContent: `
      <h1>What will the new year hold for you?</h1>
      <p>It's the end of 2024. Did your life this year align with your expectations? What came out of nowhere and threw off your predictions? Did your actions align with your intentions? What fresh goals are you planning?</p>
      <p>We've built <a href="https://fatebook.io/predict-your-year?utm_source=newsletter">predict your year in 2025</strong></a>, a space for you to write down your predictions for the year. At the end of your year, you can return, resolve your predictions as YES, NO or AMBIGUOUS, and reflect.</p>
      <p>We've written some starter questions to make it super easy to get started predicting your year. You can tweak these and write your own - those will likely be the most important questions for you.</p>
      <p>You can use this tool to <strong>predict your personal life</strong> in 2025 - your goals, relationships, work, health, and adventures. If you like, you can share your predictions with friends - for fun, for better predictions, and for motivation to achieve your goals this year!</p>
      <p>You can also use this tool to <strong>predict questions relevant to your team or organisation</strong> in the coming year - your team strategy, performance, big financial questions, and potentially disruptive black swans. You can share your predictions with your team and let everyone contribute, to build common knowledge about expectations and pool your insights.</p>
      <p>If you use Slack, you can also share your page of predictions in a Slack channel (e.g. #2025-predictions or #strategy), so everyone can easily discuss in threads and return to it throughout the year.</p>
      <p>I hope you have a good time thinking about your coming year, and that it sparks some great conversations with friends and teammates.</p>
      ${getButtonHtml({
        link: "https://fatebook.io/predict-your-year?utm_source=newsletter",
        text: "Predict your year in 2025",
      })}
      <img src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1734716498/541e065e-c514-4ef2-8859-5bcfa287babf.png" style="max-width: 300px; display: block; margin: 20px auto;"/>
      <p>If you have feedback or suggestions for our work in the coming year, we'd love to hear from you. We can chat in our <a href="https://discord.gg/mt9YVB8VDE">Discord</a>, or you can reply to this email.</p>
      <p>Happy holidays,<br/>Adam</p>
    `,
    textContent: `
      What will the new year hold for you?

      It's the end of 2024. Did your life this year align with your expectations? What came out of nowhere and threw off your predictions? Did your actions align with your intentions? What fresh goals are you planning?

      We've built predict your year in 2025 (https://fatebook.io/predict-your-year?utm_source=newsletter), a space for you to write down your predictions for the year. At the end of your year, you can return, resolve your predictions as YES, NO or AMBIGUOUS, and reflect.

      We've written some starter questions to make it super easy to get started predicting your year. You can tweak these and write your own - those will likely be the most important questions for you.

      You can use this tool to predict your personal life in 2025 - your goals, relationships, work, health, and adventures. If you like, you can share your predictions with friends - for fun, for better predictions, and for motivation to achieve your goals this year!

      You can also use this tool to predict questions relevant to your team or organisation in the coming year - your team strategy, performance, big financial questions, and potentially disruptive black swans. You can share your predictions with your team and let everyone contribute, to build common knowledge about expectations and pool your insights.

      If you use Slack, you can also share your page of predictions in a Slack channel (e.g. #2025-predictions or #strategy), so everyone can easily discuss in threads and return to it throughout the year.

      I hope you have a good time thinking about your coming year, and that it sparks some great conversations with friends and teammates.

      If you have feedback or suggestions for our work in the coming year, we'd love to hear from you. We can chat in our Discord, or you can reply to this email.

      Happy holidays,
      Adam
    `,
  },
  {
    id: "self-awareness",
    status: "sent",
    list: "ai-digest",
    subject: "AIs are becoming more self-aware",
    preheader: "Here's why that matters",
    htmlContent: `
      <h1><a href="https://theaidigest.org/self-awareness?utm_source=newsletter">AIs are becoming more self-aware. Here's why that matters.</a></h1>
      <p><b>Summary</b></p>
      <ul>
        <li><a href="https://theaidigest.org/self-awareness?utm_source=newsletter#benchmarking-self-awareness">Benchmarks show</a> that AIs are becoming more self-aware</li>
        <li>That's good news for <a href="https://theaidigest.org/self-awareness?utm_source=newsletter#powerful-agents">competent AI agents</a> and <a href="https://theaidigest.org/self-awareness?utm_source=newsletter#calibrated-responses">accurate chatbots</a></li>
        <li>And it increases AI's ability to <a href="https://theaidigest.org/self-awareness#introspection">predict its own behavior</a></li>
        <li>But it also creates the <a href="https://theaidigest.org/self-awareness?utm_source=newsletter#sandbagging">potential for AI to act deceptively</a></li>
        <li>It's important we monitor the rate at which AI self-awareness improves, and also systematically explore the associated risks</li>
      </ul>
      <p>Large language models, like ChatGPT, know a lot about the world. But how much do they know about <i>themselves</i>? How sophisticated is their self-awareness?</p>
      <p>By self-awareness, we don't mean consciousness or sentience. We just mean the ability of language to reason about themselves, their situation, their capabilities, and their limitations.</p>
      <p>One thing researchers have discovered is that self-awareness is increasing as models become more capable. We can start to get a sense of this by asking models questions about themselves.</p>
      <img src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1734630787/self-awareness-examples-sm_ukhkuj.png" style="max-width: 400px; display: block; margin: 20px auto;"/>
      ${getButtonHtml({
        link: "https://theaidigest.org/self-awareness?utm_source=newsletter",
        text: "Continue reading on AI Digest",
      })}
    `,
    textContent: `
      AIs are becoming more self-aware. Here's why that matters

      • Benchmarks show that AIs are becoming more self-aware.
      • That's good news for competent AI agents and accurate chatbots.
      • It increases AI's ability to predict its own behavior.
      • But it also creates the potential for AI to act deceptively.
      • We need to monitor this development and explore the associated risks

      Large language models, like ChatGPT, know a lot about the world. But how much do they know about themselves?

      By self-awareness, we don't mean consciousness or sentience. We just mean the ability of language to reason about themselves, their situation, their capabilities, and their limitations.

      One thing researchers have discovered is that self-awareness is increasing as models become more capable. We can start to get a sense of this by asking models questions about themselves.

      Continue reading: https://theaidigest.org/self-awareness?utm_source=newsletter

      Thanks,
      Zak and Sanyu
    `,
  },
  {
    id: "beyond-chat",
    status: "sent",
    list: "ai-digest",
    subject: "Beyond chat: an AI agent demo",
    preheader: "Watch a GPT-4o agent autonomously perform tasks in real-time",
    htmlContent: `
      <h1>Beyond chat: an AI agent demo</h1>
      <p>Introducing our <a href="https://theaidigest.org/agent">AI Agent demo</a>. Watch an agent autonomously perform tasks in real-time.</p>
      <img src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1733316696/agent_cpychx.webp" style="max-width: 400px; display: block; margin: 20px auto;"/>
      <p>The next phase in AI might be agents that can use computers like remote workers. <a href="https://www.bloomberg.com/news/articles/2024-11-13/openai-nears-launch-of-ai-agents-to-automate-tasks-for-users">Leaks from OpenAI</a> indicate that they'll release a computer use agent codenamed Operator in January, and Anthropic has already released a <a href="https://www.anthropic.com/news/3-5-models-and-computer-use">developer preview</a>.</p>
      <p>To help you get a glimpse of what these agents will be capable of, try out our interactive agent demo.</p>
      <p>To our knowledge, this is the first computer use agent that you can give a task to and watch it think and act, right from your browser – with no sign up or set up.</p>
      <p>The agent uses GPT-4o to navigate two simulated environments: a Gmail inbox and a shopping website. You can also swap in other models, like the new Claude Sonnet 3.5 model from Anthropic.</p>
      <p>We hope you'll find this useful for understanding what the next stage of AI will look like as AI systems move beyond the chatbox, and to get a sense of the strengths and limitations of today's agents.</p>
      <p>If you use clips of this demo in slides or link to it in resources, we'd be interested to hear, as this helps us evaluate our impact.</p>
      ${getButtonHtml({
        link: "https://theaidigest.org/agent",
        text: "Try out Beyond Chat: an AI Agent Demo",
      })}
      <p>Thanks,<br/>Adam and Zak</p>
    `,
    textContent: `
      Watch an agent autonomously perform tasks in real-time
    `,
  },
  {
    id: "2025-survey",
    status: "sent",
    list: "ai-digest",
    subject: "Announcing the AI 2025 Forecasting Survey",
    preheader: "How fast will capabilities advance in the next year?",
    htmlContent: `
      <h1>Announcing the AI 2025 Forecasting Survey</h1>
      <p>How fast will AI capabilities advance in the next year? There are a wide range of views – some think Artificial General Intelligence is <a href="https://situational-awareness.ai">"strikingly plausible" by 2027</a>, others think that AI scaling is already <a href="https://www.bloomberg.com/news/articles/2024-11-13/openai-google-and-anthropic-are-struggling-to-build-more-advanced-ai">hitting a wall</a>.</p>
      <p>To make this discourse more concrete, we've created a <b><a href="https://theaidigest.org/2025-ai-forecasting-survey?utm_source=newsletter">forecasting survey for 2025 AI capabilities</a></b>, with six questions on important capability benchmarks, and two on societal impacts.</p>
      <p>This is a great way to capture a snapshot of your current expectations – as events unfold over the next year you can concretely see whether AI is progressing faster or slower than you expected.</p>
      <p>At the end of next year, we'll send you our analysis – you can see how accurate your predictions were, alongside the predictions of the crowd and public figures.</p>
      <p>If you answer the survey, you can share a Spotify Wrapped-style screenshot of your predictions with colleagues or on social media. This will help the survey reach more respondents and make the results more interesting!</p>
      <img src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1733314558/forecast-summary_o7omif.png" style="max-width: 300px; display: block; margin: 20px auto;"/>
      <p>All questions are optional. If you participate – thank you!</p>
      ${getButtonHtml({
        link: "https://theaidigest.org/2025-ai-forecasting-survey?utm_source=newsletter",
        text: "Take the AI 2025 Forecasting Survey",
      })}
      <p>Thanks,<br/>Adam</p>
    `,
    textContent: `
      Announcing the AI 2025 Forecasting Survey

      How fast will AI capabilities advance in the next year? There are a wide range of views – some think Artificial General Intelligence is "strikingly plausible" by 2027 (https://situational-awareness.ai), others think that AI scaling is already hitting a wall (https://www.bloomberg.com/news/articles/2024-11-13/openai-google-and-anthropic-are-struggling-to-build-more-advanced-ai).

      To make this discourse more concrete, we've created a forecasting survey for 2025 AI capabilities (https://theaidigest.org/2025-ai-forecasting-survey?utm_source=newsletter), with six questions on important capability benchmarks, and two on societal impacts.

      This is a great way to capture a snapshot of your current expectations – as events unfold over the next year you can concretely see whether AI is progressing faster or slower than you expected.

      At the end of next year, we'll send you our analysis – you can see how accurate your predictions were, alongside the predictions of the crowd and public figures.

      If you answer the survey, you can share a Spotify Wrapped-style screenshot of your predictions with colleagues or on social media. This will help the survey reach more respondents and make the results more interesting!

      All questions are optional. If you participate – thank you!

      Take the AI 2025 Forecasting Survey: https://theaidigest.org/2025-ai-forecasting-survey?utm_source=newsletter

      Thanks,
      Adam
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
    streamId: "quantified-intuitions-news",
  },
} as const

type Post = {
  id: string
  list: keyof typeof MAILING_LISTS
  subject: string
  preheader: string
  htmlContent: string
  textContent: string
  status: "draft" | "ready" | "sent"
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

  if (post.status !== "ready" && !req.query.preview) {
    return res
      .status(400)
      .json({ message: `Post ${postId} status is not ready (${post.status})` })
  }

  const list = MAILING_LISTS[post.list]

  try {
    const response = await sendBroadcastEmail({
      templateAlias: "blank-transactional",
      templateParams: {
        subject: post.subject,
        html_body: post.htmlContent,
        text_body: post.textContent,
        preheader: post.preheader,
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
