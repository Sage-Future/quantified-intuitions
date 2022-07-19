import { HeartIcon } from "@heroicons/react/solid";

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 ">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <a
            key={"eaforum"}
            href={"https://forum.effectivealtruism.org/users/sage"}
            className="text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">{"EA Forum"}</span>
            <HeartIcon className="h-6 w-6" aria-hidden="true" />
          </a>
        </div>
        <div className="mt-8 md:mt-0 md:order-1">
          <p className="text-center text-base text-gray-400">
            &copy; 2022 Sage, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
