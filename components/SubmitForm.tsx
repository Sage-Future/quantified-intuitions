import clsx from "clsx";

export const SubmitForm = ({
  disabled,
  isLoading,
}: {
  disabled: boolean;
  isLoading: boolean;
}) => {
  return (
    <div className=" sm:col-span-6">
      <div className="flex justify-start">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            className={clsx(
              " inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
              disabled && "disabled:opacity-50"
            )}
            disabled={disabled}
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
                {" Loading "}
              </>
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
