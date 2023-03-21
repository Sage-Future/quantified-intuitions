import Image from "next/image"
import Link from "next/link"
import { apps } from ".."
import { AppCard } from "../../components/AppCard"
import { Footer } from "../../components/Footer"
import { MailingListSignup } from "../../components/MailingListSignup"
import { NavbarGeneric } from "../../components/NavbarGeneric"

const IndexPage = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <NavbarGeneric />
      <div className="bg-gray-50 grow">
        <div className="px-4 pt-12 lg:pt-16 mx-auto max-w-6xl">
          <div className="prose mx-auto">
            <h2 className="text-3xl mb-2 font-extrabold text-gray-900">
              Anki with Uncertainty
            </h2>
            <h3 className="text-gray-600">Turn any flashcard deck into a calibration training tool</h3>

            <Image src={"/anki_front.png"} width={700} height={595} />

            <p>{"Instead of the exact answer, enter your 90% confidence interval - an interval that you're 90% confident the answer lies within."}</p>

            <Image src={"/anki_back.png"} width={700} height={595} />

            <p>{"Earn more points for a narrower correct interval, lose more points for a narrower incorrect interval."}</p>

            <p>{"Based on your score, we recommend you press Hard, Good or Easy."}</p>

            <p>{"Higher scores  = longer before you need to review the card again!"}</p>

            <div className="flex justify-center">
              <Image src={"/anki_scores.png"} width={345} height={700} />
            </div>

            <p>{"Track your calibration: press Tools → Show calibration scores. Perfect calibration = your X% confidence interval is correct X% of the time."}</p>

            <h3 className="text-lg font-semibold mt-12">How to use</h3>

            <p>{"1. Open Anki, go to Tools → Addons → Get addons, and paste this code:"} <b>694813595</b></p>

            <p>{"2."} <Link href="Anki_with_uncertainty__example_deck.apkg">{"Download and open the example deck"}</Link>{" to add the Interval card type"}</p>

            <p>{"3. Add some Interval cards:"}</p>

            <div className="flex justify-center">
              <Image src={"/anki_add_card.png"} width={345} height={440} />
            </div>

            <p>You can rate this plugin on <Link href={"https://ankiweb.net/shared/info/694813595"}>AnkiWeb</Link>.</p>
            
            <p> We'd love your feedback at <a href="mailto:hello@sage-future.org">hello@sage-future.org</a>.</p>

            <h3 className="text-lg font-semibold mt-12">More tools from Quantified Intuitions</h3>
            <div className="flex flex-wrap gap-2 py-4">
              {apps.filter(app => app.name !== "Anki with Uncertainty").map(app => <AppCard key={app.name} app={app} />)}
            </div>
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