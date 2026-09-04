"use client";

import React, { useEffect, useState } from "react";

/** "2d 3h 5m" far out; "1:04:09" under a day; "12:41" under an hour. */
const format = (ms: number): string => {
  const total = Math.floor(ms / 1000);
  const days = Math.floor(total / 86_400);
  const hours = Math.floor((total % 86_400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  const hh = hours > 0 ? `${hours}:` : "";
  const mm = hours > 0 ? String(minutes).padStart(2, "0") : String(minutes);
  return `${hh}${mm}:${String(seconds).padStart(2, "0")}`;
};

/**
 * Ticking countdown to a class's start time. Once the moment passes it
 * renders `fallback` instead (e.g. "the instructor hasn't started yet"),
 * flipping automatically without a refresh.
 */
export default function ClassCountdown({
  startTime,
  label,
  className,
  fallback,
}: {
  startTime: string | Date;
  label?: string;
  className?: string;
  fallback?: React.ReactNode;
}) {
  // Tick a clock and derive the remainder in render — the target can change
  // without touching the timer, and no state is set synchronously in effects.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const target = new Date(startTime).getTime();
  if (!Number.isFinite(target)) return null;
  const ms = Math.max(0, target - now);
  if (ms <= 0) return <>{fallback ?? null}</>;

  return (
    <span className={className}>
      {label ? <span className="mr-2 opacity-70">{label}</span> : null}
      <span className="tabular-nums">{format(ms)}</span>
    </span>
  );
}
