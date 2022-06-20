-- CreateTable
CREATE TABLE "NewComment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "parentCommentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "binaryProbability" DOUBLE PRECISION,

    CONSTRAINT "NewComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCommentInteraction" (
    "userId" TEXT NOT NULL,
    "newCommentId" TEXT NOT NULL,
    "upvotes" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserCommentInteraction_pkey" PRIMARY KEY ("userId","newCommentId")
);

-- AddForeignKey
ALTER TABLE "UserCommentInteraction" ADD CONSTRAINT "UserCommentInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCommentInteraction" ADD CONSTRAINT "UserCommentInteraction_newCommentId_fkey" FOREIGN KEY ("newCommentId") REFERENCES "NewComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
