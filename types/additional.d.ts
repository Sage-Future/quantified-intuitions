import { AboveBelowQuestion, CalibrationAnswer, CalibrationQuestion, Challenge, Comment, Pastcast, Question, Team, TeamAboveBelowAnswer, User } from "@prisma/client";

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

export type ChallengeWithTeamsWithUsersAndQuestions = Challenge & {
  teams: TeamWithUsers[];
  fermiQuestions: (CalibrationQuestion & {
    teamAnswers: TeamFermiAnswer[];
  })[];
  aboveBelowQuestions: (AboveBelowQuestion & {
    teamAnswers: TeamAboveBelowAnswer[];
  })[];
};

export type ChallengeWithTeamsWithUsers = Challenge & {
  teams: TeamWithUsers[];
};

export type TeamWithUsers = Team & {
  users: User[];
};

export type CalibrationOptions =
  | "QuestionDescription"
  | "VantageSearch"
  | "Scores"
  | "Leaderboard"
  | "WikiSearch";
