/*
  Warnings:

  - You are about to drop the `_PastQuestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_currentQuestionId_fkey";

-- DropForeignKey
ALTER TABLE "_PastQuestion" DROP CONSTRAINT "_PastQuestion_A_fkey";

-- DropForeignKey
ALTER TABLE "_PastQuestion" DROP CONSTRAINT "_PastQuestion_B_fkey";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "hostId" TEXT;

-- DropTable
DROP TABLE "_PastQuestion";

-- CreateTable
CREATE TABLE "_QuestionToRoom" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_QuestionToRoom_AB_unique" ON "_QuestionToRoom"("A", "B");

-- CreateIndex
CREATE INDEX "_QuestionToRoom_B_index" ON "_QuestionToRoom"("B");

-- AddForeignKey
ALTER TABLE "_QuestionToRoom" ADD CONSTRAINT "_QuestionToRoom_A_fkey" FOREIGN KEY ("A") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_QuestionToRoom" ADD CONSTRAINT "_QuestionToRoom_B_fkey" FOREIGN KEY ("B") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
