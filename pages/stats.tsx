import { NextSeo } from "next-seo"

import { GetStaticProps } from "next"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
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

interface TimelineEvent {
  date: string // YYYY-MM-DD
  label: string
}

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
  const fetchTeamFermiAnswers = async (skip: number, take: number) => {
    return await Prisma.teamFermiAnswer.findMany({
      select: {
        score: true,
        createdAt: true,
        team: {
          select: {
            numPlayers: true,
            users: {
              select: {
                id: true,
              },
            },
          },
        },
      },
      skip,
      take,
    })
  }

  // Fetch team fermi answers in batches to avoid Prisma error `too many bind variables in prepared statement, expected maximum of 32767, received N`
  const batchSize = 32000
  let unprocessedTeamFermiAnswers: Awaited<
    ReturnType<typeof fetchTeamFermiAnswers>
  > = []
  let offset = 0
  let batch

  do {
    batch = await fetchTeamFermiAnswers(offset, batchSize)
    unprocessedTeamFermiAnswers.push(...batch)
    offset += batchSize
  } while (batch.length === batchSize)

  const teamFermiAnswers = unprocessedTeamFermiAnswers
    .map((answer) => ({
      ...answer,
      userId: answer.team.users[0]?.id,
    }))
    .filter((answer) => answer.userId !== undefined)

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

  const teamFermiAnswersByNumPlayers = teamFermiAnswers.reduce(
    (acc: Record<number, (typeof teamFermiAnswers)[number][]>, curr) => {
      if (!acc[curr.team.numPlayers]) {
        acc[curr.team.numPlayers] = []
      }
      acc[curr.team.numPlayers].push(curr)
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

  const estimationGames = await Prisma.challenge.findMany({
    include: {
      teams: {
        select: {
          numPlayers: true,
          users: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    where: {
      unlisted: false,
    },
    orderBy: {
      startDate: "asc",
    },
  })

  const mailingListSubscribers = await Prisma.mailingListSubscriber.findMany({
    select: {
      email: true,
      products: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  })

  const stats: StatsPageProps["stats"] = [
    {
      header: "Mailing List",
      datapoints: {
        "Total subscribers": mailingListSubscribers.length,
        "Subscribers by first product": Object.entries(
          mailingListSubscribers.reduce((acc, curr) => {
            const firstProduct = curr.products[0] || "none"
            acc[firstProduct] = (acc[firstProduct] || 0) + 1
            return acc
          }, {} as Record<string, number>)
        )
          .map(([product, count]) => `${product}: ${count}`)
          .join(", "),
      },
      chartData: [
        {
          type: "line over time",
          title: "Cumulative AI Digest subscribers",
          data: getAIDigestCumulativeData(mailingListSubscribers),
          events: [
            {
              date: "2023-10-26",
              label: "How Fast is AI Improving?",
            },
            {
              date: "2023-12-14",
              label: "Compare Claude 3, GPT-4, and Gemini Ultra",
            },
            {
              date: "2024-03-18",
              label: "How Can AI Disrupt Elections?",
            },
            {
              date: "2024-04-05",
              label: "Timeline of AI Forecasts",
            },
            {
              date: "2024-08-27",
              label: "AI Can or Can't",
            },
            {
              date: "2024-10-24",
              label: "Beyond Chat: AI Agent Demo",
            },
          ],
        },
        {
          type: "stacked area",
          title: "Cumulative subscribers by first product",
          data: getCumulativeProductData(mailingListSubscribers),
        },
        {
          type: "bar",
          title: "Product signup overlap (%)",
          data: getProductOverlapData(mailingListSubscribers),
        },
        ...Array.from(
          new Set(mailingListSubscribers.flatMap((s) => s.products))
        )
          .filter(Boolean) // Remove empty product names
          .map((product) => ({
            type: "line over time" as const,
            title: `Cumulative ${product} subscribers`,
            data: getProductCumulativeData(mailingListSubscribers, product),
          })),
      ],
    },
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
        "Total number of teams": estimationGames.reduce(
          (acc, curr) => acc + curr.teams.length,
          0
        ),
        "Average self-reported num of players per team (defaults to 1)": round(
          mean(
            estimationGames.flatMap((game) =>
              game.teams.flatMap((team) => team.numPlayers)
            )
          ),
          2
        ),
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
          type: "bar",
          title: "Estimation Game number of teams",
          data: estimationGames.map((game) => ({
            label: game.id,
            value: game.teams.length,
          })),
        },
        {
          type: "bar",
          title: "Estimation Game self-reported number of players",
          data: estimationGames.map((game) => ({
            label: game.id,
            value: game.teams.reduce((acc, team) => acc + team.numPlayers, 0),
          })),
        },
        {
          type: "bar",
          title: "Estimation Game new team leaders",
          data: estimationGames.map((game) => ({
            label: game.id,
            value: game.teams.filter(
              (team) =>
                !estimationGames.some(
                  (otherGame) =>
                    otherGame.startDate < game.startDate &&
                    otherGame.teams.some((otherTeam) =>
                      otherTeam.users.some((user) =>
                        team.users.some((teamUser) => teamUser.id === user.id)
                      )
                    )
                )
            ).length,
          })),
        },
        {
          type: "bar",
          title: "Estimation Game average score by team size",
          data: Object.entries(teamFermiAnswersByNumPlayers).map(
            ([numPlayers, answers]) => ({
              label: `${numPlayers} players`,
              value: round(mean(answers.map((answer) => answer.score)), 2),
            })
          ),
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
    datapoints: Record<string, number | string>
    chartData: (
      | {
          type: "line over time"
          title: string
          data: Record<string, number>
          events?: TimelineEvent[]
        }
      | {
          type: "data over index"
          title: string
          lines: {
            label: string
            data: { index: number; value: number; rollingAvg: number }[]
          }[]
        }
      | {
          type: "bar"
          title: string
          data: { label: string; value: number }[]
        }
      | {
          type: "stacked area"
          title: string
          data: Array<Record<string, number | string>>
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
                      const chartData = getDateData(chart.data)

                      if (chart.events) {
                        chart.events.forEach((event) => {
                          const dataPoint = chartData.find(
                            (d) => d.date === event.date
                          )
                          if (dataPoint) {
                            dataPoint.event = event.label
                          }
                        })
                      }

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
                              <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis
                                  dataKey="date"
                                  tick={{ fontSize: 12 }}
                                  interval={150}
                                />
                                <YAxis />
                                <Tooltip
                                  content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                      return (
                                        <div className="bg-white p-2 border border-gray-200 rounded shadow">
                                          <p className="text-sm">{label}</p>
                                          {payload.map((p: any) => (
                                            <p key={p.name} className="text-sm">
                                              {p.name}: {p.value}
                                            </p>
                                          ))}
                                          {chartData.find(
                                            (d) => d.date === label
                                          )?.event && (
                                            <p className="text-sm font-medium mt-1 text-blue-600">
                                              {
                                                chartData.find(
                                                  (d) => d.date === label
                                                )?.event
                                              }
                                            </p>
                                          )}
                                        </div>
                                      )
                                    }
                                    return null
                                  }}
                                />
                                <Legend />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  stroke="#8884d8"
                                  // @ts-ignore
                                  dot={(props: any) => {
                                    const hasEvent =
                                      chartData[props.index]?.event
                                    if (!hasEvent) return null
                                    return (
                                      <svg>
                                        <circle
                                          cx={props.cx}
                                          cy={props.cy}
                                          r={4}
                                          fill="#8884d8"
                                          stroke="none"
                                        />
                                      </svg>
                                    )
                                  }}
                                  label={false}
                                >
                                  <LabelList
                                    dataKey="event"
                                    position="insideLeft"
                                    offset={-15}
                                    content={(props: any) => {
                                      const { x, y, value } = props
                                      if (!value) return null
                                      return (
                                        <text
                                          x={x - 10}
                                          y={y}
                                          fill="#666"
                                          fontSize={10}
                                          textAnchor="end"
                                          dominantBaseline="middle"
                                        >
                                          {value}
                                        </text>
                                      )
                                    }}
                                  />
                                </Line>
                                {!chart.title.startsWith("Cumulative") && (
                                  <Line
                                    type="monotone"
                                    dataKey="Rolling average"
                                    stroke="#006400"
                                    strokeWidth={1.5}
                                    dot={false}
                                  />
                                )}
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
                    } else if (chart.type === "bar") {
                      return (
                        <div
                          key={chart.title}
                          className="flex flex-col bg-gray-100 p-4 rounded-lg"
                        >
                          <h3 className="text-lg font-medium mb-4">
                            {chart.title}
                          </h3>
                          <ResponsiveContainer
                            width="100%"
                            height={300}
                            key={chart.title}
                          >
                            <BarChart
                              data={chart.data}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 70, // Increased bottom margin for labels
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="label"
                                angle={-45} // Increased angle for better readability
                                textAnchor="end"
                                tick={{
                                  fontSize: 10,
                                }}
                                interval={0}
                                height={60} // Increased height for labels
                              />
                              <YAxis
                                tickFormatter={(value) => `${value}%`} // Add % to y-axis labels
                              />
                              <Tooltip
                                formatter={(value: number) => [
                                  `${value}%`,
                                  "Overlap",
                                ]} // Add % to tooltip
                              />
                              <Bar
                                dataKey="value"
                                fill="#6366F1"
                                label={{
                                  position: "insideTop",
                                  fontSize: 8,
                                  fill: "white",
                                  formatter: (value: number) => `${value}%`, // Add % to bar labels
                                }}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      )
                    } else if (chart.type === "stacked area") {
                      return (
                        <div
                          key={chart.title}
                          className="flex flex-col bg-gray-100 p-4 rounded-lg"
                        >
                          <h3 className="text-lg font-medium mb-4">
                            {chart.title}
                          </h3>
                          <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chart.data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="date"
                                tick={{ fontSize: 12 }}
                                interval={150}
                                tickFormatter={(date) =>
                                  getYYYYMMDD(new Date(date))
                                }
                              />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              {Object.keys(chart.data[0] || {})
                                .filter((key) => key !== "date")
                                .map((key, index) => (
                                  <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stackId="1"
                                    stroke={`hsl(${index * 137.5}, 70%, 50%)`}
                                    fill={`hsl(${index * 137.5}, 70%, 50%)`}
                                  />
                                ))}
                            </AreaChart>
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
    event?: string
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

function getCumulativeProductData(
  subscribers: {
    products: string[]
    createdAt: Date
  }[]
) {
  const productCounts: Record<string, number> = {}
  const dateData: Record<string, Record<string, number>> = {}

  subscribers.forEach((sub) => {
    const firstProduct = sub.products[0] || "none"
    const date = sub.createdAt.toISOString().split("T")[0]

    productCounts[firstProduct] = (productCounts[firstProduct] || 0) + 1

    if (!dateData[date]) {
      dateData[date] = { ...productCounts }
    } else {
      dateData[date][firstProduct] = productCounts[firstProduct]
    }
  })

  // Fill in missing dates and maintain running totals
  const dates = Object.keys(dateData).sort()
  const allProducts = Object.keys(productCounts)

  return dates.map((date) => {
    const entry: Record<string, string | number> = { date }
    let prevDate = dates[dates.indexOf(date) - 1]

    allProducts.forEach((product) => {
      entry[product] =
        dateData[date][product] || (prevDate ? dateData[prevDate][product] : 0)
    })

    return entry
  })
}

function getProductOverlapData(subscribers: { products: string[] }[]) {
  const allProducts = new Set(subscribers.flatMap((s) => s.products))
  const data: { label: string; value: number }[] = []

  allProducts.forEach((fromProduct) => {
    if (!fromProduct) return // Skip empty product names

    const usersWithProduct = subscribers.filter((s) =>
      s.products.includes(fromProduct)
    )

    if (usersWithProduct.length === 0) return // Skip products with no users

    allProducts.forEach((toProduct) => {
      if (!toProduct || fromProduct === toProduct) return // Skip empty products and self-comparisons

      const usersWithBoth = usersWithProduct.filter((s) =>
        s.products.includes(toProduct)
      )

      const percentage = Math.round(
        (usersWithBoth.length / usersWithProduct.length) * 100
      )

      data.push({
        label: `${fromProduct} → ${toProduct}`,
        value: percentage,
      })
    })
  })

  return data
    .filter((item) => item.value > 0) // Only show non-zero overlaps
    .sort((a, b) => b.value - a.value)
}

function getAIDigestCumulativeData(
  subscribers: {
    products: string[]
    createdAt: Date
  }[]
) {
  const aiDigestSubs = subscribers
    .filter((s) => s.products.includes("AI Digest"))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const dateData: Record<string, number> = {}
  let cumulative = 0

  aiDigestSubs.forEach((sub) => {
    const date = sub.createdAt.toISOString().split("T")[0]
    cumulative++
    dateData[date] = cumulative // Store cumulative count instead of daily count
  })

  // Fill in gaps between dates with the last known cumulative value
  const dates = Object.keys(dateData).sort()
  const startDate = new Date(dates[0])
  const endDate = new Date(dates[dates.length - 1])

  const result: Record<string, number> = {}
  let lastValue = 0

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    const formattedDate = dt.toISOString().split("T")[0]
    if (dateData[formattedDate] !== undefined) {
      lastValue = dateData[formattedDate]
    }
    result[formattedDate] = lastValue
  }

  return result
}

function getProductCumulativeData(
  subscribers: {
    products: string[]
    createdAt: Date
  }[],
  targetProduct: string
) {
  const productSubs = subscribers
    .filter((s) => s.products.includes(targetProduct))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  const dateData: Record<string, number> = {}
  let cumulative = 0

  productSubs.forEach((sub) => {
    const date = sub.createdAt.toISOString().split("T")[0]
    cumulative++
    dateData[date] = cumulative
  })

  // Fill in gaps between dates with the last known cumulative value
  const dates = Object.keys(dateData).sort()
  if (dates.length === 0) return {} // Return empty object if no subscribers

  const startDate = new Date(dates[0])
  const endDate = new Date(dates[dates.length - 1])

  const result: Record<string, number> = {}
  let lastValue = 0

  for (
    let dt = new Date(startDate);
    dt <= endDate;
    dt.setDate(dt.getDate() + 1)
  ) {
    const formattedDate = dt.toISOString().split("T")[0]
    if (dateData[formattedDate] !== undefined) {
      lastValue = dateData[formattedDate]
    }
    result[formattedDate] = lastValue
  }

  return result
}

export default StatsPage
