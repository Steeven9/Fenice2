"use client";

import { useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";

let COUNTDOWN_FROM: string;
const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

interface Props {
  targetDate: string;
}

// https://www.hover.dev/components/countdown

export default function Countdown({ targetDate }: Readonly<Props>) {
  COUNTDOWN_FROM = targetDate;
  return (
    <div className="mx-auto mb-2 flex w-full max-w-5xl items-center bg-white">
      <CountdownItem unit="Day" text="days" />
      <CountdownItem unit="Hour" text="hours" />
      <CountdownItem unit="Minute" text="minutes" />
      <CountdownItem unit="Second" text="seconds" />
    </div>
  );
}

interface CountdownItemProps {
  unit: string;
  text: string;
}

const CountdownItem = ({ unit, text }: CountdownItemProps) => {
  const { ref, time } = useTimer(unit);

  return (
    <div className="flex h-24 w-1/4 flex-col items-center justify-center gap-1 border-r-[1px] border-slate-200 font-mono md:h-36 md:gap-2">
      <div className="relative w-full overflow-hidden text-center">
        <span
          ref={ref}
          className="block text-2xl font-medium text-black md:text-4xl lg:text-6xl xl:text-7xl"
        >
          {time}
        </span>
      </div>
      <span className="text-xs font-light text-slate-500 md:text-sm lg:text-base">
        {text}
      </span>
    </div>
  );
};

const useTimer = (unit: string) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef<any>(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 1000);

    return () => clearInterval(intervalRef.current ?? undefined);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === "Day") {
      newTime = Math.floor(distance / DAY);
    } else if (unit === "Hour") {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === "Minute") {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ["0%", "-50%"], opacity: [1, 0] },
        { duration: 0.35 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ["50%", "0%"], opacity: [0, 1] },
        { duration: 0.35 }
      );
    }
  };

  return { ref, time };
};
