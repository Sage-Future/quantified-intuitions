-- AlterForeignKey
ALTER TABLE "Team" DROP CONSTRAINT "Team_challengeId_fkey";
ALTER TABLE "Team" ADD CONSTRAINT "Team_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
