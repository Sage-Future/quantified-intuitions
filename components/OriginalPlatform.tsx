import { Question } from "@prisma/client";

export const OriginalPlatform = ({ question }: { question: Question }) => {
  return (
    <div className="sm:col-span-6 block text-sm font-medium text-gray-500 text-center">
      {`See our source at `}
      <span>
        <a
          href={question.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          //underline
          className="text-blue-500 hover:text-blue-700 underline font-bold"
        >
          {question.platform}
        </a>
      </span>
    </div>
  );
};
