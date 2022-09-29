import { GetStaticProps } from "next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Footer } from "../../components/Footer";
import { NavbarCalibration } from "../../components/NavbarCalibration";

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {},
  };
};

const Faq = () => {
  const faqs = [
    {
      question: "What does it mean to be well-calibrated?",
      answer:
        "Someone is well-calibrated if the things they predict with X% chance of happening in fact occur X% of the time. ",
    },
    {
      question: "How does the scoring system work?",
      answer:
        "Interval scoring uses the formula developed by [this paper](https://arxiv.org/abs/1808.07501). The numbers are chosen such that your expected score per question is roughly maximized when you give your true beliefs.",
    },
    {
      question: "How do I know if I'm calibrated?",
      answer:
        "You can look at our [charts](/calibration/charts) to check your calibration curve. If you're well calibrated, the error bars should be overlapping with the red line and your overconfidence/underconfidence should be close to zero.",
    },
    {
      question: "I found an issue with one of the questions!",
      answer:
        "Please leave a comment at our [Airtable](https://airtable.com/invite/l?inviteId=invDBtdXf5X1JQ37j&inviteToken=1df3077d8260ccc0ec28f6a35dbd4fba53b0de2d97ae2c4ee884ed28c5c21f81&utm_medium=email&utm_source=product_team&utm_content=transactional-alerts) or email us at aaron@sage-future.org. ",
    },
    {
      question: "When will feature X be available?",
      answer:
        "We're currently gauging whether our calibration game is a useful addition to the forecasting ecosystem (mostly by usage). If it is, we'll commit to spending more time improving the website and adding more features.",
    },
    {
      question: "How can I submit feedback about the site?",
      answer: "You can email us at aaron@sage-future.org.",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen ">
      <NavbarCalibration />
      <div className="bg-gray-50 grow">
        <div className="max-w-7xl mx-auto py-12 px-4 divide-y divide-gray-200 sm:px-6 lg:py-16 lg:px-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-8">
            <dl className="divide-y divide-gray-200">
              {faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="pt-6 pb-8 md:grid md:grid-cols-12 md:gap-8"
                >
                  <dt className="text-base font-medium text-gray-900 md:col-span-5">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 md:mt-0 md:col-span-7">
                    <div className="text-base text-gray-500 prose">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {faq.answer}
                      </ReactMarkdown>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default Faq;
