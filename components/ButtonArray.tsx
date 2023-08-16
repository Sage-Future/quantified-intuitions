import clsx from "clsx";
import { ReactNode } from "react";

export const ButtonArray = ({
    options,
    selected,
    setSelected,
    label,
    size = "sm",
}: {
    options: string[];
    selected: string | null;
    setSelected: (confidenceInterval: string) => void;
    label: ReactNode;
    size?: "sm" | "lg" | "xl";
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <span className="mt-1 relative z-0 inline-flex shadow-sm rounded-md">
                {
                    options.map((option, index) =>
                        <button
                            type="button"
                            key={option}
                            onClick={() => setSelected(option)}
                            className={clsx(
                                `relative inline-flex items-center px-4 py-2 border border-gray-300 text-${size} font-medium focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`,
                                selected === option
                                    ? "text-white bg-indigo-700 "
                                    : "text-gray-700 bg-white hover:bg-gray-50",
                                index === 0 && "rounded-l-md",
                                index === options.length - 1 && "rounded-r-md  -ml-px",
                                index !== 0 && index !== options.length - 1 && "rounded-none -ml-px"
                            )}
                        >
                            {option}
                        </button>
                    )}
            </span>
        </div>
    );
}