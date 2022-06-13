import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Question } from "@prisma/client";

import { dateMed } from "../lib/services/format";
import { Sorry } from "./Sorry";

export const QuestionDescription = ({ question }: { question: Question }) => {
  if (question === undefined) {
    return <Sorry />;
  }
  return (
    <>
      <div className="text-lg max-w-prose mx-auto">
        <h1 className="text-3xl font-bold text-center">{question.title}</h1>
      </div>
      <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
        <p>The Vantage Point is {dateMed(question.vantageDate)}</p>
        {question.crowdForecast !== null && (
          <p>The crowd forecast is {question.crowdForecast}</p>
        )}
        <br />
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {question.description || ""}
        </ReactMarkdown>
      </div>
    </>
  );
};
