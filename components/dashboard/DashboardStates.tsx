"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/**
 * Skeleton shaped like the real dashboard rather than a centred spinner, so the
 * page does not jump when data lands.
 */
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-44 rounded-3xl bg-muted/50" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-3xl bg-muted/40" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-72 rounded-3xl bg-muted/40" />
        <div className="h-72 rounded-3xl bg-muted/40" />
      </div>
    </div>
  );
}

/**
 * Load failures get their own state. Most pages in this app swallow the error
 * and render zeros, which looks identical to a genuinely empty account.
 */
export function DashboardError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
      <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-destructive/60" strokeWidth={1.5} />
      </div>
      <div>
        <p className="text-lg font-semibold text-foreground">We couldn&apos;t load your dashboard</p>
        <p className="text-sm text-muted-foreground max-w-sm mt-1">{message}</p>
      </div>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-muted transition"
      >
        <RefreshCw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}

export function EmptyBlock({
  icon: Icon,
  title,
  message,
  action,
}: {
  icon: LucideIcon;
  title: string;
  message: string;
  action?: { label: string; href: string };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-10 text-center"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.7 0.15 210 / 0.12), oklch(0.45 0.22 300 / 0.12))",
        }}
      >
        <Icon className="w-7 h-7 text-primary/50" />
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{message}</p>
      </div>
      {action && (
        <Link
          href={action.href}
          className="mt-1 inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md"
          style={{ background: "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))" }}
        >
          {action.label}
        </Link>
      )}
    </motion.div>
  );
}
