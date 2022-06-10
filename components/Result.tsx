export const Result = ({
  answer,
  pointsEarned,
}: {
  answer: string;
  pointsEarned: number;
}) => {
  return (
    <div className="text-lg max-w-prose mx-auto">
      <h1 className="text-3xl font-bold text-center">
        The answer is {answer}! You earned {pointsEarned} points!
      </h1>
    </div>
  );
};
