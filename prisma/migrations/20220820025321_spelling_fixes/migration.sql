/*
  Warnings:

  - You are about to drop the `CalibrationQuestions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CalibrationAnswer" DROP CONSTRAINT "CalibrationAnswer_questionId_fkey";

-- DropTable
DROP TABLE "CalibrationQuestions";

-- CreateTable
CREATE TABLE "CalibrationQuestion" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "answer" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "CalibrationQuestion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalibrationAnswer" ADD CONSTRAINT "CalibrationAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CalibrationQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
