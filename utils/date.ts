/**
 * Calendar-only dates (date of birth, etc.) must NOT round-trip through a
 * timezone-aware `Date`. A value like "1990-05-15" stored as UTC midnight
 * ("1990-05-15T00:00:00.000Z") and then read back with
 * `new Date(...).toLocaleDateString()` shifts back a day for any user behind
 * UTC (all of the Americas) — the classic "shows 14 May instead of 15 May"
 * bug. These helpers keep such values as a plain Y-M-D throughout.
 */

/** Any stored value (ISO or date-only) → the "YYYY-MM-DD" an <input type="date"> wants. */
export function toDateInputValue(value?: string | null): string {
  if (!value) return "";
  return value.split("T")[0];
}

/**
 * Format a calendar-only date for display with no timezone shift, by building
 * the Date from its parts (local midnight of that exact day).
 */
export function formatDateOnly(
  value?: string | null,
  opts: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "long",
    year: "numeric",
  },
  locale = "en-GB",
): string {
  if (!value) return "";
  const [y, m, d] = value.split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return "";
  return new Date(y, m - 1, d).toLocaleDateString(locale, opts);
}

/**
 * Age rendered for display, with its unit — "25 years", "1 year".
 *
 * A bare "25" next to a "Date of Birth" row reads as ambiguous; the unit is
 * what makes the field self-explanatory. Returns "" when there is no usable
 * dob so callers can fall back to their own placeholder.
 */
export function formatAge(value?: string | null): string {
  const years = ageFromDob(value);
  if (years == null) return "";
  return `${years} ${years === 1 ? "year" : "years"}`;
}

/** Whole years between a calendar dob and today — timezone-safe. */
export function ageFromDob(value?: string | null): number | null {
  if (!value) return null;
  const [y, m, d] = value.split("T")[0].split("-").map(Number);
  if (!y || !m || !d) return null;
  const now = new Date();
  let age = now.getFullYear() - y;
  const month = now.getMonth() + 1;
  const hadBirthday = month > m || (month === m && now.getDate() >= d);
  if (!hadBirthday) age -= 1;
  return age;
}
