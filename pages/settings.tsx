import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { User } from "@prisma/client";

import { Errors } from "../components/Errors";
import { Navbar } from "../components/Navbar";
import { Success } from "../components/Success";
import { Prisma } from "../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const user = await Prisma.user.findUnique({
    where: {
      id: session?.user?.id || "",
    },
  });
  return {
    props: {
      session,
      user,
    },
  };
};

const Settings = ({ user }: { user: User }) => {
  const { register, handleSubmit } = useForm();
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string>("");
  const onSubmit = async (data: any) => {
    console.log(data);
    setErrors([]);
    setSuccess("");
    //username must only contain letters, numbers, and spaces and cannot only be spaces
    if (
      data.username.length < 3 ||
      data.username.length > 20 ||
      !/^[a-zA-Z0-9 ]*$/.test(data.username)
    ) {
      setErrors([
        "Username must be between 3 and 20 characters and only contain letters, numbers, and spaces.",
      ]);
      return;
    }
    await fetch("/api/v0/updateSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
      }),
    }).then(async (res) => {
      if (res.status === 200) {
        const json = await res.json();
        console.log(json);
        setSuccess("Settings updated");
      } else {
        setErrors(["There was an error updating your settings"]);
      }
    });
  };

  return (
    <div className="min-h-full">
      <Navbar />
      <div className="py-0">
        <main>
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
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
                        Manage your account.
                      </p>
                    </div>
                    <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label
                          htmlFor="username"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Username
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                            {...register("username")}
                            defaultValue={user.name || ""}
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
                      <Success
                        message={success}
                        onClose={() => setSuccess("")}
                      />
                    </div>
                  )}
                  <div className="pt-5">
                    <div className="flex justify-end">
                      {
                        // eslint-disable-next-line @next/next/no-html-link-for-pages
                        <a
                          type="button"
                          href="/"
                          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </a>
                      }
                      <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Settings;
