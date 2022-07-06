/*
  Warnings:

  - You are about to drop the column `displayedLink` on the `SearchResult` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `SearchResult` table. All the data in the column will be lost.
  - You are about to drop the column `snippet` on the `SearchResult` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `SearchResult` table. All the data in the column will be lost.
  - Added the required column `waybackUrl` to the `SearchResult` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SearchResult" DROP COLUMN "displayedLink",
DROP COLUMN "link",
DROP COLUMN "snippet",
DROP COLUMN "title",
ADD COLUMN     "waybackUrl" TEXT NOT NULL;
