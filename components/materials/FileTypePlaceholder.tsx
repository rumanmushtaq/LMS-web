import { BookOpen, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Cover-image fallback for material cards: shows the actual file type
 * (PDF, DOC, …) read from the uploaded file's extension instead of a
 * generic book glyph, so tutors can tell documents apart at a glance.
 */

const FILE_KINDS: Record<string, { label: string; color: string }> = {
  pdf: { label: "PDF", color: "text-red-500" },
  doc: { label: "DOC", color: "text-blue-500" },
  docx: { label: "DOC", color: "text-blue-500" },
  ppt: { label: "PPT", color: "text-orange-500" },
  pptx: { label: "PPT", color: "text-orange-500" },
  xls: { label: "XLS", color: "text-emerald-600" },
  xlsx: { label: "XLS", color: "text-emerald-600" },
  csv: { label: "CSV", color: "text-emerald-600" },
  zip: { label: "ZIP", color: "text-amber-500" },
  rar: { label: "RAR", color: "text-amber-500" },
  epub: { label: "EPUB", color: "text-purple-500" },
  txt: { label: "TXT", color: "text-slate-500" },
};

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "webp", "gif", "avif", "bmp", "svg"]);

/** Extension of a storage URL, ignoring any query/hash. */
function extOf(url?: string | null): string {
  if (!url) return "";
  return url.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase() ?? "";
}

/** True when the URL points at an image we can render directly as a preview. */
export function isImageUrl(url?: string | null): boolean {
  return IMAGE_EXTS.has(extOf(url));
}

export function fileKind(fileUrl?: string | null) {
  return FILE_KINDS[extOf(fileUrl)] ?? null;
}

export function FileTypePlaceholder({
  fileUrl,
  className,
  iconClassName = "w-8 h-8",
}: {
  fileUrl?: string | null;
  className?: string;
  iconClassName?: string;
}) {
  const kind = fileKind(fileUrl);

  if (!kind) {
    return (
      <div className={cn("flex items-center justify-center text-muted-foreground/30", className)}>
        <BookOpen className={iconClassName} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center justify-center gap-1.5", className)}>
      <FileText className={cn(iconClassName, kind.color, "opacity-70")} />
      <span className={cn("text-[10px] font-extrabold tracking-widest uppercase", kind.color)}>
        {kind.label}
      </span>
    </div>
  );
}
