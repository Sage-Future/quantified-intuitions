import { GetServerSideProps } from "next";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Errors } from "../../../components/Errors";
import { Footer } from "../../../components/Footer";
import { NavbarPastcasting } from "../../../components/NavbarPastcasting";
import { Success } from "../../../components/Success";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  return {
    props: {
      session,
    },
  };
};

const MultiplayerCreate = () => {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: any) => {
    if (isLoading) return;
    setErrors([]);
    setSuccess("");
    setIsLoading(true);
    let errors: string[] = [];
    if (data.name.length < 3 || data.name.length > 20) {
      errors.push("Name must be between 3 and 20 characters.");
    }
    data.maxSecondsPerQuestion = parseInt(data.maxSecondsPerQuestion);
    if (
      typeof data.maxSecondsPerQuestion !== "number" ||
      data.maxSecondsPerQuestion <= 0 ||
      isNaN(data.maxSecondsPerQuestion)
    ) {
      errors.push("Seconds per question must be a positive integer.");
    }
    data.totalQuestions = parseInt(data.totalQuestions);
    if (
      typeof data.totalQuestions !== "number" ||
      data.totalQuestions <= 0 ||
      isNaN(data.totalQuestions)
    ) {
      errors.push("# of questions must be a positive integer.");
    }
    if (errors.length > 0) {
      setErrors(errors);
      return;
    }

    await fetch("/api/v0/createRoom", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (res.status === 200) {
        const roomId = await res.json();
        router.push(`/multiplayer/${roomId}`);
      } else {
        setErrors(["Error creating room."]);
        setIsLoading(false);
      }
    });
  };
  const { data: session } = useSession();

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarPastcasting />
      <div className="py-10 grow bg-gray-100">
        <main>
          <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8 bg-white shadow md:rounded-lg">
            <form
              className="space-y-8 divide-y divide-gray-200"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-8 divide-y divide-gray-200">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Settings
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Choose settings for your multiplayer game.
                    </p>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Room Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          {...register("name")}
                          defaultValue={`${session?.user.name}'s room` || ""}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="maxSecondsPerQuestion"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Seconds per question
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md"
                          {...register("maxSecondsPerQuestion")}
                          defaultValue={"300"}
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-6">
                      <label
                        htmlFor="totalQuestions"
                        className="block text-sm font-medium text-gray-700"
                      >
                        # of questions
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-auto sm:text-sm border-gray-300 rounded-md"
                          {...register("totalQuestions")}
                          defaultValue={"5"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                {errors.length > 0 && (
                  <div className="pt-5">
                    <Errors errors={errors} />
                  </div>
                )}
                {success !== "" && (
                  <div className="pt-5">
                    <Success message={success} onClose={() => setSuccess("")} />
                  </div>
                )}
                <div className="pt-5">
                  <div className="flex justify-end">
                    {
                      // eslint-disable-next-line @next/next/no-html-link-for-pages
                      <a
                        type="button"
                        href="/pastcasting/multiplayer"
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Back
                      </a>
                    }
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default MultiplayerCreate;
