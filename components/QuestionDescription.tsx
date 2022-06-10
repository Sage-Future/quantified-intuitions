import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Question } from "@prisma/client";

export const QuestionDescription = ({ question }: { question: Question }) => {
  return (
    <div className="text-lg max-w-prose mx-auto">
      <h1 className="text-3xl font-bold text-center">{question.title}</h1>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {question.description || ""}
      </ReactMarkdown>
      <p>The Vantage Point is {question.vantageDate.toString()}</p>
    </div>
  );
};
