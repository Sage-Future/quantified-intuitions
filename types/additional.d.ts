import { CalibrationAnswer, Comment, Pastcast, Question, User } from "@prisma/client";

export type PastcastWithQuestion = Pastcast & {
  question: Question;
};

export type UserWithPastcastsWithQuestionWithCalibrationAnswers = User & {
  pastcasts: PastcastWithQuestion[];
  CalibrationAnswer: CalibrationAnswer[];
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
  | "Scores"
  | "Leaderboard";
