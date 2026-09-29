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

function diff(target: number, now: number): Countdown {
  const ms = target - now;
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
 * can tell "no class scheduled" apart from "starting right now". Also null on
 * the very first render: the clock is only read on the client, because a time
 * computed during SSR disagrees with the first client tick and hydration warns.
 */
export function useCountdown(startTime: string | null | undefined): Countdown | null {
  const target = startTime ? new Date(startTime).getTime() : NaN;
  const valid = Number.isFinite(target);

  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!valid) return;

    // The first read is deferred to a frame rather than run inline, so the
    // effect itself never sets state during the commit.
    const frame = requestAnimationFrame(() => setNow(Date.now()));
    const id = setInterval(() => setNow(Date.now()), 1000);

    return () => {
      cancelAnimationFrame(frame);
      clearInterval(id);
    };
  }, [target, valid]);

  if (!valid || now === null) return null;
  return diff(target, now);
}
