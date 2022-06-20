import { getSession } from "next-auth/react";
import Chart from "react-google-charts";

import { Navbar } from "../components/Navbar";
import { Prisma } from "../lib/prisma";
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
  const axisLabels = [
    ["Confidence", "Accuracy", { type: "string", role: "tooltip" }, "Ideal"],
  ];
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
    const confidence = Math.round(buckets[idx] * 100);
    const accuracy = Math.round(
      (ps.reduce((acc, p) => acc + (p.question.binaryResolution ? 1 : 0), 0) /
        ps.length) *
        100
    );
    return [
      confidence,
      accuracy,
      `Confidence: ${confidence}%\nAccuracy: ${accuracy}%\nSample size: ${ps.length}`,
      NaN,
    ];
  });
  const bucketedPastcastsIdeal = [
    [-1, NaN, undefined, -1],
    [101, NaN, undefined, 101],
  ];
  const data = [
    ...axisLabels,
    ...bucketedPastcastsAccuracy,
    ...bucketedPastcastsIdeal,
  ];

  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-0">
        <div className="max-w-7xl mx-auto">
          <Chart
            chartType="ScatterChart"
            data={data}
            options={{
              title: "Your Calibration Curve",
              hAxis: {
                minValue: 0,
                maxValue: 100,
                title: "Confidence",
                viewWindow: { min: 0, max: 100 },
              },
              vAxis: {
                minValue: 0,
                maxValue: 100,
                title: "Accuracy",
                viewWindow: { min: 0, max: 100 },
              },
              legend: { position: "none" },
              trendlines: {
                1: {
                  type: "linear",
                  lineWidth: 10,
                  opacity: 0.2,
                  pointsVisible: false,
                  tooltip: false,
                },
              },
            }}
            width="100%"
            height="400px"
          />
        </div>
      </div>
    </div>
  );
};

export default Calibration;
