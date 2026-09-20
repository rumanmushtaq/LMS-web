"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  CalendarClock,
  Wallet,
  Users,
  Armchair,
  Inbox,
  MessageSquare,
  Bell,
  CalendarX,
  AlertTriangle,
  BarChart3,
  Library,
  Rocket,
} from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { useAuthHydrated } from "@/hooks/useAuthHydrated";
import dashboardService, { type TutorSummary } from "@/services/dashboard";
import DashboardHero, { type HeroClass } from "@/components/dashboard/DashboardHero";
import StatTile from "@/components/dashboard/StatTile";
import SectionCard from "@/components/dashboard/SectionCard";
import ClassRow from "@/components/dashboard/ClassRow";
import {
  DashboardSkeleton,
  DashboardError,
  EmptyBlock,
} from "@/components/dashboard/DashboardStates";

/** The onboarding enum, in the order the backend advances through it. */
const ONBOARDING_STEPS = [
  "signed_up",
  "contract_accepted",
  "tax_selected",
  "tax_submitted",
  "kyc_completed",
  "completed",
] as const;

function formatMoney(minor: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currency || "USD",
      maximumFractionDigits: 0,
    }).format(minor / 100);
  } catch {
    // An unrecognised currency code should not blank the tile.
    return `${(minor / 100).toFixed(2)} ${currency}`;
  }
}

function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m) return month;
  return new Date(y, m - 1, 1).toLocaleDateString(undefined, { month: "short" });
}

