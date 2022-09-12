import { GetStaticProps } from "next";

import { Footer } from "../components/Footer";
import { Navbar } from "../components/Navbar";

export const getStaticProps: GetStaticProps = async (ctx) => {
  return {
    props: {},
  };
};

const Faq = () => {
  const faqs = [
    {
      question: "What is pastcasting?",
      answer:
        "Pastcasting is the practice of forecasting on a question that has already happened, from a vantage point further in the past.",
    },
    {
      question: "Why should I pastcast?",
      answer:
        "Unlike forecasting, pastcasting allows for quick feedback even on questions that were open for a long time, which might be systematically different than questions with shorter time horizons. Unlike calibration training, it also tests relevant forecasting skills (trend extrapolation, investigating different views, and determining trustworthiness of news sources).",
    },
    {
      question: "What is Vantage Search?",
      answer:
        "Vantage Search is a custom search engine that only shows results from before the vantage point to prevent information leaks from the future.",
    },
    {
      question: "Why is Vantage Search so slow?",
      answer:
        "Preliminary results should be available within a few seconds. If you're experiencing a much longer delay, please check your adblocker and/or VPN. Archived results take much longer to load due to rate limiting by the Wayback Machine API.",
    },
    {
      question: "Where do these questions come from?",
      answer:
        "We use already resolved Metaculus and Good Judgement Open questions as sources. We provide a link to the original question page after submitting a pastcast.",
    },
    {
      question: "I already know the answer to these questions!",
      answer:
        "By checking that you have prior knowledge of the question, you can help us improve the quality of our questions for future users.",
    },
    {
      question: "How are pastcasts scored?",
      answer:
        "Pastcasts are scored using log scoring relative to the original crowd forecast at that time, meaning that you will recieve zero points if you submit the same value as the crowd. The scoring rule is also strictly proper, which means that your expected score is maximized if you report your true beliefs.",
    },
    {
      question: "When will feature X be available?",
      answer:
        "We're currently gauging whether pastcasting is a useful addition to the forecasting ecosystem (mostly by usage). If it is, we'll commit to spending more time improving the website and adding more features.",
    },
    {
      question: "How can I submit feedback about the site?",
      answer: "You can email us at aaron@sage-future.org",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <Navbar />
      <div className="bg-gray-50">
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
                    <p className="text-base text-gray-500">{faq.answer}</p>
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
