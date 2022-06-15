import { Comment, Pastcast, Question, User } from "@prisma/client";

export type UserWithPastcasts = User & {
  pastcasts: Pastcast[];
};

export type QuestionWithComments = Question & {
  comments: Comment[];
};

export type CalibrationOptions = "QuestionDescription" | "VantageSearch";
