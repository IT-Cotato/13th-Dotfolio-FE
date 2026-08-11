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
    const timerId = window.setInterval(() => {
      setRemainingSeconds((seconds) => {
        if (seconds <= 1) {
          window.clearInterval(timerId);
          return 0;
        }

        return seconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <time className="text-title1 text-grey-0" dateTime={`PT${remainingSeconds}S`}>
      {formatRemainingTime(remainingSeconds)}
    </time>
  );
}
