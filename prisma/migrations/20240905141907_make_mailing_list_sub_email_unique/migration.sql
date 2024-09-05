/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `MailingListSubscriber` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MailingListSubscriber_email_key" ON "MailingListSubscriber"("email");
