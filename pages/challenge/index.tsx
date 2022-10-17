import { User } from "@prisma/client";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Challenge } from "../../components/Challenge";


import { Footer } from "../../components/Footer";
import { JoinChallenge } from "../../components/JoinChallenge";
import { NavbarChallenge } from "../../components/NavbarChallenge";
import { Prisma } from "../../lib/prisma";
import { ChallengeWithTeamsWithUsers, ChallengeWithTeamsWithUsersAndQuestions } from "../../types/additional";

export const getServerSideProps = async (ctx: any) => {
  const session = await getSession(ctx);
  if (!session) {
    ctx.res.writeHead(302, { Location: "/api/auth/signin" });
    ctx.res.end();
    return { props: {} };
  }
  const userId = session?.user?.id || "";

  const activeChallenges = await Prisma.challenge.findMany({
    where: {
      isDeleted: false,
      startDate: {
        lte: new Date()
      },
      endDate: {
        gte: new Date()
      },
    },
    include: {
      teams: {
        include: {
          users: true
        },
      },
    },
  });
  // const activeChallenges = challenges.filter((challenge) =>
  //   challenge.startDate < new Date() && challenge.endDate > new Date()
  // );
  const participatingInChallenges = activeChallenges.filter(
    challenge => challenge.teams.some(team => team.users.some(user => user.id === userId))
  );

  const userChallenges = participatingInChallenges.length > 0 && await Prisma.challenge.findMany({
    where: {
      id: {
        in: participatingInChallenges.map(challenge => challenge.id)
      }
    },
    include: {
      fermiQuestions: {
        include: {
          teamAnswers: true
        }
      },
      teams: {
        include: {
          users: true
        },
      },
    },
  });

  return {
    props: {
      session,
      activeChallenges,
      userChallenges,
      user: session.user,
    },
  };
};

const ChallengePage = ({
  activeChallenges,
  userChallenges,
  user,
}: {
  activeChallenges: ChallengeWithTeamsWithUsers[];
  userChallenges: ChallengeWithTeamsWithUsersAndQuestions[];
  user: User;
}) => {
  const [currentChallenge, setCurrentChallenge] = useState<{ challengeId: string, teamId: string } | null>(null);

  useEffect(() => {
    if (userChallenges.length === 1) {
      setCurrentChallenge({
        challengeId: userChallenges[0].id,
        teamId: userChallenges[0].teams.find(team => team.users.some(user => user.id === user.id))?.id || ""
      })
    }
  }, [userChallenges]);

  const challenge = currentChallenge && userChallenges.find(c => c.id === currentChallenge.challengeId)

  return (
    <div className="flex flex-col min-h-screen justify-between">
      <NavbarChallenge />
      {
        currentChallenge ?
          challenge ?
          <Challenge 
            challenge={challenge}
            teamId={currentChallenge.teamId}
          />
          :
          <p>Error: challenge not found.</p>
          :
          <JoinChallenge
            activeChallenges={activeChallenges}
            user={user}
            setCurrentChallenge={setCurrentChallenge}
          />
      }
      <Footer />
    </div>
  );
};

export default ChallengePage;