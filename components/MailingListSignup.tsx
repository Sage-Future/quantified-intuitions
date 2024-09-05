import clsx from "clsx"
import { event } from "nextjs-google-analytics"
import { useState } from "react"
import { Errors } from "./Errors"

export const MailingListSignup = ({
  buttonText,
  tags = [],
  disabled = false,
}: {
  buttonText: string
  tags?: string[]
  disabled?: boolean
}) => {
  const [email, setEmail] = useState("")
  const [submissionState, setSubmissionState] = useState<
    "idle" | "loading" | "success"
  >("idle")
  const [errors, setErrors] = useState<string[]>([])

  const submit = async () => {
    if (email === "") {
      return
    }

    setSubmissionState("loading")

    await fetch("/api/email/subscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        subscribers: [
          {
            email,
            tags,
            products: ["Quantified Intuitions"],
          },
        ],
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        setSubmissionState("success")

        event("mailing_list_join", {
          category: "mailing_list",
          email,
          tags,
        })
      } else {
        setErrors(["There was an error joining the mailing list"])
        setSubmissionState("idle")
      }
    })
  }

  return (
    <div>
      <div className="max-w-lg flex flex-col flex-wrap">
        <input
          type="text"
          id="email"
          className={clsx(
            "flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full min-w-0 sm:text-sm border-gray-300 disabled:opacity-50 rounded-t-md"
          )}
          placeholder="your@email.com"
          disabled={disabled}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type={"button"}
          className={clsx(
            "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-b-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
          )}
          onClick={submit}
          disabled={submissionState !== "idle"}
        >
          {submissionState === "loading" && (
            <>
              <svg
                className="animate-spin h-5 w-5 -ml-1 mr-3"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {` ${"Signing up..."}`}
            </>
          )}
          {submissionState === "idle" && <>{buttonText}</>}
          {submissionState === "success" && <>Subscribed!</>}
        </button>
      </div>
      {errors.length > 0 && (
        <div className="pt-5">
          <Errors errors={errors} />
        </div>
      )}
    </div>
  )
}
