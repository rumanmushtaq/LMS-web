"use client";

import Image from "next/image";
import Link from "next/link";
import { Radio } from "lucide-react";
import { useLiveTeachers } from "@/hooks/useLiveTeachers";
import JoinLiveButton from "@/components/live/JoinLiveButton";

/**
 * "Live now" at the top of the teachers list: every teacher streaming right
 * now, each with a Join live button. When nobody is live it says so, so
 * students know where streams will show up instead of finding nothing.
 */
export default function LiveNowStrip() {
  const live = [...useLiveTeachers().values()];

  return (
    <section className="mb-6 rounded-2xl border border-border/60 bg-card p-4 sm:p-5 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          {live.length > 0 && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2.5 w-2.5 rounded-full ${live.length > 0 ? "bg-red-500" : "bg-muted-foreground/40"}`}
          />
        </span>
        <h2 className="text-[15px] font-bold text-foreground">Live now</h2>
        {live.length > 0 && (
          <span className="text-[13px] text-muted-foreground">
            {live.length} {live.length === 1 ? "teacher is" : "teachers are"} streaming
          </span>
        )}
      </div>

      {live.length === 0 ? (
        <p className="mt-1.5 text-[13px] text-muted-foreground">
          No teacher is live right now. When one goes live, they appear here with a{" "}
          <span className="font-semibold text-foreground">Join live</span> button.
        </p>
      ) : (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {live.map((s) => (
            <div
              key={s.streamId}
              className="flex min-w-[240px] items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/5 p-3"
            >
              <Link
                href={`/instructors/${s.tutorId}`}
                className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-primary/15 ring-2 ring-red-500"
              >
                {s.tutorPhoto ? (
                  <Image src={s.tutorPhoto} alt={s.tutorName} fill className="object-cover" sizes="44px" />
                ) : (
                  <span className="grid h-full w-full place-items-center text-sm font-bold text-primary">
                    {(s.tutorName || "T").charAt(0)}
                  </span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{s.tutorName || "Teacher"}</p>
                <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
                  <Radio className="h-3 w-3 shrink-0 text-red-500" /> {s.title}
                </p>
              </div>
              <JoinLiveButton stream={s} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
