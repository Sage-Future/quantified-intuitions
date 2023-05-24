-- AlterTable
ALTER TABLE "CalibrationAnswer" ADD COLUMN     "median" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "CalibrationQuestionTag" (
    "id" TEXT NOT NULL,
    "showInDeckSwitcher" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "CalibrationQuestionTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CalibrationQuestionToCalibrationQuestionTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CalibrationQuestionToCalibrationQuestionTag_AB_unique" ON "_CalibrationQuestionToCalibrationQuestionTag"("A", "B");

-- CreateIndex
CREATE INDEX "_CalibrationQuestionToCalibrationQuestionTag_B_index" ON "_CalibrationQuestionToCalibrationQuestionTag"("B");

-- AddForeignKey
ALTER TABLE "_CalibrationQuestionToCalibrationQuestionTag" ADD CONSTRAINT "_CalibrationQuestionToCalibrationQuestionTag_A_fkey" FOREIGN KEY ("A") REFERENCES "CalibrationQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CalibrationQuestionToCalibrationQuestionTag" ADD CONSTRAINT "_CalibrationQuestionToCalibrationQuestionTag_B_fkey" FOREIGN KEY ("B") REFERENCES "CalibrationQuestionTag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
