import {
  AboveBelowQuestion,
  CalibrationQuestion,
  Challenge,
  TeamAboveBelowAnswer,
  TeamFermiAnswer,
} from "@prisma/client"
import { GetServerSideProps } from "next"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Footer } from "../../components/Footer"
import { NavbarChallenge } from "../../components/NavbarChallenge"
import { auth } from "../../lib/auth"
import { Prisma } from "../../lib/prisma"

const adminEmails =
  process.env.ESTIMATION_GAME_ADMIN_EMAILS_COMMA_SEPARATED?.split(",") || []

type FermiQuestionWithAnswers = CalibrationQuestion & {
  teamAnswers: TeamFermiAnswer[]
}

type AboveBelowQuestionWithAnswers = AboveBelowQuestion & {
  teamAnswers: TeamAboveBelowAnswer[]
}

type ChallengeWithQuestions = Challenge & {
  fermiQuestions: FermiQuestionWithAnswers[]
  aboveBelowQuestions: AboveBelowQuestionWithAnswers[]
}

type ChallengeListItem = {
  id: string
  name: string
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await auth(context.req, context.res)
  const userEmail = session?.user?.email

  if (!userEmail || !adminEmails.includes(userEmail)) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    }
  }

  // Only fetch the list of challenges (id and name) for fast initial load
  const challengeList = await Prisma.challenge.findMany({
    where: { isDeleted: false },
    orderBy: { startDate: "desc" },
    select: {
      id: true,
      name: true,
    },
  })

  return {
    props: {
      challengeList: JSON.parse(JSON.stringify(challengeList)),
    },
  }
}

// Helper to format number with commas
const formatNumber = (num: number): string => {
  return num.toLocaleString("en-US", { maximumFractionDigits: 10 })
}

// Types for edited state
interface EditedFermiQuestion {
  id: string
  content: string
  answer: number
  prefix: string
  postfix: string
  source: string
  useLogScoring: boolean
  C: number
}

interface EditedAboveBelowQuestion {
  id: string
  content: string
  quantity: string
  answerIsAbove: boolean
  preciseAnswer: string
  source: string
}

interface EditedChallenge {
  id: string
  name: string
  subtitle: string
  startDate: string
  endDate: string
  unlisted: boolean
}

// Helper to get default dates for a new challenge (24th and 31st of next month)
const getDefaultChallengeDates = () => {
  const now = new Date()
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const startDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 24)
  const endDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 31)
  return {
    startDate: startDate.toISOString().slice(0, 16),
    endDate: endDate.toISOString().slice(0, 16),
  }
}

