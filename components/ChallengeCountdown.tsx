import { Challenge } from "@prisma/client";
import { useCountdown } from "../lib/services/countdown";

export const ChallengeCountdown = ({
    challenge
}: {
    challenge: Challenge
}) => {
    const { isComplete, seconds, minutes, hours, days } = useCountdown(challenge.endDate);
    return (
        <>
            {isComplete ?
                <h4 className="text-red-500 text-sm">Challenge is finished!</h4>
                :
                <h4 className="text-gray-400 text-sm" suppressHydrationWarning={true}>
                    {days > 0 ? `${days} day,`: ""} {hours}:{minutes}:{seconds} remaining
                </h4>
            }
        </>
    )
}