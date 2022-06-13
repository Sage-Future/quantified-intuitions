export const SubmitForm = ({ skipQuestion }: { skipQuestion: () => void }) => {
  return (
    <div className=" sm:col-span-6">
      <div className="flex justify-start">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            className=" inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
          <button
            type="button"
            className="inline-flex justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={skipQuestion}
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};
