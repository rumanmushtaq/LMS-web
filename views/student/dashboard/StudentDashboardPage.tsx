"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarClock,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Bell,
  CalendarX,
  Hourglass,
  UserCog,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import dashboardService, { type StudentSummary } from "@/services/dashboard";
import DashboardHero, { type HeroClass } from "@/components/dashboard/DashboardHero";
import StatTile from "@/components/dashboard/StatTile";
import SectionCard from "@/components/dashboard/SectionCard";
import ClassRow from "@/components/dashboard/ClassRow";
import {
  DashboardSkeleton,
  DashboardError,
  EmptyBlock,
} from "@/components/dashboard/DashboardStates";

function formatHours(minutes: number): string {
  if (minutes <= 0) return "0h";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h${m ? ` ${m}m` : ""}` : `${m}m`;
}

export default function StudentDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();

  const [summary, setSummary] = useState<StudentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary();
      if (data.role !== "student") {
        router.replace("/instructor/dashboard");
        return;
      }
      setSummary(data);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Something went wrong reaching the server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    // Deciding before the store has rehydrated sends signed-in users to /login.
    if (!hydrated) return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    void load();
  }, [hydrated, isAuthenticated, router, load]);

  if (!hydrated || loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} onRetry={load} />;
  if (!summary) return null;

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const next = summary.nextClasses[0];
  const heroClass: HeroClass | null = next
    ? {
        title: next.title,
        startTime: next.startTime,
        subtitle: next.tutor
          ? `with ${next.tutor.firstName} ${next.tutor.lastName}`.trim()
          : "Your instructor",
        isLive: next.liveStatus === "live" || next.status === "ONGOING",
        joinHref:
          next.liveStatus === "live" || next.status === "ONGOING"
            ? `/student/classes/${next._id}/live`
            : "/student/classes",
      }
    : null;

  const totalUnread = summary.unread.messages + summary.unread.notifications;

  return (
    <div className="space-y-6">
      <DashboardHero
        name={firstName}
        nextClass={heroClass}
        emptyCta={{
          message:
            "You have no classes scheduled yet. Browse our instructors and book your first session.",
          label: "Find an instructor",
          href: "/instructors",
        }}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          index={0}
          label="Upcoming"
          value={summary.classes.upcoming}
          hint={summary.classes.liveNow > 0 ? `${summary.classes.liveNow} live now` : undefined}
          icon={CalendarClock}
          tone="primary"
        />
        <StatTile
          index={1}
          label="Completed"
          value={summary.classes.completed}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatTile
          index={2}
          label="Scheduled hours"
          value={formatHours(summary.scheduledMinutes)}
          hint="Across completed classes"
          icon={Clock}
          tone="violet"
        />
        <StatTile
          index={3}
          label="Materials"
          value={summary.materialsOwned}
          hint="Owned by you"
          icon={FileText}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionCard
            title="Upcoming classes"
            icon={CalendarClock}
            action={{ label: "All classes", href: "/student/classes" }}
          >
            {summary.nextClasses.length === 0 ? (
              <EmptyBlock
                icon={CalendarX}
                title="Nothing scheduled"
                message="Book a class with an instructor and it will show up here."
                action={{ label: "Browse instructors", href: "/instructors" }}
              />
            ) : (
              <div className="space-y-2">
                {summary.nextClasses.map((c) => {
                  const live = c.liveStatus === "live" || c.status === "ONGOING";
                  return (
                    <ClassRow
                      key={c._id}
                      title={c.title}
                      startTime={c.startTime}
                      endTime={c.endTime}
                      subtitle={
                        c.tutor ? `${c.tutor.firstName} ${c.tutor.lastName}`.trim() : undefined
                      }
                      isLive={live}
                      href={live ? `/student/classes/${c._id}/live` : "/student/classes"}
                    />
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Your inbox" icon={Bell}>
            {totalUnread === 0 ? (
              <p className="text-sm text-muted-foreground py-2">
                You&apos;re all caught up. Nothing unread.
              </p>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/chat"
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all"
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Messages
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {summary.unread.messages}
                  </span>
                </Link>
                <Link
                  href="/notifications"
                  className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all"
                >
                  <span className="flex items-center gap-2.5 text-sm font-semibold">
                    <Bell className="w-4 h-4 text-primary" />
                    Notifications
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                    {summary.unread.notifications}
                  </span>
                </Link>
              </div>
            )}
          </SectionCard>

          {summary.classes.pendingApproval > 0 && (
            <SectionCard title="Awaiting approval" icon={Hourglass}>
              <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">
                  {summary.classes.pendingApproval}
                </span>{" "}
                {summary.classes.pendingApproval === 1 ? "request is" : "requests are"} waiting for
                an instructor to respond.
              </p>
            </SectionCard>
          )}

          {summary.profileCompletenessPercent < 100 && (
            <SectionCard title="Complete your profile" icon={UserCog}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Profile strength</span>
                <span className="font-bold text-foreground">
                  {summary.profileCompletenessPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${summary.profileCompletenessPercent}%`,
                    background:
                      "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                  }}
                />
              </div>
              <Link
                href="/student/profile/edit"
                className="mt-4 inline-flex items-center text-xs font-bold text-primary hover:underline"
              >
                Finish your profile
              </Link>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
