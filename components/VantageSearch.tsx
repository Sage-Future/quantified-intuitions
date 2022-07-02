import clsx from "clsx";
import cuid from "cuid";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

import { Transition } from "@headlessui/react";
import { SearchIcon } from "@heroicons/react/solid";
import { Question, SearchResult } from "@prisma/client";

import { fetcher } from "../lib/services/data";
import { dateMed, dateToObject } from "../lib/services/format";
import { isWaybackUrl } from "../lib/services/validation";
import { SearchSkeleton } from "./SearchSkeleton";
import { Warning } from "./Warning";

export const VantageSearch = ({ question }: { question: Question }) => {
  const { register, handleSubmit, reset } = useForm();
  const [results, setResults] = useState<SearchResult[]>();
  const [searching, setSearching] = useState<boolean>(false);
  const [searchId, setSearchId] = useState<string>("");
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const { data } = useSWR(
    searching ? `/api/v0/searchResults?searchId=${searchId}` : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );
  useEffect(() => {
    if (data !== undefined && data !== null) {
      setResults(data.results);
      if (data.finished) {
        setSearching(false);
      }
    }
  }, [data]);

  const dateObj = dateToObject(question.vantageDate);
  const onSubmit = async (data: any) => {
    //TODO rate limit users
    setResults(undefined);
    setSearching(true);
    setShowWarning(true);
    const newSearchId = cuid();
    setSearchId(newSearchId);
    const result = await fetch("/api/v0/searchFromDate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: data.search,
        searchId: newSearchId,
        maxMonth: dateObj.month,
        maxDay: dateObj.day,
        maxYear: dateObj.year,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        console.log(json);
      } else {
        setSearching(false);
      }
    });
  };
  useEffect(() => {
    setResults(undefined);
    setSearching(false);
    reset({ search: "" });
  }, [question.id]);
  return (
    <>
      <div className="flex-1 flex items-center justify-center px-2 ">
        <div className="grow">
          <div className="prose">
            <h3 className="text-center mb-6">
              <span className="text-gray-500">{`Search the web as of `}</span>
              <span className="">{dateMed(question.vantageDate)}</span>
            </h3>
          </div>
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
                className="block w-full pl-10 pr-16 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Search"
                type="search"
                {...register("search")}
              />
              <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5 z-0">
                <kbd className="inline-flex items-center border border-gray-200 rounded px-2 text-sm font-sans font-medium text-gray-400">
                  Enter
                </kbd>
              </div>
            </div>
          </form>
        </div>
      </div>
      {showWarning && (
        <div className="mt-6">
          <Warning
            message={`Preliminary results are shown in yellow and may leak information about the future. As archived results load, they will be shown in blue.`}
            onClose={() => setShowWarning(false)}
          />
        </div>
      )}
      <div className="flow-root mt-6">
        <ul role="list" className="-my-5 divide-y divide-gray-200 ">
          <li className="py-4" />
          {results !== undefined &&
            results.map((result: any) => (
              <li key={result.position} className="py-5">
                <Transition
                  appear={true}
                  show={true}
                  enter="transition-opacity duration-300 ease-in-out"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="transition-opacity duration-300 ease-in-out"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="relative focus-within:ring-2 focus-within:ring-indigo-500">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {result.displayedLink}
                    </p>
                    <h3
                      className={clsx(
                        "mt-1 text-sm font-semibold",
                        isWaybackUrl(result.link)
                          ? "text-indigo-700"
                          : "text-yellow-700"
                      )}
                    >
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
                </Transition>
              </li>
            ))}
          {searching && (
            <SearchSkeleton
              num={
                results !== undefined && results.length > 0
                  ? Math.max(5 - results.length, 1)
                  : 5
              }
            />
          )}
        </ul>
      </div>
    </>
  );
};
