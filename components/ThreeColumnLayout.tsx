import { useEffect, useState } from "react";

import { Question } from "@prisma/client";

import { CalibrationOptions } from "../types/additional";
import { Sidebar } from "./Sidebar";

export const ThreeColumnLayout = ({
  question,
  center,
  right,
}: {
  question: Question;
  center: { [key: string]: React.ReactNode };
  right: React.ReactNode;
}) => {
  const [sidebarSelected, setSidebarSelected] = useState<CalibrationOptions>(
    "QuestionDescription"
  );
  useEffect(() => {
    setSidebarSelected("QuestionDescription");
  }, [question]);

  return (
    <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
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
  );
};
