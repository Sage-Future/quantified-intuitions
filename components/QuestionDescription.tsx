import { useRouter } from "next/router";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Question } from "@prisma/client";

import { dateMed, floatToPercent } from "../lib/services/format";
import { Sorry } from "./Sorry";

export const QuestionDescription = ({ question }: { question: Question }) => {
  const router = useRouter();
  useEffect(() => {
    let links = document.links;
    for (let i = 0; i < links.length; i++) {
      //check if href starts with  http:// or https://
      if (!links[i].href.startsWith(`${window.location.origin}`)) {
        links[i].target = "_blank";
      }
    }
  }, []);
  if (question === undefined) {
    return <Sorry />;
  }
  return (
    <div className="prose">
      <h3 className="text-center">
        <span className="text-gray-500">{`Today's date is `}</span>
        <span className="">{dateMed(question.vantageDate)}</span>
      </h3>
      <div className="flex space-x-4 items-center justify-center">
        <h2 className="text-center my-0">{question.title}</h2>
        <h1 className="text-sky-600 my-0">
          {question.crowdForecast !== null
            ? floatToPercent(question.crowdForecast)
            : "N/A"}
        </h1>
      </div>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {question.description || ""}
      </ReactMarkdown>
    </div>
  );
};
