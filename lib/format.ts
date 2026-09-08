/**
 * Formatting shared by everything that presents a class as an offer.
 *
 * Kept in one place so the invite card in chat and the join page cannot drift
 * into showing the same class two different ways.
 */

/**
 * A price with its currency.
 *
 * `Intl` places the symbol where the locale expects and applies the right
 * number of decimals — zero-decimal currencies like COP must not render as
 * "COP 900.00".
 */
export function formatMoney(amount: number, currency?: string): string {
  if (!currency) return amount.toLocaleString();
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    }).format(amount);
  } catch {
    // An unknown currency code would throw and take the card down with it.
    return `${amount.toLocaleString()} ${currency}`;
  }
}

/** "Mon 15 Sep · 2:00 PM" — readable at a glance, no seconds, no ambiguity. */
export function formatWhen(value: string | Date): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const day = date.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  return `${day} · ${time}`;
}

/** "1 hr 30 min" — how long the session runs. */
export function formatDuration(from: string | Date, to: string | Date): string {
  const minutes = Math.round(
    (new Date(to).getTime() - new Date(from).getTime()) / 60000,
  );
  if (!Number.isFinite(minutes) || minutes <= 0) return "";
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest} min`;
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`;
}

/**
 * Time as a chat list shows it: the clock for today, the date before that.
 * A full timestamp on every row is noise when most rows are from today.
 */
export function formatShortTime(value?: string | Date): string {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const now = new Date();
  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();
  return sameDay
    ? date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
