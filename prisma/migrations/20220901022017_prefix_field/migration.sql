/*
  Warnings:

  - You are about to drop the column `unit` on the `CalibrationQuestion` table. All the data in the column will be lost.
  - Added the required column `postfix` to the `CalibrationQuestion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prefix` to the `CalibrationQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CalibrationQuestion" DROP COLUMN "unit",
ADD COLUMN     "postfix" TEXT NOT NULL,
ADD COLUMN     "prefix" TEXT NOT NULL,
ADD COLUMN     "useLogScoring" BOOLEAN NOT NULL DEFAULT false;
