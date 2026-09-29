"use client";

import React from "react";
import { FileText, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  type ChatAttachment,
  formatFileSize,
  isImageAttachment,
} from "@/lib/chat/attachment";

/**
 * A file inside a message bubble: a thumbnail for images, a file card for
 * everything else. Kept standalone so the DM surfaces can adopt it later.
 */
export default function MessageAttachment({
  attachment,
  mine = false,
}: {
  attachment: ChatAttachment;
  mine?: boolean;
}) {
  if (isImageAttachment(attachment)) {
    return (
      <a
        href={attachment.url}
        target="_blank"
        rel="noopener noreferrer"
        className="block overflow-hidden rounded-xl"
      >
        {/* Not next/image: the host is user content on a CDN and the
            intrinsic size is unknown until it loads. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={attachment.url}
          alt={attachment.name}
          className="max-h-60 w-auto max-w-full object-cover"
        />
      </a>
    );
  }

  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noopener noreferrer"
      download={attachment.name}
      className={cn(
        "flex items-center gap-2.5 rounded-xl border px-3 py-2 transition",
        mine
          ? "border-primary-foreground/25 hover:bg-primary-foreground/10"
          : "border-border hover:bg-background",
      )}
    >
      <FileText className="w-5 h-5 shrink-0 opacity-80" />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{attachment.name}</span>
        <span className="block text-[11px] opacity-70">{formatFileSize(attachment.size)}</span>
      </span>
      <Download className="w-4 h-4 shrink-0 opacity-70" />
    </a>
  );
}
