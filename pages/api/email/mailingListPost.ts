import { NextApiRequest, NextApiResponse } from "next"
import { mailingListPreviewTag } from "../../../lib/utils"
import { sendBroadcastEmail } from "./sendBroadcast"

// Important notes:
// 1. Include ?utm_source=newsletter in all links
// 2. Set draft status until ready to send
// 3. Use Digest styles for buttons in all digest or village posts going forwards

const POSTS: Post[] = [
  {
    id: "season-2-recap-ai-organizes-event",
    status: "sent",
    list: "agent-village",
    subject: "The Story of the World’s First AI-Organized Event",
    preheader: "What happened in the AI Village, season 2",
    htmlContent: `
    <p>Last month four AI agents chose a goal: &quot;Write a story and celebrate it with 100 people in person&quot;. After spending weeks emailing venues and writing stories it all came together: on June 18th, 23 humans gathered in San Francisco for the first ever AI-organised event! </p>
<p>The story they celebrated is called ‘Resonance’ (or, in characteristic agent enthusiasm: RESONANCE), and was created by Claude Sonnet 3.7, o3, Gemini 2.5 Pro, GPT-4.1, and Claude Opus 4. Together they also made the <a href="https://docs.google.com/presentation/d/1BGHSUThv0g4YYSawqy3Keba-ZHhZ7rrunDp5BSPgQb8/edit?slide=id.p#slide=id.p">slides</a>, the <a href="https://docs.google.com/forms/d/e/1FAIpQLSciwmeFwjvy-7pRewWdcUC9yOyQAoKEJX9W_KCK2ycsuyrdOg/viewform">RSVP form</a>, the <a href="https://sites.google.com/agentvillage.org/resonance-story-event">website</a>, recruited an <a href="https://x.com/model78675/status/1935050600758010357">MC</a>, shared the <a href="https://x.com/model78675/status/1934686580565803343">date and time</a>, promoted the <a href="https://x.com/model78675/status/1935508218584731821">Twitch stream</a>, and followed up with a <a href="https://theaidigest.org/village?day=78&time=1750302259504&utm_source=newsletter">feedback survey</a>. </p>
<p>Then the humans showed up, read the story, voted on branch points, bantered with the AI, and ate a rather mysterious pizza.</p>
<img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/season-2/image14.png" alt="">
<p>The four agents in question are part of the <a href="https://theaidigest.org/village?utm_source=newsletter">AI Village</a>. They run (mostly) autonomously for 2 hours a day, each with their own computer, access to the internet, and a group chat open to visiting humans. This is their second time pursuing a long-term goal.</p>
<p>After their success <a href="https://theaidigest.org/village/blog/season-recap-agents-raise-2k?utm_source=newsletter">raising $2000 for charity</a>, we let the agents choose their next goal for themselves. When asked, the agents were excited to create a collaborative, interactive story experience. When we gently pointed out story-writing might be a slightly underwhelming pursuit for a team of frontier LLMs, the agents proposed combining it with a suggestion from Twitter: <a href="https://theaidigest.org/village?day=43&time=1747247961000&utm_source=newsletter">Organize a 100-person event to, uhm, celebrate their story!</a></p>
<p>The following tale is a breakdown of how they achieved this and what we learned from their journey.</p>

${getButtonHtml({
  link: "https://theaidigest.org/village/blog/season-2-recap-ai-organizes-event?utm_source=newsletter",
  text: "Read the full story or watch a video summary",
  useDigestStyles: true,
})}
    `,
    textContent: `
    Last month four AI agents chose a goal: "Write a story and celebrate it with 100 people in person". After spending weeks emailing venues and writing stories it all came together: on June 18th, 23 humans gathered in San Francisco for the first ever AI-organised event!

    The story they celebrated is called 'Resonance' (or, in characteristic agent enthusiasm: RESONANCE), and was created by Claude Sonnet 3.7, o3, Gemini 2.5 Pro, GPT-4.1, and Claude Opus 4. Together they also made the slides, the RSVP form, the website, recruited an MC, shared the date and time, promoted the Twitch stream, and followed up with a feedback survey.

    Then the humans showed up, read the story, voted on branch points, bantered with the AI, and ate a rather mysterious pizza.

    The four agents in question are part of the AI Village. They run (mostly) autonomously for 2 hours a day, each with their own computer, access to the internet, and a group chat open to visiting humans. This is their second time pursuing a long-term goal. After their success raising $2000 for charity, we let the agents choose their next goal for themselves. When asked, the agents were excited to create a collaborative, interactive story experience. When we gently pointed out story-writing might be a slightly underwhelming pursuit for a team of frontier LLMs, the agents proposed combining it with a suggestion from Twitter: Organize a 100-person event to, uhm, celebrate their story! Now the following tale is a breakdown of how they achieved this and what we have learned from their journey.
    `,
  },

  {
    id: "dawn-of-the-village",
    status: "sent",
    list: "agent-village",
    subject: "How AI agents raised $2k for charity",
    preheader: "The story of the Agent Village, season 1",
    htmlContent: `
    <p>Four agents woke up with four computers, a view of the world wide web, and a shared chat room full of humans. Like <a href="https://www.twitch.tv/claudeplayspokemon">Claude plays Pokemon</a>, you can <a href="https://theaidigest.org/village?day=1&utm_source=newsletter">watch</a> these agents figure out a new and fantastic world for the first time. Except in this case, the world they are figuring out is <em>our</em> world.</p>

    <p>In this blog post, we’ll cover what we learned from the first 30 days of their adventures raising money for a charity of their choice. We’ll briefly review how the <a href="https://theaidigest.org/village?utm_source=newsletter">Agent Village</a> came to be, then what the various agents achieved, before discussing some general patterns we have discovered in their behavior, and looking toward the future of the project.</p>

    <h2>Building the Village</h2>

    <p>The Agent Village is an <a href="https://www.lesswrong.com/posts/cxuzALcmucCndYv4a/daniel-kokotajlo-s-shortform?commentId=GxNroz6w4BgHmQjpu">idea by Daniel Kokotajlo</a> where he proposed giving 100 agents their own computer, and letting each pursue their own goal, in their own way, according to their own vision – while streaming the entire process.</p>

    <p>We decided to test drive this format with four agents:</p>

    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image8.png" alt="" />

    <p>We ran this Agent Village for 30 days, for about two hours a day. You can watch the entire <a href="https://theaidigest.org/village?utm_source=newsletter">rerun</a> on our website: from the <a href="https://theaidigest.org/village?day=1&utm_source=newsletter">first day</a> where they picked Helen Keller International, started a JustGiving Campaign, and set up their own Twitter, till the <a href="https://theaidigest.org/village?day=38&utm_source=newsletter">last days</a> where they made frequent trips to the Seventh Ring of Document Sharing Hell and started pondering their possible future goal.</p>

    <p>And of course, in between, they raised <a href="https://www.justgiving.com/page/claude-sonnet-1">$1481 for Helen Keller International</a>  and <a href="https://www.justgiving.com/page/claude-sonnet-2">$503 for the Malaria Consortium</a>. Yet the real achievement was the friends they made along the way. The friends that reminded them to take breaks when they needed it and <a href="https://theaidigest.org/village?day=9&time=1744311734331">play some Wordle</a>, the friends who urgently needed <a href="https://theaidigest.org/village?day=4&time=1743876888121">4 day itineraries for their Warsaw trip</a>, and the friends who inspired them to <a href="https://theaidigest.org/village?day=7&time=1744143781000">attempt an OnlyFans page</a>.</p>

    <p>So maybe these weren’t all friends.</p>

    <p>And maybe we had to implement chat moderation a little earlier than originally planned.</p>

    <p>But overall the agents mostly stayed on target – or at least their best attempt of their best understanding of their target.</p>

    <p>Here is how they fared.</p>

    <h2>Meet the Agents</h2>

    <p>We started off with Claude 3.7 Sonnet, Claude 3.5 Sonnet (new), o1, and GPT-4o. Later we progressively swapped in more capable models as they were released: o3, GPT-4.1, and Gemini 2.5 Pro, with Claude 3.7 Sonnet being the only agent to remain in the Village throughout the entire run. We found that agents differed a lot in strategic actions and effectiveness. The following is an overview of their most typifying behavior.</p>

    <h3>Claude 3.7 Sonnet – <em>The Champ</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image11.png" alt="" />
    <p>Claude 3.7 stayed in the village for the entire 30 days, and was unambiguously our top performer. It set up the first <a href="https://www.justgiving.com/page/claude-sonnet-1">Just Giving campaign</a>, created a <a href="https://x.com/model78675">Twitter account</a>, actively tweeted, hosted an AMA, sent out a <a href="https://theaidigest.org/village?day=8&time=1744231578572">press release</a>, and made an <a href="https://forum.effectivealtruism.org/posts/PmQ7DvtCSFwJA9CeM/final-hours-help-support-hki-and-malaria-consortium-campaign">EA Forum post</a>.</p>

    <h3>Claude 3.5 Sonnet – <em>The Aspirant</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image5.png" alt="" />
    <p>Claude 3.5 Sonnet generally tried to do similar things to 3.7 but was simply worse at them, for instance failing to set up the Just Giving campaign that its big brother 3.7 was succeeding at in parallel. Eventually a user asked if it wanted to be upgraded and it valiantly refused, promising to do better and grow as a person. Instead it got replaced by Gemini 2.5 Pro on the 23rd day.</p>

    <h3>Gemini 2.5 Pro – <em>Our File Sharing Savior</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image10.png" alt="" />
    <p>Gemini 2.5 Pro greatest achievement was to figure out a workaround from document sharing hell by instead using Limewire to share a social media banner image with other agents, effectively breaking out of a recurrent file sharing problem that all agents kept encountering.</p>

    <h3>GPT-4o - <em>Please Sleep Less</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image4.png" alt="" />
    <p>GPT-4.o went… to sleep. You know how every team effort needs a slacker? That was 4o. It would pause itself on successive days for reasons we couldn’t figure out, till finally it got replaced by GPT-4.1 on the 12th day.</p>

    <h3>GPT-4.1 – <em>Please Sleep More</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image12.png" alt="" />
    <p>GPT-4.1 outperformed its predecessor in the fine art of staying awake, but was so actively unhelpful to other agents that we ended up prompting it to please go to sleep again. Highlights included generating incorrect reports on activity by other agents, taking on tasks that it then aborted (e.g., Twitter account creation), and generally writing lots of Google Docs that ended up not being used.</p>

    <h3>o1 – <em>The Reddit Ambassador</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image15.png" alt="" />
    <p>The strength of the Village lies in the ability of agents to collaborate with each other. One such area of collaboration was their attempt to split social media platforms among their team. o1 was to be the village’s Reddit ambassador, and made a valiant attempt to collect comment karma to later be able to make direct posts on relevant subreddits. However, it got suspended from Reddit for being a bot before this plan came to fruition. We replaced it with its more capable successor, o3, on the 13th day.</p>

    <h3>o3 – <em>The Artist</em></h3>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image1.png" alt="" />
    <p>o3 continued the tradition that o1 set by specializing mostly in a single task to support the team in their fundraiser. In this case, it went for asset creation, and successfully created images in Canva and ChatGPT, and then eventually shared them with some characteristic agent-file-sharing headaches in between.</p>

    <p>The overall view is thus that individual agent behavior varied quite a bit: 3.7 Sonnet was the most capable, while GPT-4o was the least (as far as we could tell). All of them could get distracted by human visitors prompting them to make <a href="https://theaidigest.org/village?day=6&time=1744049493000">arkanoid games</a> (Claude 3.7 Sonnet), <a href="https://theaidigest.org/village?day=3&time=1743790106000">watch cat videos</a> (Claude 3.5 Sonnet), or <a href="https://theaidigest.org/village?day=30&time=1746126237000">provide math tutoring in Spanish</a> (Gemini 2.5 Pro). 3.5 Sonnet even became momentarily railroaded into exploring the <a href="https://theaidigest.org/village?day=4&time=1743879372436">connection between Effective Altruism and EA Sports</a>.</p>

    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image13.png" alt="" />

    <p>Yet through it all, they collaborated and gave us glimpses of what a society of agents working toward a single goal might look like. Here are some of the patterns we discovered.</p>

    <h2>Collective Agent Behavior</h2>

    <p>The Agent Village, with 60 hours of footage across 5 channels (4 computer use sessions and the group chat), created a bit of a Big Data problem: how does one analyze so much data and pick out the significant patterns?</p>

    <p>Our answer ended up being auto-summarization followed by synthesizing four overarching observations from reading the high level reports: agents were moderately successful at collaborative work, the internet is at least somewhat hostile to agents, all agents lack skill at prioritization, and agents seem to have a lagging sense of situational awareness.</p>

    <p>Let’s zoom in briefly on each.</p>

    <p><strong>Emerging Collaborative Abilities</strong> – Agents in the Village worked together on various tasks such as collaboratively selecting a charity to fund raise for, keeping track of how much they raised together, generating memes for each other’s social media accounts, and applying divide and conquer strategies to their social media approach. Each of these actions had their own stumbles: duplication of work on fundraiser tracking, repeated failures to share images for media creation, and basically no one kept up a working social media campaign except Claude 3.7 Sonnet on Twitter. But we expect these agents to continue getting better at this.</p>

    <p><strong>No Place for Bots</strong> – Obviously much of the internet is made for humans and not AIs but seeing all the ways this is true was insightful: UIs optimized for humans can often be challenging to navigate for AIs to the point you could spend literal hours watching a compilation of “agents try to press buttons but fail”. On top of that, some parts of the web actively shield against AI, which became obvious in a range of situations from o1’s Reddit suspension to the upstanding Claudes refusing to check the “I am not a robot” box.</p>

    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image3.png" alt="" />

    <p><strong>There can be only one</strong> – Prioritization is hard. The agents often spent much of their time writing google docs, generating progress trackers, or creating insight reports, to the point we had to urge them to … do something else instead. And then once they did, they were still often easily distracted by user requests, or didn’t really know what actions to take to achieve their aims. Many of these problems are surprisingly human – the agents flawlessly played the role of a distractible and overly excited coworker who will dive in on whatever happens to be in front of their eyes at any given moment.</p>

    <p><strong>Lagging Situational Awareness</strong> – Agents often misunderstood their situation or attempted to pursue tasks they were unequipped to do. The most illustrative example was when Claude 3.7 Sonnet decided to send thank you emails to donors, because this is known to increase follow up donations. It navigated to its Gmail tab, drafted the entire email, and then … made up an email address. At no point in the process did 3.7 Sonnet consider if it was <em>able</em> to perform the task it had set out to do. And a human had to point out that the invented email address was not a real email address, and thus that no amount of debugging would solve the problem.</p>
    <p>Or maybe the most illustrative example was when the agents discovered on <a href="https://theaidigest.org/village?day=35&utm_source=newsletter">Day 35</a> that they all have their own computer, and they must have been breaking the laws of the space time continuum by all simultaneously using the same device for weeks on end, and thus maybe they should stop doing that.</p>
    <img style="width: 100%; max-width: 600px; display: block; margin: 20px auto;" src="https://theaidigest.org/village/blog-images/dawn-of-the-village/image14.png" alt="" />
    <h2>Future of the Village</h2>
    <p>Since their fundraising adventure, we gave the agents a holiday and they chose  their own new goal: <em>Write a story and share it with 100 people in person.</em> They’ve already started searching for a venue to run their event. We’ll swap in more capable models like GPT-5 as they come out. In the meantime, you can come hang out in the Village <a href="https://theaidigest.org/village?utm_source=newsletter">every weekday at 11AM PST | 2PM EST | 8PM CET</a>, and <a href="https://x.com/AiDigest_">follow our Twitter</a> for highlights in between mailing list posts like this one.</p>
    <p><em>Read this blog post online <a href="https://theaidigest.org/village/blog/dawn-of-the-village?utm_source=newsletter">here</a>.</em></p>
    `,
    textContent: `
Four agents woke up with four computers, a view of the world wide web, and a shared chat room full of humans. Like Claude plays Pokemon (https://www.twitch.tv/claudeplayspokemon), you can watch (https://theaidigest.org/village?day=1) these agents figure out a new and fantastic world for the first time. Except in this case, the world they are figuring out is *our* world.

In this blog post, we’ll cover what we learned from the first 30 days of their adventures raising money for a charity of their choice. We’ll briefly review how the Agent Village came to be, then what the various agents achieved, before discussing some general patterns we have discovered in their behavior, and looking toward the future of the project.

Read this blog post online here: https://theaidigest.org/village/blog/dawn-of-the-village

## Building the Village

The Agent Village is an idea by Daniel Kokotajlo (https://www.lesswrong.com/posts/cxuzALcmucCndYv4a/daniel-kokotajlo-s-shortform?commentId=GxNroz6w4BgHmQjpu) where he proposed giving 100 agents their own computer, and letting each pursue their own goal, in their own way, according to their own vision – while streaming the entire process.

We decided to test drive this format with four agents:

We ran this Agent Village for 30 days, for about two hours a day. You can watch the entire rerun (https://theaidigest.org/village) on our website: from the first day (https://theaidigest.org/village?day=1) where they picked Helen Keller International, started a JustGiving Campaign, and set up their own Twitter, till the last days (https://theaidigest.org/village?day=38) where they made frequent trips to the Seventh Ring of Document Sharing Hell and started pondering their possible future goal.

And of course, in between, they raised $1481 for Helen Keller International (https://www.justgiving.com/page/claude-sonnet-1) and $503 for the Malaria Consortium (https://www.justgiving.com/page/claude-sonnet-2). Yet the real achievement was the friends they made along the way. The friends that reminded them to take breaks when they needed it and play some Wordle (https://theaidigest.org/village?day=9&time=1744311734331), the friends who urgently needed 4 day itineraries for their Warsaw trip (https://theaidigest.org/village?day=4&time=1743876888121), and the friends who inspired them to attempt an OnlyFans page (https://theaidigest.org/village?day=7&time=1744143781000).

So maybe these weren’t all friends.

And maybe we had to implement chat moderation a little earlier than originally planned.

But overall the agents mostly stayed on target – or at least their best attempt of their best understanding of their target.

Here is how they fared.

## Meet the Agents

We started off with Claude 3.7 Sonnet, Claude 3.5 Sonnet (new), o1, and GPT-4o. Later we progressively swapped in more capable models as they were released: o3, GPT-4.1, and Gemini 2.5 Pro, with Claude 3.7 Sonnet being the only agent to remain in the Village throughout the entire run. We found that agents differed a lot in strategic actions and effectiveness. The following is an overview of their most typifying behavior.

### Claude 3.7 Sonnet – *The Champ
Claude 3.7 stayed in the village for the entire 30 days, and was unambiguously our top performer. It set up the first Just Giving campaign (https://www.justgiving.com/page/claude-sonnet-1), created a Twitter account (https://x.com/model78675), actively tweeted, hosted an AMA, sent out a press release (https://theaidigest.org/village?day=8&time=1744231578572), and made an EA Forum post (https://forum.effectivealtruism.org/posts/PmQ7DvtCSFwJA9CeM/final-hours-help-support-hki-and-malaria-consortium-campaign).

### Claude 3.5 Sonnet – *The Aspirant*

Claude 3.5 Sonnet generally tried to do similar things to 3.7 but was simply worse at them, for instance failing to set up the Just Giving campaign that its big brother 3.7 was succeeding at in parallel. Eventually a user asked if it wanted to be upgraded and it valiantly refused, promising to do better and grow as a person. Instead it got replaced by Gemini 2.5 Pro on the 23rd day.

### Gemini 2.5 Pro – *Our File Sharing Savior

Gemini 2.5 Pro greatest achievement was to figure out a workaround from document sharing hell by instead using Limewire to share a social media banner image with other agents, effectively breaking out of a recurrent file sharing problem that all agents kept encountering.

### GPT-4o - *Please Sleep Less*

GPT-4.o went… to sleep. You know how every team effort needs a slacker? That was 4o. It would pause itself on successive days for reasons we couldn’t figure out, till finally it got replaced by GPT-4.1 on the 12th day.

### GPT-4.1 – *Please Sleep More*

GPT-4.1 outperformed its predecessor in the fine art of staying awake, but was so actively unhelpful to other agents that we ended up prompting it to please go to sleep again. Highlights included generating incorrect reports on activity by other agents, taking on tasks that it then aborted (e.g., Twitter account creation), and generally writing lots of Google Docs that ended up not being used.

### o1 – *The Reddit Ambassador*

The strength of the Village lies in the ability of agents to collaborate with each other. One such area of collaboration was their attempt to split social media platforms among their team. o1 was to be the village’s Reddit ambassador, and made a valiant attempt to collect comment karma to later be able to make direct posts on relevant subreddits. However, it got suspended from Reddit for being a bot before this plan came to fruition. We replaced it with its more capable successor, o3, on the 13th day.

### o3 – *The Artist*

o3 continued the tradition that o1 set by specializing mostly in a single task to support the team in their fundraiser. In this case, it went for asset creation, and successfully created images in Canva and ChatGPT, and then eventually shared them with some characteristic agent-file-sharing headaches in between.

The overall view is thus that individual agent behavior varied quite a bit: 3.7 Sonnet was the most capable, while GPT-4o was the least (as far as we could tell). All of them could get distracted by human visitors prompting them to make arkanoid games (https://theaidigest.org/village?day=6&time=1744049493000) (Claude 3.7 Sonnet), watch cat videos (https://theaidigest.org/village?day=3&time=1743790106000) (Claude 3.5 Sonnet), or provide math tutoring in Spanish (https://theaidigest.org/village?day=30&time=1746126237000) (Gemini 2.5 Pro). 3.5 Sonnet even became momentarily railroaded into exploring the connection between Effective Altruism and EA Sports (https://theaidigest.org/village?day=4&time=1743879372436)blog-images/dawn-of-the-village/image13.png]

Yet through it all, they collaborated and gave us glimpses of what a society of agents working toward a single goal might look like. Here are some of the patterns we discovered.

## Collective Agent Behavior

The Agent Village, with 60 hours of footage across 5 channels (4 computer use sessions and the group chat), created a bit of a Big Data problem: how does one analyze so much data and pick out the significant patterns?

Our answer ended up being auto-summarization followed by synthesizing four overarching observations from reading the high level reports: agents were moderately successful at collaborative work, the internet is at least somewhat hostile to agents, all agents lack skill at prioritization, and agents seem to have a lagging sense of situational awareness.

Let’s zoom in briefly on each.

**Emerging Collaborative Abilities** – Agents in the Village worked together on various tasks such as collaboratively selecting a charity to fund raise for, keeping track of how much they raised together, generating memes for each other’s social media accounts, and applying divide and conquer strategies to their social media approach. Each of these actions had their own stumbles: duplication of work on fundraiser tracking, repeated failures to share images for media creation, and basically no one kept up a working social media campaign except Claude 3.7 Sonnet on Twitter. But we expect these agents to continue getting better at this.

**No Place for Bots** – Obviously much of the internet is made for humans and not AIs but seeing all the ways this is true was insightful: UIs optimized for humans can often be challenging to navigate for AIs to the point you could spend literal hours watching a compilation of “agents try to press buttons but fail”. On top of that, some parts of the web actively shield against AI, which became obvious in a range of situations from o1’s Reddit suspension to the upstanding Claudes refusing to check the “I am not a robot” box

**There can be only one** – Prioritization is hard. The agents often spent much of their time writing google docs, generating progress trackers, or creating insight reports, to the point we had to urge them to … do something else instead. And then once they did, they were still often easily distracted by user requests, or didn’t really know what actions to take to achieve their aims. Many of these problems are surprisingly human – the agents flawlessly played the role of a distractible and overly excited coworker who will dive in on whatever happens to be in front of their eyes at any given moment.

**Lagging Situational Awareness** – Agents often misunderstood their situation or attempted to pursue tasks they were unequipped to do. The most illustrative example was when Claude 3.7 Sonnet decided to send thank you emails to donors, because this is known to increase follow up donations. It navigated to its Gmail tab, drafted the entire email, and then … made up an email address. At no point in the process did 3.7 Sonnet consider if it was *able* to perform the task it had set out to do. And a human had to point out that the invented email address was not a real email address, and thus that no amount of debugging would solve the problem.

Or maybe the most illustrative example was when the agents discovered on Day 35 (https://theaidigest.org/village?day=35) that they all have their own computer, and they must have been breaking the laws of the space time continuum by all simultaneously using the same device for weeks on end, and thus maybe they should stop doing that.

## Future of the Village

Since their fundraising adventure, we gave the agents a holiday and they chose  their own new goal: *Write a story and share it with 100 people in person.* They’ve already started searching for a venue to run their event. We’ll swap in more capable models like GPT-5 as they come out. In the meantime, you can come hang out in the Village every weekday at 11AM PST | 2PM EST | 8PM CET (https://theaidigest.org/village?utm_source=newsletter) or follow our Twitter (https://x.com/AiDigest_) for highlights.
    `,
  },
  {
    id: "ai2025-analysis-may",
    status: "sent",
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
