import { useEffect, useState } from "react";

export const useCountdown = (end: Date) => {
    const [timeLeft, setTimeLeft] = useState(end.getTime() - Date.now());
    useEffect(() => {
        setInterval(() => {
            setTimeLeft(end.getTime() - Date.now());
        }, 1000)
    });

    const isComplete = timeLeft < 0;
    const seconds = Math.floor(timeLeft / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return {
        isComplete,
        seconds: (seconds % 60).toString().padStart(2, "0"),
        minutes: (minutes % 60).toString().padStart(2, "0"),
        hours: (hours % 24).toString().padStart(2, "0"),
        days: days,
    };
}