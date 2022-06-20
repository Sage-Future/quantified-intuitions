-- AlterTable
ALTER TABLE "Pastcast" ADD COLUMN     "roomId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "roomId" TEXT;

-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "maxSecondsPerQuestion" INTEGER NOT NULL DEFAULT 600,
    "totalQuestions" INTEGER NOT NULL DEFAULT 1,
    "currentQuestionId" TEXT,
    "currentStartTime" TIMESTAMP(3),
    "isFinshed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PastQuestion" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PastQuestion_AB_unique" ON "_PastQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_PastQuestion_B_index" ON "_PastQuestion"("B");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pastcast" ADD CONSTRAINT "Pastcast_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_currentQuestionId_fkey" FOREIGN KEY ("currentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PastQuestion" ADD CONSTRAINT "_PastQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PastQuestion" ADD CONSTRAINT "_PastQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
