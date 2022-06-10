export const SubmitForm = () => {
  return (
    <div className=" sm:col-span-6">
      <div className="flex justify-start">
        <button
          type="submit"
          className=" inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </div>
    </div>
  );
};
