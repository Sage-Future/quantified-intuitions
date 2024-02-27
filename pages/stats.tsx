import { NextSeo } from "next-seo"

import { GetStaticProps } from "next"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { NavbarGeneric } from "../components/NavbarGeneric"
import { Prisma } from "../lib/prisma"
import { getYYYYMMDD, mean, round, sum } from "../lib/utils"

export const getStaticProps: GetStaticProps = async () => {
  const calibrationAnswers = await Prisma.calibrationAnswer.findMany({
    select: {
      userId: true,
      score: true,
      createdAt: true,
    },
  })
  const pastcasts = await Prisma.pastcast.findMany({
    select: {
      userId: true,
      score: true,
      createdAt: true,
    },
  })
  const teamFermiAnswers = (
    await Prisma.teamFermiAnswer.findMany({
      select: {
        score: true,
        createdAt: true,
        team: {
          select: {
            users: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    })
  )
    .map((answer) => ({
      ...answer,
      userId: answer.team.users[0]?.id,
    }))
    .filter((answer) => answer.userId !== null)

  const answersByUser = calibrationAnswers.reduce(
    (acc: Record<string, (typeof calibrationAnswers)[number][]>, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = []
      }
      acc[curr.userId].push(curr)
      return acc
    },
    {}
  )

  const pastcastsByUser = pastcasts.reduce(
    (acc: Record<string, (typeof pastcasts)[number][]>, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = []
      }
      acc[curr.userId].push(curr)
      return acc
    },
    {}
  )

  const teamFermiAnswersByUser = teamFermiAnswers.reduce(
    (acc: Record<string, (typeof teamFermiAnswers)[number][]>, curr) => {
      if (!acc[curr.userId]) {
        acc[curr.userId] = []
      }
      acc[curr.userId].push(curr)
      return acc
    },
    {}
  )

  const answers = [answersByUser, pastcastsByUser, teamFermiAnswers]
  answers.forEach((arr: any) =>
    Object.keys(arr).forEach((userId) => {
      answersByUser[userId]?.sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      )
    })
  )

  function firstAndLastNUsers(
    theAnswersByUser: typeof pastcastsByUser,
    n: number
  ) {
    return {
      [`Average score in first ${n} answers (for users with >${
        n * 2
      } answers)`]: round(
        mean(
          Object.values(theAnswersByUser)
            .filter((answers) => answers.length > n * 2)
            .map((answers) => mean(answers.slice(0, n).map((a) => a.score)))
        ),
        1
      ),
      [`Average score in last ${n} answers (for users with >${n * 2} answers)`]:
        round(
          mean(
            Object.values(theAnswersByUser)
              .filter((answers) => answers.length > n * 2)
              .map((answers) => mean(answers.slice(-n).map((a) => a.score)))
          ),
          1
        ),
    }
  }

  const stats: StatsPageProps["stats"] = [
    {
      header: "Calibration",
      datapoints: {
        "Calibration answers": calibrationAnswers.length,
        "Unique users": calibrationAnswers.reduce((acc: string[], curr) => {
          if (!acc.includes(curr.userId)) {
            acc.push(curr.userId)
          }
          return acc
        }, []).length,
        ...firstAndLastNUsers(answersByUser, 20),
      },
      chartData: [
        {
          type: "line over time",
          title: "Calibration answers by date",
          data: calibrationAnswers.reduce(
            (acc: Record<string, number>, curr) => {
              const date = curr.createdAt.toISOString().split("T")[0]
              if (acc[date]) {
                acc[date]++
              } else {
                acc[date] = 1
              }
              return acc
            },
            {}
          ),
        },
        {
          type: "line over time",
          title: "Unique calibration users by date",
          data: getUniqueUserIdsByDate(calibrationAnswers),
        },
        {
          type: "data over index",
          title:
            "20 random users score rolling average across their first 50 calibration answers",
          lines: [
            50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
            750, 800, 850, 900, 950, 1000, 1050,
          ].map((userIndex) => ({
            label: `User ${userIndex}`,
            data:
              Object.values(answersByUser)
                [userIndex]?.sort(
                  (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
                )
                .map((answer, index, arr) => {
                  const rollingAvg =
                    arr
                      .slice(Math.max(0, index - 9), index + 1)
                      .reduce((acc, curr) => acc + curr.score, 0) /
                    Math.min(index + 1, 10)
                  return {
                    index,
                    value: answer.score,
                    rollingAvg,
                  }
                })
                .slice(0, 50) || [],
          })),
        },
        {
          type: "data over index",
          title:
            "Average score for nth question answered (for users with >20 answers)",
          lines: [
            {
              label: "Average score",
              data: Array.from({ length: 200 }, (_, index) => index).map(
                (index) => {
                  const answers = Object.values(answersByUser)
                    .filter(
                      (userAnswers) =>
                        userAnswers.length > 20 &&
                        userAnswers[index] !== undefined
                    )
                    .map((userAnswers) => userAnswers[index]?.score)
                  const avg = sum(answers) / answers.length
                  return {
                    value: avg,
                    index,
                    rollingAvg: avg,
                  }
                }
              ),
            },
          ],
        },
      ],
    },
    {
      header: "Pastcasting",
      datapoints: {
        Pastcasts: pastcasts.length,
        "Unique users": pastcasts.reduce((acc: string[], curr) => {
          if (!acc.includes(curr.userId)) {
            acc.push(curr.userId)
          }
          return acc
        }, []).length,
        ...firstAndLastNUsers(pastcastsByUser, 20),
      },
      chartData: [
        {
          type: "line over time",
          title: "Pastcasts by date",
          data: pastcasts.reduce((acc: Record<string, number>, curr) => {
            const date = curr.createdAt.toISOString().split("T")[0]
            if (acc[date]) {
              acc[date]++
            } else {
              acc[date] = 1
            }
            return acc
          }, {}),
        },
        {
          type: "line over time",
          title: "Unique pastcasting users by date",
          data: getUniqueUserIdsByDate(pastcasts),
        },
        {
          type: "data over index",
          title:
            "20 random users score rolling average across their first 50 pastcasts",
          lines: [
            50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
            750, 800, 850, 900, 950, 1000, 1050,
          ].map((userIndex) => ({
            label: `User ${userIndex}`,
            data:
              Object.values(pastcastsByUser)
                [userIndex]?.sort(
                  (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
                )
                .map((answer, index, arr) => {
                  const rollingAvg =
                    arr
                      .slice(Math.max(0, index - 9), index + 1)
                      .reduce((acc, curr) => acc + curr.score, 0) /
                    Math.min(index + 1, 10)
                  return {
                    index,
                    value: answer.score,
                    rollingAvg,
                  }
                })
                .slice(0, 50) || [],
          })),
        },
        {
          type: "data over index",
          title:
            "Average score for nth pastcasts (for users with >20 pastcasts)",
          lines: [
            {
              label: "Average score",
              data: Array.from({ length: 200 }, (_, index) => index).map(
                (index) => {
                  const answers = Object.values(pastcastsByUser)
                    .filter(
                      (userAnswers) =>
                        userAnswers.length > 20 &&
                        userAnswers[index] !== undefined
                    )
                    .map((userAnswers) => userAnswers[index]?.score)
                  const avg = sum(answers) / answers.length
                  return {
                    value: avg,
                    index,
                    rollingAvg: avg,
                  }
                }
              ),
            },
          ],
        },
      ],
    },
    {
      header: "Estimation Game",
      datapoints: {
        "Estimation Game answers": teamFermiAnswers.length,
        "Unique users": teamFermiAnswers.reduce((acc: string[], curr) => {
          if (!acc.includes(curr.userId)) {
            acc.push(curr.userId)
          }
          return acc
        }, []).length,
        ...firstAndLastNUsers(teamFermiAnswersByUser, 20),
      },
      chartData: [
        {
          type: "line over time",
          title: "Estimation Game answers by date",
          data: teamFermiAnswers.reduce((acc: Record<string, number>, curr) => {
            const date = curr.createdAt.toISOString().split("T")[0]
            if (acc[date]) {
              acc[date]++
            } else {
              acc[date] = 1
            }
            return acc
          }, {}),
        },
        {
          type: "line over time",
          title: "Unique Estimation Game players by date",
          data: getUniqueUserIdsByDate(teamFermiAnswers),
        },
        {
          type: "data over index",
          title:
            "20 random users score rolling average across their first 20 Estimation Game answers",
          lines: [
            50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700,
            750, 800, 850, 900, 950, 1000, 1050,
          ].map((userIndex) => ({
            label: `User ${userIndex}`,
            data:
              Object.values(teamFermiAnswersByUser)
                [userIndex]?.sort(
                  (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
                )
                .map((answer, index, arr) => {
                  const rollingAvg =
                    arr
                      .slice(Math.max(0, index - 4), index + 1)
                      .reduce((acc, curr) => acc + curr.score, 0) /
                    Math.min(index + 1, 5)
                  return {
                    index,
                    value: answer.score,
                    rollingAvg,
                  }
                })
                .slice(0, 20) || [],
          })),
        },
        {
          type: "data over index",
          title:
            "Average score for nth Estimation Game question answered (for users with >20 answers)",
          lines: [
            {
              label: "Average score",
              data: Array.from({ length: 100 }, (_, index) => index).map(
                (index) => {
                  const answers = Object.values(teamFermiAnswersByUser)
                    .filter(
                      (userAnswers) =>
                        userAnswers.length > 20 &&
                        userAnswers[index] !== undefined
                    )
                    .map((userAnswers) => userAnswers[index]?.score)
                  const avg = sum(answers) / answers.length
                  return {
                    value: avg,
                    index,
                    rollingAvg: avg,
                  }
                }
              ),
            },
          ],
        },
      ],
    },
  ]

  return {
    props: {
      stats,
    },
    revalidate: 86400, // 24 hours
  }
}

interface StatsPageProps {
  stats: {
    header: string
    datapoints: Record<string, number>
    chartData: (
      | {
          type: "line over time"
          title: string
          data: Record<string, number>
        }
      | {
          type: "data over index"
          title: string
          lines: {
            label: string
            data: { index: number; value: number; rollingAvg: number }[]
          }[]
        }
    )[]
  }[]
}

const StatsPage: React.FC<StatsPageProps> = ({ stats }) => {
  return (
    <div className="flex flex-col min-h-screen ">
      <NavbarGeneric />
      <div className="px-4 pt-12 lg:pt-16 mx-auto max-w-6xl">
        <NextSeo title="Stats" />
        <div className="mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{stat.header}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(stat.datapoints).map(([key, value]) => {
                  return (
                    <div
                      key={key}
                      className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
                    >
                      <span className="text-gray-600">{key}</span>
                      <span className="font-semibold">{value}</span>
                    </div>
                  )
                })}
                {stat.chartData &&
                  stat.chartData.map((chart) => {
                    if (chart.type === "line over time") {
                      return (
                        <div
                          key={chart.title}
                          className="flex flex-col bg-gray-100 p-4 rounded-lg"
                        >
                          <h3 className="text-lg font-medium mb-4">
                            {chart.title}
                          </h3>
                          {chart.data && Object.keys(chart.data).length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart data={getDateData(chart.data)}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  interval={150}
                                />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#8884d8"
                                  dot={false}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="Rolling average"
                                  stroke="#006400" // Dark green
                                  strokeWidth={1.5}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          ) : (
                            <div className="text-center p-4">
                              No data available
                            </div>
                          )}
                        </div>
                      )
                    } else if (chart.type === "data over index") {
                      return (
                        <div
                          key={chart.title}
                          className="flex flex-col bg-gray-100 p-4 rounded-lg"
                        >
                          <h3 className="text-lg font-medium mb-4">
                            {chart.title}
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <LineChart
                              data={chart.lines.reduce((acc, line) => {
                                line.data.forEach((point) => {
                                  if (!acc[point.index]) {
                                    acc[point.index] = {
                                      index: point.index,
                                    }
                                  }
                                  acc[point.index][line.label] = point.value
                                  acc[point.index][
                                    `${line.label} Rolling Avg`
                                  ] = point.rollingAvg
                                })
                                return acc
                              }, [] as { index: number; [key: string]: number }[])}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="index" tick={{ fontSize: 12 }} />
                              <YAxis />
                              <Tooltip />
                              {/* <Legend /> */}
                              {chart.lines.flatMap((line, index) => [
                                // <Line
                                //   key={line.label}
                                //   type="linear"
                                //   dataKey={line.label}
                                //   stroke={`hsl(${(index * 36) % 360}, 90%, 60%)`}
                                //   dot={false}
                                // />,
                                <Line
                                  key={`${line.label} Rolling Avg`}
                                  type="linear"
                                  dataKey={`${line.label} Rolling Avg`}
                                  stroke={`hsl(${
                                    (index * 36 + 180) % 360
                                  }, 90%, 40%)`}
                                  dot={false}
                                />,
                              ])}
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      )
                    } else {
                      return <>Unknown chart type</>
                    }
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function getUniqueUserIdsByDate(
  calibrationAnswers: { userId: string; score: number; createdAt: Date }[]
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(
      calibrationAnswers.reduce((acc: Record<string, Set<string>>, curr) => {
        const date = curr.createdAt.toISOString().split("T")[0]
        if (!acc[date]) {
          acc[date] = new Set()
        }
        acc[date].add(curr.userId)
        return acc
      }, {})
    ).map((v) => [v[0], v[1].size])
  )
}

// adds zeroes for dates with no data and calculates 7 day rolling average
function getDateData(data: Record<string, number>) {
  const dates = Object.keys(data)
    .map((date) => new Date(date))
    .sort((a, b) => a.getTime() - b.getTime())
  const startDate = dates[0]
  const endDate = dates[dates.length - 1]

  const dateArray: {
    date: string
    value: number
    "Rolling average": number
  }[] = []

  let rolling = []

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    const formattedDate = dt.toISOString().split("T")[0]
    const value = data[formattedDate] ?? 0

    rolling.unshift(value) // add to start
    if (rolling.length > 7) rolling.pop()
    const rollingAverage =
      rolling.length == 7
        ? rolling.reduce((a, b) => a + b, 0) / rolling.length
        : null

    dateArray.push({
      date: getYYYYMMDD(new Date(dt)),
      value,
      "Rolling average": round(rollingAverage ?? 0, 1),
    })
  }

  return dateArray
}

export default StatsPage
