import { getSession } from "next-auth/react";
import {
    CartesianGrid, ErrorBar, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip,
    XAxis, YAxis
} from "recharts";

import { Navbar } from "../components/Navbar";
import { Prisma } from "../lib/prisma";
import { truncateError } from "../lib/services/format";
import { UserWithPastcastsWithQuestion } from "../types/additional";

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const user = await Prisma.user.findUnique({
    where: {
      id: session?.user?.id || "",
    },
    include: {
      pastcasts: {
        include: {
          question: true,
        },
      },
    },
  });
  return {
    props: {
      session,
      user,
    },
  };
};

const Calibration = ({ user }: { user: UserWithPastcastsWithQuestion }) => {
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
  const data = bucketedPastcastsAccuracy;

  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-10 h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto bg-white md:rounded-lg shadow p-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Your Calibration Curve
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
      </div>
    </div>
  );
};

export default Calibration;
