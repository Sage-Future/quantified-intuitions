/*
  Warnings:

  - Added the required column `preciseAnswer` to the `AboveBelowQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AboveBelowQuestion" ADD COLUMN     "preciseAnswer" DOUBLE PRECISION NOT NULL;
