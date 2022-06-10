import { FormProvider, useForm } from "react-hook-form";

import { BinaryForecast } from "./BinaryForecast";
import { CommentForm } from "./CommentForm";
import { SubmitForm } from "./SubmitForm";

export const ForecastForm = ({
  questionId,
  setPointsEarned,
}: {
  questionId: string;
  setPointsEarned: (pointsEarned: number | undefined) => void;
}) => {
  const methods = useForm();
  const onSubmit = async (data: any) => {
    data.questionId = questionId;
    data.binaryProbability = Number(data.binaryProbability) / 100.0;
    await fetch("/api/v0/createBinaryPastcast", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      const json = await res.json();
      if (res.status === 201) {
        setPointsEarned(json.pastcast.score);
        console.log(json);
      }
    });
  };
  // TODO: validate binary forecast is valid
  // TODO: change button to async button
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="space-y-8 divide-y divide-gray-200"
      >
        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <BinaryForecast />
          <CommentForm />
          <SubmitForm />
        </div>
      </form>
    </FormProvider>
  );
};
