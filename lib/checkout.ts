/**
 * Shared plumbing for "Pay" buttons.
 *
 * Every checkout attempt carries one Idempotency-Key, repeated on retries of
 * that attempt. The API answers a repeat with the payment the first request
 * created, so a double-click, a flaky network retry or a second tab can never
 * open a second charge. A new attempt (after a failure) gets a new key.
 */

/** What every checkout endpoint returns. */
export type PaymentInstruction =
  | { kind: "client_secret"; clientSecret: string; publishableKey?: string }
  | { kind: "redirect"; redirectUrl: string };

export interface PendingPayment {
  paymentId: string;
  provider: string;
  currency: string;
  instruction: PaymentInstruction;
  orderId?: string;
}

export function newIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Older browsers: still unique enough for one buyer's attempts.
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

/** Axios config that sends the key. */
export const withIdempotencyKey = (key: string) => ({
  headers: { "Idempotency-Key": key },
});

/**
 * 409 = the first request with this key is still starting the payment. The
 * attempt is alive, so keep the key and let the buyer wait, rather than
 * treating it as a failure.
 */
export const isCheckoutInProgress = (err: any) =>
  err?.response?.status === 409 &&
  /already being started/i.test(String(err?.response?.data?.message ?? ""));

/** Buyer-facing text for a failed "Pay". */
export function checkoutErrorMessage(err: any, fallback: string): string {
  if (isCheckoutInProgress(err)) {
    return "Your payment is already being prepared — give it a moment.";
  }
  const m = err?.response?.data?.message;
  if (Array.isArray(m)) return m.join(" · ");
  return m || fallback;
}

/** Same list as the API's money.ts: these currencies have no minor unit. */
const ZERO_DECIMAL = new Set(["COP", "CLP", "JPY", "KRW", "VND", "PYG", "XAF", "XOF"]);

/** Ledger amounts are integer minor units; turn one back into major units. */
export const minorToMajor = (minor: number, currency: string) =>
  ZERO_DECIMAL.has(currency.toUpperCase()) ? minor : minor / 100;

/**
 * Where a buyer comes back to after leaving to confirm a card (3-D Secure):
 * the payment-return page, which shows how it went.
 */
export const paymentReturnUrl = (paymentId: string) =>
  `${typeof window !== "undefined" ? window.location.origin : ""}/payment/return?paymentId=${paymentId}`;
