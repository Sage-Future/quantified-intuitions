-- CreateTable
CREATE TABLE "MailingListSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" TEXT[],

    CONSTRAINT "MailingListSubscriber_pkey" PRIMARY KEY ("id")
);
