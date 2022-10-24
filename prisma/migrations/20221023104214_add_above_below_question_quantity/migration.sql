/*
  Warnings:

  - Added the required column `quantity` to the `AboveBelowQuestion` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AboveBelowQuestion" ADD COLUMN     "quantity" TEXT NOT NULL;
