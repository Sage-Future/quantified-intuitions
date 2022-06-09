import { signIn, signOut, useSession } from "next-auth/react";

import type { NextPage } from "next";
const Home: NextPage = () => {
  //get user session
  const { data: session } = useSession();
  return (
    <>
      {session ? (
        <button
          onClick={() => {
            signOut();
          }}
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => {
            signIn();
          }}
        >
          Sign In
        </button>
      )}
      <p>{session?.user?.name}</p>
    </>
  );
};

export default Home;
