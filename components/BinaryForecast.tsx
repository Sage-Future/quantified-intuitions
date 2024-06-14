import clsx from "clsx";
import { useFormContext } from "react-hook-form";

export const BinaryForecast = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const { register } = useFormContext();
  return (
    <div className="sm:col-span-2 xl:col-span-3">
      <label
        className="block text-gray-700 text-sm font-medium"
        htmlFor="forecast"
      >
        Forecast
      </label>
      <div className="mt-1 relative rounded-md shadow-sm ">
        <input
          type="text"
          id="forecast"
          disabled={disabled}
          className={clsx(
            "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300",
            "shadow-sm  block w-full  sm:text-sm  rounded-md text-right pr-7 disabled:opacity-25 disabled:bg-gray-100"
          )}
          autoComplete="off"
          {...register("binaryProbability")}
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <span className="text-gray-500  sm:text-sm" id="percent">
            %
          </span>
        </div>
      </div>
    </div>
  );
};
