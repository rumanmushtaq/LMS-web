"use client";

/**
 * Plays a tutor's intro video. Tutors either upload a file (ImageKit .mp4/.mov)
 * or paste a YouTube/Vimeo link at onboarding, so links become embeds and
 * everything else plays in a native <video>.
 */
export function videoEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\.|^m\./, "");
    if (host === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    if (host === "youtube.com" || host === "youtube-nocookie.com") {
      const id =
        u.searchParams.get("v") ||
        u.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/)?.[1];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = u.pathname.match(/^\/(\d+)/)?.[1];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com") return url;
  } catch {
    return null;
  }
  return null;
}

export default function IntroVideo({ url, title }: { url: string; title: string }) {
  const embed = videoEmbedUrl(url);
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16 / 9",
        borderRadius: 14,
        overflow: "hidden",
        background: "#0d1117",
      }}
    >
      {embed ? (
        <iframe
          src={embed}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
        />
      ) : (
        <video
          src={url}
          controls
          playsInline
          preload="metadata"
          aria-label={title}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }}
        />
      )}
    </div>
  );
}
