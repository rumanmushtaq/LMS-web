/**
 * Project-wide date formatting. Calendar dates render as DD/MM/YYYY.
 *
 * Use `formatDate` for a plain date and `formatDateTime` when the time matters.
 * Both tolerate a Date, an ISO string, or a number, and return "—" for
 * anything unparseable so UI never shows "Invalid Date".
 */
function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value === null || value === undefined || value === "") return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** DD/MM/YYYY */
export function formatDate(
  value: Date | string | number | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "—";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** DD/MM/YYYY, HH:mm */
export function formatDateTime(
  value: Date | string | number | null | undefined,
): string {
  const d = toDate(value);
  if (!d) return "—";
  return `${formatDate(d)}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