export default function InstructorDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const hydrated = useAuthHydrated();

  const [summary, setSummary] = useState<TutorSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await dashboardService.getSummary();
      if (data.role !== "tutor") {
        router.replace("/student/dashboard");
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
    if (!hydrated) return;
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    void load();
  }, [hydrated, isAuthenticated, router, load]);

  const chartData = useMemo(
    () =>
      (summary?.activityByMonth ?? []).map((b) => ({
        name: monthLabel(b.month),
        completed: b.completed,
      })),
    [summary],
  );

  const hasActivity = chartData.some((d) => d.completed > 0);

  if (!hydrated || loading) return <DashboardSkeleton />;
  if (error) return <DashboardError message={error} onRetry={load} />;
  if (!summary) return null;

  const firstName = user?.fullName?.split(" ")[0] || "there";
  const next = summary.nextClasses[0];
  const heroClass: HeroClass | null = next
    ? {
        title: next.title,
        startTime: next.startTime,
        subtitle:
          next.maxStudents != null
            ? `${next.enrolled} of ${next.maxStudents} seats filled`
            : `${next.enrolled} ${next.enrolled === 1 ? "student" : "students"} enrolled`,
        isLive: next.liveStatus === "live" || next.status === "ONGOING",
        joinHref: `/instructor/classes/${next._id}/live`,
      }
    : null;

  const stepIndex = ONBOARDING_STEPS.indexOf(summary.onboarding.step as never);
  const onboardingIncomplete = summary.onboarding.step !== "completed" && stepIndex >= 0;
  const totalUnread = summary.unread.messages + summary.unread.notifications;
  const { missed, limit } = summary.onboarding.strikes;

  return (
    <div className="space-y-6">
      <DashboardHero
        name={firstName}
        nextClass={heroClass}
        emptyCta={{
          message:
            "No classes on your calendar. Schedule one and your students will be notified.",
          label: "Create a class",
          href: "/instructor/classes",
        }}
      />

      {missed > 0 && (
        <div className="flex items-start gap-3 rounded-3xl border border-amber-500/30 bg-amber-500/5 p-5">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="font-bold text-foreground text-sm">
              {missed} missed {missed === 1 ? "class" : "classes"} on record
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Accounts are automatically suspended at {limit}. Start your classes on time to keep
              teaching.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile
          index={0}
          label="Owed to you"
          value={formatMoney(summary.earnings.owedMinor, summary.earnings.currency)}
          hint={`${summary.earnings.paymentCount} settled ${
            summary.earnings.paymentCount === 1 ? "payment" : "payments"
          }`}
          icon={Wallet}
          tone="emerald"
        />
        <StatTile
          index={1}
          label="Upcoming"
          value={summary.classes.upcoming}
          hint={summary.classes.liveNow > 0 ? `${summary.classes.liveNow} live now` : undefined}
          icon={CalendarClock}
          tone="primary"
        />
        <StatTile
          index={2}
          label="Students taught"
          value={summary.students.distinctTotal}
          hint="Unique across your classes"
          icon={Users}
          tone="violet"
        />
        <StatTile
          index={3}
          label="Seats filled"
          value={
            summary.seats.capacity > 0
              ? `${summary.seats.sold}/${summary.seats.capacity}`
              : summary.seats.sold
          }
          hint="Group classes"
          icon={Armchair}
          tone="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {summary.classes.pendingRequests > 0 && (
            <Link
              href="/instructor/class-requests"
              className="group flex items-center gap-4 rounded-3xl border border-primary/30 bg-primary/5 p-5 hover:bg-primary/10 transition-colors"
            >
              <div className="w-11 h-11 rounded-2xl bg-primary/15 grid place-items-center shrink-0">
                <Inbox className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-foreground text-sm">
                  {summary.classes.pendingRequests}{" "}
                  {summary.classes.pendingRequests === 1 ? "request is" : "requests are"} waiting
                  for you
                </p>
                <p className="text-sm text-muted-foreground">
                  Students can&apos;t book until you approve or decline.
                </p>
              </div>
              <span className="text-xs font-bold text-primary shrink-0 group-hover:underline">
                Review
              </span>
            </Link>
          )}

          <SectionCard
            title="Upcoming classes"
            icon={CalendarClock}
            action={{ label: "All classes", href: "/instructor/classes" }}
          >
            {summary.nextClasses.length === 0 ? (
              <EmptyBlock
                icon={CalendarX}
                title="Nothing scheduled"
                message="Create a class and it will appear here for you and your students."
                action={{ label: "Create a class", href: "/instructor/classes" }}
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
                      isLive={live}
                      enrolled={c.enrolled}
                      maxStudents={c.maxStudents}
                      href={`/instructor/classes/${c._id}/live`}
                    />
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard title="Teaching activity" icon={BarChart3}>
            {!hasActivity ? (
              <EmptyBlock
                icon={BarChart3}
                title="No completed classes yet"
                message="Once you finish your first class, your monthly activity shows up here."
              />
            ) : (
              /* currentColor lets the axes and grid follow the theme — this app's
                 --primary changes hue between light and dark, so hardcoded greys
                 (as on the earnings page) disappear in one of them. */
              <div className="h-64 w-full text-muted-foreground">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="dashActivity" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.7 0.15 210)" />
                        <stop offset="100%" stopColor="oklch(0.45 0.22 300)" />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="currentColor"
                      strokeOpacity={0.15}
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                      dy={8}
                    />
                    <YAxis
                      allowDecimals={false}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "currentColor", fontSize: 12 }}
                    />
                    <Tooltip
                      cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--card-foreground)",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value) =>
                        [String(value ?? 0), "Classes completed"] as [string, string]
                      }
                    />
                    <Bar dataKey="completed" fill="url(#dashActivity)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-6">
          {onboardingIncomplete && (
            <SectionCard title="Finish setting up" icon={Rocket}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">
                  Step {stepIndex + 1} of {ONBOARDING_STEPS.length}
                </span>
                <span className="font-bold text-foreground">
                  {Math.round(((stepIndex + 1) / ONBOARDING_STEPS.length) * 100)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${((stepIndex + 1) / ONBOARDING_STEPS.length) * 100}%`,
                    background:
                      "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
                  }}
                />
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Complete onboarding so students can find and book you.
              </p>
            </SectionCard>
          )}

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

          <SectionCard
            title="Your materials"
            icon={Library}
            action={{ label: "Manage", href: "/instructor/materials" }}
          >
            <p className="text-3xl font-extrabold tracking-tight text-foreground">
              {summary.materialsPublished}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {summary.materialsPublished === 1 ? "item published" : "items published"}
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
