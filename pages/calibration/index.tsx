import { useState } from 'react'

import { CalibrationQuestion, CalibrationQuestionTag } from '@prisma/client'

import Link from 'next/link'
import { event } from 'nextjs-google-analytics'
import { deserialize } from 'superjson'
import { SuperJSONValue } from 'superjson/dist/types'
import useSWR, { mutate } from 'swr'
import { ButtonArray } from "../../components/ButtonArray"
import { CalibrationForm } from '../../components/CalibrationForm'
import { Footer } from '../../components/Footer'
import { NavbarCalibration } from '../../components/NavbarCalibration'
import { Sorry } from '../../components/Sorry'
import { fetcher } from '../../lib/services/data'
import { DeckSelector } from '../../components/DeckSelector'
import { NextPageContext } from 'next'
import { useRouter } from 'next/router'

// todo make static?
export const getServerSideProps = async (ctx: NextPageContext) => {
  const allTags = await Prisma?.calibrationQuestionTag.findMany({
    where: {
      showInDeckSwitcher: true
    }
  })

  return {
    props: {
      allTags
    }
  }
}

const DEFAULT_DECKS = ["ea"]

const Calibration = ({
  allTags
}: {
  allTags: CalibrationQuestionTag[]
}) => {
  const router = useRouter()

  const initialDecks = router.query.deck || router.query.decks || DEFAULT_DECKS
  const [tags, setTags] = useState<CalibrationQuestionTag[]>(allTags.filter((tag) => initialDecks === tag.id || initialDecks.includes(tag.id)))

  const getQuestionUrl = `/api/v0/getCalibrationQuestion?tags=${tags.map((tag) => tag.id).join(",")}`
  const { data, isValidating } = useSWR<SuperJSONValue>(
    getQuestionUrl,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
    }
  )

  const result = deserialize({
    json: data?.json,
    meta: data?.meta
  }) as { calibrationQuestion: CalibrationQuestion | null, allQuestionsAnswered: boolean }
  const calibrationQuestion = result?.calibrationQuestion

  const [confidenceInterval, setConfidenceInterval] = useState<string>("80%")
  const [sessionScore, setSessionScore] = useState<number>(0)
  const addToSessionScore = (score: number) => {
    setSessionScore(sessionScore + score)
  }
  const [countdown, setCountdown] = useState<number>(180)

  const nextQuestion = () => {
    mutate(getQuestionUrl)
    setCountdown(180)
    event("calibration_next_question", {
      app: "calibration",
      question_id: calibrationQuestion?.id,
    })
  }
  const reduceCountdown = () => {
    setCountdown(countdown - 1)
    if (countdown < -10) nextQuestion()
  }

  if (!calibrationQuestion || isValidating) {
    return (
      <div className="flex flex-col min-h-screen justify-between">
        <NavbarCalibration />
        <div className="py-10 grow">
          <main>
            <div>
              <div className="flex flex-col items-center justify-center prose mx-auto">
                {result?.allQuestionsAnswered ? 
                  <>
                    <h1 className="text-4xl font-bold text-center">
                      {"You've answered all the questions!"}
                    </h1>
                    <DeckSelector allTags={allTags} selectedTags={tags} setSelectedTags={setTags} />
                    <p className="text-center">
                      Check your calibration in <Link href="/calibration/charts">charts</Link>, or <Link href="/">try our other games</Link>.
                    </p>
                  </>
                  :
                  <p className='text-gray-700'>Loading...</p>
                }
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarCalibration />
      <div className="py-6 px-8 grow">
        <div className="max-w-prose mx-auto flex justify-between flex-wrap gap-4 md:flex-row-reverse">
          <div className="prose">
            <h4 className="my-0 text-gray-500">Time remaining:</h4>
            <h2 className="my-0">
              {countdown > 0 ? countdown : "Time's up!"}
              {countdown > 0 && (
                <span className="text-gray-500 text-[16px]"> seconds</span>
              )}
            </h2>
          </div>
          <ButtonArray
            selected={confidenceInterval}
            setSelected={setConfidenceInterval}
            options={["50%", "60%", "70%", "80%", "90%"]}
            label={"Confidence interval"}
          />
          <div className="prose">
            <h4 className="my-0 text-gray-500">Score:</h4>
            <h2 className="my-0">
              {sessionScore.toFixed(2)}
              <span className="text-gray-500 text-[16px]"> points</span>
            </h2>
          </div>
          <DeckSelector allTags={allTags} selectedTags={tags} setSelectedTags={setTags} />
        </div>
        {calibrationQuestion === undefined ? (
          <div className="mt-10">
            <Sorry />
          </div>
        ) : (
          <CalibrationForm
            calibrationQuestion={calibrationQuestion}
            confidenceInterval={confidenceInterval}
            reduceCountdown={reduceCountdown}
            nextQuestion={nextQuestion}
            addToSessionScore={addToSessionScore}
            key={calibrationQuestion.id}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default Calibration
