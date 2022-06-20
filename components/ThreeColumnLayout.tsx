import clsx from "clsx";
import { useEffect, useState } from "react";

import { CalibrationOptions, QuestionWithComments } from "../types/additional";
import { QuestionDescription } from "./QuestionDescription";
import { Sidebar } from "./Sidebar";
import { VantageSearch } from "./VantageSearch";

export const ThreeColumnLayout = ({
  question,
  right,
}: {
  question: QuestionWithComments;
  right: React.ReactNode;
}) => {
  const [sidebarSelected, setSidebarSelected] = useState<CalibrationOptions>(
    "QuestionDescription"
  );
  useEffect(() => {
    setSidebarSelected("QuestionDescription");
  }, [question]);

  return (
    <>
      {/* 3 column wrapper */}
      <div className="flex-grow w-full max-w-max mx-auto xl:px-8 lg:flex">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 min-w-0 bg-white xl:flex">
          <div className="border-b border-gray-200 xl:border-b-0 xl:flex-shrink-0 xl:w-64 xl:border-r xl:border-gray-200 bg-white">
            <div className="h-full pl-4 pr-6 py-6 sm:pl-6 lg:pl-8 xl:pl-0">
              {/* Start left column area */}
              <div className="sticky top-6">
                <Sidebar
                  selected={sidebarSelected}
                  setSelected={setSidebarSelected}
                />
              </div>
              {/* End left column area */}
            </div>
          </div>

          <div className="bg-white lg:min-w-0 lg:flex-1 ">
            <div className="h-full py-6 px-4 sm:px-6 lg:px-8">
              {/* Start main area*/}
              <div className="max-w-prose">
                <div className="w-[100rem]" />
                <div
                  className={clsx(
                    sidebarSelected !== "QuestionDescription" && "hidden"
                  )}
                >
                  <QuestionDescription question={question} />
                </div>
                <div
                  className={clsx(
                    sidebarSelected !== "VantageSearch" && "hidden"
                  )}
                >
                  <VantageSearch question={question} />
                </div>
              </div>

              {/* End main area */}
            </div>
          </div>
        </div>

        <div className="bg-white pr-4 sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0">
          <div className="h-full pl-6 py-6 lg:w-80">
            {/* Start right column area */}
            <div className="sticky top-6">{right}</div>
            {/* End right column area */}
          </div>
        </div>
      </div>
      {/*
      <div className="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex">
        <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <nav
            aria-label="Sidebar"
            className="sticky top-6 divide-y divide-gray-300"
          >
            <Sidebar
              selected={sidebarSelected}
              setSelected={setSidebarSelected}
            />
          </nav>
        </div>
        <main className="lg:col-span-9 xl:col-span-6">
          <>
            {center[sidebarSelected]}
            <div className="xl:hidden">{right}</div>
          </>
        </main>
        <aside className="hidden xl:block xl:col-span-4">
          <div className="sticky top-6 space-y-4">{right}</div>
        </aside>
      </div>
      */}
    </>
  );
};