const EditPage = ({
  challengeList = [],
}: {
  challengeList?: ChallengeListItem[]
}) => {
  const [selectedChallengeId, setSelectedChallengeId] = useState("")
  const [selectedChallenge, setSelectedChallenge] =
    useState<ChallengeWithQuestions | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(false)
  const [editedFermiQuestions, setEditedFermiQuestions] = useState<
    EditedFermiQuestion[]
  >([])
  const [editedAboveBelowQuestions, setEditedAboveBelowQuestions] = useState<
    EditedAboveBelowQuestion[]
  >([])
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)
  const [deletedFermiQuestionIds, setDeletedFermiQuestionIds] = useState<
    string[]
  >([])
  const [deletedAboveBelowQuestionIds, setDeletedAboveBelowQuestionIds] =
    useState<string[]>([])
  const [editedChallenge, setEditedChallenge] = useState<EditedChallenge | null>(
    null
  )
  const [isNewChallenge, setIsNewChallenge] = useState(false)
  const [challengeListState, setChallengeListState] =
    useState<ChallengeListItem[]>(challengeList)

  // Fetch challenge details when selection changes
  const handleChallengeSelect = useCallback(
    async (challengeId: string) => {
      setSelectedChallengeId(challengeId)
      setSaveMessage(null)
      setDeletedFermiQuestionIds([])
      setDeletedAboveBelowQuestionIds([])
      setIsNewChallenge(false)

      if (!challengeId) {
        setSelectedChallenge(null)
        setEditedChallenge(null)
        setEditedFermiQuestions([])
        setEditedAboveBelowQuestions([])
        return
      }

      setLoadingChallenge(true)
      try {
        const response = await fetch(
          `/api/v0/getChallengeForEdit?challengeId=${challengeId}`
        )
        if (response.ok) {
          const challenge: ChallengeWithQuestions = await response.json()
          setSelectedChallenge(challenge)
          setEditedChallenge({
            id: challenge.id,
            name: challenge.name,
            subtitle: challenge.subtitle || "",
            startDate: new Date(challenge.startDate).toISOString().slice(0, 16),
            endDate: new Date(challenge.endDate).toISOString().slice(0, 16),
            unlisted: challenge.unlisted,
          })
          setEditedFermiQuestions(
            challenge.fermiQuestions.map((q) => ({
              id: q.id,
              content: q.content,
              answer: q.answer,
              prefix: q.prefix,
              postfix: q.postfix,
              source: q.source,
              useLogScoring: q.useLogScoring,
              C: q.C,
            }))
          )
          setEditedAboveBelowQuestions(
            challenge.aboveBelowQuestions.map((q) => ({
              id: q.id,
              content: q.content,
              quantity: q.quantity,
              answerIsAbove: q.answerIsAbove,
              preciseAnswer: q.preciseAnswer,
              source: q.source,
            }))
          )
        } else {
          setSelectedChallenge(null)
          setEditedChallenge(null)
          setEditedFermiQuestions([])
          setEditedAboveBelowQuestions([])
        }
      } catch (e) {
        setSelectedChallenge(null)
        setEditedChallenge(null)
        setEditedFermiQuestions([])
        setEditedAboveBelowQuestions([])
      } finally {
        setLoadingChallenge(false)
      }
    },
    []
  )

  // Create a new challenge
  const handleCreateNewChallenge = () => {
    const defaults = getDefaultChallengeDates()
    const newId = `game-${Date.now()}`
    setSelectedChallengeId(newId)
    setIsNewChallenge(true)
    setSelectedChallenge(null)
    setEditedChallenge({
      id: newId,
      name: "",
      subtitle: "",
      startDate: defaults.startDate,
      endDate: defaults.endDate,
      unlisted: true,
    })
    setEditedFermiQuestions([])
    setEditedAboveBelowQuestions([])
    setDeletedFermiQuestionIds([])
    setDeletedAboveBelowQuestionIds([])
    setSaveMessage(null)
  }

  // Update challenge field
  const updateChallengeField = <K extends keyof EditedChallenge>(
    field: K,
    value: EditedChallenge[K]
  ) => {
    setEditedChallenge((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }

  // Check if there are any answers for this challenge
  const hasExistingAnswers = useMemo(() => {
    if (!selectedChallenge) return false
    const fermiAnswerCount = selectedChallenge.fermiQuestions.reduce(
      (acc, q) => acc + q.teamAnswers.length,
      0
    )
    const aboveBelowAnswerCount = selectedChallenge.aboveBelowQuestions.reduce(
      (acc, q) => acc + q.teamAnswers.length,
      0
    )
    return fermiAnswerCount + aboveBelowAnswerCount > 0
  }, [selectedChallenge])

  // Check if a fermi field has been edited
  const isFermiFieldEdited = (
    questionId: string,
    field: keyof EditedFermiQuestion
  ): boolean => {
    if (!selectedChallenge) return false
    // New questions are always considered "edited"
    if (questionId.startsWith("new-")) return true
    const original = selectedChallenge.fermiQuestions.find(
      (q) => q.id === questionId
    )
    const edited = editedFermiQuestions.find((q) => q.id === questionId)
    if (!original || !edited) return false
    return original[field] !== edited[field]
  }

  // Check if an above/below field has been edited
  const isAboveBelowFieldEdited = (
    questionId: string,
    field: keyof EditedAboveBelowQuestion
  ): boolean => {
    if (!selectedChallenge) return false
    // New questions are always considered "edited"
    if (questionId.startsWith("new-")) return true
    const original = selectedChallenge.aboveBelowQuestions.find(
      (q) => q.id === questionId
    )
    const edited = editedAboveBelowQuestions.find((q) => q.id === questionId)
    if (!original || !edited) return false
    return original[field] !== edited[field]
  }

  // Check if a challenge field has been edited
  const isChallengeFieldEdited = (field: keyof EditedChallenge): boolean => {
    if (!editedChallenge) return false
    // New challenges are always considered "edited"
    if (isNewChallenge) return true
    if (!selectedChallenge) return false

    if (field === "startDate") {
      const originalStartDate = new Date(selectedChallenge.startDate)
        .toISOString()
        .slice(0, 16)
      return originalStartDate !== editedChallenge.startDate
    }
    if (field === "endDate") {
      const originalEndDate = new Date(selectedChallenge.endDate)
        .toISOString()
        .slice(0, 16)
      return originalEndDate !== editedChallenge.endDate
    }
    if (field === "subtitle") {
      return (selectedChallenge.subtitle || "") !== editedChallenge.subtitle
    }
    if (field === "name") {
      return selectedChallenge.name !== editedChallenge.name
    }
    if (field === "unlisted") {
      return selectedChallenge.unlisted !== editedChallenge.unlisted
    }
    return false
  }

  // Update fermi question field
  const updateFermiField = <K extends keyof EditedFermiQuestion>(
    index: number,
    field: K,
    value: EditedFermiQuestion[K]
  ) => {
    setEditedFermiQuestions((prev) => {
      const newQuestions = [...prev]
      newQuestions[index] = { ...newQuestions[index], [field]: value }
      return newQuestions
    })
  }

  // Update above/below question field
  const updateAboveBelowField = <K extends keyof EditedAboveBelowQuestion>(
    index: number,
    field: K,
    value: EditedAboveBelowQuestion[K]
  ) => {
    setEditedAboveBelowQuestions((prev) => {
      const newQuestions = [...prev]
      newQuestions[index] = { ...newQuestions[index], [field]: value }
      return newQuestions
    })
  }

  // Add a new fermi question
  const addFermiQuestion = () => {
    const newQuestion: EditedFermiQuestion = {
      id: `new-${Date.now()}`,
      content: "",
      answer: 0,
      prefix: "",
      postfix: "",
      source: "",
      useLogScoring: false,
      C: 100,
    }
    setEditedFermiQuestions((prev) => [...prev, newQuestion])
  }

  // Delete a fermi question
  const deleteFermiQuestion = (index: number) => {
    const question = editedFermiQuestions[index]
    if (!question) return

    // Only track deletion if it's an existing question (not a new one)
    if (!question.id.startsWith("new-")) {
      setDeletedFermiQuestionIds((prev) => [...prev, question.id])
    }
    setEditedFermiQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  // Add a new above/below question
  const addAboveBelowQuestion = () => {
    const newQuestion: EditedAboveBelowQuestion = {
      id: `new-${Date.now()}`,
      content: "",
      quantity: "",
      answerIsAbove: true,
      preciseAnswer: "",
      source: "",
    }
    setEditedAboveBelowQuestions((prev) => [...prev, newQuestion])
  }

  // Delete an above/below question
  const deleteAboveBelowQuestion = (index: number) => {
    const question = editedAboveBelowQuestions[index]
    if (!question) return

    // Only track deletion if it's an existing question (not a new one)
    if (!question.id.startsWith("new-")) {
      setDeletedAboveBelowQuestionIds((prev) => [...prev, question.id])
    }
    setEditedAboveBelowQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  // Check if a question is new (not yet saved)
  const isNewQuestion = (id: string) => id.startsWith("new-")

  // Check if there are any unsaved changes
  const hasChanges = useMemo(() => {
    // For new challenges, always have changes if there's a name
    if (isNewChallenge && editedChallenge) {
      return editedChallenge.name.trim() !== ""
    }

    if (!selectedChallenge || !editedChallenge) return false

    // Check if challenge metadata changed
    const originalStartDate = new Date(selectedChallenge.startDate)
      .toISOString()
      .slice(0, 16)
    const originalEndDate = new Date(selectedChallenge.endDate)
      .toISOString()
      .slice(0, 16)
    if (
      selectedChallenge.name !== editedChallenge.name ||
      (selectedChallenge.subtitle || "") !== editedChallenge.subtitle ||
      originalStartDate !== editedChallenge.startDate ||
      originalEndDate !== editedChallenge.endDate ||
      selectedChallenge.unlisted !== editedChallenge.unlisted
    ) {
      return true
    }

    // Check if any questions were deleted
    if (deletedFermiQuestionIds.length > 0) return true
    if (deletedAboveBelowQuestionIds.length > 0) return true

    // Check if any new questions were added
    if (editedFermiQuestions.some((q) => q.id.startsWith("new-"))) return true
    if (editedAboveBelowQuestions.some((q) => q.id.startsWith("new-")))
      return true

    // Compare existing questions for edits
    for (const edited of editedFermiQuestions) {
      if (edited.id.startsWith("new-")) continue
      const original = selectedChallenge.fermiQuestions.find(
        (q) => q.id === edited.id
      )
      if (!original) continue
      if (
        original.content !== edited.content ||
        original.answer !== edited.answer ||
        original.prefix !== edited.prefix ||
        original.postfix !== edited.postfix ||
        original.source !== edited.source ||
        original.useLogScoring !== edited.useLogScoring ||
        original.C !== edited.C
      ) {
        return true
      }
    }

    for (const edited of editedAboveBelowQuestions) {
      if (edited.id.startsWith("new-")) continue
      const original = selectedChallenge.aboveBelowQuestions.find(
        (q) => q.id === edited.id
      )
      if (!original) continue
      if (
        original.content !== edited.content ||
        original.quantity !== edited.quantity ||
        original.answerIsAbove !== edited.answerIsAbove ||
        original.preciseAnswer !== edited.preciseAnswer ||
        original.source !== edited.source
      ) {
        return true
      }
    }

    return false
  }, [
    selectedChallenge,
    editedChallenge,
    editedFermiQuestions,
    editedAboveBelowQuestions,
    deletedFermiQuestionIds,
    deletedAboveBelowQuestionIds,
    isNewChallenge,
  ])

  // Warn user about unsaved changes when navigating away
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
    }
  }, [hasChanges])

  // Save changes
  const handleSave = async () => {
    if (!selectedChallengeId || !hasChanges || !editedChallenge) return

    // Validate required fields for new challenges
    if (isNewChallenge) {
      if (!editedChallenge.name.trim()) {
        setSaveMessage({ type: "error", text: "Challenge name is required" })
        return
      }
      if (!editedChallenge.id.trim()) {
        setSaveMessage({ type: "error", text: "Challenge ID is required" })
        return
      }
    }

    setSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch("/api/v0/updateChallengeQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: selectedChallengeId,
          challenge: editedChallenge,
          fermiQuestions: editedFermiQuestions,
          aboveBelowQuestions: editedAboveBelowQuestions,
          deletedFermiQuestionIds,
          deletedAboveBelowQuestionIds,
          isNewChallenge,
        }),
      })

      if (response.ok) {
        setSaveMessage({ type: "success", text: "Changes saved successfully!" })
        // If it was a new challenge, add it to the list
        if (isNewChallenge) {
          setChallengeListState((prev) => [
            { id: editedChallenge.id, name: editedChallenge.name },
            ...prev,
          ])
        } else {
          // Update name in the list if it changed
          setChallengeListState((prev) =>
            prev.map((c) =>
              c.id === editedChallenge.id
                ? { ...c, name: editedChallenge.name }
                : c
            )
          )
        }
        // Refresh the challenge data
        handleChallengeSelect(selectedChallengeId)
      } else {
        const error = await response.json()
        setSaveMessage({
          type: "error",
          text: `Error saving: ${error.error || "Unknown error"}`,
        })
      }
    } catch (e) {
      setSaveMessage({ type: "error", text: "Error saving changes" })
    } finally {
      setSaving(false)
    }
  }

  const inputClass = (edited: boolean) =>
    `mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
      edited ? "border-yellow-400 bg-yellow-50" : "border-gray-300"
    }`

  const textareaClass = (edited: boolean) =>
    `mt-1 block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
      edited ? "border-yellow-400 bg-yellow-50" : "border-gray-300"
    }`

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
      <div className="py-10 bg-gray-100 grow">
        <main>
          <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow rounded-lg">
            <h1 className="text-2xl font-bold mb-4">Edit Estimation Game</h1>

            <div
              className="bg-indigo-100 border-l-4 border-indigo-500 text-indigo-700 p-4 mb-4"
              role="alert"
            >
              <p className="font-bold">Warning</p>
              <p>
                Changes made here affect the production database and will be
                instantly visible to users.
              </p>
            </div>

            {/* Challenge selector */}
            <div className="mb-6">
              <label
                htmlFor="challenge"
                className="block text-sm font-medium text-gray-700"
              >
                Select Challenge to Edit
              </label>
              <div className="flex gap-2 mt-1">
                <select
                  id="challenge"
                  value={isNewChallenge ? "" : selectedChallengeId}
                  onChange={(e) => handleChallengeSelect(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md border"
                  disabled={loadingChallenge}
                >
                  <option value="">Select a challenge</option>
                  {challengeListState.map((challenge) => (
                    <option key={challenge.id} value={challenge.id}>
                      {challenge.name} ({challenge.id})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleCreateNewChallenge}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 whitespace-nowrap"
                  disabled={loadingChallenge}
                >
                  + New Challenge
                </button>
              </div>
            </div>

            {/* Loading indicator */}
            {loadingChallenge && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading challenge...</p>
              </div>
            )}

            {(selectedChallenge || isNewChallenge) && !loadingChallenge && editedChallenge && (
              <>
                {/* Warning if there are existing answers */}
                {hasExistingAnswers && (
                  <div
                    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6"
                    role="alert"
                  >
                    <p className="font-bold">Warning: Existing Answers</p>
                    <p>
                      This challenge has existing answers from users. Editing
                      questions that users have already seen may cause
                      confusion. Proceed with caution.
                    </p>
                  </div>
                )}

                {/* New challenge indicator */}
                {isNewChallenge && (
                  <div
                    className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6"
                    role="alert"
                  >
                    <p className="font-bold">Creating New Challenge</p>
                    <p>
                      Fill in the details below and click Save to create the challenge.
                    </p>
                  </div>
                )}

                {/* Challenge Metadata */}
                <div className="mb-6 border border-gray-200 rounded-lg p-4">
                  <h2 className="text-xl font-semibold mb-4">Challenge Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={editedChallenge.name}
                        onChange={(e) =>
                          updateChallengeField("name", e.target.value)
                        }
                        className={inputClass(isChallengeFieldEdited("name"))}
                        placeholder="e.g., The February 2026 Estimation Game"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={editedChallenge.subtitle}
                        onChange={(e) =>
                          updateChallengeField("subtitle", e.target.value)
                        }
                        className={inputClass(isChallengeFieldEdited("subtitle"))}
                        placeholder="Optional, e.g. '🌋Volcanoes'"
                      />
                    </div>

                    {/* Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Date
                      </label>
                      <input
                        type="datetime-local"
                        value={editedChallenge.startDate}
                        onChange={(e) =>
                          updateChallengeField("startDate", e.target.value)
                        }
                        className={inputClass(isChallengeFieldEdited("startDate"))}
                      />
                    </div>

                    {/* End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Date
                      </label>
                      <input
                        type="datetime-local"
                        value={editedChallenge.endDate}
                        onChange={(e) =>
                          updateChallengeField("endDate", e.target.value)
                        }
                        className={inputClass(isChallengeFieldEdited("endDate"))}
                      />
                    </div>

                    {/* Unlisted */}
                    <div className="md:col-span-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={editedChallenge.unlisted}
                          onChange={(e) =>
                            updateChallengeField("unlisted", e.target.checked)
                          }
                          className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                            isChallengeFieldEdited("unlisted")
                              ? "ring-2 ring-yellow-400"
                              : ""
                          }`}
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Unlisted{" "}
                          <span className="text-gray-400">
                            (won&apos;t appear on the public games list)
                          </span>
                        </span>
                      </label>
                    </div>

                    {/* Challenge ID */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Challenge ID (used as URL slug){" "}
                        {isNewChallenge && <span className="text-red-500">*</span>}
                      </label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="text"
                          value={editedChallenge.id}
                          onChange={(e) => {
                            if (isNewChallenge) {
                              const newId = e.target.value
                                .toLowerCase()
                                .replace(/[^a-z0-9-]/g, "-")
                              setEditedChallenge((prev) =>
                                prev ? { ...prev, id: newId } : prev
                              )
                              setSelectedChallengeId(newId)
                            }
                          }}
                          disabled={!isNewChallenge}
                          placeholder="e.g., october-2025"
                          className={`block w-full border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            isNewChallenge
                              ? "border-gray-300"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        />
                        {!isNewChallenge && (
                          <button
                            onClick={() =>
                              window.open(
                                `/estimation-game/${editedChallenge.id}`,
                                "_blank"
                              )
                            }
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 whitespace-nowrap"
                          >
                            View Challenge ↗
                          </button>
                        )}
                      </div>
                      {isNewChallenge && (
                        <p className="mt-1 text-sm text-gray-500">
                          URL will be: /estimation-game/{editedChallenge.id || "..."}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit indicator legend */}
                <div className="mb-4 text-sm text-gray-600 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-4 h-4 bg-yellow-50 border border-yellow-400 rounded"></span>
                    <span>Edited field (unsaved)</span>
                  </span>
                </div>

                {/* Save button and message */}
                <div className="mb-6 flex items-center gap-4">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : isNewChallenge
                      ? "Create Challenge"
                      : "Save Changes"}
                  </button>
                  {saveMessage && (
                    <span
                      className={
                        saveMessage.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {saveMessage.text}
                    </span>
                  )}
                  {hasChanges && !saving && (
                    <span className="text-yellow-600">Unsaved changes</span>
                  )}
                </div>

                {/* Fermi Questions */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Round 1: Fermi Questions ({editedFermiQuestions.length})
                  </h2>
                  <div className="space-y-6">
                    {editedFermiQuestions.map((question, index) => {
                      const originalQuestion = selectedChallenge?.fermiQuestions.find(
                        (q) => q.id === question.id
                      )
                      const answerCount = originalQuestion?.teamAnswers.length || 0
                      const isNew = isNewQuestion(question.id)
                      return (
                        <div
                          key={question.id}
                          className={`border rounded-lg p-4 ${
                            isNew
                              ? "border-green-400 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-medium">
                              Question {index + 1}
                              {isNew && (
                                <span className="ml-2 text-sm text-green-600">
                                  (new)
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center gap-2">
                              {answerCount > 0 && (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                  {answerCount} answer{answerCount !== 1 && "s"}
                                </span>
                              )}
                              <button
                                onClick={() => deleteFermiQuestion(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                                title="Delete question"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Content (supports markdown)
                            </label>
                            <textarea
                              value={question.content}
                              onChange={(e) =>
                                updateFermiField(
                                  index,
                                  "content",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className={textareaClass(
                                isFermiFieldEdited(question.id, "content")
                              )}
                            />
                          </div>

                          {/* Answer */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Answer (number)
                            </label>
                            <input
                              type="number"
                              step="any"
                              value={question.answer}
                              onChange={(e) =>
                                updateFermiField(
                                  index,
                                  "answer",
                                  parseFloat(e.target.value) || 0
                                )
                              }
                              className={inputClass(
                                isFermiFieldEdited(question.id, "answer")
                              )}
                            />
                            <p className="mt-1 text-sm text-gray-500">
                              Formatted: {question.prefix}
                              {formatNumber(question.answer)}
                              {question.postfix ? ` ${question.postfix}` : ""}
                            </p>
                          </div>

                          {/* Prefix and Postfix */}
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Prefix (e.g. $)
                              </label>
                              <input
                                type="text"
                                value={question.prefix}
                                onChange={(e) =>
                                  updateFermiField(
                                    index,
                                    "prefix",
                                    e.target.value
                                  )
                                }
                                className={inputClass(
                                  isFermiFieldEdited(question.id, "prefix")
                                )}
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Postfix (e.g. %)
                              </label>
                              <input
                                type="text"
                                value={question.postfix}
                                onChange={(e) =>
                                  updateFermiField(
                                    index,
                                    "postfix",
                                    e.target.value
                                  )
                                }
                                className={inputClass(
                                  isFermiFieldEdited(question.id, "postfix")
                                )}
                              />
                            </div>
                          </div>

                          {/* Source */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Source (supports markdown)
                            </label>
                            <textarea
                              value={question.source}
                              onChange={(e) =>
                                updateFermiField(index, "source", e.target.value)
                              }
                              rows={2}
                              className={textareaClass(
                                isFermiFieldEdited(question.id, "source")
                              )}
                            />
                          </div>

                          {/* useLogScoring and C */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={question.useLogScoring}
                                  onChange={(e) =>
                                    updateFermiField(
                                      index,
                                      "useLogScoring",
                                      e.target.checked
                                    )
                                  }
                                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                                    isFermiFieldEdited(question.id, "useLogScoring")
                                      ? "ring-2 ring-yellow-400"
                                      : ""
                                  }`}
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Use Log Scoring{" "}
                                  <span className="text-gray-400">
                                    (default when answer {">"} 9999)
                                  </span>
                                </span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                C (scoring parameter)
                              </label>
                              <input
                                type="number"
                                step="any"
                                value={question.C}
                                onChange={(e) =>
                                  updateFermiField(
                                    index,
                                    "C",
                                    parseFloat(e.target.value) || 0
                                  )
                                }
                                className={inputClass(
                                  isFermiFieldEdited(question.id, "C")
                                )}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={addFermiQuestion}
                    className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    + Add Fermi Question
                  </button>
                </div>

                {/* Above/Below Questions */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">
                    Round 2: Above/Below Questions (
                    {editedAboveBelowQuestions.length})
                  </h2>
                  <div className="space-y-6">
                    {editedAboveBelowQuestions.map((question, index) => {
                      const originalQuestion =
                        selectedChallenge?.aboveBelowQuestions.find(
                          (q) => q.id === question.id
                        )
                      const answerCount = originalQuestion?.teamAnswers.length || 0
                      const isNew = isNewQuestion(question.id)
                      return (
                        <div
                          key={question.id}
                          className={`border rounded-lg p-4 ${
                            isNew
                              ? "border-green-400 bg-green-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-medium">
                              Question {index + 1}
                              {isNew && (
                                <span className="ml-2 text-sm text-green-600">
                                  (new)
                                </span>
                              )}
                            </h3>
                            <div className="flex items-center gap-2">
                              {answerCount > 0 && (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                                  {answerCount} answer{answerCount !== 1 && "s"}
                                </span>
                              )}
                              <button
                                onClick={() => deleteAboveBelowQuestion(index)}
                                className="text-red-600 hover:text-red-800 text-sm font-medium px-2 py-1 rounded hover:bg-red-50"
                                title="Delete question"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Content (supports markdown)
                            </label>
                            <textarea
                              value={question.content}
                              onChange={(e) =>
                                updateAboveBelowField(
                                  index,
                                  "content",
                                  e.target.value
                                )
                              }
                              rows={3}
                              className={textareaClass(
                                isAboveBelowFieldEdited(question.id, "content")
                              )}
                            />
                          </div>

                          {/* Quantity */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Quantity (the value users compare against)
                            </label>
                            <input
                              type="text"
                              value={question.quantity}
                              onChange={(e) =>
                                updateAboveBelowField(
                                  index,
                                  "quantity",
                                  e.target.value
                                )
                              }
                              className={inputClass(
                                isAboveBelowFieldEdited(question.id, "quantity")
                              )}
                            />
                          </div>

                          {/* Answer is Above and Precise Answer */}
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={question.answerIsAbove}
                                  onChange={(e) =>
                                    updateAboveBelowField(
                                      index,
                                      "answerIsAbove",
                                      e.target.checked
                                    )
                                  }
                                  className={`h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded ${
                                    isAboveBelowFieldEdited(
                                      question.id,
                                      "answerIsAbove"
                                    )
                                      ? "ring-2 ring-yellow-400"
                                      : ""
                                  }`}
                                />
                                <span className="ml-2 text-sm text-gray-700">
                                  Answer is Above
                                </span>
                              </label>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Precise Answer
                              </label>
                              <input
                                type="text"
                                value={question.preciseAnswer}
                                onChange={(e) =>
                                  updateAboveBelowField(
                                    index,
                                    "preciseAnswer",
                                    e.target.value
                                  )
                                }
                                className={inputClass(
                                  isAboveBelowFieldEdited(question.id, "preciseAnswer")
                                )}
                              />
                            </div>
                          </div>

                          {/* Source */}
                          <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Source (supports markdown)
                            </label>
                            <textarea
                              value={question.source}
                              onChange={(e) =>
                                updateAboveBelowField(
                                  index,
                                  "source",
                                  e.target.value
                                )
                              }
                              rows={2}
                              className={textareaClass(
                                isAboveBelowFieldEdited(question.id, "source")
                              )}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <button
                    onClick={addAboveBelowQuestion}
                    className="mt-4 inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    + Add Above/Below Question
                  </button>
                </div>

                {/* Bottom save button */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleSave}
                    disabled={!hasChanges || saving}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving
                      ? "Saving..."
                      : isNewChallenge
                      ? "Create Challenge"
                      : "Save Changes"}
                  </button>
                  {saveMessage && (
                    <span
                      className={
                        saveMessage.type === "success"
                          ? "text-green-600"
                          : "text-red-600"
                      }
                    >
                      {saveMessage.text}
                    </span>
                  )}
                  {hasChanges && !saving && (
                    <span className="text-yellow-600">Unsaved changes</span>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default EditPage
