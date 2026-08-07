"use client";

import React, { useEffect, useRef, useState } from "react";
import { Send, MessageCircleQuestion, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { LiveMessage } from "@/hooks/useLiveClass";

interface LiveQnAPanelProps {
  messages: LiveMessage[];
  currentUserId?: string;
  isConnected: boolean;
  typingUser: string | null;
  onSend: (content: string) => void;
  onTyping: () => void;
  onStopTyping: () => void;
  title?: string;
}

function senderName(msg: LiveMessage): string {
  const s = msg.senderId;
  if (s && typeof s === "object") {
    return [s.firstName, s.lastName].filter(Boolean).join(" ") || s.email || "User";
  }
  return "User";
}

function senderId(msg: LiveMessage): string {
  const s = msg.senderId;
  return typeof s === "object" ? s?._id ?? s?.id : s;
}

export default function LiveQnAPanel({
  messages,
  currentUserId,
  isConnected,
  typingUser,
  onSend,
  onTyping,
  onStopTyping,
  title = "Live Q&A",
}: LiveQnAPanelProps) {
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingUser]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onSend(draft);
    setDraft("");
    onStopTyping();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    onTyping();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(onStopTyping, 1500);
  };

  return (
    <div className="flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/40">
        <div className="flex items-center gap-2">
          <MessageCircleQuestion className="w-4 h-4 text-primary" />
          <span className="font-semibold text-sm text-foreground">{title}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 text-xs font-medium",
            isConnected ? "text-green-600" : "text-muted-foreground",
          )}
        >
          <Circle className={cn("w-2 h-2 fill-current", isConnected && "animate-pulse")} />
          {isConnected ? "Connected" : "Connecting…"}
        </span>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground gap-2 py-10">
            <MessageCircleQuestion className="w-8 h-8 opacity-40" />
            <p className="text-sm">No questions yet.</p>
            <p className="text-xs">Ask the instructor anything during the class.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const mine = senderId(msg) === currentUserId;
            return (
              <div
                key={msg._id}
                className={cn("flex flex-col max-w-[85%]", mine ? "ml-auto items-end" : "items-start")}
              >
                {!mine && (
                  <span className="text-[11px] font-medium text-muted-foreground mb-0.5 px-1">
                    {senderName(msg)}
                  </span>
                )}
                <div
                  className={cn(
                    "px-3 py-2 rounded-2xl text-sm break-words",
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm",
                    msg.pending && "opacity-60",
                  )}
                >
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
        {typingUser && (
          <div className="text-xs text-muted-foreground italic px-1">Someone is typing…</div>
        )}
      </div>

      {/* Composer */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-border">
        <input
          value={draft}
          onChange={handleChange}
          placeholder="Ask a question…"
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="submit"
          disabled={!draft.trim()}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition hover:opacity-90"
          aria-label="Send question"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
