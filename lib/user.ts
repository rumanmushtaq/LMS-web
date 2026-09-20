/**
 * Up to two initials from a display name.
 *
 * The auth store only carries `fullName`, so every avatar placeholder in the
 * app derives from it.
 */
export function initialsOf(fullName: string | null | undefined): string {
  const words = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}
