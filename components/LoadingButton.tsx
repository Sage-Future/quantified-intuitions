import clsx from "clsx";
import { useEffect, useRef } from "react";

export const LoadingButton = ({
  onClick,
  buttonText,
  isLoading,
  loadingText,
  submit,
}: {
  onClick: () => void;
  buttonText: string;
  isLoading: boolean;
  loadingText: string;
  submit?: boolean;
}) => {
  const ref = useRef<HTMLButtonElement | null>(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
    }
  }, []);

  return (
    <div className="sm:col-span-6">
      <button
        ref={ref}
        type={submit ? "submit" : "button"}
        className={clsx(
          "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        )}
        onClick={onClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 -ml-1 mr-3"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            {` ${loadingText}`}
          </>
        ) : (
          <>{buttonText}</>
        )}
      </button>
    </div>
  );
};
