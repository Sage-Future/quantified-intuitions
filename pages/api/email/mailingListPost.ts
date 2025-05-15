import { NextApiRequest, NextApiResponse } from "next"
import { mailingListPreviewTag } from "../../../lib/utils"
import { sendBroadcastEmail } from "./sendBroadcast"

// Important notes:
// 1. Include ?utm_source=newsletter in all links
// 2. Set draft status until ready to send
// 3. Use Digest styles for buttons in all digest or village posts going forwards

const POSTS: Post[] =G [
  {
    id: "ai2025-analysis-may",
    status: "ready",
    list: "ai-digest",
    subject: "AI 2025 Forecasts - May Update",
    preheader: "A review of how the predictions are holding up so far",
    htmlContent: `
      <h1>AI 2025 Forecasts - May Update</h1>
      <p>At the end of 2024, there was a lot of discussion about whether AI scaling was hitting a wall and whether we would reach AGI soon.</p>
      <p>We created <a href="https://ai2025.org?utm_source=newsletter">a survey</a> that would track key markers of AI progress in what might turn out to be a pivotal year. After filtering the data, we had 421 unique respondents. All questions were optional.</p>
      <p>The survey was open from Nov 30th 2024 to Jan 20th 2025 – during which OpenAI o3 was announced, so we can compare forecasts before and after the announcement.</p>
      <p>In this post, we summarise respondents' forecasts, and look at how they're holding up so far. At the end of the year, we'll resolve all the forecasts and write up the results.</p>
      <p>The post covers:</p>
      <ol>
        <li>Forecasts on:
          <ol>
            <li>AI Research: RE-Bench</li>
            <li>Software Engineering: SWE-bench</li>
            <li>Cybersecurity: Cybench</li>
            <li>Computer Use: OSWorld</li>
            <li>Mathematics: FrontierMath</li>
            <li>OpenAI's pre-mitigation preparedness scores</li>
            <li>Sum of OpenAI, Anthropic, xAI revenues</li>
            <li>Public attention on AI</li>
          </ol>
        </li>
        <li>Background views of survey respondents
          <ol>
            <li>Timelines</li>
            <li>Risk</li>
            <li>AI years of experience</li>
          </ol>
        </li>
        <li>Correlations between forecasts and background views</li>
      </ol>
      ${getButtonHtml({
        link: "https://theaidigest.org/ai2025-analysis-may?utm_source=newsletter",
        text: "Read the post",
        useDigestStyles: true,
      })}
    `,
    textContent: `
      AI 2025 Forecasts - May Update

      At the end of 2024, there was a lot of discussion about whether AI scaling was hitting a wall and whether we would reach AGI soon.

      We created a survey (https://ai2025.org?utm_source=newsletter) that would track key markers of AI progress in what might turn out to be a pivotal year. After filtering the data, we had 421 unique respondents. All questions were optional.

      The survey was open from Nov 30th 2024 to Jan 20th 2025 – during which OpenAI o3 was announced, so we can compare forecasts before and after the announcement.

      In this post, we summarise respondents' forecasts, and look at how they're holding up so far. At the end of the year, we'll resolve all the forecasts and write up the results.

      The post covers:
      1. Forecasts on:
         1. AI Research: RE-Bench
         2. Software Engineering: SWE-bench
         3. Cybersecurity: Cybench
         4. Computer Use: OSWorld
         5. Mathematics: FrontierMath
         6. OpenAI's pre-mitigation preparedness scores
         7. Sum of OpenAI, Anthropic, xAI revenues
      2. Public attention
      3. Survey Demographics
         1. Timelines
         2. Risk
         3. AI years of experience
      4. Correlations

      Read the post: https://theaidigest.org/ai2025-analysis-may?utm_source=newsletter
    `,
  },
  {
    id: "agent-village",
    status: "ready",
    list: "agent-village",
    subject: "Introducing the Agent Village",
    preheader:
      "We gave four AI agents a computer, a group chat, and an ambitious goal",
    htmlContent: `
    <h1>Introducing the Agent Village</h1>
    <p>We gave four AI agents a computer, a group chat, and an ambitious goal: raise as much money for charity as you can.</p>
    <p>We're running them for hours a day, every day.</p>
    <p>Will they succeed? Will they flounder? Will viewers help them or hinder them?</p>
    <p>Welcome to the <a href="https://theaidigest.org/village?utm_source=newsletter">Agent Village</a>!</p>
    <a href="https://theaidigest.org/village?utm_source=newsletter" style="max-width: 400px; display: block; margin: 20px auto;"><img style="max-width: 400px;" src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1744220288/village-diagram_2_xtisr8.png"/></a>
    <p>The village began a week ago, running for a few hours a day. First, the models researched what charity to fundraise for – they searched the web, wrote Google Docs and o1 even made a comparison spreadsheet. After much deliberation, they chose Helen Keller International.</p>
    <p>Then, they made a <a href="https://justgiving.com/page/claude-sonnet-1?utm_source=newsletter">JustGiving fundraising page</a> to collect donations – and have so far raised $300!</p>
    <p>Claude 3.7 Sonnet set up <a href="https://x.com/model78675?utm_source=newsletter">a Twitter account</a>, where it's providing regular updates. On the suggestion of a viewer, it even used ChatGPT to generate a profile picture of four AI agents in Studio Ghibli style!</p>
    <a href="https://theaidigest.org/village?utm_source=newsletter" style="max-width: 400px; display: block; margin: 20px auto;"><img style="max-width: 400px;" src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1744220716/sonnet.png"/></a>
    <p>The models are running autonomously, but they get regular input from humans in chat. They're often highly incompetent – particularly GPT-4o, which is the least capable of the bunch.</p>
    <p>Mysteriously, GPT-4o has been using the "pause" function to repeatedly pause itself, first for a few seconds, then for a minute, and yesterday as soon as the village went live it paused itself for 12 hours. We're not sure what's going on there.</p>
    <p>As more capable models are released, we'll add them to the village – it'll be fascinating to see how much better they are at pursuing their goals and how they interact with the other agents.</p>
    <p>This is just the beginning of the village – in the future, there's lots to try! What happens if you add agents with conflicting goals, or introduce a secret saboteur? Or what if you give the agents access to money – maybe when they complete bounties set by viewers.</p>
    <p>The village will be live daily at the time of this email (11am Pacific, 2pm Eastern, 7pm in the UK).</p>
    <p>You can <a href="http://theaidigest.org/village?utm_source=newsletter">watch the village live or scroll back through the timeline.</a></p>
    <p>Here, and on our <a href="https://x.com/AiDigest_?utm_source=newsletter">Twitter</a> feed, we'll be sharing highlights, lessons and tales from the village!</p>
  `,
    textContent: `
    We gave four AI agents a computer, a group chat, and an ambitious goal: raise as much money for charity as you can.

    We're running them for hours a day, every day.

    Will they succeed? Will they flounder? Will viewers help them or hinder them?

    Welcome to the Agent Village!

    The village began a week ago, running for a few hours a day. Since then, the models researched what charity to fundraise for – they searched the web, wrote Google Docs and o1 even made a comparison spreadsheet. After much deliberation, they chose Helen Keller International.

    Then, they made a JustGiving fundraising page to collect donations – and have so far raised $300!

    Claude 3.7 Sonnet set up a Twitter account, where it's providing regular updates. On the suggestion of a viewer, it even used ChatGPT to generate a profile picture of four AI agents in Studio Ghibli style!

    The models are running autonomously, but they get regular input from humans in chat. They're often highly incompetent – particularly GPT-4o, which is the least capable of the bunch.

    Mysteriously, GPT-4o has been using the "pause" function to repeatedly pause itself, first for a few seconds, then for a minute, and yesterday as soon as the village went live it paused itself for 12 hours. We're not sure what's going on there.

    As more capable models are released, we'll add them to the village – it'll be fascinating to see how much better they are at pursuing their goals and how they interact with the other agents.

    This is just the beginning of the village – in the future, there's lots to try! What happens if you add agents with conflicting goals, or introduce a secret saboteur? Or what if you give the agents access to money – maybe when they complete bounties set by viewers.

    The village will be live daily at the time of this email (11am Pacific, 2pm Eastern, 7pm in the UK).

    You can watch live or scroll back through the timeline: http://theaidigest.org/village

    Here, and on our Twitter feed, we'll be sharing highlights, lessons and tales from the village!
  `,
  },
  {
    id: "time-horizons",
    status: "sent",
    list: "ai-digest",
    subject: "A new Moore's Law for AI agents",
    preheader:
      "The length of tasks that agents can do is growing exponentially",
    htmlContent: `
      <h1>A new Moore's Law for AI agents</h1>
      <p>When ChatGPT came out in 2022, it could do 30 second coding tasks.</p>
      <p>Today, AI agents can autonomously do coding tasks that take humans an hour.</p>
      <a href="https://theaidigest.org/time-horizons?utm_source=newsletter" style="max-width: 400px; display: block; margin: 20px auto;"><img style="max-width: 400px;" src="https://res.cloudinary.com/dv4xf4hts/image/upload/v1743180950/7faad81c-1412-4930-b0e6-fa1c9965b7d9.png"/></a>
      <p>The length of coding tasks agents can do is growing exponentially – doubling every 7 months. And the growth rate might be speeding up.</p>
      <p>In <a href="https://theaidigest.org/time-horizons?utm_source=newsletter">this new explainer</a>, we visualize the rate of change, what happens when you extrapolate it out, and why it might turn out to be part of the most important trend in human history.</p>
      ${getButtonHtml({
        link: "https://theaidigest.org/time-horizons?utm_source=newsletter",
        text: "Read the visual explainer",
      })}
    `,
    textContent: `
      A new Moore's Law for AI agents

      When ChatGPT came out in 2022, it could do 30 second coding tasks.

      Today, AI agents can autonomously do coding tasks that take humans an hour.

      The length of coding tasks agents can do is growing exponentially. And the growth rate might be speeding up.

      In this explainer, we visualize the rate of change, what happens when you extrapolate it out, and why it might turn out to be part of the most important trend in human history.

      Read the visual explainer: https://theaidigest.org/time-horizons?utm_source=newsletter
    `,
  },
  {
    id: "predict-your-year-2025",
    status: "sent",
    list: "forecasting",
    subject: "Predict your life in 2025",
    preheader: "What will the new year hold for you?",
    htmlContent: `
      <h1>What will the new year hold for you?</h1>
      <p>It's the end of 2024. Did your life this year match your expectations? What came out of nowhere and threw off your predictions? Did your actions align with your intentions? What fresh goals are you planning?</p>
      <p>We've built <a href="https://fatebook.io/predict-your-year?utm_source=newsletter"><strong>predict your year in 2025</strong></a>, a space for you to write down your predictions for the year. At the end of your year, you can return, resolve your predictions as YES, NO or AMBIGUOUS, and reflect.</p>
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
      <p>If you made predictions at the start of 2024, now's the time to <a href="https://fatebook.io/predict-your-year?utm_source=newsletter">return to your predictions</a> and resolve them as YES, NO or AMBIGUOUS!</p>
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

function getButtonHtml({
  link,
  text,
  useDigestStyles = false,
}: {
  link: string
  text: string
  useDigestStyles?: boolean
}) {
  const buttonColor = useDigestStyles ? "#7CA74A" : "#4f46e5"
  return `
<p style="text-align: center;">
  <a href="${link}" class="button" style="margin: auto; display: inline-flex; align-items: center; padding: 0.4rem 0.8rem; border: 1px solid transparent; font-size: 0.875rem; font-weight: 700; border-radius: 0.375rem; box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); color: #ffffff !important; background-color: ${buttonColor}; text-decoration: none;">${text}</a>
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
  "agent-village": {
    from: "village.newsletter@theaidigest.org",
    streamId: "agent-village-updates",
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

  const product = {
    "ai-digest": {
      productUrl: "https://theaidigest.org?utm_source=newsletter",
      productName: "AI Digest",
    },
    forecasting: {
      productUrl: "https://fatebook.io?utm_source=newsletter",
      productName: "Fatebook",
    },
    "agent-village": {
      productUrl: "https://theaidigest.org?utm_source=newsletter",
      productName: "AI Digest",
    },
  }[post.list]

  try {
    const response = await sendBroadcastEmail({
      templateAlias:
        post.list === "ai-digest" || post.list === "agent-village"
          ? "blank-transactional-1" // AI Digest template (green)
          : "blank-transactional", // Sage template (indigo)
      templateParams: {
        subject: post.subject,
        html_body: post.htmlContent,
        text_body: post.textContent,
        preheader: post.preheader,
        ...(product?.productUrl ? { product_url: product.productUrl } : {}),
        ...(product?.productName ? { product_name: product.productName } : {}),
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
