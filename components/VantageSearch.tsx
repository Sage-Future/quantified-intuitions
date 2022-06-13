import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { SearchIcon } from "@heroicons/react/solid";
import { Question } from "@prisma/client";

import { dateToObject } from "../lib/services/format";
import { SearchSkeleton } from "./SearchSkeleton";

export const VantageSearch = ({ question }: { question: Question }) => {
  const { register, handleSubmit } = useForm();
  const [results, setResults] = useState<any>();
  const [searching, setSearching] = useState<boolean>(false);
  const onSubmit = async (data: any) => {
    if (searching) return;
    setResults(undefined);
    setSearching(true);
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
      if (res.status === 200) {
        const json = await res.json();
        setResults(json);
      }
      setSearching(false);
    });
  };
  useEffect(() => {
    setResults(undefined);
  }, [question]);
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
      <div className="flow-root mt-6">
        <ul role="list" className="-my-5 divide-y divide-gray-200 ">
          <li className="py-4" />
          {searching && <SearchSkeleton num={5} />}
          {results !== undefined &&
            results.map((result: any) => (
              <li key={result.position} className="py-5">
                <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                  <p className="text-sm text-gray-500 line-clamp-2">
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
    </>
  );
};
