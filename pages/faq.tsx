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
        "Pastcasting allows users to get quick feedback on their forecasting skills, even on questions that were open for a long time, which might be systematically different than questions with shorter time horizons.",
    },
    {
      question: "How are pastcasts scored?",
      answer:
        "Pastcasts are scored using log scoring relative to the original crowd forecast at that time.",
    },
    {
      question: "How do I use this site to pastcast?",
      answer:
        "You can create pastcasts by viewing questions from our homepage, forming a forecast using information from the question and the vantage search, and then submitting your forecast in the form provided. After submitting your pastcast, you'll be able to immediately view the result of the question and how you did relative to the crowd forecast.",
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
