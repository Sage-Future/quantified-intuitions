import { PlayIcon } from "@heroicons/react/24/solid"
import Link from "next/link"
import { Footer } from "../components/Footer"
import { MailingListSignup } from "../components/MailingListSignup"
import { NavbarGeneric } from "../components/NavbarGeneric"

const IndexPage = () => {
  const apps = [
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
      banner: "New",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen ">
      <NavbarGeneric />
      <div className="bg-gray-50 grow">
        <div className="px-4 pt-12 lg:pt-16 mx-auto max-w-7xl">
          <div className="prose mx-auto">
            <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
              Quantified Intuitions
            </h2>
            <h3 className="text-gray-600">Practice assigning credences to outcomes with a quick feedback loop</h3>
          </div>

          <div className="flex flex-wrap gap-2 py-8">
            {apps.map(app => (
              <div key={app.name} className="relative overflow-hidden max-w-xs mx-auto px-8 py-6 bg-white shadow md:rounded-lg prose">
                <h3>{app.name}</h3>
                <p className="text-gray-600">{app.description}</p>
                <Link href={app.href} passHref>
                  <a
                    type="button"
                    className="relative inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 no-underline"
                  >
                    {app.icon}
                    <span>Play</span>
                  </a>
                </Link>
                {app.banner && <div
                  className="absolute top-0 px-8 py-0.5 right-0 text-center bg-indigo-500 text-white origin-bottom-right text-sm text-opacity-80"
                  style={{transform: "translateY(-100%) rotate(90deg) translateX(70.71067811865476%) rotate(-45deg)"}}  
                >
                  {app.banner}
                </div>}
              </div>
            ))}
          </div>

          <div className="max-w-xs mt-12 mb-6 m-auto">
            <MailingListSignup buttonText="Subscribe to hear about our next tool" tags={["homepage"]} />
          </div>
        </div>
      </div>
      <Footer />
    </div >
  )
}

export default IndexPage