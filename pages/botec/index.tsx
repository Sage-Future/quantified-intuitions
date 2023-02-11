import { BoltIcon, CogIcon } from "@heroicons/react/24/solid"
import { NextPage } from "next"
import Link from "next/link"
import { Footer } from "../../components/Footer"
import { NavbarGeneric } from "../../components/NavbarGeneric"

const BotecPage: NextPage = () => {

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarGeneric />

      <div className="py-10 bg-gray-100 grow">
        <div className="flex flex-col prose mx-auto gap-10">

          <div className="prose mx-auto">
            <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
              BOTEC database
            </h2>
            <h3 className="text-gray-600">Do a back-of-the-envelope calculation of how impactful work on a problem would be</h3>
          </div>

          <div className="mx-auto flex gap-4">
            <Link href="https://www.guidedtrack.com/programs/34umajb/run" passHref>
              <a
                type="button"
                className="relative max-w-xs inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
              >
                <BoltIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                <span>Use the ITN framework</span>
              </a>
            </Link>

            <Link href="/botec/edit" passHref>
              <a
                type="button"
                className="relative max-w-xs inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
              >
                <CogIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                <span>Start from scratch</span>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
export default BotecPage
