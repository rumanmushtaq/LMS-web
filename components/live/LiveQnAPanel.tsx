"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Send,
  MessageCircleQuestion,
  Circle,
  Smile,
  Paperclip,
  X,
  Loader2,
} from "lucide-react";
import EmojiPicker, { type EmojiClickData, Theme } from "emoji-picker-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { insertAtCaret, shouldSendOnKeyDown } from "@/lib/chat/composer";
import {
  type ChatAttachment,
  ACCEPTED_ATTACHMENT_EXTENSIONS,
  MAX_ATTACHMENT_BYTES,
  formatFileSize,
} from "@/lib/chat/attachment";
import MessageAttachment from "@/components/chat/MessageAttachment";
import chatService from "@/services/chat";
import { useThemeStore } from "@/store/theme";
import type { LiveMessage } from "@/hooks/useLiveClass";

interface LiveQnAPanelProps {
  messages: LiveMessage[];
  currentUserId?: string;
  /** Null until the class data loads; uploading is disabled while it is. */
  conversationId: string | null;
  isConnected: boolean;
  typingUser: string | null;
  onSend: (content: string, attachment?: ChatAttachment | null) => void;
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
  conversationId,
  isConnected,
  typingUser,
  onSend,
  onTyping,
  onStopTyping,
  title = "Live Q&A",
}: LiveQnAPanelProps) {
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<ChatAttachment | null>(null);
  const [uploadPercent, setUploadPercent] = useState<number | null>(null);
  const theme = useThemeStore((s) => s.theme);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typingUser, attachment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() && !attachment) return;
    onSend(draft, attachment);
    setDraft("");
    setAttachment(null);
    onStopTyping();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDraft(e.target.value);
    onTyping();
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(onStopTyping, 1500);
  };

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    const el = inputRef.current;
    const { value, caret } = insertAtCaret(
      draft,
      emoji.emoji,
      el?.selectionStart ?? null,
      el?.selectionEnd ?? null,
    );
    setDraft(value);
    // Without returning focus, the next Enter lands nowhere and sends nothing.
    requestAnimationFrame(() => {
      el?.focus();
      el?.setSelectionRange(caret, caret);
    });
  };

  const handleFilePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !conversationId) return;

    if (file.size > MAX_ATTACHMENT_BYTES) {
      toast.error(`"${file.name}" is larger than 25MB.`);
      return;
    }

    setUploadPercent(0);
    try {
      const uploaded = await chatService.uploadAttachment(file, conversationId, setUploadPercent);
      setAttachment(uploaded);
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: unknown } } })?.response?.data
        ?.message;
      toast.error(typeof message === "string" ? message : "That file could not be uploaded.");
    } finally {
      setUploadPercent(null);
    }
  };

  const canSend = (draft.trim().length > 0 || attachment !== null) && uploadPercent === null;

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
                    "px-3 py-2 rounded-2xl text-sm break-words space-y-2",
                    mine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm",
                    msg.pending && "opacity-60",
                  )}
                >
                  {msg.attachment && (
                    <MessageAttachment attachment={msg.attachment} mine={mine} />
                  )}
                  {msg.content && <p>{msg.content}</p>}
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
      <form onSubmit={handleSubmit} className="border-t border-border p-3 space-y-2">
        {(attachment || uploadPercent !== null) && (
          <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2 text-xs">
            {uploadPercent !== null ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
                <span className="flex-1 truncate">Uploading… {uploadPercent}%</span>
              </>
            ) : (
              <>
                <Paperclip className="w-3.5 h-3.5 shrink-0" />
                <span className="flex-1 truncate font-medium">{attachment!.name}</span>
                <span className="shrink-0 text-muted-foreground">
                  {formatFileSize(attachment!.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="shrink-0 rounded-md p-0.5 hover:bg-background"
                  aria-label="Remove attachment"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_ATTACHMENT_EXTENSIONS}
            onChange={handleFilePick}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadPercent !== null || !conversationId}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted disabled:opacity-40"
            aria-label="Attach a file"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted"
                aria-label="Add an emoji"
              >
                <Smile className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            {/* The panel is only 360px wide, so the picker is width-matched and
                anchored rather than left to overflow the column. */}
            <PopoverContent
              align="start"
              side="top"
              className="w-auto border-none p-0 shadow-none bg-transparent"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiSelect}
                lazyLoadEmojis
                width={300}
                height={360}
                theme={theme === "dark" ? Theme.DARK : Theme.LIGHT}
              />
            </PopoverContent>
          </Popover>

          <input
            ref={inputRef}
            value={draft}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (shouldSendOnKeyDown(e)) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask a question…"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground transition hover:opacity-90 disabled:opacity-40"
            aria-label="Send question"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
