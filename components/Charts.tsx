import {
    CartesianGrid, ErrorBar, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip,
    XAxis, YAxis
} from "recharts";

import { truncateError } from "../lib/services/format";
import { UserWithPastcastsWithQuestionWithCalibrationAnswers } from "../types/additional";

export const Charts = ({
  user,
}: {
  user: UserWithPastcastsWithQuestionWithCalibrationAnswers;
}) => {
  //bucket pastcasts into percentile groups
  const { pastcasts } = user;
  const filteredPastcasts = pastcasts.filter(
    (pastcast) => pastcast.skipped === false
  );
  const buckets = Array.from({ length: 10 }, (_, i) => i / 10 + 0.05);
  const bucketedPastcasts = buckets.map((bucket) => {
    return filteredPastcasts.filter(
      (pastcast) =>
        pastcast.binaryProbability &&
        pastcast.binaryProbability >= bucket - 0.05 &&
        pastcast.binaryProbability < bucket + 0.05
    );
  });
  const bucketedPastcastsAccuracy = bucketedPastcasts.map((ps, idx) => {
    if (ps.length === 0) {
      return {};
    }
    // mean of binaryProbability
    const confidence = Math.round(
      (ps.reduce(
        (acc, pastcast) => acc + (pastcast.binaryProbability ?? 0.5),
        0
      ) /
        ps.length) *
        100
    );
    const successes = ps.reduce(
      (acc, p) => acc + (p.question.binaryResolution ? 1 : 0),
      0
    );
    const total = ps.length;
    const accuracy = Math.round((successes / total) * 100);
    const accuracyWithPrior = Math.round(
      ((successes + 0.5) / (total + 1)) * 100
    );
    const rawErrorY =
      ps.length > 0
        ? Math.round(
            1.96 *
              Math.sqrt(
                (accuracyWithPrior * (100 - accuracyWithPrior)) / ps.length
              )
          )
        : 100;
    return {
      Confidence: confidence,
      Accuracy: isNaN(accuracy) ? confidence : accuracy,
      "Sample Size": ps.length,
      ErrorY: truncateError(rawErrorY, isNaN(accuracy) ? confidence : accuracy),
    };
  });
  const bucketedCalibrations = Array.from({ length: 5 }, (_, i) => i / 10 + 0.5)
    .map((bucket) => {
      return user.CalibrationAnswer !== undefined
        ? user.CalibrationAnswer.filter(
            (answer) =>
              answer.confidence >= bucket - 0.05 &&
              answer.confidence < bucket + 0.05
          )
        : [];
    })
    .map((answers) => {
      if (answers.length === 0) {
        return {};
      }
      const successes = answers.reduce(
        (acc, answer) => acc + (answer.correct ? 1 : 0),
        0
      );
      const total = answers.length;
      const accuracy = Math.round((successes / total) * 100);
      const accuracyWithPrior = Math.round(
        ((successes + 0.5) / (total + 1)) * 100
      );
      const rawErrorY =
        answers.length > 0
          ? Math.round(
              1.96 *
                Math.sqrt(
                  (accuracyWithPrior * (100 - accuracyWithPrior)) /
                    answers.length
                )
            )
          : 100;
      return {
        Confidence: Math.round(answers[0].confidence * 100),
        Accuracy: accuracy,
        "Sample Size": answers.length,
        ErrorY: truncateError(rawErrorY, isNaN(accuracy) ? 0 : accuracy),
      };
    })
    .filter((bucket) => Object.keys(bucket).length > 0);

  const data = bucketedPastcastsAccuracy;
  const data2 = bucketedCalibrations;

  const xs = filteredPastcasts.map((pastcast) =>
    pastcast.binaryProbability
      ? pastcast.question.binaryResolution
        ? pastcast.binaryProbability
        : 1 - pastcast.binaryProbability
      : 0
  );
  const overConfidence =
    xs.map((x) => (x - 1) * (x - 0.5)).reduce((acc, x) => acc + x, 0) /
    xs.length /
    (xs.map((x) => (x - 0.5) * (x - 0.5)).reduce((acc, x) => acc + x, 0) /
      xs.length);

  const xs2 =
    user.CalibrationAnswer !== undefined
      ? user.CalibrationAnswer.map((answer) =>
          answer.correct ? answer.confidence : 1 - answer.confidence
        )
      : [];
  const overConfidence2 =
    xs2.map((x) => (x - 1) * (x - 0.5)).reduce((acc, x) => acc + x, 0) /
    xs2.length /
    (xs2.map((x) => (x - 0.5) * (x - 0.5)).reduce((acc, x) => acc + x, 0) /
      xs2.length);
  const cumulativeScore = user.CalibrationAnswer?.reduce(
    (acc, answer) => acc + (answer.score ?? 0),
    0
  );

  return (
    <div className="py-10 grow bg-gray-100">
      <div className="max-w-7xl mx-auto bg-white md:rounded-lg shadow p-4">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          <div className="flex flex-row justify-between">
            <div>Your Pastcasting Calibration Curve</div>
            <div>
              {overConfidence >= 0
                ? "Overconfidence: " + overConfidence.toFixed(3)
                : "Underconfidence: " + (-overConfidence).toFixed(3)}
            </div>
          </div>
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            width={600}
            height={400}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="Confidence"
              name="Confidence"
              unit="%"
              domain={[0, 100]}
              allowDuplicatedCategory={false}
            />
            <YAxis
              type="number"
              dataKey="Accuracy"
              name="Accuracy"
              unit="%"
              domain={[0, 100]}
              allowDuplicatedCategory={false}
            />
            <Tooltip
              cursor={{
                stroke: "black",
                strokeWidth: 2,
                strokeDasharray: "3 3",
                opacity: 0.5,
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  return (
                    // tooltip div with outline
                    <div className="bg-white border border-gray-600 rounded-lg shadow-lg p-2">
                      <div className="text-sm">
                        <p className="text-gray-900 leading-tight">
                          Confidence: {payload[0].payload.Confidence}%
                        </p>
                        <p className="text-gray-900 leading-tight">
                          Accuracy: {payload[0].payload.Accuracy}%
                        </p>
                        <p className="text-gray-900 leading-tight">
                          Sample Size: {payload[0].payload["Sample Size"]}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              segment={[
                {
                  x: 0,
                  y: 0,
                },
                {
                  x: 100,
                  y: 100,
                },
              ]}
              stroke="red"
            />
            <Scatter data={data} fill="#4f46e5">
              <ErrorBar dataKey="ErrorY" direction="y" />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="max-w-7xl mx-auto bg-white md:rounded-lg shadow p-4 mt-10">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          <div className="flex flex-row justify-between">
            <div>Your EA-themed Calibration Curve</div>
            <span>
              {(overConfidence2 >= 0
                ? "Overconfidence: " + overConfidence2.toFixed(3)
                : "Underconfidence: " + (-overConfidence2).toFixed(3)) +
                (cumulativeScore !== undefined
                  ? ", Cumulative Score: " + cumulativeScore.toFixed(2)
                  : "")}
            </span>
          </div>
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <ScatterChart
            width={600}
            height={400}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid />
            <XAxis
              type="number"
              dataKey="Confidence"
              name="Confidence"
              unit="%"
              domain={[50, 90]}
              allowDuplicatedCategory={false}
            />
            <YAxis
              type="number"
              dataKey="Accuracy"
              name="Accuracy"
              unit="%"
              domain={[0, 100]}
              allowDuplicatedCategory={false}
            />
            <Tooltip
              cursor={{
                stroke: "black",
                strokeWidth: 2,
                strokeDasharray: "3 3",
                opacity: 0.5,
              }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length > 0) {
                  return (
                    // tooltip div with outline
                    <div className="bg-white border border-gray-600 rounded-lg shadow-lg p-2">
                      <div className="text-sm">
                        <p className="text-gray-900 leading-tight">
                          Confidence: {payload[0].payload.Confidence}%
                        </p>
                        <p className="text-gray-900 leading-tight">
                          Accuracy: {payload[0].payload.Accuracy}%
                        </p>
                        <p className="text-gray-900 leading-tight">
                          Sample Size: {payload[0].payload["Sample Size"]}
                        </p>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine
              segment={[
                {
                  x: 50,
                  y: 50,
                },
                {
                  x: 90,
                  y: 90,
                },
              ]}
              stroke="red"
            />
            <Scatter data={data2} fill="#4f46e5">
              <ErrorBar dataKey="ErrorY" direction="y" />
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
