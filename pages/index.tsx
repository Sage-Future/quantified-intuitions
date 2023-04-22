import { PlayIcon } from "@heroicons/react/24/solid"
import { AppCard } from "../components/AppCard"
import { Footer } from "../components/Footer"
import { MailingListSignup } from "../components/MailingListSignup"
import { NavbarGeneric } from "../components/NavbarGeneric"

export const apps = [
  {
    name: "Pastcasting",
    description: "Predict past events to rapidly practise forecasting",
    href: "/pastcasting",
    icon: <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />,
  },
  {
    name: "Calibration",
    description: "Answer trivia questions to calibrate your uncertainty",
    href: "/calibration",
    icon: <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />,
  },
  {
    name: "The Estimation Game",
    description: "Team up with your friends to play our monthly estimation quiz",
    href: "/estimation-game",
    icon: <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />,
  },
  {
    name: "Anki with Uncertainty",
    description: "Turn any flashcard deck into a calibration training tool",
    href: "/anki-with-uncertainty",
    icon: <PlayIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />,
    banner: "New",
  },
]

const IndexPage = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <NavbarGeneric />
      <div className="bg-gray-50 grow">
        <div className="px-4 pt-12 lg:pt-16 mx-auto max-w-6xl">
          <div className="prose mx-auto">
            <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
              Quantified Intuitions
            </h2>
            <h3 className="text-gray-600">Practice assigning credences to outcomes with a quick feedback loop</h3>
          </div>

          <div className="flex flex-wrap gap-2 py-8 gap-y-4 lg:gap-y-8">
            {apps.map(app => <AppCard key={app.name} app={app} />)}
          </div>

          <div className="max-w-xs mt-12 mb-6 m-auto">
            <MailingListSignup buttonText="Subscribe to hear about our next tool" tags={["homepage"]} />
          </div>
        </div>
      </div>
      <Footer showReportProblem={false}/>
    </div >
  )
}

export default IndexPage