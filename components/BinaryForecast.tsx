import clsx from "clsx";
import { useFormContext } from "react-hook-form";

import { isValidBinaryForecast } from "../lib/services/validation";

export const BinaryForecast = () => {
  const { register, watch } = useFormContext();
  const forecast = watch("binaryProbability");
  return (
    <div className="sm:col-span-1">
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
          className={clsx(
            isValidBinaryForecast(forecast) || forecast === ""
              ? "focus:ring-indigo-500 focus:border-indigo-500"
              : "focus:ring-red-500 focus:border-red-500",
            "shadow-sm  block w-full  sm:text-sm border-gray-300 rounded-md text-right pr-7"
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
