import { event } from "nextjs-google-analytics";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LoadingButton } from "./LoadingButton";

export function OpenEndedQuestions({

}: {

  }) {

  const [showQuestions, setShowQuestions] = useState(false)

  const questions = [
    "How many hours in the last month have you spent sitting down?",
    "On average, how much have current billionaires inherited from their parents?",
    "How many humans alive today will live to the age of 1000?",
    "How many total hours have humans spent playing Nintendo games featuring Mario as a playable character?",
    "How much does it cost to use a dishwasher daily for a year compared to handwashing dishes?",
    "Over the course of a month, if a new meditator spends one hour a day doing mindfulness meditation before doing seven hours of knowledge work, how many additional highly-focussed minutes would they have, compared to if they did no meditation and worked seven hours a day?",
  ]

  return (
    <div className="my-12 prose">
      {
        showQuestions ?
          <>
            <h4>{"Bonus open-ended questions"}</h4>
            <ol>
              {
                questions.map((question, index) =>
                  <li key={question}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {question}
                    </ReactMarkdown>
                  </li>
                )
              }
            </ol>
          </>
          :
          <>
            <button
              className=" relative inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                setShowQuestions(true)
                event("estimation_game_show_open_ended_questions", {
                  app: "estimation_game",
                });
              }}
            >
              {"Want to keep playing? Try some more open-ended questions"}
            </button>
          </>
      }
    </div >
  )
}