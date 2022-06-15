-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "voteTotal" INTEGER NOT NULL DEFAULT 0,
    "parentCommentId" TEXT,
    "questionId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "predictionValue" DOUBLE PRECISION,
    "fetched" TIMESTAMP(6) NOT NULL,
    "platform" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
