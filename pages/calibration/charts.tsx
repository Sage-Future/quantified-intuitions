import { GetServerSideProps } from 'next';
import { auth } from '../../lib/auth';

import { Charts } from '../../components/Charts';
import { Footer } from '../../components/Footer';
import { NavbarCalibration } from '../../components/NavbarCalibration';
import { Prisma } from '../../lib/prisma';
import { UserWithPastcastsWithQuestionWithCalibrationAnswers } from '../../types/additional';

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
      CalibrationAnswer: {
        include: {
          question: true,
        },
      },
    },
  });
  user?.pastcasts.filter((pastcast) => pastcast.question.isDeleted === false);
  user?.CalibrationAnswer.filter(
    (answer) => answer.question.isDeleted === false && answer.question.challengeOnly === false
  );
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
      <NavbarCalibration />
      <Charts user={user} />
      <Footer />
    </div>
  );
};

export default ChartsPage;
