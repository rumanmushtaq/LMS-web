"use client";

import React from "react";
import Link from "next/link";
import { Bell, MessageSquare } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import SectionCard from "./SectionCard";
import type { UnreadCounts } from "@/services/dashboard";

function Row({
  icon: Icon,
  label,
  count,
  href,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-border/50 hover:border-primary/30 hover:bg-muted/40 transition-all"
    >
      <span className="flex items-center gap-2.5 text-sm font-semibold">
        <Icon className="w-4 h-4 text-primary" />
        {label}
      </span>
      <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-bold">
        {count}
      </span>
    </Link>
  );
}

/**
 * Only rows with something unread are shown — a badge reading "0" is noise,
 * and the whole card collapses to a single caught-up line when both are clear.
 */
export default function UnreadInbox({ unread }: { unread: UnreadCounts }) {
  const nothing = unread.messages === 0 && unread.notifications === 0;

  return (
    <SectionCard title="Your inbox" icon={Bell}>
      {nothing ? (
        <p className="text-sm text-muted-foreground py-2">
          You&apos;re all caught up. Nothing unread.
        </p>
      ) : (
        <div className="space-y-2">
          {unread.messages > 0 && (
            <Row icon={MessageSquare} label="Messages" count={unread.messages} href="/chat" />
          )}
          {unread.notifications > 0 && (
            <Row
              icon={Bell}
              label="Notifications"
              count={unread.notifications}
              href="/notifications"
            />
          )}
        </div>
      )}
    </SectionCard>
  );
}
