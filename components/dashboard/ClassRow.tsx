"use client";

import React from "react";
import Link from "next/link";
import { Radio, Users, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function timeRange(start: string, end: string): string {
  const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
  return `${new Date(start).toLocaleTimeString([], opts)} – ${new Date(end).toLocaleTimeString([], opts)}`;
}

export default function ClassRow({
  title,
  startTime,
  endTime,
  subtitle,
  isLive,
  href,
  enrolled,
  maxStudents,
}: {
  title: string;
  startTime: string;
  endTime: string;
  subtitle?: string;
  isLive?: boolean;
  href: string;
  enrolled?: number;
  maxStudents?: number | null;
}) {
  const start = new Date(startTime);

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-4 p-3 rounded-2xl border transition-all duration-300",
        isLive
          ? "border-red-500/30 bg-red-500/5 hover:border-red-500/50"
          : "border-border/50 hover:border-primary/30 hover:bg-muted/40",
      )}
    >
      <div className="w-12 shrink-0 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
          {start.toLocaleDateString(undefined, { month: "short" })}
        </p>
        <p className="text-xl font-extrabold leading-none text-foreground">{start.getDate()}</p>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-sm text-foreground truncate">{title}</p>
          {isLive && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500 text-white shrink-0">
              <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {timeRange(startTime, endTime)}
          {subtitle ? ` · ${subtitle}` : ""}
        </p>
      </div>

      {typeof enrolled === "number" && (
        <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground shrink-0">
          <Users className="w-3.5 h-3.5" />
          {enrolled}
          {maxStudents ? `/${maxStudents}` : ""}
        </span>
      )}

      <ChevronRight className="w-4 h-4 text-muted-foreground/50 shrink-0 group-hover:translate-x-0.5 transition-transform" />
    </Link>
  );
}
