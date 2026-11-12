"use client";

import { useCallback, useRef } from "react";
import { newIdempotencyKey } from "@/lib/checkout";

/**
 * One Idempotency-Key per checkout attempt.
 *
 * `key()` returns the same value until `renew()` — call that when an attempt
 * has really ended (it failed, or the buyer changed what they are paying
 * for), so the next "Pay" starts a fresh payment.
 */
export function useCheckoutAttempt() {
  const ref = useRef<string>(newIdempotencyKey());
  const key = useCallback(() => ref.current, []);
  const renew = useCallback(() => {
    ref.current = newIdempotencyKey();
  }, []);
  return { key, renew };
}
