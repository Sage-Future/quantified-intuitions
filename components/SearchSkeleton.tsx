import clsx from "clsx";

export const SearchSkeleton = ({ num }: { num: number }) => {
  return (
    <>
      {Array.from({ length: num }).map((_, i) => (
        <li className="py-5" key={i}>
          <div className="relative">
            <div className="animate-pulse flex-1 space-y-6 py-1">
              <div className="h-2 bg-slate-200 rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div
                    className={clsx(
                      "h-2 bg-slate-200 rounded",
                      i % 2 === 0 ? "col-span-2" : "col-span-1"
                    )}
                  ></div>
                  <div
                    className={clsx(
                      "h-2 bg-slate-200 rounded",
                      i % 2 === 0 ? "col-span-1" : "col-span-2"
                    )}
                  ></div>
                </div>
                <div className="h-2 bg-slate-200 rounded"></div>
              </div>
            </div>
          </div>
        </li>
      ))}
    </>
  );
};
