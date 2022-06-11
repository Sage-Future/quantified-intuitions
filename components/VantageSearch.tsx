import { useState } from "react";
import { useForm } from "react-hook-form";

import { SearchIcon } from "@heroicons/react/solid";
import { Question } from "@prisma/client";

import { dateToObject } from "../lib/services/format";

export const VantageSearch = ({ question }: { question: Question }) => {
  const { register, handleSubmit } = useForm();
  const [results, setResults] = useState<any>();
  const onSubmit = async (data: any) => {
    const dateObj = dateToObject(question.vantageDate);
    const result = await fetch("/api/v0/searchFromDate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: data.search,
        maxMonth: dateObj.month,
        maxDay: dateObj.day,
        maxYear: dateObj.year,
      }),
    }).then(async (res) => {
      const json = await res.json();
      setResults(json);
    });
  };
  return (
    <>
      <div className="flex-1 flex items-center justify-center px-2 ">
        <div className="max-w-lg w-full ">
          <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="search" className="sr-only">
              Search
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </div>
              <input
                id="search"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search"
                type="search"
                {...register("search")}
              />
            </div>
          </form>
        </div>
      </div>
      {results !== undefined && (
        <div className="flow-root mt-6">
          <ul role="list" className="-my-5 divide-y divide-gray-200">
            {results.map((result: any) => (
              <li key={result.position} className="py-5">
                <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {result.displayed_link}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-indigo-600">
                    <a
                      href={result.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:underline focus:outline-none"
                    >
                      <span className="absolute inset-0" aria-hidden="true" />
                      {result.title}
                    </a>
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {result.snippet}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};
