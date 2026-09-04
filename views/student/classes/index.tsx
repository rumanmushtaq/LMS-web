"use client";

import React, { useCallback, useEffect, useState, useMemo } from "react";
import {
  getClasses,
  leaveClass,
  ClassSession,
  ClassStatus,
} from "@/services/classes";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarClock,
  Video,
  Clock,
  User2,
  BookOpen,
  CheckCircle2,
  XCircle,
  Loader2,
  CalendarX,
  AlertCircle,
  Home,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import StudentLayout from "../StudentLayout";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function useCountdown(targetDateStr: string) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    const tick = () => {
      const diff = new Date(targetDateStr).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft("Starting now");
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setTimeLeft(`${d}d ${h}h`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else setTimeLeft(`${m}m`);
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, [targetDateStr]);
  return timeLeft;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  ClassStatus,
  { label: string; color: string; bg: string; icon: React.ElementType }
> = {
  [ClassStatus.PENDING_APPROVAL]: {
    label: "Pending",
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    icon: AlertCircle,
  },
  [ClassStatus.SCHEDULED]: {
    label: "Scheduled",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    icon: CalendarClock,
  },
  [ClassStatus.ONGOING]: {
    label: "Live Now",
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    icon: Video,
  },
  [ClassStatus.COMPLETED]: {
    label: "Completed",
    color: "text-gray-500",
    bg: "bg-gray-50 border-gray-200",
    icon: CheckCircle2,
  },
  [ClassStatus.CANCELLED]: {
    label: "Cancelled",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
  [ClassStatus.MISSED]: {
    label: "Missed",
    color: "text-red-500",
    bg: "bg-red-50 border-red-200",
    icon: AlertCircle,
  },
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: ClassStatus.PENDING_APPROVAL, label: "Pending" },
  { key: ClassStatus.SCHEDULED, label: "Scheduled" },
  { key: ClassStatus.ONGOING, label: "Live" },
  { key: ClassStatus.COMPLETED, label: "Completed" },
  { key: ClassStatus.CANCELLED, label: "Cancelled" },
  { key: ClassStatus.MISSED, label: "Missed" },
] as const;

type FilterKey = (typeof FILTER_TABS)[number]["key"];

// ─── Class Card ───────────────────────────────────────────────────────────────
function ClassCard({
  cls,
  index,
  onLeft,
}: {
  cls: ClassSession;
  index: number;
  onLeft: () => void;
}) {
  const [isLeaving, setIsLeaving] = useState(false);
  const cfg = STATUS_CONFIG[cls.status] ?? STATUS_CONFIG[ClassStatus.SCHEDULED];
  const StatusIcon = cfg.icon;
  const countdown = useCountdown(cls.startTime);
  const isUpcoming =
    cls.status === ClassStatus.SCHEDULED || cls.status === ClassStatus.ONGOING;
  const isCancelled = cls.status === ClassStatus.CANCELLED;
  const isGroup = cls.visibility === "group";

  /**
   * Leaving frees the seat for someone else and permanently bars this student
   * from the class, so it is confirmed before anything is sent.
   */
  const handleLeave = async () => {
    const ok = window.confirm(
      `Leave "${cls.title}"?\n\n` +
        "Your seat will be given up and you will NOT be able to join this " +
        "class again. This cannot be undone.",
    );
    if (!ok) return;

    setIsLeaving(true);
    try {
      await leaveClass(cls._id);
      toast.success("You have left the class.");
      onLeft();
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message || "Could not leave the class.",
      );
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className={cn(
        "rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group",
        isCancelled && "opacity-70"
      )}
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: isUpcoming
            ? "linear-gradient(90deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))"
            : isCancelled
            ? "linear-gradient(90deg, #ef4444, #f97316)"
            : cls.status === ClassStatus.COMPLETED
            ? "linear-gradient(90deg, #6b7280, #9ca3af)"
            : "linear-gradient(90deg, #f59e0b, #f97316)",
        }}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-foreground text-base leading-tight flex-1 min-w-0 truncate group-hover:text-primary transition-colors">
            {cls.title}
          </h3>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border shrink-0",
              cfg.color,
              cfg.bg
            )}
          >
            <StatusIcon size={11} />
            {cfg.label}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {cls.description}
        </p>

        {/* Meta */}
        <div className="flex flex-col gap-2 text-xs text-muted-foreground">
          {/* Instructor */}
          <div className="flex items-center gap-2">
            <User2 size={13} className="shrink-0 text-primary/70" />
            <span>
              {cls.tutorId?.firstName} {cls.tutorId?.lastName}
            </span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2">
            <Clock size={13} className="shrink-0 text-primary/70" />
            <span>{formatDateTime(cls.startTime)}</span>
          </div>
        </div>

        {/* Countdown chip (upcoming only) */}
        {isUpcoming && countdown && (
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <CalendarClock size={11} />
            Starts in {countdown}
          </div>
        )}

        {/* Decline reason */}
        {isCancelled && cls.declineReason && (
          <div className="mt-3 text-xs text-muted-foreground bg-muted/60 rounded-xl px-3 py-2">
            <span className="font-semibold">Reason: </span>
            {cls.declineReason}
          </div>
        )}

        {/* Live class room (Vimeo broadcast + Q&A) */}
        {isUpcoming && (
          <Link
            href={`/student/classes/${cls._id}/live`}
            id={`join-class-${cls._id}`}
            className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] active:scale-95"
            style={{
              background:
                cls.status === ClassStatus.ONGOING
                  ? "linear-gradient(135deg, #ef4444, #f97316)"
                  : "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
            }}
          >
            <Video size={15} />
            {cls.status === ClassStatus.ONGOING ? "Join Live Class" : "Enter Class Room"}
          </Link>
        )}

        {/* External meeting link (Zoom/Meet), if the tutor set one */}
        {cls.meetingLink && cls.status !== ClassStatus.CANCELLED && (
          <a
            href={cls.meetingLink}
            target="_blank"
            rel="noreferrer"
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium text-primary border border-primary/30 hover:bg-primary/5 transition-colors"
          >
            <Video size={13} />
            Open external meeting link
          </a>
        )}

        {/* Group classes can be left; a 1-to-1 class is cancelled, not left. */}
        {isGroup && isUpcoming && (
          <button
            onClick={handleLeave}
            disabled={isLeaving}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium text-destructive border border-destructive/30 hover:bg-destructive/5 disabled:opacity-50 transition-colors"
          >
            {isLeaving ? (
              <Loader2 size={13} className="animate-spin" />
            ) : (
              <LogOut size={13} />
            )}
            {isLeaving ? "Leaving…" : "Leave this class"}
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StudentClasses() {
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");

  const loadClasses = useCallback(() => {
    return getClasses()
      .then((data: any) => setClasses(Array.isArray(data) ? data : data?.data ?? []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadClasses();
  }, [loadClasses]);

  const filtered = useMemo(() => {
    if (activeFilter === "all") return classes;
    return classes.filter((c) => c.status === activeFilter);
  }, [classes, activeFilter]);

  const counts = useMemo(() => {
    const map: Record<string, number> = { all: classes.length };
    FILTER_TABS.forEach((t) => {
      if (t.key !== "all")
        map[t.key] = classes.filter((c) => c.status === t.key).length;
    });
    return map;
  }, [classes]);

  return (
    <>
      {/* Breadcrumb hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-rose-50 via-white to-blue-50 dark:from-rose-950/20 dark:via-background dark:to-blue-950/20 border-b border-border/50">
        <div className="container mx-auto px-6 py-10 text-center relative">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
            My Classes
          </h1>
          <nav className="flex items-center justify-center gap-2 text-[14px] text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-foreground">
              <Home className="h-3.5 w-3.5" /> Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--primary)]" />
            <span className="text-foreground font-medium">My Classes</span>
          </nav>
        </div>
      </section>

      <StudentLayout>
        <div className="space-y-6">
      {/* Page Header */}
      <div
        className="rounded-2xl overflow-hidden p-6 relative"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 50%, oklch(0.7 0.15 210) 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-1/3 w-20 h-20 rounded-full bg-white/5" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">My Classes</h1>
            <p className="text-white/70 text-sm mt-0.5">
              {classes.length} class{classes.length !== 1 ? "es" : ""} total
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            id={`filter-${tab.key}`}
            onClick={() => setActiveFilter(tab.key)}
            className={cn(
              "inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all",
              activeFilter === tab.key
                ? "text-white border-transparent shadow-md"
                : "bg-card text-muted-foreground border-border hover:bg-muted"
            )}
            style={
              activeFilter === tab.key
                ? {
                    background:
                      "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                  }
                : {}
            }
          >
            {tab.label}
            {counts[tab.key] > 0 && (
              <span
                className={cn(
                  "text-xs px-1.5 py-0.5 rounded-full font-bold",
                  activeFilter === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4 py-20 text-center"
        >
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.7 0.15 210 / 0.12), oklch(0.45 0.22 300 / 0.12))",
            }}
          >
            <CalendarX className="w-8 h-8 text-primary/50" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">No classes found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-xs">
              {activeFilter === "all"
                ? "Visit an instructor's profile and click 'Book a Class' to get started."
                : `No ${activeFilter.toLowerCase().replace("_", " ")} classes to show.`}
            </p>
          </div>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {filtered.map((cls, i) => (
              <ClassCard
                key={cls._id}
                cls={cls}
                index={i}
                onLeft={loadClasses}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
        </div>
      </StudentLayout>
    </>
  );
}
