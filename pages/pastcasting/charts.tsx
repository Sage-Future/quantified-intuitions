import { auth } from "../../lib/auth";
import { GetServerSideProps } from 'next';

import { Charts } from "../../components/Charts";
import { Footer } from "../../components/Footer";
import { NavbarPastcasting } from "../../components/NavbarPastcasting";
import { Prisma } from "../../lib/prisma";
import { UserWithPastcastsWithQuestionWithCalibrationAnswers } from "../../types/additional";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await auth(ctx.req, ctx.res);
  if (!session) {
    return { props: {} };
  }
  const user = await Prisma.user.findUnique({
    where: {
      id: session?.user?.id || "",
    },
    include: {
      pastcasts: {
        include: {
          question: true,
        },
      },
      CalibrationAnswer: true,
    },
  });
  return {
    props: {
      session,
      user,
    },
  };
};

const ChartsPage = ({
  user,
}: {
  user: UserWithPastcastsWithQuestionWithCalibrationAnswers;
}) => {
  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarPastcasting />
      <Charts user={user} />
      <Footer />
    </div>
  );
};

export default ChartsPage;
