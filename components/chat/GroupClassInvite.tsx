"use client";

import React, { useEffect, useState } from "react";
import {
  CalendarClock,
  ExternalLink,
  Loader2,
  Users,
  X,
} from "lucide-react";
import { GroupClassPreview, getGroupClassInvite } from "@/services/classes";

/**
 * A group-class invite pasted into chat.
 *
 * The tutor shares a bare URL, which reads as noise in a message bubble. This
 * turns it into the offer itself — what the class is, when, what a seat costs
 * and how many are left — so the student can decide without leaving the chat.
 */

/** `…/classes/join/<token>` anywhere in a message. */
const INVITE_RE = /https?:\/\/\S*?\/classes\/join\/([A-Za-z0-9_-]{8,})/i;

export function findInviteLink(
  content: string,
): { url: string; token: string } | null {
  const match = content?.match(INVITE_RE);
  return match ? { url: match[0], token: match[1] } : null;
}

/**
 * How a message reads in a conversation list, where a 40-character URL
 * crowds out whatever the sender actually wrote.
 */
export function previewText(content: string): string {
  const invite = findInviteLink(content ?? '');
  if (!invite) return content ?? '';
  const rest = (content ?? '').replace(invite.url, '').trim();
  return rest ? `${rest} · Group class invitation` : 'Group class invitation';
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

/** The bare link, used before the card loads and after it is dismissed. */
function PlainLink({ url, muted }: { url: string; muted?: boolean }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={
        muted
          ? "underline break-all opacity-80 hover:opacity-100"
          : "underline break-all"
      }
    >
      {url}
    </a>
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
        // Deleted class, expired link, or a logged-out viewer: fall back to
        // the plain URL rather than showing a broken card.
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  if (dismissed || failed) {
    return <PlainLink url={url} muted={dismissed} />;
  }

  if (!preview) {
    return (
      <span className="inline-flex items-center gap-2">
        <Loader2 size={12} className="animate-spin shrink-0" />
        <PlainLink url={url} />
      </span>
    );
  }

  const soldOut = preview.seatsLeft <= 0;
  const unavailable = soldOut || !preview.open;

  return (
    <div className="mt-1 w-full max-w-sm rounded-xl border border-border bg-card text-foreground overflow-hidden shadow-sm">
      <div
        className="px-3.5 py-2.5 flex items-start justify-between gap-2"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.35 0.08 275) 0%, oklch(0.45 0.22 300) 100%)",
        }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
            Group class invitation
          </p>
          <p className="text-sm font-bold text-white truncate">
            {preview.title}
          </p>
        </div>
        <button
          onClick={() => {
            writeDismissed(messageId);
            setDismissed(true);
          }}
          aria-label="Dismiss this invitation"
          title="Dismiss"
          className="shrink-0 p-1 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <X size={13} />
        </button>
      </div>

      <div className="px-3.5 py-3 flex flex-col gap-2.5">
        <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <CalendarClock size={12} className="text-primary/70 shrink-0" />
            {new Date(preview.startTime).toLocaleString()}
          </span>
          <span className="flex items-center gap-1.5">
            <Users size={12} className="text-primary/70 shrink-0" />
            {soldOut
              ? "No seats left"
              : `${preview.seatsLeft} of ${preview.maxStudents} seats available`}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="text-base font-bold text-foreground">
            {preview.price.toLocaleString()}
          </span>
          <span className="text-[10px] text-muted-foreground">per seat</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              writeDismissed(messageId);
              setDismissed(true);
            }}
            className="flex-1 px-3 py-2 rounded-lg border border-border text-xs font-semibold text-muted-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          {unavailable ? (
            <span className="flex-1 text-center px-3 py-2 rounded-lg bg-muted text-xs font-semibold text-muted-foreground">
              {soldOut ? "Class full" : "Closed"}
            </span>
          ) : (
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-white whitespace-nowrap transition-all hover:opacity-90"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.7 0.15 210), oklch(0.45 0.22 300))",
              }}
            >
              <ExternalLink size={12} />
              View &amp; join
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
