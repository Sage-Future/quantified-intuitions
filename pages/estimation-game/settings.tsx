import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import { User } from "@prisma/client";

import { Footer } from "../../components/Footer";
import { NavbarChallenge } from "../../components/NavbarChallenge";
import { Settings } from "../../components/Settings";
import { Prisma } from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  if (!session) {
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

const SettingsPage = ({ user }: { user: User }) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
      <Settings user={user} />
      <Footer />
    </div>
  );
};

export default SettingsPage;