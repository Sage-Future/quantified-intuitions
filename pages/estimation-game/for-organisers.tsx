import { RocketLaunchIcon, TrophyIcon, UsersIcon } from "@heroicons/react/24/solid"
import { GetStaticProps } from "next"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

import { Footer } from "../../components/Footer"
import { MailingListSignup } from "../../components/MailingListSignup"
import { NavbarChallenge } from "../../components/NavbarChallenge"

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {},
  }
}

const Faq = () => {
  const faqs = [
    {
      question: "When?",
      answer:
        "Thursday 16th or Friday 17th Feb, any time.",
    },
    {
      question: "How long?",
      answer:
        "Around 40 mins. If you want a longer event, you could do some [pastcasting](https://quantifiedintuitions.org/pastcasting) questions afterwards, or just hang out.",
    },
    {
      question: "What does The Estimation Game look like?",
      answer: "Check out this sample challenge [coming soon]. (No spoilers here! The questions will be different for the real thing)"
    },
    {
      question: "How easy is it to organise this event?",
      answer:
        "Super easy! To save you time, you can use [this sample event title and description](https://docs.google.com/document/d/1y5eROqXhcDf9qFmoFmR1-fQNQklqsSZi9bQRNFuydas/edit?usp=sharing) that you can tailor for your group. All you need to do is get some people together in a room and start playing.",
    },
    {
      question: "Who should I invite?",
      answer:
        "Anyone! Questions don't rely on EA knowledge - it's designed for everyone.",
    },
    {
      question: "Who can host events?",
      answer: "You can! Assemble your EA group, your group chat or your coworkers.",
    },
    {
      question: "What do I need to run the event?",
      answer: "Each team will need a phone or laptop to play. We'd recommend teams of 2-3, or at most 5 people. Players might want to use pen and paper to make notes, or they can use a notetaking app or [Guesstimate](https://getguesstimate.com).",
    },
    {
      question: "This is the 'first monthly' Estimation Game?",
      answer: "This is the first ever! A new challenge will drop each month, if you sign up above we'll email you about it.",
    },
    {
      question: "Can I play solo?",
      answer: "Absolutely! Be sure to mention it in your team name so your leaderboard position is even more impressive!",
    },
    {
      question: "Can my team play remotely?",
      answer: "Yes - just have one person use the website and screenshare the questions.",
    },
    {
      question: "How can I submit feedback about the site?",
      answer: "You can email us at adam@sage-future.org or message us on our [Discord](https://discord.gg/mt9YVB8VDE).",
    },
    {
      question: "Who made this?",
      answer: "We're [Sage](https://forum.effectivealtruism.org/users/sage). We previously made [Pastcasting](https://www.quantifiedintuitions.org/pastcasting) - predict past events to rapidly practise forecasting - and [Calibration](https://www.quantifiedintuitions.org/calibration) - answer EA trivia questions to calibrate your uncertainty.",
    },
  ]
  return (
    <div className="flex flex-col min-h-screen ">
      <NavbarChallenge />
      <div className="bg-gray-50 grow">
        <div className="max-w-7xl pt-12 px-4 lg:pt-16 lg:px-8 mx-auto prose">
          <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
            The Estimation Game
          </h2>
          <h3 className="text-gray-600">An off-the-shelf event for your group</h3>

          <p className="mt-12">Host an event for your group members to play The Estimation Game!</p>

          <div className="">
            <ul className="list-none space-y-4 pl-0">
              <li className="flex items-center space-x-3"><UsersIcon className="flex-shrink-0 mr-2 w-6 h-6 text-indigo-500 inline-block" /> <span>{'Players answer two rounds of Fermi estimation questions, like "How many piano tuners are in New York?"'}</span></li>
              <li className="flex items-center space-x-3"><TrophyIcon className="flex-shrink-0 mr-2 w-6 h-6 text-indigo-500 inline-block" /><span> Form teams and see how your scores compare to other EA groups and orgs around the world</span></li>
              <li className="flex items-center space-x-3"><RocketLaunchIcon className="flex-shrink-0 mr-2 w-6 h-6 text-indigo-500 inline-block" /><span> Designed to be super easy for you to organise the event</span></li>
            </ul>
          </div>

          <p className="">All you need to do is get bring some people together and point them to <Link href="/estimation-game">The Estimation Game</Link>{"'s website."}</p>

          <MailingListSignup buttonText="Remind me about the event" tags={["estimation-game-organiser"]}/>
        </div>

        <div className="max-w-7xl mx-auto py-12 px-4 divide-y divide-gray-200 sm:px-6 lg:px-8">
          <h3 className="mt-10 text-2xl font-bold text-gray-700">
            Frequently asked questions
          </h3>
          <div className="mt-8">
            <dl className="divide-y divide-gray-200">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8"
                >
                  <dt className="text-base font-medium text-gray-900 md:col-span-5">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 md:mt-0 md:col-span-7">
                    <div className="text-base text-gray-500 prose">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {faq.answer}
                      </ReactMarkdown>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
export default Faq
