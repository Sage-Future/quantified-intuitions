import { Comment } from "@prisma/client";

import { CommentItem } from "./CommentItem";

export const Comments = ({ comments }: { comments: Comment[] }) => {
  const topLevelComments = comments.filter(
    (comment) => comment.parentCommentId === null
  );

  return (
    <div className="flow-root my-6">
      <ul role="list" className="-mb-8">
        {topLevelComments.map((comment, commentIdx) => (
          <CommentItem
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
