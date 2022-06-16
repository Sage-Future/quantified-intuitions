export const SubmitForm = ({ disabled }: { disabled: boolean }) => {
  return (
    <div className=" sm:col-span-6">
      <div className="flex justify-start">
        <div className="grid grid-cols-2 gap-4">
          <button
            type="submit"
            className=" inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={disabled}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
