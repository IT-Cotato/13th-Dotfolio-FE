import { useEffect, useState } from "react";

interface ImmersionTimerProps {
  initialMinutes: number;
}

const formatRemainingTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export function ImmersionTimer({ initialMinutes }: ImmersionTimerProps) {
  const [remainingSeconds, setRemainingSeconds] = useState(
    initialMinutes * 60,
  );

  useEffect(() => {
    const endTime = Date.now() + initialMinutes * 60 * 1000;

    const timerId = window.setInterval(() => {
      const secondsUntilEnd = Math.ceil((endTime - Date.now()) / 1000);

      if (secondsUntilEnd <= 0) {
        window.clearInterval(timerId);
        setRemainingSeconds(0);
        return;
      }

      setRemainingSeconds(secondsUntilEnd);
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [initialMinutes]);

  return (
    <time className="text-title1 text-grey-0" dateTime={`PT${remainingSeconds}S`}>
      {formatRemainingTime(remainingSeconds)}
    </time>
  );
}
