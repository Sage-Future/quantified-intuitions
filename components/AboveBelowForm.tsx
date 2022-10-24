import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { AboveBelowQuestion } from "@prisma/client";

import { Errors } from "../components/Errors";
import { ButtonArray } from "./ButtonArray";
import { LoadingButton } from "./LoadingButton";
import { Result } from "./Result";

export const AboveBelowForm = ({
  aboveBelowQuestion,
  nextQuestion,
  addToScore,
  teamId,
  setQuestionComplete,
  showScoringHint,
}: {
  aboveBelowQuestion: AboveBelowQuestion;
  nextQuestion: () => void;
  addToScore: (score: number) => void;
  teamId: string;
  setQuestionComplete: (isComplete: boolean) => void;
  showScoringHint: boolean;
}) => {
  const [pointsEarned, setPointsEarned] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [confidenceLevel, setConfidenceLevel] = useState<string | null>(null);
  const [aboveBelow, setAboveBelow] = useState<string | null>(null);

  const onSubmit = async () => {
    setIsLoading(true);
    setErrors([]);
    if (!aboveBelow) {
      setErrors(["Please select above or below"]);
      setIsLoading(false);
      return;
    }
    if (!confidenceLevel) {
      setErrors(["Please select a confidence level"]);
      setIsLoading(false);
      return;
    }

    await fetch("/api/v0/createTeamAboveBelowAnswer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teamId,
        questionId: aboveBelowQuestion.id,
        above: aboveBelow.startsWith("Above"),
        confidenceLevel: parseFloat(confidenceLevel.replace("%", "")),
      }),
    }).then(async (res) => {
      if (res.status === 201) {
        const json = await res.json();
        setQuestionComplete(true);
        setPointsEarned(json.score);
        setCorrect(json.correct);
        addToScore(json.score);
      }
    });
    setIsLoading(false);
  };

  useEffect(() => {
    setQuestionComplete(false);
  }, [setQuestionComplete]);
  useEffect(() => {
    let links = document.links;
    for (let i = 0; i < links.length; i++) {
      if (!links[i].href.startsWith(`${window.location.origin}`)) {
        links[i].target = "_blank";
      }
    }
  }, [aboveBelowQuestion, pointsEarned]);

  return (
    <>
      <div className="prose break-words text-2xl pt-2">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {aboveBelowQuestion.content}
        </ReactMarkdown>
      </div>
      <div className="pt-10">
        <div>
          <ButtonArray
            selected={aboveBelow}
            setSelected={setAboveBelow}
            options={[`Above ${aboveBelowQuestion.quantity}`, `Below  ${aboveBelowQuestion.quantity}`]}
            label={`Is the answer...`}
            size="xl"
            key={aboveBelowQuestion.id}
          />
        </div>
        <div className="py-6">
          <ButtonArray
            selected={confidenceLevel}
            setSelected={setConfidenceLevel}
            options={["55%", "65%", "75%", "85%"]}
            label={"How confident are you?"}
            key={`${aboveBelowQuestion.id} confidence`}
          />
        </div>
        {errors.length > 0 && (
          <div className="sm:col-span-6">
            <Errors errors={errors} />
          </div>
        )}
      </div>
      <div className="pt-6">
        {pointsEarned === null || correct === null ? (
          <LoadingButton
            onClick={onSubmit}
            buttonText={"Submit"}
            loadingText={"Loading..."}
            isLoading={isLoading}
          />
        ) : (
          <div className="grid gap-y-6">
            <Result
              pointsEarned={pointsEarned}
              skipped={false}
              answer={false}
              stringAnswer={aboveBelowQuestion.preciseAnswer}
            />
            <div className="sm:col-span-6 block text-sm font-medium text-gray-500 text-center prose">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {"Source: " + aboveBelowQuestion.source}
              </ReactMarkdown>
            </div>
            <LoadingButton
              onClick={() => {
                nextQuestion();
              }}
              buttonText="Next Question"
              isLoading={isLoading}
              loadingText="Loading next question"
            />
          </div>
        )}
      </div>
    </>
  );
};
