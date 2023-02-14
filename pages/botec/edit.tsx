import { Dialog } from "@headlessui/react"
import { BuildingLibraryIcon, UsersIcon } from "@heroicons/react/24/solid"
import { SqValue } from "@quri/squiggle-lang"
import clsx from "clsx"
import { NextPage } from "next"
import { useRouter } from "next/router"
import { ParsedUrlQuery } from "querystring"
import { useEffect, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Footer } from "../../components/Footer"
import { NavbarGeneric } from "../../components/NavbarGeneric"
import { DynamicSquiggleEditor } from "../../components/SquiggleEditor"

const EditBotecPage: NextPage = () => {
  const router = useRouter()
  const [botecName, setBotecName] = useState(router.query.problemName)
  const [authorName, setAuthorName] = useState(router.query.author)
  const [versionName, setVersionName] = useState(router.query.version)

  const defaultSquiggleCode = "3 to 4"
  const [squiggleCode, setSquiggleCode] = useState(defaultSquiggleCode)
  const [squiggleValue, setSquiggleValue] = useState<SqValue | undefined>(undefined)

  const [modalIsOpen, setModalIsOpen] = useState(false)

  useEffect(() => {
    if (!botecName) {
      setBotecName(router.query.problemName)
    }
    // TODO hook these up
    if (!authorName) {
      setAuthorName(router.query.author)
    }
    if (!versionName) {
      setVersionName(router.query.version)
    }

    if (squiggleCode === defaultSquiggleCode && canGenerateSquiggleCode(router.query)) {
      setSquiggleCode(generateSquiggleCode(router.query))
    }
  }, [router.query])

  const forumComment = `
  **Cause Area:** ${botecName}
  
  **Version:**
  
  **Submitter:**
  
  **Expected QALYs per $:** ${//@ts-ignore
                    squiggleValue?.value._value.mean()}
  
  **Median QALYs per $:** ${//@ts-ignore
                    squiggleValue?.value._value.inv(0.5)}
  
  **Link to code:**
  
  **Comments, justification, uncertainties:**
  
  **Main uncertainties:**`

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarGeneric />

      <div className="py-10 bg-gray-100 grow">
        <div className="bg-white max-w-4xl mx-auto p-6 flex flex-col gap-6">
          <input
            type="text"
            placeholder="What problem are you BOTECing?"
            className={clsx(
              "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300",
              "shadow-sm  block w-full  text-lg  rounded-md pr-7 disabled:opacity-25 disabled:bg-gray-100"
            )}
            value={botecName || ""}
            onChange={(e) => setBotecName(e.target.value)}
          />

          <DynamicSquiggleEditor
            code={squiggleCode}
            onCodeChange={(value) => setSquiggleCode(value)}
            onChange={(value) => setSquiggleValue(value)}
            distributionChartSettings={{
              showSummary: true,
              title: "Expected QALYs per USD",
            }}
          />

          <button
            className="relative max-w-xs mt-8 mx-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
            onClick={() => setModalIsOpen(true)}
          >
            <BuildingLibraryIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            <span>Publish to the BOTEC database</span>
          </button>
        </div>
      </div>

      <Dialog
        open={modalIsOpen}
        onClose={() => setModalIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md p-8 rounded bg-white prose">
            <Dialog.Title>Publish to the BOTEC database</Dialog.Title>
            <Dialog.Description>
              To publish to the database, copy this comment and post it on the EA Forum!
            </Dialog.Description>
            {/* 
            //@ts-ignore
              console.log(value?.value._value.mean())
              //@ts-ignore
              console.log(value?.value._value)
              //@ts-ignore
              console.log(value?.value._value.inv(0.5)) */}

            <div className="bg-gray-100 outline outline-gray-300 rounded-md px-4 py-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {forumComment}
              </ReactMarkdown>
              <button
                className="relative max-w-xs mx-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
                onClick={() => navigator.clipboard.writeText(forumComment)}
              >
                Copy
              </button>
            </div>

            <button
              className="relative max-w-xs mt-8 mx-auto inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
              onClick={() => setModalIsOpen(true)}
            >
              <UsersIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              <span>Take me to the Forum!</span>
            </button>
          </Dialog.Panel>
        </div>
      </Dialog>

      <Footer />
    </div>
  )
}
export default EditBotecPage

function canGenerateSquiggleCode(query: ParsedUrlQuery) {
  const requiredParams = [
    "problemName",
    "positivelyaffectedbeingsLower",
    "positivelyaffectedbeingsHigher",
    "posbeingdiscount",
    "posAvQALYLower",
    "posAvQALYHigher",
    "negativelyAffectedBeingsLower",
    "negativelyAffectedBeingsUpper",
    "negativebeingdiscount",
    "negAvQALYLower",
    "negAvQALYHigher",
    "progressifresourcesdoubleLower",
    "progressifresourcesdoubleHigher",
    "fundingLower",
    "fundingHigher",
  ]
  if (requiredParams.some((param) => !query[param])) {
    console.warn(`Can't generate, missing required param`)
    return false
  }
  return true
}

function generateSquiggleCode(query: ParsedUrlQuery) {
  const {
    problemName,
    positivelyaffectedbeingsLower,
    positivelyaffectedbeingsHigher,
    posbeingdiscount,
    posAvQALYLower,
    posAvQALYHigher,
    negativelyAffectedBeingsLower,
    negativelyAffectedBeingsUpper,
    negativebeingdiscount,
    negAvQALYLower,
    negAvQALYHigher,
    progressifresourcesdoubleLower,
    progressifresourcesdoubleHigher,
    fundingLower,
    fundingHigher
  } = query

  return `
// Let's use the ITN framework on ${problemName}

// Scale

//let us focus on positive impacts only:
positivelyaffectedbeings = ${positivelyaffectedbeingsLower} to ${positivelyaffectedbeingsHigher} // This means that you're 90% confident the value is between those two quantities a and b.
//If the problem involves non-existing-human beings, how much do you weight their welfare 
beingdiscount = ${posbeingdiscount} //this is a value where 1 is human and 0.1 is a tenth of a human and 10 is ten times, etc

//Consider the average being affected, how many Quality-adjusted life years would fully solving this problem (do not discount these) give this being?
//One QALY equates to one year in perfect health. 
avQALY = ${posAvQALYLower} to ${posAvQALYHigher}

//all again for negatively-affected beings...
negativelyaffectedbeings2 = ${negativelyAffectedBeingsLower} to ${negativelyAffectedBeingsUpper} // This means that you're 90% confident the value is between those two quantities a and b.
beingdiscount2 = ${negativebeingdiscount} //this is a value where 1 is human and 0.1 is a tenth of a human and 10 is ten times, etc
avQALY2 = ${negAvQALYLower} to ${negAvQALYHigher}

scale = positivelyaffectedbeings * beingdiscount * avQALY - negativelyaffectedbeings2 * beingdiscount2 * avQALY2
// ––––––––––––––––––––––––––––––––

// Tractability
//If we doubled the amount of resources allocated to the problem, what percentage of the problem would be solved? 
progressIfResourcesDouble = ${progressifresourcesdoubleLower} to ${progressifresourcesdoubleHigher} //insert range here

tractability = progressIfResourcesDouble * 0.01
// ––––––––––––––––––––––––––––––––

// Neglectedness

//How much total funding (in dollars) is currently being dedicated to solving the problem?
funding = ${fundingLower} to ${fundingHigher}
neglectedness = 1/funding

scale * tractability * neglectedness
  `
}