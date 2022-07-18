import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Transition } from "@headlessui/react";
import { EyeOffIcon } from "@heroicons/react/solid";

import { dateMed, floatToPercent } from "../lib/services/format";
import { QuestionWithComments } from "../types/additional";
import { OldComments } from "./OldComments";
import { Sorry } from "./Sorry";

export const QuestionDescription = ({
  question,
}: {
  question: QuestionWithComments;
}) => {
  const router = useRouter();
  const [isHidden, setIsHidden] = useState<string>("");
  useEffect(() => {
    let links = document.links;
    for (let i = 0; i < links.length; i++) {
      if (!links[i].href.startsWith(`${window.location.origin}`)) {
        links[i].target = "_blank";
      }
    }
  }, [question.id]);
  if (question === undefined) {
    return <Sorry />;
  }
  return (
    <>
      <div className="prose break-words">
        <h3 className="text-center">
          <span className="text-gray-500">{`The date is `}</span>
          <span className="">{dateMed(question.vantageDate)}</span>
        </h3>
        <div className="flex space-x-4 items-center justify-center">
          <h2 className="text-center my-0">{question.title}</h2>
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sky-500 my-0">Crowd:</h3>
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-sky-600 my-0">
                {question.crowdForecast !== null
                  ? floatToPercent(question.crowdForecast, 0)
                  : "N/A"}
              </h1>
              <Transition
                show={isHidden !== question.id}
                leave="transition-opacity duration-300 "
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <button
                  type="button"
                  onClick={() => setIsHidden(question.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-sky-700 bg-sky-100
                hover:bg-sky-200 absolute -translate-x-12 -translate-y-10"
                >
                  <EyeOffIcon
                    className="-ml-0.5 mr-2 h-4 w-4"
                    aria-hidden="true"
                  />
                  Show
                </button>
              </Transition>
            </div>
          </div>
        </div>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {question.description || ""}
        </ReactMarkdown>
        {question.comments.length > 0 && <hr />}
      </div>
      {question.comments.length > 0 && (
        <OldComments comments={question.comments} />
      )}
    </>
  );
};
