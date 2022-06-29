import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

import { ChartBarIcon, DocumentReportIcon, SearchIcon } from "@heroicons/react/outline";

import { CalibrationOptions } from "../types/additional";

export const Sidebar = ({
  selected,
  setSelected,
  showScores,
}: {
  selected: string;
  setSelected: Dispatch<SetStateAction<CalibrationOptions>>;
  showScores: boolean;
}) => {
  let navigation = [
    /*
    { name: "Dashboard", icon: HomeIcon, href: "#", current: true },
    { name: "Team", icon: UsersIcon, href: "#", current: false },
    { name: "Projects", icon: FolderIcon, href: "#", current: false },
    { name: "Calendar", icon: CalendarIcon, href: "#", current: false },
    { name: "Documents", icon: InboxIcon, href: "#", current: false },
    { name: "Reports", icon: ChartBarIcon, href: "#", current: false },
    */
    {
      name: "Question",
      icon: DocumentReportIcon,
      onClick: () => setSelected("QuestionDescription"),
      current: selected === "QuestionDescription",
    },
    {
      name: "Vantage Search",
      icon: SearchIcon,
      onClick: () => setSelected("VantageSearch"),
      current: selected === "VantageSearch",
    },
  ];
  if (showScores) {
    navigation.push({
      name: "Scores",
      icon: ChartBarIcon,
      onClick: () => setSelected("Scores"),
      current: selected === "Scores",
    });
  }

  return (
    <nav className="flex-1 bg-white space-y-1" aria-label="Sidebar">
      {navigation.map((item) => (
        <button
          key={item.name}
          className={clsx(
            item.current
              ? "bg-gray-100 text-gray-900"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
            "group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full"
          )}
          onClick={item.onClick}
        >
          <item.icon
            className={clsx(
              item.current
                ? "text-gray-500"
                : "text-gray-400 group-hover:text-gray-500",
              "flex-shrink-0 -ml-1 mr-3 h-6 w-6"
            )}
            aria-hidden="true"
          />
          <span className="truncate">{item.name}</span>
        </button>
      ))}
    </nav>
  );
};
