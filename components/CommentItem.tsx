import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Comment } from "@prisma/client";

import { dateMed, floatToPercent } from "../lib/services/format";
import { STOCK_PHOTO } from "../lib/services/magicNumbers";

export const CommentItem = ({
  comment,
  commentIdx,
  possibleChildren,
}: {
  comment: Comment;
  commentIdx: number;
  possibleChildren: Comment[];
}) => {
  const children = possibleChildren.filter(
    (child) => child.parentCommentId === comment.id
  );
  return (
    <li>
      <div className="relative pb-8">
        {commentIdx !== possibleChildren.length - 1 ? (
          <span
            className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
            aria-hidden="true"
          />
        ) : null}
        <div className="relative flex items-start space-x-3">
          <>
            <div className="relative">
              <img
                className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center ring-8 ring-white"
                src={STOCK_PHOTO}
                alt=""
              />
            </div>
            <div className="min-w-0 flex-1">
              <div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    {comment.authorName}
                    {comment.predictionValue !== null && (
                      <>
                        <span className="text-gray-500 font-normal">{` predicted `}</span>
                        <span className="font-semi-bold">
                          {floatToPercent(comment.predictionValue)}
                        </span>
                      </>
                    )}
                  </p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  Commented on{" "}
                  <span className="text-gray-600">
                    {dateMed(comment.createdAt)}
                  </span>{" "}
                  with{" "}
                  <span className="text-gray-600">{comment.voteTotal}</span>{" "}
                  upvotes
                </p>
                <p className="mt-0.5 text-sm text-gray-500"></p>
              </div>
              <div className="prose mt-2 text-sm text-gray-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {comment.content}
                </ReactMarkdown>
              </div>
              {children.length > 0 && (
                <div className="flow-root my-6">
                  <ul role="list" className="-mb-8">
                    {children.map((child, childIdx) => (
                      <CommentItem
                        key={child.id}
                        comment={child}
                        commentIdx={childIdx}
                        possibleChildren={possibleChildren}
                      />
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        </div>
      </div>
    </li>
  );
};
