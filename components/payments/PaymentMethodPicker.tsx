"use client";

import { useEffect, useState } from "react";
import { CreditCard, Landmark, Loader2, Wallet, Lock } from "lucide-react";
import paymentsService, { PaymentMethod } from "@/services/payments";
import { cn } from "@/lib/utils";

/** Icon per known provider, with a neutral fallback for anything new. */
function methodIcon(id: string) {
  if (id === "stripe") return CreditCard;
  if (id === "pse") return Landmark;
  return Wallet;
}

interface Props {
  /** Currently selected method id, or null when none is chosen. */
  value: string | null;
  onChange: (methodId: string) => void;
  /** Rendered under the chosen method — e.g. the card form. */
  children?: React.ReactNode;
}

/**
 * Buyer-facing payment method chooser.
 *
 * Methods that are not ready are shown and clearly labelled rather than
 * omitted. Hiding them left the payment step looking empty and broken while
 * it was simply incomplete — and it gave no way to see the intended flow
 * before credentials existed.
 *
 * Selecting an unready method is allowed so the buyer gets an explanation
 * instead of an inert row, but it never becomes a payable selection: the
 * parent only enables its submit for `status === "available"`, and the API
 * refuses an unconfigured provider regardless.
 */
export function PaymentMethodPicker({ value, onChange, children }: Props) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    paymentsService
      .getMethods()
      .then((list) => {
        if (cancelled) return;
        setMethods(list);
        // Preselect the first usable method so the common case is one click.
        const firstUsable = list.find((m) => m.status === "available");
        if (firstUsable && !value) onChange(firstUsable.id);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load payment methods.");
      })
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
    // Runs once: re-fetching on every selection would reset the list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading payment methods…
      </div>
    );
  }

  if (error) {
    return (
      <p className="py-4 text-sm text-destructive">{error}</p>
    );
  }

  if (methods.length === 0) {
    return (
      <p className="py-4 text-sm text-muted-foreground">
        No payment methods are configured yet.
      </p>
    );
  }

  const selected = methods.find((m) => m.id === value);

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
        Payment method
      </p>

      <div className="space-y-2">
        {methods.map((method) => {
          const Icon = methodIcon(method.id);
          const isSelected = method.id === value;
          const isReady = method.status === "available";

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange(method.id)}
              aria-pressed={isSelected}
              className={cn(
                "w-full flex items-center gap-3 rounded-xl border p-4 text-left transition-all",
                isSelected
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : "border-border hover:border-primary/40 hover:bg-muted",
                !isReady && "opacity-70",
              )}
            >
              {/* Radio */}
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                  isSelected ? "border-primary" : "border-border",
                )}
              >
                {isSelected && (
                  <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                )}
              </span>

              <Icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  isSelected ? "text-primary" : "text-muted-foreground",
                )}
              />

              <span className="flex-1 min-w-0">
                <span className="block text-sm font-semibold text-foreground truncate">
                  {method.displayName}
                </span>
              </span>

              {!isReady && method.note && (
                <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-muted-foreground">
                  {method.note}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Panel for the chosen method */}
      {selected && (
        <div className="pt-2">
          {selected.status === "available" ? (
            children
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-muted/40 p-6 text-center">
              <Lock className="mx-auto mb-3 h-6 w-6 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                {selected.displayName} isn&apos;t available yet
              </p>
              <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-muted-foreground">
                {selected.status === "coming_soon"
                  ? "We're finishing this integration. Please choose another method to complete your order."
                  : selected.note}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PaymentMethodPicker;
