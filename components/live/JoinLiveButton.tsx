"use client";

import Link from "next/link";
import { Radio } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import type { LiveTeacher } from "@/services/teacherStreams";

/** Red "LIVE" pill for a teacher's avatar while they are streaming. */
export function LiveBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-bold tracking-wide text-white shadow ${className}`}
    >
      <Radio className="h-3 w-3 animate-pulse" /> LIVE
    </span>
  );
}

/**
 * "Join live" for a teacher who is streaming. Only students can join, so the
 * button follows the viewer: students go to the stream, signed-out visitors
 * to login first, the teacher to their own broadcast page, and any other
 * teacher or admin sees a plain "Live now" (the API refuses them anyway).
 */
export default function JoinLiveButton({
  stream,
  size = "sm",
  className = "",
}: {
  stream: LiveTeacher;
  size?: "sm" | "lg";
  className?: string;
}) {
  const user = useAuthStore((s) => s.user);
  const isAuthed = useAuthStore((s) => !!s.accessToken);

  const watchUrl = `/student/live/${stream.streamId}`;
  const sizing =
    size === "lg" ? "px-5 py-2.5 text-sm" : "px-3 py-1.5 text-[12px]";
  const base = `inline-flex items-center justify-center gap-1.5 rounded-xl font-bold text-white ${sizing} ${className}`;

  if (isAuthed && user?.role !== "student") {
    if (user?.id === stream.tutorId) {
      return (
        <Link href="/instructor/live" className={`${base} bg-red-500 hover:bg-red-600`}>
          <Radio className="h-3.5 w-3.5 animate-pulse" /> You&apos;re live
        </Link>
      );
    }
    return (
      <span
        className={`${base} bg-red-500/70 cursor-default`}
        title="Only students can join a teacher's live stream"
      >
        <Radio className="h-3.5 w-3.5 animate-pulse" /> Live now
      </span>
    );
  }

  const href = isAuthed ? watchUrl : `/login?redirect=${encodeURIComponent(watchUrl)}`;
  return (
    <Link href={href} className={`${base} bg-red-500 hover:bg-red-600`}>
      <Radio className="h-3.5 w-3.5 animate-pulse" /> Join live
    </Link>
  );
}
