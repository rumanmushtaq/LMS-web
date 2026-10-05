"use client";

import { useMemo, useState } from "react";
import { loadStripe, Stripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Loader2 } from "lucide-react";

interface Props {
  clientSecret: string;
  publishableKey: string;
  returnUrl: string;
  /** Called once the intent is confirmed and now succeeded or processing. */
  onProcessing: () => void;
}

/** Cache one Stripe instance per publishable key. */
const stripeCache = new Map<string, Promise<Stripe | null>>();
function stripeFor(key: string) {
  if (!stripeCache.has(key)) stripeCache.set(key, loadStripe(key));
  return stripeCache.get(key)!;
}

function CardInner({
  returnUrl,
  onProcessing,
}: {
  returnUrl: string;
  onProcessing: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePay() {
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: { return_url: returnUrl },
    });

    if (error) {
      setError(error.message || "Payment could not be completed.");
      setSubmitting(false);
      return;
    }

    if (
      paymentIntent &&
      ["succeeded", "processing"].includes(paymentIntent.status)
    ) {
      onProcessing();
    }
    setSubmitting(false);
  }

  return (
    <div className="space-y-4">
      <PaymentElement />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="button"
        onClick={handlePay}
        disabled={!stripe || submitting}
        className="w-full bg-primary text-white h-12 rounded-xl font-bold flex items-center justify-center disabled:opacity-50"
      >
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Pay now"}
      </button>
    </div>
  );
}

export default function StripeCardForm({
  clientSecret,
  publishableKey,
  returnUrl,
  onProcessing,
}: Props) {
  const stripePromise = useMemo(
    () => stripeFor(publishableKey),
    [publishableKey],
  );
  return (
    <Elements
      stripe={stripePromise}
      options={{ clientSecret, appearance: { theme: "stripe" } }}
    >
      <CardInner returnUrl={returnUrl} onProcessing={onProcessing} />
    </Elements>
  );
}
