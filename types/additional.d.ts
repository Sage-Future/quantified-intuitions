import { Comment, Pastcast, Question, User } from "@prisma/client";

export type PastcastWithQuestion = Pastcast & {
  question: Question;
};

export type UserWithPastcastsWithQuestion = User & {
  pastcasts: PastcastWithQuestion[];
};

export type UserWithPastcasts = User & {
  pastcasts: Pastcast[];
};

export type QuestionWithComments = Question & {
  comments: Comment[];
};

export type QuestionWithCommentsAndPastcasts = Question & {
  comments: Comment[];
  pastcasts: Pastcast[];
};

export type CalibrationOptions =
  | "QuestionDescription"
  | "VantageSearch"
  | "Scores";
