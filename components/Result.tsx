export const Result = ({
  answer,
  pointsEarned,
}: {
  answer: string;
  pointsEarned: number;
}) => {
  return (
    <div className="col-span-6 -my-5">
      <p className="mt-2 text-sm text-gray-500">
        {`The answer is ${answer}.`}
        <br />
        {`You Earned ${pointsEarned} points!`}
      </p>
    </div>
  );
};
