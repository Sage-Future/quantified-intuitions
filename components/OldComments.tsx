import { Comment } from "@prisma/client";

import { OldCommentItem } from "./OldCommentItem";

export const OldComments = ({ comments }: { comments: Comment[] }) => {
  const topLevelComments = comments.filter(
    (comment) => comment.parentCommentId === null
  );

  return (
    <div className="flow-root my-6">
      <ul role="list" className="-mb-8">
        {topLevelComments.map((comment, commentIdx) => (
          <OldCommentItem
            key={comment.id}
            comment={comment}
            commentIdx={commentIdx}
            possibleChildren={comments}
          />
        ))}
      </ul>
    </div>
  );
};
