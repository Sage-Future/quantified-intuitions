import { Dialog, Transition } from "@headlessui/react";
import { CalibrationQuestionTag } from "@prisma/client";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { SuperJSONValue } from 'superjson/dist/types';
import useSWR from 'swr';
import { fetcher } from '../lib/services/data';

const EA_SUBDECKS = [
  "animals",
  "effective altruism",
  "effective giving",
  "global poverty",
  "long_term_history",
  "pandemics",
]
export function DeckSelector({
  allTags,
  selectedTags,
  setSelectedTags,
} : {
  allTags: CalibrationQuestionTag[],
  selectedTags: CalibrationQuestionTag[]
  setSelectedTags: (selectedTags: CalibrationQuestionTag[]) => void
}) {
  const [isOpen, setIsOpen] = useState(false)

  const [localSelectedTags, setLocalSelectedTags] = useState<CalibrationQuestionTag[]>(selectedTags)
  const openModal = () => {
    setIsOpen(true)
    setLocalSelectedTags(selectedTags)
  }

  console.log({selectedTags, localSelectedTags})

  const closeModal = () => {
    if (localSelectedTags.length === 0) {
      setLocalSelectedTags(selectedTags)
    } else {
      setSelectedTags(localSelectedTags)
    }
    setIsOpen(false)
  }

  const { data, isValidating } = useSWR<SuperJSONValue>(
    `/api/v0/getCalibrationDeckStats`,
    fetcher,
    { 
      revalidateOnMount: true,
    }
  )

  const selectedDeckStats = {
    totalQuestions: selectedTags.reduce((acc, curr) => {
      if (selectedTags.some(t => t.id === "ea") && EA_SUBDECKS.includes(curr.id)) {
        return acc
      }
      const stats = data?.json.find((stat: any) => stat.tag === curr.id)
      return acc + (stats ? stats.totalQuestions : 0)
    }, 0),
    answered: selectedTags.reduce((acc, curr) => {
      if (selectedTags.some(t => t.id === "ea") && EA_SUBDECKS.includes(curr.id)) {
        return acc
      }
      const stats = data?.json.find((stat: any) => stat.tag === curr.id)
      return acc + (stats ? stats.answered : 0)
    }, 0),
  }

  return (
    <>
      <button
        onClick={() => openModal()}
        className="relative flex gap-4 hover:bg-gray-100 font-semibold text-gray-800 py-4 px-6 border border-gray-300 rounded-md shadow-sm text-sm text-left mx-auto"
      >
        {<div className="mx-auto my-auto text-center">
          <div
            className="radial-progress bg-primary text-white border-4 border-primary text-xs"
            style={{
              "--value": (selectedDeckStats.answered / selectedDeckStats.totalQuestions * 100) || 0,
              "--size": "3rem"
            } as any}
          >
            {data ? `${selectedDeckStats.answered}/${selectedDeckStats.totalQuestions}` : "..."}
          </div>
        </div>}
        <div className="my-auto">
          <span className="text-gray-600 font-normal text-sm">
            {"Deck"}{selectedTags.length > 1 ? "s" : ""}{": "}
          </span>
          {selectedTags.map((tag) => <span key={tag.id} className="block text-lg">{tag.name}</span>)}
        </div>
      </button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium text-gray-900"
                  >
                    Choose calibration decks
                  </Dialog.Title>
                  <span className="text-sm text-gray-400">Select multiple decks to shuffle them together.</span>
                  <div className="mt-4 flex flex-row gap-4 md:gap-8 flex-wrap justify-around">
                    {
                      allTags.map((tag) => {
                        const selected = localSelectedTags.find(t => t.id === tag.id)
                        const stats = data?.json.find((stat: any) => stat.tag === tag.id) as {
                          totalQuestions: number,
                          answered: number,
                          totalScore: number,
                        } | undefined
                        const percentAnswered = stats ? (stats.answered / stats.totalQuestions) * 100 : undefined
                        return (
                          <div
                            key={tag.id}
                            className={clsx(
                              "w-full md:w-48 rounded-md px-4 py-4 prose hover:bg-gray-200 cursor-pointer shadow-md",
                              selected ? "border-2 border-indigo-500" : "border border-1 border-gray-300",
                            )}
                            onClick={() => setLocalSelectedTags(
                              selected ? localSelectedTags.filter((t) => t.id !== tag.id) : [...localSelectedTags, tag]
                            )}
                          >
                            {<div className="mx-auto text-center">
                              <div
                                className="radial-progress bg-primary text-white border-4 border-primary text-sm"
                                style={{"--value":percentAnswered || 0, "--size": "4rem"} as any}
                              >
                                {stats ? `${stats.answered}/${stats.totalQuestions}` : "..."}
                              </div>
                            </div>}
                            <h4 className="font-semibold">{tag.name}</h4>
                            <p className="text-sm">{tag.description}</p>
                          </div>
                        )
                      })
                    }
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={closeModal}
                      disabled={localSelectedTags.length === 0}
                    >
                      Done
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}