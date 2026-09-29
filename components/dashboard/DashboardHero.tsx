"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, CalendarClock, ArrowRight, Sparkles } from "lucide-react";
import { useCountdown } from "@/hooks/useCountdown";

/** The app's signature banner gradient, written inline like the profile page. */
const BRAND_GRADIENT =
  "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 60%, oklch(0.7 0.15 210) 100%)";

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm text-center min-w-[58px]">
      <p className="text-xl font-extrabold tabular-nums leading-none">
        {String(value).padStart(2, "0")}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mt-1">{label}</p>
    </div>
  );
}

export interface HeroClass {
  title: string;
  startTime: string;
  /** Tutor name for a student, enrolled count for a tutor. */
  subtitle: string;
  isLive: boolean;
  joinHref: string;
}

export default function DashboardHero({
  name,
  nextClass,
  emptyCta,
}: {
  name: string;
  nextClass: HeroClass | null;
  emptyCta: { message: string; label: string; href: string };
}) {
  const countdown = useCountdown(nextClass?.startTime);

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl p-6 sm:p-8 shadow-xl text-white"
      style={{ background: BRAND_GRADIENT }}
    >
      <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 right-24 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />

      <div className="relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting()}, {name}
          </h1>

          {nextClass ? (
            <div className="mt-5">
              <div className="flex items-center gap-2">
                {nextClass.isLive ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-500 text-white">
                    <Radio className="w-3 h-3 animate-pulse" /> LIVE NOW
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/15 border border-white/15 text-white/90">
                    <CalendarClock className="w-3 h-3" /> NEXT CLASS
                  </span>
                )}
              </div>
              <p className="mt-2.5 text-lg font-bold truncate">{nextClass.title}</p>
              <p className="text-sm text-white/70 truncate">{nextClass.subtitle}</p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-white/75 max-w-md">{emptyCta.message}</p>
          )}
        </div>

        <div className="shrink-0">
          {nextClass ? (
            <div className="flex flex-col items-start lg:items-end gap-3">
              {/* countdown is null on the first render and once the start time passes */}
              {!nextClass.isLive && countdown && !countdown.isPast && (
                <div className="flex gap-2">
                  {countdown.days > 0 && <Unit value={countdown.days} label="days" />}
                  <Unit value={countdown.hours} label="hrs" />
                  <Unit value={countdown.minutes} label="min" />
                  {countdown.days === 0 && <Unit value={countdown.seconds} label="sec" />}
                </div>
              )}
              <Link
                href={nextClass.joinHref}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-[oklch(0.35_0.08_275)] hover:bg-white/90 transition shadow-lg"
              >
                {nextClass.isLive ? "Join now" : "View class"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <Link
              href={emptyCta.href}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-white text-[oklch(0.35_0.08_275)] hover:bg-white/90 transition shadow-lg"
            >
              <Sparkles className="w-4 h-4" />
              {emptyCta.label}
            </Link>
          )}
        </div>
      </div>
    </motion.section>
  );
}
