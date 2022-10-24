-- CreateTable
CREATE TABLE "AboveBelowQuestion" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "answerIsAbove" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "AboveBelowQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamAboveBelowAnswer" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "skipped" BOOLEAN NOT NULL DEFAULT false,
    "score" DOUBLE PRECISION NOT NULL,
    "timeSpent" INTEGER DEFAULT 0,
    "correct" BOOLEAN NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamAboveBelowAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_AboveBelowQuestionToChallenge" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AboveBelowQuestionToChallenge_AB_unique" ON "_AboveBelowQuestionToChallenge"("A", "B");

-- CreateIndex
CREATE INDEX "_AboveBelowQuestionToChallenge_B_index" ON "_AboveBelowQuestionToChallenge"("B");

-- AddForeignKey
ALTER TABLE "TeamAboveBelowAnswer" ADD CONSTRAINT "TeamAboveBelowAnswer_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamAboveBelowAnswer" ADD CONSTRAINT "TeamAboveBelowAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AboveBelowQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AboveBelowQuestionToChallenge" ADD CONSTRAINT "_AboveBelowQuestionToChallenge_A_fkey" FOREIGN KEY ("A") REFERENCES "AboveBelowQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AboveBelowQuestionToChallenge" ADD CONSTRAINT "_AboveBelowQuestionToChallenge_B_fkey" FOREIGN KEY ("B") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
