"use client";

import React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type StatTone = "primary" | "emerald" | "amber" | "violet" | "rose";

/**
 * Tones are Tailwind palette classes rather than theme tokens on purpose:
 * --primary inverts hue between light and dark, so a four-tile row keyed off
 * it would lose its colour separation in one of the two themes.
 */
const TONES: Record<StatTone, { chip: string; icon: string }> = {
  primary: { chip: "bg-primary/10", icon: "text-primary" },
  emerald: { chip: "bg-emerald-500/10", icon: "text-emerald-600 dark:text-emerald-400" },
  amber: { chip: "bg-amber-500/10", icon: "text-amber-600 dark:text-amber-400" },
  violet: { chip: "bg-violet-500/10", icon: "text-violet-600 dark:text-violet-400" },
  rose: { chip: "bg-rose-500/10", icon: "text-rose-600 dark:text-rose-400" },
};

export default function StatTile({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
  index = 0,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: LucideIcon;
  tone?: StatTone;
  index?: number;
}) {
  const t = TONES[tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl p-5 shadow-xl shadow-foreground/5 hover:border-primary/30 transition-colors duration-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/60">
            {label}
          </p>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-foreground truncate">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-muted-foreground truncate">{hint}</p>}
        </div>
        <div className={cn("w-11 h-11 shrink-0 rounded-2xl grid place-items-center", t.chip)}>
          <Icon className={cn("w-5 h-5", t.icon)} />
        </div>
      </div>
    </motion.div>
  );
}
