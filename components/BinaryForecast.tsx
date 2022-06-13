import clsx from "clsx";
import { useFormContext } from "react-hook-form";

import { isValidBinaryForecast } from "../lib/services/validation";

export const BinaryForecast = ({
  disabled = false,
}: {
  disabled?: boolean;
}) => {
  const { register, watch } = useFormContext();
  const forecast = watch("binaryProbability");
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
            forecast === "" || forecast === undefined
              ? "focus:ring-indigo-500 focus:border-indigo-500 border-gray-300"
              : isValidBinaryForecast(forecast)
              ? "ring-green-500 border-green-500 focus:ring-green-500 focus:border-green-500"
              : "ring-red-500 border-red-500 focus:ring-red-500 focus:border-red-500",
            "shadow-sm  block w-full  sm:text-sm  rounded-md text-right pr-7 disabled:opacity-25 disabled:bg-gray-100"
          )}
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
