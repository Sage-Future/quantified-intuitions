-- CreateTable
CREATE TABLE "CalibrationQuestions" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "content" TEXT NOT NULL,
    "answer" DOUBLE PRECISION NOT NULL,
    "unit" TEXT NOT NULL,
    "source" TEXT NOT NULL,

    CONSTRAINT "CalibrationQuestions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CalibrationAnswer" (
    "id" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "lowerBound" DOUBLE PRECISION NOT NULL,
    "upperBound" DOUBLE PRECISION NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "timeSpent" INTEGER DEFAULT 0,
    "correct" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CalibrationAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CalibrationAnswer" ADD CONSTRAINT "CalibrationAnswer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CalibrationAnswer" ADD CONSTRAINT "CalibrationAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "CalibrationQuestions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
