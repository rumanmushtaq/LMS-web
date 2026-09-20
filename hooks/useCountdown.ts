"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** True once the target time has passed. */
  isPast: boolean;
}

function diff(target: number): Countdown {
  const ms = target - Date.now();
  if (ms <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };

  const totalSeconds = Math.floor(ms / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    isPast: false,
  };
}

/**
 * Ticks once a second toward `startTime`.
 *
 * Returns null for a missing date rather than a zeroed countdown, so callers
 * can tell "no class scheduled" apart from "starting right now".
 */
export function useCountdown(startTime: string | null | undefined): Countdown | null {
  const target = startTime ? new Date(startTime).getTime() : NaN;
  const valid = Number.isFinite(target);

  // Seeded on the client only; computing during render on the server would
  // emit markup that disagrees with the first client tick.
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    if (!valid) {
      setCountdown(null);
      return;
    }

    setCountdown(diff(target));
    const id = setInterval(() => setCountdown(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target, valid]);

  return countdown;
}
