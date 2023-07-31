import { Dialog, Transition } from "@headlessui/react";
import { CalibrationQuestionTag } from "@prisma/client";
import clsx from "clsx";
import { Fragment, useState } from "react";
import { SuperJSONValue } from 'superjson/dist/types';
import useSWR from 'swr';
import { fetcher } from '../lib/services/data';

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

  return (
    <>
      <button
        onClick={() => openModal()}
        className="relative hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm"
      >
        <span className="text-gray-600 font-normal text-sm">
          {"Current deck"}{selectedTags.length > 1 ? "s" : ""}{": "}
        </span>
          {selectedTags.map((tag) => <span key={tag.id} className="block">{tag.name}</span>)}
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
                  <div className="mt-4 flex flex-row gap-2 flex-wrap">
                    {
                      allTags.map((tag) => {
                        const selected = localSelectedTags.includes(tag)
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
                              "w-full md:w-48 bg-gray-100 rounded-md px-4 py-3 prose hover:bg-gray-200 cursor-pointer",
                              selected ? "border-2 border-indigo-500" : "border-2 border-transparent",
                            )}
                            onClick={() => setLocalSelectedTags(
                              selected ? localSelectedTags.filter((t) => t.id !== tag.id) : [...localSelectedTags, tag]
                            )}
                          >
                            {<div className="mx-auto text-center">
                              <div
                                className="radial-progress bg-primary text-primary-content border-4 border-primary text-sm"
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