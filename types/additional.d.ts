import { Pastcast, User } from "@prisma/client";

export type UserWithPastcasts = User & {
  pastcasts: Pastcast[];
};

export type CalibrationOptions = "QuestionDescription" | "VantageSearch";
