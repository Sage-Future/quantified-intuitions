import { XCircleIcon } from "@heroicons/react/24/solid";

export const Errors = ({ errors }: { errors: string[] }) => {
  return (
    <div className="rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <div className="text-sm text-red-700">
              {errors.map((error, idx) => (
                <p key={idx}>{error}</p>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
