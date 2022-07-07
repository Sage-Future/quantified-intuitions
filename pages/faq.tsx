import clsx from "clsx";
import { GetStaticProps } from "next";

import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

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
      question: "I already know the answer to these questions!",
      answer:
        "Unfortunately, we don't have the capacity to manually filter out questions that people already know the answer to. By checking that you have prior knowledge of the question, you can help us improve the quality of our questions.",
    },
    {
      question: "How are pastcasts scored?",
      answer:
        "Pastcasts are scored using log scoring relative to the original crowd forecast at that time, meaning that you will recieve zero points if you submit the same value as the crowd. The scoring rule is also strictly proper, which means that your expected score is maximized if you report your true beliefs.",
    },
    {
      question: "When will feature X be available?",
      answer:
        "We're currently guaging whether pastcasting is a useful addition to the forecasting ecosystem (mostly by usage). If it is, we'll commit to spending more time improving the website and adding more features.",
    },
    {
      question: "How can I submit feedback about the site?",
      answer: "You can email us at aaron@sage-future.org",
    },
  ];
  return (
    <div className="min-h-full">
      <Navbar />
      <div className="bg-gray-50 h-screen">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
            <h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Frequently asked questions
            </h2>
            <dl className="mt-6 space-y-6 divide-y divide-gray-200">
              {faqs.map((faq) => (
                <Disclosure as="div" key={faq.question} className="pt-6">
                  {({ open }) => (
                    <>
                      <dt className="text-lg">
                        <Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
                          <span className="font-medium text-gray-900">
                            {faq.question}
                          </span>
                          <span className="ml-6 h-7 flex items-center">
                            <ChevronDownIcon
                              className={clsx(
                                open ? "-rotate-180" : "rotate-0",
                                "h-6 w-6 transform"
                              )}
                              aria-hidden="true"
                            />
                          </span>
                        </Disclosure.Button>
                      </dt>
                      <Disclosure.Panel as="dd" className="mt-2 pr-12">
                        <p className="text-base text-gray-500">{faq.answer}</p>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Faq;
