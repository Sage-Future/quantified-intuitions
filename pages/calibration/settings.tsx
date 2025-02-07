import { GetServerSideProps } from "next";
import { auth } from "../../lib/auth";

import { User } from "@prisma/client";

import { Footer } from "../../components/Footer";
import { NavbarCalibration } from "../../components/NavbarCalibration";
import { Settings } from "../../components/Settings";
import { Prisma } from "../../lib/prisma";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth(ctx.req, ctx.res);
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
      <NavbarCalibration />
      <Settings user={user} />
      <Footer />
    </div>
  );
};

export default SettingsPage;
