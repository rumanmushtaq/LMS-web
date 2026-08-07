"use client";

import React from "react";

interface VimeoEmbedProps {
  embedUrl: string;
  title?: string;
}

/**
 * Renders a Vimeo live event player. `embedUrl` is
 * `https://vimeo.com/event/{eventId}/embed` returned by the backend.
 * Vimeo handles the HLS player, adaptive bitrate and buffering.
 */
export default function VimeoEmbed({ embedUrl, title = "Live class" }: VimeoEmbedProps) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-black aspect-video">
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
