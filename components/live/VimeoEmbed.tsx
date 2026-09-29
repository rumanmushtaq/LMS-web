"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface VimeoEmbedProps {
  embedUrl: string;
  title?: string;
  /** Lets a fixed-height layout override the default 16:9 box. */
  className?: string;
}

/**
 * Renders a Vimeo live event player. `embedUrl` is
 * `https://vimeo.com/event/{eventId}/embed` returned by the backend.
 * Vimeo handles the HLS player, adaptive bitrate and buffering.
 */
export default function VimeoEmbed({
  embedUrl,
  title = "Live class",
  className,
}: VimeoEmbedProps) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-2xl bg-black aspect-video",
        className,
      )}
    >
      <iframe
        src={embedUrl}
        title={title}
        className="absolute inset-0 w-full h-full"
        frameBorder={0}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
