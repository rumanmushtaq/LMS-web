"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, Lock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaymentMethodPicker from "@/components/payments/PaymentMethodPicker";
import StripeCardForm from "@/components/payments/StripeCardForm";
import { useCheckoutAttempt } from "@/hooks/useCheckoutAttempt";
import {
  checkoutErrorMessage,
  isCheckoutInProgress,
  PendingPayment,
  paymentReturnUrl,
} from "@/lib/checkout";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  /** Shown under the title, e.g. the price. */
  description?: string;
  /** Starts the payment. Must send `idempotencyKey` as the Idempotency-Key. */
  start: (paymentMethod: string, idempotencyKey: string) => Promise<PendingPayment>;
  /** Told what happens next once the payment is on its way. */
  doneText: string;
}

type Step = "method" | "card" | "done";

/**
 * Checkout for a single item: pick a method, then card details in-page or a
 * hand-off to the bank, then "we got it".
 *
 * One checkout attempt = one Idempotency-Key, so however often "Continue" is
 * pressed (double-click, retry after a timeout) the API answers with the same
 * payment. The key is renewed only when an attempt truly fails.
 */
export default function CheckoutDialog({
  open,
  onOpenChange,
  title,
  description,
  start,
  doneText,
}: Props) {
  // Stable callbacks: safe in effect deps.
  const { key, renew } = useCheckoutAttempt();
  const [method, setMethod] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("method");
  const [pending, setPending] = useState<PendingPayment | null>(null);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State lags a render behind; a ref blocks a second click in the same tick.
  const inFlight = useRef(false);

  // Every time the dialog opens it is a new purchase.
  useEffect(() => {
    if (!open) return;
    renew();
    setStep("method");
    setPending(null);
    setError(null);
  }, [open, renew]);

  async function handleContinue() {
    if (!method || inFlight.current) return;
    inFlight.current = true;
    setStarting(true);
    setError(null);
    try {
      const payment = await start(method, key());
      if (payment.instruction.kind === "redirect") {
        // Leaving for the bank is the expected outcome.
        window.location.href = payment.instruction.redirectUrl;
        return;
      }
      setPending(payment);
      setStep("card");
    } catch (err) {
      setError(checkoutErrorMessage(err, "We couldn't start your payment."));
      // Still being started under this key: keep it, so trying again joins
      // that same payment instead of opening another.
      if (!isCheckoutInProgress(err)) renew();
    } finally {
      inFlight.current = false;
      setStarting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !starting && onOpenChange(next)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{step === "done" ? "Payment received" : title}</DialogTitle>
          {description && step !== "done" && (
            <DialogDescription>{description}</DialogDescription>
          )}
        </DialogHeader>

        {step === "method" && (
          <div className="space-y-4">
            <PaymentMethodPicker value={method} onChange={setMethod} />

            {error && (
              <p
                role="alert"
                className="rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive"
              >
                {error}
              </p>
            )}

            <button
              type="button"
              onClick={handleContinue}
              disabled={!method || starting}
              aria-busy={starting}
              className="w-full h-11 rounded-xl bg-primary text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:bg-primary/90 transition-colors"
            >
              {starting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Preparing payment…
                </>
              ) : (
                "Continue to payment"
              )}
            </button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" /> You are only charged once, even if
              you click twice.
            </p>
          </div>
        )}

        {step === "card" &&
          pending?.instruction.kind === "client_secret" && (
            <StripeCardForm
              clientSecret={pending.instruction.clientSecret}
              publishableKey={pending.instruction.publishableKey || ""}
              returnUrl={paymentReturnUrl(pending.paymentId)}
              onProcessing={() => setStep("done")}
            />
          )}

        {step === "done" && (
          <div className="text-center py-2">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground mb-5">{doneText}</p>
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="w-full h-11 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Done
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
