"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SectionCard({
  title,
  icon: Icon,
  action,
  children,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  action?: { label: string; href: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "bg-card/60 backdrop-blur-xl border border-border/50 rounded-3xl shadow-xl shadow-foreground/5 overflow-hidden",
        className,
      )}
    >
      <header className="flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b border-border/50">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && <Icon className="w-4 h-4 text-primary shrink-0" />}
          <h2 className="font-bold text-foreground truncate">{title}</h2>
        </div>
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:gap-2 transition-all shrink-0"
          >
            {action.label}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </header>
      <div className="p-5 sm:p-6">{children}</div>
    </section>
  );
}
