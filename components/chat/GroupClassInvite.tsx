"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, CalendarDays, Clock3, Loader2 } from "lucide-react";
import { GroupClassPreview, getGroupClassInvite } from "@/services/classes";
import { formatDuration, formatMoney, formatWhen } from "@/lib/format";

/**
 * A group-class invite pasted into chat.
 *
 * The tutor shares a bare URL, which reads as noise in a message bubble. This
 * turns it into the offer: what the class is, when it runs, how many seats are
 * left and what one costs — enough for the student to decide without leaving
 * the conversation.
 *
 * The card is deliberately quiet. Colour is spent on two things only: the
 * accent rail that marks it as a class, and the single action worth taking.
 * Everything else is typographic hierarchy, so the card reads in one glance
 * and never competes with the conversation around it.
 */

/** `…/classes/join/<token>` anywhere in a message. */
const INVITE_RE = /https?:\/\/\S*?\/classes\/join\/([A-Za-z0-9_-]{8,})/i;

/** Below this share of seats the count is worth drawing attention to. */
const SCARCE = 0.25;

export function findInviteLink(
  content: string,
): { url: string; token: string } | null {
  const match = content?.match(INVITE_RE);
  return match ? { url: match[0], token: match[1] } : null;
}

/**
 * How a message reads in a conversation list, where a 60-character URL
 * crowds out whatever the sender actually wrote.
 */
export function previewText(content: string): string {
  const invite = findInviteLink(content ?? "");
  if (!invite) return content ?? "";
  const rest = (content ?? "").replace(invite.url, "").trim();
  return rest ? `${rest} · Group class invitation` : "Group class invitation";
}

/** Per-viewer, per-message dismissal. Storage can throw, so never trust it. */
const dismissKey = (messageId: string) => `invite-dismissed:${messageId}`;

function readDismissed(messageId: string): boolean {
  try {
    return localStorage.getItem(dismissKey(messageId)) === "1";
  } catch {
    return false;
  }
}

function writeDismissed(messageId: string): void {
  try {
    localStorage.setItem(dismissKey(messageId), "1");
  } catch {
    /* private window or blocked storage — the card just returns next time */
  }
}

/** The bare link: shown while loading, and once the card is dismissed. */
function PlainLink({ url, muted }: { url: string; muted?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`underline break-all ${muted ? "opacity-70 hover:opacity-100" : ""}`}
    >
      {url}
    </a>
  );
}

/**
 * Seats as a bar rather than a sentence.
 *
 * "3 of 20" makes the reader do arithmetic to feel whether a class is filling
 * up; a bar shows it. It turns amber once seats are genuinely scarce, which is
 * the one moment the number should pull the eye.
 */
function SeatMeter({ left, total }: { left: number; total: number }) {
  const capacity = Math.max(total, 1);
  const taken = Math.min(Math.max(capacity - left, 0), capacity);
  const scarce = left > 0 && left / capacity <= SCARCE;
  const gone = left <= 0;

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="h-1.5 flex-1 rounded-full bg-muted overflow-hidden"
        role="img"
        aria-label={
          gone ? "No seats left" : `${left} of ${total} seats still available`
        }
      >
        <div
          className={`h-full rounded-full transition-[width] duration-500 ${
            gone
              ? "bg-muted-foreground/40"
              : scarce
                ? "bg-amber-500"
                : "bg-primary"
          }`}
          style={{ width: `${(taken / capacity) * 100}%` }}
        />
      </div>
      <span
        className={`text-[11px] font-semibold tabular-nums whitespace-nowrap ${
          gone
            ? "text-muted-foreground"
            : scarce
              ? "text-amber-600 dark:text-amber-500"
              : "text-muted-foreground"
        }`}
      >
        {gone ? "Full" : `${left} of ${total} left`}
      </span>
    </div>
  );
}

export default function GroupClassInvite({
  url,
  token,
  messageId,
}: {
  url: string;
  token: string;
  messageId: string;
}) {
  const [preview, setPreview] = useState<GroupClassPreview | null>(null);
  const [failed, setFailed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Read storage after mount: the server render has no localStorage, and
  // deciding during render would mismatch on hydration.
  useEffect(() => {
    setDismissed(readDismissed(messageId));
  }, [messageId]);

  useEffect(() => {
    let cancelled = false;
    getGroupClassInvite(token)
      .then((data) => {
        if (!cancelled) setPreview(data);
      })
      .catch(() => {
        // Deleted class, expired link, or a signed-out viewer: fall back to
        // the plain URL rather than showing a broken card.
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const dismiss = () => {
    writeDismissed(messageId);
    setDismissed(true);
  };

  if (dismissed || failed) {
    return <PlainLink url={url} muted={dismissed} />;
  }

  if (!preview) {
    return (
      <span className="inline-flex items-center gap-2 text-xs opacity-70">
        <Loader2 size={12} className="animate-spin shrink-0" />
        Loading invitation…
      </span>
    );
  }

  const soldOut = preview.seatsLeft <= 0;
  const unavailable = soldOut || !preview.open;
  const duration = formatDuration(preview.startTime, preview.endTime);

  return (
    <div className="mt-1.5 w-[19rem] max-w-full rounded-2xl bg-card text-foreground border border-border/70 shadow-sm overflow-hidden">
      {/* The only large block of colour: enough to mark the card, not enough
          to shout over the conversation. */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
        }}
      />

      <div className="p-3.5 flex flex-col gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-primary/80">
            Group class
          </p>
          <h4 className="mt-0.5 text-[15px] font-semibold leading-snug line-clamp-2">
            {preview.title}
          </h4>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3 text-[12px] text-muted-foreground">
            <span className="flex items-center gap-1.5 min-w-0">
              <CalendarDays size={13} className="shrink-0 opacity-70" />
              <span className="truncate">{formatWhen(preview.startTime)}</span>
            </span>
            {duration ? (
              <span className="flex items-center gap-1.5 shrink-0">
                <Clock3 size={13} className="opacity-70" />
                {duration}
              </span>
            ) : null}
          </div>

          <SeatMeter left={preview.seatsLeft} total={preview.maxStudents} />
        </div>

        <div className="flex items-baseline gap-1.5 border-t border-border/60 pt-3">
          <span className="text-xl font-bold tracking-tight tabular-nums">
            {formatMoney(preview.price, preview.currency)}
          </span>
          <span className="text-[11px] text-muted-foreground">per seat</span>
        </div>

        <div className="flex items-center gap-2">
          {unavailable ? (
            <span className="flex-1 text-center px-3 py-2.5 rounded-xl bg-muted text-xs font-semibold text-muted-foreground">
              {soldOut ? "No seats left" : "Closed"}
            </span>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white whitespace-nowrap shadow-sm transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
              }}
            >
              View &amp; join
              <ArrowUpRight size={14} />
            </a>
          )}
          {/* Quiet by design: dismissing is always available, never the thing
              the eye lands on first. */}
          <button
            onClick={dismiss}
            className="px-3 py-2.5 rounded-xl text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
