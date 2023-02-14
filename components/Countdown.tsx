import { useCountdown } from "../lib/services/countdown";

export const Countdown = ({
    countdownToDate,
    completeText,
    tickdownPrefix = "",
    tickdownSuffix = "remaining",
}: {
    countdownToDate: Date
    completeText?: string
    tickdownPrefix?: string
    tickdownSuffix?: string
}) => {
    const { isComplete, seconds, minutes, hours, days } = useCountdown(countdownToDate);
    return (
        <>
            {isComplete ?
                <h4 className="text-red-500 text-sm">{completeText}</h4>
                :
                <h4 className="text-gray-400 text-sm" suppressHydrationWarning={true}>
                    {tickdownPrefix} {days > 0 ? (
                        `${days} day${days > 1 ? "s" : ""},`
                    ): ""} {hours}:{minutes}:{seconds} {tickdownSuffix}
                </h4>
            }
        </>
    )
}